import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import ReactLoading from "react-loading";

const SalesOverviewChart = () => {
  const { theme } = useContext(ThemeContext);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const salesByMonth = {};

        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          const date = new Date(order.date); // Ensure `order.date` is a valid date string in your data
          const month = date.toLocaleString("default", { month: "short" });

          const amount = parseFloat(
            order.totalAmount?.replace(/[^0-9.-]+/g, "") || 0
          ); // Strip unwanted characters from amount

          if (!isNaN(amount)) {
            if (!salesByMonth[month]) {
              salesByMonth[month] = 0;
            }
            salesByMonth[month] += amount;
          }
        });

        // Create chart data
        const chartData = Object.keys(salesByMonth).map((month) => ({
          name: month,
          sales: salesByMonth[month],
        }));

        // Sort data by month order
        const monthOrder = [
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
        const sortedData = chartData.sort(
          (a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name)
        );

        setSalesData(sortedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      } 
    };

    fetchSalesData();
  }, []);

  // Dark mode styles
  const darkMode = theme === "dark";

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4">Sales Overview</h2>
      <div className="h-80">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
          ) : (
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={salesData}>
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
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;
