// pages/index.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ROUTES from "@/config/routeConfig";
import { motion } from 'framer-motion';
import { ArrowRight, Play, BarChart3, Shield, TrendingUp, Users, Zap, Eye, Lock, Sparkles } from 'lucide-react';
import { Loader } from "@/components/loader";
import FAQSection from "@/components/ui/FAQSection";
import Link from "next/link";
import AboutCTA from "@/components/ui/AboutCTA";
import SlimAboutBanner from "@/components/ui/AboutCTA";



export default function Index() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            // If already logged in, go to dashboard
            router.push(ROUTES.DASHBOARD);
        }
    }, [status, router]);

    const onGetStarted = () => {
        router.push(ROUTES.LOGIN);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
    };

    // const floatingVariants = {
    //     animate: {
    //         y: [-10, 10, -10],
    //         rotate: [-2, 2, -2],
    //         transition: {
    //             duration: 6,
    //             repeat: Infinity,
    //             ease: "easeInOut",
    //         },
    //     },
    // };

    const floatingVariants = {
        animate: {
            y: [-15, 15, -15],
            rotate: [-3, 3, -3],
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    const floatingParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: `${Math.floor(Math.random() * 6) + 2}px`, // 2px to 7px
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
        delay: Math.random() * 5, // animation delay in seconds
    }));


    const features = [
        {
            icon: BarChart3,
            title: "Real-time Analysis",
            description: "Live data synchronization with instant insights"
        },
        {
            icon: Shield,
            title: "Privacy First",
            description: "Your data stays secure and encrypted"
        },
        {
            icon: TrendingUp,
            title: "Growth Tracking",
            description: "Monitor your Reddit journey over time"
        },
        {
            icon: Users,
            title: "Community Insights",
            description: "Understand your audience and engagement"
        }
    ];

    const detailedFeatures = [
        {
            icon: Zap,
            title: "Advanced Analytics",
            description: "Deep dive into your Reddit performance with comprehensive karma analytics and growth patterns.",
            gradient: "from-yellow-400 via-pink-500 to-red-500",
            ringColor: "ring-yellow-300"
        },
        {
            icon: Eye,
            title: "Profile Insights",
            description: "Get detailed insights about your Reddit profile, activity patterns, and community engagement.",
            gradient: "from-blue-400 via-indigo-500 to-purple-500",
            ringColor: "ring-blue-300"
        },
        {
            icon: TrendingUp,
            title: "Growth Tracking",
            description: "Monitor your Reddit growth over time with beautiful charts and predictive analytics.",
            gradient: "from-green-400 via-blue-500 to-purple-500",
            ringColor: "ring-green-300"
        },
        {
            icon: BarChart3,
            title: "Real-time Data",
            description: "Live synchronization with Reddit API providing up-to-the-minute analytics and insights.",
            gradient: "from-pink-500 via-purple-500 to-indigo-500",
            ringColor: "ring-pink-300"
        },
        {
            icon: Sparkles,
            title: "Beautiful UI",
            description: "Experience your data through stunning visualizations and smooth animations.",
            gradient: "from-cyan-400 via-blue-500 to-indigo-500",
            ringColor: "ring-cyan-300"
        },
        {
            icon: Lock,
            title: "Secure & Private",
            description: "Your privacy comes first. We never see your password. Everything is read-only, encrypted, and under your control.",
            gradient: "from-indigo-400 via-purple-500 to-blue-500",
            ringColor: "ring-indigo-300"
        }
    ];

    return (
        <main>
            {status === "loading" ? (
                <Loader />
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8 }}
                        className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 relative overflow-hidden"
                    >
                        {/* Animated Background Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div
                                animate={{
                                    x: [0, 100, 0],
                                    y: [0, -100, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                            />
                            <motion.div
                                animate={{
                                    x: [0, -150, 0],
                                    y: [0, 100, 0],
                                    rotate: [360, 180, 0],
                                }}
                                transition={{
                                    duration: 30,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
                            />
                            <motion.div
                                animate={{
                                    x: [0, 80, 0],
                                    y: [0, -80, 0],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full blur-2xl"
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

                            <motion.div
                                variants={floatingVariants}
                                animate="animate"
                                className="absolute top-10 left-1/3 w-3 h-3 bg-pink-300 rounded-full opacity-50"
                            />
                            <motion.div
                                variants={floatingVariants}
                                animate="animate"
                                className="absolute bottom-10 right-1/3 w-4 h-4 bg-yellow-300 rounded-full opacity-40"
                            />
                            <motion.div
                                variants={floatingVariants}
                                animate="animate"
                                className="absolute top-1/3 right-1/2 w-5 h-5 bg-green-400 rounded-full opacity-30"
                            />

                        </div>

                        {/* Hero Section */}
                        <motion.section
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="relative z-10 min-h-screen flex items-center justify-center px-6"
                        >
                            <div className="max-w-6xl mx-auto text-center">
                                {/* Main Title */}
                                <motion.div
                                    variants={itemVariants}
                                    className="mb-8"
                                >
                                    <motion.h1
                                        className="text-8xl md:text-9xl lg:text-[8rem] font-black leading-none mb-4 mt-10"
                                        style={{
                                            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #8b5cf6 50%, #3b82f6 75%, #a855f7 100%)',
                                            backgroundSize: '400% 400%',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                        animate={{
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        REDDIT
                                    </motion.h1>
                                    <motion.h2
                                        className="text-6xl md:text-7xl lg:text-8xl font-black tracking-wider"
                                        style={{
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 25%, #ec4899 50%, #a855f7 75%, #3b82f6 100%)',
                                            backgroundSize: '400% 400%',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                        animate={{
                                            backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 0.5,
                                        }}
                                    >
                                        ANALYZER
                                    </motion.h2>
                                </motion.div>

                                {/* Subtitle */}
                                <motion.p
                                    variants={itemVariants}
                                    className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
                                >
                                    Unlock the power of your Reddit presence with{' '}
                                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                                        AI-driven analytics
                                    </span>
                                    , beautiful visualizations, and{' '}
                                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                                        real-time insights
                                    </span>
                                    .
                                </motion.p>

                                {/* CTA Buttons */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onGetStarted}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/25 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-center space-x-2">
                                            <span>Get Started</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </motion.button>

                                </motion.div>

                                {/* Feature Pills */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-wrap justify-center gap-4 mb-20"
                                >
                                    {features.map((feature, index) => {
                                        const Icon = feature.icon;
                                        return (
                                            <motion.div
                                                key={feature.title}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 1 + index * 0.1 }}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className="bg-gray-800/60 backdrop-blur-xl border border-purple-500/20 rounded-full px-6 py-3 flex items-center space-x-3 shadow-lg hover:border-purple-400/40 transition-all duration-300"
                                            >
                                                <Icon className="w-5 h-5 text-purple-400" />
                                                <span className="text-white font-medium">{feature.title}</span>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* Features Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative z-10 py-20 px-3 md:px-6"
                        >
                            <div className="max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {detailedFeatures.map((feature, index) => {
                                        const Icon = feature.icon;
                                        return (
                                            <motion.div
                                                key={feature.title}
                                                initial={{ opacity: 0, y: 50 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1, duration: 0.1 }}
                                                viewport={{ once: true }}
                                                // whileHover={{ scale: 1.05, rotate: 1.5 }}
                                                className="group relative transform transition-transform duration-200 hover:shadow-xl hover:shadow-purple-500/40 rounded-3xl overflow-hidden"
                                            >
                                                {/* Glow effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl shadow-purple-500/10" />

                                                {/* Main Card */}
                                                <div className="relative p-8 rounded-3xl h-full z-10 flex flex-col items-start justify-start space-y-4">
                                                    {/* Icon Glow Ring */}
                                                    <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr ${feature.gradient} shadow-lg ring-4 ${feature.ringColor} transition-all duration-300`}>
                                                        <feature.icon className="text-white w-8 h-8" />
                                                    </div>

                                                    <h3 className="text-2xl font-extrabold text-white">{feature.title}</h3>
                                                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                                                </div>
                                            </motion.div>

                                        );
                                    })}
                                </div>
                            </div>
                        </motion.section>

                        {/* Final CTA Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative z-10 py-20 px-3 md:px-6"
                        >
                            <div className="max-w-4xl mx-auto text-center">
                                <motion.div
                                    variants={floatingVariants}
                                    animate="animate"
                                    className="mb-8"
                                >
                                    <h2 className="text-5xl md:text-6xl font-black mb-6">
                                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                            Ready to Explore Your
                                        </span>
                                        <br />
                                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            Reddit Universe?
                                        </span>
                                    </h2>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="text-xl text-gray-300 mb-12 leading-relaxed"
                                >
                                    Join thousands of Reddit users who have unlocked insights about their digital journey.
                                </motion.p>

                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onGetStarted}
                                    className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold text-xl rounded-3xl shadow-2xl shadow-purple-500/25 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative flex items-center space-x-3">
                                        <span>Start Your Analysis</span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.section>

                        {/* Floating Elements */}
                        <motion.div
                            variants={floatingVariants}
                            animate="animate"
                            className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-60"
                        />
                        <motion.div
                            variants={floatingVariants}
                            animate="animate"
                            style={{ animationDelay: '2s' }}
                            className="absolute top-40 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-40"
                        />
                        <motion.div
                            variants={floatingVariants}
                            animate="animate"
                            style={{ animationDelay: '4s' }}
                            className="absolute bottom-40 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-50"
                        />
                        <motion.div
                            variants={floatingVariants}
                            animate="animate"
                            style={{ animationDelay: '1s' }}
                            className="absolute bottom-20 right-10 w-5 h-5 bg-indigo-400 rounded-full opacity-30"
                        />

                        {/* faq */}
                        <FAQSection />

                        <SlimAboutBanner />

                    </motion.div>

                </>
            )}
        </main>
    );
}
