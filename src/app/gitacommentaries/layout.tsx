/**
 * GitaCommentariesLayout - Persistent Navigation Wrapper for Gita Reading
 * 
 * This layout component wraps all pages under /gitacommentaries/* and provides:
 * - Chapter and verse navigation sidebar
 * - Persistent UI state that survives route changes
 * - Responsive mobile-first design with collapsible accordions
 * 
 * ============================================================================
 * LAYOUT vs PAGE ARCHITECTURE (CRITICAL CONCEPT)
 * ============================================================================
 * In Next.js App Router, LAYOUTS don't unmount when child routes change.
 * This is intentionally leveraged here for UX benefits:
 * 
 * - **State Persistence**: The sidebar's expanded/collapsed state stays
 *   consistent as users navigate between verses. This prevents the jarring
 *   experience of UI elements collapsing on every page change.
 * 
 * - **Performance**: The navigation buttons (18 chapters × ~50 verses each)
 *   only render once, not on every verse navigation.
 * 
 * - **Scroll Position**: The sidebar maintains its scroll position as users
 *   navigate, making it easy to continue browsing nearby verses.
 * 
 * ============================================================================
 * RESPONSIVE DESIGN STRATEGY
 * ============================================================================
 * **Desktop (lg and above)**:
 * - Full sidebar always visible on the left
 * - Chapter and verse grids shown by default
 * - Sticky positioning keeps navigation accessible while scrolling
 * 
 * **Mobile (below lg)**:
 * - Sidebar collapses into accordion-style dropdowns
 * - Only current chapter/verse numbers shown when collapsed
 * - Tap to expand and see full navigation grid
 * - State persists across navigation (key feature!)
 * 
 * ============================================================================
 * STATE MANAGEMENT
 * ============================================================================
 * - `isChapterExpanded`: Mobile-only - controls chapter accordion visibility
 * - `isVerseExpanded`: Mobile-only - controls verse accordion visibility
 * 
 * These states are managed HERE in the layout because:
 * 1. Layout doesn't remount on navigation → state persists
 * 2. Child pages don't need to know about sidebar state
 * 3. Clean separation of concerns (navigation vs content)
 * 
 * @module gitacommentaries/layout
 * @component GitaCommentariesLayout
 */

'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import gitaData from '../test-gita.json';

/**
 * GitaCommentariesLayout Component
 * 
 * The persistent wrapper for all Gita commentary pages. Renders the
 * chapter/verse navigation sidebar and hosts child pages in the main area.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page content (verse display)
 * @returns {JSX.Element} The layout with navigation and content areas
 */
