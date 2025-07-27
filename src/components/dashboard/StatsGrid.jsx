import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, MessageCircle, Link, Mail, Calendar, Coins } from 'lucide-react';

const StatsGrid = ({ userData }) => {
  if (!userData) return null;
  const stats = [
    {
      label: 'Total Karma',
      value: userData.total_karma.toLocaleString(),
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
    },
    {
      label: 'Comment Karma',
      value: userData.comment_karma.toLocaleString(),
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
    },
    {
      label: 'Link Karma',
      value: userData.link_karma.toLocaleString(),
      icon: Link,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-400',
    },
    {
      label: 'Messages',
      value: userData.inbox_count,
      icon: Mail,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-400',
    },
    {
      label: 'Reddit Coins',
      value: userData.coins || 0,
      icon: Coins,
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-400',
    },
    {
      label: 'Account Age',
      value: `${Math.floor((Date.now() - userData.created * 1000) / (1000 * 60 * 60 * 24 * 365))} years`,
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      textColor: 'text-indigo-400',
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
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
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
      className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl"
    >
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold text-white mb-6"
      >
        Quick Stats
      </motion.h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { type: "spring", stiffness: 400 }
              }}
              className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-4 relative overflow-hidden cursor-pointer group"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`text-2xl font-bold ${stat.textColor}`}
                  >
                    {stat.value}
                  </motion.div>
                </div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default StatsGrid;