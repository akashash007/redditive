import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, MessageCircle, Link, Mail, Calendar, Coins, Settings } from 'lucide-react';

const StatsGrid = ({ userData }) => {
  if (!userData) return null;

  const stats = [
    {
      label: 'Total Karma',
      value: userData.total_karma.toLocaleString(),
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-300',
    },
    {
      label: 'Comment Karma',
      value: userData.comment_karma.toLocaleString(),
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-300',
    },
    {
      label: 'Link Karma',
      value: userData.link_karma.toLocaleString(),
      icon: Link,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-300',
    },
    {
      label: 'Messages',
      value: userData.inbox_count,
      icon: Mail,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-300',
    },
    {
      label: 'Reddit Coins',
      value: userData.coins || 0,
      icon: Coins,
      color: 'from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-300',
    },
    {
      label: 'Account Age',
      value: `${Math.floor((Date.now() - userData.created * 1000) / (1000 * 60 * 60 * 24 * 365))} Y`,
      icon: Calendar,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-300',
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
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl"
    >

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Quick Stats</h3>
        </div>
        <motion.div
          // whileHover={{ scale: 1.05, rotate: 90 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl"
        >
          <Trophy className="w-6 h-6 text-white" />
        </motion.div>
      </div>


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
                scale: 1.03,
                y: -4,
                transition: {
                  type: "tween",
                  duration: 0.1,
                  ease: "easeOut"
                }
              }}
              className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-md overflow-hidden group transition-all"
            >
              {/* Subtle Hover Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none rounded-2xl`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
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
                <p className="text-gray-300 text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default StatsGrid;
