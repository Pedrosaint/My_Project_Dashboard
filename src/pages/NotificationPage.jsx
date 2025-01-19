import React, { useContext, useEffect } from "react";
import { OrderContext } from "../components/context/OrderContext";

const NotificationPage = () => {
  const { orders, markNotificationsAsViewed } = useContext(OrderContext);

  useEffect(() => {
    markNotificationsAsViewed(); // Mark notifications as viewed when the page is loaded
  }, [markNotificationsAsViewed]);

  if (orders.length === 0) {
    return <div> No new notifications.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 lg:px-8 mt-9 mb-7 rounded-md text-black dark:bg-gray-700 bg-gray-300 dark:text-white">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="border p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Customer:</strong> {order.customerName || "N/A"}
            </p>
            <p>
              <strong>Status: </strong>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Processing"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status || "NA"}
              </span>
            </p>
            <p>
              <strong>Date:</strong> {order.date || "Unknown"}
            </p>
            <p>
              <strong>Amount:</strong> {order.totalAmount || "Unknown"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
