import axios from "axios";

// export default async function handler(req, res) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(400).json({ error: "Missing access token" });
//     }

//     const token = authHeader.replace("Bearer ", "");
//     const after = req.query.after || null;
//     try {
//         // const response = await axios.get("https://oauth.reddit.com/user/me/saved", {
//         const response = await axios.get(`https://oauth.reddit.com/user/${req.query.username}/saved.json?limit=100${after ? `&after=${after}` : ''}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "User-Agent": "redditive-app/1.0"
//             },
//             params: {
//                 limit: 100,
//                 ...(after && { after }),
//             },
//         });
//         console.log("Fetching from Reddit with after=", after);

//         return res.status(200).json(response.data);
//     } catch (error) {
//         console.error("Reddit fetch error:", error.response?.data || error.message);
//         return res.status(400).json({ error: "Failed to fetch saved content" });
//     }
// }

export default async function handler(req, res) {
    const { username, after = null, accessToken } = req.query;

    if (!username || !accessToken) {
        return res.status(400).json({ error: "Username and access token required" });
    }

    const url = `https://oauth.reddit.com/user/${username}/saved.json?limit=100${after ? `&after=${after}` : ''}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "User-Agent": `RedditCommentAnalyzer/1.0 by ${username}`,
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
