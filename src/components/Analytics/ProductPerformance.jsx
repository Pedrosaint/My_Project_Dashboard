// import React from 'react'
// import { motion } from "framer-motion";
// import { useContext } from "react";
// import { ThemeContext } from "../context/ContextTheme";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// const productPerformanceData = [
//   { name: "Product A", sales: 4200, revenue: 2400, profit: 2600 },
//   { name: "Product B", sales: 3000, revenue: 1400, profit: 2300 },
//   { name: "Product C", sales: 2000, revenue: 9400, profit: 2200 },
//   { name: "Product D", sales: 2700, revenue: 3400, profit: 2500 },
//   { name: "Product E", sales: 1800, revenue: 4800, profit: 2100 },
// ];

// const ProductPerformance = () => {
//     const { theme } = useContext(ThemeContext);

//     //-----Dark mode styles---------
//     const darkMode = theme === "dark";
//   return (
//     <>
//       <motion.div
//         className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6 }}
//       >
//         <h2 className="text-lg font-medium mb-4">Product Performance</h2>
//         <div style={{ width: "100%", height: 300 }}>
//           <ResponsiveContainer>
//             <BarChart data={productPerformanceData}>
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke={darkMode ? "#4b5563" : "#374151"}
//               />
//               <XAxis
//                 dataKey={"name"}
//                 stroke={darkMode ? "#d1d5db" : "#374151"}
//               />
//               <YAxis stroke={darkMode ? "#9ca3af" : "#374151"} />

//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: darkMode
//                     ? "rgba(31, 41, 55, 0.8)"
//                     : "rgba(255, 255, 255, 0.6)",
//                   borderColor: darkMode ? "#374151" : "#e5e7eb",
//                 }}
//                 itemStyle={{ color: darkMode ? "#e5e7eb" : "#374151" }}
//               />
//               <Legend />
//               <Bar dataKey="sales" fill="#6366f1" />
//               <Bar dataKey="revenue" fill="#8b5cf6" />
//               <Bar dataKey="profit" fill="#ec4899" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </motion.div>
//     </>
//   );
// }

// export default ProductPerformance


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../context/ContextTheme";
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

const ProductPerformance = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductPerformance = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const querySnapshot = await getDocs(ordersRef);

        // Object to aggregate sales data by product name
        const productSales = {};

        // Loop through each document in the orders collection
        querySnapshot.forEach((doc) => {
          const order = doc.data();
          const cartItems = order.cartItems || []; // Access the array of cart items

          // Loop through each item in cartItems
          cartItems.forEach((item) => {
            const { name, price, quantity } = item;

            // Ensure name, price, and quantity are valid
            if (name && price && quantity) {
              // Parse the price to remove formatting (e.g., currency symbols)
              const parsedPrice = parseFloat(price.replace(/[^\d.-]/g, ""));
              const totalAmount = parsedPrice * quantity;

              // Initialize or update the sales data for this product
              if (!productSales[name]) {
                productSales[name] = { name, sales: 0 };
              }
              productSales[name].sales += totalAmount;
            }
          });
        });

        // Convert aggregated sales data into an array for the chart
        const formattedData = Object.values(productSales);
        setProductData(formattedData);
      } catch (error) {
        console.error("Error fetching product performance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductPerformance();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (productData.length === 0) {
    return <div>No data available to display.</div>;
  }

  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="text-lg font-medium mb-4">Product Performance</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={productData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#4b5563" : "#374151"}
            />
            <XAxis dataKey="name" stroke={darkMode ? "#d1d5db" : "#374151"} />
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
            <Bar dataKey="sales" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProductPerformance;
