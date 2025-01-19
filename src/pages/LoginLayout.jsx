import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { EyeOff, Eye } from "lucide-react";
import {
  FaRegEnvelope,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLock } from 'react-icons/fi'
import Logo from "../assets/img/img_1.png";
import { auth, db } from '../components/Firebase';
import {doc, setDoc, updateDoc, getDoc} from 'firebase/firestore'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//-------------------------------------------------------------


const LoginLayout = () => {
 const [isLogin, setIsLogin] = useState(true);
 const [showPassword, setShowPassword] = useState(false);

 // User details
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [fname, setFname] = useState("");
 const [lname, setLname] = useState("");

 /*----------------- Function For Registration -----------------------*/
 const handleRegister = async (e) => {
   e.preventDefault();
   try {
     await createUserWithEmailAndPassword(auth, email, password);
     const user = auth.currentUser;

     if (user) {
       // Add user data to Firestore with "user" role
       await setDoc(doc(db, "Users", user.uid), {
         email: user.email,
         firstName: fname,
         lastName: lname,
         photo: "",
         createdAt: new Date(),
         role: "user", // Default role for all registered users
       });
     }

     console.log("User Registered Successfully!!");
     toast.success("User Registered Successfully!!", {
       position: "top-center",
     });
     setIsLogin(true); // Switch to the login form after registration
   } catch (error) {
     console.error(error.message);
     toast.error("Already a User", {
       position: "top-center",
     });
   }
 };

 /*----------------- Function For Login -----------------------*/
 const navigate = useNavigate();

 const handleLogin = async (e) => {
   e.preventDefault();
   try {
     // Log in the user
     const userCredential = await signInWithEmailAndPassword(
       auth,
       email,
       password
     );
     const user = userCredential.user;

     if (user) {
       const userRef = doc(db, "Users", user.uid);

       // Check user role in Firestore
       const docSnap = await getDoc(userRef);
       if (docSnap.exists()) {
         const userData = docSnap.data();

         if (userData.role === "Admin") {
           toast.success("Welcome Admin!", { position: "top-center" });
           navigate("/"); // Redirect admins to the dashboard
         } else {
           toast.error("Sorry User you're not an Adnin!", { position: "top-center" });
           navigate("/LoginLayout"); 
         }
       } else {
         // Handle case where user doesn't have a Firestore document
         await setDoc(userRef, {
           email: user.email,
           isActive: true,
           createdAt: new Date(),
           role: "user",
         });
         toast.error("Sorry User you're not an Adnin!", {
           position: "top-center",
         });
         navigate("/LoginLayout");
       }
     }

     console.log("Login Successful!");
   } catch (error) {
     console.error("Login Error:", error.message);
     toast.error("Login failed", { position: "top-center" });
   }
 };

 /*----------------- Function For Google Login -----------------------*/
 const googleLogin = async () => {
   const provider = new GoogleAuthProvider();
   try {
     const result = await signInWithPopup(auth, provider);
     const user = result.user;

     if (user) {
       const userRef = doc(db, "Users", user.uid);

       // Add or update user data in Firestore
       const userDoc = await getDoc(userRef);
       if (!userDoc.exists()) {
         // New Google user gets the "user" role by default
         await setDoc(userRef, {
           email: user.email,
           firstName: user.displayName || "",
           lastName: "",
           photo: user.photoURL || "",
           role: "user", // Default role for Google users
           isActive: true,
         });
       }

       const userData = userDoc.data();
       if (userData && userData.role === "Admin") {
         toast.success("Welcome Admin!", { position: "top-center" });
         navigate("/"); // Redirect admins to the dashboard
       } else {
         toast.error("Sorry User you're not an Adnin!", {
           position: "top-center",
         });
         navigate("/LoginLayout"); // Redirect regular users to the home page
       }
     }
   } catch (error) {
     console.error("Google Login Error:", error);
     toast.error("Google Login failed", { position: "top-center" });
   }
 };


    //-------------------- Reset Password ------------------------>
   const resetPassword = () => {
      navigate('/reset')
    }
   

    // ----Toggle between Login and Signup forms---->
    const toggleForm = () => {
      setIsLogin(!isLogin);
    };

    // -----Toggle the visibility of the password----->
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="w-full max-w-md p-4">
            <img
              src={Logo}
              alt=""
              className="w-24 mx-auto mb-4 md:w-32 md:absolute md:-top-4 md:left-4"
            />

            <div className="bg-gray-800 text-white p-5 m-2 rounded-lg shadow-2xl ">
              <h2 className="text-2xl font-bold mb-2 text-center">
                {isLogin ? "Login" : "Sign Up"}
              </h2>
              <h3 className="text-center text-2xl font-medium mb-6 text-gray-500">
                {isLogin ? 'Welcome back!' : ''}
              </h3>
              {isLogin ? (
                // Login Form=------------------->
                <form className="space-y-4 p-4" onSubmit={handleLogin}>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <div className="flex items-center relative">
                      <FaRegEnvelope
                        color="gray"
                        size={17}
                        className="absolute left-2 top-1/2 transform -translate-y-[45%]"
                      />
                      <input
                        type="email"
                        name="email"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-gray-900"
                        placeholder="Enter your email"
                        style={{ textIndent: "20px" }}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="flex items-center">
                      <FiLock
                        color="gray"
                        size={17}
                        className="absolute left-2"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="text"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-gray-900"
                        placeholder="Enter your password"
                        style={{ textIndent: "20px" }}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 text-gray-400"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    Login
                  </button>
                  <button
                    className="text-gray-300 sm:ml-48 ml-36"
                    onClick={resetPassword}
                  >
                    Forgot passwod?
                  </button>
                </form>
              ) : (
                // Signup Form------------------------->
                <form className="space-y-4 p-3" onSubmit={handleRegister}>
                  <div className="flex flex-col sm:flex-row sm:gap-x-4">
                    <label className="block text-sm font-medium mb-2 sm:mb-0 sm:flex-1">
                      First Name
                      <input
                        type="text"
                        className=" w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-gray-900 mt-2"
                        placeholder="First Name"
                        onChange={(e) => setFname(e.target.value)}
                      />
                    </label>

                    <label className="block text-sm font-medium mb-1 sm:flex-1">
                      Last Name
                      <input
                        type="text"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-gray-900 mt-2"
                        placeholder="Last Name"
                        onChange={(e) => setLname(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <div className="flex items-center relative">
                      <FaRegEnvelope
                        color="gray"
                        size={17}
                        className="absolute left-2 top-1/2 transform -translate-y-[45%]"
                      />
                      <input
                        type="email"
                        name="email"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-gray-900 "
                        placeholder="Enter your email"
                        style={{ textIndent: "20px" }}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="flex items-center">
                      <FiLock
                        color="gray"
                        size={17}
                        className="absolute left-2"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="text"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-gray-900"
                        placeholder="Enter your password"
                        style={{ textIndent: "20px" }}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-2 text-gray-400"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Sign Up
                  </button>
                </form>
              )}

              {/* Social Signup Buttons */}
              <div className="">
                <p className="text-sm text-center text-gray-400">
                  or sign up with
                </p>
                <div className="flex  space-x-4  mt-4">
                  <button
                    className="bg-[#101030]  p-2 rounded-full hover:text-yellow-100 transition-colors flex items-center justify-center w-full"
                    onClick={googleLogin}
                  >
                    <FcGoogle size={25}/>
                    <span className="font-semibold text-xl ml-5">Continue with Google</span>
                  </button>
                  {/* <button className="bg-black text-white p-2 rounded-full hover:text-blue-300 transition-colors flex items-center justify-center">
                    <FaFacebook />
                  </button>
                  <button className="bg-black text-white p-2 rounded-full hover:text-gray-200 transition-colors flex items-center justify-center">
                    <FaGithub />
                  </button>
                  <button className="bg-black text-white p-2 rounded-full hover:text-gray-400 transition-colors flex items-center justify-center">
                    <FaApple />
                  </button> */}
                </div>
              </div>

              <p className="text-sm mt-6 text-center text-gray-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  className="text-blue-500 ml-2 hover:underline"
                  onClick={toggleForm}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>
            <Outlet />
          </div>
        </div>
      </>
    );
};

export default LoginLayout;
