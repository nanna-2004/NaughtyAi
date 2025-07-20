import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { adminDb, adminStorage } from "@/lib/firebaseAdmin";
import * as mm from 'music-metadata';
import axios from 'axios';
import { FieldValue } from "firebase-admin/firestore"; // Import FieldValue for incrementing

const GEMINI_MODEL = "gemini-1.5-flash-latest";
const IMAGEN_MODEL = "imagen-3.0-generate-002";

function getGoogleVoice(voiceName) {
  const voiceMap = {
    am_michael: { languageCode: "en-US", name: "en-US-Standard-D", ssmlGender: "MALE" },
    af_jessica: { languageCode: "en-US", name: "en-US-Standard-C", ssmlGender: "FEMALE" },
    am_adam: { languageCode: "en-AU", name: "en-AU-Standard-B", ssmlGender: "MALE" },
    af_aoede: { languageCode: "en-GB", name: "en-GB-Standard-A", ssmlGender: "FEMALE" },
    "aura-helios-en": { languageCode: "en-US", name: "en-US-Wavenet-D", ssmlGender: "MALE" },
    "aura-athena-en": { languageCode: "en-US", name: "en-US-Wavenet-F", ssmlGender: "FEMALE" },
  };
  return voiceMap[voiceName] || voiceMap["am_michael"];
}

async function uploadBufferToStorage(buffer, contentType, filePath) {
  const bucket = adminStorage.bucket();
  const file = bucket.file(filePath);
  await file.save(buffer, { metadata: { contentType } });
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
}

export const GenerateVideoData = inngest.createFunction(
  { id: "generate-video-data-google-stack", retries: 2 },
  { event: "generate-video-data" },
  async ({ event, step }) => {
    const { script, videoStyle, voice, recordID, uid } = event.data;
    const { voiceover, scenes } = script;

    const videoAspectRatio = "16:9"; 

    try {
      // Step 1: Generate Audio
      const audioUrl = await step.run("GenerateAudioWithGoogle", async () => {
        const ttsClient = new TextToSpeechClient();
        const ttsRequest = {
          input: { text: voiceover },
          voice: getGoogleVoice(voice),
          audioConfig: { audioEncoding: "MP3" },
        };
        const [response] = await ttsClient.synthesizeSpeech(ttsRequest);
        const audioFilePath = `audio/${recordID}/${Date.now()}.mp3`;
        return uploadBufferToStorage(response.audioContent, "audio/mpeg", audioFilePath);
      });

      // Step 2: Get Audio Duration
      const durationInFrames = await step.run("GetAudioDuration", async () => {
        const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(audioResponse.data);

        const metadata = await mm.parseBuffer(audioBuffer, 'audio/mpeg');
        const durationInSeconds = metadata.format.duration;

        if (!durationInSeconds) {
            return 300;
        }
        return Math.ceil(durationInSeconds * 30);
      });

      // Step 3: Generate Captions
      const captions = await step.run("GenerateCaptionsWithGemini", async () => {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        const prompt = `Based on the following script, generate a timed array of words for video captions. The script is: "${voiceover}". Respond ONLY with a valid JSON array in this format: [{ "word": "Hello", "start": 0.5, "end": 0.9 }, ...].`;
        const result = await model.generateContent(prompt);
        const rawText = await result.response.text();
        const cleanText = rawText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanText);
      });

      // Step 4: Generate Images
      const imageUrls = await step.run("GenerateImagesWithImagen", async () => {
        const imagePromises = scenes.map(async (prompt, index) => {
          try {
            const payload = { 
              instances: [{ prompt: `${prompt}, ${videoStyle}, cinematic, high detail` }], 
              parameters: { "sampleCount": 1, "aspectRatio": videoAspectRatio }
            };
            const apiKey = process.env.GEMINI_API_KEY;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
              const imageBuffer = Buffer.from(result.predictions[0].bytesBase64Encoded, "base64");
              const imageFilePath = `images/${recordID}/${Date.now()}_${index}.png`;
              return uploadBufferToStorage(imageBuffer, "image/png", imageFilePath);
            }
            return null;
          } catch (e) { 
            console.error(`Error generating image for scene ${index}:`, e);
            return null; 
          }
        });
        const resolvedUrls = await Promise.all(imagePromises);
        return resolvedUrls.filter(url => url !== null);
      });

      // Step 5: Update Firestore record for video
      await step.run("UpdateFirestoreVideoRecord", async () => {
        const videoDocRef = adminDb.collection("videos").doc(recordID);
        await videoDocRef.update({
          audioUrl,
          captions,
          images: imageUrls,
          durationInFrames,
          aspectRatio: videoAspectRatio,
          status: "completed",
        });
      });

      // Step 6: Deduct credit for the user
      await step.run("DeductUserCreditVideo", async () => {
        const userDocRef = adminDb.collection("users").doc(uid);
        await userDocRef.update({
          freeProjectsRemaining: FieldValue.increment(-1) // Decrement by 1
        });
      });

      return { success: true, message: "Video assets generated successfully and credit deducted." };

    } catch (error) {
      console.error("❌ A critical error occurred during video generation:", error);
      const videoDocRef = adminDb.collection("videos").doc(recordID);
      await videoDocRef.update({ status: "failed", error: error.message });
      throw error;
    }
  }
);

export const GenerateImageData = inngest.createFunction(
    { id: "generate-image-data-google", retries: 2 },
    { event: "generate-image-data" },
    async ({ event, step }) => {
        const { prompt, selectImageStyle, recordID, uid } = event.data;

        const imageAspectRatio = "16:9"; 

        try {
            const imageUrl = await step.run("GenerateSingleImageWithImagen", async () => {
                const fullPrompt = `${prompt}, ${selectImageStyle} style, high detail, cinematic`;
                const payload = {
                    instances: [{ prompt: fullPrompt }],
                    parameters: { "sampleCount": 1, "aspectRatio": imageAspectRatio }
                };
                const apiKey = process.env.GEMINI_API_KEY;
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
                    const imageBuffer = Buffer.from(result.predictions[0].bytesBase64Encoded, "base64");
                    const imageFilePath = `images/${recordID}/generated_image.png`;
                    return uploadBufferToStorage(imageBuffer, "image/png", imageFilePath);
                }
                throw new Error("Image generation failed to produce an image.");
            });

            await step.run("UpdateImageFirestoreRecord", async () => {
                const imageDocRef = adminDb.collection("images").doc(recordID);
                await imageDocRef.update({
                    imageUrl: imageUrl,
                    status: "completed",
                    aspectRatio: imageAspectRatio,
                });
            });

            await step.run("DeductUserCreditImage", async () => {
                const userDocRef = adminDb.collection("users").doc(uid);
                await userDocRef.update({
                    freeProjectsRemaining: FieldValue.increment(-1)
                });
            });

            return { success: true, imageUrl, message: "Image generated successfully and credit deducted." };

        } catch (error) {
            console.error("🛑 Error generating image:", error.message);
            const imageDocRef = adminDb.collection("images").doc(recordID);
            await imageDocRef.update({ status: "failed", error: error.message });
            throw error;
        }
    }
);

export const functions = [GenerateVideoData, GenerateImageData];
