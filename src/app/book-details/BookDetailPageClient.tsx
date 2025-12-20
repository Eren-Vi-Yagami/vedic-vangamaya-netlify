'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Merriweather } from 'next/font/google';

const gitaFont = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export type BookMetadata = {
  title: string;
  author?: string;
  coverUrl?: string;
  description?: string;
  language?: string;
  status?: string;
  category?: string;
};

// Define the type for a single verse
export type Verse = {
  id: number;
  text: string;
  transliteration: string;
};

// Define the type for a single chapter
export type Chapter = {
  title: string;
  content: string;
  verses: Verse[];
};

type Props = {
  chapters: Chapter[];
  bookMetadata: BookMetadata;
};

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

export default function BookDetailPageClient({ chapters, bookMetadata }: Props) {
  const [openChapterIndex, setOpenChapterIndex] = useState<number | null>(null);
  const [isChapterListOpen, setIsChapterListOpen] = useState(true);

  const handleChapterClick = (index: number) => {
    setOpenChapterIndex(openChapterIndex === index ? null : index);
  };

  // Fallback for cover URL
  const coverUrl = bookMetadata.coverUrl || '/images/placeholder_book.png'; 

  return (
    <div className="bg-black text-white min-h-screen">
      <main className="flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 bg-white/5 rounded-xl p-4 md:mt-30 md:ml-10 md:mr-5 sticky top-28 self-start">
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-6">
            <div className="relative aspect-[2/3] w-full">
               <Image
                src={coverUrl}
                alt={`Cover of ${bookMetadata.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
              />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h2 className="text-xl font-bold text-veda-primary mb-3">Metadata</h2>
            <div className="text-sm text-gray-400 space-y-2">
              <p><strong>Book:</strong> {bookMetadata.title}</p>
              {bookMetadata.author && <p><strong>Author:</strong> {bookMetadata.author}</p>}
              {bookMetadata.language && <p><strong>Language:</strong> {bookMetadata.language}</p>}
               {bookMetadata.category && <p><strong>Category:</strong> {bookMetadata.category}</p>}
               {bookMetadata.status && <p><strong>Status:</strong> {bookMetadata.status}</p>}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 bg-white/5 rounded-xl p-6 md:mt-30 md:mr-10 flex flex-col">
          <div className={`bg-[#1A1A1A] rounded-xl p-6 mb-8 ${gitaFont.className}`}>
            <h1 className="text-3xl font-bold text-center mb-4 text-veda-primary">{bookMetadata.title}</h1>
            <p className="text-center text-gray-300 leading-relaxed">
              {bookMetadata.description || "No description available."}
            </p>
          </div>

          <div className="space-y-4 w-full">
            <div className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => setIsChapterListOpen(!isChapterListOpen)}
                className="w-full text-left flex justify-between items-center font-bold p-5 bg-white/10"
              >
                <span className="text-xl text-veda-primary">Chapters</span>
                <span className="text-veda-accent text-lg">{isChapterListOpen ? '▲' : '▼'}</span>
              </button>

              {isChapterListOpen && (
                <div className="text-gray-300 max-h-[60vh] overflow-y-auto">
                    {chapters.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">No chapters available.</div>
                    ) : (
                        chapters.map((chapter, i) => (
                            <ChapterAccordion
                            key={i}
                            chapter={chapter}
                            isOpen={openChapterIndex === i}
                            onClick={() => handleChapterClick(i)}
                            />
                        ))
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