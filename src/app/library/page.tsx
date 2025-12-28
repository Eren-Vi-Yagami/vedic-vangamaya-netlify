"use client";

import { useState, useMemo } from "react";
import BookCard from "@/components/BookCard";
import { Ubuntu } from "next/font/google";
import { Nunito } from "next/font/google";
import bookData from "../book_data.json";

const ubuntu = Ubuntu({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

const nunito = Nunito({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

interface BookTitle {
    sa: string;
    en: string;
}

interface Author {
    id: string;
    name: string;
}

interface FilterItem {
    id: string;
    label: string;
}

interface JsonBook {
    id: string;
    title: BookTitle;
    authors: Author[];
    categories: FilterItem[];
    sects: FilterItem[];
    language: string[];
    description: string;
    status: string;
    slug: string;
    coverUrl?: string; // Adding optional coverUrl as it might be added later
}

export default function LibraryPage() {
    const books = bookData.books as JsonBook[];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [selectedSects, setSelectedSects] = useState<string[]>([]);

    // Collapsible states
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isAuthorOpen, setIsAuthorOpen] = useState(false);
    const [isSectOpen, setIsSectOpen] = useState(false);

    // Dynamic Filter Extraction
    const categoriesList = useMemo(() => {
        const cats = new Set<string>();
        books.forEach(book => book.categories.forEach(cat => cats.add(cat.label)));
        return Array.from(cats).sort();
    }, [books]);

    const authorsList = useMemo(() => {
        const auths = new Set<string>();
        books.forEach(book => book.authors.forEach(auth => auth.name && auths.add(auth.name)));
        return Array.from(auths).sort();
    }, [books]);

    const sectsList = useMemo(() => {
        const sects = new Set<string>();
        books.forEach(book => book.sects.forEach(sect => sects.add(sect.label)));
        return Array.from(sects).sort();
    }, [books]);

    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            const matchesSearch = book.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.title.sa.toLowerCase().includes(searchQuery.toLowerCase());

            const bookCatLabels = book.categories.map(c => c.label);
            const matchesCategory = selectedCategories.length === 0 ||
                selectedCategories.some(cat => bookCatLabels.includes(cat));

            const bookAuthNames = book.authors.map(a => a.name);
            const matchesAuthor = !selectedAuthor || bookAuthNames.includes(selectedAuthor);

            const bookSectLabels = book.sects.map(s => s.label);
            const matchesSect = selectedSects.length === 0 ||
                selectedSects.some(sect => bookSectLabels.includes(sect));

            return matchesSearch && matchesCategory && matchesAuthor && matchesSect;
        });
    }, [books, searchQuery, selectedCategories, selectedAuthor, selectedSects]);

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const toggleSect = (sect: string) => {
        setSelectedSects((prev) =>
            prev.includes(sect) ? prev.filter((s) => s !== sect) : [...prev, sect]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedCategories([]);
        setSelectedAuthor("");
        setSelectedSects([]);
    };

    const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedAuthor || selectedSects.length > 0;

    return (
        <main className={`min-h-screen bg-background text-foreground px-4 py-8 pt-28 ${ubuntu.className}`}>
            <div className="max-w-7xl mx-auto">
                <section className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-3">
                        Browse Library
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Discover sacred texts through multiple browsing options
                    </p>
                </section>

                <section className="mb-8">
                    <div className="relative group max-w-3xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by book name (Rig Veda, Gita, Purana…)"
                            className="w-full rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                            aria-label="Search books by name"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                            🔍
                        </span>
                    </div>
                </section>

                <section className="mb-8 space-y-4">
                    {/* Category Collapsible */}
                    <div className={`bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden ${nunito.className}`}>
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <h3 className={`text-lg font-semibold text-veda-primary ${nunito.className}`}>Category</h3>
                                {selectedCategories.length > 0 && (
                                    <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {selectedCategories.length}
                                    </span>
                                )}
                            </div>
                            <span className={`transform transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}>
                                🔽
                            </span>
                        </button>
                        {isCategoryOpen && (
                            <div className="p-4 pt-0">
                                <span className="text-xs text-gray-400 mb-3 block">Multi-select</span>
                                <div className="flex flex-wrap gap-2">
                                    {categoriesList.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => toggleCategory(category)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategories.includes(category)
                                                ? "bg-primary-500 text-white border-2 border-primary-400 shadow-lg scale-105"
                                                : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:border-white/30"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                    {categoriesList.length === 0 && <p className="text-gray-500 text-sm">No categories found.</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Author Collapsible */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
                        <button
                            onClick={() => setIsAuthorOpen(!isAuthorOpen)}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <h3 className={`text-lg font-semibold text-veda-primary ${nunito.className}`}>Author</h3>
                                {selectedAuthor && (
                                    <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        1
                                    </span>
                                )}
                            </div>
                            <span className={`transform transition-transform duration-300 ${isAuthorOpen ? "rotate-180" : ""}`}>
                                🔽
                            </span>
                        </button>
                        {isAuthorOpen && (
                            <div className="p-4 pt-0">
                                <span className="text-xs text-gray-400 mb-3 block">Single-select</span>
                                <select
                                    value={selectedAuthor}
                                    onChange={(e) => setSelectedAuthor(e.target.value)}
                                    className="w-full rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 hover:border-white/30"
                                >
                                    <option value="" className="bg-gray-900">All Authors</option>
                                    {authorsList.map((author) => (
                                        <option key={author} value={author} className="bg-gray-900">
                                            {author}
                                        </option>
                                    ))}
                                </select>
                                {authorsList.length === 0 && <p className="text-gray-500 text-sm mt-3">No authors found.</p>}
                            </div>
                        )}
                    </div>

                    {/* Sect Collapsible */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
                        <button
                            onClick={() => setIsSectOpen(!isSectOpen)}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <h3 className={`text-lg font-semibold text-veda-primary ${nunito.className}`}>Sect / Tradition</h3>
                                {selectedSects.length > 0 && (
                                    <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {selectedSects.length}
                                    </span>
                                )}
                            </div>
                            <span className={`transform transition-transform duration-300 ${isSectOpen ? "rotate-180" : ""}`}>
                                🔽
                            </span>
                        </button>
                        {isSectOpen && (
                            <div className="p-4 pt-0">
                                <span className="text-xs text-gray-400 mb-3 block">Multi-select</span>
                                <div className="flex flex-wrap gap-2">
                                    {sectsList.map((sect) => (
                                        <button
                                            key={sect}
                                            onClick={() => toggleSect(sect)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedSects.includes(sect)
                                                ? "bg-veda-accent text-white border-2 border-veda-accent/70 shadow-md"
                                                : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:border-white/30"
                                                }`}
                                        >
                                            {sect}
                                        </button>
                                    ))}
                                    {sectsList.length === 0 && <p className="text-gray-500 text-sm">No sects found.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-2 bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 rounded-full text-primary-400 font-semibold text-sm">
                            {filteredBooks.length} {filteredBooks.length === 1 ? "result" : "results"}
                        </span>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-full text-gray-300 hover:text-white font-medium text-sm transition-all duration-300"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>

                {filteredBooks.length > 0 ? (
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="transform transition-all duration-300 hover:scale-105"
                            >
                                <BookCard
                                    id={book.id}
                                    title={book.title.en}
                                    author={book.authors.map(a => a.name).join(", ")}
                                    coverUrl={book.coverUrl || "/images/bhagwatgita.png"} // Fallback image
                                    slug={book.slug}
                                    status={book.status.toUpperCase()}
                                    category={book.categories[0]?.label}
                                    className={ubuntu.className}
                                />
                            </div>
                        ))}
                    </section>
                ) : (
                    <section className="py-20 text-center">
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 border border-white/10 max-w-lg mx-auto">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-2xl font-semibold text-veda-primary mb-3">
                                No books found
                            </h3>
                            <p className="text-gray-300 mb-6">
                                No books match the selected filters. Try adjusting your search criteria.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
