import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OPTIONS = ["A", "B", "C", "D", "E", "F"];

function App() {
  const [budget, setBudget] = useState(20);
  const [votes, setVotes] = useState({});
  const [results, setResults] = useState([]);
  const [userHasVoted, setUserHasVoted] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const isResultsOnly = params.has("results");

  useEffect(() => {
    const fetchVotes = async () => {
      const votesCol = collection(db, "votes");
      const votesSnapshot = await getDocs(votesCol);
      const voteList = votesSnapshot.docs.map((doc) => doc.data());

      const totals = {};
      voteList.forEach((vote) => {
        Object.entries(vote).forEach(([option, value]) => {
          totals[option] = (totals[option] || 0) + Number(value);
        });
      });

      const formatted = OPTIONS.map((option) => ({
        name: option,
        value: totals[option] || 0,
      }));

      setResults(formatted);
    };

    fetchVotes();
  }, [userHasVoted]);

  const handleChange = (option, value) => {
    const intValue = parseInt(value) || 0;
    const newVotes = { ...votes, [option]: intValue };
    const totalUsed = Object.values(newVotes).reduce((a, b) => a + b, 0);
    if (totalUsed <= budget) {
      setVotes(newVotes);
    }
  };

  const handleSubmit = async () => {
    const total = Object.values(votes).reduce((a, b) => a + b, 0);
    if (total !== budget) {
      alert(`You must allocate exactly ${budget} points.`);
      return;
    }
    try {
      await addDoc(collection(db, "votes"), votes);
      setUserHasVoted(true);
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("There was an error submitting your vote. Please try again.");
    }
  };

  const clearRankings = async () => {
    if (!window.confirm("Clear all votes?")) return;
    const snapshot = await getDocs(collection(db, "votes"));
    const deletes = snapshot.docs.map((d) => deleteDoc(doc(db, "votes", d.id)));
    await Promise.all(deletes);
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Budget Allocation Tool</h1>

      {userHasVoted ? (
        <p className="text-green-700 text-xl font-semibold mt-4">
          ✅ Thank you for your submission!
        </p>
      ) : (
        <>
          {OPTIONS.map((option) => (
            <div key={option} className="mb-2">
              <label className="mr-2">{option}:</label>
              <input
                type="number"
                min="0"
                max={budget}
                value={votes[option] || ""}
                onChange={(e) => handleChange(option, e.target.value)}
                className="border p-1 rounded"
              />
            </div>
          ))}
          <p className="mt-2">
            Remaining: {budget - Object.values(votes).reduce((a, b) => a + b, 0)}
          </p>

          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Vote
          </button>
        </>
      )}
    </div>
  );
}

export default App;

