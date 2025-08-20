import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from "axios";
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, CartesianGrid,
  XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Treemap,
  LineChart, Line, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, Award, MessageSquare, Clock, CalendarClock, Type, Timer } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useNotify } from '@/utils/NotificationContext';
import CustomHeatmap from '../charts/CustomHeatmap';
import VotesChart from '../charts/VotesChart';
import ShimmerWrapper from '../ui/ShimmerWrapper';

const KarmaOverview = ({ userData }) => {
  if (!userData) return null;

  const { data: session, status } = useSession();
  const { notify } = useNotify();

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  // track which (user, token) we already fetched for
  const lastFetchKeyRef = useRef(null);

  // --- Fetch all comments with pagination; avoid re-fetch on focus ---
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const user = session?.user?.name;
    const token = session?.accessToken;

    // only fetch when authenticated & we have credentials
    if (status !== 'authenticated' || !user || !token) {
      if (status === 'unauthenticated') setCommentsLoading(false);
      return () => controller.abort();
    }

    const fetchKey = `${user}:${token}`;

    // if we already fetched for this user/token and we have data, don't refetch on focus
    if (lastFetchKeyRef.current === fetchKey && comments.length > 0) {
      setCommentsLoading(false);
      return () => controller.abort();
    }

    lastFetchKeyRef.current = fetchKey;

    (async () => {
      setCommentsLoading(true);
      let after = null;
      const all = [];

      try {
        while (true) {
          const { data } = await axios.get('/api/reddit/comments', {
            params: { username: user, accessToken: token, ...(after && { after }) },
            signal: controller.signal,
          });

          const chunk = data?.data?.children || [];
          all.push(...chunk);

          after = data?.data?.after || null;
          if (!after) break;
        }

        if (!cancelled) setComments(all);
      } catch (err) {
        if (!cancelled && err.name !== 'CanceledError' && err.name !== 'AbortError') {
          notify('error', 'Failed to load comments', 'Please check your connection or try logging in again.');
          console.error('Comments fetch error:', err);
        }
      } finally {
        if (!cancelled) setCommentsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.name, session?.accessToken]);

  // ---------- Derived data (memoized) ----------
  const karmaDistribution = useMemo(() => ([
    { name: 'Comment Karma', value: userData.comment_karma, color: '#8B5CF6' },
    { name: 'Link Karma', value: userData.link_karma, color: '#06B6D4' },
    { name: 'Awarder Karma', value: userData.awarder_karma, color: '#F59E0B' },
    { name: 'Awardee Karma', value: userData.awardee_karma, color: '#EF4444' },
  ]), [userData]);

  const subredditActivity = useMemo(() => {
    if (!comments?.length) return [];
    const map = comments.reduce((acc, c) => {
      const sub = c.data.subreddit;
      acc[sub] = acc[sub] || { subreddit: sub, count: 0 };
      acc[sub].count += 1;
      return acc;
    }, {});
    return Object.values(map);
  }, [comments]);

  const { topComment, bottomComment } = useMemo(() => {
    if (!comments?.length) return { topComment: null, bottomComment: null };
    const sorted = [...comments].sort((a, b) => (b.data.ups || 0) - (a.data.ups || 0));
    return { topComment: sorted[0] || null, bottomComment: sorted[sorted.length - 1] || null };
  }, [comments]);

  const treemapData = useMemo(() => {
    if (!comments?.length) return [];
    const base = Object.values(
      comments.reduce((acc, comment) => {
        const sub = comment.data.subreddit;
        const karma = comment.data.ups || 0;
        acc[sub] = acc[sub] || { name: sub, size: 0 };
        acc[sub].size += karma;
        return acc;
      }, {})
    );
    const scaled = base.map(item => ({ ...item, size: Math.max(Math.log(item.size + 1), 1) }));
    return scaled.filter(item => item.size > 1.5).sort((a, b) => b.size - a.size);
  }, [comments]);

  const heatmapData = useMemo(() => {
    if (!comments?.length) return [];
    const counts = comments.reduce((acc, c) => {
      const date = new Date(c.data.created_utc * 1000).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [comments]);

  // ===== NEW INSIGHTS =====

  // 1) Best Posting Hours (avg upvotes & count by local hour 0..23)
  const hourlyPerformance = useMemo(() => {
    if (!comments?.length) return [];
    const buckets = Array.from({ length: 24 }, () => ({ sum: 0, count: 0 }));
    for (const c of comments) {
      const d = new Date((c?.data?.created_utc ?? 0) * 1000);
      const hour = d.getHours(); // local time
      const ups = Number(c?.data?.ups ?? 0);
      buckets[hour].sum += ups;
      buckets[hour].count += 1;
    }
    return buckets.map((b, hour) => ({
      hour,
      count: b.count,
      avgScore: b.count ? b.sum / b.count : 0,
    }));
  }, [comments]);

  const bestHours = useMemo(() => {
    const MIN = 3;
    return [...hourlyPerformance]
      .filter(d => d.count >= MIN)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3);
  }, [hourlyPerformance]);

  const hourTick = (h) => {
    const hr = Number(h) % 24;
    const label = (hr % 12) || 12;
    return `${label}${hr < 12 ? 'am' : 'pm'}`;
  };

  // 2) Best Days to Post (weekday avg upvotes + volume)
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeekPerf = useMemo(() => {
    if (!comments?.length) return [];
    const agg = Array.from({ length: 7 }, () => ({ sum: 0, count: 0 }));
    for (const c of comments) {
      const d = new Date((c?.data?.created_utc ?? 0) * 1000);
      const w = d.getDay(); // 0..6
      const ups = Number(c?.data?.ups ?? 0);
      agg[w].sum += ups;
      agg[w].count += 1;
    }
    return DOW.map((day, i) => ({
      day,
      avgScore: agg[i].count ? agg[i].sum / agg[i].count : 0,
      count: agg[i].count,
    }));
  }, [comments]);

  const topDow = useMemo(() => {
    return [...dayOfWeekPerf]
      .filter(d => d.count >= 3)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 2);
  }, [dayOfWeekPerf]);

  // 3) Comment Length vs Upvotes (scatter)
  const lengthScatter = useMemo(() => {
    if (!comments?.length) return [];
    return comments.map(c => {
      const text = String(c?.data?.body || '');
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      return {
        words: Math.min(words, 400), // clamp for readability
        ups: Number(c?.data?.ups ?? 0),
      };
    });
  }, [comments]);

  // 4) Posting Cadence (histogram of intervals between comments)
  const cadenceBins = [
    { label: '<1h', min: 0, max: 1 },
    { label: '1–3h', min: 1, max: 3 },
    { label: '3–6h', min: 3, max: 6 },
    { label: '6–12h', min: 6, max: 12 },
    { label: '12–24h', min: 12, max: 24 },
    { label: '1–2d', min: 24, max: 48 },
    { label: '2–4d', min: 48, max: 96 },
    { label: '>4d', min: 96, max: Infinity },
  ];

  const postingCadence = useMemo(() => {
    if (!comments?.length) return [];
    const times = comments
      .map(c => Number(c?.data?.created_utc ?? 0))
      .filter(Boolean)
      .sort((a, b) => a - b);
    const diffsHours = [];
    for (let i = 1; i < times.length; i++) {
      diffsHours.push((times[i] - times[i - 1]) / 3600);
    }
    const counts = cadenceBins.map(b => ({ label: b.label, count: 0 }));
    diffsHours.forEach(h => {
      const idx = cadenceBins.findIndex(b => h >= b.min && h < b.max);
      if (idx > -1) counts[idx].count += 1;
    });
    return counts;
  }, [comments]);

  const karmaColors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#E879F9', '#F97316'];
  const CustomizedContent = ({ x, y, width, height, name, index }) => {
    const color = karmaColors[index % karmaColors.length];
    return (
      <foreignObject x={x} y={y} width={width} height={height}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width, height,
            backgroundColor: `${color}44`,
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '6px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            overflow: 'hidden',
          }}
        >
          <p style={{ color: 'white', fontSize: 11, fontWeight: 600, lineHeight: 1.2, wordBreak: 'break-word' }}>
            {name}
          </p>
        </div>
      </foreignObject>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full"
    >
      {/* ===== Left: Karma Overview (static – do NOT tie to commentsLoading) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ShimmerWrapper
          fallbackHeight={550}
          baseColor="#3b0764"
          highlightColor="#c084fc"
          duration={1400}
          direction="rtl"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl md:p-8 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Karma Overview</h3>
                <p className="text-gray-300">Track your Reddit engagement and growth</p>
              </div>
              <motion.div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-purple-900/30 backdrop-blur-md border border-white/10 rounded-2xl md:p-6 p-3 shadow-sm"
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
                          backgroundColor: '#4E3567',
                          border: '1px solid #4B5563',
                          borderRadius: '0.5rem',
                          padding: '0.75rem',
                          color: 'white',
                        }}
                        cursor={{ fill: '#8B5CF622' }}
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
                        {karmaDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {karmaDistribution.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
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
        </ShimmerWrapper>
        <div className="">
          {/* ===== Right: Votes (depends on comments) ===== */}
          <ShimmerWrapper
            loading={commentsLoading}
            fallbackHeight={120}
            baseColor="#3b0764"
            highlightColor="#c084fc"
            duration={1400}
            direction="rtl"
            lockHeightWhileLoading
          >
            <VotesChart topComment={topComment} bottomComment={bottomComment} />
          </ShimmerWrapper>

          {/* ==== Best Posting Hours (new) ==== */}
          <ShimmerWrapper
            loading={commentsLoading}
            fallbackHeight={422}
            baseColor="#3b0764"
            highlightColor="#c084fc"
            duration={1400}
            direction="rtl"
            lockHeightWhileLoading
            className={`${commentsLoading && "mt-8"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:p-6 p-3 shadow-2xl mt-8 md:mt-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-400" />
                    Best Posting Hours
                  </h4>
                  <p className="text-gray-300 text-sm">Average upvotes by hour (local time) + your activity</p>
                </div>
              </div>

              {bestHours?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {bestHours.map(({ hour, avgScore, count }) => (
                    <span
                      key={hour}
                      className="text-xs md:text-sm px-2 py-1 rounded-full bg-purple-900/40 border border-white/10 text-white"
                      title={`Samples: ${count}`}
                    >
                      {hourTick(hour)} • avg {avgScore.toFixed(1)} • {count} comments
                    </span>
                  ))}
                </div>
              )}

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyPerformance} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={hourTick}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: '#9CA3AF' }}
                      domain={['auto', 'auto']}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: '#9CA3AF' }}
                      domain={[0, (dataMax) => Math.max(2, dataMax)]}
                    />
                    <Tooltip
                      formatter={(val, key) => {
                        if (key === 'avgScore') return [Number(val).toFixed(2), 'Avg upvotes'];
                        if (key === 'count') return [val, 'Comments'];
                        return [val, key];
                      }}
                      labelFormatter={(h) => `Hour: ${hourTick(h)}`}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #4B5563',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        color: 'white',
                      }}
                      cursor={{ stroke: '#8B5CF6', strokeDasharray: '4 4' }}
                    />
                    <Legend wrapperStyle={{ color: 'white' }} />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      name="Avg upvotes"
                      yAxisId="left"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Comments"
                      yAxisId="right"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </ShimmerWrapper>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-[8px]">
        <ShimmerWrapper
          loading={commentsLoading}
          fallbackHeight={422}
          baseColor="#3b0764"
          highlightColor="#c084fc"
          duration={1400}
          direction="rtl"
          lockHeightWhileLoading
          className={`${commentsLoading && "mt-8"} mb-8`}
        >
          {/* ==== Day-of-Week Performance (new) ==== */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:p-6 p-3 shadow-2xl mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <CalendarClock className="w-5 h-5 mr-2 text-blue-400" />
                  Best Days to Post
                </h4>
                <p className="text-gray-300 text-sm">Average upvotes by weekday (plus your volume)</p>
              </div>
            </div>

            {topDow?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {topDow.map(({ day, avgScore, count }) => (
                  <span
                    key={day}
                    className="text-xs md:text-sm px-2 py-1 rounded-full bg-purple-900/40 border border-white/10 text-white"
                    title={`Samples: ${count}`}
                  >
                    {day} • avg {avgScore.toFixed(1)} • {count} comments
                  </span>
                ))}
              </div>
            )}

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={dayOfWeekPerf}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
                  <PolarRadiusAxis tick={{ fill: '#9CA3AF' }} />
                  <Tooltip
                    formatter={(val, key) => {
                      if (key === 'avgScore') return [Number(val).toFixed(2), 'Avg upvotes'];
                      if (key === 'count') return [val, 'Comments'];
                      return [val, key];
                    }}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      color: 'white',
                    }}
                  />
                  <Radar
                    dataKey="avgScore"
                    name="Avg upvotes"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </ShimmerWrapper>

        <ShimmerWrapper
          loading={commentsLoading}
          fallbackHeight={422}
          baseColor="#3b0764"
          highlightColor="#c084fc"
          duration={1400}
          direction="rtl"
          lockHeightWhileLoading
          className={`${commentsLoading && "mt-0 md:mt-8"}`}
        >
          {/* ==== Comment Length vs Upvotes (new) ==== */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:p-6 p-3 shadow-2xl mt-0 md:mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <Type className="w-5 h-5 mr-2 text-blue-400" />
                  Length vs Upvotes
                </h4>
                <p className="text-gray-300 text-sm">Do longer comments perform better?</p>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="words"
                    name="Words"
                    tick={{ fill: '#9CA3AF' }}
                    tickCount={8}
                  />
                  <YAxis
                    dataKey="ups"
                    name="Upvotes"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <ZAxis type="number" range={[60, 60]} />
                  <Tooltip
                    cursor={{ stroke: '#8B5CF6', strokeDasharray: '4 4' }}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      color: 'white',
                    }}
                    formatter={(val, key) => [val, key === 'words' ? 'Words' : 'Upvotes']}
                  />
                  <Scatter data={lengthScatter} name="Comments" fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </ShimmerWrapper>
      </div>

      {/* ===== Subreddit Comment Distribution (depends on comments) ===== */}
      <ShimmerWrapper
        loading={commentsLoading}
        fallbackHeight={400}
        baseColor="#3b0764"
        highlightColor="#c084fc"
        duration={1400}
        direction="rtl"
        lockHeightWhileLoading
        className={`${commentsLoading && "mt-0"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl md:p-8 p-4 shadow-2xl mt-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Subreddit Comment Distribution</h3>
              <p className="text-gray-300">Track your Reddit engagement and growth</p>
            </div>
            <motion.div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          <div className="h-64">
            <div className="-mx-4 md:mx-0 md:overflow-x-visible overflow-x-auto pb-2">
              <div className="min-w-[960px] md:min-w-0 px-4 md:px-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subredditActivity}>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #4B5563',
                          borderRadius: '0.5rem',
                          padding: '0.75rem',
                          color: 'white',
                        }}
                        cursor={{ fill: '#8B5CF622' }}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="subreddit" tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </ShimmerWrapper>

      {/* ===== Treemap (depends on comments) ===== */}
      <ShimmerWrapper
        loading={commentsLoading}
        fallbackHeight={360}
        baseColor="#3b0764"
        highlightColor="#c084fc"
        duration={1400}
        direction="rtl"
        lockHeightWhileLoading
        className={`${commentsLoading && "mt-8"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-2xl mt-8"
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

          <div className="-mx-4 md:mx-0 md:overflow-x-visible overflow-x-auto pb-2">
            <div className="min-w-[1024px] md:min-w-0 px-4 md:px-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <svg style={{ height: 0 }}>
                    <defs>
                      <filter id="glass-blur" x="0" y="0">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                  </svg>

                  <Treemap
                    data={treemapData}
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
            </div>
          </div>

        </motion.div>
      </ShimmerWrapper>

      {/* ===== Activity Heatmap (depends on comments) ===== */}
      <ShimmerWrapper
        loading={commentsLoading}
        fallbackHeight={260}
        baseColor="#3b0764"
        highlightColor="#c084fc"
        duration={1400}
        direction="rtl"
        lockHeightWhileLoading
        className={`${commentsLoading && "mt-8"}`}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 md:p-8 shadow-2xl mt-8">
          <div className="-mx-4 md:mx-0 md:overflow-x-visible overflow-x-auto">
            <div className="min-w-[1024px] md:min-w-0 px-4 md:px-0">
              <div className="h-[260px] md:h-[240px]">
                <CustomHeatmap data={heatmapData} />
              </div>
            </div>
          </div>
        </div>
      </ShimmerWrapper>
    </motion.div>
  );
};

export default KarmaOverview;
