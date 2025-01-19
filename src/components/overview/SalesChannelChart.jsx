import React from 'react'
import { useContext } from "react";
import { ThemeContext } from "../context/ContextTheme";
import { motion } from 'framer-motion'
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

const SALES_CHANNEL_DATA = [
  { name: "Website", value: 45600 },
  { name: "Mobile App", value: 38200 },
  { name: "Marketplace", value: 29800 },
  { name: "Social Media", value: 18700 },
];

const SalesChannelChart = () => {
  const { theme } = useContext(ThemeContext);

  //-----Dark mode styles----------
  const darkMode = theme === "dark";
  return (
    <>
      <motion.div
        className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border dark:border-gray-700 border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-medium mb-4">Sales by Channel</h2>
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={SALES_CHANNEL_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#4b5563" : "#374151"}
              />
              <XAxis
                dataKey={"name"}
                stroke={darkMode ? "#d1d5db" : "#374151"}
              />
              <YAxis stroke={darkMode ? "#9ca3af" : "#374151"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode
                    ? "rgba(31, 41, 55, 0.8)"
                    : "rgba(255, 255, 255, 0.6)",
                  borderColor: darkMode ? "#374151" : "#e5e7eb",
                }}
                itemStyle={{ color: darkMode ? "#e5e7eb" : "#374151" }}
              />
              <Legend />
              <Bar dataKey={"value"} fill={darkMode ? "#8884d8" : "#8b5cf6"}>
                {SALES_CHANNEL_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
}

export default SalesChannelChart