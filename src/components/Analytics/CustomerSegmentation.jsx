import React from 'react'
import { useContext } from "react";
import { ThemeContext } from "../context/ContextTheme";
import { motion } from 'framer-motion'
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip } from 'recharts'

const customerSegmentationData = [
  { subject: "Engagement", A: 120, B: 110, fullMark: 150 },
  { subject: "Loyalty", A: 98, B: 130, fullMark: 150 },
  { subject: "Satisfaction", A: 86, B: 130, fullMark: 150 },
  { subject: "Spend", A: 90, B: 100, fullMark: 150 },
  { subject: "Frequency", A: 85, B: 90, fullMark: 150 },
  { subject: "Recency", A: 65, B: 85, fullMark: 150 },
];

const CustomerSegmentation = () => {
    const { theme } = useContext(ThemeContext);

    //-----Dark mode styles---------
    const darkMode = theme === "dark";
  return (
    <>
      <motion.div
        className="bg-opacity-50 backdrop-blur-lg backdrop-filter shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-semibold mb-4">Customer Segmentation</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <RadarChart
              cx={"50%"}
              outerRadius={"80%"}
              data={customerSegmentationData}
            >
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
              <PolarRadiusAxis angle={180} domain={[0, 150]} stroke="#9ca3af" />
              <Radar
                name="Segment A"
                dataKey={"A"}
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Radar
                name="Segment B"
                dataKey={"B"}
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />

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
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
}

export default CustomerSegmentation