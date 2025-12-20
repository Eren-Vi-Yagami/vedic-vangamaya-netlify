import { notFound } from "next/navigation";
import gitaJson from "@/app/test-gita.json";
import { Metadata } from "next";
import BookDetailPageClient, { Chapter, BookMetadata } from "@/app/readingpart";

// Mock Book Data Store
const books: Record<string, BookMetadata> = {
    rigveda: {
        title: "Rig Veda",
        author: "Apaurusheya",
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
        author: "Valmiki",
        status: "COMING SOON",
        coverUrl: "/images/ramayana_cover.jpeg",
        description: "The Ramayana is one of the two major Sanskrit epics of ancient India. It narrates the life of Rama.",
        language: "Sanskrit",
        category: "Itihas"
    },
    mahabharata: {
        title: "Mahabharata",
        author: "Vyasa",
        status: "COMING SOON",
        coverUrl: "/images/mahabharata.png",
        description: "The Mahabharata is one of the two major Sanskrit epics of ancient India, the other being the Rāmāyaṇa.",
        language: "Sanskrit",
        category: "Itihas"
    },
    bhagwatgita: {
        title: "Shrimad Bhagwat Gita",
        author: "Vyasa",
        status: "AVAILABLE",
        coverUrl: "/images/bhagwatgita.png",
        description: "The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata.",
        language: "Sanskrit",
        category: "Gita"
    }
};

type Props = {
    params: Promise<{ slug: string }>;
};

// Map JSON function
function mapGitaJsonToChapters(json: any): Chapter[] {
    if (!json || !json.chapters) return [];
    return Object.values(json.chapters).map((ch: any) => ({
        title: ch.title.en,
        content: `Chapter ${ch.number}: ${ch.title.sa}`,
        verses: Object.values(ch.verses || {}).map((v: any) => ({
            id: v.number,
            text: v.languages.sa.text,
            transliteration: v.languages.sa.transliteration || ""
        }))
    }));
}

// Generate SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const book = books[slug];

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

export default async function BookPage({ params }: Props) {
    const { slug } = await params;
    const book = books[slug];

    if (!book) {
        return notFound();
    }

    let chapters: Chapter[] = [];

    try {
        // Temporary: Map everything to Gita JSON for testing as requested
        chapters = mapGitaJsonToChapters(gitaJson);
    } catch (error) {
        console.error("Failed to load or parse book data:", error);
    }

    return (
        <BookDetailPageClient
            bookMetadata={book}
            chapters={chapters}
            showCommentaryButton={slug === "bhagwatgita"}
        />
    );
}
