import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/Firebase";
import { TbCurrencyNaira } from "react-icons/tb";

import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

const OverviewPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      try {
        // Fetch total sales
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        let totalRevenue = 0;
        let totalOrders = 0;

        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          totalOrders += 1; // Count each order
          if (order.totalAmount) {
            const amount = parseFloat(
              order.totalAmount.replace(/[^0-9.-]+/g, "") // Strip unwanted characters
            );
            if (!isNaN(amount)) {
              totalRevenue += amount;
            }
          }
        });

        setTotalSales(totalRevenue);

        // Fetch total users
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const userCount = usersSnapshot.size;
        setUserCount(userCount);

        // Calculate conversion rate
        const calculatedConversionRate =
          userCount > 0 ? (totalOrders / userCount) * 100 : 0;
        setConversionRate(calculatedConversionRate);

        // Fetch total products
        const productsSnapshot = await getDocs(collection(db, "newproducts"));
        setTotalProducts(productsSnapshot.size);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="flex-1 relative z-10">
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Total Sales"
              icon={Zap}
              value={`₦${totalSales.toLocaleString()}`}
              color="#6366f1"
              isLoading={isLoading}
            />
            <StatCard
              name="New Users"
              icon={Users}
              value={userCount}
              color="#6366f1"
              isLoading={isLoading}
            />
            <StatCard
              name="Total Products"
              icon={ShoppingBag}
              value={totalProducts}
              color="#ec4899"
              isLoading={isLoading}
            />
            <StatCard
              name="Conversion Rate"
              icon={BarChart2}
              value={`${conversionRate.toFixed(2)}%`}
              color="#10b981"
              isLoading={isLoading}
            />
          </motion.div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SalesOverviewChart />
            <CategoryDistributionChart />
            <SalesChannelChart />
          </div>
        </main>
      </div>
    </>
  );
};

export default OverviewPage;
