import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingPage from './OnboardingPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks and services
vi.mock('../services/onboarding.service', () => ({
    onboardingService: {
        getAvatars: vi.fn(),
        initializeProfile: vi.fn(),
    },
}));

vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual('@tanstack/react-query') as any;
    return {
        ...actual,
        useQuery: vi.fn().mockReturnValue({
            data: [{ id: 'a1', name: 'Avatar 1', imageUrl: 'url', ageGroup: 'YOUTH' }],
            isLoading: false,
        }),
        useMutation: vi.fn().mockReturnValue({
            mutate: vi.fn(),
            isLoading: false,
        }),
    };
});

vi.mock('../../../store/auth.store', () => ({
    useAuthStore: () => ({
        updateUser: vi.fn(),
    }),
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderComponent = () =>
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <OnboardingPage />
            </BrowserRouter>
        </QueryClientProvider>
    );

describe('OnboardingPage', () => {
    it('renders the onboarding title', () => {
        renderComponent();
        expect(screen.getByText(/Initialize Identity/i)).toBeDefined();
        expect(screen.getByPlaceholderText(/Enter your alias.../i)).toBeDefined();
    });

    it('disables the submit button initially', () => {
        renderComponent();
        const button = screen.getByRole('button', { name: /Enter The Digital World/i });
        expect(button).toBeDisabled();
    });

    it('updates nickname input', () => {
        renderComponent();
        const input = screen.getByPlaceholderText(/Enter your alias.../i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Skywalker' } });
        expect(input.value).toBe('Skywalker');
    });

    // More complex interaction tests would require mocking useQuery return values
    // but this covers the basic rendering and initial state as planned.
});
