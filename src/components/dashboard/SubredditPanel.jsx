import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, Eye, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const SubredditPanel = ({ userData }) => {

  if (!userData) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const subreddit = userData.subreddit;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Banner Background */}
      <div className="relative h-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${subreddit.banner_img})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80" />

        {/* Subreddit Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute bottom-4 left-6"
        >
          <div className="w-16 h-16 bg-gray-800 border-4 border-white rounded-full overflow-hidden shadow-lg">
            <img
              src={subreddit.icon_img}
              alt="Subreddit"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjOTQ5NzlBIi8+Cjwvc3ZnPg==';
              }}
            />
          </div>
        </motion.div>

        {/* Moderator Badge */}
        {subreddit.user_is_moderator && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1"
          >
            <Crown className="w-4 h-4" />
            <span>Moderator</span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h3 className="text-xl font-bold text-white mb-1">{subreddit.title}</h3>
          <p className="text-purple-400 text-sm font-medium">{subreddit.display_name_prefixed}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-gray-900/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-2xl font-bold text-white">{subreddit.subscribers}</span>
            </div>
            <p className="text-gray-400 text-sm">Subscribers</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-2xl font-bold text-white">{subreddit.show_media ? 'Yes' : 'No'}</span>
            </div>
            <p className="text-gray-400 text-sm">Show Media</p>
          </div>
        </motion.div>

        {/* Description */}
        <AnimatePresence>
          {subreddit.public_description && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between bg-gray-900/30 rounded-xl p-4 text-left transition-all duration-300 hover:bg-gray-900/50"
              >
                <span className="text-white font-semibold">Description</span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-4 bg-gray-900/30 rounded-xl"
                  >
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {subreddit.public_description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visit Profile Button */}
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          href={`https://reddit.com${subreddit.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Visit Profile</span>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default SubredditPanel;