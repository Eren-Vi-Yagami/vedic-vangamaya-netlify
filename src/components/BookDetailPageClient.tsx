/**
 * BookDetailPageClient Component (Legacy Version - Components Directory)
 * 
 * ⚠️ DEPRECATION NOTICE: This file is an older version of the BookDetailPageClient
 * component that resides in the components directory. The actively maintained
 * version is located at: src/app/readingpart.tsx
 * 
 * This version:
 * - Uses hardcoded book metadata instead of props
 * - Has hardcoded cover image path
 * - Does NOT support dynamic book data
 * - Does NOT have showCommentaryButton functionality
 * 
 * RECOMMENDATION: This file should either be:
 * 1. Deleted and all imports updated to use readingpart.tsx
 * 2. Converted to re-export from readingpart.tsx for backwards compatibility
 * 
 * ============================================================================
 * ORIGINAL PURPOSE
 * ============================================================================
 * This was the original book detail page component before dynamic routing
 * was implemented. It displays the Bhagavad Gita with hardcoded metadata.
 * 
 * @module components/BookDetailPageClient
 * @deprecated Use src/app/readingpart.tsx instead
 */

'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Merriweather } from 'next/font/google';

/**
 * Font Configuration: Merriweather
 * 
 * Selected for its scholarly appearance and excellent readability,
 * particularly suitable for religious and philosophical texts.
 */
const gitaFont = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
});

/**
 * Verse Type Definition
 * Represents a single verse/shloka within a chapter
 */
type Verse = {
  id: number;
  text: string;
  transliteration: string;
};

/**
 * Chapter Type Definition
 * Represents a chapter (adhyaya) containing multiple verses
 */
type Chapter = {
  title: string;
  content: string;
  verses: Verse[];
};

/**
 * ChapterAccordion - Collapsible Chapter Display
 * 
 * A self-contained accordion component for displaying chapter content.
 * Expands to show verses when clicked, collapses to save space when not active.
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

export default function BookDetailPageClient({ chapters }: { chapters: Chapter[] }) {
  const [openChapterIndex, setOpenChapterIndex] = useState<number | null>(null);
  const [isChapterListOpen, setIsChapterListOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChapterClick = (index: number) => {
    setOpenChapterIndex(openChapterIndex === index ? null : index);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-10 gap-4 lg:gap-6 py-4 lg:py-0">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-xl p-4 mt-24"
        >
          <span className="text-veda-primary font-semibold">Book Details</span>
          <span className={`text-veda-accent transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {/* Left Sidebar */}
        <div className={`w-full lg:w-72 xl:w-80 bg-white/5 rounded-xl p-4 lg:mt-28 lg:sticky lg:top-28 lg:self-start transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'}`}>
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-4 lg:mb-6">
            <Image
              src="/images/bhagwatgita.png"
              alt="Book Cover"
              width={400}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 lg:p-4">
            <h2 className="text-lg lg:text-xl font-bold text-veda-primary mb-2 lg:mb-3">Metadata</h2>
            <div className="text-xs lg:text-sm text-gray-400 space-y-1 lg:space-y-2">
              <p><strong>Book:</strong> Shrimad Bhagwat Gita</p>
              <p><strong>Author:</strong> Vyasa</p>
              <p><strong>Language:</strong> Sanskrit, Hindi, English</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full bg-white/5 rounded-xl p-4 sm:p-6 mt-4 lg:mt-28 flex flex-col">
          <div className={`bg-[#1A1A1A] rounded-xl p-4 sm:p-6 mb-6 lg:mb-8 ${gitaFont.className}`}>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-3 lg:mb-4 text-veda-primary">Shrimad Bhagavad Gita</h1>
            <p className="text-center text-gray-300 leading-relaxed text-sm sm:text-base">
              An ancient dialogue between Lord Krishna and Arjuna, the Gita is a timeless guide to navigating life's challenges with wisdom, courage, and devotion.
            </p>
          </div>

          <div className="space-y-3 lg:space-y-4 w-full">
            <div className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => setIsChapterListOpen(!isChapterListOpen)}
                className="w-full text-left flex justify-between items-center font-bold p-4 sm:p-5 bg-white/10"
              >
                <span className="text-lg sm:text-xl text-veda-primary">Chapters</span>
                <span className="text-veda-accent text-base sm:text-lg">{isChapterListOpen ? '▲' : '▼'}</span>
              </button>

              {isChapterListOpen && (
                <div className="text-gray-300 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                  {chapters.map((chapter, i) => (
                    <ChapterAccordion
                      key={i}
                      chapter={chapter}
                      isOpen={openChapterIndex === i}
                      onClick={() => handleChapterClick(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
