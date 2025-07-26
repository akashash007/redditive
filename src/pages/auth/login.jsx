import { signIn } from "next-auth/react";
import { Edit as Reddit, Sparkles, ArrowRight } from 'lucide-react';
import ROUTES from "@/config/routeConfig";
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default function Login() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
            <AnimatedBackground />
            
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                        duration: 0.8, 
                        type: "spring", 
                        stiffness: 100,
                        delay: 0.2 
                    }}
                    className="w-full max-w-md"
                >
                    <GlassCard className="p-8 text-center">
                        {/* Animated Reddit Logo */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                                duration: 1, 
                                type: "spring", 
                                stiffness: 200,
                                delay: 0.5 
                            }}
                            className="mb-8 relative"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center relative">
                                <Reddit className="w-10 h-10 text-white" />
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5] 
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity,
                                        ease: "easeInOut" 
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg"
                                />
                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
                        >
                            Reddit Analyzer
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-gray-400 mb-8"
                        >
                            Unlock insights from your Reddit activity
                        </motion.p>

                        {/* Login Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            <AnimatedButton
                                onClick={() => signIn("reddit", { callbackUrl: ROUTES.DASHBOARD })}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                            >
                                <Reddit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Continue with Reddit
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </AnimatedButton>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="mt-8 space-y-3"
                        >
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                                Analyze your karma and activity
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                                Track subreddit engagement
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" />
                                Visualize your Reddit journey
                            </div>
                        </motion.div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}