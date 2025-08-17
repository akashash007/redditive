import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, forwardRef } from "react";
import { Users, Shield, Globe, AlertTriangle, X } from "lucide-react";
import ShimmerWrapper from "../ui/ShimmerWrapper";

const containerVariants = {
    show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    exit: { opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.2 } },
};

const fallbackAvatar = "/redditive_favicon.png";

function useIsMobile() {
    const get = () =>
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 639px)").matches;

    const [isMobile, setIsMobile] = useState(get);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 639px)");
        const handler = (e) => setIsMobile(e.matches);
        try { mql.addEventListener("change", handler); } catch { mql.addListener(handler); }
        return () => {
            try { mql.removeEventListener("change", handler); } catch { mql.removeListener(handler); }
        };
    }, []);

    return isMobile;
}

function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [ref, handler]);
}

function getSubredditImage(sub) {
    const cleanedIcon = sub.icon_img?.trim();
    const cleanedCommunityIcon = sub.community_icon?.split("?")[0]?.trim();
    const cleanedHeader = sub.header_img?.trim();
    return cleanedIcon || cleanedCommunityIcon || cleanedHeader || fallbackAvatar;
}

const PopoverContent = forwardRef(({ sub, onClose }, ref) => {
    const isMobile = useIsMobile();

    useEffect(() => {
        if (!isMobile) return;
        const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isMobile, onClose]);

    if (isMobile) {
        return (
            <>
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    key="mobile-popover"
                    ref={ref}
                    role="dialog"
                    aria-modal="true"
                    initial={{ opacity: 0, y: -12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                     w-[min(92vw,24rem)] bg-gray-800/80 border border-white/10 rounded-xl shadow-lg
                     px-4 py-3 pt-8 text-sm text-gray-300 space-y-2 backdrop-blur-sm"
                >
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute top-2.5 right-2.5 inline-flex items-center justify-center
                       h-8 w-8 rounded-lg bg-white/10 hover:bg-white/15 active:scale-95
                       border border-white/10"
                    >
                        <X className="h-4 w-4 text-gray-200" />
                    </button>

                    <p className="font-semibold">{sub.title}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        {sub.public_description || "No description available"}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        {sub.subscribers && (
                            <span className="flex items-center gap-1 text-gray-500">
                                <Users size={12} />
                                {sub.subscribers.toLocaleString()} subscribers
                            </span>
                        )}
                        {sub.over18 && (
                            <span className="flex items-center gap-1 text-red-400 font-bold">
                                <AlertTriangle size={12} /> NSFW
                            </span>
                        )}
                        {sub.user_is_moderator && (
                            <span className="flex items-center gap-1 text-green-400 font-bold">
                                <Shield size={12} /> Moderator
                            </span>
                        )}
                        {sub.lang && (
                            <span className="flex items-center gap-1 text-gray-400">
                                <Globe size={12} /> {sub.lang.toUpperCase()}
                            </span>
                        )}
                    </div>

                    <a
                        href={`https://reddit.com${sub.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline text-xs mt-2 inline-block"
                    >
                        Visit subreddit →
                    </a>
                </motion.div>
            </>
        );
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -5 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-full left-0 mb-2 z-50
                 bg-gray-800/80 border border-white/10 rounded-xl shadow-lg
                 px-4 py-3 text-sm text-gray-300 space-y-2 backdrop-blur-sm
                 min-w-[18rem] max-w-[90vw]"
        >
            <p className="font-semibold">{sub.title}</p>
            <p className="text-gray-400 text-xs leading-relaxed">
                {sub.public_description || "No description available"}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                {sub.subscribers && (
                    <span className="flex items-center gap-1 text-gray-500">
                        <Users size={12} />
                        {sub.subscribers.toLocaleString()} subscribers
                    </span>
                )}
                {sub.over18 && (
                    <span className="flex items-center gap-1 text-red-400 font-bold">
                        <AlertTriangle size={12} /> NSFW
                    </span>
                )}
                {sub.user_is_moderator && (
                    <span className="flex items-center gap-1 text-green-400 font-bold">
                        <Shield size={12} /> Moderator
                    </span>
                )}
                {sub.lang && (
                    <span className="flex items-center gap-1 text-gray-400">
                        <Globe size={12} /> {sub.lang.toUpperCase()}
                    </span>
                )}
            </div>
            <a
                href={`https://reddit.com${sub.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline text-xs mt-2 inline-block"
            >
                Visit subreddit →
            </a>
        </motion.div>
    );
});
PopoverContent.displayName = "PopoverContent";

export default function SubscribedCommunities({
    subscribedSubs = [],
    loading = false,
}) {
    const [visibleCount, setVisibleCount] = useState(20);
    const [renderCount, setRenderCount] = useState(20);
    const [expandedSub, setExpandedSub] = useState(null);
    const popoverRef = useRef(null);

    useClickOutside(popoverRef, () => setExpandedSub(null));

    // Smoothly adjust how many items are rendered
    useEffect(() => {
        if (renderCount < visibleCount) {
            const id = setInterval(() => {
                setRenderCount((p) => Math.min(p + 5, visibleCount));
            }, 100);
            return () => clearInterval(id);
        } else if (renderCount > visibleCount) {
            const id = setInterval(() => {
                setRenderCount((p) => Math.max(p - 5, visibleCount));
            }, 100);
            return () => clearInterval(id);
        }
    }, [visibleCount, renderCount]);

    return (
        <ShimmerWrapper
            loading={loading}
            fallbackHeight="260px"
            baseColor="#3b0764"
            highlightColor="#c084fc"
            duration={1400}
            loadTime={0}
            direction="rtl"
        >
            {!loading && subscribedSubs.length === 0 ? (
                <div className="p-6 text-sm text-gray-400">
                    You aren’t subscribed to any communities yet.
                </div>
            ) : (
                <div className="mt-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                            <h3 className="text-base sm:text-lg font-semibold text-purple-300">
                                Subscribed Communities
                            </h3>
                            <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full
                              bg-gradient-to-br from-purple-500 to-blue-500 text-white
                              text-xs sm:text-sm font-bold shadow-md">
                                {subscribedSubs.length}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <input
                                type="range"
                                value={visibleCount}
                                min={5}
                                max={Math.min(100, subscribedSubs.length || 100)}
                                step={1}
                                onChange={(e) => setVisibleCount(Number(e.target.value))}
                                className="w-32 sm:w-40 h-2 rounded-lg appearance-none cursor-pointer
                           bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                           transition-all duration-200
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:h-4
                           [&::-webkit-slider-thumb]:w-4
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-white
                           [&::-webkit-slider-thumb]:shadow-md
                           [&::-webkit-slider-thumb]:border
                           [&::-webkit-slider-thumb]:border-gray-300"
                            />
                            <motion.span
                                key={visibleCount}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="text-sm text-gray-300 font-medium"
                            >
                                {visibleCount}
                            </motion.span>
                        </div>
                    </div>

                    {/* List */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-wrap gap-3"
                    >
                        <AnimatePresence>
                            {subscribedSubs.slice(0, renderCount).map((sub) => (
                                <motion.div
                                    key={sub.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                    className="relative flex flex-col bg-gray-700/40 border border-white/10
                             rounded-2xl shadow-sm overflow-visible px-2 py-1"
                                >
                                    <div
                                        className="flex items-center gap-2 cursor-pointer transition"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedSub((curr) => (curr === sub.id ? null : sub.id));
                                        }}
                                    >
                                        <img
                                            src={getSubredditImage(sub)}
                                            alt={sub.display_name}
                                            className="w-5 h-5 rounded-full object-cover"
                                            onError={(e) => {
                                                const fallback =
                                                    (typeof window !== "undefined" ? window.location.origin : "") +
                                                    fallbackAvatar;
                                                if (e.currentTarget.src !== fallback) {
                                                    e.currentTarget.src = fallbackAvatar;
                                                }
                                            }}
                                        />
                                        <span className="text-gray-200 text-sm">r/{sub.display_name}</span>
                                    </div>

                                    <AnimatePresence>
                                        {expandedSub === sub.id && (
                                            <PopoverContent
                                                sub={sub}
                                                ref={popoverRef}
                                                onClose={() => setExpandedSub(null)}
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Footer */}
                    {renderCount < subscribedSubs.length && (
                        <p className="mt-2 text-xs text-gray-400">
                            Showing {renderCount} of {subscribedSubs.length} communities
                        </p>
                    )}
                </div>
            )}
        </ShimmerWrapper>
    );
}
