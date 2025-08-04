export default async function handler(req, res) {
    const { accessToken } = req.query;

    if (!accessToken) {
        return res.status(400).json({ error: "Access token is required" });
    }

    const url = `https://oauth.reddit.com/message/unread.json?limit=100`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "User-Agent": `RedditCommentAnalyzer/1.0`,
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch unread messages" });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Reddit API fetch error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
