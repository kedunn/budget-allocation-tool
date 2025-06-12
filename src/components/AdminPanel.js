import React from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function AdminPanel() {
  const clearRankings = async () => {
    if (!window.confirm("Are you sure you want to clear all rankings?")) return;

    const votesCollection = collection(db, "votes");  // Replace "votes" with your collection name
    const snapshot = await getDocs(votesCollection);
    const deletePromises = snapshot.docs.map((document) =>
      deleteDoc(doc(db, "votes", document.id))
    );
    await Promise.all(deletePromises);

    alert("Rankings cleared!");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button
        onClick={clearRankings}
        style={{ backgroundColor: "red", color: "white", padding: "10px 15px", border: "none", cursor: "pointer" }}
      >
        Clear Rankings
      </button>
    </div>
  );
}

export default AdminPanel;
