import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import RedditPostCard from "@/components/charts/RedditPostCard";
import { ChevronDown, PartyPopper, Search } from "lucide-react";

export default function SavedPage() {
    const { data: session, status } = useSession();
    const [posts, setPosts] = useState([]);
    const [after, setAfter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [yearFilter, setYearFilter] = useState("all");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [yearOptions, setYearOptions] = useState([]);


    // Fetch saved posts
    const fetchPosts = async (loadMore = false) => {
        if (!session?.accessToken || !session?.user?.name || loading || !hasMore) return;

        setLoading(true);
        try {
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

            const newAfter = json?.data?.after;
            if (!newAfter || children.length === 0) setHasMore(false);
            else setAfter(newAfter);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
        setLoading(false);
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

    // Filter logic
    const filteredPosts = posts.filter((post) => {
        const date = new Date(post.created_utc * 1000);
        const year = date.getFullYear().toString();
        const matchesYear = yearFilter === "all" || year === yearFilter;

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            post.title?.toLowerCase().includes(searchLower) ||
            post.selftext?.toLowerCase().includes(searchLower) ||
            post.subreddit_name_prefixed?.toLowerCase().includes(searchLower) ||
            post.author?.toLowerCase().includes(searchLower);

        return matchesYear && matchesSearch;
    });

    useEffect(() => {
        const createdDateStr = localStorage.getItem("createdDate");
        if (!createdDateStr) return;

        const parts = createdDateStr.split("/");
        const joinYear = parseInt(parts[2], 10); // Get "2023" from "14/03/2023"
        const currentYear = new Date().getFullYear();

        const dynamicOptions = [{ label: "All Years", value: "all" }];

        for (let y = currentYear; y >= joinYear; y--) {
            dynamicOptions.push({ label: String(y), value: String(y) });
        }

        setYearOptions(dynamicOptions);
    }, []);

    return (
        <DashboardLayout>
            <div className="px-1 py-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    {/* Search Input */}
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

                    {/* Custom Year Dropdown */}
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="flex items-center justify-between gap-2 text-md text-gray-300 bg-[#1f1f25]/95 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 focus:outline-none hover:bg-gray-800/40 transition-all shadow-sm"
                        >
                            {yearOptions.find((o) => o.value === yearFilter)?.label}
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
                                    className="absolute right-0 mt-2 w-32 rounded-xl bg-[#1f1f25]/95 backdrop-blur-lg border border-white/10 shadow-xl z-20 overflow-hidden"
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
                </div>

                {/* Post Cards in Masonry Layout */}
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            className="break-inside-avoid"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <RedditPostCard post={post} />
                        </motion.div>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-6">
                        <span className="text-purple-300 animate-pulse">Loading more posts...</span>
                    </div>
                )}

                {/* End of List */}
                {!hasMore && filteredPosts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-purple-400 py-6 text-sm flex flex-col items-center justify-center gap-2 mt-10"
                    >
                        <PartyPopper size={28} className="text-purple-500" />
                        <span className="text-sm">You've reached the end of the saved posts.</span>
                    </motion.div>
                )}

                {/* No results from search/filter */}
                {filteredPosts.length === 0 && !loading && (
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
            </div>
        </DashboardLayout>
    );
}
