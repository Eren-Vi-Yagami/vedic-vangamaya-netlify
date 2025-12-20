/**
 * Button Component for Vaidika Vangamaya
 * 
 * A reusable button component that provides consistent styling
 * across the application with support for different variants.
 * 
 * Features:
 * - Two variants: primary (saffron accent) and secondary (neutral)
 * - Smooth hover transitions for better UX
 * - Accessible button attributes
 * - TypeScript support with proper typing
 * 
 * @component
 * @example
 * // Primary button (default)
 * <Button>Read More</Button>
 * 
 * // Secondary button
 * <Button variant="secondary">Cancel</Button>
 * 
 * // With custom class
 * <Button className="mt-4">Custom Styled</Button>
 */

import * as React from 'react';

/**
 * Button Props Interface
 * 
 * Extends standard HTML button attributes while adding
 * our custom variant system.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual style variant of the button
     * - primary: Saffron accent color for main actions
     * - secondary: Neutral gray for secondary actions
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary';
    
    /**
     * Additional CSS classes to apply
     */
    className?: string;
}

/**
 * Button Component Implementation
 * 
 * Uses React.forwardRef to properly handle ref forwarding,
 * making it compatible with form libraries and accessibility tools.
 */
// export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//     ({ 
//         variant = 'primary', 
//         className, 
//         children, 
//         ...props 
//     }, ref) => {
        
//         /**
//          * Base styles applied to all buttons
//          * Provides consistent padding, rounded corners, and transitions
//          */
//         const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
        
//         /**
//          * Variant-specific styles
//          * Each variant has its own color scheme and hover states
//          */
//         const variantStyles = {
//             primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
//             secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
//         };
        
//         /**
//          * Combine all styles using our cn utility
//          * This allows for proper merging of Tailwind classes
//          */
//         const buttonClasses = cn(
//             baseStyles,
//             variantStyles[variant],
//             className
//         );
        
//         return (
//             <button
//                 ref={ref}
//                 className={buttonClasses}
//                 {...props}
//             >
//                 {children}
//             </button>
//         );
//     },
// );

// // Set display name for debugging and development tools
// Button.displayName = 'Button';
