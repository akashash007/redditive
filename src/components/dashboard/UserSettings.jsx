import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ToggleLeft as Toggle, Eye, Filter, Bell, Globe, Shield, Save } from 'lucide-react';

const UserSettings = ({ userData }) => {
  const [settings, setSettings] = useState({
    nightMode: userData.pref_nightmode,
    profanityFilter: userData.pref_no_profanity,
    showTrending: userData.pref_show_trending,
    showPresence: userData.pref_show_presence,
    autoplay: userData.pref_autoplay,
    videoAutoplay: userData.pref_video_autoplay,
    topKarmaSubreddits: userData.pref_top_karma_subreddits,
    showSnoovatar: userData.pref_show_snoovatar,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    console.log('Saving settings:', settings);
    setHasChanges(false);
  };

  const settingsItems = [
    {
      key: 'nightMode',
      label: 'Night Mode',
      description: 'Use dark theme across Reddit',
      icon: Eye,
      color: 'purple',
    },
    {
      key: 'profanityFilter',
      label: 'Profanity Filter',
      description: 'Hide posts with profanity',
      icon: Filter,
      color: 'blue',
    },
    {
      key: 'showTrending',
      label: 'Show Trending',
      description: 'Display trending topics',
      icon: Bell,
      color: 'orange',
    },
    {
      key: 'showPresence',
      label: 'Show Online Status',
      description: 'Let others see when you\'re online',
      icon: Globe,
      color: 'green',
    },
    {
      key: 'autoplay',
      label: 'Autoplay Media',
      description: 'Automatically play videos and GIFs',
      icon: Toggle,
      color: 'pink',
    },
    {
      key: 'videoAutoplay',
      label: 'Video Autoplay',
      description: 'Autoplay videos in feed',
      icon: Toggle,
      color: 'cyan',
    },
    {
      key: 'topKarmaSubreddits',
      label: 'Top Karma Subreddits',
      description: 'Show subreddits where you have most karma',
      icon: Shield,
      color: 'yellow',
    },
    {
      key: 'showSnoovatar',
      label: 'Show Snoovatar',
      description: 'Display your Reddit avatar',
      icon: Settings,
      color: 'red',
    },
  ];

  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    green: 'from-green-500 to-green-600',
    pink: 'from-pink-500 to-pink-600',
    cyan: 'from-cyan-500 to-cyan-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
  };

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
      className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">User Settings</h3>
          <p className="text-gray-400">Customize your Reddit experience</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 90 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl"
        >
          <Settings className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 mb-8"
      >
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          const isEnabled = settings[item.key];
          
          return (
            <motion.div
              key={item.key}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[item.color]} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{item.label}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggle(item.key)}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    isEnabled
                      ? `bg-gradient-to-r ${colorClasses[item.color]}`
                      : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: isEnabled ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Save Button */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserSettings;