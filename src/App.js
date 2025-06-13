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

