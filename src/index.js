// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// FocusMode.js
import React, { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function FocusMode({ user }) {
  const [homeworkText, setHomeworkText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!homeworkText.trim()) return alert("Please write your homework");

    try {
      const docRef = doc(db, "homework", user.uid);
      await setDoc(docRef, {
        studentId: user.uid,
        studentEmail: user.email,
        homeworkText,
        submittedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (e) {
      alert("Error submitting homework: " + e.message);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f0f0",
        userSelect: "none",
      }}
      tabIndex={-1}
      onContextMenu={(e) => e.preventDefault()}
    >
      <h2>Focus Mode</h2>
      {submitted ? (
        <p>Homework submitted! Good job! 🎉</p>
      ) : (
        <>
          <textarea
            rows={15}
            cols={50}
            placeholder="Write your homework here..."
            value={homeworkText}
            onChange={(e) => setHomeworkText(e.target.value)}
            style={{ fontSize: "16px", padding: "1rem" }}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", fontSize: "16px" }}
          >
            Submit Homework
          </button>
        </>
      )}
    </div>
  );
}


// App.js
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import FocusMode from "./FocusMode";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  if (!user) {
    return <p>Please log in to enter Focus Mode.</p>;
  }

  return <FocusMode user={user} />;
}

