import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  Eye,
  Filter,
  Bell,
  Globe,
  ToggleLeft as Toggle,
  Shield,
} from "lucide-react";
import { useSession } from "next-auth/react";
import AccountFeatures from "./AccountFeatures";
import ShimmerWrapper from "../ui/ShimmerWrapper";

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
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // hook up to API as needed
    console.log("Saving settings:", settings);
    setHasChanges(false);
  };

  const settingsItems = [
    { key: "nightMode", label: "Night Mode", icon: Eye, color: "purple" },
    { key: "profanityFilter", label: "Profanity Filter", icon: Filter, color: "blue" },
    { key: "showTrending", label: "Show Trending", icon: Bell, color: "orange" },
    { key: "showPresence", label: "Show Presence", icon: Globe, color: "green" },
    { key: "autoplay", label: "Autoplay Media", icon: Toggle, color: "pink" },
    { key: "videoAutoplay", label: "Video Autoplay", icon: Toggle, color: "cyan" },
    { key: "topKarmaSubreddits", label: "Top Karma Subs", icon: Shield, color: "yellow" },
    { key: "showSnoovatar", label: "Show Snoovatar", icon: SettingsIcon, color: "red" },
  ];

  const colorClasses = {
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600",
    pink: "from-pink-500 to-pink-600",
    cyan: "from-cyan-500 to-cyan-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
    >
      {/* LEFT: Settings */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ duration: 0.5 }}
      >
        <ShimmerWrapper
          fallbackHeight={500}
          baseColor="#3b0764"
          highlightColor="#c084fc"
          duration={1400}
          direction="rtl"
          lockHeightWhileLoading
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-indigo-900/20 px-4 py-5 md:px-8 md:py-10 shadow-2xl backdrop-blur-xl">
            {/* sheen (remove this block to disable) */}
            {/* <motion.div
              aria-hidden
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            /> */}
            {/* floaty glows */}
            <motion.div
              aria-hidden
              animate={{ y: [-10, 8, -10], rotate: [-2, 2, -2] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"
            />
            <motion.div
              aria-hidden
              animate={{ y: [12, -6, 12], rotate: [2, -2, 2] }}
              transition={{ duration: 8, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-pink-500/20 blur-3xl"
            />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-2xl font-bold text-white">Settings</h3>
                <p className="text-gray-400">Manage your Reddit preference</p>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-green-500 to-blue-500 p-3">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const isEnabled = settings[item.key];

                return (
                  <motion.div
                    key={item.key}
                    whileHover={{ y: -2 }}
                    className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
                  >
                    {/* small sheen line per card */}
                    {/* <motion.div
                      aria-hidden
                      initial={{ x: "-120%" }}
                      whileHover={{ x: "120%" }}
                      transition={{ duration: 1.4, ease: "linear" }}
                      className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    /> */}

                    <div className="flex items-center gap-4">
                      <div
                        className={`ring-4 ring-white/10 shadow w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[item.color]} flex items-center justify-center`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{item.label}</h4>
                        {/* Optional hint/desc placeholder */}
                        {/* <p className="text-sm text-gray-400">Short description</p> */}
                      </div>
                    </div>

                    {/* Toggle */}
                    <motion.button
                      aria-label={`${item.label} toggle`}
                      role="switch"
                      aria-checked={isEnabled}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleToggle(item.key)}
                      className={`relative h-8 w-14 rounded-full transition duration-300 ${isEnabled ? `bg-gradient-to-r ${colorClasses[item.color]}` : "bg-gray-600"
                        }`}
                    >
                      <motion.div
                        animate={{ x: isEnabled ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                      />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Save bar (appears only when there are changes) */}
            {/* <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 flex items-center justify-end gap-3"
                >
                  <button
                    onClick={() => setHasChanges(false)}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/90 transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-5 py-2 font-semibold text-white shadow-2xl shadow-purple-500/20"
                  >
                    <span className="relative z-10">Save changes</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-30" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        </ShimmerWrapper>
      </motion.div>

      {/* RIGHT: AccountFeatures */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ duration: 0.5 }}
      >
        <ShimmerWrapper
          fallbackHeight={600}
          baseColor="#3b0764"
          highlightColor="#c084fc"
          duration={1400}
          direction="rtl"
          lockHeightWhileLoading
        >
          <AccountFeatures userData={userData} />
        </ShimmerWrapper>
      </motion.div>
    </motion.div>
  );
};

export default UserSettings;
