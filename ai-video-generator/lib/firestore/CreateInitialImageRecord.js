import { db } from "@/app/Configs/firebaseConfig";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";



export async function CreateInitialImageRecord(uid, topic, selectImageStyle, scripts) {

  const ref = collection(db, "images");



  const docRef = await addDoc(ref, {

    uid,

    topic,

    selectImageStyle,

    scripts,

    createdAt: serverTimestamp(),

    status: "pending", // you will update to 'completed' or 'failed'

  });



  return docRef.id;

}


