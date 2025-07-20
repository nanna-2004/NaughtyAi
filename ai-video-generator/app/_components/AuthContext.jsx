// app/_components/AuthContext.jsx
'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/Configs/firebaseConfig";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // This will be the merged user data
  const [rawUser, setRawUser] = useState(null); // This will be the original firebase.User object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeAuth = () => {};
    let unsubscribeFirestore = () => {};

    unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setRawUser(firebaseUser); // Store the original firebase.User object
        const userRef = doc(db, "users", firebaseUser.uid);
        
        unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const firestoreData = docSnap.data();
            setUser({
              ...firebaseUser, // Keep Firebase Auth properties
              ...firestoreData, // Add/overwrite with Firestore properties
            });
          } else {
            console.log("New user detected, creating document with 5 credits...");
            setDoc(userRef, {
              name: firebaseUser.displayName || firebaseUser.email,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              freeProjectsRemaining: 5,
            }, { merge: true })
            .then(() => {
              setUser({
                ...firebaseUser,
                name: firebaseUser.displayName || firebaseUser.email,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                freeProjectsRemaining: 5,
              });
            })
            .catch(error => {
              console.error("Error creating new user document:", error);
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user document:", error);
          setUser(null);
          setRawUser(null); // Clear rawUser on error
          setLoading(false);
        });

      } else {
        // No firebaseUser (logged out)
        setUser(null);
        setRawUser(null); // Clear rawUser
        setLoading(false);
        unsubscribeFirestore();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  // Provide both 'user' (merged data) and 'rawUser' (for getIdToken)
  return (
    <AuthContext.Provider value={{ user, rawUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
