import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import StateTooltip from "./StateTooltip";

interface MapChartProps {
  originState: string;
  pastorId: string;
  engagementPerState: Record<string, number>;
}

const MapChart: React.FC<MapChartProps> = ({ originState, pastorId, engagementPerState }) => {
  const [geoData, setGeoData] = useState(null);
  const [engagementPoints, setEngagementPoints] = useState(null);
  const [usaStates, setUsaStates] = useState<{ code: string, name: string, longitude: number, latitude: number }[]>([]);

  const [hoveredState, setHoveredState] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/map/usa-states/geojson`);
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

    const fetchUsaStates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/map/usa-states`);
        const data = await response.json();
        setUsaStates(data);
      } catch (error) {
        console.error("Error fetching usa states:", error);
      }
    };

    fetchGeoData();
    fetchEngagementPoints();
    fetchUsaStates();
  }, [pastorId]);

  if (!geoData || !engagementPoints || !usaStates) {
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
                onMouseEnter={() => setHoveredState(stateCode)}
                onMouseLeave={() => setHoveredState(null)}
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
              />
            );
          })
        }
      </Geographies>
      {hoveredState && usaStates.find(state => state.code === hoveredState) && (
        <Marker
          key={hoveredState}
          coordinates={[
            usaStates.find(state => state.code === hoveredState)!.longitude,
            usaStates.find(state => state.code === hoveredState)!.latitude
          ]}
        >
          <StateTooltip
            stateName={usaStates.find(state => state.code === hoveredState)!.name}
            engagementCount={engagementPerState[hoveredState] || 0}
          />
        </Marker>
      )}
    </ComposableMap>
  );
};

export default MapChart;
