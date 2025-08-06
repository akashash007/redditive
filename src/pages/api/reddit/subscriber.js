export default async function handler(req, res) {
    const { accessToken } = req.query;
    if (!accessToken) {
        return res.status(400).json({ error: "Access token is required" });
    }

    const url = `https://oauth.reddit.com/subreddits/mine/subscriber?limit=100`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "web:reddit-analyzer:v1.0 (by /u/YourRedditUsername)",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Reddit API fetch error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
