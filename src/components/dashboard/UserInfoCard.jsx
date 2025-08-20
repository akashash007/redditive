import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Mail, Shield, Star } from "lucide-react";
import { fetchFromEndpoint } from "@/services/redditApi";
import { useSession } from "next-auth/react";
import SubscribedCommunities from "../charts/SubscribedCommunities";
import ShimmerWrapper from "../ui/ShimmerWrapper";

const UserInfoCard = ({ userData }) => {
  if (!userData || !userData.created) return null;

  const { data: session, status } = useSession();
  const [trophies, setTrophies] = useState([]);
  const [subscribedSubs, setSubscribedSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);     // start with shimmer ON

  const accessToken = session?.accessToken;
  const username = session?.user?.name;
  const hasFetchedSubsRef = useRef(null);
  const hasFetchedTrophiesRef = useRef(null);

  const createdDate = new Date(userData.created * 1000).toLocaleDateString();
  const bannerUrl = userData?.subreddit?.banner_img?.replace(/&amp;/g, "&");

  // Trophies (once per token)
  useEffect(() => {
    const fetchTrophies = async () => {
      if (!accessToken || !username) return;
      if (hasFetchedTrophiesRef.current === accessToken) return;
      try {
        const res = await fetchFromEndpoint("getTrophies", accessToken, username);
        const flatTrophies = res?.data?.trophies?.map((t) => t.data) || [];
        setTrophies(flatTrophies);
        hasFetchedTrophiesRef.current = accessToken;
      } catch (err) {
        console.error("Failed to fetch trophies", err);
      }
    };
    if (status === "authenticated") fetchTrophies();
  }, [status, accessToken, username]);

  // Subscribed Communities (once per token, query string token to match your API)
  useEffect(() => {
    // keep shimmer while NextAuth is resolving
    if (status === "loading") {
      setSubsLoading(true);
      return;
    }

    const fetchSubscribedSubs = async () => {
      if (!accessToken) {
        setSubscribedSubs([]);
        setSubsLoading(false);
        return;
      }
      if (hasFetchedSubsRef.current === accessToken) {
        setSubsLoading(false);
        return;
      }

      setSubsLoading(true);
      try {
        const res = await fetch(
          `/api/reddit/subscriber?accessToken=${encodeURIComponent(accessToken)}`
        );
        const json = await res.json();

        if (!res.ok) {
          console.error("Subscribed subs request failed:", json?.error || res.status);
          setSubscribedSubs([]); // avoid showing raw error text in UI
        } else {
          const subs = json?.data?.children?.map((s) => s.data) || [];
          setSubscribedSubs(subs);
          hasFetchedSubsRef.current = accessToken; // mark fetched for this token
        }
      } catch (err) {
        console.error("Failed to fetch subscribed subreddits", err);
        setSubscribedSubs([]);
      } finally {
        setSubsLoading(false); // turn off shimmer
      }
    };

    if (status === "authenticated") fetchSubscribedSubs();
    if (status === "unauthenticated") {
      setSubscribedSubs([]);
      setSubsLoading(false);
    }
  }, [status, accessToken]);

  return (
    <div className="relative">
      {trophies?.length > 0 && (
        <div className="hidden md:flex absolute top-2 right-2 z-20 flex-wrap gap-2">
          {trophies.map((trophy, idx) => (
            <div key={idx} className="relative group flex flex-col items-center">
              <div className="absolute -top-8 px-2 py-1 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                {trophy.name}
              </div>
              <img src={trophy.icon_70} alt={trophy.name} className="w-8 h-8" />
            </div>
          ))}
        </div>
      )}

      <ShimmerWrapper
        fallbackHeight="250px"
        baseColor="#3b0764"
        highlightColor="#c084fc"
        duration={1400}
        loadTime={500}
        direction="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-gray-800/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 md:p-8 shadow-xl shadow-purple-500/10 transition-all duration-300 overflow-hidden"
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
            {/* Header */}
            <div className="flex md:items-start md:space-x-6 mb-4 md:mb-6 flex-col md:flex-row gap-4 md:gap-0">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative self-center md:self-auto">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-[3px] md:p-1">
                  <img
                    src={userData.snoovatar_img || userData.icon_img}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover bg-gray-700"
                  />
                </div>
                {userData.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                )}
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 md:mb-2 break-words">
                  {userData.name}
                </h2>
                <p className="text-gray-300 text-sm md:text-base mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">
                  {userData.subreddit.public_description || "Reddit enthusiast"}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <InfoBlock label="Total Karma" value={userData.total_karma} colorClass="text-purple-400" />
                  <InfoBlock label="Link Karma" value={userData.link_karma} colorClass="text-blue-400" />
                  <InfoBlock label="Comment Karma" value={userData.comment_karma} colorClass="text-green-400" />
                  <InfoBlock label="Messages" value={userData.inbox_count} colorClass="text-orange-400" />
                </div>
              </div>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center justify-start gap-2 text-sm text-gray-400">
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
      </ShimmerWrapper>

      <div className="mt-4 md:mt-6">
        <SubscribedCommunities subscribedSubs={subscribedSubs} loading={subsLoading} />
      </div>
    </div>
  );
};

const InfoBlock = ({ label, value, colorClass }) => (
  <div className="text-center">
    <div className={`text-lg md:text-2xl font-bold ${colorClass}`}>{Number(value).toLocaleString()}</div>
    <div className="text-xs md:text-sm text-gray-400">{label}</div>
  </div>
);

const WithIcon = ({ icon, label }) => (
  <div className="flex items-center space-x-2 px-2 py-1 rounded-full md:px-0 md:py-0 md:rounded-none bg-white/5 md:bg-transparent border border-white/10 md:border-0">
    {icon}
    <span>{label}</span>
  </div>
);

export default UserInfoCard;
