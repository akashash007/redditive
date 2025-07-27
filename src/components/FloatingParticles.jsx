// components/ui/FloatingParticles.js
import { motion } from "framer-motion";

const floatingVariants = {
    animate: {
        y: [-15, 15, -15],
        rotate: [-3, 3, -3],
        transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export default function FloatingParticles() {
    return (
        <>
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl z-0"
            />
            <motion.div
                animate={{
                    x: [0, -150, 0],
                    y: [0, 100, 0],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl z-0"
            />
            <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute top-10 left-1/3 w-3 h-3 bg-pink-300 rounded-full opacity-50"
            />
            <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute bottom-10 right-1/3 w-4 h-4 bg-yellow-300 rounded-full opacity-40"
            />
            <motion.div
                variants={floatingVariants}
                animate="animate"
                className="absolute top-1/3 right-1/2 w-5 h-5 bg-green-400 rounded-full opacity-30"
            />
        </>
    );
}
