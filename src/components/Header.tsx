import React, { useState, useEffect } from 'react';

interface EngagementStats {
  totalEngagements: number;
}

interface HeaderProps {
  name: string;
  state: string;
  pastorId: string;
}

const Header: React.FC<HeaderProps> = ({ name, state, pastorId }) => {
  const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null);

  useEffect(() => {
    const fetchEngagementStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pastors/${pastorId}/engagement-stats`);
        const data = await response.json();
        setEngagementStats(data);
      } catch (error) {
        console.error('Error fetching engagement stats:', error);
      }
    };

    fetchEngagementStats();
  }, [pastorId]);

  if (!engagementStats) {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="mt-2">Home state: {state}</p>
        <p className="mt-2">Total Engagements: {engagementStats.totalEngagements}</p>
      </div>
    </header>
  );
};

export default Header;
