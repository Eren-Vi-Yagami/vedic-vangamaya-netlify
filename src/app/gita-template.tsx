import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function home(){
    return(
        <main>
            <section>
                
            </section> 
            
            {/* Bhagavad Gita Reading Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-veda-primary">
                        Explore the Bhagavad Gita
                    </h2>
                    
                    <div className="flex justify-center">
                        <Link 
                            href="/books/bhagwatgita" 
                            className="block group transition-all duration-300 hover:scale-105 max-w-sm"
                            aria-label="Read Shrimad Bhagwat Gita by Vyasa"
                        >
                            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-veda-accent/50">
                                <div className="relative mb-4 overflow-hidden rounded-md">
                                    <Image
                                        src="/images/bhagwatgita.png"
                                        alt="Cover of Shrimad Bhagwat Gita"
                                        width={300}
                                        height={400}
                                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                                        priority={false}
                                        loading="lazy"
                                    />
                                </div>
                                
                                <h3 className="text-2xl font-semibold text-white text-center group-hover:text-veda-accent transition-colors mb-2">
                                    Shrimad Bhagwat Gita
                                </h3>
                                
                                <p className="text-sm text-gray-300 text-center group-hover:text-gray-200 transition-colors mb-4">
                                    by Vyasa
                                </p>
                                
                                <div className="text-center">
                                    <span className="inline-block bg-amber-600/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/20">
                                        COMING SOON
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}