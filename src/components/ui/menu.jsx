import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import UserDropdown from '../UserDropdown';

const Menu = ({ tabs, activeTab, setActiveTab, profile, session }) => {
    const rightTabs = ['overview', 'analytics'];
    const containerRef = useRef(null);
    const [activeRect, setActiveRect] = useState(null);
    useEffect(() => {
        const el = containerRef.current?.querySelector(`[data-tab="${activeTab}"]`);
        if (el && containerRef.current) {
            const elRect = el.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            setActiveRect({
                width: elRect.width,
                height: elRect.height,
                x: elRect.left - containerRect.left,
                y: elRect.top - containerRect.top,
            });
        }
    }, [activeTab]);
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[96.5%] max-w-7xl z-50 
            bg-gradient-to-br from-purple-800/10 via-purple-800/10 to-indigo-950/30
            backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl px-6 py-3"
        >
            <div className="flex items-center justify-between w-full">
                {/* Left: Logo */}
                <div className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                    Redditive
                </div>

                {/* Center: Tabs (excluding rightTabs) */}
                <nav className="hidden md:flex space-x-1">
                    {tabs.filter(tab => !rightTabs.includes(tab.id)).map(tab => {
                        const Icon = tab.icon;
                        return (
                            <motion.button
                                key={tab.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <Icon className="w-4 h-4 mr-1" />
                                <span>{tab.label}</span>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Right: Overview, Analytics, and Avatar */}
                <div className="flex items-center space-x-2">
                    {/* {tabs.filter(tab => rightTabs.includes(tab.id)).map(tab => {
                        const Icon = tab.icon;
                        return (
                            <motion.button
                                key={tab.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <Icon className="w-4 h-4 mr-1" />
                                <span>{tab.label}</span>
                            </motion.button>
                        );
                    })} */}
                    <div
                        ref={containerRef}
                        className="relative flex items-center space-x-2"
                    >
                        {/* Animated background pill */}
                        {activeRect && (
                            <motion.div
                                className="absolute rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow z-0"
                                initial={false}
                                animate={{
                                    width: activeRect.width,
                                    height: activeRect.height,
                                    x: activeRect.x,
                                    y: activeRect.y,
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}

                        {/* Tab buttons */}
                        {tabs.filter(tab => rightTabs.includes(tab.id)).map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    data-tab={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative z-10 flex items-center px-4 py-1.5 rounded-full text-sm font-medium text-white transition-all duration-300"
                                >
                                    <span className="relative z-10 flex items-center">
                                        <Icon className="w-4 h-4 mr-1" />
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>



                    <UserDropdown profile={profile} session={session} setActiveTab={setActiveTab} />
                </div>
            </div>
        </motion.header>
    );
};

export default Menu;
