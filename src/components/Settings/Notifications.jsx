// import React, { useState, useEffect, useContext } from "react";
// import ToggleSwitch from "./ToggleSwitch";
// import SettingSection from "./SettingSection";
// import { Bell } from "lucide-react";
// import { onSnapshot, collection } from "firebase/firestore";
// import { db } from "../Firebase";
// import { OrderContext } from "../context/OrderContext";

// const Notifications = () => {
//   const { setOrderCount  } = useContext(OrderContext);
//   const [notifications, setNotifications] = useState({
//     push: true,
//     email: false,
//     sms: true,
//   });

//   useEffect(() => {
//    if (notifications.push) {
//      const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
//        setOrderCount(snapshot.size); // Update count in real-time
//      });

//      return () => unsubscribe(); // Clean up listener on unmount
//    } else {
//      setOrderCount(0);
//    }
//  }, [notifications.push, setOrderCount]);

//   return (
//     <>
//       <SettingSection icon={Bell} title={"Notification"}>
//         <ToggleSwitch
//           Label={"Push Notification"}
//           isOn={notifications.push}
//           onToggle={() =>
//             setNotifications({ ...notifications, push: !notifications.push })
//           }
//         />
//         <ToggleSwitch
//           Label={"Email Notification"}
//           isOn={notifications.email}
//           onToggle={() =>
//             setNotifications({ ...notifications, email: !notifications.email })
//           }
//         />
//         <ToggleSwitch
//           Label={"SMS Notification"}
//           isOn={notifications.sms}
//           onToggle={() =>
//             setNotifications({ ...notifications, sms: !notifications.sms })
//           }
//         />
//       </SettingSection>
//     </>
//   );
// };

// export default Notifications;





import React, { useState, useEffect, useContext } from "react";
import ToggleSwitch from "./ToggleSwitch";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../Firebase";
import { OrderContext } from "../context/OrderContext";

const Notifications = () => {
  const { setOrderCount } = useContext(OrderContext); // Ensure setOrderCount is properly passed
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
  });

  useEffect(() => {
    if (notifications.push) {
      const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
        setOrderCount(snapshot.size); // Update count in real-time
      });

      return () => unsubscribe(); // Clean up listener on unmount
    } else {
      setOrderCount(0); // Reset order count when notifications are disabled
    }
  }, [notifications.push, setOrderCount]);

  return (
    <SettingSection icon={Bell} title={"Notification"}>
      <ToggleSwitch
        Label={"Push Notification"}
        isOn={notifications.push}
        onToggle={() =>
          setNotifications({ ...notifications, push: !notifications.push })
        }
      />
      <ToggleSwitch
        Label={"Email Notification"}
        isOn={notifications.email}
        onToggle={() =>
          setNotifications({ ...notifications, email: !notifications.email })
        }
      />
      <ToggleSwitch
        Label={"SMS Notification"}
        isOn={notifications.sms}
        onToggle={() =>
          setNotifications({ ...notifications, sms: !notifications.sms })
        }
      />
    </SettingSection>
  );
};

export default Notifications;

