import React, { createContext, useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../Firebase"; 

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [notificationsViewed, setNotificationsViewed] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
        setOrderCount(fetchedOrders.length);
      },
      (error) => {
        console.error("Error fetching orders:", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const markNotificationsAsViewed = () => {
    setNotificationsViewed(true);
    setOrderCount(0); // Clear the notification count
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        orderCount,
        setOrderCount,
        notificationsViewed,
        markNotificationsAsViewed,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
