import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, MessageCircle, Link, Mail, Calendar, Coins } from 'lucide-react';
import ShimmerWrapper from '../ui/ShimmerWrapper';

const StatsGrid = ({ userData }) => {
  if (!userData) return null;

  const stats = [
    { label: 'Total Karma', value: userData.total_karma.toLocaleString(), icon: Trophy, color: 'from-purple-500 to-pink-500', textColor: 'text-purple-300' },
    { label: 'Comment Karma', value: userData.comment_karma.toLocaleString(), icon: MessageCircle, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-300' },
    { label: 'Link Karma', value: userData.link_karma.toLocaleString(), icon: Link, color: 'from-green-500 to-emerald-500', textColor: 'text-green-300' },
    { label: 'Messages', value: userData.inbox_count, icon: Mail, color: 'from-orange-500 to-red-500', textColor: 'text-orange-300' },
    { label: 'Reddit Coins', value: userData.coins || 0, icon: Coins, color: 'from-yellow-400 to-yellow-600', textColor: 'text-yellow-300' },
    { label: 'Account Age', value: `${Math.floor((Date.now() - userData.created * 1000) / (1000 * 60 * 60 * 24 * 365))} Y`, icon: Calendar, color: 'from-indigo-500 to-purple-600', textColor: 'text-indigo-300' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-indigo-900/20 backdrop-blur-xl p-3 md:p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white">Quick Stats</h3>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
          <Trophy className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* MOBILE: 2 columns | DESKTOP: keep your original 2 columns */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <ShimmerWrapper
              fallbackHeight="250px"
              baseColor="#3b0764"
              highlightColor="#c084fc"
              duration={1400}
              loadTime={500}
              direction="rtl"
            >
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  y: -4,
                  transition: { type: 'tween', duration: 0.1, ease: 'easeOut' }
                }}
                whileTap={{ scale: 0.98 }} // MOBILE: tap feedback
                className="
                relative overflow-hidden group transition-all
                rounded-2xl border border-white/10 shadow-md
                bg-white/5 backdrop-blur-md
                p-3 sm:p-4
                min-h-[116px] // MOBILE: bigger tap area
              "
              >
                {/* MOBILE-ONLY: soft radial glow */}
                <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-white/10 blur-2xl sm:hidden" />

                {/* Hover/active gradient wash (still subtle on desktop) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none rounded-2xl`} />

                {/* MOBILE: stack & center | DESKTOP: original row layout */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0 mb-2 sm:mb-3">
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-11 sm:h-11 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-md ring-1 ring-white/10`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Value */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`text-xl sm:text-2xl font-bold tracking-tight ${stat.textColor} text-center sm:text-right`}
                  >
                    {stat.value}
                  </motion.div>
                </div>

                {/* Label */}
                <p className="text-gray-300 text-[12px] sm:text-sm font-medium text-center sm:text-left">
                  {stat.label}
                </p>
              </motion.div>
            </ShimmerWrapper>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default StatsGrid;
