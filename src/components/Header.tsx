import React, { useState, useEffect } from 'react';

interface PastorInfo {
  name: string;
}

interface EngagementStats {
  totalEngagements: number;
}

interface HeaderProps {
  pastorId: string;
}

const Header: React.FC<HeaderProps> = ({ pastorId }) => {
  const [pastorInfo, setPastorInfo] = useState<PastorInfo | null>(null);
  const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null);

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
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">{pastorInfo.name}</h1>
        <p className="mt-2">Total Engagements: {engagementStats.totalEngagements}</p>
      </div>
    </header>
  );
};

export default Header;
