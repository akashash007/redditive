import React, { useState, useEffect, useRef } from "react";
import {
    format, getDay, startOfYear, endOfYear,
    addDays, getMonth, getYear, startOfWeek
} from "date-fns";
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays } from "lucide-react";

// Color intensity logic
const getIntensity = (count) => {
    if (count >= 10) return "bg-purple-900";
    if (count >= 5) return "bg-purple-700";
    if (count >= 2) return "bg-purple-500";
    if (count >= 1) return "bg-purple-300";
    return "bg-zinc-800";
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthLabels = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CustomHeatmap({ data }) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [showDropdown, setShowDropdown] = useState(false);
    const [years, setYears] = useState([]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Calculate earliest year from localStorage
    useEffect(() => {
        const createdDate = localStorage.getItem("createdDate"); // e.g., "14/03/2023"
        let minYear = currentYear;
        if (createdDate) {
            const parts = createdDate.split("/");
            if (parts.length === 3) {
                const parsedYear = parseInt(parts[2]);
                if (!isNaN(parsedYear)) {
                    minYear = parsedYear;
                }
            }
        }
        const generatedYears = Array.from(
            { length: currentYear - minYear + 1 },
            (_, i) => currentYear - i
        );
        setYears(generatedYears);
    }, []);

    const startDate = startOfWeek(new Date(selectedYear, 0, 1)); // Sunday
    const endDate = endOfYear(new Date(selectedYear, 11, 31));
    const map = new Map(data.map((item) => [item.date, item.count]));

    const weeks = [];
    let current = startDate;
    while (current <= endDate) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            const date = format(current, "yyyy-MM-dd");
            week.push({
                date,
                count: map.get(date) || 0,
                month: getMonth(current),
                day: getDay(current),
            });
            current = addDays(current, 1);
        }
        weeks.push(week);
    }

    const monthHeader = [];
    let prevMonth = -1;
    for (let i = 0; i < weeks.length; i++) {
        const firstDay = weeks[i][0];
        const dateYear = getYear(new Date(firstDay.date));
        const month = firstDay.month;
        if (dateYear === selectedYear && month !== prevMonth) {
            monthHeader.push(monthLabels[month + 1]);
            prevMonth = month;
        } else {
            monthHeader.push("");
        }
    }

    return (
        <div className="text-white">
            <div className="flex items-center justify-between mb-8 relative">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Reddit Activity</h3>
                    <p className="text-gray-300">Track your Reddit engagement and growth</p>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <motion.div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                        <CalendarDays className="w-4 h-4 opacity-80" />
                        {selectedYear}
                    </motion.div>

                    {/* Dropdown Years */}
                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-32 bg-zinc-800/60 backdrop-blur-lg border border-white/10 text-sm text-white rounded-xl shadow-xl z-50 overflow-hidden"
                            >
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            setSelectedYear(year);
                                            setShowDropdown(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left hover:bg-purple-500/20 hover:text-white transition ${year === selectedYear ? "text-purple-400 font-semibold" : ""
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex gap-1">
                {/* Day Labels */}
                <div className="grid grid-rows-7 gap-[2px] mt-5 mr-1 text-xs text-gray-400">
                    {dayLabels.map((day) => (
                        <div key={day} className="h-3 text-[11px]">{day}</div>
                    ))}
                </div>

                <div className="flex flex-col">
                    {/* Month Header */}
                    <div className="flex gap-[2px] mb-1 ml-4 text-xs text-gray-400">
                        {monthHeader.map((label, idx) => (
                            <div key={idx} className="w-4 text-center">{label}</div>
                        ))}
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex gap-[2px]">
                        {weeks.map((week, weekIdx) => (
                            <div key={weekIdx} className="grid grid-rows-7 gap-[2px]">
                                {week.map((cell, dayIdx) => (
                                    <div
                                        key={dayIdx}
                                        className={`w-4 h-4 rounded-sm relative group transition-all duration-200 ${getIntensity(cell.count)}`}
                                    >
                                        {cell.count > 0 && (
                                            <div className="absolute hidden group-hover:flex bg-black/80 text-white text-xs px-2 py-1 rounded-md top-[-36px] left-1/2 -translate-x-1/2 z-50 shadow-lg backdrop-blur-md whitespace-nowrap">
                                                {cell.date}: {cell.count} post{cell.count !== 1 ? "s" : ""}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
