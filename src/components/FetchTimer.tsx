import React, { useState, useEffect } from 'react';

interface FetchTimerProps {
  interval: number;
}

const FetchTimer: React.FC<FetchTimerProps> = ({ interval }) => {
  const [timeLeft, setTimeLeft] = useState(interval);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          return interval;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interval]);

  const seconds = Math.floor(timeLeft / 1000);

  return <div>Next update in: {seconds} seconds</div>;
};

export default FetchTimer;
