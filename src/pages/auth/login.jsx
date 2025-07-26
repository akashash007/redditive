// pages/login.js
import ROUTES from "@/config/routeConfig";
import { signIn } from "next-auth/react";

export default function Login() {
    return (
        <main style={{ padding: "2rem" }}>
            <h2>Please log in</h2>
            {/* <button onClick={() => signIn("reddit")}>Login with Reddit</button> */}
            <button onClick={() => signIn("reddit", { callbackUrl: ROUTES.DASHBOARD })}>
                Login with Reddit
            </button>
        </main>
    );
}
