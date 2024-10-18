import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const MapChart = () => {
  const [geoData, setGeoData] = useState(null);

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

    fetchGeoData();
  }, []);

  if (!geoData) {
    return <div>Loading map data...</div>;
  }

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
                  fill: "#E4E5E6",
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
                {geo.properties.name}
              </text>
            </Geography>
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
