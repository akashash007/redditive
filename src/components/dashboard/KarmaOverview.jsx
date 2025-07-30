import React, { useEffect } from 'react';
import axios from "axios";
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Award, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { fetchCommentsForPost, fetchFromEndpoint, getRedditData } from '@/services/redditApi';

const KarmaOverview = ({ userData }) => {
  if (!userData) return null;
  const { data: session, status } = useSession();

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
  //   if (status === "authenticated") {
  //     console.log("✅ Access Token:", session?.accessToken);
  //   }
  // }, [session, status]);

  useEffect(() => {
    const fetchUserComments = async () => {
      if (!session?.accessToken || !session?.user?.name) return;

      try {
        const res = await fetchFromEndpoint("getUserComments", session.accessToken, { username: session.user.name });
      } catch (err) {
        console.error("Failed to fetch trophies", err);
      }
    };

    if (status === "authenticated") {
      fetchUserComments();
    }
  }, [session, status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Karma Overview</h3>
          <p className="text-gray-300">Track your Reddit engagement and growth</p>
        </div>
        <motion.div
          // whileHover={{
          //   scale: 1.05,
          //   transition: { type: "tween", duration: 0.15, ease: "easeOut" }
          // }}
          className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl shadow-md"
        >
          <TrendingUp className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Karma Growth Chart */}
        {/* <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          // className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg"
          className="bg-purple-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-400" />
            Karma Growth Trend
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={karmaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="url(#purpleGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2, fill: '#ffffff' }}
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div> */}

        {/* Karma Distribution */}
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

      {/* Monthly Karma Breakdown */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-purple-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-sm mt-8"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Monthly Karma Breakdown</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={karmaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Bar dataKey="comment" stackId="a" fill="#8B5CF6" radius={[0, 0, 4, 4]} />
              <Bar dataKey="link" stackId="a" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div> */}
    </motion.div>
  );
};

export default KarmaOverview;
