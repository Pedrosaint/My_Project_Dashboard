import React from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton"; // Ensure correct path
import SkeletonCard from "../SkeletonCard"; // Ensure correct path

const StatCard = ({ name, icon: Icon, value, color, isLoading }) => {
  return (
    <motion.div
      className="bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border dark:border-gray-700 border-gray-300"
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="px-4 py-5 sm:p-6">
        {isLoading ? (
          <>
            {/* Separate SkeletonCard for placeholder */}
            <SkeletonCard />
            {/* Separate Skeleton loader for the value */}
            <Skeleton
              height={30}
              width={55}
              style={{ borderRadius: "8px", marginTop: "", marginLeft: '10px' }}
            />
          </>
        ) : (
          <>
            <span className="flex items-center text-sm font-medium">
              <Icon size={20} className="mr-2" style={{ color }} />
              {name}
            </span>
            <p className="mt-1 text-3xl font-semibold">{value}</p>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
