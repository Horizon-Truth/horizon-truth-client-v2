import { useState, useEffect, useCallback } from 'react';

interface DeviceState {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isLowEndDevice: boolean;
    prefersReducedMotion: boolean;
    width: number;
    height: number;
}

export const useDevice = (): DeviceState => {
    const [state, setState] = useState<DeviceState>({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLowEndDevice: false,
        prefersReducedMotion: false,
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    const updateDevice = useCallback(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Breakpoints
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;
        const isDesktop = width >= 1024;

        // Low-end device detection (heuristic)
        // navigator.deviceMemory is available in Chrome/Edge (returns GB of RAM)
        // navigator.hardwareConcurrency returns number of logical processors
        const memory = (navigator as any).deviceMemory || 8;
        const cpuCores = navigator.hardwareConcurrency || 4;
        const isLowEndDevice = memory <= 4 || cpuCores <= 2;

        // Reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        setState({
            isMobile,
            isTablet,
            isDesktop,
            isLowEndDevice,
            prefersReducedMotion,
            width,
            height,
        });

        // Update CSS variable for viewport height (addressing mobile browser chrome issue)
        document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    }, []);

    useEffect(() => {
        updateDevice();

        let timeoutId: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateDevice, 150); // Throttled update
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateDevice]);

    return state;
};
