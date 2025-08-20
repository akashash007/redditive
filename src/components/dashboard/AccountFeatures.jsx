import React from "react";
import { motion } from "framer-motion";
import { Shield, Star, Eye, Filter, Zap, Globe, Bell, Lock } from "lucide-react";

const AccountFeatures = ({ userData }) => {
  if (!userData) return null;

  const features = [
    {
      name: "Email Verified",
      value: userData.has_verified_email,
      icon: Shield,
      color: userData.has_verified_email ? "text-green-400" : "text-gray-400",
      bgColor: userData.has_verified_email ? "bg-green-500/20" : "bg-gray-500/20",
    },
    {
      name: "Reddit Premium",
      value: userData.has_gold_subscription || userData.is_gold,
      icon: Star,
      color:
        userData.has_gold_subscription || userData.is_gold ? "text-yellow-400" : "text-gray-400",
      bgColor:
        userData.has_gold_subscription || userData.is_gold ? "bg-yellow-500/20" : "bg-gray-500/20",
    },
    {
      name: "Night Mode",
      value: userData.pref_nightmode,
      icon: Eye,
      color: userData.pref_nightmode ? "text-purple-400" : "text-gray-400",
      bgColor: userData.pref_nightmode ? "bg-purple-500/20" : "bg-gray-500/20",
    },
    {
      name: "Profanity Filter",
      value: userData.pref_no_profanity,
      icon: Filter,
      color: userData.pref_no_profanity ? "text-blue-400" : "text-gray-400",
      bgColor: userData.pref_no_profanity ? "bg-blue-500/20" : "bg-gray-500/20",
    },
    {
      name: "Show Trending",
      value: userData.pref_show_trending,
      icon: Zap,
      color: userData.pref_show_trending ? "text-orange-400" : "text-gray-400",
      bgColor: userData.pref_show_trending ? "bg-orange-500/20" : "bg-gray-500/20",
    },
    {
      name: "External Account",
      value: userData.has_external_account,
      icon: Globe,
      color: userData.has_external_account ? "text-cyan-400" : "text-gray-400",
      bgColor: userData.has_external_account ? "bg-cyan-500/20" : "bg-gray-500/20",
    },
    {
      name: "Show Presence",
      value: userData.pref_show_presence,
      icon: Bell,
      color: userData.pref_show_presence ? "text-pink-400" : "text-gray-400",
      bgColor: userData.pref_show_presence ? "bg-pink-500/20" : "bg-gray-500/20",
    },
    {
      name: "Moderator",
      value: userData.is_mod,
      icon: Lock,
      color: userData.is_mod ? "text-red-400" : "text-gray-400",
      bgColor: userData.is_mod ? "bg-red-500/20" : "bg-gray-500/20",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20, rotateY: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const enabledCount = features.filter((f) => f.value).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-indigo-900/20 px-4 py-5 shadow-2xl backdrop-blur-xl md:px-8 md:py-10"
    >
      {/* sheen (remove to disable) */}
      {/* <motion.div
        aria-hidden
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      /> */}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-2xl font-bold text-white">Account Features</h3>
          <p className="text-gray-400">Your Reddit account capabilities and preferences</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-green-500 to-blue-500 p-3">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Features grid */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.name}
              variants={item}
              whileHover={{ scale: 1.03, y: -3 }}
              className={`cursor-pointer rounded-xl border border-white/10 ${f.bgColor} p-4 text-center transition-all`}
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.25 }}
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${f.bgColor} ring-4 ring-white/10`}
              >
                <Icon className={`h-6 w-6 ${f.color}`} />
              </motion.div>

              <h4 className="mb-1 text-sm font-semibold text-white">{f.name}</h4>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 + 0.45 }}
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${f.value ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }`}
              >
                {f.value ? "Enabled" : "Disabled"}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 rounded-xl bg-white/5 p-4"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Active Features:</span>
          <span className="font-semibold text-white">
            {enabledCount} of {features.length}
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(enabledCount / features.length) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccountFeatures;
