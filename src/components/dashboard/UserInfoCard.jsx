// components/dashboard/UserInfoCard.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Mail, Shield, Star } from "lucide-react";
import { getRedditData } from "@/services/redditApi";

const UserInfoCard = ({ userData, status, session }) => {
  if (!userData || !userData.created) return null;
  const [trophies, setTrophies] = useState([]);

  const createdDate = new Date(userData.created * 1000).toLocaleDateString();
  const bannerUrl = userData?.subreddit?.banner_img?.replace(/&amp;/g, "&");

  useEffect(() => {
    const fetchTrophies = async () => {
      if (!session?.accessToken || !session?.user?.name) return;

      try {
        const res = await getRedditData("/api/v1/me/trophies", session.accessToken, session.user.name);
        const flatTrophies = res?.data?.trophies?.map(t => t.data) || [];
        setTrophies(flatTrophies);
      } catch (err) {
        console.error("Failed to fetch trophies", err);
      }
    };

    if (status === "authenticated") {
      fetchTrophies();
    }
  }, [session, status]);


  return (
    <div className="relative">
      {trophies?.length > 0 && (
        <div className="absolute top-2 right-2 z-20 flex flex-wrap gap-2">
          {trophies.map((trophy, idx) => (
            <div key={idx} className="relative group flex flex-col items-center">
              {/* Tooltip */}
              <div className="absolute -top-8 px-2 py-1 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                {trophy.name}
              </div>

              {/* Icon */}
              <img
                src={trophy.icon_70}
                alt={trophy.name}
                className="w-8 h-8"
              />
            </div>
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-gray-800/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-xl shadow-purple-500/10  transition-all duration-300 overflow-hidden"
      >

        {bannerUrl && (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${bannerUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-0" />

        <div className="relative z-10">
          <div className="flex items-start space-x-6 mb-6">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1">
                <img
                  src={userData.snoovatar_img || userData.icon_img}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover bg-gray-700"
                />
              </div>
              {userData.verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {userData.name}
              </h2>
              <p className="text-gray-300 mb-4">
                {userData.subreddit.public_description || "Reddit enthusiast"}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoBlock label="Total Karma" value={userData.total_karma} color="purple-400" />
                <InfoBlock label="Link Karma" value={userData.link_karma} color="blue-400" />
                <InfoBlock label="Comment Karma" value={userData.comment_karma} color="green-400" />
                <InfoBlock label="Messages" value={userData.inbox_count} color="orange-400" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <WithIcon icon={<Calendar className="w-4 h-4" />} label={`Joined ${createdDate}`} />
            {userData.has_verified_email && (
              <WithIcon icon={<Mail className="w-4 h-4 text-green-400" />} label="Email Verified" />
            )}
            {userData.is_mod && (
              <WithIcon icon={<Shield className="w-4 h-4 text-purple-400" />} label="Moderator" />
            )}
            {userData.has_gold_subscription && (
              <WithIcon icon={<Star className="w-4 h-4 text-yellow-400" />} label="Reddit Premium" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InfoBlock = ({ label, value, color }) => (
  <div className="text-center">
    <div className={`text-2xl font-bold text-${color}`}>{value.toLocaleString()}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
);

const WithIcon = ({ icon, label }) => (
  <div className="flex items-center space-x-2">
    {icon}
    <span>{label}</span>
  </div>
);

export default UserInfoCard;
