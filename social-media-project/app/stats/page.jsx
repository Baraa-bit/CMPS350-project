"use client";
import { useState, useEffect } from "react";
import StatItem from "@/components/StatItem";

function Status() {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    // Fetch stats data from API and update state
    fetch("http://localhost:3000/api/stats")
      .then((response) => response.json())
      .then((data) => {
        //Update state with fetched data
        setStatsData(data);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  useEffect(() => {
    console.log("statsData: ", statsData);
  }, [statsData]);

  return (
    <div>
      <StatItem label="get Average Posts Per User" value={statsData?.getAveragePostsPerUser ?? 0} />
      <StatItem label="get Most Liked Post" value={statsData?.getMostLikedPost ?? 0} />
      <StatItem label="get Most Commented Post" value={statsData?.getMostCommentedPost ?? 0} />
      <StatItem label="get Top Frequent Words" value={statsData?.getTopFrequentWords ?? 0} />
      <StatItem label="get Total Counts" value={statsData?.getTotalCounts ?? 0} />
      <StatItem label="get Users With Most Followers" value={statsData?.getUsersWithMostFollowers ?? 0} />






      
    </div>
  );
}

export default Status;