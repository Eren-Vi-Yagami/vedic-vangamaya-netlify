/**
 * StatCard Component for Vaidika Vangamaya
 * 
 * A clean, minimalist component for displaying statistical information
 * with emphasis on the numerical value. Used throughout the application
 * to showcase key metrics and achievements.
 * 
 * Features:
 * - Large, bold numerical display for immediate impact
 * - Subtle label text with proper typography hierarchy
 * - Responsive design that scales appropriately
 * - Accessible color contrast for readability
 * 
 * @component
 * @module StatCard
 */

import React from 'react';

/**
 * StatCard Props Interface
 * 
 * Defines the data structure for statistical display cards.
 * Supports both string and numeric values for flexibility.
 */
interface StatCardProps {
    /**
     * The numerical value or statistic to display
     * Can be a number (10, 1000) or formatted string ("10k+", "99%")
     * Displayed in large, bold typography for visual impact
     */
    value: string | number;
    
    /**
     * Descriptive label for the statistic
     * Should be concise and clearly identify what the value represents
     * Displayed in smaller, uppercase text below the value
     */
    label: string;
}

/**
 * StatCard Component
 * 
 * Renders a statistical display card with a large value and descriptive label.
 * Designed for maximum visual impact while maintaining readability.
 * Uses consistent styling that complements the overall application theme.
 * 
 * @param {StatCardProps} props - Component properties
 * @returns {JSX.Element} The rendered stat card
 */
export default function StatCard({ value, label }: StatCardProps) {
    return (
        <div className="text-center group hover:scale-105 transition-transform duration-300">
            <p className="text-4xl font-extrabold text-primary-600 group-hover:text-veda-accent transition-colors">
                {value}
            </p>
            <p className="text-sm text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                {label}
            </p>
        </div>
    );
}