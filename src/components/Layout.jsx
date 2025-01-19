import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./common/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet"; // Import React Helmet

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation(); // To get the current route
  const [title, setTitle] = useState(""); // State to store page title

  // Function to determine active route for sidebar highlighting
  const isActive = (path) => location.pathname.startsWith(path);

  useEffect(() => {
    // Set the page title based on the current route
    switch (location.pathname) {
      case "/":
        setTitle("Dashboard");
        break;
      case "/ProductsPage":
        setTitle("Products");
        break;
      case "/UsersPage":
        setTitle("Users");
        break;
      case "/SalesPage":
        setTitle("Sales");
        break;
      case "/OrdersPage":
        setTitle("Orders");
        break;
      case "/AnalyticsPage":
        setTitle("Analytics");
        break;
      case "/SettingsPage":
        setTitle("Settings");
        break;
      case "/UsersPage/newUser":
        setTitle("New User");
        break;
      case "/ProductsPage/newProduct":
        setTitle("New Product");
        break;
      default:
        setTitle("Page Not Found");
    }
  }, [location.pathname]); // Update title when the route changes

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200 dark:bg-gray-900 text-gray-950 dark:text-gray-200">
      {/* Sidebar */}
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isActive={isActive} // Pass the isActive function to the Sidebar
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <Header title={title} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />

        {/* Update the browser title using React Helmet */}
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {/* Render the child routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
