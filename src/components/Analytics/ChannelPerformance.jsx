import React from 'react'
import { useContext } from "react";
import { ThemeContext } from "../context/ContextTheme";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const salesByCategoryData = [
  { name: "Organic Search", value: 4000 },
  { name: "Paid Search", value: 3000 },
  { name: "Direct", value: 2000 },
  { name: "Social Media", value: 2100 },
  { name: "Referral", value: 1850 },
  { name: "Email", value: 2350 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00c49f"];

const ChannelPerformance = () => {
  const { theme } = useContext(ThemeContext);

  //-----Dark mode styles---------
  const darkMode = theme === "dark";
  return (
    <>
      <motion.div
        className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Channel Performance</h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={salesByCategoryData}
                cx="50%"
                cy="50%"
                //   labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {salesByCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
}

export default ChannelPerformance