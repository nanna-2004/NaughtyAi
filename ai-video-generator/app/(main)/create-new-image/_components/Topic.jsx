"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SparkleIcon } from "lucide-react";
import axios from "axios";
import { useAuthContext } from "@/app/_components/AuthContext"; // --- FIX 1: Import Auth Context

const suggestions = [
  "Epic History Reimagined",
  "Futuristic AI Dreams",
  "Terrifying Horror Scenes",
  "Magical Tales for Kids",
  "Anime Universe Builder",
  "Cartoon Crafter",
  "Hyper-Realistic Visuals",
  "Cinematic Action Scenes",
  "Fantasy Kingdoms & Creatures",
  "Romantic & Emotional Story Visuals",
  "Ghibli-Inspired Whimsy",
];

function Topic({ onHandleInputChange, isImagePage = false }) {
  const { user, rawUser } = useAuthContext(); // --- FIX 2: Get user and rawUser from context
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState("");

  const handleGenerateScript = async () => {
    if (!selectedTopic.trim()) {
      alert("Please select or enter a topic first.");
      return;
    }
    // --- FIX 3: Add client-side validation for login and credits ---
    if (!rawUser) {
      alert("You must be logged in to generate a script.");
      return;
    }
    if (user && user.freeProjectsRemaining <= 0) {
      alert("You have no credits left. Please purchase credit to generate new scripts.");
      return;
    }
    // --- End of Fix 3 ---

    setLoading(true);
    setError(null);
    try {
      // --- FIX 4: Get auth token and add it to the request headers ---
      const token = await rawUser.getIdToken();
      const response = await axios.post(
        "/api/generate-script",
        {
          topic: selectedTopic,
          isForImage: isImagePage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // --- End of Fix 4 ---

      const generatedScripts = response.data.scripts || [];
      setScripts(generatedScripts);
      if (generatedScripts.length > 0) {
        setSelectedScript(generatedScripts[0]);
        onHandleInputChange("script", generatedScripts[0]);
      }
    } catch (err) {
      console.error("API Error:", err);
      // --- FIX 5: Better error handling ---
      if (err.response?.status === 403) {
        setError("You don't have enough credits to generate a script.");
      } else {
        setError(err.response?.data?.error || "Failed to generate script");
      }
      // --- End of Fix 5 ---
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-box">
      <div className="mt-4">
        <h2 className="sub-heading">🎨 Image Topic</h2>
        <p className="description-text">
          Select or enter a topic to guide your visual generation
        </p>

        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="tab-list">
            <TabsTrigger value="suggestions">✨ Suggestions</TabsTrigger>
            <TabsTrigger value="your_topic">📝 Your Topic</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`topic-button cursor-pointer ${
                    suggestion === selectedTopic ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedTopic(suggestion);
                    onHandleInputChange("topic", suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="your_topic">
            <div className="space-y-2">
              <h3 className="input-heading">Enter Your Own Topic</h3>
              <Input
                placeholder="E.g., A majestic dragon sleeping on a pile of gold"
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  onHandleInputChange("topic", e.target.value);
                }}
                className="text-input large"
              />
            </div>
          </TabsContent>
        </Tabs>

        {selectedTopic && (
          <div className="selected-topic-box mt-3">
            <p className="selected-topic-text">
              ✅ <strong>Selected Topic:</strong> {selectedTopic}
            </p>
          </div>
        )}
      </div>

      <Button
        className="mt-3"
        size="sm"
        onClick={handleGenerateScript}
        disabled={loading}
      >
        <SparkleIcon className="mr-2 h-4 w-4" />
        {loading ? "Generating..." : "Generate Script"}
      </Button>

      {error && (
        <div className="p-4 bg-red-100 text-red-600 rounded mt-4">
          {error}
        </div>
      )}

      {scripts.length > 0 && (
        <div className="mt-4 space-y-3">
          {scripts.map((script, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedScript(script);
                onHandleInputChange("script", script);
              }}
              className={`p-4 border rounded-md cursor-pointer bg-gray-100 dark:bg-gray-900 text-black dark:text-white ${
                selectedScript === script
                  ? "border-blue-500 border-2"
                  : "border-gray-300"
              }`}
            >
              <h3 className="font-semibold mb-2">
                📝 Prompt Option {index + 1}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {script}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Topic;