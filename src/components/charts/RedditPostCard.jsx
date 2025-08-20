import {
    ArrowBigUp,
    ArrowBigDown,
    MessageCircle,
    ExternalLink,
    Clock,
    Trash2, // 👈 new
} from "lucide-react";

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
        removed_by_category,         // 👈 read removal category
        mod_reason_title,
        mod_reason_by,
        removal_reason,
    } = post;

    // Friendly label for the tooltip
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

    // safe access to media
    const images = gallery_data?.items?.map((item) => {
        const media = media_metadata?.[item.media_id];
        return media?.s?.u?.replace(/&amp;/g, "&");
    });

    const date = new Date(created_utc * 1000);
    const showRemovalBadge = Boolean(removed_by_category);

    return (
        <div className="relative bg-gray-800/40 border border-white/10 bg-opacity-10 backdrop-blur-md rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg text-white">
            {/* Removal badge + tooltip */}
            {showRemovalBadge && (
                <div className="group absolute top-2 right-2 z-10">
                    <div
                        className="rounded-full bg-red-600/90 text-white p-1.5 shadow-sm cursor-help"
                        title={removalTooltip || "Removed"}
                        aria-label={removalTooltip || "Removed"}
                    >
                        <Trash2 className="w-3 h-3" />
                    </div>
                    {/* Tooltip */}
                    {removalTooltip && (
                        <div className="absolute right-0 mt-2 w-max max-w-[16rem] px-2 py-1 text-xs text-white bg-black/80 border border-white/10 rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            {removalTooltip}
                        </div>
                    )}
                </div>
            )}

            {/* Header (add right padding when badge exists to avoid overlap) */}
            <div
                className={`flex justify-between items-center px-4 pt-4 text-xs text-gray-400 ${showRemovalBadge ? "pr-12" : ""
                    }`}
            >
                <div className="flex gap-2">
                    <span className="font-semibold text-purple-300">{subreddit_name_prefixed}</span>
                    <span>•</span>
                    <span>u/{author}</span>
                </div>
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {date.toLocaleDateString()}
                </span>
            </div>

            {/* Title & Flair */}
            <div className="px-4 py-2">
                <h2 className="text-base font-semibold text-white mb-1">{title}</h2>
                {link_flair_text && (
                    <span className="inline-block bg-purple-700 bg-opacity-30 text-purple-300 text-xs px-2 py-1 rounded-full backdrop-blur-sm mb-2">
                        {link_flair_text}
                    </span>
                )}
            </div>

            {/* Selftext */}
            {selftext && (
                <p className="px-4 pb-2 text-sm text-gray-300">
                    {selftext.length > 300 ? selftext.slice(0, 300) + "..." : selftext}
                </p>
            )}

            {/* Images */}
            {images && images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 px-4 pb-2">
                    {images.map((url, idx) =>
                        url ? (
                            <img
                                key={idx}
                                src={url}
                                alt={`media-${idx}`}
                                loading="lazy"
                                className="rounded-md object-cover w-full h-44 hover:brightness-110 transition"
                            />
                        ) : null
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-800 bg-opacity-40 backdrop-blur-sm text-sm text-gray-300 border-t border-gray-700">
                <a
                    href={`https://reddit.com${permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                    <ExternalLink size={16} /> Reddit
                </a>
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center gap-1 hover:text-orange-400 transition">
                        <ArrowBigUp size={16} />
                        {ups}
                    </div>
                    <div className="flex items-center gap-1 hover:text-cyan-300 transition">
                        <MessageCircle size={16} />
                        {num_comments}
                    </div>
                </div>
            </div>
        </div>
    );
}
