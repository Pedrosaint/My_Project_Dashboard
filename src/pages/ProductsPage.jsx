import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Package, TrendingUp } from "lucide-react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { TbCurrencyNaira } from "react-icons/tb";
import { db } from "../components/Firebase";

import StatCard from "../components/common/StatCard";
import ProductsTable from "../components/products/ProductsTable";
import SalesTrendChart from "../components/products/SalesTrendChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";

const ProductsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalProducts: 0,
    topSelling: 0,
    lowStock: 0,
    totalRevenue: "0",
  });

  // Fetch product stats from the newproducts collection
  useEffect(() => {
    const unsubscribeProducts = onSnapshot(
      collection(db, "newproducts"),
      (snapshot) => {
        let totalProducts = 0;
        let topSelling = 0;
        let lowStock = 0;

        snapshot.forEach((doc) => {
          const product = doc.data();
          totalProducts += 1;
          if (product.stock && product.stock > 50) topSelling += 1;
          if (product.stock && product.stock < 50) lowStock += 1;
        });

        setStats((prevStats) => ({
          ...prevStats,
          totalProducts,
          topSelling,
          lowStock,
        }));
      }
    );

    return () => unsubscribeProducts(); // Cleanup listener for products
  }, []);

  // Fetch total revenue from the orders collection
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        let totalRevenue = 0;

        querySnapshot.forEach((doc) => {
          const order = doc.data();
          if (order.totalAmount) {
            const amount = parseFloat(
              order.totalAmount.replace(/[^0-9.-]+/g, "") // Strip unwanted characters
            );
            if (!isNaN(amount)) {
              totalRevenue += amount;
            }
          }
        });

        setStats((prevStats) => ({
          ...prevStats,
          totalRevenue: totalRevenue.toLocaleString("en-US", {
            style: "currency",
            currency: "NGN",
          }),
        }));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    fetchTotalRevenue();
  }, []);

  const handleAddNewProduct = () => {
    navigate("newProduct");
  };

  return (
    <div className="flex-1 relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {location.pathname === "/ProductsPage/newProduct" ? (
          <Outlet />
        ) : (
          <>
            {/* STATS */}
            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard
                name="Total Products"
                icon={Package}
                value={stats.totalProducts.toLocaleString()}
                color="#6366f1"
                isLoading={isLoading}
              />
              <StatCard
                name="Top Selling"
                icon={TrendingUp}
                value={stats.topSelling.toLocaleString()}
                color="#6366f1"
                isLoading={isLoading}
              />
              <StatCard
                name="Low Stock"
                icon={AlertTriangle}
                value={stats.lowStock.toLocaleString()}
                color="#ec4899"
                isLoading={isLoading}
              />
              <StatCard
                name="Total Revenue"
                icon={TbCurrencyNaira}
                value={isLoading ? "Loading..." : stats.totalRevenue}
                color="#10b981"
                isLoading={isLoading}
              />
            </motion.div>

            <motion.div
              className="flex justify-end items-center mb-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 2 }}
              transition={{ delay: 0.1 }}
            >
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-600"
                onClick={handleAddNewProduct}
              >
                Add new Product
              </button>
            </motion.div>

            {/* Table */}
            <ProductsTable />

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SalesTrendChart />
              <CategoryDistributionChart />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
