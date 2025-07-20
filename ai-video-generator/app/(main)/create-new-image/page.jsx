'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Topic from './_components/Topic';
import ImageStyle from './_components/ImageStyle';
import PreviewImage from './_components/PreviewImage';
import { useAuthContext } from '@/app/_components/AuthContext';

function CreateNewImagePage() {
  const { user, rawUser } = useAuthContext();
  const [formData, setFormData] = useState({
    topic: '',
    script: '',
    selectImageStyle: '',
  });
  const [loading, setLoading] = useState(false);

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateImage = async () => {
    if (!formData.topic || !formData.script || !formData.selectImageStyle) {
      alert("Please provide a topic, generate a script, and select a style.");
      return;
    }
    if (!rawUser) {
      alert("You must be logged in to generate an image.");
      return;
    }

    // Client-side credit check for immediate feedback (optional but good UX)
    if (user && user.freeProjectsRemaining <= 0) {
      alert("You have no credits remaining. Please buy more credits to generate images.");
      return; // Block generation on client-side
    }

    setLoading(true);
    try {
      const token = await rawUser.getIdToken();

      const response = await axios.post("/api/generate-image-data", {
        topic: formData.topic,
        script: formData.script,
        selectImageStyle: formData.selectImageStyle,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle server-side credit response if the server blocked it
      if (response.status === 403 && response.data.message) {
        alert(response.data.message); // Display message like "No credits remaining."
      } else {
        alert("Image generation started! You can check the status on your dashboard.");
      }

    } catch (e) {
      console.error("Error generating image:", e);
      // Check for specific 403 (Forbidden) response from server for credit issues
      if (axios.isAxiosError(e) && e.response?.status === 403) {
        alert(e.response.data || "You have no credits remaining. Please buy more credits.");
      } else {
        alert("An error occurred while generating the image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Create New Image</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-7">
        <div className="md:col-span-2 p-6 border border-gray-300 rounded-xl h-[80vh] overflow-y-auto bg-white dark:bg-zinc-900">
          <Topic
            onHandleInputChange={onHandleInputChange}
            isImagePage={true}
          />
          <ImageStyle
            onHandleInputChange={onHandleInputChange}
            onGenerate={generateImage}
            loading={loading}
          />
        </div>
        <div className="md:col-span-1">
          <PreviewImage formData={formData} />
        </div>
      </div>
    </div>
  );
}
export default CreateNewImagePage;