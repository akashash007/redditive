import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Eye, Filter, Bell, Globe,
  ToggleLeft as Toggle, Shield, Save
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const UserSettings = ({ userData, setActiveTab }) => {
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
  const { data: session, status } = useSession();

  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setHasChanges(false);
  };

  const settingsItems = [
    { key: 'nightMode', label: 'Night Mode', icon: Eye, color: 'purple' },
    { key: 'profanityFilter', label: 'Profanity Filter', icon: Filter, color: 'blue' },
    { key: 'showTrending', label: 'Show Trending', icon: Bell, color: 'orange' },
    { key: 'showPresence', label: 'Show Presence', icon: Globe, color: 'green' },
    { key: 'autoplay', label: 'Autoplay Media', icon: Toggle, color: 'pink' },
    { key: 'videoAutoplay', label: 'Video Autoplay', icon: Toggle, color: 'cyan' },
    { key: 'topKarmaSubreddits', label: 'Top Karma Subs', icon: Shield, color: 'yellow' },
    { key: 'showSnoovatar', label: 'Show Snoovatar', icon: Settings, color: 'red' },
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




  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-10 shadow-xl w-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-3xl font-bold text-white">Settings</h3>
          <p className="text-sm text-gray-400">Manage your Reddit preferences</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl">
          <Settings className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          const isEnabled = settings[item.key];
          return (
            <motion.div
              key={item.key}
              whileHover={{ scale: 1.01 }}
              className="bg-gray-900/60 border border-gray-700/40 rounded-2xl p-2 flex items-center justify-between transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[item.color]} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{item.label}</h4>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
              {/* Toggle Switch */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggle(item.key)}
                className={`relative w-14 h-8 rounded-full transition duration-300 ${isEnabled
                  ? `bg-gradient-to-r ${colorClasses[item.color]}`
                  : 'bg-gray-600'
                  }`}
              >
                <motion.div
                  animate={{ x: isEnabled ? 24 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Save Button */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg"
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
