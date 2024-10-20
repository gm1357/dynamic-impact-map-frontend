import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line	
} from "react-simple-maps";
import StateTooltip from "./StateTooltip";
import OriginMarker from "./OriginMarker";
import styles from "../styles/MapChart.module.css";
import AnimatedPoint from './AnimatedPoint';

interface MapChartProps {
  originState: string;
  pastorId: string;
  engagementPerState: Record<string, number>;
  fetchInterval: number;
}

interface EngagementPoint {
  id: string;
  state: string;
  count: number;
  timestamp: string;
  delay: number;
}

const ANIMATION_DURATION = 1000;
// Because of how this states are displayed on this projection, when trying to do the animation for them, it breaks
// So we disable the animation for them for now
const DISABLED_STATES_ANIMATION = ["AK", "HI"];

const MapChart: React.FC<MapChartProps> = ({ originState, pastorId, engagementPerState, fetchInterval }) => {
  const [geoData, setGeoData] = useState(null);
  const [engagementPoints, setEngagementPoints] = useState<EngagementPoint[] | null>(null);
  const [usaStates, setUsaStates] = useState<{ code: string, name: string, longitude: number, latitude: number }[]>([]);

  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [activeEngagements, setActiveEngagements] = useState<EngagementPoint[]>([]);

  const handleNewEngagementPoints = useCallback((data: EngagementPoint[]) => {
    if (data.length === 0) return;

    const startTime = new Date(data[0].timestamp).getTime();

    const withDelay: EngagementPoint[] = data.map((point) => ({
      ...point,
      delay: new Date(point.timestamp).getTime() - startTime,
    }));
    setActiveEngagements(withDelay);

    const longestDelay = withDelay.reduce((max, point) => Math.max(max, point.delay), 0);

    setTimeout(() => {
      setActiveEngagements([]);
    }, longestDelay + ANIMATION_DURATION);
  }, []);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    const fetchUsaStates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/map/usa-states`);
        const data = await response.json();
        setUsaStates(data);
      } catch (error) {
        console.error("Error fetching usa states:", error);
      }
    };

    const fetchEngagementPoints = async () => {
      try {
        setActiveEngagements([]);
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - fetchInterval);
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/pastors/${pastorId}/impact-map`);
        url.searchParams.append('startDate', startDate.toISOString());
        url.searchParams.append('endDate', endDate.toISOString());

        const response = await fetch(url.toString());
        const data: EngagementPoint[] = await response.json();
        setEngagementPoints(data);
        handleNewEngagementPoints(data);
      } catch (error) {
        console.error("Error fetching engagement points:", error);
      }
    };

    fetchGeoData();
    fetchUsaStates();
    fetchEngagementPoints();

    // Set up interval for fetching engagement points
    intervalRef.current = setInterval(fetchEngagementPoints, fetchInterval);

    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pastorId, handleNewEngagementPoints, fetchInterval]);

  if (!geoData || !engagementPoints || !usaStates) {
    return <div>Loading map data...</div>;
  }

  const defaultColor = "#E4E5E6";

  const getEngagementColor = (stateCode: string) => {
    const highestEngagement = Object.values(engagementPerState).reduce((max, count) => Math.max(max, count), 0);
    const engagementCount = engagementPerState[stateCode] || 0;
    return engagementCount > 0 ? `rgba(169, 208, 245, ${Math.min(Math.max(engagementCount / highestEngagement, 0.2), 1)})` : defaultColor;
  }

  const originStateData = usaStates.find(state => state.code === originState);

  return (
    <div className={styles['map-container']}>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateCode = geo.properties.code;
              const fillColor = getEngagementColor(stateCode);

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
        
        {/* Lines */}
        {originStateData && engagementPoints && engagementPoints.map((point, index) => {
          const stateData = usaStates.find(state => state.code === point.state);
          if (!stateData) return null;

          // generate up to 10 points between the origin and the state
          const points: [number, number][] = [];
          for (let i = 0; i < 10; i++) {
            points.push([
              originStateData.longitude + (stateData.longitude - originStateData.longitude) * i / 10,
              originStateData.latitude + (stateData.latitude - originStateData.latitude) * i / 10
            ]);
          }
          
          return (
            <React.Fragment key={index}>
              <Line
                coordinates={points}
                stroke="#FF5533"
                strokeWidth={2}
                strokeLinecap="square"
                strokeOpacity={0.7}
                strokeDasharray="10, 5"
              />
            </React.Fragment>
          );
        })}
        
        {/* Animated points */}
        {originStateData && activeEngagements && activeEngagements.map((point) => {
          if (DISABLED_STATES_ANIMATION.includes(point.state)) return null;
          return (
            <AnimatedPoint
              key={point.id}
              from={[usaStates.find(state => state.code === point.state)!.longitude, usaStates.find(state => state.code === point.state)!.latitude]}
              to={[originStateData.longitude, originStateData.latitude]}
              duration={ANIMATION_DURATION}
              delay={point.delay}
            />
          );
        })}

        {/* Markers */}
        {originStateData && (
          <Marker coordinates={[originStateData.longitude, originStateData.latitude]}>
            <g transform="translate(-20, -58)">
              <OriginMarker />
            </g>
          </Marker>
        )}
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
    </div>
  );
};

export default MapChart;
