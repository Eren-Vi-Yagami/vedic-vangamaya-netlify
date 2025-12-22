'use client';
import { useState } from 'react';
import { Lato } from 'next/font/google';
import gitaData from '../../../test-gita.json';
import { useParams, useRouter } from 'next/navigation';

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

export default function GitaCommentaryPage() {
    const params = useParams();
    const router = useRouter();

    const currentChapter = (params.chapter as string) || "1";
    const currentVerse = (params.verse as string) || "1";

    // State for accordion-style commentary display
    // This resets on navigation, which is the desired behavior for commentaries (new verse, close comments)
    const [openCommentaryIndex, setOpenCommentaryIndex] = useState<number | null>(0);

    // Get current chapter data for navigation keys
    const chapterKeys = Object.keys(gitaData.chapters).sort((a, b) => Number(a) - Number(b));
    const currentChapterData = (gitaData.chapters as any)[currentChapter] || (gitaData.chapters as any)["1"];
    const verseKeys = Object.keys(currentChapterData.verses).sort((a, b) => Number(a) - Number(b));

    // Safety check for invalid verse
    const verse = (currentChapterData.verses[currentVerse] || currentChapterData.verses["1"]) as VerseJSON;

    // Derived commentaries array
    const commentaries = verse.commentaries
        ? Object.values(verse.commentaries)
        : [];

    const navigateTo = (chap: string, ver: string) => {
        router.push(`/gitacommentaries/${chap}/${ver}`, { scroll: false });
    };

    const handleNext = () => {
        const currentVerseIndex = verseKeys.indexOf(currentVerse);
        if (currentVerseIndex < verseKeys.length - 1) {
            navigateTo(currentChapter, verseKeys[currentVerseIndex + 1]);
        } else {
            const currentChapterIndex = chapterKeys.indexOf(currentChapter);
            if (currentChapterIndex < chapterKeys.length - 1) {
                const nextChapKey = chapterKeys[currentChapterIndex + 1];
                const nextChapVerses = Object.keys((gitaData.chapters as any)[nextChapKey].verses).sort((a, b) => Number(a) - Number(b));
                navigateTo(nextChapKey, nextChapVerses[0]);
            }
        }
    };

    const handlePrevious = () => {
        const currentVerseIndex = verseKeys.indexOf(currentVerse);
        if (currentVerseIndex > 0) {
            navigateTo(currentChapter, verseKeys[currentVerseIndex - 1]);
        } else {
            const currentChapterIndex = chapterKeys.indexOf(currentChapter);
            if (currentChapterIndex > 0) {
                const prevChapKey = chapterKeys[currentChapterIndex - 1];
                const prevChapVerses = Object.keys((gitaData.chapters as any)[prevChapKey].verses).sort((a, b) => Number(a) - Number(b));
                navigateTo(prevChapKey, prevChapVerses[prevChapVerses.length - 1]);
            }
        }
    };

    // Check if buttons should be disabled
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