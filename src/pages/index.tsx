import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import MapChart from "../components/MapChart";
import styles from "../styles/MapChart.module.css";

interface PastorInfo {
  id: string;
  name: string;
  state: string;
}

interface EngagementStats {
  totalEngagements: number;
  engagementPerState: Record<string, number>;
}

export default function Home() {
  const [pastorInfo, setPastorInfo] = useState<PastorInfo | null>(null);
  const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null);
  const pastorId = process.env.NEXT_PUBLIC_PASTOR_ID || "1";

  useEffect(() => {
    const fetchPastorInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pastors/${pastorId}`);
        const data = await response.json();
        setPastorInfo(data);
      } catch (error) {
        console.error('Error fetching pastor info:', error);
      }
    };

    const fetchEngagementStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pastors/${pastorId}/engagement-stats`);
        const data = await response.json();
        setEngagementStats(data);
      } catch (error) {
        console.error('Error fetching engagement stats:', error);
      }
    };

    fetchPastorInfo();
    fetchEngagementStats();
  }, [pastorId]);

  if (!pastorInfo || !engagementStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <Header
        name={pastorInfo.name}
        state={pastorInfo.state}
        totalEngagements={engagementStats.totalEngagements}
      />
      <div className={styles.mapWrapper}>
        <MapChart
          originState={pastorInfo.state}
          pastorId={pastorInfo.id}
          engagementPerState={engagementStats.engagementPerState}
        />
      </div>
    </div>
  );
}
