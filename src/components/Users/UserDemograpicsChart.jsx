import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ContextTheme";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ReactLoading from "react-loading";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

const UserDemographicsChart = () => {
  const { theme } = useContext(ThemeContext);
  const [userData, setUserData] = useState([]);
  const darkMode = theme === "dark";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "shippingAddresses")
        );
        const addresses = querySnapshot.docs.map((doc) => doc.data());

        // Aggregate data by state
        const stateCounts = {};
        addresses.forEach((address) => {
          const state = address.state || "Unknown";
          stateCounts[state] = (stateCounts[state] || 0) + 1;
        });

        // Transform into an array and calculate percentages
        const totalUsers = addresses.length;
        const data = Object.keys(stateCounts).map((state) => ({
          name: state,
          value: ((stateCounts[state] / totalUsers) * 100).toFixed(2), // percentage
        }));

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300 lg:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="text-lg font-medium mb-4">User Demographics by State</h2>
      <div className="h-80">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
        ) : (
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <PieChart>
              <Pie
                data={userData}
                cx={"50%"}
                cy={"50%"}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {userData.map((entry, index) => (
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
        )}
      </div>
    </motion.div>
  );
};

export default UserDemographicsChart;
