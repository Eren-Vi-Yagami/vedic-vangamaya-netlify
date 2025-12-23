import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About the Engine | Vaidika Vangamaya",
    description: "Learn about the DSM-Mark: 1 Engine powering the Vaidika Vangamaya digital library.",
};

export default function AboutEnginePage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-veda-accent/30 flex flex-col items-center">

            {/* Hero Section */}
            <section className="w-full max-w-7xl px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-12">

                {/* Text Content */}
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-4">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-veda-muted/10 border border-veda-muted/20 text-veda-muted text-sm font-medium tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span>System Online</span>
                            <span>•</span>
                            <span>Ver. 1.0.0</span>
                        </div>
                        <Image
                            src="/images/DSM_logo.png"
                            alt="Tilak"
                            width={70}
                            height={70}
                            className="object-contain translate-x-[1px] translate-y-[5px]"
                        />
                        <Image
                            src="/images/new_logo.png"
                            alt="Tilak"
                            width={95}
                            height={95}
                            className="object-contain translate-x-[1px] translate-y-[5px]"
                        />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-veda-primary leading-[1.1]">
                        The <span className="text-veda-accent">GARUDA: Prime-Engine</span>
                    </h1>

                    <p className="text-lg text-veda-muted max-w-xl leading-relaxed font-sans">
                        A bespoke digital infrastructure designed solely for the preservation,
                        rendering, and semantic exploration of ancient Vedic scriptures.
                        Blending timeless wisdom with modern performance.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <Link
                            href="/"
                            className="px-8 py-3 bg-veda-primary text-background font-medium rounded-lg hover:bg-veda-accent transition-colors duration-300 shadow-lg shadow-veda-primary/20"
                        >
                            Explore Library
                        </Link>
                        <Link
                            href="/documentation"
                            className="px-8 py-3 bg-transparent border border-veda-muted/30 text-veda-primary font-medium rounded-lg hover:bg-veda-muted/5 transition-colors duration-300"
                        >
                            Technical Utils
                        </Link>
                    </div>
                </div>

                {/* Hero Visual - Large Rotating Engine */}
                <div className="flex-1 flex justify-center items-center relative py-12">
                    {/* Decorative glowing backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-veda-accent/20 to-transparent blur-3xl rounded-full opacity-30 transform scale-75"></div>

                    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                        {/* Background Rings */}
                        <div className="absolute inset-0 border border-veda-muted/10 rounded-full scale-125"></div>
                        <div className="absolute inset-0 border border-dashed border-veda-muted/20 rounded-full scale-150 animate-[spin_30s_linear_infinite_reverse]"></div>

                        {/* Main Rotating Engine */}
                        <div className="absolute inset-0 animate-[spin_60s_linear_infinite]">
                            <Image
                                src="/images/engines_logo.png"
                                alt="DSM Engine Core"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>

                        {/* Center Static Element */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <Image
                                    src="/images/tilak.png"
                                    alt="Tilak"
                                    width={70}
                                    height={70}
                                    className="object-contain translate-x-[1px] translate-y-[5px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Features */}
            <section className="w-full max-w-7xl px-6 py-20 bg-veda-paper/50 rounded-3xl mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-veda-primary mb-4">Core Principles</h2>
                    <div className="h-1 w-20 bg-veda-accent mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Semantic Preservation",
                            desc: "Ensuring the integrity of every shloka via strict type-safe data structures and immutable content layers.",
                            icon: "📚"
                        },
                        {
                            title: "Rapid Retrieval",
                            desc: "Zero-latency access to thousands of verses using pre-compiled static indexing and edge caching.",
                            icon: "⚡"
                        },
                        {
                            title: "Contextual Design",
                            desc: "A user interface that reflects the sanctity of the content, minimizing distraction and maximizing immersion.",
                            icon: "🕉️"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group p-8 bg-background border border-veda-muted/10 rounded-2xl hover:border-veda-accent/30 hover:shadow-lg hover:shadow-veda-accent/5 transition-all duration-300">
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-veda-primary mb-3 font-serif">{feature.title}</h3>
                            <p className="text-veda-muted leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech Spec / Stats Row */}
            <section className="w-full border-y border-veda-muted/10 bg-veda-primary text-background py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { label: "Uptime", value: "99.9%" },
                        { label: "Verses Indexed", value: "10k+" },
                        { label: "Latency", value: "<50ms" },
                        { label: "Vedic Sources", value: "4" },
                    ].map((stat, i) => (
                        <div key={i} className="space-y-1">
                            <div className="text-4xl md:text-5xl font-bold font-serif text-veda-accent">{stat.value}</div>
                            <div className="text-sm uppercase tracking-widest opacity-70">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
