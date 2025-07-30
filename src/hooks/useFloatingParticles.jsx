import { useEffect, useState } from "react";

export default function useFloatingParticles(count = 15) {
    const [floatingParticles, setFloatingParticles] = useState([]);

    useEffect(() => {
        const generated = Array.from({ length: count }, (_, i) => ({
            id: i,
            size: `${Math.floor(Math.random() * 6) + 2}px`,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            color: [
                "bg-pink-400",
                "bg-purple-400",
                "bg-blue-400",
                "bg-yellow-300",
                "bg-green-400",
                "bg-indigo-400"
            ][Math.floor(Math.random() * 6)],
            shape: ["rounded-full", "rounded-md", "triangle"][Math.floor(Math.random() * 3)],
            delay: Math.random() * 5,
        }));

        setFloatingParticles(generated);
    }, [count]);

    return floatingParticles;
}
