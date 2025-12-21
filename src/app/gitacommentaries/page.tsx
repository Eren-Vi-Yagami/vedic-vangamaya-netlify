'use client';
import { useState } from 'react';
import { Lato } from 'next/font/google';
import gitaData from '../test-gita.json';

// Initialize the font
const gitaFont = Lato({
    subsets: ['latin'],
    weight: '400',
    display: 'swap',
});

// Types based on the JSON structure
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
            tradition: string;
        };
        languages: {
            en?: { text: string };
            sa?: { text: string };
        };
    }>;
};

export default function GitaCommentaries() {
    // State for navigation
    const [currentChapter, setCurrentChapter] = useState("1");
    const [currentVerse, setCurrentVerse] = useState("1");

    // State for mobile navigation expansion
    const [isChapterExpanded, setIsChapterExpanded] = useState(false);
    const [isVerseExpanded, setIsVerseExpanded] = useState(false);

    // State for accordion-style commentary display
    const [openCommentaryIndex, setOpenCommentaryIndex] = useState<number | null>(0);

    // Get all chapters and current chapter data
    const chapterKeys = Object.keys(gitaData.chapters).sort((a, b) => Number(a) - Number(b));
    const currentChapterData = (gitaData.chapters as any)[currentChapter];

    // Get all verses in current chapter
    const verseKeys = Object.keys(currentChapterData.verses).sort((a, b) => Number(a) - Number(b));
    const verse = currentChapterData.verses[currentVerse] as VerseJSON;

    // Derived commentaries array
    const commentaries = verse.commentaries
        ? Object.values(verse.commentaries)
        : [];

    const handleNext = () => {
        const currentVerseIndex = verseKeys.indexOf(currentVerse);

        if (currentVerseIndex < verseKeys.length - 1) {
            // Next verse in same chapter
            setCurrentVerse(verseKeys[currentVerseIndex + 1]);
            setOpenCommentaryIndex(0); // Reset commentary accordion
        } else {
            // Next chapter
            const currentChapterIndex = chapterKeys.indexOf(currentChapter);
            if (currentChapterIndex < chapterKeys.length - 1) {
                const nextChapKey = chapterKeys[currentChapterIndex + 1];
                setCurrentChapter(nextChapKey);
                // Get verses for next chapter to find first one
                const nextChapVerses = Object.keys((gitaData.chapters as any)[nextChapKey].verses).sort((a, b) => Number(a) - Number(b));
                setCurrentVerse(nextChapVerses[0]);
                setOpenCommentaryIndex(0);
            }
        }
    };

    const handlePrevious = () => {
        const currentVerseIndex = verseKeys.indexOf(currentVerse);

        if (currentVerseIndex > 0) {
            // Previous verse in same chapter
            setCurrentVerse(verseKeys[currentVerseIndex - 1]);
            setOpenCommentaryIndex(0);
        } else {
            // Previous chapter
            const currentChapterIndex = chapterKeys.indexOf(currentChapter);
            if (currentChapterIndex > 0) {
                const prevChapKey = chapterKeys[currentChapterIndex - 1];
                setCurrentChapter(prevChapKey);
                // Get verses for prev chapter to find last one
                const prevChapVerses = Object.keys((gitaData.chapters as any)[prevChapKey].verses).sort((a, b) => Number(a) - Number(b));
                setCurrentVerse(prevChapVerses[prevChapVerses.length - 1]);
                setOpenCommentaryIndex(0);
            }
        }
    };

    // Check if buttons should be disabled
    const isFirstVerse = currentChapter === chapterKeys[0] && currentVerse === verseKeys[0];
    const isLastVerse = currentChapter === chapterKeys[chapterKeys.length - 1] && currentVerse === verseKeys[verseKeys.length - 1];

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 pt-24 lg:pt-28 flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 flex flex-col gap-4 pt-10 lg:gap-6 lg:sticky lg:top-28 lg:h-[calc(100vh-140px)]">

                    {/* Chapter Selection */}
                    <div className="bg-[#1C1C1C]/50 backdrop-blur-md border  border-white/5 rounded-3xl overflow-hidden flex flex-col lg:h-auto lg:shrink-0 transition-all duration-300">
                        <button
                            onClick={() => setIsChapterExpanded(!isChapterExpanded)}
                            className="w-full pl-4 pr-4 h-10 pt-5 flex items-center justify-between lg:pointer-events-none"
                        >
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] lg:w-full lg:text-center">Chapter</div>
                            <span className={`lg:hidden transition-transform duration-300 ${isChapterExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        <div className={`px-4 pb-4 lg:px-5 lg:pb-5 transition-all duration-300 ${isChapterExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'} overflow-hidden lg:overflow-visible`}>
                            <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-4 gap-2 lg:max-h-[220px] lg:overflow-y-auto lg:pr-1 custom-scrollbar">
                                {chapterKeys.map((cKey) => (
                                    <button
                                        key={cKey}
                                        onClick={() => {
                                            setCurrentChapter(cKey);
                                            const chapterVerses = Object.keys((gitaData.chapters as any)[cKey].verses).sort((a, b) => Number(a) - Number(b));
                                            setCurrentVerse(chapterVerses[0]);
                                            setOpenCommentaryIndex(0);
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
                            className="w-full pl-4 pr-4 h-10 pt-5  lg:p-5 flex items-center justify-between lg:pointer-events-none"
                        >
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] lg:w-full lg:text-center">Verses</div>
                            <span className={`lg:hidden transition-transform duration-300 ${isVerseExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        <div className={`px-4 pb-4 lg:px-5 lg:pb-5 flex-grow flex flex-col transition-all duration-300 ${isVerseExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'} overflow-hidden lg:overflow-visible min-h-0`}>
                            <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-4 gap-2 overflow-y-auto pr-1 custom-scrollbar flex-grow">
                                {verseKeys.map((vKey) => (
                                    <button
                                        key={vKey}
                                        onClick={() => {
                                            setCurrentVerse(vKey);
                                            setOpenCommentaryIndex(0);
                                        }}
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

                {/* Main Content Area */}
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
            </div>
        </main>
    );
}