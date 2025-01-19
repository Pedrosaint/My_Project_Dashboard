import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { EyeOff, Eye } from "lucide-react";
import { db } from "../Firebase";
import { collection, addDoc } from "firebase/firestore";
import ImageUploader from "../../components/Users/ImageUploader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import cloudinaryUpload from "../CloudinaryUpload";

const AddNewUser = () => {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    username: "",
    email: "",
    password: "",
    country: "",
    image: "", // Initially empty until the image is uploaded
  });

  // Function to calculate age based on birthDate
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

    //----------- Date of Birth--------------
    if (!birthDate) {
      alert("Please select a valid birth date.");
      return;
    }
    const age = calculateAge(birthDate); // Calculate age

    try {
      // Step 1: Upload image to Cloudinary
      const uploadedImageUrl = await cloudinaryUpload(formData.image); // Assuming formData.image holds the file object
      if (!uploadedImageUrl) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      // Step 2: Save user data to Firestore with the Cloudinary image URL
      await addDoc(collection(db, "newusers"), {
        ...formData,
        image: uploadedImageUrl, // Replace the image field with the uploaded URL
        createdAt: new Date(), // Use Firebase server timestamp for consistency
        birthDate: birthDate.toISOString(),
        age, // Add the calculated age to Firestore
      });

      console.log("User added successfully!");
      toast.success("User added successfully!");

      setFormData({
        name: "",
        phone: "",
        address: "",
        username: "",
        email: "",
        password: "",
        country: "",
        image: "", // Reset the image field
      });

      navigate("/UsersPage");
      setBirthDate(null);
    } catch (error) {
      console.error("Error adding user: ", error);
      toast.error("Failed to add user!");
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
                <div className="dark:bg-blue-500 bg-gray-500 text-gray-400 dark:text-white p-6 rounded-full">
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Phone Number"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Address"
              />
            </div>

            {/* Login Details */}
            <div className="flex-1 grid grid-cols-1 gap-6 p-4 sm:p-8">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent dark:text-white text-black outline-none w-full text-lg"
                placeholder="Email"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-b-2 border-gray-300 bg-transparent outline-none dark:text-white text-black w-full text-lg"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute right-2 text-gray-400"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <select
                name="country"
                placeholder="Select Country"
                value={formData.country}
                onChange={handleChange}
                className="border-b-2 border-gray-300 bg-transparent text-gray-900 dark:text-white dark:bg-gray-800 outline-none w-full text-lg"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="NG">Nigeria</option>
                <option value="IN">India</option>
                <option value="GB">United Kingdom</option>
              </select>

              <div className="">
                <DatePicker
                  selected={birthDate}
                  onChange={(date) => setBirthDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="border-b-2 border-gray-300 bg-transparent text-gray-900 dark:text-white dark:bg-gray-800 outline-none w-full text-lg"
                  maxDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={200}
                  placeholderText="Select your birth date"
                />
              </div>
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

export default AddNewUser;
