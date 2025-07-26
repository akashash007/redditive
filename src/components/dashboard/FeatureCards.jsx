import { motion } from 'framer-motion';
import { 
  Shield, 
  Moon, 
  Globe, 
  Star, 
  Eye, 
  Zap,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const FeatureCards = ({ profile }) => {
  const features = [
    {
      icon: Star,
      label: 'Premium',
      value: profile?.is_gold,
      color: 'yellow',
    },
    {
      icon: Shield,
      label: 'Verified Email',
      value: profile?.has_verified_email,
      color: 'green',
    },
    {
      icon: Moon,
      label: 'Night Mode',
      value: profile?.pref_nightmode,
      color: 'purple',
    },
    {
      icon: Globe,
      label: 'Geo Popular',
      value: profile?.pref_geopopular,
      color: 'blue',
    },
    {
      icon: Eye,
      label: 'Over 18',
      value: profile?.over_18,
      color: 'red',
    },
    {
      icon: Zap,
      label: 'Beta Features',
      value: profile?.in_beta,
      color: 'orange',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const getColorClasses = (color, isActive) => {
    const colors = {
      yellow: isActive ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'bg-gray-700/20 border-gray-600/30 text-gray-500',
      green: isActive ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-gray-700/20 border-gray-600/30 text-gray-500',
      purple: isActive ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-gray-700/20 border-gray-600/30 text-gray-500',
      blue: isActive ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-gray-700/20 border-gray-600/30 text-gray-500',
      red: isActive ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-gray-700/20 border-gray-600/30 text-gray-500',
      orange: isActive ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-gray-700/20 border-gray-600/30 text-gray-500',
    };
    return colors[color];
  };

  return (
    <GlassCard delay={0.3}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Account Features</h3>
        
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = feature.value;
            
            return (
              <motion.div
                key={feature.label}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className={`
                  p-4 rounded-lg border transition-all duration-200
                  ${getColorClasses(feature.color, isActive)}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  {isActive ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="text-sm font-medium">{feature.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </GlassCard>
  );
};

export default FeatureCards;