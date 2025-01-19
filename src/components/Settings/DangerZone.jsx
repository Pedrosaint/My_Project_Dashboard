import React from "react";
import { motion } from "framer-motion";
import { Trash2Icon } from "lucide-react";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DangerZone = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        toast.error("No authenticated user found. Please log in again.");
        return;
      }

      const userId = user.uid; // Extract user ID

      console.log("Deleting Firestore document for user ID:", userId);

      // Delete the user document from Firestore
      const userDocRef = doc(db, "Users", userId);
      await deleteDoc(userDocRef);

      // Delete the user account from Firebase Authentication
      await deleteUser(user);

      toast.success("Account deleted successfully.");
      navigate("/LoginLayout"); // Redirect after successful deletion
    } catch (error) {
      console.error("Error deleting account:", error);

      if (error.code === "auth/requires-recent-login") {
        toast.error("You need to log in again to delete your account.");
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <motion.div
      className="dark:bg-red-900 bg-red-300 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border dark:border-red-700 border-gray-300 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <Trash2Icon className="text-red-400 mr-3" size={24} />
        <h2 className="text-xl font-semibold">Danger Zone</h2>
      </div>

      <p className="mb-4">
        Permanently delete your account and all of your content.
      </p>

      <button
        onClick={handleDeleteAccount}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Delete Account
      </button>
    </motion.div>
  );
};

export default DangerZone;
