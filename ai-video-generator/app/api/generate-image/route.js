import { db } from "@/app/Configs/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "firebase/auth";

const user = auth.currentUser;

if (user) {
  await addDoc(collection(db, "userContent"), {
    uid: user.uid,
    type: "image", // or "video", "audio"
    contentUrl: "https://your-cdn.com/image.jpg",
    timestamp: serverTimestamp(),
  });
}
