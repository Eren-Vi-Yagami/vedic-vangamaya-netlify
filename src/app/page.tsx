/**
 * Home Page Component for Vaidika Vangamaya
 * 
 * The main landing page that serves as the entry point for users.
 * Features a hero section with compelling messaging, library statistics,
 * search functionality, featured books showcase, and user testimonials.
 * 
 * Design Philosophy:
 * - Creates immediate visual impact with gradient text and glassmorphic elements
 * - Guides users through the platform's value proposition step by step
 * - Builds trust through statistics and social proof
 * - Provides clear calls to action for exploration
 * 
 * @component
 * @module page
 */

import Image from "next/image";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/Button";
import BookCard from "@/components/BookCard";
import BookCarousel from "@/components/BookCarousel";
import StatCard from "@/components/StatCard";
import { Ubuntu } from "next/font/google";

const booksFont = Ubuntu({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});



// Static assets served from public/images (stable, Netlify-friendly)

/**
 * Featured Books Collection
 * 
 * Currently using mock data for demonstration purposes.
 * These represent the most popular or recently added texts in the library.
 * In production, this data would be fetched from the database based on:
 * - User engagement metrics
 * - Recent additions
 * - Editorial curation
 * - User ratings and reviews
 */

const bg = () => {
  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //         const handleScroll = () => {
  //             setIsScrolled(window.scrollY > 20);
  //         };

  //         window.addEventListener("scroll", handleScroll);
  //         return () => window.removeEventListener("scroll", handleScroll);
  //     }, []);
}

const featuredBooks = [
  {
    id: "1",
    status: "COMING SOON",
    category: "Veda",
    title: "Rig Veda",
    author: "Apaurusheya",
    pendown: "Many",
    coverUrl: "/images/rigveda.png",
    slug: "rigveda",
    description: "The Rig Veda is a collection of 13 books of ancient Indian literature. It is a part of the Vaidika literature and is considered to be the oldest and most important of the ancient Indian texts. The Rig Veda contains a wealth of knowledge about the lives of the gods, the gods' roles in the world, and the ways in which the gods interact with humans. It is a valuable resource for anyone interested in the history of Indian literature."
  },
  {
    id: "2",
    title: "Sama Veda",
    status: "COMING SOON",
    category: "Veda",
    author: "Apaurusheya",
    coverUrl: "/images/samaveda.png",
    pendown: "Many",
    slug: "samaveda",
    description: "The Rig Veda is a collection of 13 books of ancient Indian literature. It is a part of the Vaidika literature and is considered to be the oldest and most important of the ancient Indian texts. The Rig Veda contains a wealth of knowledge about the lives of the gods, the gods' roles in the world, and the ways in which the gods interact with humans. It is a valuable resource for anyone interested in the history of Indian literature."
  },
  {
    id: "3",
    title: "Ramayana",
    status: "COMING SOON",
    category: "ITIHAS",
    author: "Valmiki",
    coverUrl: "/images/ramayana_cover.jpeg",
    slug: "ramayana",
    description: "The epic tale of Lord Rama's journey and victory over evil"
  },
  {
    id: "4",
    status: "COMING SOON",
    category: "ITIHAS",
    title: "Mahabharata",
    author: "Vyasa",
    coverUrl: "/images/mahabharata.png",
    slug: "mahabharata",
    description: "The great Indian epic of the Kurukshetra war and dharma"
  },
  {
    id: "5",
    title: "Shrimad Bhagwat Gita",
    status: "COMING SOON",
    category: "GITA",
    author: "Vyasa",
    coverUrl: "/images/bhagwatgita.png",
    slug: "bhagwatgita",
    description: "The glorious words of Krishna"
  },
];

/**
 * Library Statistics
 * 
 * Key metrics that demonstrate the scale and depth of the collection.
 * These numbers should be dynamically generated from the database
 * to reflect the actual current state of the library.
 * 
 * Current values are placeholder estimates for demonstration.
 */
const stats = [
  { value: "0", label: "Books", description: "Ancient texts and commentaries" },
  { value: "0", label: "Authors", description: "Ancient sages and modern scholars" },
  { value: "3", label: "Languages", description: "Sanskrit, Hindi, English, and more" },
];

/**
 * Platform Workflow Steps
 * 
 * Explains the three-step process for users who want to contribute
 * content or understand how texts are processed and made available.
 * This helps set expectations and encourages community participation.
 */
const steps = [
  {
    title: "Upload",
    description: "Add your PDF/EPUB and we handle the rest.",
    icon: "/step1.svg",
    details: "Support for multiple formats with automatic validation"
  },
  {
    title: "Process",
    description: "Our engine extracts text, creates metadata and indexes.",
    icon: "/step2.svg",
    details: "AI-powered text extraction and semantic analysis"
  },
  {
    title: "Read",
    description: "Enjoy a fast, beautiful reading experience.",
    icon: "/step3.svg",
    details: "Optimized for readability with scholarly tools"
  },
];

/**
 * User Testimonials
 * 
 * Social proof to build trust and credibility with potential users.
 * These should be replaced with actual user reviews from the database
 * and include user names, photos, and credentials where appropriate.
 */
const testimonials = [
  {
    text: "A breathtaking journey through ancient wisdom. The UI makes reading a joy.",
    author: "Dr. Priya Sharma",
    role: "Sanskrit Scholar",
    rating: 5
  },
  {
    text: "Finally, a modern way to access these timeless texts. The search functionality is incredible.",
    author: "Arjun Patel",
    role: "Graduate Student",
    rating: 5
  },
  {
    text: "The glassmorphic design perfectly complements the sacred content. A masterpiece.",
    author: "Dr. Vikram Desai",
    role: "Digital Humanities Researcher",
    rating: 5
  }
];

