// pages/dashboard.js
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getRedditData } from "@/services/redditApi";
import ROUTES from "@/config/routeConfig";

export default function Dashboard() {
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
            } catch (err) {
                console.error("Failed to fetch profile");
            }
        };

        if (status === "authenticated") {
            fetchProfile();
        }
    }, [session, status]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    return (
        <main style={{ padding: "2rem" }}>
            <h2>Welcome, {session?.user?.name}</h2>
            {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
            <button onClick={() => signOut({ callbackUrl: ROUTES.HOME })}>Logout</button>
        </main>
    );
}
