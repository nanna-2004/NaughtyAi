"use client";
import React, { useState } from "react";
import Topic from "./_components/Topic";
import VideoStyle from "./_components/VideoStyle";
import Voice from "./_components/Voice";
import Captions from "./_components/Captions";
import { Button } from "@/components/ui/button";
import { Loader2Icon, WandSparkles } from "lucide-react";
import Preview from "./_components/Preview";
import axios from "axios";
import { useAuthContext } from "@/app/_components/AuthContext";

function CreateNewVideo() {
  const { user, rawUser } = useAuthContext(); // Destructure rawUser from context
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scripts, setScripts] = useState([]);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const handleGenerateScript = async () => {
    if (!formData.topic?.trim()) {
      alert("Please enter a topic first.");
      return;
    }
    setIsLoading(true);
    try {
      // Assuming generate script doesn't need a token, but if it does, use rawUser here too
      const res = await axios.post('/api/generate-script', { topic: formData.topic });
      const generatedScripts = res.data.scripts || [];
      setScripts(generatedScripts);
      if (generatedScripts.length > 0) {
        onHandleInputChange('script', generatedScripts[0]);
      }
    } catch (error) {
      console.error("Error generating script:", error);
      alert("Failed to generate scripts.");
    } finally {
      setIsLoading(false);
    }
  };

  const GenerateVideo = async () => {
    const requiredFields = ["topic", "script", "selectVideoStyle", "voice", "captionStyle"];
    if (requiredFields.some(field => !formData[field])) {
      alert("Please fill in all fields and select a script.");
      return;
    }
    // Check rawUser for login status
    if (!rawUser) {
      alert("You must be logged in.");
      return;
    }

    // Client-side credit check for immediate feedback
    if (user && user.freeProjectsRemaining <= 0) {
      alert("You have no credits remaining. Please buy more credits to generate a video.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await rawUser.getIdToken(); // Use rawUser here
      await axios.post(
        "/api/generate-video-data",
        {
          topic: formData.topic,
          script: formData.script,
          videoStyle: formData.selectVideoStyle,
          voice: formData.voice,
          captionStyle: formData.captionStyle,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Video generation started successfully!");
    } catch (error) {
      console.error("Error generating video:", error);
      // Handle the specific "out of credits" error from the backend
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        alert(error.response.data || "You have no credits remaining. Please buy more to generate a video.");
      } else {
        alert("An error occurred while generating the video.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Create New Video</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-7">
        <div className="md:col-span-2 p-6 border rounded-xl h-[80vh] overflow-y-auto bg-white dark:bg-zinc-900">
          <Topic onHandleInputChange={onHandleInputChange} generateScript={handleGenerateScript} loading={isLoading} />
          {scripts.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg mb-2">Select a Script</h3>
              {scripts.map((scriptOption, index) => (
                <div
                  key={index}
                  onClick={() => onHandleInputChange('script', scriptOption)}
                  className={`p-4 border-2 rounded-lg cursor-pointer ${JSON.stringify(formData.script) === JSON.stringify(scriptOption) ? 'border-blue-500' : 'border-gray-200'}`}
                >
                  <p className="font-semibold">Voiceover:</p>
                  <p className="text-gray-600">{scriptOption.voiceover}</p>
                </div>
              ))}
            </div>
          )}
          <VideoStyle onHandleInputChange={onHandleInputChange} />
          <Voice onHandleInputChange={onHandleInputChange} />
          <Captions onHandleInputChange={onHandleInputChange} />
        </div>
        <div className="md:col-span-1">
          <Preview formData={formData} />
          <Button onClick={GenerateVideo} disabled={isLoading || !formData.script} className='w-full mt-5'>
            {isLoading ? <Loader2Icon className="animate-spin" /> : "Generate Video"}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default CreateNewVideo;