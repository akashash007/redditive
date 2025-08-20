"use client";
import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Rocket, Sparkles } from "lucide-react";

// desynced floaters (so badges don't move in sync)
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
        rotate: [2, -2, 2],
        transition: { duration: 7.8, delay: 0.95, repeat: Infinity, ease: "easeInOut" },
    },
};

// Reusable Accordion
export function Accordion({ children }) {
    return <div className="space-y-4">{children}</div>;
}

export function AccordionItem({ question, answer, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    const id = useId();

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg"
        >
            {/* subtle glow blobs */}
            <motion.div variants={floatA} animate="animate" className="pointer-events-none absolute -top-8 -left-8 h-28 w-28 rounded-full bg-purple-500/15 blur-2xl" />
            <motion.div variants={floatB} animate="animate" className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-pink-500/15 blur-2xl" />

            {/* sheen sweep */}
            <motion.div
                aria-hidden
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />

            {/* Header */}
            <motion.button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={`panel-${id}`}
                className="group relative flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-white/90 hover:text-white"
            >
                <span className="flex items-center gap-3">
                    {/* gradient icon chip */}
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 ring-2 ring-white/10 shadow-lg">
                        <Sparkles className="h-4 w-4 text-white" />
                    </span>
                    <span className="text-lg font-medium">{question}</span>
                </span>

                {/* chevron */}
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-1"
                >
                    <ChevronDown className="h-5 w-5 text-white/80" />
                </motion.span>

                {/* border glow on open */}
                <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    animate={{ boxShadow: open ? "0 0 0 1px rgba(168,85,247,0.35), 0 0 36px rgba(236,72,153,0.15)" : "0 0 0 1px rgba(255,255,255,0.1)" }}
                    transition={{ duration: 0.3 }}
                />
            </motion.button>

            {/* Animated Content */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        id={`panel-${id}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 text-base leading-relaxed text-gray-200 pt-5">
                            {typeof answer === "string" ? <p>{answer}</p> : answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// FAQ Section
const FAQSection = () => {
    return (
        <section className="relative z-10 mx-auto max-w-3xl px-6 py-20">
            {/* Title + floaty badges */}
            <div className="mb-10 flex items-center justify-center gap-3">
                <motion.h2
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                >
                    ❓ FAQ
                </motion.h2>
                {/* 
                <div className="hidden items-center gap-2 md:flex">
                    <motion.span
                        variants={floatA}
                        animate="animate"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-gray-200 backdrop-blur"
                    >
                        <Rocket className="h-3.5 w-3.5 text-pink-300" />
                        Blazing fast
                    </motion.span>
                    <motion.span
                        variants={floatB}
                        animate="animate"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-gray-200 backdrop-blur"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                        Gorgeous visuals
                    </motion.span>
                </div> */}
            </div>

            <Accordion>
                <AccordionItem
                    question="Do you store my Reddit data?"
                    answer="No. We don’t permanently store your Reddit activity. Data is fetched in real time through Reddit’s official API and displayed only to you."
                />
                <AccordionItem
                    question="What permissions do you need?"
                    answer="We request read-only access to your account (posts, comments, votes, saved items, and subreddit follows). We never request write or messaging permissions."
                />
                <AccordionItem
                    question="Is this affiliated with Reddit?"
                    answer="No. This tool is independently developed and not officially endorsed or affiliated with Reddit, Inc."
                />
            </Accordion>
        </section>
    );
};

export default FAQSection;
