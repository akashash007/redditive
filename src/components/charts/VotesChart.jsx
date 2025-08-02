import React from 'react'
import { motion } from 'framer-motion';
import { ThumbsDown, ThumbsUp } from 'lucide-react'

const VotesChart = ({ topComment, bottomComment }) => {

    const cleanBody = (text) => {
        if (!text) return "";
        const isURL = /^https?:\/\//.test(text.trim());
        return isURL ? "🔗 Image or Link Post" : text;
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Most Upvoted */}
            <div className="block">
                <div className="relative">
                    <ThumbsUp className="absolute top-2 right-2 text-green-300/80 w-5 h-5 z-2" />
                    <a
                        href={topComment ? `https://www.reddit.com${topComment.data.permalink}` : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-r from-green-500/20 to-green-400/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4 shadow-md hover:scale-[1.02] transition-transform duration-200 min-h-[110px]"
                        >
                            <h4 className="text-white font-semibold mb-1">Most Upvoted</h4>
                            {topComment ? (
                                <>
                                    <p className="text-green-300 font-bold text-lg">
                                        +{topComment.data.ups || 0} votes
                                    </p>
                                    <p className="text-white/80 text-sm line-clamp-2 mt-1">
                                        {cleanBody(topComment.data.body)}
                                    </p>
                                    <p className="text-xs text-white/50 mt-2">
                                        r/{topComment.data.subreddit}
                                    </p>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <div className="w-1/3 h-4 bg-white/20 rounded animate-pulse" />
                                    <div className="w-2/3 h-4 bg-white/10 rounded animate-pulse" />
                                    <div className="w-1/4 h-3 bg-white/10 rounded animate-pulse" />
                                </div>
                            )}
                        </motion.div>
                    </a>
                </div>
            </div>

            {/* Most Downvoted */}
            <div className="block">
                <div className="relative">
                    <ThumbsDown className="absolute top-2 right-2 text-red-300/80 w-5 h-5 z-2" />
                    <a
                        href={bottomComment ? `https://www.reddit.com${bottomComment.data.permalink}` : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-r from-red-500/20 to-red-400/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-md hover:scale-[1.02] transition-transform duration-200 min-h-[110px]"
                        >
                            <h4 className="text-white font-semibold mb-1">Most Downvoted</h4>
                            {bottomComment ? (
                                <>
                                    <p className="text-red-300 font-bold text-lg">
                                        {bottomComment.data.ups || 0} votes
                                    </p>
                                    <p className="text-white/80 text-sm line-clamp-2 mt-1">
                                        {cleanBody(bottomComment.data.body)}
                                    </p>
                                    <p className="text-xs text-white/50 mt-2">
                                        r/{bottomComment.data.subreddit}
                                    </p>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <div className="w-1/3 h-4 bg-white/20 rounded animate-pulse" />
                                    <div className="w-2/3 h-4 bg-white/10 rounded animate-pulse" />
                                    <div className="w-1/4 h-3 bg-white/10 rounded animate-pulse" />
                                </div>
                            )}
                        </motion.div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default VotesChart