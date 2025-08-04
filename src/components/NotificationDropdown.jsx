import { useState, useRef, useEffect } from "react";
import { Bell, MessageSquareText, Reply } from "lucide-react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

// 🔧 Format time as "2 days ago"
const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 1) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `Just now`;
};

// 🔧 Format month-year for grouping
const formatMonthYear = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const NotificationDropdown = ({ notifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showOnlyNew, setShowOnlyNew] = useState(true);
    const dropdownRef = useRef(null);
    const router = useRouter();

    // Handle clicks outside to close dropdown
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter for recent + unread messages
    const ONE_WEEK = 7 * 24 * 60 * 60; // in seconds
    const now = Math.floor(Date.now() / 1000);

    const newNotifications = notifications.filter(n => {
        const isUnread = n?.data?.new;
        const isRecent = (now - n?.data?.created_utc) < ONE_WEEK;
        return isUnread && isRecent;
    });

    const visibleNotifications = showOnlyNew ? newNotifications : notifications;
    const unreadCount = newNotifications.length;

    // Group by month-year
    const groupedByMonth = visibleNotifications.reduce((acc, item) => {
        const key = formatMonthYear(item.data.created_utc);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="group relative p-2 rounded-full bg-gray-800/40 hover:bg-purple-700/30 border border-white/10 transition-all duration-200 shadow-sm"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 text-[10px] font-semibold bg-red-500 text-white rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-900">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Dropdown Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-80 bg-[#1f1f25]/95 backdrop-blur-md text-sm text-gray-200 rounded-xl border border-white/10 shadow-xl z-50 max-h-96 overflow-y-auto overflow-x-hidden custom-scrollbar"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 text-white font-semibold">
                            <span>Notifications</span>
                            <button
                                onClick={() => setShowOnlyNew(prev => !prev)}
                                className="text-xs font-medium bg-gray-700/30 hover:bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-300"
                            >
                                {showOnlyNew ? "Show All" : "Show New"}
                            </button>
                        </div>

                        {/* Grouped Notifications */}
                        {Object.keys(groupedByMonth).length === 0 ? (
                            <div className="p-4 text-center text-gray-400">No notifications</div>
                        ) : (
                            Object.entries(groupedByMonth).map(([monthYear, items]) => (
                                <div key={monthYear} className="px-2 pt-4 pb-1">
                                    <div className="text-xs text-gray-400 font-semibold mb-2">
                                        {monthYear}
                                    </div>
                                    {items.map((item) => {
                                        const d = item.data;
                                        const icon = d.was_comment
                                            ? <Reply className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                            : <MessageSquareText className="w-4 h-4 text-blue-400 flex-shrink-0" />;

                                        const isNew = d.new && (now - d.created_utc) < ONE_WEEK;
                                        const author = d.author ? d.author : null;

                                        return (
                                            <a
                                                key={d.name}
                                                href={`https://reddit.com${d.context || ""}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setIsOpen(false)}
                                                className="flex w-full text-left px-2 py-3 gap-3 items-start hover:bg-gray-800/40 transition border-b border-white/5 rounded-lg"
                                            >
                                                {icon}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-sm font-medium text-white truncate">
                                                            {d.subject}
                                                        </span>
                                                        {isNew && (
                                                            <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>

                                                    {author && (
                                                        <div className="text-xs text-gray-400 italic mb-0.5 truncate">
                                                            from u/{author}
                                                        </div>
                                                    )}

                                                    <div className="text-xs text-gray-300 truncate">
                                                        {d.body}
                                                    </div>

                                                    <div className="text-[11px] text-gray-500 mt-1 flex justify-between">
                                                        {d.subreddit_name_prefixed && (
                                                            <span className="truncate">{d.subreddit_name_prefixed}</span>
                                                        )}
                                                        <span>{formatTimeAgo(d.created_utc)}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}

                                    {/* {items.map((item) => {
                                        const d = item.data;
                                        const icon = d.was_comment
                                            ? <Reply className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                            : <MessageSquareText className="w-4 h-4 text-blue-400 flex-shrink-0" />;

                                        return (
                                            <a
                                                key={d.name}
                                                href={`https://reddit.com${d.context || ""}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setIsOpen(false)}
                                                className="flex w-full text-left px-2 py-3 gap-3 items-start hover:bg-gray-800/40 transition border-b border-white/5 rounded-lg"
                                            >
                                                {icon}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-white truncate">
                                                            {d.subject}
                                                        </span>
                                                        {d.new && (
                                                            <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-400 truncate">
                                                        {d.body}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 mt-1 flex justify-between">
                                                        {d.subreddit_name_prefixed && (
                                                            <span className="truncate">{d.subreddit_name_prefixed}</span>
                                                        )}
                                                        <span>{formatTimeAgo(d.created_utc)}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })} */}
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
