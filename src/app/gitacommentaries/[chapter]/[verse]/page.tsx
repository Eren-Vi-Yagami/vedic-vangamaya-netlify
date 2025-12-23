/**
 * GitaCommentaryPage - Individual Verse Display with Commentaries
 * 
 * This page displays a single verse from the Bhagavad Gita along with its
 * commentaries from various Acharyas (spiritual teachers) of different traditions.
 * It serves as the main reading interface for studying the Gita in depth.
 * 
 * ============================================================================
 * URL STRUCTURE & NAVIGATION
 * ============================================================================
 * Route Pattern: /gitacommentaries/[chapter]/[verse]
 * Example: /gitacommentaries/2/47 displays Chapter 2, Verse 47
 * 
 * Navigation flows seamlessly between verses:
 * - "Next" advances to the next verse, or first verse of next chapter
 * - "Previous" goes back to prior verse, or last verse of previous chapter
 * - Chapter/verse buttons in the sidebar (from layout.tsx) allow direct access
 * 
 * ============================================================================
 * DATA ARCHITECTURE
 * ============================================================================
 * - Verse data is loaded from a static JSON file (test-gita.json)
 * - In production, this could be replaced with API calls or CMS integration
 * - The JSON structure supports multilingual content (Sanskrit, English, etc.)
 * - Commentaries are keyed by author ID, allowing for extensibility
 * 
 * ============================================================================
 * STATE MANAGEMENT
 * ============================================================================
 * - `openCommentaryIndex`: Tracks which commentary accordion is expanded
 * - State RESETS on navigation (intentional - new verse = fresh slate)
 * - Persistent state (sidebar expansion) is managed in the parent layout
 * 
 * ============================================================================
 * DESIGN PHILOSOPHY
 * ============================================================================
 * - Sanskrit text displayed prominently with golden (#FFC226) accent color
 * - Transliteration provided for those unfamiliar with Devanagari
 * - English translation in a subtle container for easy reading
 * - Commentaries in accordion format to manage lengthy scholarly content
 * - Navigation buttons at bottom for continuous reading experience
 * 
 * @module gitacommentaries/[chapter]/[verse]/page
 * @component GitaCommentaryPage
 */

'use client';
import { useState } from 'react';
import { Lato } from 'next/font/google';
import gitaData from '../../../test-gita.json';
import { useParams, useRouter } from 'next/navigation';

/**
 * Font Configuration: Lato
 * 
 * Lato provides excellent readability for UI elements and English text.
 * Its clean, modern appearance complements the classical Sanskrit content
 * without competing visually with the sacred text.
 */
const gitaFont = Lato({
    subsets: ['latin'],
    weight: '400',
    display: 'swap',
});

/**
 * VerseJSON Type Definition
 * 
 * Represents the structure of verse data as stored in the JSON file.
 * This type mirrors the actual data structure for type-safe access.
 * 
 * Key Points:
 * - `location` provides both chapter and verse numbers for navigation
 * - `languages` object supports Sanskrit (sa) and English (en) content
 * - `commentaries` is optional - not all verses may have commentaries yet
 * - Each commentary includes author info and multi-language support
 */

type VerseJSON = {
    number: number;
    location: {
        chapter: number;
        verse: number;
    };
    languages: {
        sa?: { text?: string; transliteration?: string };
        en?: { text?: string };
    };
    commentaries?: Record<string, {
        author: {
            id: string;
            name: string;
            tradition: string;  // e.g., "Advaita", "Vishishtadvaita", "Dvaita"
        };
        languages: {
            en?: { text: string };
            sa?: { text: string };
        };
    }>;
};

/**
 * GitaCommentaryPage Component
 * 
 * Main component for displaying a single Gita verse with all its associated
 * content including Sanskrit text, transliteration, translation, and
 * commentaries from various Acharyas.
 * 
 * @returns {JSX.Element} The complete verse display interface
 */