/**
 * Home Page Component
 * 
 * The main landing page that serves as the user's first impression
 * of the Vaidika Vangamaya digital library. Organized into clear sections
 * that guide the user through the platform's value proposition.
 * 
 * @returns {JSX.Element} The complete home page layout
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 py-8 pt-28 relative">

      {/* 
        ====================================================================
        BANNER BACKGROUND - PARALLAX EFFECT
        ====================================================================
        Sacred banner image with parallax scrolling effect
        Background stays fixed while content scrolls over it
        Creates beautiful layered visual experience
      */}
      <div className="fixed w-100% h-90  inset-0 z-0 overflow-hidden">
        <Image
          src={"/images/banner.png"}
          alt="Sacred Vedic banner"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Gradient overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950/80" />
      </div>

      {/* Content wrapper with higher z-index */}
      <div className="relative bg-black z-10 w-320 flex flex-col items-center mt-[40vh]">

        {/* 
          ====================================================================
          SPACER SECTION - PARALLAX EFFECT
          ====================================================================
          Creates initial viewport height so background image is fully visible
          Content starts scrolling after this section
        */}
        <section className="h-10 -mt-5 w-full mx-auto flex items-center justify-center bg-black/10 backdrop-blur-sm ">
          {/* Empty section that creates the parallax effect */}
        </section>


        {/* 
        ====================================================================
        HERO SECTION
        ====================================================================
        The main value proposition with compelling headline and CTAs
        (Header removed - logo now embedded in navbar)
      */}

        {/* 
        ====================================================================
        HERO SECTION
        ====================================================================
        The main value proposition with compelling headline and CTAs
      */}
        <section className="w-full max-w-4xl text-center mb-16">
          <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-4">
            Discover the Wisdom of Ages
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            Explore thousands of Vaidika scriptures, epics, and commentaries in a premium,
            glass‑morphic interface designed for modern readers.
          </p>
          <div className="flex justify-center space-x-4">
            {/*<Button variant="primary" className="px-8 py-3 text-lg hover:scale-105 transition-transform">
              Browse Library
            </Button>
            <Button variant="secondary" className="px-8 py-3 text-lg hover:scale-105 transition-transform">
              About Us
            </Button>*/}
          </div>
        </section>

        {/* 
        ====================================================================
        BOOK CAROUSEL SECTION
        ====================================================================
        Endless horizontal scrolling showcase of sacred texts
        Creates mesmerizing, temple-library-like experience
      */}
        <section className="w-full mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8 text-veda-primary">
            Sacred Texts Collection
          </h3>
          <BookCarousel
            books={featuredBooks}
            speed={40}
            pauseOnHover={true}
          />
        </section>

        {/* 
        ====================================================================
        STATISTICS SECTION
        ====================================================================
        Builds credibility with impressive collection metrics
      */}
        <section className="w-full max-w-5xl mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </section>

        {/* 
        ====================================================================
        SEARCH SECTION
        ====================================================================
        Prominent search functionality for immediate content discovery
      */}
        <section className="w-full max-w-3xl mb-12">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search scriptures, authors, topics..."
              className="w-full rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 group-hover:border-white/30"
              aria-label="Search scriptures, authors, and topics"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus:text-primary-400 transition-colors">
              🔍
            </span>
          </div>
        </section>

        {/* 
        ====================================================================
        HOW IT WORKS SECTION
        ====================================================================
        Explains the platform workflow to encourage engagement
      */}
        {/* <section className="w-full max-w-5xl mb-12">
        <h3 className="text-2xl font-semibold text-center mb-6 text-veda-primary">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 hover:border-veda-accent/30 transition-all duration-300 group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                <Image 
                  src={step.icon} 
                  alt={step.title} 
                  width={64} 
                  height={64} 
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h4 className="text-xl font-medium mb-2 text-veda-primary">
                {step.title}
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section> */}

        {/* 
        ====================================================================
        Deal Later After
        ====================================================================
        Showcases popular texts to encourage exploration
      */}

        {/* 
        ====================================================================
        FEATURED BOOKS SECTION
        ====================================================================
        Showcases popular texts to encourage exploration
      */}
        <section className="w-full max-w-6xl mb-12">
          <h3 className={`text-2xl mb-6 text-center text-veda-primary ${booksFont.className}`}>
            Upcoming Books
          </h3>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${booksFont.className}`}>
            {featuredBooks.map((book) => (
              <BookCard className={booksFont.className}
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                slug={book.slug}
                status={book.status}
                category={book.category}
              />
            ))}
          </div>
        </section>

        {/* 
        ====================================================================
        TESTIMONIALS SECTION
        ====================================================================
        Social proof to build trust and credibility
      */}
        <section className="w-full max-w-5xl mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-veda-primary">
            What Readers Say
          </h3>
          <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="min-w-[300px] bg-white/5 backdrop-blur-lg rounded-xl p-6 flex flex-col justify-between border border-white/10 hover:border-veda-accent/30 transition-all duration-300"
              >
                <div className="mb-4">
                  <span className="text-2xl text-veda-accent/50">"</span>
                </div>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed italic">
                  {testimonial.text}
                </p>
                <div className="text-right">
                  <div className="font-medium text-veda-accent">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 
        ====================================================================
        FOOTER SECTION
        ====================================================================
        Copyright and legal information
      */}
        <footer className="w-full max-w-6xl mt-8 text-center text-sm text-gray-500 py-8 border-t border-white/10">
          <div className="space-y-2">
            <p>
              © {new Date().getFullYear()} Vaidika Vangamaya. All rights reserved.
            </p>
            <p className="text-xs text-gray-600">
              Preserving ancient wisdom for modern readers
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
