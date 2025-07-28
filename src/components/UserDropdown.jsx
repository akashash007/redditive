// UserDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import ROUTES from "@/config/routeConfig";

const UserDropdown = ({ profile, session, setActiveTab }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Avatar - toggles dropdown */}
            <img
                src={profile?.snoovatar_img || profile?.icon_img}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-600 cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
            />

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-sm text-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                    {/* Settings Button */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setActiveTab("settings");
                        }}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 transition"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={() => signOut({ callbackUrl: ROUTES.HOME })}
                        className="cursor-pointer flex items-center w-full px-4 py-2 text-left hover:bg-red-500/20 text-red-400 hover:text-white transition"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
