import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Settings, Activity, UserCheck, Link } from 'lucide-react';

const SubredditPanel = ({ userData }) => {
  if (!userData) return null;

  const preferences = [
    { label: 'Night Mode', value: userData.pref_nightmode },
    { label: 'Autoplay', value: userData.pref_autoplay },
    { label: 'No Profanity', value: userData.pref_no_profanity },
    { label: 'Show Trending', value: userData.pref_show_trending },
  ];

  const features = [
    { label: 'Chat Enabled', value: userData.features?.chat },
    { label: 'Images in Comments', value: userData.features?.images_in_comments },
    { label: 'AMP Links', value: userData.features?.show_amp_link },
  ];

  const security = [
    { label: 'Verified Email', value: userData.has_verified_email },
    { label: 'Password Set', value: userData.password_set },
    { label: 'Accept Followers', value: userData.accept_followers },
  ];

  const linkedIdentities = userData.linked_identities || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-purple-900/20 backdrop-blur-xl border border-purple-700/40 rounded-2xl p-8 shadow-purple-900/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">User Settings Panel</h3>
          <p className="text-gray-400 text-sm">Explore unique Reddit preferences and features</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="bg-gradient-to-tr from-purple-500 to-fuchsia-500 p-3 rounded-xl"
        >
          <Settings className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Preferences */}
      <div className="mb-6">
        <div className="flex items-center mb-3 text-purple-300 font-semibold">
          <Activity className="w-5 h-5 mr-2" />
          User Preferences
        </div>
        <div className="grid grid-cols-2 gap-4">
          {preferences.map((item) => (
            <div key={item.label} className="bg-purple-950/40 p-4 rounded-lg text-center border border-purple-800/30">
              <p className="text-sm text-gray-300">{item.label}</p>
              <p className="text-lg font-bold text-purple-200">{item.value ? 'Enabled' : 'Disabled'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <div className="flex items-center mb-3 text-purple-300 font-semibold">
          <Settings className="w-5 h-5 mr-2" />
          Experimental Features
        </div>
        <div className="grid grid-cols-2 gap-4">
          {features.map((item) => (
            <div key={item.label} className="bg-purple-950/40 p-4 rounded-lg text-center border border-purple-800/30">
              <p className="text-sm text-gray-300">{item.label}</p>
              <p className="text-lg font-bold text-purple-200">{item.value ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="mb-6">
        <div className="flex items-center mb-3 text-purple-300 font-semibold">
          <Lock className="w-5 h-5 mr-2" />
          Security & Privacy
        </div>
        <div className="grid grid-cols-2 gap-4">
          {security.map((item) => (
            <div key={item.label} className="bg-purple-950/40 p-4 rounded-lg text-center border border-purple-800/30">
              <p className="text-sm text-gray-300">{item.label}</p>
              <p className="text-lg font-bold text-purple-200">{item.value ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Identities */}
      {linkedIdentities.length > 0 && (
        <div>
          <div className="flex items-center mb-3 text-purple-300 font-semibold">
            <Link className="w-5 h-5 mr-2" />
            Connected Identities
          </div>
          <ul className="list-disc ml-5 text-sm text-purple-200 space-y-1">
            {linkedIdentities.map((id, index) => (
              <li key={index}>
                <a href={id} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {id}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default SubredditPanel;
