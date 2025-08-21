// components/ui/SlimAboutBanner.jsx
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, Sparkles } from "lucide-react";

const float = {
    animate: {
        y: [-8, 6, -8],
        rotate: [-2, 2, -2],
        transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
    },
};

// put above (near your other motion variants)
const floatA = {
    animate: {
        y: [-8, 6, -8],
        rotate: [-2, 2, -2],
        transition: { duration: 6.2, delay: 0.15, repeat: Infinity, ease: "easeInOut" },
    },
};

const floatB = {
    animate: {
        y: [-10, 4, -10],
        rotate: [2, -2, 2], // opposite direction
        transition: { duration: 7.8, delay: 0.95, repeat: Infinity, ease: "easeInOut" },
    },
};


export default function SlimAboutBanner({
    text = "Make Sense of Your Reddit Universe",
    href = "/about",
    buttonText = "About the Maker",
}) {
    return (
        <motion.aside
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative mx-auto mt-10 w-full max-w-5xl mb-15  px-3 md:px-0"
        >
            {/* subtle glow blobs */}
            <motion.div variants={float} animate="animate" className="pointer-events-none absolute -top-6 -left-8 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
            <motion.div variants={float} animate="animate" className="pointer-events-none absolute -bottom-6 -right-8 h-28 w-28 rounded-full bg-pink-500/20 blur-2xl" />

            {/* banner shell */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-indigo-900/20 backdrop-blur-xl">
                {/* sheen sweep */}
                <motion.div
                    aria-hidden
                    initial={{ x: "-120%" }}
                    animate={{ x: "120%" }}
                    transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />

                <div className="flex items-center gap-4 px-4 py-3 md:px-6 md:py-4">
                    {/* left dot accent */}
                    <div className="hidden h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 md:block" />

                    {/* main line */}
                    <p className="flex-1 truncate text-sm md:text-base">
                        <span
                            className="bg-clip-text text-transparent font-semibold"
                            style={{
                                backgroundImage:
                                    "linear-gradient(135deg,#a855f7 0%,#ec4899 30%,#8b5cf6 60%,#3b82f6 100%)",
                                backgroundSize: "300% 300%",
                            }}
                        >
                            {text}
                        </span>
                    </p>

                    {/* badges (floaty) */}
                    <div className="hidden items-center gap-2 md:flex">
                        <motion.span
                            variants={floatA}
                            animate="animate"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-gray-200 backdrop-blur"
                            style={{ willChange: "transform" }}
                        >
                            <Rocket className="h-3.5 w-3.5 text-pink-300" />
                            Blazing fast
                        </motion.span>

                        <motion.span
                            variants={floatB}
                            animate="animate"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-gray-200 backdrop-blur"
                            style={{ willChange: "transform" }}
                        >
                            <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                            Gorgeous visuals
                        </motion.span>
                    </div>


                    {/* CTA button -> /about */}
                    <Link
                        href={href}
                        className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-purple-500/20 overflow-hidden"
                        aria-label="Read about the maker"
                    >
                        <span className="relative z-10">{buttonText}</span>
                        <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                        <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400" />
                    </Link>
                </div>
            </div>
        </motion.aside>
    );
}
