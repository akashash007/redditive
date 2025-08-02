// pages/analytics.jsx
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ROUTES from "@/config/routeConfig";
import { fetchFromEndpoint } from "@/services/redditApi";
import { useNotify } from "@/utils/NotificationContext";
import { Loader } from "@/components/loader";
import KarmaOverview from "@/components/dashboard/KarmaOverview";

export default function AnalyticsPage() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const router = useRouter();
    const { notify } = useNotify();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(ROUTES.LOGIN);
        }
    }, [status]);

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

    if (status === "loading" || !profile) return <Loader />;

    return (
        <DashboardLayout>
            <KarmaOverview userData={profile} />
        </DashboardLayout>
    );
}
