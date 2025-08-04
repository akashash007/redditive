import React, { useEffect, useRef, useState } from "react";
import {
    Inbox,
    FileText,
    MessageSquare,
    Search,
    X,
    ChevronDown,
    User2,
    ThumbsUp,
    MessageCircle,
    CalendarDays,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotify } from "@/utils/NotificationContext";
import { getBestThumbnail } from "@/utils/redditHelpers";

const FALLBACK_IMAGE = "/redditive_favicon.png";

export default function SavedItemsPanel({ savedItems = [] }) {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [grouped, setGrouped] = useState({});
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedSubreddit, setSelectedSubreddit] = useState("all");
    const [showDropdown, setShowDropdown] = useState(false);

    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [activeRect, setActiveRect] = useState(null);
    const { notify } = useNotify();

    const filterTabs = [
        { id: "all", label: "All", icon: Inbox },
        { id: "posts", label: "Posts", icon: FileText },
        { id: "comments", label: "Comments", icon: MessageSquare },
    ];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    // Tab underline animation
    useEffect(() => {
        const el = containerRef.current?.querySelector(
            `[data-tab="${activeFilter}"]`
        );
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (el && containerRect) {
            const elRect = el.getBoundingClientRect();
            setActiveRect({
                width: elRect.width,
                height: elRect.height,
                x: elRect.left - containerRect.left,
                y: elRect.top - containerRect.top,
            });
        }
    }, [activeFilter]);

    // Grouping and filtering
    useEffect(() => {
        const filtered = savedItems.filter((item) => {
            if (activeFilter === "posts") return item.kind === "t3";
            if (activeFilter === "comments") return item.kind === "t1";
            return true;
        });

        const searchFiltered = filtered.filter((item) =>
            (item.data.title || item.data.body || "")
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase())
        );

        const subredditFiltered =
            selectedSubreddit === "all"
                ? searchFiltered
                : searchFiltered.filter(
                    (item) => item.data.subreddit === selectedSubreddit
                );

        if (search && subredditFiltered.length === 0) {
            notify("error", "No results found", "Try adjusting your search or filters.");
        }

        const groupedBySub = {};
        subredditFiltered.forEach((item) => {
            const sub = item.data.subreddit;
            if (!groupedBySub[sub]) groupedBySub[sub] = [];
            groupedBySub[sub].push(item);
        });

        setGrouped(groupedBySub);
    }, [savedItems, activeFilter, debouncedSearch, selectedSubreddit]);

    const truncateWords = (text, wordLimit = 10) => {
        if (!text) return "";
        const words = text.split(/\s+/);
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + "..."
            : text;
    };

    const filteredBase = savedItems.filter((item) => {
        const matchesSubreddit =
            selectedSubreddit === "all" || item.data.subreddit === selectedSubreddit;
        const matchesSearch =
            (item.data.title || item.data.body || "")
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase());
        return matchesSubreddit && matchesSearch;
    });

    const countAll = filteredBase.length;
    const countPosts = filteredBase.filter((i) => i.kind === "t3").length;
    const countComments = filteredBase.filter((i) => i.kind === "t1").length;

    const countMap = {
        all: countAll,
        posts: countPosts,
        comments: countComments,
    };

    const uniqueSubreddits = Array.from(
        new Set(savedItems.map((item) => item.data.subreddit))
    ).sort();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
            <div >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    {/* Filter Tabs */}
                    <div ref={containerRef} className="relative flex items-center space-x-2">
                        {activeRect && (
                            <motion.div
                                className="absolute rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow z-0"
                                initial={false}
                                animate={activeRect}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        {/* {filterTabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                data-tab={id}
                                onClick={() => setActiveFilter(id)}
                                className={`relative z-10 flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === id
                                    ? "text-white"
                                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                    }`}
                            >
                                <Icon className="w-4 h-4 mr-1" />
                                {label}
                                <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                    {countMap[id]}
                                </span>
                            </button>
                        ))} */}

                        {filterTabs.map(({ id, label, icon: Icon }) => (
                            <motion.button
                                key={id}
                                data-tab={id}
                                onClick={() => setActiveFilter(id)}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: activeFilter !== id ? 1.05 : 1 }}
                                animate={{ scale: activeFilter === id ? 1.1 : 1 }}
                                className={`relative z-10 flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === id
                                    ? "text-white"
                                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                    }`}
                            >
                                <Icon className="w-4 h-4 mr-1" />
                                {label}
                                <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                    {countMap[id]}
                                </span>
                            </motion.button>
                        ))}


                        {/* Subreddit Filter */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown((prev) => !prev)}
                                className="relative z-10 flex items-center px-4 py-1.5 rounded-full text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition"
                            >
                                r/{selectedSubreddit === "all" ? "All" : selectedSubreddit}
                                <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                    {selectedSubreddit === "all"
                                        ? uniqueSubreddits.length
                                        : savedItems.filter(i => i.data.subreddit === selectedSubreddit).length}
                                </span>
                                <ChevronDown className="ml-1 w-4 h-4" />
                            </button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        //                                 className="absolute top-12 left-0 w-48 max-h-[250px] overflow-y-auto z-20
                                        // bg-gray-950/60 backdrop-blur-lg text-sm text-gray-200 rounded-xl
                                        // border border-white/10 shadow-xl custom-scrollbar"
                                        className="absolute top-12 left-0 w-48 max-h-[250px] overflow-y-auto overflow-x-hidden z-20
