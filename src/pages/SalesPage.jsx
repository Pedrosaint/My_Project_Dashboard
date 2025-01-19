import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  ShoppingCart,
  TrendingUpDown,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/Firebase";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";

const SalesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [salesGrowth, setSalesGrowth] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      try {
        // Fetch total sales and orders
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        let revenue = 0;
        let totalOrders = 0;
        const orderDates = []; // Track order dates for sales growth

        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          totalOrders += 1;

          if (order.totalAmount) {
            const amount = parseFloat(
              order.totalAmount.replace(/[^0-9.-]+/g, "")
            );
            if (!isNaN(amount)) {
              revenue += amount;
            }
          }

          if (order.date) {
            orderDates.push(new Date(order.date));
          }
        });

        setTotalRevenue(revenue);
        setAverageOrderValue(totalOrders > 0 ? revenue / totalOrders : 0);

        // Fetch total users
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const userCount = usersSnapshot.size;

        // Calculate conversion rate
        setConversionRate(userCount > 0 ? (totalOrders / userCount) * 100 : 0);

        // Calculate sales growth (compare sales in recent period vs. earlier)
        if (orderDates.length > 0) {
          const recentOrders = orderDates.filter(
            (date) =>
              date >= new Date(new Date().setDate(new Date().getDate() - 30))
          ).length;
          const earlierOrders = totalOrders - recentOrders;

          setSalesGrowth(
            earlierOrders > 0
              ? ((recentOrders - earlierOrders) / earlierOrders) * 100
              : recentOrders > 0
              ? 100
              : 0
          );
        }
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
              name="Total Revenue"
              icon={DollarSign}
              value={`₦${totalRevenue.toLocaleString()}`}
              color="#6366f1"
              isLoading={isLoading}
            />
            <StatCard
              name="Avg. Order Value"
              icon={ShoppingCart}
              value={`${averageOrderValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              color="#10b981"
              isLoading={isLoading}
            />
            <StatCard
              name="Conversion Rate"
              icon={TrendingUpDown}
              value={`${conversionRate.toFixed(2)}%`}
              color="#f59e0b"
              isLoading={isLoading}
            />
            <StatCard
              name="Sales Growth"
              icon={CreditCard}
              value={`${salesGrowth.toFixed(2)}%`}
              color="#ef4444"
              isLoading={isLoading}
            />
          </motion.div>

          {/* CHARTS */}

          <SalesOverviewChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <SalesByCategoryChart />
            <DailySalesTrend />
          </div>
        </main>
      </div>
    </>
  );
};

export default SalesPage;
