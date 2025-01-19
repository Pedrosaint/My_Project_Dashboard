import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../Firebase"; // Ensure this points to your Firebase setup
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore"; // Import onSnapshot
import { FaCamera } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonCard from "../SkeletonCard";
import { Edit, Search, Trash2, Eye } from "lucide-react";
import ImageUploader from "../products/ImageUploader";
import { toast } from "react-toastify";

const ProductsTable = () => {
  const [products, setProducts] = useState([]); 
  const [editProduct, setEditProduct] = useState(null); // Store product being edited
  const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
  const [searchTerm, setSearchTerm] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newSales, setNewSales] = useState("");
  const [newColors, setNewColors] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for data
  const [delayed, setDelayed] = useState(true); // Delayed display state


  // Fetch data and listen for real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "newproducts"),
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => {
          const product = {
            id: doc.id,
            ...doc.data(),
          };

          return product;
        });

        setProducts(productsData); // Update products state
        setFilteredProducts(productsData); // Sync filteredProducts initially
        setLoading(false); // Set loading to false once data is fetched
        setTimeout(() => setDelayed(false), 2000); // 2-second delay for skeleton display
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false if there is an error
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  // Handle delete action
  const handleDelete = async (productId) => {
    try {
      // Reference to the user document
      const productDoc = doc(db, "newproducts", productId);

      // Delete user from Firestore
      await deleteDoc(productDoc);

      // Update local state to remove the deleted user
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.filter((product) => product.id !== productId)
      );
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setEditProduct(product); // Set the product being edited
    setNewName(product.name);
    setNewCategory(product.category);
    setNewPrice(product.price);
    setNewStock(product.stock);
    setNewColors(product.colors);
    setNewSize(product.size);
    setNewImage(product.image);
    setNewDescription(product.description);
  };

  // Save updated product details
  const saveChanges = async () => {
    if (!editProduct) return;

    const numericStock = Number(newStock);

    if (isNaN(numericStock) || numericStock < 0) {
      toast.error("Please enter a valid number for stock!");
      return;
    }

    try {
      const productRef = doc(db, "newproducts", editProduct.id);
      await updateDoc(productRef, {
        name: newName,
        category: newCategory,
        price: newPrice,
        stock: numericStock, // Save stock as a number
        colors: newColors,
        size: newSize,
        description: newDescription,
        image: newImage || editProduct.image,
      });

      // Update local state for immediate UI update
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editProduct.id
            ? {
                ...product,
                name: newName,
                category: newCategory,
                price: newPrice,
                stock: numericStock, // Save stock as a number
                colors: newColors,
                size: newSize,
                description: newDescription,
                image: newImage || editProduct.image,
              }
            : product
        )
      );
      setFilteredProducts((prev) =>
        prev.map((product) =>
          product.id === editProduct.id
            ? {
                ...product,
                name: newName,
                category: newCategory,
                price: newPrice,
                stock: numericStock, // Save stock as a number
                colors: newColors,
                size: newSize,
                description: newDescription,
                image: newImage || editProduct.image,
              }
            : product
        )
      );

      setEditProduct(null); // Close modal
    } catch (error) {
      console.error("Error updating product:", error);
      alert("error")
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
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Product..."
              className="dark:bg-gray-700 dark:text-white text-black placeholder:text-gray-800 dark:placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 my-4 sm:my-2"
              onChange={handleSearch} // Call handleSearch when input changes
              value={searchTerm} // Display the current search term in the input field
            />
            <Search
              className="absolute left-3 top-7 sm:top-5 dark:text-gray-400 text-gray-800"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-96 border border-gray-300 dark:border-gray-700 rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="sticky top-0 z-10 dark:bg-gray-800 bg-gray-300 dark:text-gray-300 text-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {loading || delayed
                ? Array.from({ length: 8 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={6}>
                        <SkeletonCard />
                      </td>
                    </tr>
                  ))
                : filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <img
                                src={product.image || "/default-profile.png"} // Fallback to a default image if no image URL is provided
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{product.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{product.stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{product.description}</div>
                      </td>
                      <td className=" py-4 whitespace-nowrap text-sm text-gray-300 flex space-x-1">
                        <div className="relative group">
                          <button
                            onClick={() => setViewProduct(product)}
                            className="p-2 text-blue-500  hover:text-blue-600"
                          >
                            <Eye size={20} />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                            View
                          </span>
                        </div>
                        <div className="relative group">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-yellow-500 hover:text-yellow-600"
                          >
                            <Edit size={20} />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                            Edit
                          </span>
                        </div>
                        <div className="relative group">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-500  hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700  rounded opacity-0 group-hover:opacity-100">
                            Delete
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/*--------------------Edit Product (modal)----------------------------------*/}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-300 dark:bg-gray-800 p-8 mt-10 m-4 rounded-lg shadow-lg w-full max-w-4xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Edit Product
            </h3>
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-4">
                {newImage || editProduct.image ? (
                  <img
                    src={newImage || editProduct.image}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0"
                  />
                ) : (
                  <div className="dark:bg-blue-500 bg-gray-500 text-gray-400 dark:text-white p-6 rounded-full mb-4 sm:mb-0">
                    <FaCamera size={70} />
                  </div>
                )}
                <ImageUploader
                  onUpload={(url) => setNewImage(url)}
                  defaultImage={newImage || editProduct.image}
                />
              </div>

              {/* Form Fields */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-4 lg:flex-nowrap lg:space-x-6">
                <div className="w-full sm:w-[48%] lg:w-1/3">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Edit Category"
                  />
                </div>
                {/* <div className="w-full sm:w-[48%] lg:w-1/3"></div> */}
                <div className="w-full sm:w-[48%] lg:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new price"
                  />
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new stock"
                  />
                </div>
                {/* <div className="w-full sm:w-[48%] lg:w-1/3"></div> */}
                <div className="w-full sm:w-[48%] lg:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new size"
                  />
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={newColors}
                    onChange={(e) => setNewColors(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new color"
                  />
                </div>
                {/* <div className="w-full sm:w-[48%] lg:w-1/3"></div> */}
                <div className="w-full sm:w-[48%] lg:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new description"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 mb-14 flex justify-end space-x-4">
              <button
                onClick={() => setEditProduct(null)}
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

      {/*--------------------View Product (modal)----------------------------------*/}

      {viewProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Product Details
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                {viewProduct.image ? (
                  <img
                    src={viewProduct.image}
                    alt={viewProduct.name}
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
                  {viewProduct.name}
                </p>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Category:</span>{" "}
                  {viewProduct.category}
                </p>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Price:</span>
                  {viewProduct.price}
                </p>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Stock:</span>{" "}
                  {viewProduct.stock}
                </p>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Colors:</span>{" "}
                  {viewProduct.colors}
                </p>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Size:</span>{" "}
                  {viewProduct.size}
                </p>
                <p className="text-gray-800 dark:text-white p-3">
                  <span className="font-medium p-1">Description:</span>{" "}
                  {viewProduct.description}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewProduct(null)}
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
export default ProductsTable;