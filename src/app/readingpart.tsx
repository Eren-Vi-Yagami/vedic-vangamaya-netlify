/**
 * BookDetailPageClient Component - Primary Reading Interface
 * 
 * This is the main reading interface for displaying book content in the
 * Vaidika Vangamaya digital library. It provides a rich, immersive reading
 * experience with chapter navigation, verse display, and metadata presentation.
 * 
 * ============================================================================
 * DESIGN PHILOSOPHY
 * ============================================================================
 * - **Mobile-First Responsive Design**: The layout adapts seamlessly from
 *   mobile to desktop, with collapsible sidebars on small screens.
 * 
 * - **Scholarly Reading Experience**: Uses Merriweather font for optimal
 *   readability of Sanskrit transliterations and English translations.
 * 
 * - **Glassmorphic Aesthetic**: Consistent with the app's premium feel,
 *   using subtle transparency and backdrop blurs.
 * 
 * - **Progressive Disclosure**: Chapters and verses are revealed through
 *   accordion patterns, reducing visual overwhelm for lengthy texts.
 * 
 * ============================================================================
 * COMPONENT ARCHITECTURE
 * ============================================================================
 * - This is a CLIENT COMPONENT ('use client') because it manages interactive
 *   UI state (accordion open/close, sidebar visibility).
 * 
 * - It receives pre-fetched chapter and book data from a SERVER component,
 *   enabling SEO-friendly server-side rendering of content.
 * 
 * - Exports TypeScript types (Verse, Chapter, BookMetadata) for use by
 *   parent components that need to pass properly typed data.
 * 
 * ============================================================================
 * STATE MANAGEMENT
 * ============================================================================
 * - `openChapterIndex`: Tracks which chapter's verses are currently expanded.
 *   Only one chapter can be open at a time (accordion behavior).
 * 
 * - `isChapterListOpen`: Controls whether the entire chapters list is visible.
 *   Starts open by default for immediate content access.
 * 
 * - `isSidebarOpen`: Controls mobile sidebar visibility. Hidden by default
 *   on mobile to prioritize content area.
 * 
 * @module readingpart
 * @component BookDetailPageClient
 */

'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Merriweather } from 'next/font/google';
import Link from 'next/link';

/**
 * Font Configuration: Merriweather
 * 
 * Merriweather is chosen for its excellent readability in both print and
 * screen contexts. It handles Sanskrit transliteration well and provides
 * a scholarly, classical appearance appropriate for ancient texts.
 * 
 * Weights:
 * - 400: Regular text for verses and descriptions
 * - 700: Bold for chapter titles and emphasis
 */
const gitaFont = Merriweather({
    weight: ['400', '700'],
    subsets: ['latin'],
});

/**
 * Verse Type Definition
 * 
 * Represents a single verse (shloka) within a chapter.
 * Each verse contains the original Sanskrit text and its transliteration
 * for readers unfamiliar with Devanagari script.
 * 
 * @property {number} id - Unique identifier/sequence number of the verse
 * @property {string} text - The original verse text (typically Sanskrit)
 * @property {string} transliteration - Romanized version of the verse
 */
export type Verse = {
    id: number;
    text: string;
    transliteration: string;
};

/**
 * Chapter Type Definition
 * 
 * Represents a chapter (adhyaya) containing multiple verses.
 * Chapters are the primary organizational unit for Vedic texts.
 * 
 * @property {string} title - Chapter name (e.g., "Arjuna Vishada Yoga")
 * @property {string} content - Brief description or summary of the chapter
 * @property {Verse[]} verses - Array of verses contained in this chapter
 */
export type Chapter = {
    title: string;
    content: string;
    verses: Verse[];
};

