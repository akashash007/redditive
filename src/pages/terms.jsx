"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FloatingBackground from "@/components/ui/FloatingBackground";

const LAST_UPDATED = "August 17, 2025";

export default function Terms() {
    return (
        <main className="min-h-screen py-4 bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 flex items-center justify-center relative overflow-hidden">
            <FloatingBackground particleCount={25} />

            <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 bg-gray-900/80 backdrop-blur-2xl border border-white/10 shadow-xl shadow-purple-500/20 rounded-xl md:px-6 px-3 py-4 md:py-8 w-full mx-4 max-w-xl"
            >
                {/* Header / Logo */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                        <div className="absolute top-1/2 left-1/2 mt-3 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] rounded-full z-0 bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-800 blur-2xl opacity-60 animate-pulse" />
                        <Image
                            src="/redditive_favicon.png"
                            alt="Redditive Logo"
                            width={64}
                            height={64}
                            className="rounded-full relative z-10"
                            priority
                        />
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className="text-xl md:text-2xl font-bold text-white tracking-tight"
                    >
                        Terms of Service
                    </motion.h1>
                    <p className="text-gray-400 mt-1 text-[11px]">Last updated: {LAST_UPDATED}</p>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-4 text-gray-200 text-xs md:text-sm leading-snug">
                    <p>
                        By accessing or using <strong>Redditive</strong> (“Service”), you agree to these Terms.
                        If you do not agree, do not use the Service.
                    </p>

                    <h2 className="text-base md:text-lg font-semibold text-white">Purpose &amp; Motive</h2>
                    <p>
                        Redditive is a fun, personal, non-commercial project built to help you explore your own
                        Reddit activity. It’s not affiliated with Reddit, and it’s not intended for business or
                        professional analytics.
                    </p>

                    <h2 className="text-base md:text-lg font-semibold text-white">Use of the Service</h2>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>You must comply with Reddit’s User Agreement and API Terms.</li>
                        <li>No unlawful activity, spam, abuse, or scraping beyond your authorized access.</li>
                        <li>We may modify, suspend, or discontinue the Service at any time.</li>
                    </ul>

                    <h2 className="text-base md:text-lg font-semibold text-white">Account &amp; OAuth</h2>
                    <p>
                        Authentication is via Reddit OAuth (NextAuth). We never ask for your Reddit password.
                        You can revoke access from your Reddit account settings at any time.
                    </p>

                    <h2 className="text-base md:text-lg font-semibold text-white">Intellectual Property</h2>
                    <p>
                        The Service’s code, branding, and design are owned by us. Reddit content displayed via
                        the API remains the property of Reddit and its users.
                    </p>

                    <h2 className="text-base md:text-lg font-semibold text-white">Privacy</h2>
                    <p>
                        For how we handle data, see our{" "}
                        <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                    </p>

                    <h2 className="text-base md:text-lg font-semibold text-white">Disclaimer; Limitation of Liability</h2>
                    <p>
                        The Service is provided “as is” without warranties of any kind. To the maximum extent
                        permitted by law, we are not liable for any indirect, incidental, or consequential
                        damages arising from your use of the Service.
                    </p>

                    <h2 className="text-base md:text-lg font-semibold text-white">Changes</h2>
                    <p>
                        We may update these Terms from time to time. Continued use means you accept the updated Terms.
                    </p>

                    <h2 className="text-base md:text-lg font-semibold text-white">Contact</h2>
                    <p>
                        Questions? Email{" "}
                        <a href="mailto:akashdawww@gmail.com" className="underline hover:text-white">akashdawww@gmail.com</a>.
                    </p>

                    <p className="text-[11px] text-gray-400">
                        These Terms are provided for informational purposes and do not constitute legal advice.
                    </p>
                </div>

                {/* Footer links */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <Link href="/auth/login" className="text-[11px] md:text-xs text-gray-300 underline hover:text-white">
                        Back to login
                    </Link>
                    <div className="text-[10px] md:text-[11px] text-gray-500">
                        Read our <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
