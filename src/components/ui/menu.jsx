import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import ROUTES from "@/config/routeConfig";
import NotificationDropdown from "../NotificationDropdown";
import ConfirmLogoutModal from "../ui/ConfirmLogoutModal";
import UserDropdown from "../UserDropdown";
import { signOut } from "next-auth/react";

const fallbackAvatar = "/redditive_favicon.png";

const Menu = ({ tabs, profile, session, notifications }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(fallbackAvatar);
    const router = useRouter();

    const pathToTab = {
        "/dashboard": "overview",
        "/analytics": "analytics",
        "/settings": "settings",
        "/saved": "saved",
        "/submitted": "submitted",
    };

    const { pathname } = useRouter();
    const activeTab = pathToTab[pathname] || "overview";

    useEffect(() => {
        if (profile) {
            setAvatarSrc(profile.snoovatar_img || profile.icon_img || fallbackAvatar);
        }
    }, [profile]);

    const navigate = (route) => {
        router.push(route);
        setMobileMenuOpen(false);
    };

    const menuItems = [
        { id: "overview", label: "Overview", route: ROUTES.DASHBOARD },
        { id: "analytics", label: "Analytics", route: ROUTES.ANALYTICS },
        { id: "settings", label: "Settings", route: ROUTES.SETTINGS },
        { id: "saved", label: "Saved Items", route: ROUTES.SAVED },
        { id: "submitted", label: "Posts", route: ROUTES.SUBMITTED },
        { id: "about", label: "About", route: ROUTES.ABOUT },
    ];

    const menuVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.08, type: "spring", stiffness: 200 },
        }),
        exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
    };

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[96.5%] max-w-7xl z-50 
          bg-gradient-to-br from-purple-800/10 via-purple-800/10 to-indigo-950/30
          backdrop-blur-xl border border-white/10 rounded-full md:rounded-2xl shadow-xl px-3 md:px-6 md:py-3 py-[6px]"
            >
                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center justify-between w-full">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                    >
                        <img
                            src="/redditive_favicon.png"
                            alt=""
                            className="w-10 h-10 me-2"
                        />
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                            Redditive
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => navigate(ROUTES[tab.id.toUpperCase()])}
                                    className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow"
                                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-1" />
                                    {tab.label}
                                </motion.button>
                            );
                        })}

                        <NotificationDropdown notifications={notifications} />
                        <UserDropdown profile={profile} session={session} /> {/* RESTORED */}
                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className="flex md:hidden items-center justify-between w-full">
                    {/* Left: Logo */}
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                    >
                        <img
                            src="/redditive_favicon.png"
                            alt=""
                            className="w-8 h-8 mr-2"
                        />
                        <span className="text-lg font-bold bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent">
                            Redditive
                        </span>
                    </div>

                    {/* Right: Notifications + Menu Toggle */}
                    <div className="flex items-center gap-3">
                        <NotificationDropdown notifications={notifications} />
                        {/* Animated Hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="relative w-8 h-8 flex items-center justify-center"
                        >
                            <motion.span
                                className="absolute w-6 h-0.5 bg-white rounded"
                                animate={{
                                    rotate: mobileMenuOpen ? 45 : 0,
                                    y: mobileMenuOpen ? 0 : -6,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                            <motion.span
                                className="absolute w-6 h-0.5 bg-white rounded"
                                animate={{
                                    opacity: mobileMenuOpen ? 0 : 1,
                                }}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.span
                                className="absolute w-6 h-0.5 bg-white rounded"
                                animate={{
                                    rotate: mobileMenuOpen ? -45 : 0,
                                    y: mobileMenuOpen ? 0 : 6,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-full bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl p-4 flex flex-col gap-2 md:hidden"
                        >
                            {menuItems.map((item, i) => (
                                <motion.button
                                    key={item.id}
                                    custom={i}
                                    variants={menuVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    onClick={() => navigate(item.route)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === item.id
                                        ? "bg-gradient-to-r from-purple-800/50 to-purple-600/70 text-white"
                                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                </motion.button>
                            ))}

                            {/* Logout with avatar */}
                            <motion.button
                                custom={menuItems.length}
                                variants={menuVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setShowConfirm(true);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:text-white hover:bg-red-500/30"
                            >
                                <img
                                    src={avatarSrc}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full object-cover border border-gray-600"
                                />
                                Logout
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Confirm Logout Modal */}
            <ConfirmLogoutModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => signOut({ callbackUrl: ROUTES.HOME })}
            />
        </>
    );
};

export default Menu;
