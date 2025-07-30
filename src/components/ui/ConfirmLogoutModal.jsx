import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmLogoutModal({ isOpen, onClose, onConfirm }) {
    if (typeof window === "undefined") return null;
    // Prevent background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        // className="w-full max-w-sm rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-white p-6"
                        className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#1e1b3a]/30 to-[#312e81]/30 backdrop-blur-2xl border border-white/10 shadow-md text-white p-6"
                    >

                        <div className="flex flex-col items-center text-center">
                            <LogOut className="w-8 h-8 text-red-500 mb-3" />

                            <h2 className="text-xl font-semibold mb-1">Log Out?</h2>
                            <p className="text-sm text-gray-300 mb-6">Are you sure you want to log out?</p>

                            <div className="flex gap-4 mt-2">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-md bg-gradient-to-r from-gray-600/60 to-gray-700/60 hover:from-gray-500/60 hover:to-gray-600/60 text-sm text-gray-200 transition backdrop-blur border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-sm text-white transition shadow-md"
                                >
                                    Log Out
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
