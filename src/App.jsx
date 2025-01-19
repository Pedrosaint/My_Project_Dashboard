import React, {useContext} from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";


{/* Pages */}
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import { ToastContainer } from "react-toastify";


{/* Layouts */}
import  Layout  from "./components/Layout";
import LoginLayout from "./pages/LoginLayout";
import AddNewUser from "./components/Users/AddNewUser";
import AddNewProduct from "./components/products/AddNewProduct";
import EditProfileLayout from "./components/Settings/Profile/EditProfileLayout";


{ /*Protected Route*/ }
import ProtectedRoute from "./components/ProtectedRoute";

{/* Forget Password */}
import ForgotPassword from './components/ForgotPassword';

import { SkeletonTheme } from "react-loading-skeleton";
import { ThemeContext } from "../../EmX_ENT_dashboard/src/components/context/ContextTheme";
import NotificationPage from "./pages/NotificationPage";





  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="LoginLayout" element={<LoginLayout />} />

        <Route
          path="Profile"
          element={
            <ProtectedRoute>
              <EditProfileLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="reset"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="notification"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="ProductsPage" element={<ProductsPage />}>
            <Route path="newProduct" element={<AddNewProduct />} />
          </Route>
          <Route path="UsersPage" element={<UsersPage />}>
            <Route path="newUser" element={<AddNewUser />} />
          </Route>
          <Route path="SalesPage" element={<SalesPage />} />
          <Route path="OrdersPage" element={<OrdersPage />} />
          <Route path="AnalyticsPage" element={<AnalyticsPage />} />
          <Route path="SettingsPage" element={<SettingsPage />} />
        </Route>
      </>
    )
  );

const App = () => {
   const { theme } = useContext(ThemeContext);
   const darkMode = theme === "dark";
  return (
    <>
      
      <SkeletonTheme
        baseColor={darkMode ? "#131313" : "#C0C0C0"}
        highlightColor=" rgba(255, 255, 254, 0.9)"
      >
        <RouterProvider router={router} />
        <ToastContainer />
      </SkeletonTheme>
    </>
  );
};

export default App;
