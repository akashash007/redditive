import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import ROUTES from "@/config/routeConfig";
import Image from "next/image";
import { Zap } from "lucide-react";
import FloatingBackground from "@/components/ui/FloatingBackground";
import Link from "next/link";

export default function Login() {

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 flex items-center justify-center relative overflow-hidden">

            <FloatingBackground particleCount={25} />

            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 bg-gray-900/80 backdrop-blur-2xl border border-white/10 shadow-xl shadow-purple-500/20 rounded-xl md:px-10 px-4 py-4 md:py-14 lg:py-14 w-full mx-4 max-w-md text-center"
            >

                {/* Logo */}
                <div className="relative flex justify-center mb-6">
                    {/* Glowing Aura */}
                    <div className="absolute top-1/2 left-1/2 mt-5 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full z-0 bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-800 blur-2xl opacity-60 animate-pulse" />

                    {/* Logo Image */}
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
                    Redditive
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300 text-sm mb-8"
                >
                    Discover insights from your Reddit activity
                </motion.p>

                {/* Sign In Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signIn("reddit", { callbackUrl: ROUTES.DASHBOARD })}
                    className="flex items-center justify-center w-full space-x-3 px-6 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-300 hover:shadow-purple-500/30"
                >
                    <Zap className="w-6 h-6" />
                    <span>Connect with Reddit</span>
                </motion.button>

                {/* Divider */}
                {/* <div className="text-gray-500 my-6 text-sm">Or continue with</div> */}

                {/* Terms */}
                <p className="text-xs text-gray-500 mt-8 mb-4">
                    By connecting, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-white">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                </p>

                <Link href="/" className="text-[11px] md:text-xs text-gray-300 underline hover:text-white pt-5">
                    Back
                </Link>
            </motion.div>
        </main>
    );
}
