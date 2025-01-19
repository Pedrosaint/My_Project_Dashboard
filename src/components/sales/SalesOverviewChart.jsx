import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ContextTheme";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase"; // Adjust this path
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import ReactLoading from "react-loading";


const SalesOverviewChart = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
  const [salesData, setSalesData] = useState([]);

  // Fetch sales data from Firestore
  const fetchSalesData = async () => {
    try {
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const sales = [];

      ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        const totalAmount =
          parseFloat(order.totalAmount.replace(/[^\d.-]/g, "")) || 0;
        const date = order.date ? parseISO(order.date) : null;

        if (date) {
          sales.push({ date, totalAmount });
        }
      });

      setSalesData(sales);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Filter and group data based on the selected time range
  const getFilteredData = () => {
    const now = new Date();
    let filteredData = [];

    if (selectedTimeRange === "This Week") {
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);

      // Generate dates for each day in the week
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      filteredData = weekDays.map((day) => {
        const daySales = salesData
          .filter(
            (sale) =>
              format(sale.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
          )
          .reduce((sum, sale) => sum + sale.totalAmount, 0);

        return { period: format(day, "EEE"), sales: daySales }; // Display "Sun", "Mon", etc.
      });
    } else if (selectedTimeRange === "This Month") {
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      filteredData = salesData
        .filter((sale) => sale.date >= monthStart && sale.date <= monthEnd)
        .reduce((acc, sale) => {
          const day = format(sale.date, "dd"); // Group by day
          acc[day] = (acc[day] || 0) + sale.totalAmount;
          return acc;
        }, {});

      return Object.keys(filteredData).map((day) => ({
        period: day, // Day of the month
        sales: filteredData[day],
      }));
    } else if (selectedTimeRange === "This Year") {
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);

      filteredData = salesData
        .filter((sale) => sale.date >= yearStart && sale.date <= yearEnd)
        .reduce((acc, sale) => {
          const month = format(sale.date, "MMM"); // Group by month
          acc[month] = (acc[month] || 0) + sale.totalAmount;
          return acc;
        }, {});

      return Object.keys(filteredData).map((month) => ({
        period: month, // Month (e.g., "Jan", "Feb")
        sales: filteredData[month],
      }));
    }

    return filteredData;
  };

  return (
    <>
      <motion.div
        className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-lg font-medium mb-4">Sales Overview</h2>

          <select
            className="dark:bg-gray-700 dark:text-white text-black rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="w-full h-80">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
            </div>
          ) : (
            <ResponsiveContainer>
              <AreaChart data={getFilteredData()}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#4b5563" : "#374151"}
                />
                <XAxis
                  dataKey={"period"}
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
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SalesOverviewChart;
