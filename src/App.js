import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // assumes Firebase setup
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const OPTIONS = ['Pitch 1', 'Pitch 2', 'Pitch 3', 'Pitch 4', 'Pitch 5', 'Pitch 6'];

export default function App() {
  const [allocations, setAllocations] = useState(Array(6).fill(0));
  const [total, setTotal] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const isResultsOnly = window.location.search.includes('results');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'votes'), (snapshot) => {
      const totals = Array(6).fill(0);
      snapshot.forEach(doc => {
        const data = doc.data();
        data.allocations.forEach((val, i) => totals[i] += val);
      });
      const chartData = OPTIONS.map((label, i) => ({ name: label, value: totals[i] }));
      setResults(chartData);
    });
    return () => unsub();
  }, []);

  const handleChange = (index, value) => {
    const newAlloc = [...allocations];
    newAlloc[index] = parseInt(value) || 0;
    const newTotal = newAlloc.reduce((a, b) => a + b, 0);
    if (newTotal <= 20) {
      setAllocations(newAlloc);
      setTotal(newTotal);
    }
  };

  const handleSubmit = async () => {
    await addDoc(collection(db, 'votes'), { allocations });
    setSubmitted(true);
  };

  if (isResultsOnly) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Live Results</h1>
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
      <h1 className="text-3xl font-bold mb-4">Allocate Your $20</h1>
      {!submitted ? (
        <div>
          {OPTIONS.map((label, i) => (
            <div key={i} className="mb-4">
              <label className="block text-lg mb-1">{label}: ${allocations[i]}</label>
              <input
                type="number"
                min="0"
                max="20"
                value={allocations[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
          <div className="mt-4">
            <p className="mb-2 font-semibold">Total: ${total} / $20</p>
            <button
              onClick={handleSubmit}
              disabled={total !== 20}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl">Thanks for submitting!</h2>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Live Results</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={results}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}