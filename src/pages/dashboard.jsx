import { motion } from 'framer-motion';
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogOut, Settings, TrendingUp } from 'lucide-react';
import { getRedditData } from "@/services/redditApi";
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import AnimatedButton from '@/components/ui/AnimatedButton';
import UserInfoCard from '@/components/dashboard/UserInfoCard';
import KarmaChart from '@/components/dashboard/KarmaChart';
import FeatureCards from '@/components/dashboard/FeatureCards';
import PageTransition from '@/components/layout/PageTransition';
import ROUTES from "@/config/routeConfig";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
            if (!session?.accessToken || !session?.user?.name) return;
            try {
                const data = await getRedditData("/api/v1/me", session.accessToken, session.user.name);
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchProfile();
        }
    }, [session, status]);

    if (status === "loading") {
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
        <PageTransition>
            <AnimatedBackground>
                <div className="min-h-screen p-4 md:p-8">
                    {/* Header */}
                    <motion.header
                        className="flex justify-between items-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <motion.h1 
                                className="text-3xl md:text-4xl font-bold text-white mb-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Reddit Analytics
                            </motion.h1>
                            <motion.p 
                                className="text-gray-400 flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Your personalized Reddit insights
                            </motion.p>
                        </div>
                        
                        <motion.div
                            className="flex space-x-3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <AnimatedButton
                                variant="secondary"
                                size="sm"
                                onClick={() => router.push('/settings')}
                            >
                                <Settings className="w-4 h-4" />
                            </AnimatedButton>
                            <AnimatedButton
                                variant="secondary"
                                size="sm"
                                onClick={() => signOut()}
                            >
                                <LogOut className="w-4 h-4" />
                            </AnimatedButton>
                        </motion.div>
                    </motion.header>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Info - Takes full width on mobile, 1 column on desktop */}
                        <div className="lg:col-span-1">
                            <UserInfoCard profile={profile} loading={loading} />
                        </div>
                        
                        {/* Karma Chart - Takes full width on mobile, 2 columns on desktop */}
                        <div className="lg:col-span-2">
                            <KarmaChart profile={profile} />
                        </div>
                        
                        {/* Feature Cards - Full width */}
                        <div className="lg:col-span-3">
                            <FeatureCards profile={profile} />
                        </div>
                    </div>

                    {/* Debug info (remove in production) */}
                    {process.env.NODE_ENV === 'development' && profile && (
                        <motion.details
                            className="mt-8 glass rounded-lg p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <summary className="text-white cursor-pointer mb-4">
                                Debug: Raw Profile Data
                            </summary>
                            <pre className="text-xs text-gray-400 overflow-auto">
                                {JSON.stringify(profile, null, 2)}
                            </pre>
                        </motion.details>
                    )}
                </div>
            </AnimatedBackground>
        </PageTransition>
    );
}