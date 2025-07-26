import { motion } from 'framer-motion';

const LoadingShimmer = ({ width = '100%', height = '20px', className = '' }) => {
  return (
    <div 
      className={`shimmer bg-gray-700 rounded ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default LoadingShimmer;