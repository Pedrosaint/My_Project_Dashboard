import React from "react";
import {
  BarChart2,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  LogOut,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./Firebase";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    color: "#6366f1",
    link: "/",
  },
  {
    name: "Products",
    icon: ShoppingBag,
    color: "#8b5cf6",
    link: "/ProductsPage",
  },
  {
    name: "Users",
    icon: Users,
    color: "#ec4899",
    link: "/UsersPage", // Base link for all nested routes under "Users"
  },
  {
    name: "Sales",
    icon: DollarSign,
    color: "#10b981",
    link: "/SalesPage",
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    color: "#f59e0b",
    link: "/OrdersPage",
  },
  {
    name: "Analytics",
    icon: TrendingUp,
    color: "#3b82f6",
    link: "/AnalyticsPage",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "#6ee7b7",
    link: "/SettingsPage",
  },
];

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation(); // Get the current route
  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    const user = auth.currentUser;

    if (user) {
      // Update Firestore to set isActive to false
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, { isActive: false });
    }

    // Sign the user out
    await signOut(auth);

    console.log("Logout Successful!");
    navigate("/LoginLayout"); // Redirect to the login page
  } catch (error) {
    console.error("Logout Error:", error);
    toast.error("Logout failed", {
      position: "top-center",
    });
  }
};

  return (
    <>
      {/* Sidebar for Large Screens */}
      <motion.div
        className={`relative z-10 transition-all duration-300 ease-in-out hidden md:block flex-shrink-0 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
      >
        <div className="h-full bg-opacity-50 backdrop-blur-md shadow-lg p-4 flex flex-col border-r dark:border-gray-700 border-gray-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
          >
            {isSidebarOpen ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
          </motion.button>

          <nav className="mt-8 flex-grow">
            {SIDEBAR_ITEMS.map((item) => {
              // Check if we're on a route that starts with any path
              const isActive =
                location.pathname === item.link ||
                (item.link === "/UsersPage" &&
                  location.pathname.startsWith("/UsersPage")) ||
                (item.link === "/ProductsPage" &&
                  location.pathname.startsWith("/ProductsPage"));
              

              return (
                <Link key={item.link} to={item.link}>
                  <motion.div
                    whileHover={{
                      scale: [1, 0.9, 1],
                      transition: {
                        duration: 0.9,
                        repeat: Infinity,
                        repeatType: "loop",
                      },
                    }}
                    className={`relative flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
                      isActive
                        ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                        : "dark:hover:bg-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-2 rounded-full h-11 m-1"
                        style={{ backgroundColor: item.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                    <item.icon
                      size={20}
                      style={{ color: item.color, minWidth: "20px" }}
                    />
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Link */}
          <div className="mt-auto">
            <Link to="/LoginLayout">
              <motion.div
                className="flex items-center p-4 text-sm font-medium rounded-lg dark:hover:bg-red-700 hover:bg-red-300 transition-colors mb-2"
                onClick={handleLogout}
              >
                <LogOut size={20} color="red" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Sidebar for Small Screens */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-30 w-64 dark:bg-gray-700 bg-gray-300 bg-opacity-50 backdrop-blur-md p-4 border-r border-gray-700 lg:hidden"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mt-8 flex-grow">
              {SIDEBAR_ITEMS.map((item) => {
                // Check if we're on a route that starts with the "Users" path
                const isActive =
                  location.pathname === item.link ||
                  (item.link === "/UsersPage" &&
                    location.pathname.startsWith("/UsersPage"));

                return (
                  <Link
                    key={item.link}
                    to={item.link}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <motion.div
                      className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
                        isActive
                          ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                          : "hover:bg-gray-600"
                      }`}
                    >
                      <item.icon
                        size={20}
                        style={{ color: item.color, minWidth: "20px" }}
                      />
                      <span className="ml-4">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Link */}
            <button
              className="mt-auto px-2 w-full hover:bg-red-700 transition-colors rounded-lg text-sm font-medium"
              onClick={handleLogout}
            >
              <div className="flex place-center py-3 px-3">
                <LogOut size={20} color="red" minWidth="20px" />
                <span className="ml-3">Logout</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
