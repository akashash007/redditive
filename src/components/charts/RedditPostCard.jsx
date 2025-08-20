import {
    ArrowBigUp,
    ArrowBigDown,
    MessageCircle,
    ExternalLink,
    Clock,
    Trash2,
    Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export default function RedditPostCard({ post }) {
    if (!post) return null;

    const {
        title,
        subreddit_name_prefixed,
        author,
        ups,
        num_comments,
        created_utc,
        permalink,
        selftext,
        media_metadata,
        gallery_data,
        link_flair_text,
        removed_by_category,
        mod_reason_title,
        mod_reason_by,
        removal_reason,
    } = post;

    const removalLabels = {
        moderator: "Removed by moderators",
        author: "Removed by author",
        reddit: "Removed by Reddit",
        deleted: "Deleted by author",
        automod_filtered: "Filtered by AutoMod",
        content_takedown: "Content taken down",
        copyright_takedown: "Removed for copyright",
    };
    const baseRemoval =
        removalLabels[removed_by_category] ||
        (removed_by_category ? `Removed: ${removed_by_category}` : null);
    const extraBits = [mod_reason_title, removal_reason, mod_reason_by && `by ${mod_reason_by}`]
        .filter(Boolean)
        .join(" • ");
    const removalTooltip = [baseRemoval, extraBits].filter(Boolean).join(" — ");

    const images = gallery_data?.items?.map((item) => {
        const media = media_metadata?.[item.media_id];
        return media?.s?.u?.replace(/&amp;/g, "&");
    });

    const date = new Date(created_utc * 1000);
    const showRemovalBadge = Boolean(removed_by_category);

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-purple-900/20 to-indigo-900/20 text-white shadow-lg backdrop-blur-xl"
        >
            {/* sheen */}
            {/* <motion.div
                aria-hidden
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            /> */}

            {/* removal badge */}
            {showRemovalBadge && (
                <div className="group absolute right-2 top-2 z-10">
                    <div
                        className="rounded-full bg-red-600/90 p-1.5 text-white shadow-sm ring-2 ring-red-400/30 cursor-help"
                        title={removalTooltip || "Removed"}
                        aria-label={removalTooltip || "Removed"}
                    >
                        <Trash2 className="h-3 w-3" />
                    </div>
                    {removalTooltip && (
                        <div className="pointer-events-none absolute right-0 mt-2 max-w-[16rem] w-max rounded border border-white/10 bg-black/80 px-2 py-1 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                            {removalTooltip}
                        </div>
                    )}
                </div>
            )}

            {/* header */}
            <div className={`flex items-center justify-between px-4 pt-4 text-xs text-gray-400 ${showRemovalBadge ? "pr-12" : ""}`}>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-300">{subreddit_name_prefixed}</span>
                    <span>•</span>
                    <span>u/{author}</span>
                </div>
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {date.toLocaleDateString()}
                </span>
            </div>

            {/* title + flair */}
            <div className="px-4 py-2">
                <h2
                    className="mb-1 text-base font-normal text-white"
                // style={{
                //     backgroundImage:
                //         "linear-gradient(135deg,#a855f7 0%,#ec4899 30%,#8b5cf6 60%,#3b82f6 100%)",
                //     backgroundSize: "300% 300%",
                //     WebkitBackgroundClip: "text",
                //     color: "transparent",
                // }}
                >
                    {title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                    {link_flair_text && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-white/5 px-2 py-1 text-xs text-purple-200 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            {link_flair_text}
                        </span>
                    )}
                </div>
            </div>

            {/* body */}
            {selftext && (
                <p className="px-4 pb-2 text-sm text-gray-300">
                    {selftext.length > 300 ? selftext.slice(0, 300) + "…" : selftext}
                </p>
            )}

            {/* images */}
            {images && images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 px-4 pb-2">
                    {images.map((url, idx) =>
                        url ? (
                            <motion.img
                                key={idx}
                                src={url}
                                alt={`media-${idx}`}
                                loading="lazy"
                                className="h-44 w-full rounded-md object-cover"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            />
                        ) : null
                    )}
                </div>
            )}

            {/* footer */}
            <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 backdrop-blur-sm">
                <a
                    href={`https://reddit.com${permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-blue-300 transition hover:text-blue-200"
                >
                    <ExternalLink size={16} />
                    <span className="underline-offset-2 group-hover:underline">Reddit</span>
                </a>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-1 transition hover:text-orange-300">
                        <ArrowBigUp size={16} />
                        {ups}
                    </div>
                    <div className="flex items-center gap-1 transition hover:text-cyan-200">
                        <MessageCircle size={16} />
                        {num_comments}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
