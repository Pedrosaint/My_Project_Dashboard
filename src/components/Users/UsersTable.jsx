import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import SkeletonCard from "../SkeletonCard";
import { db } from "../Firebase";
import { collection, onSnapshot, deleteDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import "react-loading-skeleton/dist/skeleton.css";
import { FaCamera } from "react-icons/fa";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for data
  const [delayed, setDelayed] = useState(true); // Delayed display state
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [viewUser, setViewUser] = useState(null);

  // Fetch data with real-time updates
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      collection(db, "Users"),
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch 'newusers' collection simultaneously
        const unsubscribeNewUsers = onSnapshot(
          collection(db, "newusers"),
          (newSnapshot) => {
            const newUsersData = newSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Combine both collections
            const combinedData = [...usersData, ...newUsersData];
            setUsers(combinedData);
            setFilteredUsers(combinedData);
            setLoading(false); // Set loading to false once data is fetched
            setTimeout(() => setDelayed(false), 2000); // 2-second delay for skeleton display
          },
          (error) => {
            console.error("Error fetching newusers:", error);
            setLoading(false);
          }
        );

        return () => unsubscribeNewUsers(); // Cleanup 'newusers' subscription
      },
      (error) => {
        console.error("Error fetching Users:", error);
        setLoading(false); // Set loading to false if there is an error
      }
    );

    return () => unsubscribeUsers(); // Cleanup 'Users' subscription
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term)
      )
    );
  };

  // Handle delete action
  const handleDelete = async (userId) => {
    try {
      // Attempt deletion in both collections
      await deleteDoc(doc(db, "Users", userId));
      await deleteDoc(doc(db, "newusers", userId));
      setUsers(users.filter((user) => user.id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle edit action
  const handleEdit = (user) => {
    setEditUser(user);
    setNewName(user.name);
    setNewEmail(user.email);
  };

  // Save updated user details
  const saveChanges = async () => {
    if (!editUser) return;
    try {
      // Update user in both collections if found
      await updateDoc(doc(db, "Users", editUser.id), {
        name: newName,
        email: newEmail,
      }).catch(() => {}); // Ignore errors if not found in 'Users'

      await updateDoc(doc(db, "newusers", editUser.id), {
        name: newName,
        email: newEmail,
      }).catch(() => {}); // Ignore errors if not found in 'newusers'

      // Update state
      setUsers(
        users.map((user) =>
          user.id === editUser.id
            ? { ...user, name: newName, email: newEmail }
            : user
        )
      );
      setFilteredUsers(
        filteredUsers.map((user) =>
          user.id === editUser.id
            ? { ...user, name: newName, email: newEmail }
            : user
        )
      );
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <motion.div
        className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Users..."
              className="dark:bg-gray-700 dark:text-white text-black placeholder:text-gray-800 dark:placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 my-4 sm:my-2"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-7 sm:top-5 dark:text-gray-400 text-gray-800"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-96 border-gray-300 dark:border-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="sticky top-0 z-10 dark:bg-gray-800 bg-gray-300 dark:text-gray-300 text-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading || delayed
                ? Array.from({ length: 7 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={5}>
                        <SkeletonCard />
                      </td>
                    </tr>
                  ))
                : filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name || user.fullName}
                                className="h-full w-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-700 dark:bg-gray-200 flex items-center justify-center rounded-full">
                                <span className="text-white dark:text-black text-sm font-bold">
                                  {user?.fullName?.charAt(0)?.toUpperCase() ||
                                    user?.firstName?.charAt(0)?.toUpperCase() ||
                                    "?"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {user.name || user.fullName || user.firstName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "Customer"
                              ? "bg-blue-800 text-green-100"
                              : "bg-purple-800 text-red-100"
                          }`}
                        >
                          {user.role || "Admin"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive
                              ? "bg-green-800 text-green-100"
                              : "bg-red-800 text-red-100"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap text-sm text-gray-300 flex space-x-1">
                        <button
                          onClick={() => setViewUser(user)}
                          className="p-2 text-blue-500 hover:text-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-indigo-400 hover:text-indigo-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/*--------------------Edit Users (modal)----------------------------------*/}
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Edit User
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new email"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/*--------------------View Users (modal)----------------------------------*/}

      {viewUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              User Details
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                {viewUser.image ? (
                  <img
                    src={viewUser.image}
                    alt={viewUser.name || viewUser.fullName}
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="bg-gray-500 text-white p-6 rounded-full">
                    <FaCamera size={50} />
                  </div>
                )}
              </div>
              <div>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Name:</span>{" "}
                  {viewUser.name || viewUser.fullName || viewUser.firstName}
                </p>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Email:</span>{" "}
                  {viewUser.email}
                </p>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Age:</span>
                  {viewUser.age || "No age"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewUser(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default UsersTable;