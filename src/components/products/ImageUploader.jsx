import React, { useRef, useState } from "react";
import { FaFolder } from "react-icons/fa";
import cloudinaryUpload from "../CloudinaryUpload";

const ImageUploader = ({ onUpload, defaultImage }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultImage || "");

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await cloudinaryUpload(file); // Await the upload function to get the image URL
      setImageUrl(url); // Update the image URL state

      if (onUpload) {
        onUpload(url); // Pass the URL to the parent component (AddNewUser)
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload the image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex space-x-4 items-center">
        <span className="text-xl font-medium text-black dark:text-white">
          Image:
        </span>
        <div
          className="cursor-pointer bg-gray-500 dark:bg-blue-500 text-white p-2 rounded-full"
          onClick={handleIconClick}
        >
          <FaFolder size={24} />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
    </div>
  );
};

export default ImageUploader;
