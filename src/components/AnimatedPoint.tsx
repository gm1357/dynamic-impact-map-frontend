import React, { useEffect, useState } from 'react';
import { Marker } from "react-simple-maps";

interface AnimatedPointProps {
  from: [number, number];
  to: [number, number];
  duration: number;
  delay: number;
}

const AnimatedPoint: React.FC<AnimatedPointProps> = ({ from, to, duration, delay }) => {
  const [position, setPosition] = useState(from);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
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

    return () => clearTimeout(timer);
  }, [from, to, duration, delay]);

  return (
    <Marker coordinates={position}>
      <circle r={7} fill="#FF5533" opacity={opacity} />
    </Marker>
  );
};

export default AnimatedPoint;
