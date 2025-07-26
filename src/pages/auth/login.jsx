// pages/login.js
import ROUTES from "@/config/routeConfig";
import { signIn } from "next-auth/react";

export default function Login() {
    return (
        <main styleimport { Edit as Reddit, Sparkles, ArrowRight } from 'lucide-react'            {/* <button onClick={() => signIn("reddit")}>Login with Reddit</button> */}
            <button onClick={() => signIn("reddit", { callbackUrl: ROUTES.DASHBOARD })}>
                Login with Reddit
            </button>
        </main>
    );
}
