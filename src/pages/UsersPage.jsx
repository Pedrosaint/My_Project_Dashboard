import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../components/Firebase";
import { UserCheck, UserIcon, UserPlus, UserX } from "lucide-react";

import StatCard from "../components/common/StatCard";
import UsersTable from "../components/Users/UsersTable";
import UserDemograpicsChart from "../components/Users/UserDemograpicsChart";
import UserActivityHeatmap from "../components/Users/UserActivityHeatmap";
import UserGrowthChart from "../components/Users/UserGrowthChart";

const UsersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // This helps track the current route
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    churnRate: 0,
  });

  // Fetch data from Firestore
  useEffect(() => {
    let totalUsers = 0;
    let newUsersToday = 0;
    let activeUsers = 0;
    let churnRateSum = 0;

    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];

    const processSnapshot = (snapshot) => {
      snapshot.forEach((doc) => {
        const user = doc.data();

        totalUsers += 1;

        // Check if user creation date is today
        if (user.createdAt?.toDate) {
          const createdAt = user.createdAt.toDate();
          const createdAtDateString = createdAt.toISOString().split("T")[0];

          if (createdAtDateString === todayDateString) {
            newUsersToday += 1;
          }
        }

        // Count active users
        if (user.isActive) {
          activeUsers += 1;
        }

        // Accumulate churn rate
        churnRateSum += user.churnRate || 0;
      });
    };

    // Listen to both collections
    const unsubscribeNewUsers = onSnapshot(
      collection(db, "newusers"),
      (snapshot) => {
        processSnapshot(snapshot);
        updateStats();
      }
    );

    const unsubscribeUsers = onSnapshot(collection(db, "Users"), (snapshot) => {
      processSnapshot(snapshot);
      updateStats();
    });

    // Function to update the stats state
    const updateStats = () => {
      setStats({
        totalUsers,
        newUsersToday,
        activeUsers,
        churnRate: churnRateSum / (totalUsers || 1),
      });
      setIsLoading(false);
    };

    // Cleanup listeners on unmount
    return () => {
      unsubscribeNewUsers();
      unsubscribeUsers();
    };
  }, []);

  const handleAddNewUser = () => {
    navigate("newUser");
  };

  return (
    <div className="flex-1 relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {location.pathname === "/UsersPage/newUser" ? (
          <Outlet /> // Only render AddNewUser content when on the newUser route
        ) : (
          <>
            {/* Main Users Page Content */}
            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard
                name="Total Users"
                icon={UserIcon}
                value={stats.totalUsers.toLocaleString()}
                color="#6366f1"
                isLoading={isLoading}
              />
              <StatCard
                name="New Users Today"
                icon={UserPlus}
                value={stats.newUsersToday.toLocaleString()}
                color="#10b981"
                isLoading={isLoading}
              />
              <StatCard
                name="Active Users"
                icon={UserCheck}
                value={stats.activeUsers.toLocaleString()}
                color="#f59e0b"
                isLoading={isLoading}
              />
              <StatCard
                name="Churn Rate"
                icon={UserX}
                value={`${stats.churnRate.toFixed(2)}%`}
                color="#ef4444"
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
                onClick={handleAddNewUser}
              >
                Add new User
              </button>
            </motion.div>

            <UsersTable />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <UserGrowthChart />
              <UserActivityHeatmap />
              <UserDemograpicsChart />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default UsersPage;
