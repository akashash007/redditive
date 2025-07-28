import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import UserDropdown from '../UserDropdown';

const Menu = ({ tabs, activeTab, setActiveTab, profile, session }) => {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[96.5%] max-w-7xl z-50 
        bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl px-6 py-3"
        >
            <div className="flex items-center justify-between">
                {/* Logo + Tabs */}
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Reddit Analyzer
                    </h1>
                    <nav className="hidden md:flex space-x-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <motion.button
                                    key={tab.id}
                                    // whileHover={{ scale: 1.05 }}
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
                </div>

                {/* User + Logout */}
                {/* Avatar Dropdown */}
                <UserDropdown profile={profile} session={session} setActiveTab={setActiveTab} />

            </div>
        </motion.header>
    )
}

export default Menu