import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ContextTheme";
import { motion } from "framer-motion";
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

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

const CategoryDistributionChart = () => {
  const { theme } = useContext(ThemeContext);
  const [categoryData, setCategoryData] = useState([]);
  const darkMode = theme === "dark";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "newproducts"));
        const products = querySnapshot.docs.map((doc) => doc.data());

        // Aggregate categories
        const categoryCount = products.reduce((acc, product) => {
          const category = product.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Transform into an array for the chart
        const data = Object.keys(categoryCount).map((category) => ({
          name: category,
          value: categoryCount[category],
        }));

        setCategoryData(data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4">Category Distribution</h2>
      <div className="h-80">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ReactLoading type="spin" color="#6366f1" height={50} width={50} />
          </div>
        ) : (
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <PieChart>
              <Pie
                data={categoryData}
                cx={"50%"}
                cy={"50%"}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
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

export default CategoryDistributionChart;
