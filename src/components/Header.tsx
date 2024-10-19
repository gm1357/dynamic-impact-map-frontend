import React from 'react';

interface HeaderProps {
  name: string;
  state: string;
  totalEngagements: number;
}

const Header: React.FC<HeaderProps> = ({ name, state, totalEngagements }) => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="mt-2">Home state: {state}</p>
        <p className="mt-2">Total Engagements: {totalEngagements}</p>
      </div>
    </header>
  );
};

export default Header;
