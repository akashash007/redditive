import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import UserInfoCard from "@/components/dashboard/UserInfoCard";
import KarmaOverview from '@/components/dashboard/KarmaOverview';
import AccountFeatures from '@/components/dashboard/AccountFeatures';
import SubredditPanel from '@/components/dashboard/SubredditPanel';
import StatsGrid from '@/components/dashboard/StatsGrid';
import { useSession } from 'next-auth/react';

const Overview = ({ profile }) => {
    const { data: session, status } = useSession();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

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
            key="overview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* User Info and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    {/* <UserInfoCard userData={profile} status={status} session={session} /> */}
                    <UserInfoCard userData={profile} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatsGrid userData={profile} />
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Overview