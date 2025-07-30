// pages/dashboard.js
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchFromEndpoint, getRedditData } from "@/services/redditApi";
import ROUTES from "@/config/routeConfig";

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Star, MessageSquare, Settings, Shield, Award } from 'lucide-react';
import { Loader } from "@/components/loader";
import UserDropdown from "@/components/UserDropdown";
import Analytics from "@/components/ui/analytics";
import Overview from "@/components/ui/overview";
import UserSettings from "@/components/dashboard/UserSettings";
import Menu from "@/components/ui/menu";


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const [floatingParticles, setFloatingParticles] = useState([]);
    const router = useRouter();

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
                // const data = await getRedditData("/api/v1/me", session.accessToken, session.user.name);
                const data = await fetchFromEndpoint("getUserProfile", session.accessToken, session.user.name);
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

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'analytics', label: 'Analytics', icon: Star },
    ];



    return (
        <main className="relative min-h-screen w-full overflow-hidden">
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
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 flex items-center justify-center relative overflow-hidden"
            >
                {/* Navigation Header */}
                <Menu tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} session={session} />


                {/* Main Content */}
                <main className="w-full mx-auto px-6 py-8 mt-20">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <Overview profile={profile} />
                            // <Overview profile={profile} status={status} session={session} />
                        )}

                        {activeTab === 'analytics' && (
                            <Analytics profile={profile} session={session} />
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                            >
                                <UserSettings userData={profile} setActiveTab={setActiveTab} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </motion.div>
        </main>
    );
}
