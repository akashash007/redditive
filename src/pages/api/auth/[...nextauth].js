import NextAuth from "next-auth";
import RedditProvider from "next-auth/providers/reddit";

export default NextAuth({
    providers: [
        // RedditProvider({
        //     clientId: process.env.REDDIT_CLIENT_ID,
        //     clientSecret: process.env.REDDIT_CLIENT_SECRET,
        // }),
        RedditProvider({
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "identity history read privatemessages",
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, account }) {
            // Add Reddit access token to the JWT
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            // Add access token to session
            session.accessToken = token.accessToken;
            return session;
        },
    },
});
