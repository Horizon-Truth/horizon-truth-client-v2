import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { TrustMeter } from './TrustMeter';

describe('TrustMeter', () => {
    test('renders with the correct score percentage', () => {
        render(<TrustMeter score={75} />);
        expect(screen.getByText('75%')).toBeInTheDocument();
    });

    test('renders high trust label for score > 70', () => {
        render(<TrustMeter score={85} />);
        expect(screen.getByText(/High Trust/i)).toBeInTheDocument();
    });

    test('renders dangerous label for score < 30', () => {
        render(<TrustMeter score={20} />);
        expect(screen.getByText(/Dangerous/i)).toBeInTheDocument();
    });

    test('renders neutral label for score between 30 and 70', () => {
        render(<TrustMeter score={50} />);
        expect(screen.getByText(/Neutral/i)).toBeInTheDocument();
    });
});
