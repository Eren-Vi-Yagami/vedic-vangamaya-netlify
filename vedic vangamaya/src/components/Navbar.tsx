/**
 * Navbar Component for Vaidika Vangamaya
 * 
 * The primary navigation component that provides consistent access to
 * all major sections of the application. Features a modern glassmorphic
 * design that complements the overall aesthetic while maintaining
 * excellent usability and accessibility.
 * 
 * Key Features:
 * - Sticky positioning that responds to scroll events
 * - Glassmorphic design with backdrop blur effects
 * - Mobile-first responsive design with slide-down menu
 * - Keyboard accessible navigation with proper ARIA labels
 * - Dynamic styling based on scroll position and current route
 * - Smooth transitions for enhanced user experience
 * 
 * Design Philosophy:
 * - Timeless, scholarly appearance that reflects the content's nature
 * - Contemplative color scheme that doesn't distract from reading
 * - Minimalist approach that prioritizes content over chrome
 * - Accessible contrast ratios for all text elements
 * 
 * @component
 * @module Navbar
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


/**
 * Navbar Component Implementation
 * 
 * Provides the main navigation interface for the application with
 * responsive design and accessibility features. Manages scroll-based
 * styling changes and mobile menu state.
 * 
 * @returns {JSX.Element} The rendered navigation component
 */
const Navbar = () => {
    // State management for mobile menu visibility
    const [isOpen, setIsOpen] = useState(false);

    // State management for scroll-based styling changes
    const [isScrolled, setIsScrolled] = useState(false);

    // Get current pathname for active link highlighting
    const pathname = usePathname();

    /**
     * Scroll Event Handler
     * 
     * Monitors window scroll position to apply different styling
     * when the user has scrolled down the page. Creates a more
     * prominent navigation bar for better visibility.
     */
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /**
     * Route Change Handler
     * 
     * Automatically closes the mobile menu when navigation occurs.
     * Ensures the mobile menu doesn't remain open after selecting a link.
     */
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    /**
     * Navigation Items
     * 
     * Defines the main navigation structure with labels and paths.
     * Organized to provide logical grouping of application features.
     */
    const navItems = [
        { label: "Home", href: "/", description: "Return to the main page" },
        { label: "Library", href: "/library", description: "Browse our collection" },
        { label: "About", href: "/about", description: "Learn about our mission" },
        { label: "Contact", href: "/contact", description: "Get in touch with us" }
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled
                    ? "bg-background/80 backdrop-blur-md border-veda-muted/20 shadow-sm"
                    : "bg-transparent border-transparent"
                }`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-30 pl-1">

                    {/* 
                        ====================================================================
                        BRAND / LOGO SECTION
                        ====================================================================
                        Contains the application branding and home link with actual logos
                    */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-veda-accent rounded-md"
                            aria-label="Vaidika Vangamaya Home"
                        >
                            <Link href="/" aria-label="Go to home">
                                <Image
                                    src={"/images/lib_logo.png"}
                                    alt="Vaidika Vangamaya Library Logo"
                                    width={80}
                                    height={80}
                                    className="object-contain cursor-pointer"
                                    priority
                                />
                            </Link>
                            <span className="text-5xl font-semibold text-veda-primary group-hover:text-veda-accent transition-colors">
                                Vaidika Vangamaya
                            </span>
                        </Link>
                    </div>

                    {/* 
                        ====================================================================
                        DESKTOP NAVIGATION
                        ====================================================================
                        Horizontal navigation menu for larger screens
                    */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-veda-accent focus:outline-none focus:ring-2 focus:ring-veda-accent rounded-md px-2 py-1 ${pathname === item.href
                                        ? "text-veda-accent"
                                        : "text-veda-muted hover:text-veda-primary"
                                    }`}
                                aria-current={pathname === item.href ? "page" : undefined}
                                title={item.description}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* 
                        ====================================================================
                        MOBILE MENU TOGGLE
                        ====================================================================
                        Hamburger button for mobile navigation
                    */}
                    <button
                        className="md:hidden p-2 rounded-md text-veda-muted hover:text-veda-primary hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-veda-accent"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation menu"
                        aria-controls="mobile-menu"
                    >
                        <div className="w-6 h-6 flex flex-col justify-center items-center">
                            <span
                                className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""
                                    }`}
                            />
                            <span
                                className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? "opacity-0" : ""
                                    }`}
                            />
                            <span
                                className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""
                                    }`}
                            />
                        </div>
                    </button>
                </div>

                {/* 
                    ====================================================================
                    MOBILE NAVIGATION MENU
                    ====================================================================
                    Slide-down menu for mobile devices
                */}
                <div
                    id="mobile-menu"
                    className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-veda-accent ${pathname === item.href
                                        ? "text-veda-accent bg-white/10"
                                        : "text-veda-muted hover:text-veda-primary"
                                    }`}
                                aria-current={pathname === item.href ? "page" : undefined}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
