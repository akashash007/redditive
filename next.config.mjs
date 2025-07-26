/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/login",
                destination: "/auth/login",
            },
            {
                source: "/profile",
                destination: "/user/profile",
            },
            // Add more custom URLs here as needed
        ];
    },
};

export default nextConfig;
