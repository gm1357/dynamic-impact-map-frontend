import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

interface MapChartProps {
  originState: string;
  pastorId: string;
}

const MapChart: React.FC<MapChartProps> = ({ originState, pastorId }) => {
  const [geoData, setGeoData] = useState(null);
  const [engamentPoints, setEngamentPoints] = useState(null);

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
        setEngamentPoints(data);
      } catch (error) {
        console.error("Error fetching engagement points:", error);
      }
    };

    fetchGeoData();
    fetchEngagementPoints();
  }, [pastorId]);

  if (!geoData) {
    return <div>Loading map data...</div>;
  }

  if (engamentPoints) {
    console.log(engamentPoints);
  }
  const defaultColor = "#E4E5E6";
  const originStateColor = "#FF9999";
  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoData}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: {
                  fill: geo.properties.code === originState ? originStateColor : defaultColor,
                  stroke: "#FFFFFF",
                  strokeWidth: 0.75,
                },
                hover: {
                  fill: "#A9D0F5",
                },
                pressed: {
                  fill: "#2E64FE",
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
                {geo.properties.code}
              </text>
            </Geography>
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
