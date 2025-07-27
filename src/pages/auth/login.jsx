// pages/login.js
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import ROUTES from "@/config/routeConfig";
import { Zap } from "lucide-react";

export default function Login() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 flex items-center justify-center relative overflow-hidden">
            {/* Background blobs */}
            <motion.div
                animate={{ x: [0, 80, 0], y: [0, -80, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ x: [0, -100, 0], y: [0, 100, 0], rotate: [360, 180, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"
            />

            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 bg-gray-900/60 backdrop-blur-2xl border border-white/10 shadow-xl shadow-purple-500/10 rounded-xl px-10 py-14 w-full max-w-md text-center"
            >

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-6"
                >
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Reddit Analyzer
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 text-lg mb-10"
                >
                    Sign in to explore your Reddit insights, karma analytics, and growth trends.
                </motion.p>

                <motion.button
                    // whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signIn("reddit", { callbackUrl: ROUTES.DASHBOARD })}
                    className="flex items-center justify-center mx-auto space-x-3 px-6 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-purple-500/30"
                >
                    <Zap className="w-6 h-6" />
                    <span>Login with Reddit</span>
                </motion.button>
            </motion.div>
        </main>
    );
}
