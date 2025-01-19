// CloudinaryUpload.js
const cloudinaryUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "emmextella_ent"); // Replace with your upload preset
  formData.append("folder", "Dashboard/Adduser"); // Optional: specify folder

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/emmextella/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to upload image");
    }

    return data.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error; // Throw the error to be handled by the calling function
  }
};

export default cloudinaryUpload;
