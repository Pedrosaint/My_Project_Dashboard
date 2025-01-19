// import React, { useContext } from "react";
// import { Menu } from "lucide-react";
// import ThemeToggle from "../../components/ThemeToggle";
// import { FaRegBell } from "react-icons/fa6";
// import { OrderContext } from "../context/OrderContext";
// import { useNavigate } from "react-router-dom";

// const Header = ({ title, setIsMobileSidebarOpen }) => {
//   const { orderCount } = useContext(OrderContext);
//   const navigate =  useNavigate()
//   const handleNotification = () => {
//     navigate("notification")
//   }

//   return (
//     <header className="sticky top-0 w-full bg-opacity-50 backdrop-blur-md shadow-lg border-b dark:border-gray-800 border-gray-300 z-20">
//       <div className="max-w-7xl mx-auto py-4 px-6 sm:px-6 lg:px-8 flex items-center justify-between">
//         <button
//           className="lg:hidden p-2 md:hidden sm:block top-3 left-3 z-20"
//           onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
//         >
//           <Menu size={24} />
//         </button>

//         <h1 className="text-2xl font-semibold">{title}</h1>

//         <div className="flex flex-row items-center space-x-3">
//           <div onClick={handleNotification} className="relative cursor-pointer">
//             <FaRegBell size={25} />
//             {orderCount > 0 && (
//               <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                 {orderCount}
//               </span>
//             )}
//           </div>
//           <ThemeToggle />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;




import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { FaRegBell } from "react-icons/fa6";
import { OrderContext } from "../../components/context/OrderContext";

const Header = ({ title, setIsMobileSidebarOpen }) => {
  const { orderCount, markNotificationsAsViewed } = useContext(OrderContext);
  const navigate = useNavigate();

  const handleNotification = () => {
    markNotificationsAsViewed(); // Mark notifications as viewed
    navigate("notification");
  };

  return (
    <header className="sticky top-0 w-full bg-opacity-50 backdrop-blur-md shadow-lg border-b dark:border-gray-800 border-gray-300 z-20">
      <div className="max-w-7xl mx-auto py-4 px-6 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          className="lg:hidden p-2 md:hidden sm:block top-3 left-3 z-20"
          onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>

        <h1 className="text-2xl font-semibold">{title}</h1>

        <div className="flex flex-row items-center space-x-3">
          <div className="relative cursor-pointer" onClick={handleNotification}>
            <FaRegBell size={25} />
            {orderCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {orderCount}
              </span>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
