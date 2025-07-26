// import { signIn, signOut, useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { getRedditData } from "@/utils/redditApi";

// export default function Home() {
//     const { data: session } = useSession();
//     const [profile, setProfile] = useState(null);

//     useEffect(() => {
//         // If URL ends in #_, remove it
//         if (window.location.hash === "#_") {
//             window.history.replaceState(null, null, window.location.pathname);
//         }
//     }, []);


//     useEffect(() => {
//         const fetchProfile = async () => {
//             if (!session?.accessToken || !session?.user?.name) return;
//             try {
//                 const data = await getRedditData("/api/v1/me", session.accessToken, session.user.name);
//                 setProfile(data);
//             } catch (err) {
//                 console.error("Failed to fetch profile");
//             }
//         };

//         fetchProfile();
//     }, [session]);

//     return (
//         <main style={{ padding: "2rem" }}>
//             {!session ? (
//                 <>
//                     <h2>Please log in</h2>
//                     <button onClick={() => signIn("reddit")}>Login with Reddit</button>
//                 </>
//             ) : (
//                 <>
//                     <h2>Welcome, {session.user.name}</h2>
//                     {profile && (
//                         <pre>{JSON.stringify(profile, null, 2)}</pre>
//                     )}
//                     <button onClick={() => signOut()}>Logout</button>
//                 </>
//             )}
//         </main>
//     );
// }

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getRedditData } from "@/services/redditApi";
import ROUTES from "@/config/routeConfig";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const router = useRouter();

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
                console.error("Failed to fetch profile", err);
            }
        };

        if (status === "authenticated") {
            fetchProfile();
        }
    }, [session, status]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return null; // Or a fallback UI
    }

    return (
        <main style={{ padding: "2rem" }}>
            <h2>Welcome, {session.user.name}</h2>
            {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
            <button onClick={() => signOut()}>Logout</button>
        </main>
    );
}
