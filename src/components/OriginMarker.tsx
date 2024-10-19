import React from 'react';

interface OriginMarkerProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const OriginMarker: React.FC<OriginMarkerProps> = ({
  fill = "#FF9999",
  stroke = "#FFFFFF",
  strokeWidth = 2
}) => {
  return (
    <svg
      width="40"
      height="60"
      viewBox="0 0 40 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 0C8.95431 0 0 8.95431 0 20C0 35 20 60 20 60C20 60 40 35 40 20C40 8.95431 31.0457 0 20 0ZM20 27C16.134 27 13 23.866 13 20C13 16.134 16.134 13 20 13C23.866 13 27 16.134 27 20C27 23.866 23.866 27 20 27Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default OriginMarker;
