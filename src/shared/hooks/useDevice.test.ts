import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDevice } from './useDevice';

/** jsdom reports 1024x768 by default; drive the breakpoints explicitly. */
const setViewport = (width: number, height = 800) => {
    Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
};

const setHardware = (memory: number | undefined, cores: number | undefined) => {
    Object.defineProperty(navigator, 'deviceMemory', { value: memory, configurable: true });
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: cores, configurable: true });
};

const setReducedMotion = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: (query: string) => ({
            matches,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }),
    });
};

beforeEach(() => {
    setViewport(1280, 800);
    setHardware(8, 8);
    setReducedMotion(false);
});

afterEach(() => {
    vi.useRealTimers();
});

describe('useDevice breakpoints', () => {
    it('classifies a narrow viewport as mobile', () => {
        setViewport(500);

        const { result } = renderHook(() => useDevice());

        expect(result.current).toMatchObject({
            isMobile: true,
            isTablet: false,
            isDesktop: false,
        });
    });

    it('classifies the 768–1023 band as tablet', () => {
        setViewport(800);

        const { result } = renderHook(() => useDevice());

        expect(result.current).toMatchObject({
            isMobile: false,
            isTablet: true,
            isDesktop: false,
        });
    });

    it('classifies 1024 and above as desktop', () => {
        setViewport(1024);

        const { result } = renderHook(() => useDevice());

        expect(result.current).toMatchObject({
            isMobile: false,
            isTablet: false,
            isDesktop: true,
        });
    });

    it('reports the measured width and height', () => {
        setViewport(1440, 900);

        const { result } = renderHook(() => useDevice());

        expect(result.current.width).toBe(1440);
        expect(result.current.height).toBe(900);
    });
});

describe('useDevice capability heuristics', () => {
    it('flags a low-memory device', () => {
        setHardware(2, 8);

        const { result } = renderHook(() => useDevice());

        expect(result.current.isLowEndDevice).toBe(true);
    });

    it('flags a low-core device', () => {
        setHardware(8, 2);

        const { result } = renderHook(() => useDevice());

        expect(result.current.isLowEndDevice).toBe(true);
    });

    it('treats a capable device as high-end', () => {
        setHardware(8, 8);

        const { result } = renderHook(() => useDevice());

        expect(result.current.isLowEndDevice).toBe(false);
    });

    it('assumes a capable device when the browser exposes no hints', () => {
        setHardware(undefined, undefined);

        const { result } = renderHook(() => useDevice());

        // Defaults are 8GB / 4 cores, which is above both thresholds.
        expect(result.current.isLowEndDevice).toBe(false);
    });

    it('picks up the reduced-motion preference', () => {
        setReducedMotion(true);

        const { result } = renderHook(() => useDevice());

        expect(result.current.prefersReducedMotion).toBe(true);
    });
});

describe('useDevice viewport side effects', () => {
    it('publishes the --vh custom property for mobile browser chrome', () => {
        setViewport(500, 640);

        renderHook(() => useDevice());

        expect(document.documentElement.style.getPropertyValue('--vh')).toBe('6.4px');
    });

    it('re-measures on resize, throttled', () => {
        vi.useFakeTimers();
        setViewport(1280);

        const { result } = renderHook(() => useDevice());
        expect(result.current.isDesktop).toBe(true);

        act(() => {
            setViewport(500);
            window.dispatchEvent(new Event('resize'));
            vi.advanceTimersByTime(200);
        });

        expect(result.current.isMobile).toBe(true);
    });

    it('ignores resize noise until the throttle window elapses', () => {
        vi.useFakeTimers();
        setViewport(1280);

        const { result } = renderHook(() => useDevice());

        act(() => {
            setViewport(500);
            window.dispatchEvent(new Event('resize'));
            vi.advanceTimersByTime(100); // still inside the 150ms window
        });

        expect(result.current.isDesktop).toBe(true);
    });

    it('detaches its resize listener on unmount', () => {
        const remove = vi.spyOn(window, 'removeEventListener');

        const { unmount } = renderHook(() => useDevice());
        unmount();

        expect(remove).toHaveBeenCalledWith('resize', expect.any(Function));
    });
});
