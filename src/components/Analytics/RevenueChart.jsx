import React, { useState, useEffect, useContext } from "react";
import { db } from "../Firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { ThemeContext } from "../context/ContextTheme";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RevenueChart = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [revenueData, setRevenueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Year");
  const [newTarget, setNewTarget] = useState("");
  const [target, setTarget] = useState(0); // For the current time range

  // Fetch revenue data
  const fetchRevenueData = async () => {
    try {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const orders = ordersSnapshot.docs.map((doc) => doc.data());

      const processedData = {};

      orders.forEach((order) => {
        const date = new Date(order.date);
        const year = date.getFullYear();
        const month = date.toLocaleString("default", { month: "long" });
        const week = `Week ${Math.ceil(date.getDate() / 7)}`;
        const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
        const totalRevenue = parseFloat(
          order.totalAmount?.replace(/[^\d.-]/g, "") || "0"
        );

        // Process Weekly Data
        if (!processedData[year]) processedData[year] = {};
        if (!processedData[year][week]) {
          processedData[year][week] = { label: week, revenue: 0 };
        }
        processedData[year][week].revenue += totalRevenue;

        // Process Monthly Data
        if (!processedData[year][month]) {
          processedData[year][month] = { label: month, revenue: 0 };
        }
        processedData[year][month].revenue += totalRevenue;

        // Process Quarterly Data
        if (!processedData[year][quarter]) {
          processedData[year][quarter] = { label: quarter, revenue: 0 };
        }
        processedData[year][quarter].revenue += totalRevenue;

        // Process Yearly Data
        if (!processedData[year].total) {
          processedData[year].total = { label: year.toString(), revenue: 0 };
        }
        processedData[year].total.revenue += totalRevenue;
      });

      // Flatten the processed data for charting
      const chartData = [];
      Object.keys(processedData).forEach((year) => {
        Object.values(processedData[year]).forEach((entry) => {
          if (typeof entry === "object") chartData.push(entry);
        });
      });

      setRevenueData(chartData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  // Fetch target for the selected time range
  const fetchTarget = async () => {
    try {
      const targetDoc = await getDoc(
        doc(db, "revenueTargets", selectedTimeRange)
      );
      if (targetDoc.exists()) {
        setTarget(targetDoc.data().target);
      } else {
        setTarget(0); // Default to 0 if no target is found
      }
    } catch (error) {
      console.error("Error fetching target:", error);
    }
  };

  // Filter data based on the selected time range
  const filterData = () => {
    if (selectedTimeRange === "This Month") {
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
      });
      setFilteredData(
        revenueData.filter((data) => data.label === currentMonth)
      );
    } else if (selectedTimeRange === "This Week") {
      setFilteredData(
        revenueData.filter((data) => data.label.startsWith("Week"))
      );
    } else if (selectedTimeRange === "This Quarter") {
      const currentQuarter = `Q${Math.floor(new Date().getMonth() / 3) + 1}`;
      setFilteredData(
        revenueData.filter((data) => data.label === currentQuarter)
      );
    } else if (selectedTimeRange === "This Year") {
      const currentYear = new Date().getFullYear().toString();
      setFilteredData(revenueData.filter((data) => data.label === currentYear));
    }
  };

  // Update the target value in Firestore
  const updateTarget = async () => {
    if (!newTarget || isNaN(newTarget)) return;

    try {
      await setDoc(doc(db, "revenueTargets", selectedTimeRange), {
        target: parseFloat(newTarget),
      });
      setTarget(parseFloat(newTarget)); // Update the target in the UI
      setNewTarget("");
    } catch (error) {
      console.error("Error updating target:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  useEffect(() => {
    fetchTarget();
    filterData();
  }, [selectedTimeRange, revenueData]);

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-lg font-medium mb-4">Revenue vs Target</h2>

        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          <select
            className="dark:bg-gray-700 dark:text-white text-black rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>

          <input
            type="number"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            placeholder="Set Target"
            className="dark:bg-gray-700 dark:text-white text-black rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            onClick={updateTarget}
            className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Update Target
          </button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500">No data available.</p>
      ) : (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={filteredData.map((item) => ({ ...item, target }))}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#4b5563" : "#374151"}
              />
              <XAxis
                dataKey={"label"}
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default RevenueChart;
