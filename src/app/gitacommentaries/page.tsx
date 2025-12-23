/**
 * GitaCommentariesIndex - Landing Page Redirect Handler
 * 
 * This page handles direct navigation to /gitacommentaries by redirecting
 * users to the first verse of the first chapter (/gitacommentaries/1/1).
 * 
 * ============================================================================
 * WHY THIS REDIRECT EXISTS
 * ============================================================================
 * 
 * **URL Consistency**: All Gita commentary pages follow the pattern
 * /gitacommentaries/[chapter]/[verse]. Having the base URL redirect to
 * /1/1 ensures users always see a valid verse, not an empty state.
 * 
 * **SEO-Friendly**: Search engines can still index /gitacommentaries,
 * and users who share or bookmark this URL will land on meaningful content.
 * 
 * **User Experience**: Rather than showing a "select a verse" message,
 * we immediately show the beginning of the Gita, encouraging engagement.
 * 
 * ============================================================================
 * LOADING STATE
 * ============================================================================
 * The redirect happens quickly via useEffect, but we show a loading spinner
 * for the brief moment between render and redirect. This prevents a flash
 * of empty content and indicates to users that something is happening.
 * 
 * The golden (#FFC226) spinner color matches the Gita theme established
 * throughout the commentary pages.
 * 
 * ============================================================================
 * TECHNICAL NOTES
 * ============================================================================
 * - Uses `router.replace()` not `router.push()` so the base URL doesn't
 *   appear in browser history (prevents back-button loops)
 * - Client-side only ('use client') because we need useEffect and useRouter
 * 
 * @module gitacommentaries/page
 * @component GitaCommentariesIndex
 */

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * GitaCommentariesIndex Component
 * 
 * Renders a loading state while redirecting to the first verse.
 * This component should only be visible for a fraction of a second.
 * 
 * @returns {JSX.Element} Loading spinner with redirect message
 */
export default function GitaCommentariesIndex() {
    const router = useRouter();

    // Perform redirect on component mount
    // Using replace() instead of push() keeps history clean
    useEffect(() => {
        router.replace('/gitacommentaries/1/1');
    }, [router]);

    // Loading UI shown during the brief redirect period
    return (
        <main className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="text-center space-y-4">
                {/* Animated spinner with Gita theme color */}
                <div className="w-12 h-12 border-4 border-[#FFC226] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Loading Commentaries...</p>
            </div>
        </main>
    );
}