// src/services/redditApi.js
import axios from "axios";

/**
 * Generic GET request to Reddit API with access token
 * @param {string} url - Reddit endpoint (e.g. /api/v1/me)
 * @param {string} token - OAuth access token
 * @param {string} username - Reddit username for User-Agent header
 * @returns Reddit API response data
 */
export const getRedditData = async (url, token, username = "anonymous") => {
    try {
        const response = await axios.get(`https://oauth.reddit.com${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "User-Agent": `web:redditive:v0.1.0 (by /u/${username})`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Reddit API error:", error?.response?.data || error.message);
        throw error;
    }
};
