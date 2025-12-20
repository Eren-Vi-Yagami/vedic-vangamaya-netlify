"use client";

/**
 * BookCarousel Component for Vaidika Vangamaya
 * 
 * Creates an endless horizontal scrolling carousel of book covers.
 * Features smooth animation, hover effects, and clickable navigation.
 * Perfect for showcasing the library collection in a dynamic, engaging way.
 * 
 * Design Philosophy:
 * - Creates a mesmerizing, temple-library-like experience
 * - Ancient wisdom continuously flows across the screen
 * - Smooth, contemplative animation matching scholarly aesthetic
 * - Glassmorphic design consistent with the overall theme
 * 
 * @component
 * @module BookCarousel
 */

import Image from 'next/image';
import Link from 'next/link';
import { StaticImageData } from 'next/image';

/**
 * Book Interface for Carousel
 * 
 * Defines the essential data needed for each book in the carousel.
 * Streamlined for the scrolling display format.
 */
interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string | StaticImageData;
  slug: string;
  status?: string;
}

/**
 * BookCarousel Props Interface
 * 
 * Defines the configuration options for the carousel component.
 */
interface BookCarouselProps {
  /**
   * Array of books to display in the carousel
   * The component will duplicate these for seamless looping
   */
  books: Book[];
  
  /**
   * Animation speed in seconds
   * Controls how fast the books scroll across the screen
   * Default: 30s for contemplative, scholarly feel
   */
  speed?: number;
  
  /**
   * Pause animation on hover
   * Allows users to interact with individual books
   * Default: true
   */
  pauseOnHover?: boolean;
}

/**
 * BookCarousel Component
 * 
 * Renders an endless horizontal scrolling carousel of book covers.
 * Uses CSS animations for smooth performance and includes hover effects.
 * 
 * @param {BookCarouselProps} props - Component properties
 * @returns {JSX.Element} The rendered carousel
 */
export default function BookCarousel({ 
  books, 
  speed = 30, 
  pauseOnHover = true 
}: BookCarouselProps) {
  // Create duplicate array for seamless infinite scroll
  const duplicatedBooks = [...books, ...books, ...books];
  
  // Calculate animation duration based on number of books and speed
  const animationDuration = speed;
  
  return (
    <div className="w-full py-8 overflow-hidden relative">
      {/* Decorative gradient edges */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-stone-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-stone-950 to-transparent z-10 pointer-events-none" />
      
      <div 
        className={`flex items-center ${pauseOnHover ? 'group' : ''}`}
        style={{
          animation: `scroll ${animationDuration}s linear infinite`,
          width: `${duplicatedBooks.length * 200}px`, // Approximate width per book
        }}
      >
        {duplicatedBooks.map((book, index) => (
          <div
            key={`${book.id}-${index}`}
            className="flex-shrink-0 mx-4 transform transition-all duration-300 hover:scale-110 hover:z-20"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Link 
              href={`/books/${book.slug}`}
              className="block group/book"
              aria-label={`Read ${book.title} by ${book.author}`}
            >
              <div className="relative">
                {/* Book Cover */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-3 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover/book:border-amber-600/50 w-40 h-60 flex flex-col">
                  <div className="relative mb-2 overflow-hidden rounded-md flex-1">
                    <Image
                      src={book.coverUrl}
                      alt={`Cover of ${book.title}`}
                      width={160}
                      height={240}
                      className="w-full h-full object-cover group-hover/book:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Status Badge */}
                    {book.status && (
                      <div className="absolute top-1 right-1 bg-amber-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-white/20">
                        {book.status}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-white truncate group-hover/book:text-amber-600 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-xs text-gray-300 truncate group-hover/book:text-gray-200 transition-colors">
                      {book.author}
                    </p>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent opacity-0 group-hover/book:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${100 / 3}%);
          }
        }
        
        .group:hover > div {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}