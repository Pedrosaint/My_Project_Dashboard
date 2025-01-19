import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ContextTheme";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase"; 
import ReactLoading from "react-loading";

const COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#fed766", "#2ab7ca"];

const OrderDistribution = () => {
  const { theme } = useContext(ThemeContext);
  const [ordersDistributionData, setOrdersDistributionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const darkMode = theme === "dark"; // Dark mode styles

  useEffect(() => {
    const fetchOrderStatuses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const statusCounts = {
          Pending: 0,
          Processing: 0,
          Delivered: 0,
        };

        querySnapshot.forEach((doc) => {
          const order = doc.data();
          if (statusCounts[order.status] !== undefined) {
            statusCounts[order.status] += 1;
          }
        });

        const formattedData = Object.entries(statusCounts).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

        setOrdersDistributionData(formattedData);
      } catch (error) {
        console.error("Error fetching order statuses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStatuses();
  }, []);

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4">Order Status Distribution</h2>
      <div style={{ width: "100%", height: 300 }}>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={ordersDistributionData}
                cx={"50%"}
                cy={"50%"}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {ordersDistributionData.map((entry, index) => (
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

export default OrderDistribution;
