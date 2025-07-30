import { motion } from "framer-motion";
import useFloatingParticles from "@/hooks/useFloatingParticles";

export default function FloatingBackground({ particleCount = 15 }) {
    const floatingParticles = useFloatingParticles(particleCount);

    return (
        <>
            {/* Background blobs */}
            <motion.div
                animate={{ x: [0, 80, 0], y: [0, -80, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ x: [0, -100, 0], y: [0, 100, 0], rotate: [360, 180, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"
            />

            {/* Floating particles */}
            {floatingParticles.map(p => (
                <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 0.2 }}
                    animate={{
                        x: [0, Math.random() * 100 - 50, 0],
                        y: [0, Math.random() * 100 - 50, 0],
                        rotate: [0, Math.random() * 360, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
                    }}
                    className={`absolute ${p.color} ${p.shape !== "triangle" ? p.shape : ""}`}
                    style={{
                        top: p.y,
                        left: p.x,
                        width: p.shape === "triangle" ? "0px" : p.size,
                        height: p.shape === "triangle" ? "0px" : p.size,
                        opacity: 0.5,
                        zIndex: 0,
                    }}
                >
                    {p.shape === "triangle" && <div className="triangle" />}
                </motion.div>
            ))}
        </>
    );
}
