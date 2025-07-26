import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import AnimatedChart from '../charts/AnimatedChart';

const KarmaChart = ({ profile }) => {
  // Generate mock karma growth data (in real app, this would come from API)
  const generateKarmaData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const totalKarma = profile?.total_karma || 1000;
    
    return months.map((month, index) => ({
      month,
      karma: Math.floor((totalKarma / months.length) * (index + 1) + Math.random() * 100),
      linkKarma: Math.floor((profile?.link_karma || 500) / months.length * (index + 1)),
      commentKarma: Math.floor((profile?.comment_karma || 500) / months.length * (index + 1)),
    }));
  };

  const karmaData = generateKarmaData();

  return (
    <GlassCard delay={0.2}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <motion.div
            className="w-3 h-3 bg-purple-500 rounded-full mr-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Karma Growth
        </h3>
        
        <AnimatedChart
          type="area"
          data={karmaData}
          dataKey="karma"
          xAxisKey="month"
          gradient={true}
        />
        
        {/* Karma breakdown */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">
              {profile?.link_karma?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-400">Link Karma</div>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">
              {profile?.comment_karma?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-400">Comment Karma</div>
          </div>
        </motion.div>
      </motion.div>
    </GlassCard>
  );
};

export default KarmaChart;