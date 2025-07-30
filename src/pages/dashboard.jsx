// pages/dashboard.js
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchFromEndpoint, getRedditData } from "@/services/redditApi";
import ROUTES from "@/config/routeConfig";

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Star, MessageSquare, Settings, Shield, Award, BarChart2 } from 'lucide-react';
import { Loader } from "@/components/loader";
import Analytics from "@/components/ui/analytics";
import Overview from "@/components/ui/overview";
import UserSettings from "@/components/dashboard/UserSettings";
import Menu from "@/components/ui/menu";
import { useNotify } from "@/utils/NotificationContext";
import FloatingBackground from "@/components/ui/FloatingBackground";


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const router = useRouter();
    const { notify } = useNotify();
    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    ];

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
            } catch (err) {
                notify(
                    "error",
                    "Failed to load profile",
                    "Please check your connection or try logging in again."
                );
                console.error("Failed to fetch profile");
            }
        };

        if (status === "authenticated") {
            fetchProfile();
        }
    }, [session, status]);

    if (status === "loading") return <><Loader /></>;

    return (
        <main className="relative min-h-screen w-full overflow-hidden">
            <FloatingBackground particleCount={25} />
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
                        )}

                        {activeTab === 'analytics' && (
                            <Analytics profile={profile} session={session} />
                        )}

                        {activeTab === 'settings' && (
                            <UserSettings userData={profile} setActiveTab={setActiveTab} />
                        )}
                    </AnimatePresence>
                </main>
            </motion.div>
        </main>
    );
}
