import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <title>Redditive - Explore Your Reddit Profile</title>
                <meta name="description" content="A fun tool to analyze Reddit profiles and activity." />
                <link rel="icon" href="/redditive_favicon.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
