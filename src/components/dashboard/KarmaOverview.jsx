import React, { useEffect, useMemo, useState } from 'react';
import axios from "axios";
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Treemap,
  Tooltip
} from 'recharts';
import { TrendingUp, Award, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useNotify } from '@/utils/NotificationContext';
import CustomHeatmap from '../charts/CustomHeatmap';

const KarmaOverview = ({ userData }) => {
  if (!userData) return null;
  const { data: session, status } = useSession();
  const { notify } = useNotify();
  const [comments, setComments] = useState([]);
  const karmaData = [
    {
      month: "Current",
      total: userData.total_karma,
      link: userData.link_karma,
      comment: userData.comment_karma,
    },
  ];


  const karmaDistribution = [
    { name: 'Comment Karma', value: userData.comment_karma, color: '#8B5CF6' },
    { name: 'Link Karma', value: userData.link_karma, color: '#06B6D4' },
    { name: 'Awarder Karma', value: userData.awarder_karma, color: '#F59E0B' },
    { name: 'Awardee Karma', value: userData.awardee_karma, color: '#EF4444' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/70 backdrop-blur-md border border-gray-600/40 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // useEffect(() => {
  //   const fetchAllComments = async () => {
  //     if (!session?.user?.name) return;

  //     let after = null;
  //     let allComments = [];

  //     try {
  //       while (true) {
  //         const res = await fetch(
  //           `/api/reddit/comments?username=${session.user.name}&accessToken=${session.accessToken}${after ? `&after=${after}` : ''}`
  //         );
  //         const data = await res.json();

  //         const comments = data?.data?.children || [];
  //         allComments.push(...comments);

  //         after = data?.data?.after;
  //         if (!after) break;
  //       }

  //       setComments(allComments);
  //     } catch (err) {
  //       toast.error("Something went wrong");
  //       console.error("Fetch error:", err);
  //     }
  //   };

  //   if (status === "authenticated") {
  //     fetchAllComments();
  //   }
  // }, [session, status]);

  useEffect(() => {
    const fetchAllComments = async () => {
      if (!session?.user?.name) return;

      let after = null;
      let allComments = [];

      try {
        while (true) {
          const { data } = await axios.get('/api/reddit/comments', {
            params: {
              username: session.user.name,
              accessToken: session.accessToken,
              ...(after && { after }),
            },
          });

          const comments = data?.data?.children || [];
          allComments.push(...comments);

          after = data?.data?.after;
          if (!after) break;
        }

        setComments(allComments);
      } catch (err) {
        toast.error("Something went wrong");
        console.error("Axios error:", err);
      }
    };

    if (status === "authenticated") {
      fetchAllComments();
    }
  }, [session, status]);

  const subredditActivity = Object.values(
    comments.reduce((acc, comment) => {
      const sub = comment.data.subreddit;
      acc[sub] = acc[sub] || { subreddit: sub, count: 0 };
      acc[sub].count += 1;
      return acc;
    }, {})
  );

  const sortedByUpvotes = [...comments].sort(
    (a, b) => b.data.ups - a.data.ups
  );
  const cleanBody = (text) => {
    if (!text) return "";
    const isURL = /^https?:\/\//.test(text.trim());
    return isURL ? "🔗 Image or Link Post" : text;
  };

  const topComment = sortedByUpvotes[0];
  const bottomComment = sortedByUpvotes[sortedByUpvotes.length - 1];

  // const karmaBySubreddit = Object.values(
  //   comments.reduce((acc, comment) => {
  //     const sub = comment.data.subreddit;
  //     const karma = comment.data.ups || 0;

  //     acc[sub] = acc[sub] || { name: sub, size: 0 };
  //     acc[sub].size += karma;
  //     return acc;
  //   }, {})
  // );

  const rawData = Object.values(
    comments.reduce((acc, comment) => {
      const sub = comment.data.subreddit;
      const karma = comment.data.ups || 0;

      acc[sub] = acc[sub] || { name: sub, size: 0 };
      acc[sub].size += karma;
      return acc;
    }, {})
  );

  const karmaBySubreddit = rawData.map(item => ({
    ...item,
    size: Math.max(Math.log(item.size + 1), 1),
  }));

  const filteredData = karmaBySubreddit.filter(item => item.size > 1.5);

  filteredData.sort((a, b) => b.size - a.size);

  const karmaColors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#E879F9', '#F97316'];

  const CustomizedContent = ({ x, y, width, height, name, index }) => {
    const color = karmaColors[index % karmaColors.length];

    return (
      <foreignObject x={x} y={y} width={width} height={height}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: width,
            height: height,
            backgroundColor: `${color}44`, // add alpha
            border: '1px solid rgba(255, 255, 255, 0.1)',
            // borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '6px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            overflow: 'hidden',
          }}
        >
          <p
            style={{
              color: 'white',
              fontSize: '11px',
              fontWeight: '600',
              lineHeight: '1.2',
              wordBreak: 'break-word',
            }}
          >
            {name}
          </p>
        </div>
      </foreignObject>
    );
  };

  const dateData = comments.map((c) => {
    const date = new Date(c.data.created_utc * 1000).toISOString().split("T")[0]; // Ensures YYYY-MM-DD
    return date;
  });

  const counts = dateData.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const heatmapDatae = Object.entries(counts).map(([date, count]) => ({
    date,
    count,
  }));

  console.log(heatmapDatae);


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full"
    >
      {/* Karma Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className=" bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Karma Overview</h3>
              <p className="text-gray-300">Track your Reddit engagement and growth</p>
            </div>
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl shadow-md"
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-purple-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm"
            >
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                Karma Distribution
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#4E3567', // Tailwind gray-800
                        border: '1px solid #4B5563', // gray-600
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        color: 'white',
                      }}
                      cursor={{ fill: '#8B5CF622' }} // subtle hover background
                    />
                    <Pie
                      data={karmaDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {karmaDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {karmaDistribution.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-300">
                      {item.name}: {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Most Upvoted */}
            <div className="block">
              <div className="relative">
                <ThumbsUp className="absolute top-2 right-2 text-green-300/80 w-5 h-5 z-2" />
                <a
                  href={topComment ? `https://www.reddit.com${topComment.data.permalink}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-green-500/20 to-green-400/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4 shadow-md hover:scale-[1.02] transition-transform duration-200 min-h-[110px]"
                  >
                    <h4 className="text-white font-semibold mb-1">Most Upvoted</h4>
                    {topComment ? (
                      <>
                        <p className="text-green-300 font-bold text-lg">
                          +{topComment.data.ups || 0} votes
                        </p>
                        <p className="text-white/80 text-sm line-clamp-2 mt-1">
                          {cleanBody(topComment.data.body)}
                        </p>
                        <p className="text-xs text-white/50 mt-2">
                          r/{topComment.data.subreddit}
                        </p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-1/3 h-4 bg-white/20 rounded animate-pulse" />
                        <div className="w-2/3 h-4 bg-white/10 rounded animate-pulse" />
                        <div className="w-1/4 h-3 bg-white/10 rounded animate-pulse" />
                      </div>
                    )}
                  </motion.div>
                </a>
              </div>
            </div>

            {/* Most Downvoted */}
            <div className="block">
              <div className="relative">
                <ThumbsDown className="absolute top-2 right-2 text-red-300/80 w-5 h-5 z-2" />
                <a
                  href={bottomComment ? `https://www.reddit.com${bottomComment.data.permalink}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-red-500/20 to-red-400/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-md hover:scale-[1.02] transition-transform duration-200 min-h-[110px]"
                  >
                    <h4 className="text-white font-semibold mb-1">Most Downvoted</h4>
                    {bottomComment ? (
                      <>
                        <p className="text-red-300 font-bold text-lg">
                          {bottomComment.data.ups || 0} votes
                        </p>
                        <p className="text-white/80 text-sm line-clamp-2 mt-1">
                          {cleanBody(bottomComment.data.body)}
                        </p>
                        <p className="text-xs text-white/50 mt-2">
                          r/{bottomComment.data.subreddit}
                        </p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-1/3 h-4 bg-white/20 rounded animate-pulse" />
                        <div className="w-2/3 h-4 bg-white/10 rounded animate-pulse" />
                        <div className="w-1/4 h-3 bg-white/10 rounded animate-pulse" />
                      </div>
                    )}
                  </motion.div>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Subreddit Comment Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mt-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Subreddit Comment Distribution</h3>
            <p className="text-gray-300">Track your Reddit engagement and growth</p>
          </div>
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl shadow-md"
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subredditActivity}>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937', // Tailwind gray-800
                  border: '1px solid #4B5563', // gray-600
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  color: 'white',
                }}
                cursor={{ fill: '#8B5CF622' }} // subtle hover background
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="subreddit" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mt-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Karma by Subreddit</h3>
            <p className="text-gray-300">See where you earned the most karma</p>
          </div>
          <motion.div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl shadow-md">
            <Award className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <svg style={{ height: 0 }}>
              <defs>
                <filter id="glass-blur" x="0" y="0">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            <Treemap
              // data={karmaBySubreddit}
              data={filteredData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8B5CF6"
              content={<CustomizedContent />}
              type="treemap"
              layout="squarify"
            >
              <Tooltip
                formatter={(value) => [`${Math.round(Math.exp(value) - 1)} karma`]}
                labelFormatter={() => ''}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #4B5563',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  color: 'white',
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </motion.div>


      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mt-8">
        <CustomHeatmap data={heatmapDatae} />
      </div>

    </motion.div >
  );
};

export default KarmaOverview;
