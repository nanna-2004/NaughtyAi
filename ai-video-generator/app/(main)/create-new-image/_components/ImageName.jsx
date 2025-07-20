import React from "react";

function ImageName({ onHandleInputChange }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-black dark:text-white">📝 Image Name</h2>
      <input
        type="text"
        className="mt-2 w-full px-4 py-2 rounded border dark:bg-gray-900 dark:text-white"
        placeholder="Enter image name"
        onChange={(e) => onHandleInputChange("imageName", e.target.value)}
      />
    </div>
  );
}

export default ImageName;
