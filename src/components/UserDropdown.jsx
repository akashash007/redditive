// components/UserDropdown.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Award, LogOut, PenSquare, Settings, Upload, Info, Newspaper } from "lucide-react";
import { signOut } from "next-auth/react";
import ROUTES from "@/config/routeConfig";
import ConfirmLogoutModal from "./ui/ConfirmLogoutModal";
import { useRouter } from "next/router";

const fallbackAvatar = "/redditive_favicon.png";

const UserDropdown = ({ profile, session, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(fallbackAvatar);
    const [showConfirm, setShowConfirm] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    useEffect(() => {
        if (profile) {
            setAvatarSrc(profile.snoovatar_img || profile.icon_img || fallbackAvatar);
        }
    }, [profile]);

    const navigate = (route) => {
        setIsOpen(false);
        router.push(route);
    };

    const currentPath = router.pathname;
    const isActive = (route) => currentPath === route;

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <img
                src={avatarSrc}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-md cursor-pointer transition hover:border-white/30 hover:scale-[1.02]"
                onClick={() => setIsOpen((prev) => !prev)}
                onError={() => setAvatarSrc(fallbackAvatar)}
            />

            {isOpen && (
                <div
                    className="absolute right-0 mt-4 w-44 rounded-2xl border border-white/10
                     bg-[#0b0b14]/90 backdrop-blur-xl text-sm text-gray-200
                     shadow-2xl z-50 overflow-hidden"
                >
                    <button
                        onClick={() => navigate(ROUTES.SETTINGS)}
                        className={`cursor-pointer flex items-center w-full px-4 py-2 text-left transition
                        rounded-t-lg text-white/90 hover:bg-white/10
                        ${isActive(ROUTES.SETTINGS)
                                ? "bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 text-white"
                                : ""}`}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </button>

                    <button
                        onClick={() => navigate(ROUTES.SAVED)}
                        className={`cursor-pointer flex items-center w-full px-4 py-2 text-left transition
                         text-white/90 hover:bg-white/10
                        ${isActive(ROUTES.SAVED)
                                ? "bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 text-white"
                                : ""}`}
                    >
                        <Award className="w-4 h-4 mr-2" />
                        Saved Items
                    </button>

                    <button
                        onClick={() => navigate(ROUTES.SUBMITTED)}
                        className={`cursor-pointer flex items-center w-full px-4 py-2 text-left transition
                         text-white/90 hover:bg-white/10
                        ${isActive(ROUTES.SUBMITTED)
                                ? "bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 text-white"
                                : ""}`}
                    >
                        <Newspaper className="w-4 h-4 mr-2" />
                        Posts
                    </button>

                    {/* About */}
                    <button
                        onClick={() => navigate(ROUTES.ABOUT)}
                        className={`cursor-pointer flex items-center w-full px-4 py-2 text-left transition
                         text-white/90 hover:bg-white/10
                        ${isActive(ROUTES.ABOUT)
                                ? "bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 text-white"
                                : ""}`}
                    >
                        <Info className="w-4 h-4 mr-2" />
                        About
                    </button>

                    {/* Divider */}
                    <div className="my-0 h-px bg-white/10" />

                    <button
                        onClick={() => {
                            setShowConfirm(true);
                            setIsOpen(false);
                        }}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-left transition
                       rounded-b-lg text-red-400 hover:text-white hover:bg-red-500/20"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            )}

            <ConfirmLogoutModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => signOut({ callbackUrl: ROUTES.HOME })}
            />
        </div>
    );
};

export default UserDropdown;
