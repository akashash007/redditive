import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, forwardRef } from "react";
import { Users, Shield, Globe, AlertTriangle } from "lucide-react";

// Slider Component
const Slider = ({ value, min, max, step, onValueChange, className }) => {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => onValueChange([Number(e.target.value)])}
            className={`appearance-none h-2 w-full rounded-lg bg-gray-600 accent-purple-500 cursor-pointer ${className}`}
        />
    );
};

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
    exit: {
        opacity: 0,
        y: 15,
        scale: 0.95,
        transition: { duration: 0.2 },
    },
};

const fallbackAvatar = "/redditive_favicon.png";

function getSubredditImage(sub) {
    const cleanedIcon = sub.icon_img?.trim();
    const cleanedCommunityIcon = sub.community_icon?.split("?")[0]?.trim();
    const cleanedHeader = sub.header_img?.trim();
    return cleanedIcon || cleanedCommunityIcon || cleanedHeader || fallbackAvatar;
}

// Main Component
export default function SubscribedCommunities({ subscribedSubs }) {
    const [visibleCount, setVisibleCount] = useState(20);
    const [renderCount, setRenderCount] = useState(20);
    const [expandedSub, setExpandedSub] = useState(null);
    const popoverRef = useRef(null);
    useClickOutside(popoverRef, () => setExpandedSub(null));

    useEffect(() => {
        if (renderCount < visibleCount) {
            const interval = setInterval(() => {
                setRenderCount((prev) => Math.min(prev + 5, visibleCount));
            }, 100);
            return () => clearInterval(interval);
        } else if (renderCount > visibleCount) {
            const interval = setInterval(() => {
                setRenderCount((prev) => Math.max(prev - 5, visibleCount));
            }, 100);
            return () => clearInterval(interval);
        }
    }, [visibleCount, renderCount]);

    function useClickOutside(ref, handler) {
        useEffect(() => {
            const listener = (event) => {
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener("mousedown", listener);
            return () => {
                document.removeEventListener("mousedown", listener);
            };
        }, [ref, handler]);
    }

    // function PopoverContent({ sub, onClose }) {
    //     const ref = useRef(null);
    //     useClickOutside(ref, onClose);

    //     return (
    //         <motion.div
    //             ref={ref}
    //             initial={{ opacity: 0, y: -10 }}
    //             animate={{ opacity: 1, y: -5 }}
    //             exit={{ opacity: 0, y: -10 }}
    //             transition={{ duration: 0.25 }}
    //             className="absolute bottom-full left-0 mb-2 z-25 w-fit max-w-[90vw] min-w-[18rem] bg-gray-800/80 border border-white/10 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-300 space-y-2 backdrop-blur-sm"
    //         >
    //             <p className="font-semibold">{sub.title}</p>

    //             <p className="text-gray-400 text-xs leading-relaxed">
    //                 {sub.public_description || "No description available"}
    //             </p>

    //             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
    //                 {sub.subscribers && (
    //                     <span className="flex items-center gap-1 text-gray-500">
    //                         <Users size={12} />
    //                         {sub.subscribers.toLocaleString()} subscribers
    //                     </span>
    //                 )}

    //                 {sub.over18 && (
    //                     <span className="flex items-center gap-1 text-red-400 font-bold">
    //                         <AlertTriangle size={12} />
    //                         NSFW
    //                     </span>
    //                 )}

    //                 {sub.user_is_moderator && (
    //                     <span className="flex items-center gap-1 text-green-400 font-bold">
    //                         <Shield size={12} />
    //                         Moderator
    //                     </span>
    //                 )}

    //                 {sub.lang && (
    //                     <span className="flex items-center gap-1 text-gray-400">
    //                         <Globe size={12} />
    //                         {sub.lang.toUpperCase()}
    //                     </span>
    //                 )}
    //             </div>

    //             <a
    //                 href={`https://reddit.com${sub.url}`}
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 className="text-purple-400 hover:underline text-xs mt-2 inline-block"
    //             >
    //                 Visit subreddit →
    //             </a>
    //         </motion.div>
    //     );
    // }

    const PopoverContent = forwardRef(({ sub }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: -5 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-full left-0 mb-2 z-25 w-fit max-w-[90vw] min-w-[18rem] bg-gray-800/80 border border-white/10 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-300 space-y-2 backdrop-blur-sm"
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
                            <AlertTriangle size={12} />
                            NSFW
                        </span>
                    )}

                    {sub.user_is_moderator && (
                        <span className="flex items-center gap-1 text-green-400 font-bold">
                            <Shield size={12} />
                            Moderator
                        </span>
                    )}

                    {sub.lang && (
                        <span className="flex items-center gap-1 text-gray-400">
                            <Globe size={12} />
                            {sub.lang.toUpperCase()}
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

    return (
        <>
            {subscribedSubs.length > 0 && (
                <div className="mt-6">
                    {/* Header + Slider */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-purple-300">
                                Subscribed Communities
                            </h3>
                            <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm font-bold shadow-md">
                                {subscribedSubs.length}
                            </div>
                        </div>

                        {/* <div className="flex items-center gap-4">
                            <Slider
                                value={[visibleCount]}
                                min={5}
                                max={Math.min(100, subscribedSubs.length)}
                                step={1}
                                onValueChange={(val) => setVisibleCount(val[0])}
                                className="w-40"
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
                        </div> */}
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                value={visibleCount}
                                min={5}
                                max={Math.min(100, subscribedSubs.length)}
                                step={1}
                                onChange={(e) => setVisibleCount(Number(e.target.value))}
                                className="w-40 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300"
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

                    {/* Subreddit list */}
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
                                    className="relative flex flex-col bg-gray-700/40 border border-white/10 rounded-2xl shadow-sm overflow-visible px-2 py-1"
                                >
                                    {/* Main clickable row */}
                                    <div
                                        className="flex items-center gap-2 cursor-pointer transition"
                                        // onClick={() =>
                                        //     setExpandedSub(expandedSub === sub.id ? null : sub.id)
                                        // }
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent bubbling to outside
                                            if (expandedSub === sub.id) {
                                                setExpandedSub(null); // close it
                                            } else {
                                                setExpandedSub(sub.id); // open new
                                            }
                                        }}
                                    >
                                        <img
                                            src={getSubredditImage(sub)}
                                            alt={sub.display_name}
                                            className="w-5 h-5 rounded-full object-cover"
                                            onError={(e) => {
                                                if (
                                                    e.currentTarget.src !==
                                                    window.location.origin + fallbackAvatar
                                                ) {
                                                    e.currentTarget.src = fallbackAvatar;
                                                }
                                            }}
                                        />
                                        <span className="text-gray-200 text-sm">
                                            r/{sub.display_name}
                                        </span>
                                    </div>

                                    {/* Popover-style info */}
                                    <AnimatePresence>
                                        {expandedSub === sub.id && (
                                            <PopoverContent sub={sub} ref={popoverRef} />
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
        </>
    );
}
