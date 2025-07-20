import React from "react";

export default function LoadingScreen() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Checking authentication...</p>
    </div>
  );
}
