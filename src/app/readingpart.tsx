'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Merriweather } from 'next/font/google';
import Link from 'next/link';

const gitaFont = Merriweather({
    weight: ['400', '700'],
    subsets: ['latin'],
});

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


// Define the type for book metadata
export type BookMetadata = {
    title: string;
    author: string;
    coverUrl: string;
    description: string;
    language: string;
    status: string;
    category: string;
};

export default function BookDetailPageClient({
    chapters,
    bookMetadata,
    showCommentaryButton = false
}: {
    chapters: Chapter[],
    bookMetadata: BookMetadata,
    showCommentaryButton?: boolean
}) {
    const [openChapterIndex, setOpenChapterIndex] = useState<number | null>(null);
    const [isChapterListOpen, setIsChapterListOpen] = useState(false);

    const handleChapterClick = (index: number) => {
        setOpenChapterIndex(openChapterIndex === index ? null : index);
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <main className="flex flex-row">
                {/* Left Sidebar */}
                <div className="w-1/4 bg-white/5 rounded-xl p-4 md:mt-30 ml-10 mr-5 sticky top-28 self-start">
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-6">
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
                        <div className="mb-6">
                            <div>
                                <Link
                                    href="/gitacommentaries"
                                    className="w-full flex items-center justify-center space-x-2 bg-veda-primary text-black py-4 rounded-xl font-bold hover:bg-veda-accent transition-all shadow-[0_0_20px_rgba(255,194,38,0.2)]"
                                >
                                    <span  className="text-white">Read Commentaries</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h2 className="text-xl font-bold text-veda-primary mb-3">Metadata</h2>
                        <div className="text-sm text-gray-400 space-y-2">
                            <p><strong>Book:</strong> {bookMetadata.title}</p>
                            <p><strong>Author:</strong> {bookMetadata.author}</p>
                            <p><strong>Language:</strong> {bookMetadata.language}</p>
                            <p><strong>Category:</strong> {bookMetadata.category}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-3/4 bg-white/5 rounded-xl p-6 md:mt-30 mr-10 flex flex-col">
                    <div className={`bg-[#1A1A1A] rounded-xl p-6 mb-8 ${gitaFont.className}`}>
                        <h1 className="text-3xl font-bold text-center mb-4 text-veda-primary">{bookMetadata.title}</h1>
                        <p className="text-center text-gray-300 leading-relaxed">
                            {bookMetadata.description}
                        </p>
                    </div>

                    <div className="space-y-4 w-full">
                        <div className="border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm">
                            <button
                                onClick={() => setIsChapterListOpen(prev => !prev)}
                                className={`w-full text-left flex justify-between items-center font-bold p-5 bg-white/10 ${isChapterListOpen ? "rounded-t-lg" : "rounded-lg"
                                    }`}
                            >
                                <span className="text-xl text-veda-primary">Chapters</span>
                                <span className="text-veda-accent text-lg">{isChapterListOpen ? '▲' : '▼'}</span>
                            </button>

                            {isChapterListOpen && (
                                <div className="text-gray-300 max-h-[60vh] overflow-y-auto">
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

