import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Mail, Shield, Star } from "lucide-react";
import { fetchFromEndpoint } from "@/services/redditApi";
import { useSession } from "next-auth/react";
import SubscribedCommunities from "../charts/SubscribedCommunities";
import ShimmerWrapper from "../ui/ShimmerWrapper";

/* animations */
const containerVariants = { show: { transition: { staggerChildren: 0.04 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
  exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.18 } },
};

const UserInfoCard = ({ userData }) => {
  if (!userData || !userData.created) return null;

  const { data: session, status } = useSession();
  const [trophies, setTrophies] = useState([]);
  const [subscribedSubs, setSubscribedSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);

  const accessToken = session?.accessToken;
  const username = session?.user?.name;
  const hasFetchedSubsRef = useRef(null);
  const hasFetchedTrophiesRef = useRef(null);

  const createdDate = new Date(userData.created * 1000).toLocaleDateString();
  const bannerUrl = userData?.subreddit?.banner_img?.replace(/&amp;/g, "&");

  /* trophies */
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

  /* subs */
  useEffect(() => {
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
        const res = await fetch(`/api/reddit/subscriber?accessToken=${encodeURIComponent(accessToken)}`);
        const json = await res.json();
        if (!res.ok) {
          console.error("Subscribed subs request failed:", json?.error || res.status);
          setSubscribedSubs([]);
        } else {
          const subs = json?.data?.children?.map((s) => s.data) || [];
          setSubscribedSubs(subs);
          hasFetchedSubsRef.current = accessToken;
        }
      } catch (err) {
        console.error("Failed to fetch subscribed subreddits", err);
        setSubscribedSubs([]);
      } finally {
        setSubsLoading(false);
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
      <AnimatePresence>
        {trophies?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="hidden md:flex absolute top-2 right-2 z-20 flex-wrap gap-2"
          >
            {trophies.map((trophy, idx) => (
              <div key={idx} className="relative group flex flex-col items-center">
                <div className="absolute -top-8 px-2 py-1 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                  {trophy.name}
                </div>
                <img src={trophy.icon_70} alt={trophy.name} className="w-8 h-8" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ShimmerWrapper
        fallbackHeight="260px"
        baseColor="#3b0764"
        highlightColor="#c084fc"
        duration={1400}
        loadTime={500}
        direction="rtl"
      >
        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22 }}
          className="relative rounded-3xl overflow-hidden border border-white/10
                     bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-indigo-900/20
                     backdrop-blur-xl p-0 shadow-xl"
        >
          {/* === MAGIC BANNER LAYERS === */}
          {bannerUrl && (
            <>
              {/* Actual image: slightly scaled + soft blur for upscaling artifacts */}
              <img
                src={bannerUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-[1.5px] brightness-105 saturate-110 transform-gpu"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,.95) 0%, rgba(0,0,0,.75) 40%, rgba(0,0,0,.45) 65%, rgba(0,0,0,0) 100%)",
                  maskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,.95) 0%, rgba(0,0,0,.75) 40%, rgba(0,0,0,.45) 65%, rgba(0,0,0,0) 100%)",
                }}
                decoding="async"
                loading="eager"
              />

              {/* Radial vignette from top (adds depth, hides noise) */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 0%, rgba(10,10,30,0.65) 0%, rgba(10,10,30,0.35) 55%, rgba(10,10,30,0.15) 75%, transparent 100%)",
                }}
              />

              {/* Gentle color wash to match app palette */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-soft-light bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-transparent" />
            </>
          )}

          {/* CONTENT PANEL (glass) */}
          <div className="relative z-10 p-0">
            <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-4 md:p-6 shadow-lg shadow-black/20">
              {/* Header */}
              <div className="flex md:items-start md:space-x-6 mb-5 md:mb-7 flex-col md:flex-row gap-4 md:gap-0">
                {/* Avatar */}
                <motion.div whileHover={{ scale: 1.04 }} className="relative self-center md:self-auto">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[3px] md:p-[4px] shadow-lg shadow-purple-900/20">
                    <img
                      src={userData.snoovatar_img || userData.icon_img}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover bg-gray-700 ring-2 ring-white/10"
                    />
                  </div>
                  {userData.verified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
                      <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  )}
                </motion.div>

                {/* Name + bio */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                      {userData.name}
                    </span>
                  </h2>

                  <p className="text-gray-200/90 text-sm md:text-base mt-1.5 mb-4 leading-relaxed line-clamp-2 md:line-clamp-none">
                    {userData?.subreddit?.public_description || "Reddit enthusiast"}
                  </p>

                  {/* Stats — mobile only */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-2.5 sm:gap-3 md:hidden"
                  >
                    <StatChip label="Total Karma" value={userData.total_karma} />
                    <StatChip label="Link Karma" value={userData.link_karma} />
                    <StatChip label="Comment Karma" value={userData.comment_karma} />
                    <StatChip label="Messages" value={userData.inbox_count} />
                  </motion.div>
                </div>
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <MetaChip icon={<Calendar className="w-4 h-4" />} label={`Joined ${createdDate}`} />
                {userData.has_verified_email && (
                  <MetaChip icon={<Mail className="w-4 h-4 text-green-400" />} label="Email Verified" />
                )}
                {userData.is_mod && (
                  <MetaChip icon={<Shield className="w-4 h-4 text-purple-300" />} label="Moderator" />
                )}
                {userData.has_gold_subscription && (
                  <MetaChip icon={<Star className="w-4 h-4 text-yellow-300" />} label="Reddit Premium" />
                )}
              </div>
            </div>
          </div>
          {/* === /MAGIC BANNER LAYERS === */}
        </motion.div>
      </ShimmerWrapper>

      <div className="mt-4 md:mt-6">
        <SubscribedCommunities subscribedSubs={subscribedSubs} loading={subsLoading} />
      </div>
    </div>
  );
};

const StatChip = ({ label, value }) => (
  <motion.div
    variants={itemVariants}
    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3 py-2 shadow-sm hover:shadow-md hover:border-purple-400/30 transition-all duration-150"
  >
    <div className="text-[11px] text-gray-400">{label}</div>
    <div className="text-base font-semibold text-white">{Number(value ?? 0).toLocaleString()}</div>
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-tr from-purple-500/5 via-blue-500/5 to-transparent" />
  </motion.div>
);

const MetaChip = ({ icon, label }) => (
  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200 backdrop-blur-md hover:border-purple-400/40 hover:shadow hover:shadow-purple-500/10 transition-colors duration-150">
    {icon}
    <span>{label}</span>
  </span>
);

export default UserInfoCard;
