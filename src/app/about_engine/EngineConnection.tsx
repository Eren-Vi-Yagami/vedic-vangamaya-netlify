"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function EngineConnection() {
    const [isPowered, setIsPowered] = useState(false);

    // Cycle the power state to create a loop of "re-establishing" connection
    // or just keep it powered after the first run.
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPowered(true);
        }, 1500); // Wait for the pulse to travel
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col md:flex-row items-center justify-center p-8 bg-black/5 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-emerald-500/5 group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />

            {/* 1. SOURCE: DSM Logo (The Company) */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="relative p-4 bg-white rounded-full shadow-lg shadow-blue-900/10 border border-blue-100">
                    <Image
                        src="/images/DSM_logo.png"
                        alt="DSM Logic"
                        width={60}
                        height={60}
                        className="object-contain"
                    />
                    {/* Source Pulse Ring */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border border-blue-400"
                    />
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                    Origin
                </span>
            </div>

            {/* 2. CONNECTION: The Pipeline (Responsive SVG) */}
            <div className="relative flex-1 opacity-80 mx-2 my-4 md:my-0 md:mx-4 w-[2px] h-16 md:w-32 md:h-[2px]">
                {/* Desktop Horizontal Line */}
                <div className="hidden md:block w-full h-full relative">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 100 4"
                        className="overflow-visible"
                        preserveAspectRatio="none"
                    >
                        {/* Base Path */}
                        <line
                            x1="0"
                            y1="2"
                            x2="100"
                            y2="2"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-slate-300"
                            strokeDasharray="4 4"
                        />
                        {/* Active Data Beam */}
                        <motion.line
                            x1="0"
                            y1="2"
                            x2="100"
                            y2="2"
                            stroke="url(#gradient-desktop)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                                ease: "linear",
                            }}
                        />
                        <defs>
                            <linearGradient
                                id="gradient-desktop"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Moving Particle */}
                    <motion.div
                        className="absolute top-1/2 left-0 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] -translate-y-1/2 z-20"
                        animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, ease: "linear" }}
                    />

                </div>

                {/* Mobile Vertical Line */}
                <div className="block md:hidden w-full h-full relative">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 4 100"
                        className="overflow-visible"
                        preserveAspectRatio="none"
                    >
                        {/* Base Path */}
                        <line
                            x1="2"
                            y1="0"
                            x2="2"
                            y2="100"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-slate-300"
                            strokeDasharray="4 4"
                        />
                        {/* Active Data Beam */}
                        <motion.line
                            x1="2"
                            y1="0"
                            x2="2"
                            y2="100"
                            stroke="url(#gradient-mobile)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                                ease: "linear",
                            }}
                        />
                        <defs>
                            <linearGradient
                                id="gradient-mobile"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Moving Particle Mobile */}
                    <motion.div
                        className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] -translate-x-1/2 z-20"
                        animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, ease: "linear" }}
                    />
                </div>
            </div>

            {/* 3. DESTINATION: Engine Logo (The Product) */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <motion.div
                    animate={
                        // Pulse effect when "powered"
                        {
                            filter: ["grayscale(100%) brightness(0.8)", "grayscale(0%) brightness(1)"],
                            scale: [0.95, 1.05, 1]
                        }
                    }
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        times: [0, 0.9, 1], // Sync with beam arrival roughly
                        ease: "easeOut"
                    }}
                    className="relative p-5 bg-gradient-to-br from-slate-100 to-white rounded-full shadow-2xl shadow-emerald-500/20 border border-emerald-100"
                >
                    <Image
                        src="/images/new_logo.png"
                        alt="Engine Core"
                        width={85}
                        height={85}
                        className="object-contain"
                    />
                    {/* Activation Glow Ring (Only appears when pulse hits) */}
                    <motion.div
                        animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, delay: 1.2 }}
                        className="absolute inset-0 rounded-full border-2 border-emerald-500"
                    />
                </motion.div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                </span>
            </div>

        </div>
    );
}
