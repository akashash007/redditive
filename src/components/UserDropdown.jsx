import { useState, useRef, useEffect } from "react";
import { Award, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import ROUTES from "@/config/routeConfig";
import ConfirmLogoutModal from "./ui/ConfirmLogoutModal";
import { useRouter } from "next/router";

const fallbackAvatar = "/redditive_favicon.png";

const UserDropdown = ({ profile, session, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(fallbackAvatar);
    const dropdownRef = useRef(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();
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
        if (profile) {
            const newSrc = profile.snoovatar_img || profile.icon_img || fallbackAvatar;
            setAvatarSrc(newSrc);
        }
    }, [profile]);
    console.log("Dropdown profile:", profile);

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
                            router.push(ROUTES.SETTINGS);
                        }}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-left hover:bg-gray-700/40 transition"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            router.push(ROUTES.SAVED);
                        }}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-left hover:bg-gray-700/40 transition"
                    >
                        <Award className="w-4 h-4 mr-2" />
                        Saved Items
                    </button>
                    <button
                        onClick={() => {
                            setShowConfirm(true);
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
