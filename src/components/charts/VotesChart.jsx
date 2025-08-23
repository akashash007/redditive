import React from 'react';
import { ThumbsDown, ThumbsUp, Clock, MessageSquareText } from 'lucide-react';

const cleanBody = (text) => {
    if (!text) return "";
    const isURL = /^https?:\/\//.test(text.trim());
    return isURL ? "🔗 Image or Link Post" : text;
};

const timeAgo = (utc) => {
    if (!utc) return '';
    const diff = Math.max(0, Date.now() - utc * 1000);
    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return `${s}s ago`;
};

const formatVotes = (n) => {
    const v = Number(n || 0);
    if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
    return v.toLocaleString();
};

const VoteCard = ({ title, icon: Icon, accent, comment }) => {
    const isPositive = accent === 'emerald';
    const palette = isPositive
        ? {
            ring: 'ring-emerald-400/60',
            border: 'border-emerald-400/30',
            glow: 'shadow-emerald-500/20',
            text: 'text-emerald-300',
            chip: 'bg-emerald-400/15 text-emerald-200 border-emerald-300/20',
            icon: 'text-emerald-300',
        }
        : {
            ring: 'ring-rose-400/60',
            border: 'border-rose-400/30',
            glow: 'shadow-rose-500/20',
            text: 'text-rose-300',
            chip: 'bg-rose-400/15 text-rose-200 border-rose-300/20',
            icon: 'text-rose-300',
        };

    const href = comment ? `https://www.reddit.com${comment.data.permalink}` : '#';
    const votes = formatVotes(comment?.data?.ups);
    const body = cleanBody(comment?.data?.body);
    const sub = comment?.data?.subreddit ? `r/${comment.data.subreddit}` : '';
    const when = timeAgo(comment?.data?.created_utc);

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block focus:outline-none"
            aria-label={comment ? `${title} — ${sub}` : title}
        >
            <div
                className={[
                    'relative overflow-hidden rounded-2xl p-4 md:p-5',
                    'bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-transparent',
                    `border ${palette.border}`,
                    'backdrop-blur-xl shadow-lg transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2',
                    `focus-visible:${palette.ring}`,
                    // Smooth hover/tap (no Framer)
                    'transform-gpu hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99]',
                ].join(' ')}
            >
                {/* soft radial glow */}
                <div
                    className={`pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl ${palette.glow}`}
                    aria-hidden="true"
                />

                {/* header badge */}
                <div className="mb-2">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border ${palette.chip}`}>
                        <Icon className={`w-4 h-4 ${palette.icon}`} />
                        <span className="font-semibold">{title}</span>
                    </div>
                </div>

                {/* votes */}
                <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-extrabold tracking-tight ${palette.text}`}>
                        {isPositive ? `+${votes}` : votes}
                    </span>
                    <span className="text-white/60 text-sm">votes</span>
                </div>

                {/* body */}
                <div className="mt-2 flex items-start gap-2">
                    <MessageSquareText className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                    {comment ? (
                        <p className="text-white/85 text-sm leading-relaxed line-clamp-3" title={body}>
                            {body}
                        </p>
                    ) : (
                        <div className="w-full space-y-2">
                            <div className="w-1/2 h-4 bg-white/15 rounded animate-pulse" />
                            <div className="w-4/5 h-4 bg-white/10 rounded animate-pulse" />
                            <div className="w-2/5 h-3 bg-white/10 rounded animate-pulse" />
                        </div>
                    )}
                </div>

                {/* footer meta */}
                <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                        {sub || '—'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/60">
                        <Clock className="w-3.5 h-3.5" />
                        {when || '—'}
                    </span>
                </div>
            </div>
        </a>
    );
};

const VotesChart = ({ topComment, bottomComment }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VoteCard title="Most Upvoted" icon={ThumbsUp} accent="emerald" comment={topComment} />
            <VoteCard title="Most Downvoted" icon={ThumbsDown} accent="rose" comment={bottomComment} />
        </div>
    );
};

export default React.memo(VotesChart);
