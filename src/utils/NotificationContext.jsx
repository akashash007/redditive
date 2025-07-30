import Toast from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useLayoutEffect,
} from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);
    const toastRefs = useRef({}); // Store refs per toast ID

    const notify = useCallback((type, title, description) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, title, description }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
            delete toastRefs.current[id];
        }, 3000);
    }, []);

    // Measure toast heights on layout
    const heights = toasts.map((toast, index) => {
        const el = toastRefs.current[toast.id];
        return el?.offsetHeight || 0;
    });

    // Calculate cumulative Y offsets
    const yOffsets = heights.reduce((acc, h, i) => {
        acc.push((acc[i - 1] || 0) + (isHovered ? h + 10 : 15));
        return acc;
    }, []);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                <div
                    className="relative group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    ref={containerRef}
                >
                    <AnimatePresence initial={false}>
                        {toasts.map((toast, index) => {
                            const y = index === 0 ? 0 : yOffsets[index - 1];

                            return (
                                <motion.div
                                    key={toast.id}
                                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="absolute left-1/2 -translate-x-1/2"
                                    style={{ zIndex: 100 - index }}
                                    ref={(el) => (toastRefs.current[toast.id] = el)}
                                >
                                    <Toast {...toast} />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotify = () => useContext(NotificationContext);
