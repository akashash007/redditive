import { useState, useRef, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import ROUTES from "@/config/routeConfig";
import ConfirmLogoutModal from "./ui/ConfirmLogoutModal";

const fallbackAvatar = "/redditive_favicon.png";

const UserDropdown = ({ profile, session, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(profile?.snoovatar_img || profile?.icon_img || fallbackAvatar);
    const dropdownRef = useRef(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        // In case profile updates later
        setAvatarSrc(profile?.snoovatar_img || profile?.icon_img || fallbackAvatar);
    }, [profile]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <img
                src={avatarSrc}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-600 cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
                onError={() => setAvatarSrc(fallbackAvatar)}
            />

            {isOpen && (
                <div className="absolute right-0 mt-4 w-40 bg-gray-800/60 backdrop-blur-lg text-sm text-gray-200 rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setActiveTab("settings");
                        }}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-left hover:bg-gray-700/40 transition"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </button>
                    <button
                        // onClick={() => signOut({ callbackUrl: ROUTES.HOME })}
                        onClick={() => {
                            setShowConfirm(true); // show modal instead of logging out immediately
                            setIsOpen(false);
                        }}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-left hover:bg-red-500/20 text-red-400 hover:text-white transition"
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
