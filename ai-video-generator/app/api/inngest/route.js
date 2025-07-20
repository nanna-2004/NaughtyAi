import { inngest } from "@/inngest/client";
// Import the entire 'functions' array from "@/inngest/functions"
// This array now contains both GenerateVideoData and GenerateImageData
import { functions } from "@/inngest/functions"; 
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  // Pass the imported 'functions' array directly
  functions: functions, 
});