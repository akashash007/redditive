import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const AnimatedBackground = ({ children, variant = 'default' }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const variants = {
    default: {
      background: 'linear-gradient(-45deg, #0f172a, #1e293b, #334155, #475569)',
    },
    neon: {
      background: 'linear-gradient(-45deg, #0f172a, #1e293b, #8B5CF6, #3B82F6)',
    },
    reddit: {
      background: 'linear-gradient(-45deg, #0f172a, #1e293b, #FF4500, #0079D3)',
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 animated-bg"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {isClient && [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              background: `linear-gradient(135deg, ${
                i % 2 === 0 ? '#8B5CF6' : '#3B82F6'
              }, ${i % 2 === 0 ? '#EC4899' : '#F97316'})`,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;