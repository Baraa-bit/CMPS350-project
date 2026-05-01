"use client";
import { useState, useEffect } from "react";
import StatItem from "@/components/StatItem";
import Header from "@/components/stats/Header";
import TotalsRow from "@/components/stats/TotalsRow";
import Stats from "@/components/stats/Stats";

function Page() {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    // Fetch stats data from API and update state
    fetch("http://localhost:3000/api/stats")
      .then((response) => response.json())
      .then((data) => {
        //Update state with fetched datas
        setStatsData(data);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  useEffect(() => {
    console.log("statsData: ", statsData);
  }, [statsData]);

  return (
    <div>
      <Stats data={statsData} />
    </div>
  );
}

export default Page;
