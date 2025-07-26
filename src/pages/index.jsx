import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import ROUTES from "@/config/routeConfig";

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Clean up URL hash issue
    useEffect(() => {
        if (window.location.hash && window.location.hash.startsWith("#_")) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    }, []);

    // Redirect based on authentication status
    useEffect(() => {
        if (status === "loading") return; // Wait for session to load
        
        if (status === "authenticated") {
            router.push(ROUTES.DASHBOARD);
        } else {
            router.push(ROUTES.LOGIN);
    // Show loading state while redirecting

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