export default function GitaCommentaryPage() {
    // ========================================================================
    // URL PARAMETER EXTRACTION
    // ========================================================================
    // Next.js App Router provides URL parameters through the useParams hook.
    // These values come from the dynamic route segments: [chapter] and [verse]
    const params = useParams();
    const router = useRouter();

    // Extract chapter and verse from URL, defaulting to "1" if missing.
    // This ensures the page always has valid values even on direct navigation.
    const currentChapter = (params.chapter as string) || "1";
    const currentVerse = (params.verse as string) || "1";

    // ========================================================================
    // LOCAL UI STATE
    // ========================================================================
    // Commentary accordion state - starts with first commentary open (index 0)
    // This state intentionally RESETS when navigating to a new verse, which is
    // the desired UX: each verse is a fresh reading experience.
    const [openCommentaryIndex, setOpenCommentaryIndex] = useState<number | null>(0);

    // ========================================================================
    // DATA EXTRACTION & NAVIGATION KEYS
    // ========================================================================
    // Get sorted array of chapter numbers for navigation
    // Sorting numerically ensures chapters appear in order (1, 2, 3... not 1, 10, 11...)
    const chapterKeys = Object.keys(gitaData.chapters).sort((a, b) => Number(a) - Number(b));

    // Get current chapter data, falling back to chapter 1 if invalid URL parameter
    // This defensive coding prevents crashes from malformed URLs
    const currentChapterData = (gitaData.chapters as any)[currentChapter] || (gitaData.chapters as any)["1"];

    // Get sorted array of verse numbers within the current chapter
    const verseKeys = Object.keys(currentChapterData.verses).sort((a, b) => Number(a) - Number(b));

    // Extract the current verse object with fallback to verse 1 for safety
    // Type assertion to VerseJSON ensures TypeScript knows the shape of our data
    const verse = (currentChapterData.verses[currentVerse] || currentChapterData.verses["1"]) as VerseJSON;

    // Convert commentaries from object to array for easier iteration in JSX
    // Some verses may not have commentaries, hence the fallback to empty array
    const commentaries = verse.commentaries
        ? Object.values(verse.commentaries)
        : [];

    // ========================================================================
    // NAVIGATION FUNCTIONS
    // ========================================================================

    /**
     * Navigate to a specific chapter and verse
     * Uses scroll: false to prevent jarring page jumps - the sidebar stays in place
     * while only the content area updates (handled by the layout component)
     */
    const navigateTo = (chap: string, ver: string) => {
        router.push(`/gitacommentaries/${chap}/${ver}`, { scroll: false });
    };

    /**
     * Handle "Next" Button Click
     * 
     * Navigation logic for moving forward through the Gita:
     * 1. First, try to advance to the next verse within the current chapter
     * 2. If at the last verse of a chapter, jump to the first verse of the next chapter
     * 3. If at the absolute last verse (Ch 18, Verse 78), button is disabled
     * 
     * This creates a seamless reading experience - the reader can continuously
     * click "Next" to read through the entire Gita without manual chapter selection
     */
    const handleNext = () => {
        const currentVerseIndex = verseKeys.indexOf(currentVerse);

        // Case 1: Not at the last verse of current chapter - go to next verse
        if (currentVerseIndex < verseKeys.length - 1) {
            navigateTo(currentChapter, verseKeys[currentVerseIndex + 1]);
        } else {
            // Case 2: At last verse of chapter - try to go to next chapter
            const currentChapterIndex = chapterKeys.indexOf(currentChapter);
            if (currentChapterIndex < chapterKeys.length - 1) {
                const nextChapKey = chapterKeys[currentChapterIndex + 1];
                // Get verses of the next chapter, sorted numerically
                const nextChapVerses = Object.keys((gitaData.chapters as any)[nextChapKey].verses).sort((a, b) => Number(a) - Number(b));
                // Navigate to first verse of next chapter
                navigateTo(nextChapKey, nextChapVerses[0]);
            }
            // Case 3: At absolute last verse - do nothing (button is disabled)
        }
    };

    /**
     * Handle "Previous" Button Click
     * 
     * Navigation logic for moving backward through the Gita:
     * 1. First, try to go back to the previous verse within the current chapter
     * 2. If at the first verse of a chapter, jump to the LAST verse of the previous chapter
     * 3. If at the absolute first verse (Ch 1, Verse 1), button is disabled
     * 
     * Note: Going to the LAST verse of the previous chapter (not first) maintains
     * reading continuity - the user was just reading that verse before moving forward
     */
    const handlePrevious = () => {
        const currentVerseIndex = verseKeys.indexOf(currentVerse);

        // Case 1: Not at the first verse of current chapter - go to previous verse
        if (currentVerseIndex > 0) {
            navigateTo(currentChapter, verseKeys[currentVerseIndex - 1]);
        } else {
            // Case 2: At first verse of chapter - try to go to previous chapter's LAST verse
            const currentChapterIndex = chapterKeys.indexOf(currentChapter);
            if (currentChapterIndex > 0) {
                const prevChapKey = chapterKeys[currentChapterIndex - 1];
                // Get verses of the previous chapter, sorted numerically
                const prevChapVerses = Object.keys((gitaData.chapters as any)[prevChapKey].verses).sort((a, b) => Number(a) - Number(b));
                // Navigate to LAST verse of previous chapter (maintaining reading order)
                navigateTo(prevChapKey, prevChapVerses[prevChapVerses.length - 1]);
            }
            // Case 3: At absolute first verse - do nothing (button is disabled)
        }
    };

    // ========================================================================
    // BOUNDARY DETECTION FOR BUTTON STATES
    // ========================================================================
    // Determine if we're at the absolute boundaries of the text
    // These booleans control whether navigation buttons are disabled
    const isFirstVerse = currentChapter === chapterKeys[0] && currentVerse === verseKeys[0];
    const isLastVerse = currentChapter === chapterKeys[chapterKeys.length - 1] && currentVerse === verseKeys[verseKeys.length - 1];

    return (
        <div className="flex-grow max-w-4xl mx-auto w-full space-y-8 pb-20">
            {/* Verse Header */}
            <div className="text-center space-y-2">
                <div className="text-center space-y-1">
                    <div className="text-sm uppercase tracking-widest text-gray-400">
                        Chapter
                    </div>
                    <div className="text-3xl font-bold text-[#FFC226]">
                        {verse.location.chapter}
                    </div>
                    <div className="text-sm text-gray-400">
                        Verse {verse.location.verse}
                    </div>
                </div>
                <div className="h-1 w-20 bg-[#FFC226]/50 mx-auto rounded-full"></div>
            </div>

            {/* Main Verse Box */}
            <div className={`bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group hover:border-[#FFC226]/30 transition-all duration-500 ${gitaFont.className}`}>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFC226]/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#FFC226]/20 transition-all duration-500"></div>
                <div className="space-y-6 relative z-10">
                    <div className="text-center">
                        <p className="text-xl md:text-3xl flex justify-center items-center font-bold text-[#FFC226] leading-loose tracking-wide">
                            {verse.languages.sa?.text}
                        </p>
                    </div>
                    <div className="h-px bg-white/10 w-full"></div>
                    <div className="text-center">
                        <p className="text-gray-400 italic text-sm md:text-base leading-relaxed">
                            {verse.languages.sa?.transliteration}
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                        <h3 className="text-[#FFC226] text-xs font-bold uppercase mb-3 tracking-widest">Translation</h3>
                        <p className="text-gray-200 text-lg leading-relaxed">
                            "{verse.languages.en?.text}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Commentaries Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white px-2">Commentaries</h3>
                <div className="space-y-3">
                    {commentaries.map((comm, idx) => (
                        <div
                            key={idx}
                            className="border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-all duration-300 hover:bg-white/[0.07]"
                        >
                            <button
                                onClick={() => setOpenCommentaryIndex(openCommentaryIndex === idx ? null : idx)}
                                className="w-full text-left px-6 py-4 flex justify-between items-center group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-[#FFC226] rounded-full"></div>
                                    <span className="font-semibold text-gray-200 group-hover:text-[#FFC226] transition-colors">{comm.author.name}</span>
                                    <span className="text-xs text-gray-500 border border-white/10 px-2 py-0.5 rounded italic">{comm.author.tradition}</span>
                                </div>
                                <span className={`text-[#FFC226] transition-transform duration-300 ${openCommentaryIndex === idx ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            <div className={`transition-all duration-500 ease-in-out ${openCommentaryIndex === idx ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                <div className="px-6 pb-6 pt-2 text-gray-400 leading-relaxed border-t border-white/5">
                                    {comm.languages.en?.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {commentaries.length === 0 && (
                        <p className="text-gray-500 italic px-2">No commentaries available for this verse.</p>
                    )}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-8">
                <button
                    onClick={handlePrevious}
                    disabled={isFirstVerse}
                    className={`flex items-center space-x-2 px-4 sm:px-6 py-3 bg-white/5 border border-white/10 rounded-full transition-all group ${isFirstVerse ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:border-[#FFC226]/50'}`}
                >
                    <span className="text-[#FFC226] group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-xs sm:text-sm font-medium">Previous</span>
                </button>
                <button
                    onClick={handleNext}
                    disabled={isLastVerse}
                    className={`flex items-center space-x-2 px-5 sm:px-8 py-3 bg-[#FFC226] text-black rounded-full transition-all font-bold shadow-[0_0_20px_rgba(255,194,38,0.3)] ${isLastVerse ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#FFC226]/80 hover:shadow-[0_0_30px_rgba(255,194,38,0.5)]'}`}
                >
                    <span className="text-xs sm:text-sm">Next</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
            </div>
        </div>
    );
}