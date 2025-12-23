/**
 * BookPage - Dynamic Book Detail Page (Server Component)
 * 
 * This is the main entry point for viewing individual book details.
 * It handles dynamic routing via the [slug] parameter and renders
 * the BookDetailPageClient component with loaded book data.
 * 
 * ============================================================================
 * ARCHITECTURE: SERVER vs CLIENT COMPONENTS
 * ============================================================================
 * 
 * This file is a SERVER COMPONENT (no 'use client' directive) which enables:
 * - **SEO**: Content is rendered on the server, making it crawlable by search engines
 * - **Metadata Generation**: Dynamic title and description for each book
 * - **Data Loading**: Secure server-side data fetching (future API integration)
 * - **Performance**: Large JSON parsing happens on server, not in browser
 * 
 * The actual interactive UI (accordions, sidebars) is delegated to the
 * BookDetailPageClient component which IS a client component.
 * 
 * ============================================================================
 * URL STRUCTURE
 * ============================================================================
 * Route Pattern: /books/[slug]
 * Examples:
 * - /books/bhagwatgita → Shrimad Bhagwat Gita
 * - /books/ramayana → Ramayana
 * - /books/rigveda → Rig Veda
 * 
 * The slug must match a key in the `books` registry below.
 * Invalid slugs trigger Next.js's notFound() for proper 404 handling.
 * 
 * ============================================================================
 * DATA FLOW
 * ============================================================================
 * 1. URL slug is extracted from params
 * 2. Book metadata is looked up from the local registry
 * 3. Chapter/verse data is loaded and transformed from JSON
 * 4. Both are passed as props to the client component for rendering
 * 
 * ============================================================================
 * FUTURE IMPROVEMENTS
 * ============================================================================
 * - Replace static `books` registry with database/CMS integration
 * - Add per-book JSON files instead of using test-gita.json for all
 * - Implement caching strategy for large book data
 * - Add ISR (Incremental Static Regeneration) for hybrid performance
 * 
 * @module books/[slug]/page
 */

import { notFound } from "next/navigation";
import gitaJson from "@/app/test-gita.json";
import { Metadata } from "next";
import BookDetailPageClient, { Chapter, BookMetadata } from "@/app/readingpart";

/**
 * Book Metadata Registry
 * 
 * Static registry of all available books in the library.
 * Each entry contains metadata displayed in the UI and for SEO.
 * 
 * Currently using hardcoded data for development/demo purposes.
 * In production, this would be fetched from a database or CMS.
 * 
 * Key Design Decisions:
 * - Keys are URL-friendly slugs (lowercase, no spaces)
 * - coverUrl paths are relative to public/ directory
 * - status indicates content availability ("AVAILABLE" vs "COMING SOON")
 * - category enables future filtering/grouping features
 */
const books: Record<string, BookMetadata> = {
    rigveda: {
        title: "Rig Veda",
        author: "Apaurusheya",  // "Not of human origin" - traditional attribution
        status: "COMING SOON",
        coverUrl: "/images/rigveda.png",
        description: "The Rig Veda is a collection of 10 books (mandalas) of ancient Indian hymns. It is the oldest known Vedic Sanskrit text.",
        language: "Sanskrit",
        category: "Veda"
    },
    samaveda: {
        title: "Sama Veda",
        author: "Apaurusheya",
        status: "COMING SOON",
        coverUrl: "/images/samaveda.png",
        description: "The Sama Veda is the Veda of melodies and chants. It is an ancient Vedic Sanskrit text and part of the scriptures of Hinduism.",
        language: "Sanskrit",
        category: "Veda"
    },
    ramayana: {
        title: "Ramayana",
        author: "Valmiki",  // The sage who composed the original Sanskrit epic
        status: "COMING SOON",
        coverUrl: "/images/ramayana_cover.jpeg",
        description: "The Ramayana is one of the two major Sanskrit epics of ancient India. It narrates the life of Rama.",
        language: "Sanskrit",
        category: "Itihas"  // "History" - traditional classification for epics
    },
    mahabharata: {
        title: "Mahabharata",
        author: "Vyasa",  // The sage who compiled the Vedas and composed the Mahabharata
        status: "COMING SOON",
        coverUrl: "/images/mahabharata.png",
        description: "The Mahabharata is one of the two major Sanskrit epics of ancient India, the other being the Rāmāyaṇa.",
        language: "Sanskrit",
        category: "Itihas"
    },
    bhagwatgita: {
        title: "Shrimad Bhagwat Gita",
        author: "Vyasa",  // Part of the Mahabharata, hence same author
        status: "AVAILABLE",  // Only fully available text currently
        coverUrl: "/images/bhagwatgita.png",
        description: "The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata.",
        language: "Sanskrit",
        category: "Gita"
    }
};

