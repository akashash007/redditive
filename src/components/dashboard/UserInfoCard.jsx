import { motion } from 'framer-motion';
import { User, Award, MessageCircle, Link as LinkIcon } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import LoadingShimmer from '../ui/LoadingShimmer';

const UserInfoCard = ({ profile, loading }) => {
  if (loading) {
    return (
      <GlassCard className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full shimmer" />
          <div className="space-y-2">
            <LoadingShimmer width="150px" height="24px" />
            <LoadingShimmer width="100px" height="16px" />
          </div>
        </div>
        <div className="space-y-2">
          <LoadingShimmer width="100%" height="16px" />
          <LoadingShimmer width="80%" height="16px" />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard glow className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
      
      <div className="relative z-10">
        {/* User Avatar and Basic Info */}
        <motion.div 
          className="flex items-center space-x-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {profile?.snoovatar_img ? (
              <img 
                src={profile.snoovatar_img} 
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-purple-500 glow-purple"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center glow-purple">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <motion.div
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            />
          </motion.div>
          
          <div>
            <motion.h2 
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              u/{profile?.name || 'Loading...'}
            </motion.h2>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Redditor since {profile?.created_utc ? 
                new Date(profile.created_utc * 1000).getFullYear() : '...'
              }
            </motion.p>
          </div>
        </motion.div>

        {/* Karma Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-5 h-5 text-yellow-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-white">
              {profile?.total_karma?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-400">Total Karma</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <LinkIcon className="w-5 h-5 text-blue-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-white">
              {profile?.link_karma?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-400">Link Karma</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="w-5 h-5 text-green-500 mr-1" />
            </div>
            <div className="text-2xl font-bold text-white">
              {profile?.comment_karma?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-400">Comment Karma</div>
          </div>
        </motion.div>

        {/* Premium Status */}
        {profile?.is_gold && (
          <motion.div
            className="flex items-center justify-center p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Award className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-400 font-semibold">Reddit Premium</span>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
};

export default UserInfoCard;