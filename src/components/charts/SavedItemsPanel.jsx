import React, { useEffect, useRef, useState, useCallback } from "react";
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

// subtle, de-synced floaters (used for background glows or badges)
const floatA = {
    animate: {
        y: [-8, 6, -8],
        rotate: [-2, 2, -2],
        transition: { duration: 6.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" },
    },
};
const floatB = {
    animate: {
        y: [-10, 4, -10],
        rotate: [2, -2, 2],
        transition: { duration: 7.6, delay: 0.9, repeat: Infinity, ease: "easeInOut" },
    },
};

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
    const handleClickOutside = useCallback((e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    }, []);
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    // Debounced search input
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(t);
    }, [search]);

    // Tab underline/active pill animation target
    useEffect(() => {
        const el = containerRef.current?.querySelector(`[data-tab="${activeFilter}"]`);
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
                : searchFiltered.filter((item) => item.data.subreddit === selectedSubreddit);

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
    }, [savedItems, activeFilter, debouncedSearch, selectedSubreddit, notify]);

    const truncateWords = (text, wordLimit = 10) => {
        if (!text) return "";
        const words = text.split(/\s+/);
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };

    const filteredBase = savedItems.filter((item) => {
        const matchesSubreddit =
            selectedSubreddit === "all" || item.data.subreddit === selectedSubreddit;
        const matchesSearch = (item.data.title || item.data.body || "")
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase());
        return matchesSubreddit && matchesSearch;
    });

    const countAll = filteredBase.length;
    const countPosts = filteredBase.filter((i) => i.kind === "t3").length;
    const countComments = filteredBase.filter((i) => i.kind === "t1").length;

    const countMap = { all: countAll, posts: countPosts, comments: countComments };

    const uniqueSubreddits = Array.from(new Set(savedItems.map((i) => i.data.subreddit))).sort();

    return (
        <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-white/10
                 bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-indigo-900/20
                 p-4 md:p-8 shadow-2xl backdrop-blur-xl"
        >
            {/* sheen sweep — remove this <motion.div> to disable */}
            {/* <motion.div
                aria-hidden
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12
                   bg-gradient-to-r from-transparent via-white/10 to-transparent"
            /> */}
            {/* floaty glows */}
            <motion.div
                variants={floatA}
                animate="animate"
                className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"
            />
            <motion.div
                variants={floatB}
                animate="animate"
                className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-pink-500/20 blur-3xl"
            />

            {/* Header */}
            <div>
                {/* Desktop toolbar */}
                <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    {/* Filter Tabs + Subreddit + Clear */}
                    {/* Filter Tabs + Subreddit + Clear */}
                    <div ref={containerRef} className="relative flex items-center gap-2">
                        {/* Active pill — reverted to previous purple→blue */}
                        {activeRect && (
                            <motion.div
                                className="absolute z-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                                initial={false}
                                animate={activeRect}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}

                        {filterTabs.map(({ id, label, icon: Icon }) => (
                            <motion.button
                                key={id}
                                data-tab={id}
                                onClick={() => setActiveFilter(id)}
                                whileTap={{ scale: 0.96 }}
                                whileHover={{ scale: activeFilter !== id ? 1.04 : 1 }}
                                animate={{ scale: activeFilter === id ? 1.06 : 1 }}
                                className={`relative z-10 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all
                  ${activeFilter === id ? "text-white" : "text-gray-300 hover:text-white hover:bg-gray-700/50"}`}
                            >
                                <Icon className="mr-1 h-4 w-4" />
                                {label}
                                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                                    {countMap[id]}
                                </span>
                            </motion.button>
                        ))}

                        {/* Subreddit Filter — reverted to white/10 */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown((p) => !p)}
                                className="relative z-10 flex items-center px-4 py-1.5 rounded-full text-sm font-medium
                           text-white bg-white/10 hover:bg白/20 transition"
                            >
                                r/{selectedSubreddit === "all" ? "All" : selectedSubreddit}
                                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                                    {selectedSubreddit === "all"
                                        ? uniqueSubreddits.length
                                        : savedItems.filter((i) => i.data.subreddit === selectedSubreddit).length}
                                </span>
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className="absolute top-12 left-0 z-20 max-h-[260px] w-56 overflow-y-auto overflow-x-hidden
                               rounded-xl border border-white/10 bg-[#0b0b14]/90 text-sm text-gray-200 shadow-2xl
                               backdrop-blur-xl custom-scrollbar"
                                    >
                                        <motion.button
                                            whileHover={{ x: -4 }}
                                            transition={{ duration: 0.18 }}
                                            onClick={() => {
                                                setSelectedSubreddit("all");
                                                setActiveFilter("all");
                                                setShowDropdown(false);
                                            }}
                                            className="block w-full px-4 py-2 text-left transition hover:bg-white/10"
                                        >
                                            All Subreddits
                                        </motion.button>

                                        {uniqueSubreddits.map((sub, index) => (
                                            <motion.button
                                                key={sub}
                                                initial={{ x: 24, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.04 * index }}
                                                onClick={() => {
                                                    setSelectedSubreddit(sub);
                                                    setActiveFilter("all");
                                                    setShowDropdown(false);
                                                }}
                                                className="block w-full px-4 py-2 text-left transition hover:bg-white/10"
                                            >
                                                r/{sub} (
                                                {grouped[sub]?.length ??
                                                    savedItems.filter((i) => i.data.subreddit === sub).length}
                                                )
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Clear Filters — reverted to gray pill */}
                        {(selectedSubreddit !== "all" || search || activeFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setSelectedSubreddit("all");
                                    setActiveFilter("all");
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full
                           bg-gray-800/60 border border-white/10 text-white shadow-md
                           hover:bg-gray-700/60 transition"
                                title="Clear"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="pointer-events-none absolute left-2 top-3 h-4 w-4 text-white/60" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search saved..."
                            className="w-full rounded-full border border-white/10 bg-white/10 px-8 py-2 text-white
                         placeholder:text-white/50 outline-none transition focus:border-white/20 focus:bg-white/15"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-2 top-2.5 text-white/60 transition hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile toolbar */}
                <div className="mb-6 flex flex-col gap-3 md:hidden">
                    <div className="flex flex-wrap items-center gap-2">
                        {filterTabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveFilter(id)}
                                className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all
                  ${activeFilter === id
                                        ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow"
                                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                                    }`}
                            >
                                <Icon className="mr-1 h-4 w-4" />
                                {label}
                                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                                    {countMap[id]}
                                </span>
                            </button>
                        ))}

                        {/* Subreddit Filter */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown((p) => !p)}
                                className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
                            >
                                r/{selectedSubreddit === "all" ? "All" : selectedSubreddit}
                                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                                    {selectedSubredditsLength(uniqueSubreddits, savedItems, selectedSubreddit)}
                                </span>
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        className="custom-scrollbar absolute top-12 left-0 z-20 max-h-[260px] w-56 overflow-y-auto overflow-x-hidden
                               rounded-xl border border-white/10 bg-[#0b0b14]/90 text-sm text-gray-200 shadow-2xl backdrop-blur-xl"
                                    >
                                        <button
                                            onClick={() => {
                                                setSelectedSubreddit("all");
                                                setActiveFilter("all");
                                                setShowDropdown(false);
                                            }}
                                            className="block w-full px-4 py-2 text-left transition hover:bg-white/10"
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
                                                className="block w-full px-4 py-2 text-left transition hover:bg-white/10"
                                            >
                                                r/{sub} (
                                                {grouped[sub]?.length ??
                                                    savedItems.filter((i) => i.data.subreddit === sub).length}
                                                )
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Clear */}
                            {(selectedSubreddit !== "all" || search || activeFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setSelectedSubreddit("all");
                                        setActiveFilter("all");
                                    }}
                                    className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10
                             bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg transition hover:scale-105"
                                    title="Clear"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search - Mobile */}
                    <div className="relative w-full">
                        <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-white/60" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search saved..."
                            className="w-full rounded-full border border-white/10 bg-white/10 px-8 py-2 text-white
                         placeholder:text-white/50 outline-none transition focus:border-white/20 focus:bg-white/15"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-2 top-2.5 text-white/60 transition hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Grouped Cards */}
                {Object.entries(grouped).map(([subreddit, items]) => (
                    <div key={subreddit} className="mb-10">
                        {/* Group header */}
                        <h2 className="mb-4 flex w-full items-center gap-2 text-white/90">
                            <span className="rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-2 py-1 text-xs font-semibold text-white">
                                r/
                            </span>
                            <span className="text-base font-semibold text-white">{subreddit}</span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white">
                                {items.length}
                            </span>
                            <div className="ml-2 h-px flex-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-500" />
                        </h2>

                        {/* Cards */}
                        <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                const thumbnail = getBestThumbnail(item) || FALLBACK_IMAGE;
                                const postDate = created_utc ? new Date(created_utc * 1000) : null;
                                const formattedDate =
                                    postDate &&
                                    postDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

                                return (
                                    <motion.a
                                        key={item.data.id}
                                        href={`https://reddit.com${permalink}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        layout
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.25 }}
                                        className="relative flex flex-col gap-4 rounded-2xl border border-white/10
                               bg-gradient-to-br from-gray-900/50 via-purple-900/20 to-indigo-900/20
                               p-4 shadow-xl backdrop-blur-xl hover:shadow-2xl"
                                    >
                                        {/* sheen — remove to disable */}
                                        {/* <motion.div
                                            aria-hidden
                                            initial={{ x: "-120%" }}
                                            animate={{ x: "120%" }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12
                                 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                        /> */}

                                        <div className="flex flex-col gap-4 md:flex-row">
                                            <img
                                                src={thumbnail}
                                                alt="Thumbnail"
                                                loading="lazy"
                                                className="h-32 w-full flex-shrink-0 rounded-xl object-cover shadow-md md:w-32"
                                                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                                            />

                                            <div className="flex flex-1 flex-col overflow-hidden">
                                                <h3 className="mb-1 truncate text-lg font-normal text-white">
                                                    {displayTitle}
                                                </h3>
                                                <p className="line-clamp-3 text-sm text-white/70">{truncateWords(body, 20)}</p>

                                                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/60">
                                                    <span className="flex items-center gap-1">
                                                        <User2 className="h-4 w-4 text-purple-300" /> {author}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp className="h-4 w-4 text-purple-300" /> {ups}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="h-4 w-4 text-purple-300" /> {num_comments}
                                                    </span>
                                                    {formattedDate && (
                                                        <span className="flex items-center gap-1">
                                                            <CalendarDays className="h-4 w-4 text-purple-300" /> {formattedDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.a>
                                );
                            })}
                        </motion.div>
                    </div>
                ))}

                {/* Empty state */}
                {Object.keys(grouped).length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35 }}
                        className="relative mx-auto mt-12 max-w-md overflow-hidden rounded-2xl border border-white/10
                       bg-white/5 px-6 py-10 text-center text-lg text-white/80 shadow-xl backdrop-blur-md"
                    >
                        {/* sheen */}
                        <motion.div
                            aria-hidden
                            initial={{ x: "-120%" }}
                            animate={{ x: "120%" }}
                            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                            className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12
                         bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        />
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl
                            bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 ring-4 ring-white/10 shadow-lg">
                            <Inbox className="h-5 w-5 text-white" />
                        </div>
                        <p className="font-semibold">No saved items found.</p>
                        <p className="mt-1 text-sm text-white/60">Try adjusting your search or filters.</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

/** helpers **/
function selectedSubredditsLength(uniqueSubreddits, savedItems, selectedSubreddit) {
    return selectedSubreddit === "all"
        ? uniqueSubreddits.length
        : savedItems.filter((i) => i.data.subreddit === selectedSubreddit).length;
}
