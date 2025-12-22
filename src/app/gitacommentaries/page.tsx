'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Gita Commentaries Landing Page
 * 
 * Redirects users to the first chapter and first verse by default.
 * This ensures a consistent URL structure of /gitacommentaries/[chapter]/[verse]
 * across the entire application.
 */
export default function GitaCommentariesIndex() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the first verse of the first chapter
        router.replace('/gitacommentaries/1/1');
    }, [router]);

    return (
        <main className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#FFC226] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Loading Commentaries...</p>
            </div>
        </main>
    );
}