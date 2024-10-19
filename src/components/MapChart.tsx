import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

interface MapChartProps {
  originState: string;
  pastorId: string;
  engagementPerState: Record<string, number>;
}

const MapChart: React.FC<MapChartProps> = ({ originState, pastorId, engagementPerState }) => {
  const [geoData, setGeoData] = useState(null);
  const [engagementPoints, setEngagementPoints] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/map/us-states`);
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    const fetchEngagementPoints = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pastors/${pastorId}/impact-map`);
        const data = await response.json();
        setEngagementPoints(data);
      } catch (error) {
        console.error("Error fetching engagement points:", error);
      }
    };

    fetchGeoData();
    fetchEngagementPoints();
  }, [pastorId]);

  if (!geoData || !engagementPoints) {
    return <div>Loading map data...</div>;
  }

  const defaultColor = "#E4E5E6";
  const originStateColor = "#FF9999";

  const getEngagementColor = (stateCode: string) => {
    const highestEngagement = Object.values(engagementPerState).reduce((max, count) => Math.max(max, count), 0);
    const engagementCount = engagementPerState[stateCode] || 0;
    return engagementCount > 0 ? `rgba(169, 208, 245, ${Math.min(Math.max(engagementCount / highestEngagement, 0.2), 1)})` : defaultColor;
  }

  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoData}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const stateCode = geo.properties.code;
            const fillColor = stateCode === originState ? originStateColor : getEngagementColor(stateCode);

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: fillColor,
                    stroke: "#FFFFFF",
                    strokeWidth: 0.75,
                  },
                  hover: {
                    fill: "rgb(169, 208, 245)",
                  },
                }}
              >
                <text
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "8px",
                    fill: "#000",
                    textAnchor: "middle",
                    alignmentBaseline: "middle",
                  }}
                >
                  {stateCode}
                </text>
              </Geography>
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
