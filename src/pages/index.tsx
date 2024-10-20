import React, { useState, useEffect, useCallback } from 'react';
import Header from "../components/Header";
import MapChart from "../components/MapChart";
import styles from "../styles/MapChart.module.css";
import FetchTimer from "../components/FetchTimer";

interface PastorInfo {
  id: string;
  name: string;
  state: string;
}

interface EngagementStats {
  totalEngagements: number;
  engagementPerState: Record<string, number>;
}

const FETCH_INTERVAL = 60000; // 60 seconds

export default function Home() {
  const [pastorInfo, setPastorInfo] = useState<PastorInfo | null>(null);
  const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null);
  const pastorId = process.env.NEXT_PUBLIC_PASTOR_ID || "1";

  const fetchPastorInfo = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pastors/${pastorId}`);
      const data = await response.json();
      setPastorInfo(data);
    } catch (error) {
      console.error('Error fetching pastor info:', error);
    }
  }, [pastorId]);

  const fetchEngagementStats = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pastors/${pastorId}/engagement-stats`);
      const data = await response.json();
      setEngagementStats(data);
    } catch (error) {
      console.error('Error fetching engagement stats:', error);
    }
  }, [pastorId]);

  useEffect(() => {
    fetchPastorInfo();
    fetchEngagementStats();

    const timer = setInterval(() => {
      fetchEngagementStats();
    }, FETCH_INTERVAL);

    return () => clearInterval(timer);
  }, [fetchPastorInfo, fetchEngagementStats]);

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
          fetchInterval={FETCH_INTERVAL}
        />
      </div>
      <div className={styles.timerWrapper}>
        <FetchTimer interval={FETCH_INTERVAL} />
      </div>
    </div>
  );
}
