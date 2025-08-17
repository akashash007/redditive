import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import RedditPostCard from "@/components/charts/RedditPostCard";
import { ChevronDown, PartyPopper, Search, X } from "lucide-react";
import ShimmerWrapper from "@/components/ui/ShimmerWrapper";

export default function SavedPage() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState([]);
    const [after, setAfter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [yearFilter, setYearFilter] = useState("all");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);
    const [sortBy, setSortBy] = useState("newest");
    const [subredditFilter, setSubredditFilter] = useState("all");
    const [subredditList, setSubredditList] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState({});

    const [sortOpen, setSortOpen] = useState(false);
    const [subredditOpen, setSubredditOpen] = useState(false);

    const [commentsLoading, setcommentsLoading] = useState(false)

    const yearRef = useRef(null);
    const subredditRef = useRef(null);
    const sortRef = useRef(null);

    const filtersActive =
        yearFilter !== "all" ||
        sortBy !== "newest" ||
        subredditFilter !== "all" ||
        searchTerm.trim() !== "";

    // Fetch saved posts
    const fetchPosts = async (loadMore = false) => {
        if (!session?.accessToken || !session?.user?.name || loading || !hasMore) return;

        setLoading(true);
        setcommentsLoading(true)
        try {
            // const commentsLoading = true
            const res = await fetch(
                `/api/reddit/submitted?username=${session.user.name}&accessToken=${session.accessToken}${loadMore && after ? `&after=${after}` : ""}`
            );
            const json = await res.json();
            const children = json?.data?.children || [];
            const newPosts = children.map((c) => c.data);

            setPosts((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const filtered = newPosts.filter((p) => !existingIds.has(p.id));
                return [...prev, ...filtered];
            });

            // Add subreddits to list
            const allSubs = new Set([...subredditList]);
            newPosts.forEach((p) => allSubs.add(p.subreddit_name_prefixed));
            setSubredditList(Array.from(allSubs));

            const newAfter = json?.data?.after;
            if (!newAfter || children.length === 0) setHasMore(false);
            else setAfter(newAfter);
        } catch (err) {
            setcommentsLoading(false)
            console.error("Failed to fetch posts", err);
        }
        setLoading(false);
        setcommentsLoading(false)

    };

    useEffect(() => {
        if (status === "authenticated") fetchPosts();
    }, [session, status]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100 &&
                !loading
            ) {
                fetchPosts(true);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [after, loading]);

    // Build dynamic year filter options
    useEffect(() => {
        const createdDateStr = localStorage.getItem("createdDate");
        if (!createdDateStr) return;

        const parts = createdDateStr.split("/");
        const joinYear = parseInt(parts[2], 10);
        const currentYear = new Date().getFullYear();
        const dynamicOptions = [{ label: "All Years", value: "all" }];

        for (let y = currentYear; y >= joinYear; y--) {
            dynamicOptions.push({ label: String(y), value: String(y) });
        }

        setYearOptions(dynamicOptions);
    }, []);

    // Filter + sort
    const filteredPosts = posts.filter((post) => {
        const date = new Date(post.created_utc * 1000);
        const year = date.getFullYear().toString();
        const matchesYear = yearFilter === "all" || year === yearFilter;
        const matchesSubreddit = subredditFilter === "all" || post.subreddit_name_prefixed === subredditFilter;

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            post.title?.toLowerCase().includes(searchLower) ||
            post.selftext?.toLowerCase().includes(searchLower) ||
            post.subreddit_name_prefixed?.toLowerCase().includes(searchLower) ||
            post.author?.toLowerCase().includes(searchLower);

        return matchesYear && matchesSearch && matchesSubreddit;
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortBy === "oldest") return a.created_utc - b.created_utc;
        if (sortBy === "upvotes") return b.ups - a.ups;
        if (sortBy === "comments") return b.num_comments - a.num_comments;
        return b.created_utc - a.created_utc;
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                yearRef.current && !yearRef.current.contains(e.target)
            ) setDropdownOpen(false);

            if (
                subredditRef.current && !subredditRef.current.contains(e.target)
            ) setSubredditOpen(false);

            if (
                sortRef.current && !sortRef.current.contains(e.target)
            ) setSortOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <DashboardLayout>
            <ShimmerWrapper
                loading={commentsLoading}
                fallbackHeight={600}     // matches ~ h-80 zone
                baseColor="#3b0764"
                highlightColor="#c084fc"
                duration={1400}
                direction="rtl"
                lockHeightWhileLoading
            >
                <div className="px-1">

                    {/* Filters */}
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        {/* LEFT SIDE – Dropdown filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Year Dropdown */}
                            <div ref={yearRef} className="relative inline-block text-left">
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="flex items-center justify-between gap-2 text-sm text-gray-100 bg-gradient-to-r from-purple-500 to-blue-500 border border-white/10 rounded-full px-4 py-2 focus:outline-none hover:bg-gray-800/40 transition-all shadow-sm"
                                >
                                    {yearOptions.find((o) => o.value === yearFilter)?.label || "All Years"}
                                    <motion.div
                                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={14} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute left-0 mt-2 w-40 rounded-xl bg-[#1f1f25]/95 backdrop-blur-lg border border-white/10 shadow-xl z-20 overflow-hidden"
                                        >
                                            {yearOptions.map((opt, idx) => (
                                                <motion.button
                                                    key={opt.value}
                                                    initial={{ x: 10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    onClick={() => {
                                                        setYearFilter(opt.value);
                                                        setDropdownOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition truncate"
                                                >
                                                    {opt.label}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Subreddit Filter */}
                            {subredditList.length > 0 && (
                                <div ref={subredditRef} className="relative inline-block text-left">
                                    <button
                                        onClick={() => setSubredditOpen((prev) => !prev)}
                                        className="flex items-center justify-between gap-2 text-sm text-gray-100 bg-gradient-to-r from-purple-500 to-blue-500 border border-white/10 rounded-full px-4 py-2 hover:bg-gray-800/40 transition-all shadow-sm"
                                    >
                                        {subredditFilter === "all" ? "All Subreddits" : subredditFilter}
                                        <motion.div
                                            animate={{ rotate: subredditOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown size={14} />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence>
                                        {subredditOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute left-0 mt-2 w-40 rounded-xl bg-[#1f1f25]/95 backdrop-blur-lg border border-white/10 shadow-xl z-20 overflow-hidden"
                                            >
                                                <motion.button
                                                    key="all"
                                                    onClick={() => {
                                                        setSubredditFilter("all");
                                                        setSubredditOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition"
                                                >
                                                    All Subreddits
                                                </motion.button>
                                                {subredditList.map((sub, idx) => (
                                                    <motion.button
                                                        key={sub}
                                                        initial={{ x: 10, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        onClick={() => {
                                                            setSubredditFilter(sub);
                                                            setSubredditOpen(false);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition truncate"
                                                    >
                                                        {sub}
                                                    </motion.button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Sort Dropdown */}
                            <div ref={sortRef} className="relative inline-block text-left">
                                <button
                                    onClick={() => setSortOpen((prev) => !prev)}
                                    className="flex items-center justify-between gap-2 text-sm text-gray-100 bg-gradient-to-r from-purple-500 to-blue-500 border border-white/10 rounded-full px-4 py-2  hover:bg-gray-800/40 transition-all shadow-sm"
                                >
                                    {(() => {
                                        switch (sortBy) {
                                            case "oldest": return "Oldest";
                                            case "upvotes": return "Most Upvoted";
                                            case "comments": return "Most Commented";
                                            default: return "Newest";
                                        }
                                    })()}
                                    <motion.div
                                        animate={{ rotate: sortOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={14} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {sortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute left-0 mt-2 w-40 rounded-xl bg-[#1f1f25]/95 backdrop-blur-lg border border-white/10 shadow-xl z-20 overflow-hidden"
                                        >
                                            {[
                                                { label: "Newest", value: "newest" },
                                                { label: "Oldest", value: "oldest" },
                                                { label: "Most Upvoted", value: "upvotes" },
                                                { label: "Most Commented", value: "comments" },
                                            ].map((opt, idx) => (
                                                <motion.button
                                                    key={opt.value}
                                                    initial={{ x: 10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    onClick={() => {
                                                        setSortBy(opt.value);
                                                        setSortOpen(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition"
                                                >
                                                    {opt.label}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {filtersActive && (
                                <button
                                    onClick={() => {
                                        setYearFilter("all");
                                        setSubredditFilter("all");
                                        setSortBy("newest");
                                        setSearchTerm("");
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 backdrop-blur-md transition"
                                    title="Clear Filters"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                        </div>

                        {/* RIGHT SIDE – Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute top-3 left-2 w-4 h-4 text-white/60" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-8 py-2 w-full rounded-full bg-white/10 text-white placeholder:text-white/50 outline-none"
                            />
                        </div>
                    </div>


                    {/* Posts Grid */}
                    <div className="columns-1 md:columns-2 gap-6 space-y-6">
                        {sortedPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                className="break-inside-avoid"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <RedditPostCard
                                    post={post}
                                    isExpanded={!!expandedPosts[post.id]}
                                    onToggleExpand={() =>
                                        setExpandedPosts((prev) => ({
                                            ...prev,
                                            [post.id]: !prev[post.id],
                                        }))
                                    }
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-6">
                            <span className="text-purple-300 animate-pulse">Loading more posts...</span>
                        </div>
                    )}

                    {/* No results */}
                    {sortedPosts.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center justify-center py-16 px-4 text-center text-sm text-gray-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md max-w-sm mx-auto mt-16"
                        >
                            <Search size={32} className="mb-3 text-purple-400" />
                            <p className="text-gray-400">No posts match your filter.</p>
                        </motion.div>
                    )}

                    {/* End of List */}
                    {!hasMore && sortedPosts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-purple-400 py-6 text-sm flex flex-col items-center justify-center gap-2 mt-10"
                        >
                            <PartyPopper size={28} className="text-purple-500" />
                            <span className="text-sm">You've reached the end of the saved posts.</span>
                        </motion.div>
                    )}
                </div>
            </ShimmerWrapper>
        </DashboardLayout>
    );
}
