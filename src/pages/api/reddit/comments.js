// // pages/api/reddit/comments.js
// export default async function handler(req, res) {
//     const { username, after = null } = req.query;

//     if (!username) return res.status(400).json({ error: "Username is required" });

//     const url = `https://www.reddit.com/user/${username}/comments.json?limit=100${after ? `&after=${after}` : ''}`;

//     try {
//         const response = await fetch(url, {
//             headers: {
//                 "User-Agent": "RedditCommentAnalyzer/0.1 by your_username",
//             },
//         });

//         if (!response.ok) {
//             return res.status(response.status).json({ error: "Failed to fetch from Reddit" });
//         }

//         const data = await response.json();
//         return res.status(200).json(data);
//     } catch (error) {
//         console.error("Reddit API fetch error:", error);
//         return res.status(500).json({ error: "Server error" });
//     }
// }

export default async function handler(req, res) {
    const { username, after = null, accessToken } = req.query;

    if (!username || !accessToken) {
        return res.status(400).json({ error: "Username and access token required" });
    }

    const url = `https://oauth.reddit.com/user/${username}/comments.json?limit=100${after ? `&after=${after}` : ''}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "User-Agent": "RedditCommentAnalyzer/1.0 by your_username",
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch from Reddit" });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Reddit API fetch error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