export default function GitaCommentariesLayout({ children }: { children: React.ReactNode }) {
    // ========================================================================
    // ROUTING HOOKS
    // ========================================================================
    const params = useParams();
    const router = useRouter();

    // ========================================================================
    // URL-SYNCED NAVIGATION STATE
    // ========================================================================
    // These values come from the URL and drive the UI highlighting.
    // Defaults to chapter 1, verse 1 for the base /gitacommentaries route.
    const currentChapter = (params.chapter as string) || "1";
    const currentVerse = (params.verse as string) || "1";

    // ========================================================================
    // PERSISTENT UI STATE (Mobile Accordion Controls)
    // ========================================================================
    // These states survive navigation because the Layout component never unmounts.
    // This is the KEY FEATURE that makes the mobile UX smooth - users don't have
    // to re-open the navigation accordion after every verse change.
    const [isChapterExpanded, setIsChapterExpanded] = useState(false);
    const [isVerseExpanded, setIsVerseExpanded] = useState(false);

    // ========================================================================
    // DATA EXTRACTION
    // ========================================================================
    // Extract sorted chapter keys for navigation grid
    const chapterKeys = Object.keys(gitaData.chapters).sort((a, b) => Number(a) - Number(b));

    // Get verses for the currently selected chapter
    // Defensive fallback to chapter 1 if URL contains invalid chapter number
    const currentChapterData = (gitaData.chapters as any)[currentChapter] || (gitaData.chapters as any)["1"];
    const verseKeys = Object.keys(currentChapterData.verses).sort((a, b) => Number(a) - Number(b));

    /**
     * Navigate to a specific chapter and verse
     * 
     * @param {string} chap - Target chapter number
     * @param {string} ver - Target verse number
     * 
     * Note: scroll: false keeps the sidebar position stable during navigation,
     * which is essential for the continuous reading experience.
     */
    const navigateTo = (chap: string, ver: string) => {
        router.push(`/gitacommentaries/${chap}/${ver}`, { scroll: false });
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 pt-24 lg:pt-28 flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* 
                  SIDEBAR NAVIGATION
                  By placing this in the Layout, it remains mounted and preserves its state 
                  (expanded/collapsed) while the URL changes.
                */}
                <div className="w-full lg:w-80 flex flex-col gap-4 pt-10 lg:gap-6 lg:sticky lg:top-28 lg:h-[calc(100vh-140px)]">

                    {/* Chapter Selection */}
                    <div className="bg-[#1C1C1C]/50 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden flex flex-col lg:h-auto lg:shrink-0 transition-all duration-300">
                        <button
                            onClick={() => setIsChapterExpanded(!isChapterExpanded)}
                            className="w-full pl-4 pr-4 h-10 pt-5 flex items-center justify-between lg:pointer-events-none"
                        >
                            <div className={`text-[15px] bg-[#FFC226] h-7 w-7 rounded-[5px] flex items-center justify-center font-bold text-white uppercase tracking-[0.2em] lg:w-full lg:text-center text-left lg:hidden`}>{currentChapter}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] lg:w-full lg:text-center">Chapter</div>
                            <span className={`lg:hidden transition-transform duration-300 ${isChapterExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        <div className={`px-4 pb-4 lg:px-5 lg:pb-5 transition-all duration-300 ${isChapterExpanded ? 'max-h-[400px] pt-5 opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'} overflow-hidden lg:overflow-visible`}>
                            <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-4 gap-2 lg:max-h-[220px] lg:overflow-y-auto lg:pr-1 custom-scrollbar">
                                {chapterKeys.map((cKey) => (
                                    <button
                                        key={cKey}
                                        onClick={() => {
                                            const chapterVerses = Object.keys((gitaData.chapters as any)[cKey].verses).sort((a, b) => Number(a) - Number(b));
                                            navigateTo(cKey, chapterVerses[0]);
                                        }}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentChapter === cKey
                                            ? 'bg-[#FFC226] text-black shadow-[0_0_15px_rgba(255,194,38,0.2)]'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                                            }`}
                                    >
                                        <span className="relative z-10">{cKey}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Verse Selection */}
                    <div className="bg-[#1C1C1C]/50 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden flex flex-col flex-grow min-h-0 transition-all duration-300">
                        <button
                            onClick={() => setIsVerseExpanded(!isVerseExpanded)}
                            className="w-full pl-4 pr-4 h-10 pt-5 lg:p-5 flex items-center justify-between lg:pointer-events-none"
                        >
                            <div className={`text-[15px] bg-[#FFC226] h-7 w-7 rounded-[5px] flex items-center justify-center font-bold text-white uppercase tracking-[0.2em] lg:w-full lg:text-center text-left lg:hidden`}>{currentVerse}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] lg:w-full lg:text-center">Verses</div>
                            <span className={`lg:hidden transition-transform duration-300 ${isVerseExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        <div className={`px-4 pb-4 lg:px-5 lg:pb-5 flex-grow flex flex-col transition-all duration-300 ${isVerseExpanded ? 'max-h-[1000px] pt-5 opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'} overflow-hidden lg:overflow-visible min-h-0`}>
                            <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-4 gap-2 overflow-y-auto pr-1 custom-scrollbar flex-grow">
                                {verseKeys.map((vKey) => (
                                    <button
                                        key={vKey}
                                        onClick={() => navigateTo(currentChapter, vKey)}
                                        className={`relative group aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-500 ${currentVerse === vKey
                                            ? 'bg-[#FFC226] text-black shadow-[0_0_15px_rgba(255,194,38,0.2)]'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                                            }`}
                                    >
                                        {currentVerse === vKey && (
                                            <div className="absolute inset-0 bg-[#FFC226] blur-md opacity-20 rounded-lg"></div>
                                        )}
                                        <span className="relative z-10">{vKey}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DYNAMIC CONTENT AREA: This updates while Layout stays static */}
                {children}

            </div>
        </main>
    );
}
