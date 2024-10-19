import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import MapChart from "../components/MapChart";

interface PastorInfo {
  id: string;
  name: string;
  state: string;
}

export default function Home() {
  const [pastorInfo, setPastorInfo] = useState<PastorInfo | null>(null);
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

    fetchPastorInfo();
  }, [pastorId]);

  if (!pastorInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header name={pastorInfo.name} state={pastorInfo.state} pastorId={pastorInfo.id} />
      <MapChart originState={pastorInfo.state} pastorId={pastorInfo.id} />
    </div>
  );
}
