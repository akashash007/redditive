import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, forwardRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Users, Shield, Globe, AlertTriangle, X } from "lucide-react";
import ShimmerWrapper from "../ui/ShimmerWrapper";

/* -------------------- Animations -------------------- */
const containerVariants = { show: { transition: { staggerChildren: 0.04 } } };
const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.18 } },
};

/* -------------------- Utils -------------------- */
const fallbackAvatar = "/redditive_favicon.png";
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function useIsMobile() {
    const get = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
    const [isMobile, setIsMobile] = useState(get);
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 639px)");
        const onChange = (e) => setIsMobile(e.matches);
        try { mql.addEventListener("change", onChange); } catch { mql.addListener(onChange); }
        return () => { try { mql.removeEventListener("change", onChange); } catch { mql.removeListener(onChange); } };
    }, []);
    return isMobile;
}

function getSubredditImage(sub) {
    const cleanedIcon = sub.icon_img?.trim();
    const cleanedCommunityIcon = sub.community_icon?.split("?")[0]?.trim();
    const cleanedHeader = sub.header_img?.trim();
    return cleanedIcon || cleanedCommunityIcon || cleanedHeader || fallbackAvatar;
}

/* -------------------- Popover (Portal + Smart Positioning) -------------------- */

const DesktopPopover = ({ sub, anchorEl, onClose, id }) => {
    const popRef = useRef(null);
    const [pos, setPos] = useState({ left: 0, top: 0, placement: "top", arrowLeft: 16 });
    const [ready, setReady] = useState(false);

    // Position calculator (centers to pill, clamps within viewport)
    const computePosition = () => {
        const el = popRef.current;
        if (!el || !anchorEl) return;

        const margin = 10; // gap between pill and popover
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const a = anchorEl.getBoundingClientRect();

        // Make visible to measure
        el.style.visibility = "hidden";
        el.style.left = "0px";
        el.style.top = "-9999px";
        el.style.maxWidth = "min(360px, 92vw)";
        const r = el.getBoundingClientRect();
        const pw = r.width;
        const ph = r.height;

        // Try above first; if not enough space, go below
        const preferTop = a.top >= ph + margin + 8;
        const placement = preferTop ? "top" : "bottom";

        const centerX = a.left + a.width / 2;
        let left = centerX - pw / 2;
        left = clamp(left, 8, vw - pw - 8);

        const top = placement === "top" ? a.top - ph - margin : a.bottom + margin;

        // Arrow position relative to popover
        let arrowLeft = centerX - left;
        arrowLeft = clamp(arrowLeft, 12, pw - 12);

        el.style.visibility = "";
        setPos({ left, top, placement, arrowLeft });
        setReady(true);
    };

    // Close on outside click (including clicking the pill again)
    useEffect(() => {
        const onDown = (e) => {
            const pop = popRef.current;
            if (!pop) return;
            if (pop.contains(e.target)) return;
            if (anchorEl && anchorEl.contains(e.target)) return; // pill itself also counts as "inside" (toggle handles close)
            onClose?.();
        };
        document.addEventListener("mousedown", onDown, true);
        return () => document.removeEventListener("mousedown", onDown, true);
    }, [anchorEl, onClose]);

    // Close on Esc
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Recompute on mount, resize, scroll
    useLayoutEffect(() => {
        computePosition();
        const onReflow = () => computePosition();
        window.addEventListener("resize", onReflow);
        window.addEventListener("scroll", onReflow, true);
        const ro = new ResizeObserver(onReflow);
        if (popRef.current) ro.observe(popRef.current);
        return () => {
            window.removeEventListener("resize", onReflow);
            window.removeEventListener("scroll", onReflow, true);
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anchorEl, sub?.id]);

    const node = (
        <AnimatePresence>
            <motion.div
                key={id}
                ref={popRef}
                role="dialog"
                aria-modal="false"
                id={id}
                initial={{ opacity: 0, y: pos.placement === "top" ? -8 : 8, scale: 0.98 }}
                animate={{ opacity: ready ? 1 : 0, y: pos.placement === "top" ? -4 : 4, scale: 1 }}
                exit={{ opacity: 0, y: pos.placement === "top" ? -8 : 8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                style={{
                    position: "fixed",
                    left: pos.left,
                    top: pos.top,
                    zIndex: 1000,
                    pointerEvents: "auto",
                }}
                className="bg-gray-900/85 border border-white/10 rounded-xl shadow-2xl
                   px-4 py-3 text-sm text-gray-300 space-y-2 backdrop-blur-md
                   min-w-[18rem] max-w-[92vw]"
            >
                {/* arrow */}
                {/* <div
                    style={{
                        position: "absolute",
                        left: pos.arrowLeft - 8,
                        [pos.placement === "top" ? "bottom" : "top"]: -8,
                    }}
                    className={[
                        "w-4 h-4 rotate-45 bg-gray-900/85",
                        pos.placement === "top" ? "border-b border-r border-white/10" : "border-t border-l border-white/10",
                    ].join(" ")}
                /> */}

                <header className="flex items-center gap-2">
                    <img
                        src={getSubredditImage(sub)}
                        alt={sub.display_name}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-white/15"
                        onError={(e) => {
                            if (e.currentTarget.src !== fallbackAvatar) e.currentTarget.src = fallbackAvatar;
                        }}
                    />
                    <div className="leading-tight">
                        <p className="font-semibold text-white">r/{sub.display_name}</p>
                        <p className="text-gray-400 text-[11px]">{sub.title}</p>
                    </div>
                </header>

                <p className="text-gray-300/90 text-xs leading-relaxed">
                    {sub.public_description || "No description available"}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                    {sub.subscribers && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                            <Users size={12} />
                            {sub.subscribers.toLocaleString()} subscribers
                        </span>
                    )}
                    {sub.over18 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300">
                            <AlertTriangle size={12} /> NSFW
                        </span>
                    )}
                    {sub.user_is_moderator && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
                            <Shield size={12} /> Moderator
                        </span>
                    )}
                    {sub.lang && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                            <Globe size={12} /> {sub.lang.toUpperCase()}
                        </span>
                    )}
                </div>

                <a
                    href={`https://reddit.com${sub.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-purple-200 hover:underline text-xs mt-1 inline-block"
                >
                    Visit subreddit →
                </a>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(node, document.body);
};

const MobileModal = ({ sub, onClose }) => (
    <>
        <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        />
        <motion.div
            key="mobile-popover"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        w-[min(92vw,26rem)] bg-gray-900/85 border border-white/10 rounded-2xl shadow-2xl
        px-5 py-4 pt-10 text-sm text-gray-300 space-y-3 backdrop-blur-md"
        >
            <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 inline-flex items-center justify-center
          h-9 w-9 rounded-lg bg-white/10 hover:bg-white/15 active:scale-95
          border border-white/10"
            >
                <X className="h-4 w-4 text-gray-200" />
            </button>

            <header className="flex items-center gap-3">
                <img
                    src={getSubredditImage(sub)}
                    alt={sub.display_name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/15"
                    onError={(e) => {
                        if (e.currentTarget.src !== fallbackAvatar) e.currentTarget.src = fallbackAvatar;
                    }}
                />
                <div>
                    <p className="font-semibold text-white">r/{sub.display_name}</p>
                    <p className="text-gray-400 text-xs">{sub.title}</p>
                </div>
            </header>

            <p className="text-gray-300/90 text-xs leading-relaxed">
                {sub.public_description || "No description available"}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs">
                {sub.subscribers && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                        <Users size={12} />
                        {sub.subscribers.toLocaleString()} subscribers
                    </span>
                )}
                {sub.over18 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300">
                        <AlertTriangle size={12} /> NSFW
                    </span>
                )}
                {sub.user_is_moderator && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
                        <Shield size={12} /> Moderator
                    </span>
                )}
                {sub.lang && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                        <Globe size={12} /> {sub.lang.toUpperCase()}
                    </span>
                )}
            </div>

            <a
                href={`https://reddit.com${sub.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-200 hover:underline text-xs mt-1 inline-block"
            >
                Visit subreddit →
            </a>
        </motion.div>
    </>
);

/* -------------------- Main -------------------- */

export default function SubscribedCommunities({
    subscribedSubs = [],
    loading = false,
}) {
    const [visibleCount, setVisibleCount] = useState(20);
    const [renderCount, setRenderCount] = useState(20);
    const [expandedSub, setExpandedSub] = useState(null);

    // refs for each pill (anchor elements)
    const anchorRefs = useRef(new Map());
    const setAnchorRef = (id) => (el) => {
        if (!anchorRefs.current) anchorRefs.current = new Map();
        if (el) anchorRefs.current.set(id, el);
        else anchorRefs.current.delete(id);
    };

    // progressive render
    useEffect(() => {
        if (renderCount < visibleCount) {
            const id = setInterval(() => setRenderCount((p) => Math.min(p + 5, visibleCount)), 80);
            return () => clearInterval(id);
        }
        if (renderCount > visibleCount) {
            const id = setInterval(() => setRenderCount((p) => Math.max(p - 5, visibleCount)), 80);
            return () => clearInterval(id);
        }
    }, [visibleCount, renderCount]);

    const isMobile = useIsMobile();

    // close on global Escape (belt-and-suspenders)
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setExpandedSub(null);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // close on route change / visibility change (optional, safe)
    useEffect(() => {
        const onHidden = () => setExpandedSub(null);
        document.addEventListener("visibilitychange", onHidden);
        return () => document.removeEventListener("visibilitychange", onHidden);
    }, []);

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
                <div className="p-6 text-sm text-gray-400">You aren’t subscribed to any communities yet.</div>
            ) : (
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-indigo-900/20 backdrop-blur-xl p-3 md:p-6 shadow-xl">
                    <div className="">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                                <h3 className="text-base sm:text-lg font-semibold text-purple-300">Subscribed Communities</h3>
                                <div
                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full
                  bg-gradient-to-br from-purple-500 to-blue-500 text-white
                  text-xs sm:text-sm font-bold shadow-md"
                                    title="Total subscriptions"
                                >
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
                                    className="w-32 sm:w-40 h-2 rounded-full appearance-none cursor-pointer
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
                                    aria-label="Visible communities"
                                />
                                <motion.span
                                    key={visibleCount}
                                    initial={{ scale: 0.6, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                                    className="text-sm text-gray-300 font-medium"
                                >
                                    {visibleCount}
                                </motion.span>
                            </div>
                        </div>

                        {/* List */}
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-wrap gap-2.5">
                            <AnimatePresence initial={false}>
                                {subscribedSubs.slice(0, renderCount).map((sub) => {
                                    const isExpanded = expandedSub === sub.id;
                                    const imgSrc = getSubredditImage(sub);

                                    return (
                                        <motion.div key={sub.id} variants={itemVariants} initial="hidden" animate="show" exit="exit" className="relative">
                                            {/* Pill button */}
                                            <button
                                                ref={setAnchorRef(sub.id)}
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedSub((curr) => (curr === sub.id ? null : sub.id)); // same-pill click toggles closed ✅
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        setExpandedSub((curr) => (curr === sub.id ? null : sub.id));
                                                    }
                                                    if (e.key === "Escape") setExpandedSub(null);
                                                }}
                                                className={[
                                                    "group inline-flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full",
                                                    "bg-gradient-to-br from-gray-900/60 via-purple-900/15 to-indigo-900/10",
                                                    "border border-white/10 backdrop-blur-md shadow-sm",
                                                    "text-sm text-gray-200 transition-all duration-150",
                                                    "hover:border-purple-400/40 hover:shadow-purple-500/10",
                                                    "focus:outline-none focus:ring-2 focus:ring-purple-400/40",
                                                    isExpanded ? "ring-2 ring-purple-400/40" : "",
                                                ].join(" ")}
                                                aria-expanded={isExpanded}
                                                aria-haspopup="dialog"
                                                aria-controls={`sub-pop-${sub.id}`}
                                            >
                                                <span className="relative">
                                                    <img
                                                        src={imgSrc}
                                                        alt={sub.display_name}
                                                        className="w-5 h-5 rounded-full object-cover ring-1 ring-white/15"
                                                        onError={(e) => {
                                                            if (e.currentTarget.src !== fallbackAvatar) e.currentTarget.src = fallbackAvatar;
                                                        }}
                                                    />
                                                    {sub.over18 && <span className="absolute -right-0.5 -bottom-0.5 w-2 h-2 rounded-full bg-rose-400 ring-1 ring-white/80" />}
                                                </span>

                                                <span className="whitespace-nowrap">r/{sub.display_name}</span>

                                                {sub.user_is_moderator && (
                                                    <span className="ml-1 inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
                                                        <Shield size={10} /> Mod
                                                    </span>
                                                )}
                                            </button>

                                            {/* Popover */}
                                            <AnimatePresence>
                                                {isExpanded &&
                                                    (isMobile ? (
                                                        <MobileModal key={`m-${sub.id}`} sub={sub} onClose={() => setExpandedSub(null)} />
                                                    ) : (
                                                        <DesktopPopover
                                                            key={`d-${sub.id}`}
                                                            sub={sub}
                                                            id={`sub-pop-${sub.id}`}
                                                            anchorEl={anchorRefs.current.get(sub.id)}
                                                            onClose={() => setExpandedSub(null)} // outside click & Esc close ✅
                                                        />
                                                    ))}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {/* Footer */}
                        {renderCount < subscribedSubs.length && (
                            <p className="mt-2 text-xs text-gray-400">
                                Showing {renderCount} of {subscribedSubs.length} communities
                            </p>
                        )}
                    </div>
                </div>
            )}
        </ShimmerWrapper>
    );
}
