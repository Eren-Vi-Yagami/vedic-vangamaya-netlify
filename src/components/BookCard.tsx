/**
 * BookCard Component for Vaidika Vangamaya
 * 
 * A reusable card component that displays book information in an attractive,
 * glassmorphic design. Provides visual representation of texts with cover
 * images, titles, and author information.
 * 
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Glassmorphic styling with backdrop blur and transparency
 * - Hover effects for enhanced user interaction
 * - Clickable card that navigates to the book's detail page
 * - Fallback handling for missing cover images
 * 
 * @component
 * @module BookCard
 */

import Image from 'next/image';
import Link from 'next/link';
import { StaticImageData } from 'next/image';
import { Ubuntu } from "next/font/google";

const booksFont = Ubuntu({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

/**
 * BookCard Props Interface
 * 
 * Defines the shape of data required to render a book card.
 * Supports both string URLs and imported image data for flexibility.
 */
interface BookCardProps {
  /**
   * Unique identifier for the book
   * Used for React key props and potential database operations
   */
  id: string;

  /**
   * Title of the book/text
   * Displayed prominently on the card
   */
  title: string;

  /**
   * Author or composer of the text
   * Displayed as secondary information below the title
   */
  author: string;

  /**
   * Optional cover image URL or imported image data
   * Supports both external URLs and local imported images
   * Falls back gracefully if not provided
   */
  coverUrl?: string | StaticImageData;

  /**
   * URL-friendly slug for navigation
   * Used to construct the detail page URL: /books/{slug}
   */
  slug: string;

  /**
   * Optional status of the book (e.g., "COMING SOON", "AVAILABLE", "NOT AVAILABE")
   * Displays a small badge if provided
   */
  status?: string;
  category?: string;
  className?: string;
}

/**
 * BookCard Component
 * 
 * Renders an individual book card with cover image, title, and author.
 * Uses Next.js Image component for optimized image loading and Link for
 * client-side navigation to book detail pages.
 * 
 * @param {BookCardProps} props - Component properties
 * @returns {JSX.Element} The rendered book card
 */
export default function BookCard({ id, title, author, coverUrl, slug, status, category, className }: BookCardProps) {
  return (
    <Link
      href={`/books/${slug}`}
      className={`block group transition-all duration-300 hover:scale-105 ${className || ''}`}
      aria-label={`Read ${title} by ${author}`}
    >
      <div className= "relative bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-veda-accent/50">
        {coverUrl && (
          <div className="relative mb-3 overflow-hidden rounded-md">
            <Image
              src={coverUrl}
              alt={`Cover of ${title}`}
              width={200}
              height={300}
              className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
              priority={false} // Allow lazy loading for better performance
              loading="lazy"
            />
          </div>
        )}

        <h3 className={`text-xl font-semibold text-white truncate group-hover:text-veda-accent transition-colors ${booksFont.className}`}>
          {title}
        </h3>

        {/* Status Badge - appears on top of cover image */}
        {status && (
          <div className="absolute top-2 right-2 bg-amber-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full border border-white/20">
            {status}
          </div>
        )}

        {category && (
          <div className="absolute bottom-6 right-6 bg-[#FFC226]/90 backdrop-blur-sm text-white text-2xs font-semibold px-2 py-1 rounded-full border border-white/20">
            {category}
          </div>
        )}

        <p className="text-sm text-gray-300 truncate group-hover:text-gray-200 transition-colors">
          {author}
        </p>
      </div>
    </Link>
  );
}
