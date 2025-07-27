// pages/dashboard.js
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getRedditData } from "@/services/redditApi";
import ROUTES from "@/config/routeConfig";
import UserInfoCard from "@/components/dashboard/UserInfoCard";

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Star, MessageSquare, Settings, Shield, Award } from 'lucide-react';
import KarmaOverview from '@/components/dashboard/KarmaOverview';
import AccountFeatures from '@/components/dashboard/AccountFeatures';
import UserSettings from '@/components/dashboard/UserSettings';
import SubredditPanel from '@/components/dashboard/SubredditPanel';
import StatsGrid from '@/components/dashboard/StatsGrid';
import { Loader } from "@/components/loader";
import UserDropdown from "@/components/UserDropdown";


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const router = useRouter();

    // Fixes the #_ issue
    useEffect(() => {
        if (window.location.hash && window.location.hash.startsWith("#_")) {
            // Clean the hash without triggering a reload
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(ROUTES.LOGIN);
        }
    }, [status, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.accessToken || !session?.user?.name) return;
            try {
                const data = await getRedditData("/api/v1/me", session.accessToken, session.user.name);
                setProfile(data);
                // setuserData(data)
            } catch (err) {
                console.error("Failed to fetch profile");
            }
        };

        if (status === "authenticated") {
            fetchProfile();
        }
    }, [session, status]);

    if (status === "loading") {
        return <><Loader /></>;
    }

    // useEffect(() => {
    //     // Simulate data loading
    //     const timer = setTimeout(() => setIsLoading(false), 1500);
    //     return () => clearTimeout(timer);
    // }, []);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'analytics', label: 'Analytics', icon: Star },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
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

    return (
        <main>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                // className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20"
                className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 relative overflow-hidden"
            >
                {/* Navigation Header */}
                {/* <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50"
                >
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-8">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Reddit Analyzer
                                </h1>

                                <nav className="hidden md:flex space-x-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <motion.button
                                                key={tab.id}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{tab.label}</span>
                                            </motion.button>
                                        );
                                    })}
                                </nav>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => signOut({ callbackUrl: ROUTES.HOME })}
                                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-all duration-300"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.header> */}

                <motion.header
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 
        bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl px-6 py-3"
                >
                    <div className="flex items-center justify-between">
                        {/* Logo + Tabs */}
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                Reddit Analyzer
                            </h1>
                            <nav className="hidden md:flex space-x-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <motion.button
                                            key={tab.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 mr-1" />
                                            <span>{tab.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* User + Logout */}
                        {/* Avatar Dropdown */}
                        <UserDropdown profile={profile} session={session} />

                    </div>
                </motion.header>


                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-6 py-8 mt-20">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* User Info and Quick Stats */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <motion.div variants={itemVariants} className="lg:col-span-2">
                                        <UserInfoCard userData={profile} />
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <StatsGrid userData={profile} />
                                    </motion.div>
                                </div>

                                {/* Karma Overview */}
                                <motion.div variants={itemVariants}>
                                    {/* <KarmaOverview userData={profile} /> */}
                                </motion.div>

                                {/* Account Features and Subreddit Panel */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <motion.div variants={itemVariants}>
                                        {/* <AccountFeatures userData={profile} /> */}
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        {/* <SubredditPanel userData={profile} /> */}
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'analytics' && (
                            <motion.div
                                key="analytics"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-20"
                            >
                                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Star className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h2>
                                    <p className="text-gray-400 mb-8">
                                        Deep dive into your Reddit activity patterns, engagement metrics, and growth trends.
                                    </p>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold"
                                    >
                                        {/* <Zap className="w-5 h-5" /> */}
                                        <span>Coming Soon</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* <UserSettings userData={profile} /> */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </motion.div>
        </main>
    );
}
