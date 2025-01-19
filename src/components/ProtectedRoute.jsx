import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../components/Firebase"; // Adjust the path based on your setup

const ProtectedRoute = ({ children }) => {
     const user = auth.currentUser;

     return user ? children : <Navigate to="/LoginLayout" />;
};

export default ProtectedRoute;


//=================================================================================
//   const isAuthenticated = !!auth.currentUser; // Check if the user is logged in

//   return (isAuthenticated ? children : <Navigate to="LoginLayout" />)
    


// import React from "react";
// import { Navigate } from "react-router-dom";
// import { auth } from "../components/Firebase"; // Adjust the path based on your setup

// const ProtectedRoute = ({ children, fallbackComponent: FallbackComponent }) => {
//   const user = auth.currentUser;

//   if (!user) {
//     return <Navigate to="LoginLayout" />;
//   }

//   return (
//     <>
//       {children}
//       {FallbackComponent && <FallbackComponent />}
//     </>
//   );
// };

// export default ProtectedRoute;
