// export default async function handler(req, res) {
//     const { accessToken, username } = req.query;

//     if (!accessToken || !username) {
//         return res
//             .status(400)
//             .json({ error: "Access token and username are required" });
//     }

//     const url = `https://oauth.reddit.com/user/${username}/submitted`;

//     try {
//         const response = await fetch(url, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 "User-Agent": "web:reddit-analyzer:v1.0 (by /u/YourRedditUsername)",
//             },
//         });

//         if (!response.ok) {
//             const errorText = await response.text();
//             return res.status(response.status).json({ error: errorText });
//         }

//         const data = await response.json();
//         return res.status(200).json(data);
//     } catch (error) {
//         console.error("Trophies fetch error:", error);
//         return res.status(500).json({ error: "Server error" });
//     }
// }

export default async function handler(req, res) {
    const { accessToken, username, after } = req.query;

    if (!accessToken || !username) {
        return res
            .status(400)
            .json({ error: "Access token and username are required" });
    }

    const params = new URLSearchParams({ limit: '10' });
    if (after) params.append("after", after);

    const url = `https://oauth.reddit.com/user/${username}/submitted?${params.toString()}`;

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
        console.error("Reddit fetch error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
