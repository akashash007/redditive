import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, MessageSquareText, Reply } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Format relative time
const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `Just now`;
};

const formatMonthYear = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const NotificationDropdown = ({ notifications = [], onRefresh }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showOnlyNew, setShowOnlyNew] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all");
    const [now, setNow] = useState(Math.floor(Date.now() / 1000));
    const dropdownRef = useRef(null);
    const [open, setOpen] = useState(false);

    const options = [
        { label: "All", value: "all" },
        { label: "Comments", value: "comment" },
        { label: "Chats", value: "chat" },
    ];

    // Poll every 60s
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Math.floor(Date.now() / 1000));
            if (onRefresh) onRefresh();
        }, 60000);
        return () => clearInterval(interval);
    }, [onRefresh]);

    // Outside click to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const ONE_WEEK = 7 * 24 * 60 * 60;

    const filtered = notifications.filter((n) => {
        const d = n.data;
        const isUnread = d?.new;
        const isRecent = now - d?.created_utc < ONE_WEEK;
        const matchesType =
            typeFilter === "all" ||
            (typeFilter === "comment" && d.was_comment) ||
            (typeFilter === "chat" && !d.was_comment);
        return (!showOnlyNew || (isUnread && isRecent)) && matchesType;
    });

    const unreadCount = notifications.filter(
        (n) => n?.data?.new && now - n?.data?.created_utc < ONE_WEEK
    ).length;

    const groupedByMonth = filtered.reduce((acc, item) => {
        const key = formatMonthYear(item.data.created_utc);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen((p) => !p)}
                className="group relative p-2 rounded-full bg-gray-800/40 hover:bg-purple-700/30 border border-white/10 transition-all duration-200 shadow-sm"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 text-[10px] font-semibold bg-red-500 text-white rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-900">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-[#1f1f25]/95 backdrop-blur-md text-sm text-gray-200 rounded-xl border border-white/10 shadow-xl z-50 max-h-96 overflow-y-auto overflow-x-hidden custom-scrollbar"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 text-white font-semibold">
                            <span>Notifications</span>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2">
                                    {/* Filter by type */}
                                    <div className="relative inline-block text-left">
                                        {/* Dropdown button */}
                                        <button
                                            onClick={() => setOpen((prev) => !prev)}
                                            className="flex items-center justify-between gap-2 text-xs text-gray-300 bg-[#1f1f25]/95 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 focus:outline-none hover:bg-gray-800/40 transition-all shadow-sm"
                                        >
                                            {options.find((o) => o.value === typeFilter)?.label}
                                            <motion.div
                                                animate={{ rotate: open ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown size={14} />
                                            </motion.div>
                                        </button>

                                        {/* Dropdown menu */}
                                        <AnimatePresence>
                                            {open && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute mt-2 w-32 rounded-xl bg-[#1f1f25]/95 backdrop-blur-lg border border-white/10 shadow-xl z-20 overflow-hidden"
                                                >
                                                    {options.map((opt, idx) => (
                                                        <motion.button
                                                            key={opt.value}
                                                            initial={{ x: 10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            onClick={() => {
                                                                setTypeFilter(opt.value);
                                                                setOpen(false);
                                                            }}
                                                            className="block w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-white/10 transition truncate"
                                                        >
                                                            {opt.label}
                                                        </motion.button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {/* Toggle new/all */}
                                    <button
                                        onClick={() => setShowOnlyNew((p) => !p)}
                                        className="text-xs font-medium bg-[#1f1f25]/95 hover:bg-gray-700/40 px-3 py-1 rounded-full text-gray-300 border border-white/10 transition-all shadow-sm"
                                    >
                                        {showOnlyNew ? "Show All" : "Show New"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        {Object.keys(groupedByMonth).length === 0 ? (
                            <div className="p-4 text-center text-gray-400">No notifications</div>
                        ) : (
                            Object.entries(groupedByMonth).map(([monthYear, items]) => (
                                <div key={monthYear} className="px-2 pt-4 pb-1">
                                    <div className="text-xs text-gray-400 font-semibold mb-2">{monthYear}</div>
                                    {items.map(({ data: d }) => {
                                        const isNew = d.new && now - d.created_utc < ONE_WEEK;
                                        const author = d.author === "[deleted]" ? null : d.author;
                                        const icon = d.was_comment ? (
                                            <Reply className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                        ) : (
                                            <MessageSquareText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                        );
                                        // const bodyText = DOMPurify.sanitize(d.body || "").slice(0, 120);
                                        const cleanBody = (d.body || "").replace(/<\/?[^>]+(>|$)/g, "");
                                        const bodyText = cleanBody.length > 120 ? cleanBody.slice(0, 120) + "…" : cleanBody;

                                        return (
                                            <a
                                                key={d.name}
                                                href={`https://reddit.com${d.context || ""}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setIsOpen(false)}
                                                title={d.body}
                                                className="flex w-full text-left px-2 py-3 gap-3 items-start hover:bg-gray-800/40 transition border-b border-white/5 rounded-lg"
                                            >
                                                {icon}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-sm font-medium text-white truncate">{d.subject}</span>
                                                        {isNew && (
                                                            <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>
                                                    {author && (
                                                        <div className="text-xs text-gray-400 italic mb-0.5 truncate">from u/{author}</div>
                                                    )}
                                                    {!author && (
                                                        <div className="text-xs text-gray-500 italic mb-0.5 truncate">from deleted user</div>
                                                    )}
                                                    <div className="text-xs text-gray-300 truncate">{bodyText}</div>
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
