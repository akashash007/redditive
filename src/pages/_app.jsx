import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/utils/NotificationContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </SessionProvider>
    );
}
