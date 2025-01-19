import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { ThemeContext } from "../context/ContextTheme";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ReactLoading from "react-loading";

const UserGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUserGrowth = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const monthCounts = {};

        usersSnapshot.forEach((doc) => {
          const user = doc.data();
          const createdAt = user.createdAt?.toDate(); // Convert Firestore timestamp to JS Date
          if (createdAt) {
            const month = createdAt.toLocaleString("default", {
              month: "short",
            }); // Get short month name
            monthCounts[month] = (monthCounts[month] || 0) + 1;
          }
        });

        // Convert monthCounts to array and sort by month order
        const monthsOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const formattedData = monthsOrder.map((month) => ({
          month,
          users: monthCounts[month] || 0,
        }));

        setUserGrowthData(formattedData);
      } catch (error) {
        console.error("Error fetching user growth data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserGrowth();
  }, []);

  // Dark mode styles
  const darkMode = theme === "dark";

  return (
    <>
      <motion.div
        className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">User Growth</h2>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#4b5563" : "#374151"}
                />
                <XAxis
                  dataKey={"month"}
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
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default UserGrowthChart;
