import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../Firebase"; // Make sure your Firebase config is properly imported
import { ThemeContext } from "../context/ContextTheme";
import ReactLoading from "react-loading";

// Define color scheme for the chart
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const SalesByCategoryChart = () => {
  const [salesByCategoryData, setSalesByCategoryData] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);

  //-----Dark mode styles---------
  const darkMode = theme === "dark";

  useEffect(() => {
    const fetchSalesByCategory = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const categoryData = {};

        ordersSnapshot.forEach((doc) => {
          const order = doc.data();

          // Extract category and price
          const category = order.cartItems?.[0]?.name || "Others"; // Adjust based on your Firestore structure
          let price = order.totalAmount;

          // Safely handle undefined or improperly formatted price
          if (typeof price === "string") {
            price = parseFloat(price.replace(/[^\d.-]/g, ""));
          } else if (typeof price !== "number") {
            price = 0; // Default to 0 if price is invalid
          }

          // Add the price to the appropriate category
          if (category in categoryData) {
            categoryData[category] += price;
          } else {
            categoryData[category] = price;
          }
        });

        // Convert grouped data to array format for Recharts
        const formattedData = Object.keys(categoryData).map((category) => ({
          name: category,
          value: categoryData[category],
        }));

        setSalesByCategoryData(formattedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesByCategory();
  }, []);

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>

      <div style={{ width: "100%", height: 300 }}>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={salesByCategoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {salesByCategoryData.map((entry, index) => (
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

export default SalesByCategoryChart;
