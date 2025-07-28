import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Star, MessageSquare, Settings, Shield, Award } from 'lucide-react';
import KarmaOverview from '../dashboard/KarmaOverview';

const Analytics = ({ profile, session }) => {

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
    };

    return (
        <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-xl"
        >
            {/* Karma Overview */}
            <motion.div variants={itemVariants}>
                <KarmaOverview userData={profile} />
            </motion.div>
        </motion.div>
    )
}

export default Analytics;