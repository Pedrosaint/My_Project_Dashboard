import React from "react";
import { toast } from "react-toastify";
import { auth } from "../components/Firebase"; // Ensure 'auth' is imported
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValue = e.target.email.value;

    try {
      await sendPasswordResetEmail(auth, emailValue);
      toast.success("Check your email to reset your password.", {
        position: "top-center",
      });
      navigate("/LoginLayout"); // Redirect to login page
    } catch (error) {
      console.error(error.message);
      toast.error("Error sending reset email. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-80">
        <h1 className="text-center text-2xl font-bold">Forgot Password</h1>
        <h3 className="text-center text-xl font-medium mb-4 text-gray-500">
          Reset Password!
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-300 text-gray-900 mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
