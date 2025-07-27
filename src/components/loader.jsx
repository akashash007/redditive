import React from 'react'
import { motion } from 'framer-motion';

export const Loader = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/40 to-indigo-900/40 relative overflow-hidden">
            {/* Background blobs */}
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
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
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
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
            />

            {/* Dot bounce loader */}
            <div className="flex space-x-4 z-10">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-5 h-5 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full"
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
