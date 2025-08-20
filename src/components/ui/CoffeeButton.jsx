"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const container = {
    initial: { width: 40 }, // w-10 (smaller)
    hover: {
        width: 160,            // narrower expand
        transition: { type: "spring", stiffness: 260, damping: 20 },
    },
};

const text = {
    initial: { opacity: 0, x: 8 },
    hover: { opacity: 1, x: 0, transition: { duration: 0.22, delay: 0.05 } },
};

export default function CoffeeButton() {
    return (
        <Link
            href="https://buymeacoffee.com/ash_1913"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy me a coffee"
        >
            <motion.div
                variants={container}
                initial="initial"
                whileHover="hover"
                style={{ willChange: "width" }}
                className="fixed bottom-3 right-3 z-50 h-10 overflow-hidden rounded-full cursor-pointer shadow-lg
                   bg-gradient-to-r from-purple-500/90 via-purple-600/90 to-purple-700/90 backdrop-blur-xl
                   flex items-center"
            >
                {/* Icon — centered */}
                <div className="w-10 h-10 flex items-center justify-center shrink-0 select-none">
                    <span className="block text-lg leading-none" aria-hidden>☕</span>
                </div>

                {/* Text — vertically centered */}
                <motion.span
                    variants={text}
                    className="pointer-events-none inline-flex items-center h-10 px-2
                     text-white text-xs font-medium whitespace-nowrap select-none"
                >
                    Buy me a coffee
                </motion.span>
            </motion.div>
        </Link>
    );
}
