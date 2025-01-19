import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { db } from "../Firebase";
import { collection, addDoc } from "firebase/firestore";
import ImageUploader from "../../components/products/ImageUploader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import cloudinaryUpload from "../CloudinaryUpload";

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    size: "",
    colors: "",
    image: "", // Initially empty until the image is uploaded
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading

    if (!formData.image) {
      toast.error("Please upload an image before submitting!");
      return;
    }

    // Convert stock to a number
    const numericStock = Number(formData.stock);
    if (isNaN(numericStock) || numericStock < 0) {
      toast.error("Please enter a valid number for stock!");
      return;
    }

    try {
      // Step 1: Upload image to Cloudinary
      const uploadedImageUrl = await cloudinaryUpload(formData.image); // Assuming formData.image holds the file object
      if (!uploadedImageUrl) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      // Step 2: Save user data to Firestore with the Cloudinary image URL
      await addDoc(collection(db, "newproducts"), {
        ...formData,
        stock: numericStock, // Save stock as a number
        image: uploadedImageUrl, // Replace the image field with the uploaded URL
        createdAt: new Date(), // Use Firebase server timestamp for consistency
      });

      console.log("Product added successfully!");
      toast.success("Product added successfully!");

      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        size: "",
        colors: "",
        image: "", // Reset the image field
      });

      navigate("/ProductsPage");
    } catch (error) {
      console.error("Error adding Product: ", error);
      toast.error("Failed to add Product!");
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-900 text-gray-950 dark:text-gray-200 h-auto">
      <div className="flex flex-col items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-12 mt-8 w-full max-w-7xl space-y-6 overflow-y-auto"
        >
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center justify-center sm:w-1/3 p-4 sm:p-8">
              {formData.image ? (
                <img
                  src={
                    typeof formData.image === "string"
                      ? formData.image
                      : URL.createObjectURL(formData.image)
                  }
                  alt="Uploaded"
                  className="w-32 h-32 object-cover rounded-full"
                />
              ) : (
                <div className="dark:bg-blue-500 bg-gray-500 text-gray-400 dark:text-white p-6 rounded-3xl">
                  <FaCamera size={100} />
                </div>
              )}
            </div>

            {/* User Information Inputs */}
            <div className="flex-1 grid grid-cols-1 gap-6 p-4 sm:p-8">
              <ImageUploader
                onUpload={(file) => setFormData({ ...formData, image: file })}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Name"
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Category"
              />
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Size"
              />
            </div>

            <div className="flex-1 grid grid-cols-1 gap-6 p-4 sm:p-8">
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Price"
              />
              <input
                type="text"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Stock"
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Description"
              />
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Colors"
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 text-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProduct;
