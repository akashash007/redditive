"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FloatingBackground from "@/components/ui/FloatingBackground";

const LAST_UPDATED = "August 17, 2025";

export default function Privacy() {
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
                        Privacy Policy
                    </motion.h1>
                    <p className="text-gray-400 mt-1 text-[11px]">Last updated: {LAST_UPDATED}</p>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-4 text-gray-200 text-xs md:text-sm leading-snug">
                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Motive</h2>
                        <p>
                            Redditive is a fun, personal, non-commercial project made to visualize and explore your
                            own Reddit activity. We’re not affiliated with Reddit and we don’t run ads or sell data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Who we are</h2>
                        <p>
                            <strong>Redditive</strong> (“we”, “us”, “our”) helps you discover insights from your
                            Reddit activity using Reddit’s official OAuth flow. You authenticate directly with Reddit;
                            we never collect your Reddit password.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">What data we collect</h2>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong>OAuth tokens</strong> issued after you sign in (scoped to what you grant).</li>
                            <li><strong>Basic account info</strong> (e.g., ID, username) within granted scopes.</li>
                            <li><strong>Read-only Reddit data</strong> to generate insights (posts, comments, votes, saved items, as permitted).</li>
                            <li><strong>Technical logs</strong> for debugging and improving the app.</li>
                        </ul>
                        <p className="mt-1.5 text-[11px] text-gray-400">
                            We do <em>not</em> request or store your Reddit password, and we do not access private messages
                            unless you explicitly grant a scope that includes them (default app config does not).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">How we use your data</h2>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Secure sign-in via Reddit OAuth (NextAuth).</li>
                            <li>Fetch and display insights about your activity.</li>
                            <li>Maintain and improve the service (bugs, performance).</li>
                        </ul>
                        <p className="mt-1.5">We do not sell your data or use it for third-party advertising.</p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Storage &amp; security</h2>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Tokens are stored securely and transmitted over HTTPS.</li>
                            <li>Some data may be cached temporarily to improve performance.</li>
                            <li>You can revoke access anytime from Reddit’s connected apps; revoked tokens stop working.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Data retention &amp; deletion</h2>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Tokens are kept only while your account is connected; expired/invalid tokens are purged.</li>
                            <li>Cached data is retained only as long as needed for features, then removed.</li>
                            <li>You may request deletion of any app-held data (see Contact).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Sharing</h2>
                        <p>We don’t share your personal data except as needed to run the app (e.g., hosting) or if required by law. We never sell your data.</p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Cookies &amp; similar technologies</h2>
                        <p>We use essential cookies/local storage for sign-in and settings. No third-party ad cookies.</p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Your choices</h2>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Disconnect the app from Reddit to revoke future access.</li>
                            <li>Request deletion of app-held data via email.</li>
                            <li>Review and control scopes during sign-in.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Children’s privacy</h2>
                        <p>This app isn’t intended for users under 13 (or the minimum age in your area).</p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Changes to this policy</h2>
                        <p>We may update this policy. If we make material changes, we’ll update the date above.</p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-semibold text-white mb-1">Contact</h2>
                        <p>
                            Questions or requests? Email{" "}
                            <a href="mailto:akashdawww@gmail.com" className="underline hover:text-white">akashdawww@gmail.com</a>.
                        </p>
                    </section>

                    <p className="text-[11px] text-gray-400">
                        This page is for transparency and does not constitute legal advice.
                    </p>
                </div>

                {/* Footer links */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <Link href="/auth/login" className="text-[11px] md:text-xs text-gray-300 underline hover:text-white">
                        Back to login
                    </Link>
                    <div className="text-[10px] md:text-[11px] text-gray-500">
                        By using Redditive you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-white">Terms of Service</Link>.
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
