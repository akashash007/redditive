import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FloatingBackground from "@/components/ui/FloatingBackground";
import Menu from "@/components/ui/menu";
import { Loader } from "@/components/loader";
import { fetchFromEndpoint } from "@/services/redditApi";
import ROUTES from "@/config/routeConfig";
import { User, BarChart2 } from "lucide-react";
import { useNotify } from "@/utils/NotificationContext";
import { Coffee } from "lucide-react";
import CoffeeButton from "../ui/CoffeeButton";

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { notify } = useNotify();

    // 1. Redirect if unauthenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(ROUTES.LOGIN);
        }
    }, [status]);

    // 2. Fetch Reddit profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.accessToken || !session?.user?.name) return;
            try {
                const data = await fetchFromEndpoint("getUserProfile", session.accessToken, session.user.name);
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                notify("error", "Profile Error", "Failed to load profile info.");
            }
        };

        if (status === "authenticated") {
            fetchProfile();
        }
    }, [session, status]);

    // 3. Fetch messages/notifications
    useEffect(() => {
        const fetchMessages = async () => {
            if (!session?.accessToken) return;
            try {
                const res = await fetch(`/api/reddit/messages?accessToken=${session.accessToken}`);
                const json = await res.json();
                setNotifications(json?.data?.children || []);
            } catch (err) {
                console.error("Failed to fetch messages", err);
                notify("error", "Message Error", "Failed to load notifications.");
            }
        };

        if (status === "authenticated") {
            fetchMessages();
        }
    }, [session, status]);

    // ⛔ only return after all hooks are declared
    if (status === "loading" || !profile) return <Loader />;

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "analytics", label: "Analytics", icon: BarChart2 },
    ];

    return (
        <main className="relative min-h-screen w-full overflow-hidden">
            {/* Fixed background */}
            <div className="fixed inset-0 -z-10">
                <FloatingBackground particleCount={25} />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40" />
            </div>

            {/* Foreground content */}
            <div className="min-h-screen flex items-start justify-center relative pt-14 md:pt-20 px-3 md:px-6 z-10">
                <Menu
                    tabs={tabs}
                    profile={profile}
                    session={session}
                    setActiveTab={() => { }}
                    notifications={notifications}
                />
                <div className="w-full max-w-7xl mx-auto my-8">{children}</div>
            </div>

            {/* Floating Buy Me a Coffee Button */}
            <CoffeeButton />

        </main>
    );

}
