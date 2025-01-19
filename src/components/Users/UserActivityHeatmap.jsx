import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ContextTheme";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import ReactLoading from "react-loading";


const UserActivityHeatmap = () => {
  const { theme } = useContext(ThemeContext);
  const [userActivityData, setUserActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const activityData = {};

        usersSnapshot.forEach((doc) => {
          const user = doc.data();
          const createdAt = user.createdAt?.toDate();
          if (createdAt) {
            const day = createdAt.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const hour = createdAt.getHours();

            // Determine time block
            const timeBlock = `${Math.floor(hour / 4) * 4}-${
              Math.floor(hour / 4) * 4 + 4
            }`;

            // Initialize day object if not present
            if (!activityData[day]) {
              activityData[day] = {
                name: day,
                "0-4": 0,
                "4-8": 0,
                "8-12": 0,
                "12-16": 0,
                "16-20": 0,
                "20-24": 0,
              };
            }

            // Increment time block count
            activityData[day][timeBlock]++;
          }
        });

        // Convert to array and sort by weekday order
        const sortedActivityData = [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
        ].map(
          (day) =>
            activityData[day] || {
              name: day,
              "0-4": 0,
              "4-8": 0,
              "8-12": 0,
              "12-16": 0,
              "16-20": 0,
              "20-24": 0,
            }
        );

        setUserActivityData(sortedActivityData);
      } catch (error) {
        console.error("Error fetching user activity data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  const darkMode = theme === "dark";

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4">User Activity Heatmap</h2>
      <div style={{ width: "100%", height: 300 }}>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
        ) : (
          <ResponsiveContainer>
            <BarChart data={userActivityData}>
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
              <Bar dataKey="0-4" stackId="a" fill="#6366f1" />
              <Bar dataKey="4-8" stackId="b" fill="#8b5cf6" />
              <Bar dataKey="8-12" stackId="c" fill="#ec4899" />
              <Bar dataKey="12-16" stackId="d" fill="#10b981" />
              <Bar dataKey="16-20" stackId="e" fill="#f59e0b" />
              <Bar dataKey="20-24" stackId="f" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default UserActivityHeatmap;
