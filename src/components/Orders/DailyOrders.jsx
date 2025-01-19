import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../context/ContextTheme";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase"; 
import ReactLoading from "react-loading";

const DailyOrders = () => {
  const { theme } = useContext(ThemeContext);
  const [dailyOrdersData, setDailyOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersByDate = {};

        querySnapshot.forEach((doc) => {
          const order = doc.data();
          console.log("Order:", order); // Debugging
          const orderDate = new Date(order.date).toLocaleDateString("en-US"); // Format date as MM/DD/YYYY

          if (!ordersByDate[orderDate]) {
            ordersByDate[orderDate] = 0;
          }
          ordersByDate[orderDate] += 1; // Increment the count for this date
        });

        // Convert the ordersByDate object into an array for the chart
        const formattedData = Object.keys(ordersByDate).map((date) => ({
          date,
          orders: ordersByDate[date],
        }));
        console.log("Formatted Data:", formattedData);

        setDailyOrdersData(formattedData);
        console.log("Daily Orders Data:", dailyOrdersData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const darkMode = theme === "dark";

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4">Daily Orders</h2>
      <div className="h-[320px]">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyOrdersData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#4b5563" : "#374151"}
              />
              <XAxis
                dataKey={"date"}
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
                dataKey="orders"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default DailyOrders;
