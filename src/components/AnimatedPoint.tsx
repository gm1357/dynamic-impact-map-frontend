import React, { useEffect, useState } from 'react';
import { Marker } from "react-simple-maps";

interface AnimatedPointProps {
  from: [number, number];
  to: [number, number];
  duration: number;
  id: string;
  delay: number;
}

const AnimatedPoint: React.FC<AnimatedPointProps> = ({ from, to, duration, id, delay }) => {
  console.log("Creating AnimatedPoint", id);
  const [position, setPosition] = useState(from);

  useEffect(() => {
    setTimeout(() => {
      const startTime = Date.now();
      
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        const newX = from[0] + (to[0] - from[0]) * progress;
        const newY = from[1] + (to[1] - from[1]) * progress;
        
        setPosition([newX, newY]);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, delay);
  }, [from, to, duration, delay]);

  return (
    <Marker coordinates={position}>
      <circle r={7} fill="#FF5533" />
    </Marker>
  );
};

export default AnimatedPoint;
