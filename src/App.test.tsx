import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders tailwind text', () => {
    render(<App />);
    const textElement = screen.getByText(/Tailwind CSS!/i);
    expect(textElement).toBeInTheDocument();
});