/**
 * Props type for Next.js App Router page components
 * 
 * In App Router, params is wrapped in a Promise to support
 * React Server Components and streaming rendering.
 */
type Props = {
    params: Promise<{ slug: string }>;
};

/**
 * Data Transformation: JSON to Chapter Array
 * 
 * Converts the raw JSON structure from test-gita.json into the Chapter[]
 * format expected by BookDetailPageClient. This serves as an adapter
 * between the data source and the UI component.
 * 
 * Current Implementation:
 * - Uses the Gita JSON structure for ALL books (temporary for testing)
 * - Extracts English titles and Sanskrit verse text
 * - Gracefully handles missing transliteration with empty string fallback
 * 
 * Future Improvements:
 * - Create separate JSON files for each book
 * - Add language selection support (show Hindi, English, etc.)
 * - Implement proper error handling for malformed data
 * 
 * @param {any} json - Raw JSON data with chapters and verses
 * @returns {Chapter[]} Transformed array suitable for UI rendering
 */
function mapGitaJsonToChapters(json: any): Chapter[] {
    // Defensive check: return empty array if JSON is malformed
    if (!json || !json.chapters) return [];

    // Transform each chapter object into our Chapter type
    return Object.values(json.chapters).map((ch: any) => ({
        title: ch.title.en,  // English chapter title for the accordion header
        content: `Chapter ${ch.number}: ${ch.title.sa}`,  // Sanskrit title as description
        // Transform each verse within the chapter
        verses: Object.values(ch.verses || {}).map((v: any) => ({
            id: v.number,
            text: v.languages.sa.text,  // Sanskrit verse text
            transliteration: v.languages.sa.transliteration || ""  // Fallback for missing transliteration
        }))
    }));
}

/**
 * Dynamic SEO Metadata Generator
 * 
 * Next.js App Router calls this function at build/request time to generate
 * page-specific metadata. This enables proper SEO for each book page.
 * 
 * The metadata includes:
 * - Dynamic title with book name and site branding
 * - Book description for search engine snippets
 * 
 * For invalid slugs, returns a "Book Not Found" title which will be
 * displayed on the 404 page triggered by notFound() in the page component.
 * 
 * @param {Props} props - Contains the slug parameter from the URL
 * @returns {Promise<Metadata>} SEO metadata for the page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const book = books[slug];

    // Handle invalid book slugs gracefully
    if (!book) {
        return {
            title: "Book Not Found",
        };
    }

    return {
        title: `${book.title} | Vaidika Vangamaya`,
        description: book.description,
    };
}

/**
 * BookPage Component - Server-Side Page Renderer
 * 
 * The main async server component for rendering book detail pages.
 * This is where data loading and transformation happens before
 * passing to the client component for interactive rendering.
 * 
 * Execution Flow:
 * 1. Extract slug from URL parameters
 * 2. Look up book metadata from registry
 * 3. Return 404 if book not found
 * 4. Load and transform chapter data
 * 5. Render client component with all data
 * 
 * Special Behavior for Bhagavad Gita:
 * - Shows "Read Commentaries" button (showCommentaryButton=true)
 * - Links to the dedicated /gitacommentaries section
 * 
 * @param {Props} props - Contains the slug parameter from the URL
 * @returns {JSX.Element} The rendered book detail page
 */
export default async function BookPage({ params }: Props) {
    const { slug } = await params;
    const book = books[slug];

    // Trigger Next.js 404 page for unknown book slugs
    if (!book) {
        return notFound();
    }

    // Initialize chapters array for the book content
    let chapters: Chapter[] = [];

    try {
        // TEMPORARY IMPLEMENTATION:
        // Currently all books use the Gita JSON for testing purposes.
        // In production, this would load the specific book's data file
        // based on the slug (e.g., `${slug}.json`)
        chapters = mapGitaJsonToChapters(gitaJson);
    } catch (error) {
        // Log error but continue with empty chapters
        // This allows the page to render with "No chapters available" message
        console.error("Failed to load or parse book data:", error);
    }

    // Render the client component with all necessary data
    // showCommentaryButton enables the "Read Commentaries" link for Gita only
    return (
        <BookDetailPageClient
            bookMetadata={book}
            chapters={chapters}
            showCommentaryButton={slug === "bhagwatgita"}
        />
    );
}