bg-gray-950/60 backdrop-blur-lg text-sm text-gray-200 rounded-xl
border border-white/10 shadow-xl custom-scrollbar"
                                    >
                                        <motion.button
                                            whileHover={{ x: -5 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={() => {
                                                setSelectedSubreddit("all");
                                                setActiveFilter("all");
                                                setShowDropdown(false);
                                            }}
                                            className="block w-full px-4 py-2 text-left hover:bg-white/10 transition"
                                        >
                                            All Subreddits
                                        </motion.button>

                                        {uniqueSubreddits.map((sub, index) => (
                                            <motion.button
                                                key={sub}
                                                initial={{ x: 30, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.05 * index }}
                                                onClick={() => {
                                                    setSelectedSubreddit(sub);
                                                    setActiveFilter("all");
                                                    setShowDropdown(false);
                                                }}
                                                className="block w-full px-4 py-2 text-left hover:bg-white/10 transition"
                                            >
                                                r/{sub} ({grouped[sub]?.length ?? savedItems.filter(i => i.data.subreddit === sub).length})
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* {showDropdown && (
                                <div
                                    className="absolute top-12 left-0 w-48 max-h-[250px] overflow-y-auto z-20
                bg-gray-950/60 backdrop-blur-lg text-sm text-gray-200 rounded-xl
                border border-white/10 shadow-xl custom-scrollbar"
                                >
                                    <button
                                        onClick={() => {
                                            setSelectedSubreddit("all");
                                            setActiveFilter("all");
                                            setShowDropdown(false);
                                        }}
                                        className="block w-full px-4 py-2 text-left hover:bg-white/10 transition"
                                    >
                                        All Subreddits
                                    </button>

                                    {uniqueSubreddits.map((sub) => (
                                        <button
                                            key={sub}
                                            onClick={() => {
                                                setSelectedSubreddit(sub);
                                                setActiveFilter("all");
                                                setShowDropdown(false);
                                            }}
                                            className="block w-full px-4 py-2 text-left hover:bg-white/10 transition"
                                        >
                                            r/{sub} ({grouped[sub]?.length ?? savedItems.filter(i => i.data.subreddit === sub).length})
                                        </button>
                                    ))}
                                </div>
                            )} */}
                        </div>

                        {/* Clear Filters Button */}
                        {(selectedSubreddit !== "all" || search || activeFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setSelectedSubreddit("all");
                                    setActiveFilter("all");
                                }}
                                className="w-8 h-8 rounded-full bg-gray-800/60 backdrop-blur-lg 
             border border-white/10 shadow-md text-white hover:bg-gray-700/60 
             flex items-center justify-center transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-3 left-2 w-4 h-4 text-white/60" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search saved..."
                            className="pl-8 pr-8 py-2 w-full rounded-full bg-white/10 text-white placeholder:text-white/50 outline-none"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute top-3 right-2 text-white/60 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Grouped Cards */}
                {Object.entries(grouped).map(([subreddit, items]) => (
                    <div key={subreddit} className="mb-10">
                        {/* <h2 className="text-xl font-semibold mb-4 text-white/90">
                            r/{subreddit} ({items.length})
                        </h2> */}
                        <h2 className="text-xl font-semibold mb-4 text-white/90 flex items-center gap-2 w-full">
                            {/* r/ with circular gradient background */}
                            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full px-2 py-1 text-xs text-white font-semibold">
                                r/
                            </span>

                            {/* Subreddit name */}
                            <span className="text-white text-base font-medium">
                                {subreddit}
                            </span>

                            {/* Count badge */}
                            <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-white font-medium">
                                {items.length}
                            </span>

                            {/* Gradient divider line */}
                            <div className="flex-1 h-px bg-gradient-to-r from-purple-500 to-indigo-500 ml-2 rounded-full" />
                        </h2>

                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map((item) => {
                                const isPost = item.kind === "t3";
                                const title = item.data.title || "Untitled";
                                const body = item.data.body || item.data.selftext || "";

                                return (
                                    <a
                                        key={item.data.id}
                                        href={`https://reddit.com${item.data.permalink}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex gap-4 bg-white/5 hover:bg-white/10 transition rounded-xl p-2 border border-white/10"
                                    >
                                        <img
                                            // src={thumbnail}
                                            src={getBestThumbnail(item)}
                                            alt="Thumbnail"
                                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex flex-col justify-start overflow-hidden">
                                            <h3 className="text-lg font-bold text-white/90 truncate">
                                                {title}
                                            </h3>
                                            <p className="text-white/70 text-sm mt-1">
                                                {truncateWords(body, 10)}
                                            </p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div> */}

                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* <AnimatePresence> */}
                            {items.map((item) => {
                                const {
                                    title,
                                    selftext,
                                    body: commentBody,
                                    link_title,
                                    author,
                                    ups,
                                    num_comments,
                                    permalink,
                                    created_utc,
                                } = item.data;

                                const displayTitle = title || link_title || "Untitled";
                                const body = selftext || commentBody || "";
                                const thumbnail = getBestThumbnail(item);
                                const postDate = created_utc ? new Date(created_utc * 1000) : null;
                                const formattedDate = postDate
                                    ? postDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })
                                    : null;

                                return (
                                    // <motion.a
                                    //     key={item.data.id}
                                    //     href={`https://reddit.com${permalink}`}
                                    //     target="_blank"
                                    //     rel="noopener noreferrer"
                                    //     layout
                                    //     initial={{ opacity: 0, scale: 0.95 }}
                                    //     animate={{ opacity: 1, scale: 1 }}
                                    //     exit={{ opacity: 0, scale: 0.95 }}
                                    //     transition={{ duration: 0.3 }}
                                    //     className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300"
                                    // >
                                    //     <img
                                    //         src={thumbnail}
                                    //         alt="Thumbnail"
                                    //         className="w-full md:w-32 h-32 object-cover rounded-xl shadow-md"
                                    //     />

                                    //     <div className="flex flex-col justify-between flex-1 overflow-hidden">
                                    //         <div>
                                    //             <h3 className="text-lg font-semibold text-white truncate mb-1">
                                    //                 {title}
                                    //             </h3>
                                    //             <p className="text-sm text-white/70 line-clamp-3">
                                    //                 {truncateWords(body, 20)}
                                    //             </p>
                                    //         </div>

                                    //         <div className="flex items-center text-xs text-white/60 mt-4 flex-wrap gap-4">
                                    //             <span className="flex items-center gap-1">
                                    //                 <User2 className="w-4 h-4" /> {author}
                                    //             </span>
                                    //             <span className="flex items-center gap-1">
                                    //                 <ThumbsUp className="w-4 h-4" /> {ups}
                                    //             </span>
                                    //             <span className="flex items-center gap-1">
                                    //                 <MessageCircle className="w-4 h-4" /> {num_comments}
                                    //             </span>
                                    //             {formattedDate && (
                                    //                 <span className="flex items-center gap-1">
                                    //                     <CalendarDays className="w-4 h-4" /> {formattedDate}
                                    //                 </span>
                                    //             )}
                                    //         </div>
                                    //     </div>
                                    // </motion.a>
                                    <motion.a
                                        key={item.data.id}
                                        href={`https://reddit.com${permalink}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        layout
                                        // initial={{ opacity: 0, scale: 0.95 }}
                                        // animate={{ opacity: 1, scale: 1 }}
                                        // exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl border border-white/10 
             bg-gradient-to-br from-[#2d0b4f]/60 via-[#1e0a3c]/50 to-[#140933]/40 
             backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                                    >
                                        <img
                                            src={thumbnail}
                                            alt="Thumbnail"
                                            className="w-full md:w-32 h-32 object-cover rounded-xl shadow-md"
                                        />

                                        <div className="flex flex-col justify-between flex-1 overflow-hidden">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white truncate mb-1">
                                                    {title}
                                                </h3>
                                                <p className="text-sm text-white/70 line-clamp-3">
                                                    {truncateWords(body, 20)}
                                                </p>
                                            </div>

                                            <div className="flex items-center text-xs text-white/60 mt-4 flex-wrap gap-4">
                                                <span className="flex items-center gap-1">
                                                    <User2 className="w-4 h-4 text-purple-400" /> {author}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ThumbsUp className="w-4 h-4 text-purple-400" /> {ups}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle className="w-4 h-4 text-purple-400" /> {num_comments}
                                                </span>
                                                {formattedDate && (
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays className="w-4 h-4 text-purple-400" /> {formattedDate}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.a>

                                );
                            })}

                            {/* </AnimatePresence> */}
                        </motion.div>

                    </div>
                ))}

                {/* {Object.keys(grouped).length === 0 && (
                    <div className="text-center py-16 text-white/70 text-lg">
                        No saved items found. Try adjusting your search or filters.
                    </div>
                )} */}
                {Object.keys(grouped).length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center text-center py-16 text-white/70 text-lg"
                    >
                        <Inbox className="w-10 h-10 mb-4 text-white/40" />
                        <p className="font-medium">No saved items found.</p>
                        <p className="text-sm text-white/50 mt-1">
                            Try adjusting your search or filters.
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div >
    );
}
