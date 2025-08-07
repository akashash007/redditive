import {
    ArrowBigUp,
    ArrowBigDown,
    MessageCircle,
    ExternalLink,
    Clock,
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
    } = post;

    const images = gallery_data?.items?.map((item) => {
        const media = media_metadata[item.media_id];
        return media?.s?.u?.replace(/&amp;/g, "&");
    });

    const date = new Date(created_utc * 1000);

    return (
        <div className="bg-gray-800/40 border border-white/10 bg-opacity-10 backdrop-blur-md  rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg text-white">
            {/* Header */}
            <div className="flex justify-between items-center px-4 pt-4 text-xs text-gray-400">
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
                    {images.map((url, idx) => (
                        <img
                            key={idx}
                            src={url}
                            alt={`media-${idx}`}
                            loading="lazy"
                            className="rounded-md object-cover w-full h-44 hover:brightness-110 transition"
                        />
                    ))}
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
