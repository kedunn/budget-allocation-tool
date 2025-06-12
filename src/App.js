import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase"; // adjust path if needed
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [budget, setBudget] = useState(20);
  const [remaining, setRemaining] = useState(20);
  const [votes, setVotes] = useState({});
  const [results, setResults] = useState([]);
  const [userHasVoted, setUserHasVoted] = useState(false);

  // Check URL for results page
  const params = new URLSearchParams(window.location.search);
  const isResultsOnly = params.has("results");

  useEffect(() => {
    // Load votes from Firestore
    const fetchVotes = async () => {
      const votesCol = collection(db, "votes");
      const votesSnapshot = await getDocs(votesCol);
      const votesData = votesSnapshot.docs.map((doc) => doc.data());
      setResults(votesData);

      // If you want to accumulate votes into results, you can do that here
    };

    fetchVotes();
  }, []);

  const clearRankings = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all rankings? This cannot be undone."
      )
    )
      return;

    const votesCol = collection(db, "votes");
    const votesSnapshot = await getDocs(votesCol);
    const deletePromises = votesSnapshot.docs.map((d) =>
      deleteDoc(doc(db, "votes", d.id))
    );
    await Promise.all(deletePromises);

    alert("All rankings cleared!");
    setResults([]);
  };

  if (isResultsOnly) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Live Results</h1>

        <button
          onClick={clearRankings}
          className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear Rankings
        </button>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={results}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Your voting UI goes here for the main app (not results-only)
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Budget Allocation Tool</h1>
      {/* Your existing voting UI and logic */}
    </div>
  );
}

export default App;
