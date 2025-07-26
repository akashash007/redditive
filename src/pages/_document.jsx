import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <title>Redditive - Explore Your Reddit Profile</title>
                <meta name="description" content="A fun tool to analyze Reddit profiles and activity." />
                <link rel="icon" href="/logo.png" sizes="192x192" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
