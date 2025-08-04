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

// export default function DashboardLayout({ children }) {
//     const { data: session, status } = useSession();
//     const router = useRouter();
//     const [profile, setProfile] = useState(null);
//     const { notify } = useNotify();

//     useEffect(() => {
//         if (status === "unauthenticated") {
//             router.push(ROUTES.LOGIN);
//         }
//     }, [status]);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             if (!session?.accessToken || !session?.user?.name) return;
//             try {
//                 const data = await fetchFromEndpoint("getUserProfile", session.accessToken, session.user.name);
//                 setProfile(data);
//             } catch (err) {
//                 console.error("Failed to fetch profile", err);
//                 notify("error", "Profile Error", "Failed to load profile info.");
//             }
//         };

//         if (status === "authenticated") {
//             fetchProfile();
//         }
//     }, [session, status]);

//     if (status === "loading" || !profile) return <Loader />;

//     const tabs = [
//         { id: "overview", label: "Overview", icon: User },
//         { id: "analytics", label: "Analytics", icon: BarChart2 },
//     ];

//     return (
//         <main className="relative min-h-screen w-full overflow-hidden">
//             <FloatingBackground particleCount={25} />
//             <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 flex items-start justify-center relative overflow-hidden pt-20 px-6">
//                 <Menu
//                     tabs={tabs}
//                     profile={profile} // now real Reddit profile
//                     session={session}
//                     setActiveTab={() => { }}
//                 />
//                 <div className="w-full max-w-7xl mx-auto my-8">{children}</div>
//             </div>
//         </main>
//     );
// }

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
            <FloatingBackground particleCount={25} />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/40 flex items-start justify-center relative overflow-hidden pt-20 px-6">
                <Menu
                    tabs={tabs}
                    profile={profile}
                    session={session}
                    setActiveTab={() => { }}
                    notifications={notifications}
                />
                <div className="w-full max-w-7xl mx-auto my-8">{children}</div>
            </div>
        </main>
    );
}
