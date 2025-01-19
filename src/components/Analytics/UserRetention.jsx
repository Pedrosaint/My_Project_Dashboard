import React from 'react'
import { useContext } from "react";
import { ThemeContext } from "../context/ContextTheme";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const userRetentionData = [
  { name: "Week 1", retention: 100 },
  { name: "Week 2", retention: 65 },
  { name: "Week 3", retention: 55 },
  { name: "Week 4", retention: 30 },
  { name: "Week 5", retention: 35 },
  { name: "Week 6", retention: 87 },
  { name: "Week 7", retention: 41 },
  { name: "Week 8", retention: 56 },
];

const UserRetention = () => {
    const { theme } = useContext(ThemeContext);

    //-----Dark mode styles---------
    const darkMode = theme === "dark";
  return (
    <>
      <motion.div
        className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-semibold mb-4">User Rentention</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={userRetentionData}>
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
              <Line
                type="monotone"
                dataKey="retention"
                stroke="#8b5cf6"
                strokeWidth={2}
                // dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                // activeDot={{ r: 8 }}
                // strokeDasharray="5 5"
                // name="Sales Over Time"
                // legendType="line"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
}

export default UserRetention