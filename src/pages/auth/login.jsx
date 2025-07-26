import { motion } from 'framer-motion';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Reddit, Sparkles, ArrowRight } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import ROUTES from "@/config/routeConfig";

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push(ROUTES.DASHBOARD);
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <AnimatedBackground>
                <div className="min-h-screen flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                    />
                </div>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground variant="neon">
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                    className="w-full max-w-md"
                >
                    {/* Floating Reddit Logo */}
                    <motion.div
                        className="flex justify-center mb-8"
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <div className="relative">
                            <motion.div
                                className="w-20 h-20 bg-reddit-gradient rounded-full flex items-center justify-center glow-purple"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Reddit className="w-10 h-10 text-white" />
                            </motion.div>
                            
                            {/* Sparkle effects */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        rotate: [0, 180, 360],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.5,
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Login Card */}
                    <GlassCard glow className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Welcome to Redditive
                            </h1>
                            <p className="text-gray-400 mb-8">
                                Analyze your Reddit profile with stunning visualizations
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <AnimatedButton
                                variant="reddit"
                                size="lg"
                                onClick={() => signIn("reddit", { callbackUrl: ROUTES.DASHBOARD })}
                                className="w-full mb-4 flex items-center justify-center space-x-2"
                            >
                                <Reddit className="w-5 h-5" />
                                <span>Continue with Reddit</span>
                                <ArrowRight className="w-5 h-5" />
                            </AnimatedButton>
                        </motion.div>

                        <motion.p
                            className="text-xs text-gray-500 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            We'll never post anything without your permission
                        </motion.p>
                    </GlassCard>

                    {/* Feature highlights */}
                    <motion.div
                        className="mt-8 grid grid-cols-3 gap-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        {[
                            { icon: '📊', text: 'Analytics' },
                            { icon: '🎨', text: 'Beautiful UI' },
                            { icon: '🔒', text: 'Secure' },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.text}
                                className="text-gray-400"
                                whileHover={{ scale: 1.05, color: '#ffffff' }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-2xl mb-1">{feature.icon}</div>
                                <div className="text-sm">{feature.text}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </AnimatedBackground>
    );
}