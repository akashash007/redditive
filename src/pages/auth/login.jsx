import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import ROUTES from "@/config/routeConfig";
// import { Zap } from "lucide-react"; // or replace with a suitable logo/icon
import Image from "next/image";
import { Zap } from "lucide-react";

export default function Login() {

    const [floatingParticles, setFloatingParticles] = useState([]);

    useEffect(() => {
        const generated = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            size: `${Math.floor(Math.random() * 6) + 2}px`,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            color: [
                "bg-pink-400",
                "bg-purple-400",
                "bg-blue-400",
                "bg-yellow-300",
                "bg-green-400",
                "bg-indigo-400"
            ][Math.floor(Math.random() * 6)],
            shape: ["rounded-full", "rounded-md", "triangle"][Math.floor(Math.random() * 3)],
            delay: Math.random() * 5,
        }));

        setFloatingParticles(generated);
    }, []);

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
            {floatingParticles.map(p => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: 0,
                        y: 0,
                        opacity: 0.2,
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50, 0],
                        y: [0, Math.random() * 100 - 50, 0],
                        rotate: [0, Math.random() * 360, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                    className={`absolute ${p.color} ${p.shape !== "triangle" ? p.shape : ""}`}
                    style={{
                        top: p.y,
                        left: p.x,
                        width: p.shape === "triangle" ? "0px" : p.size,
                        height: p.shape === "triangle" ? "0px" : p.size,
                        opacity: 0.5,
                        zIndex: 0,
                    }}
                >
                    {p.shape === "triangle" && <div className="triangle" />}
                </motion.div>
            ))}
            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 bg-gray-900/80 backdrop-blur-2xl border border-white/10 shadow-xl shadow-purple-500/20 rounded-xl px-10 py-14 w-full max-w-md text-center"
            >

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/redditive_favicon.png" // Replace with your actual logo path
                        alt="Reddit Analyzer Logo"
                        width={120}
                        height={120}
                        className="rounded-full"
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
                <p className="text-xs text-gray-500 mt-8">
                    By connecting, you agree to our{" "}
                    <a href="/terms" className="underline hover:text-white">Terms of Service</a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
                </p>
            </motion.div>
        </main>
    );
}
