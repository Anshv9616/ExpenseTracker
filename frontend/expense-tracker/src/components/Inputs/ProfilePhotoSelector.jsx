import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from "react-icons/lu"

// Component to select, preview, and remove a profile photo
const ProfilePhotoSelector = ({ image, setImage }) => {

  // Ref to programmatically trigger the hidden file input
  const inputRef = useRef(null);

  // Local state to store a preview URL for the selected image
  const [previewUrl, setPreviewUrl] = useState(null);

  // Triggered when the user selects an image from their device
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get first selected file
    if (file) {
      setImage(file); // Save the file in parent state

      // Create a temporary URL for preview purposes
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      console.log(preview); // Debug: logs the generated preview URL
    }
  };

  // Triggered when the user removes the selected image
  const handleRemoveImage = () => {
    setImage(null); // Clear image from parent state
    setPreviewUrl(null); // Remove preview
  };

  // Programmatically click the hidden file input
  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className='flex justify-center mb-6 items-center'>
      {/* Hidden file input (triggered by clicking the upload button) */}
      <input
        type="file"
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      {/* If no image is selected, show default avatar with upload button */}
      {!image ? (
        <div className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative'>
          {/* Default user icon */}
          <LuUser className="text-4xl text-primary" />

          {/* Upload button overlaid at bottom right */}
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-white rounded-full absolute -bottom-1 -right-1 bg-primary"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        /* If an image is selected, show the preview with remove button */
        <div className='relative'>
          <img
            src={previewUrl} // Temporary preview URL
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />

          {/* Remove button overlaid at bottom right */}
          <button
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