/**
 * ChapterAccordion Component
 * 
 * A collapsible section that displays chapter information and its verses.
 * Uses the accordion pattern to show/hide content, reducing cognitive load
 * when browsing through texts with many chapters.
 * 
 * Design Notes:
 * - Single chapter expansion: Clicking a chapter closes any previously open one
 * - Visual feedback: Arrow indicator rotates to show open/closed state
 * - Verse cards: Each verse displayed in its own styled container for clarity
 * 
 * @param {Object} props - Component props
 * @param {Chapter} props.chapter - The chapter data to display
 * @param {boolean} props.isOpen - Whether this accordion section is expanded
 * @param {Function} props.onClick - Handler called when the header is clicked
 */
const ChapterAccordion = ({ chapter, isOpen, onClick }: { chapter: Chapter, isOpen: boolean, onClick: () => void }) => (
    <div className="border-b border-white/10">
        <button
            onClick={onClick}
            className="w-full text-left flex justify-between items-center font-semibold p-4 hover:bg-white/10 transition-colors duration-200"
        >
            <span className="text-md text-gray-300">{chapter.title}</span>
            <span className="text-veda-accent text-sm">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
            <div className="p-4 bg-black/20">
                <p className="text-gray-400 text-sm mb-4">{chapter.content}</p>
                <div className="space-y-4">
                    {chapter.verses.map(verse => (
                        <div key={verse.id} className="p-3 bg-white/5 rounded-lg">
                            <p className="font-semibold text-white">Verse {verse.id}</p>
                            <p className="text-gray-300 mt-1">{verse.text}</p>
                            <p className="text-gray-400 text-sm italic mt-1">{verse.transliteration}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);


/**
 * BookMetadata Type Definition
 * 
 * Represents the metadata for a book/text in the library.
 * This information is displayed in the sidebar and used for SEO.
 * 
 * All fields are required as they're essential for proper display.
 * The parent component (BookPage server component) is responsible for
 * providing complete metadata or appropriate fallback values.
 * 
 * @property {string} title - Display name of the book
 * @property {string} author - Author, composer, or traditional attribution
 * @property {string} coverUrl - Path to cover image (relative to public/)
 * @property {string} description - Brief summary of the book's content
 * @property {string} language - Primary language(s) of the text
 * @property {string} status - Availability status (e.g., "AVAILABLE", "COMING SOON")
 * @property {string} category - Classification (e.g., "Veda", "Itihas", "Gita")
 */
export type BookMetadata = {
    title: string;
    author: string;
    coverUrl: string;
    description: string;
    language: string;
    status: string;
    category: string;
};

/**
 * BookDetailPageClient Component
 * 
 * The main client-side component for displaying book details with
 * interactive elements like collapsible chapters and responsive sidebar.
 * 
 * ============================================================================
 * PROPS
 * ============================================================================
 * @param {Chapter[]} chapters - Array of chapters with verses to display
 * @param {BookMetadata} bookMetadata - Book information for sidebar display
 * @param {boolean} showCommentaryButton - Whether to show "Read Commentaries" link
 *        (Only true for Bhagavad Gita which has dedicated commentary pages)
 * 
 * ============================================================================
 * STATE VARIABLES
 * ============================================================================
 * - `openChapterIndex`: Which chapter's verses are currently expanded (null = none)
 * - `isChapterListOpen`: Whether the main chapters accordion is expanded
 * - `isSidebarOpen`: Mobile-only - whether the sidebar panel is visible
 * 
 * ============================================================================
 * RESPONSIVE BEHAVIOR
 * ============================================================================
 * **Desktop (lg+)**: Two-column layout with always-visible sidebar on left
 * **Mobile (<lg)**: Stacked layout with collapsible sidebar above content
 */
export default function BookDetailPageClient({
    chapters,
    bookMetadata,
    showCommentaryButton = false
}: {
    chapters: Chapter[],
    bookMetadata: BookMetadata,
    showCommentaryButton?: boolean
}) {
    // ========================================================================
    // UI STATE MANAGEMENT
    // ========================================================================

    // Track which chapter is currently expanded to show its verses
    // null means no chapter is expanded
    const [openChapterIndex, setOpenChapterIndex] = useState<number | null>(null);

    // Control visibility of the entire chapters list accordion
    // Starts closed to encourage exploration of the book description first
    const [isChapterListOpen, setIsChapterListOpen] = useState(false);

    // Mobile-only: Control sidebar visibility
    // Starts hidden to maximize content area on small screens
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    /**
     * Toggle chapter expansion
     * 
     * When a chapter is clicked:
     * - If it's already open, close it (set to null)
     * - If it's closed, open it (and close any other open chapter)
     * 
     * This accordion behavior ensures only one chapter is expanded at a time,
     * which is important for texts with many chapters and verses.
     */
    const handleChapterClick = (index: number) => {
        setOpenChapterIndex(openChapterIndex === index ? null : index);
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <main className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-10 gap-4 lg:gap-6 py-4 lg:py-0">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-xl p-4 mt-30"
                >
                    <span className="text-veda-primary font-semibold">Book Details</span>
                    <span className={`text-veda-accent transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {/* Left Sidebar */}
                <div className={`w-full lg:w-72 xl:w-80 bg-white/5 rounded-xl p-4 lg:mt-28 lg:sticky lg:top-28 lg:self-start transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}`}>
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-4 lg:mb-6">
                        <Image
                            src={bookMetadata.coverUrl || "/images/bhagwatgita.png"}
                            alt={bookMetadata.title}
                            width={400}
                            height={600}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Primary Action Button */}
                    {showCommentaryButton && (
                        <div className="mb-4 lg:mb-6">
                            <div>
                                <Link
                                    href="/gitacommentaries"
                                    className="w-full flex items-center justify-center space-x-2 bg-veda-primary text-black py-3 lg:py-4 rounded-xl font-bold hover:bg-veda-accent transition-all shadow-[0_0_20px_rgba(255,194,38,0.2)]"
                                >
                                    <span className="text-white text-sm lg:text-base">Read Commentaries</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 lg:p-4">
                        <h2 className="text-lg lg:text-xl font-bold text-veda-primary mb-2 lg:mb-3">Metadata</h2>
                        <div className="text-xs lg:text-sm text-gray-400 space-y-1 lg:space-y-2">
                            <p><strong>Book:</strong> {bookMetadata.title}</p>
                            <p><strong>Author:</strong> {bookMetadata.author}</p>
                            <p><strong>Language:</strong> {bookMetadata.language}</p>
                            <p><strong>Category:</strong> {bookMetadata.category}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full bg-white/5 rounded-xl p-4 sm:p-6 mt-4 lg:mt-28 flex flex-col">
                    <div className={`bg-[#1A1A1A] rounded-xl p-4 sm:p-6 mb-6 lg:mb-8 ${gitaFont.className}`}>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-3 lg:mb-4 text-veda-primary">{bookMetadata.title}</h1>
                        <p className="text-center text-gray-300 leading-relaxed text-sm sm:text-base">
                            {bookMetadata.description}
                        </p>
                    </div>

                    <div className="space-y-3 lg:space-y-4 w-full">
                        <div className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                            <button
                                onClick={() => setIsChapterListOpen(prev => !prev)}
                                className={`w-full text-left flex justify-between items-center font-bold p-4 sm:p-5 bg-white/10 ${isChapterListOpen ? "rounded-t-lg" : "rounded-lg"
                                    }`}
                            >
                                <span className="text-lg sm:text-xl text-veda-primary">Chapters</span>
                                <span className="text-veda-accent text-base sm:text-lg">{isChapterListOpen ? '▲' : '▼'}</span>
                            </button>

                            {isChapterListOpen && (
                                <div className="text-gray-300 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                                    {chapters && chapters.length > 0 ? (
                                        chapters.map((chapter, i) => (
                                            <ChapterAccordion
                                                key={i}
                                                chapter={chapter}
                                                isOpen={openChapterIndex === i}
                                                onClick={() => handleChapterClick(i)}
                                            />
                                        ))
                                    ) : (
                                        <p className="p-4 text-center text-gray-500">No chapters available for this text yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

