"use client";
import { useState } from "react";
import { motion } from "framer-motion";

// Reusable Accordion
export function Accordion({ children }) {
    return <div className="space-y-4">{children}</div>;
}

export function AccordionItem({ question, answer }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden transition-all"
        >
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left px-5 py-4 text-lg font-medium flex justify-between items-center text-white/90 hover:text-white transition-colors"
            >
                {question}
                <span
                    className={`transform transition-transform duration-300 text-xl font-bold`}
                >
                    {open ? "−" : "+"}
                </span>
            </button>

            {/* Animated Content */}
            <div
                className={`px-5 text-gray-200 text-base overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-40 pb-4" : "max-h-0 pb-0"
                    }`}
            >
                {answer}
            </div>
        </motion.div>
    );
}

// FAQ Section
const FAQSection = () => {
    return (
        <section className="max-w-3xl mx-auto py-20 px-6 relative z-10">
            <motion.h2
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
                ❓ FAQ
            </motion.h2>

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
