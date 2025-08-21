"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Github, ChevronLeft } from "lucide-react";
import FloatingBackground from "@/components/ui/FloatingBackground";
import { useRouter } from "next/navigation";

export default function About() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 flex items-center justify-center relative overflow-hidden">

            <FloatingBackground particleCount={25} />

            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 bg-gray-900/80 backdrop-blur-2xl border border-white/10 shadow-xl shadow-purple-500/20 rounded-xl md:px-10 px-4 py-4 md:py-14 lg:py-14 w-full mx-4 max-w-md text-center relative"
            >

                {/* Logo */}
                <div className="relative flex justify-center mb-6">
                    <div className="absolute top-1/2 left-1/2 mt-5 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full z-0 bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-800 blur-2xl opacity-60 animate-pulse" />
                    <Image
                        src="/redditive_favicon.png"
                        alt="Reddit Analyzer Logo"
                        width={120}
                        height={120}
                        className="rounded-full relative z-10"
                    />
                </div>

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-3"
                >
                    Akash
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300 text-sm mb-8"
                >
                    Frontend Engineer
                </motion.p>

                {/* Bio */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300 text-sm mb-8"
                >
                    Hi 👋 I’m Akash, a frontend developer passionate about building interactive
                    web apps with React, Next.js, and data-driven UIs.
                    This Reddit Analyzer is one of my personal projects where I mix clean UI
                    with deep insights.
                </motion.p>

                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center gap-4 mb-8"
                >
                    <Link
                        href="https://github.com/akashash007"
                        target="_blank"
                        className="flex items-center gap-2 text-white hover:text-purple-300 transition"
                    >
                        <Github className="w-5 h-5" /> GitHub
                    </Link>
                </motion.div> */}

                <Link
                    href="https://buymeacoffee.com/ash_1913"
                    target="_blank"
                    className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/90 via-purple-600/90 to-purple-700/90 text-white font-medium shadow-md hover:scale-105 transition"
                >
                    ☕ Buy me a coffee
                </Link>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mt-8 flex items-center gap-1 text-[11px] md:text-xs text-gray-300 underline  hover:text-white transition mx-auto"
                >
                    Back
                </button>
            </motion.div>
        </main>
    );
}
