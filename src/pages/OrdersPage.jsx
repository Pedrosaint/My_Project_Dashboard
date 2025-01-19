import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, ShoppingBag } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/Firebase"; 


import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/Orders/DailyOrders";
import OrderDistribution from "../components/Orders/OrderDistribution";
import OrdersTable from "../components/Orders/OrdersTable";

const OrdersPage = () => {
 const [isLoading, setIsLoading] = useState(true);
 const [orderStats, setOrderStats] = useState({
   totalOrders: 0,
   pendingOrders: 0,
   completedOrders: 0,
   totalRevenue: "0",
 });

 useEffect(() => {
   const fetchOrders = async () => {
     try {
       const querySnapshot = await getDocs(collection(db, "orders"));
       let totalOrders = 0;
       let pendingOrders = 0;
       let completedOrders = 0;
       let totalRevenue = 0;

       querySnapshot.forEach((doc) => {
         const order = doc.data();
         totalOrders += 1;

         if (order.status === "Pending") pendingOrders += 1;
         if (order.status === "Delivered") completedOrders += 1;

         // Parse the totalAmount to ensure it's a number
         if (order.totalAmount) {
           const amount = parseFloat(
             order.totalAmount.replace(/[^0-9.-]+/g, "")
           );
           if (!isNaN(amount)) {
             totalRevenue += amount;
           }
         }
       });

       setOrderStats({
         totalOrders,
         pendingOrders,
         completedOrders,
         totalRevenue: totalRevenue.toLocaleString("en-US", {
           style: "currency",
           currency: "NGN",
         }), // Format as Nigerian Naira currency
       });
     } catch (error) {
       console.error("Error fetching orders:", error);
     } finally {
       setIsLoading(false);
     }
   };

   fetchOrders();
 }, []);


  return (
    <div className="flex-1 relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* ORDERS STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Orders"
            icon={ShoppingBag}
            value={
              isLoading ? "Loading..." : orderStats.totalOrders.toLocaleString()
            }
            color="#6366f1"
            isLoading={isLoading}
          />
          <StatCard
            name="Pending Orders"
            icon={Clock}
            value={
              isLoading
                ? "Loading..."
                : orderStats.pendingOrders.toLocaleString()
            }
            color="#10b981"
            isLoading={isLoading}
          />
          <StatCard
            name="Completed Orders"
            icon={CheckCircle}
            value={
              isLoading
                ? "Loading..."
                : orderStats.completedOrders.toLocaleString()
            }
            color="#f59e0b"
            isLoading={isLoading}
          />
          <StatCard
            name="Total Revenue"
            icon={TbCurrencyNaira}
            value={isLoading ? "Loading..." : orderStats.totalRevenue}
            color="#ef4444"
            isLoading={isLoading}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyOrders />
          <OrderDistribution />
        </div>

        <OrdersTable />
      </main>
    </div>
  );
};

export default OrdersPage;
