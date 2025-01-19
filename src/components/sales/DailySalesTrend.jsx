import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../context/ContextTheme";
import { motion } from "framer-motion";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import ReactLoading from "react-loading";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

const DailyOrdersChart = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";
  const [isLoading, setIsLoading] = useState(true);

  const [dailyOrdersData, setDailyOrdersData] = useState([]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders")); // Fetching data from "orders" collection
        const orders = querySnapshot.docs.map((doc) => doc.data());

        // Group orders by day and calculate totalAmount
        const ordersByDay = {};

        orders.forEach((order) => {
          const orderDate = new Date(order.date); // Parse the `date` field
          const day = orderDate.toLocaleDateString("en-US", {
            weekday: "short",
          }); // Convert to weekday

          // Initialize or accumulate the totalAmount for the day
          if (!ordersByDay[day]) {
            ordersByDay[day] = 0;
          }

          // Parse and add the totalAmount (remove the "₦" sign for calculation)
          const numericAmount = parseFloat(
            order.totalAmount.replace(/[^\d.]/g, "")
          );
          ordersByDay[day] += numericAmount;
        });

        // Format the data for Recharts
        const formattedData = Object.keys(ordersByDay).map((day) => ({
          name: day,
          sales: ordersByDay[day],
        }));

        setDailyOrdersData(formattedData);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-medium mb-4">Daily Orders Trend</h2>
      <div style={{ width: "100%", height: 300 }}>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
        ) : (
          <ResponsiveContainer>
            <BarChart data={dailyOrdersData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#4b5563" : "#374151"}
              />
              <XAxis dataKey={"name"} stroke={darkMode ? "#d1d5db" : "#374151"} />
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
              <Bar dataKey={"sales"} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default DailyOrdersChart;
