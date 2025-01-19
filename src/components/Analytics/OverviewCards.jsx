import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Eye,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import SkeletonCard2 from "../SkeletonCard2"; // Ensure correct path
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase"; // Update with your Firebase config

const OverviewCards = ({ isLoading }) => {
  const [overviewData, setOverviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);

        // Fetch Revenue (sum of totalAmount from "orders" collection)
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        let totalRevenue = 0;
        ordersSnapshot.docs.forEach((doc) => {
          const order = doc.data();
          const amount = parseFloat(order.totalAmount.replace(/[^\d.]/g, "")); // Remove "₦" and parse as number
          totalRevenue += amount;
        });

        // Fetch Users (count of documents in "users" collection)
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const totalUsers = usersSnapshot.size;

        // Fetch Orders (count of documents in "orders" collection)
        const totalOrders = ordersSnapshot.size;

        // Page Views (placeholder, or fetch from a hypothetical "analytics" collection)
        const totalPageViews = 1234567; // Replace this with actual logic if available

        // Update state with fetched data
        setOverviewData([
          {
            name: "Revenue",
            value: `₦${totalRevenue.toLocaleString()}`,
            change: 12.5, // Placeholder for change percentage
            icon: DollarSign,
          },
          {
            name: "Users",
            value: totalUsers.toLocaleString(),
            change: 8.5, // Placeholder for change percentage
            icon: Users,
          },
          {
            name: "Orders",
            value: totalOrders.toLocaleString(),
            change: -3.5, // Placeholder for change percentage
            icon: ShoppingBag,
          },
          {
            name: "Page Views",
            value: totalPageViews.toLocaleString(),
            change: 15.5, // Placeholder for change percentage
            icon: Eye,
          },
        ]);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {loading || isLoading
        ? // Render SkeletonCard2 placeholders when loading
          overviewData.map((_, index) => (
            <div key={index}>
              <SkeletonCard2 />
            </div>
          ))
        : // Render actual data when loading is false
          overviewData.map((item, index) => (
            <motion.div
              key={item.name}
              className="bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="mt-1 text-xl font-semibold">{item.value}</p>
                </div>
                <div
                  className={`p-3 rounded-full bg-opacity-20 ${
                    item.change >= 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <item.icon
                    className={`size-6 ${
                      item.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  />
                </div>
              </div>
              <div
                className={`mt-4 flex items-center ${
                  item.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.change >= 0 ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowDownRight size={20} />
                )}
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(item.change)}%
                </span>
                <span className="ml-2 text-sm">vs last period</span>
              </div>
            </motion.div>
          ))}
    </div>
  );
};

export default OverviewCards;
