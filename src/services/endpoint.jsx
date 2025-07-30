// src/config/endpoint.js

const BASE_URLS = {
    reddit: "https://oauth.reddit.com",
    redditAuth: "https://www.reddit.com",
};

const ENDPOINTS = {
    getUserProfile: {
        url: "/api/v1/me",
        base: "reddit",
    },
    getTrophies: {
        url: "/api/v1/me/trophies",
        base: "reddit",
    },
    getFriends: {
        url: "/api/v1/me/friends",
        base: "reddit",
    },
    postComment: {
        url: "/api/comment",
        base: "reddit",
    },
    refreshToken: {
        url: "/access_token",
        base: "redditAuth",
    },
    getUserComments: {
        url: ({ username }) => `/user/${username}/comments`,
        base: "reddit",
    },
};

export { BASE_URLS, ENDPOINTS };
