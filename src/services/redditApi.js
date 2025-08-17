// src/services/redditApi.js
import axios from "axios";
import { BASE_URLS, ENDPOINTS } from "./endpoint";
import { signOut } from "next-auth/react";
import { Router } from "next/router";

/**
 * Generic GET request using endpoint key from ENDPOINTS config
 * @param {string} key - Key name from ENDPOINTS object (e.g., 'getUserProfile')
 * @param {string} token - OAuth access token
 * @param {string} username - Reddit username for User-Agent header
 * @returns Reddit API response data
 */


// export const fetchFromEndpoint = async (key, token, params = {}) => {
//     const endpoint = ENDPOINTS[key];
//     if (!endpoint) {
//         throw new Error(`Endpoint key "${key}" is not defined.`);
//     }

//     const baseURL = BASE_URLS[endpoint.base];
//     if (!baseURL) {
//         throw new Error(`Base URL for "${endpoint.base}" is not defined.`);
//     }

//     // ✅ support dynamic URL
//     const urlPath = typeof endpoint.url === "function" ? endpoint.url(params) : endpoint.url;

//     try {
//         const response = await axios.get(`${baseURL}${urlPath}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 // "User-Agent": `web:redditive:v0.1.0 (by /u/${params.username || "anonymous"})`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error("❌ Reddit API error:", error?.response?.data || error.message);
//         throw error;
//     }
// };

export const fetchFromEndpoint = async (key, token, params = {}) => {
    const endpoint = ENDPOINTS[key];
    if (!endpoint) {
        throw new Error(`Endpoint key "${key}" is not defined.`);
    }

    const baseURL = BASE_URLS[endpoint.base];
    if (!baseURL) {
        throw new Error(`Base URL for "${endpoint.base}" is not defined.`);
    }

    // ✅ Support dynamic URL
    const urlPath = typeof endpoint.url === "function" ? endpoint.url(params) : endpoint.url;

    try {
        const response = await axios.get(`${baseURL}${urlPath}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const status = error?.response?.status;

        // 🚨 Auto logout if token/authorization error or major server issue
        if ([401, 403, 419].includes(status) || (status >= 500 && status < 600)) {
            console.warn(`⚠️ Authorization/server error (${status}) — Logging out...`);

            // NextAuth signOut will redirect to login page
            await signOut({ redirect: false });
            Router.push("/login");
            return;
        }

        console.error("❌ Reddit API error:", error?.response?.data || error.message);
        throw error;
    }
};

/**
 * Generic POST request using endpoint key from ENDPOINTS config
 * @param {string} key - Key name from ENDPOINTS object (e.g., 'postComment')
 * @param {string} token - OAuth access token
 * @param {string} username - Reddit username for User-Agent header
 * @param {object} payload - Request body (form data or JSON depending on Reddit API)
 * @returns Reddit API response data
 */
export const postToEndpoint = async (key, token, username = "anonymous", payload = {}) => {
    const endpoint = ENDPOINTS[key];
    if (!endpoint) {
        throw new Error(`Endpoint key "${key}" is not defined.`);
    }

    const baseURL = BASE_URLS[endpoint.base];
    if (!baseURL) {
        throw new Error(`Base URL for "${endpoint.base}" is not defined.`);
    }

    try {
        const response = await axios.post(`${baseURL}${endpoint.url}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "User-Agent": `web:redditive:v0.1.0 (by /u/${username})`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Reddit POST error:", error?.response?.data || error.message);
        throw error;
    }
};
