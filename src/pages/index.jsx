// pages/index.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ROUTES from "@/config/routeConfig";

export default function Index() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            // If already logged in, go to dashboard
            router.push(ROUTES.DASHBOARD);
        }
    }, [status, router]);

    const goToLogin = () => {
        router.push(ROUTES.LOGIN);
    };

    return (
        <main style={{ padding: "2rem" }}>
            <h2 >Welcome to Redditive!</h2>
            <p>Explore and visualize your Reddit profile in fun ways.</p>
            {status === "loading" ? (
                <p>Loading...</p>
            ) : (
                <button onClick={goToLogin}>Login to Get Started</button>
            )}
        </main>
    );
}
