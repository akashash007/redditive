import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Eye, Filter, Zap, Globe, Bell, Lock } from 'lucide-react';

const AccountFeatures = ({ userData }) => {

  if (!userData) return null;

  const features = [
    {
      name: 'Email Verified',
      value: userData.has_verified_email,
      icon: Shield,
      color: userData.has_verified_email ? 'text-green-400' : 'text-gray-400',
      bgColor: userData.has_verified_email ? 'bg-green-500/20' : 'bg-gray-500/20',
    },
    {
      name: 'Reddit Premium',
      value: userData.has_gold_subscription || userData.is_gold,
      icon: Star,
      color: (userData.has_gold_subscription || userData.is_gold) ? 'text-yellow-400' : 'text-gray-400',
      bgColor: (userData.has_gold_subscription || userData.is_gold) ? 'bg-yellow-500/20' : 'bg-gray-500/20',
    },
    {
      name: 'Night Mode',
      value: userData.pref_nightmode,
      icon: Eye,
      color: userData.pref_nightmode ? 'text-purple-400' : 'text-gray-400',
      bgColor: userData.pref_nightmode ? 'bg-purple-500/20' : 'bg-gray-500/20',
    },
    {
      name: 'Profanity Filter',
      value: userData.pref_no_profanity,
      icon: Filter,
      color: userData.pref_no_profanity ? 'text-blue-400' : 'text-gray-400',
      bgColor: userData.pref_no_profanity ? 'bg-blue-500/20' : 'bg-gray-500/20',
    },
    {
      name: 'Show Trending',
      value: userData.pref_show_trending,
      icon: Zap,
      color: userData.pref_show_trending ? 'text-orange-400' : 'text-gray-400',
      bgColor: userData.pref_show_trending ? 'bg-orange-500/20' : 'bg-gray-500/20',
    },
    {
      name: 'External Account',
      value: userData.has_external_account,
      icon: Globe,
      color: userData.has_external_account ? 'text-cyan-400' : 'text-gray-400',
      bgColor: userData.has_external_account ? 'bg-cyan-500/20' : 'bg-gray-500/20',
    },
    {
      name: 'Show Presence',
      value: userData.pref_show_presence,
      icon: Bell,
      color: userData.pref_show_presence ? 'text-pink-400' : 'text-gray-400',
      bgColor: userData.pref_show_presence ? 'bg-pink-500/20' : 'bg-gray-500/20',
    },
    {
      name: 'Moderator',
      value: userData.is_mod,
      icon: Lock,
      color: userData.is_mod ? 'text-red-400' : 'text-gray-400',
      bgColor: userData.is_mod ? 'bg-red-500/20' : 'bg-gray-500/20',
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20, rotateY: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl px-4 md:px-8 md:py-10 py-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Account Features</h3>
          <p className="text-gray-400">Your Reddit account capabilities and preferences</p>
        </div>
        <motion.div
          // whileHover={{ scale: 1.05, rotate: 10 }}
          className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl"
        >
          <Shield className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: {
                  type: "tween",
                  duration: 0.1,
                  ease: "easeOut"
                }
              }}
              className={`${feature.bgColor} border border-gray-700/30 rounded-xl p-4 text-center transition-all duration-300 cursor-pointer`}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}
              >
                <Icon className={`w-6 h-6 ${feature.color}`} />
              </motion.div>

              <h4 className="text-sm font-semibold text-white mb-1">{feature.name}</h4>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${feature.value
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-500/20 text-gray-400'
                  }`}
              >
                {feature.value ? 'Enabled' : 'Disabled'}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feature Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 bg-gray-900/50 rounded-xl"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Active Features:</span>
          <span className="text-white font-semibold">
            {features.filter(f => f.value).length} of {features.length}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(features.filter(f => f.value).length / features.length) * 100}%` }}
            transition={{ delay: 1, duration: 1 }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccountFeatures;