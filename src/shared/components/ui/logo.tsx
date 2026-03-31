import React from 'react';
import { useTheme } from '../theme-provider';
import logoOnlyLight from '@/assets/logos/logo-only-light.png';
import logoOnlyDark from '@/assets/logos/logo-only-dark.png';
import logoTextBottomLight from '@/assets/logos/logo-text-bottom-light.png';
import logoTextBottomDark from '@/assets/logos/logo-text-bottom-dark.png';
import logoTextRightLight from '@/assets/logos/logo-text-right-light.png';
import logoTextRightDark from '@/assets/logos/logo-text-right-dark.png';

interface LogoProps {
    variant?: 'only' | 'bottom' | 'right';
    className?: string;
    alt?: string;
    onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
    variant = 'only', 
    className = 'h-10 w-auto', 
    alt = 'Horizon Truth Logo',
    onClick 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    let src;

    switch (variant) {
        case 'bottom':
            src = isDark ? logoTextBottomDark : logoTextBottomLight;
            break;
        case 'right':
            src = isDark ? logoTextRightDark : logoTextRightLight;
            break;
        case 'only':
        default:
            src = isDark ? logoOnlyDark : logoOnlyLight;
            break;
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={className}
            onClick={onClick}
        />
    );
};
