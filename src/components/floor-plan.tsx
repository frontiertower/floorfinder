
'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { Room, Floor } from '@/lib/types';
import { allFloors, floorComponentMap, upperFloorViewBox, lowerFloorViewBox } from '@/lib/floor-data';

import { RoomHoverCard } from './floor-svgs/RoomHoverCard';

import '../app/svg.css';

const DefaultFloor = () => (
    <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Floor plan not available.</p>
    </div>
);

const Ruler = () => {
    return (
      <g>
        <line x1="0" y1="0" x2="10" y2="0" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <line x1="0" y1="0" x2="0" y2="-0.2" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <line x1="10" y1="0" x2="10" y2="-0.2" stroke="hsl(var(--foreground))" strokeWidth="0.05" />
        <text x="5" y="-0.5" dominantBaseline="middle" textAnchor="middle" className="font-mono" fontSize="0.5px" fill="hsl(var(--foreground))">10m</text>
      </g>
    );
};

const Grid = ({ viewBox }: { viewBox: string }) => {
    const viewBoxParts = viewBox.split(' ').map(parseFloat);
    const [x, y, width, height] = viewBoxParts;

    const majorLines = [];
    const minorLines = [];

    // Using feet, so conversion from meters is ~3.28
    const majorGridSpacing = 10;
    const minorGridSpacing = 1;

    // Vertical lines
    for (let i = x; i <= x + width; i += minorGridSpacing) {
        if (i % majorGridSpacing === 0) {
            majorLines.push(<line key={`v-maj-${i}`} x1={i} y1={y} x2={i} y2={y + height} stroke="hsl(var(--border))" strokeWidth="0.1" />);
        } else {
            minorLines.push(<line key={`v-min-${i}`} x1={i} y1={y} x2={i} y2={y + height} stroke="hsl(var(--border))" strokeWidth="0.05" opacity="0.5" />);
        }
    }

    // Horizontal lines
    for (let i = y; i <= y + height; i += minorGridSpacing) {
        if (i % majorGridSpacing === 0) {
            majorLines.push(<line key={`h-maj-${i}`} x1={x} y1={i} x2={x + width} y2={i} stroke="hsl(var(--border))" strokeWidth="0.1" />);
        } else {
            minorLines.push(<line key={`h-min-${i}`} x1={x} y1={i} x2={x + width} y2={i} stroke="hsl(var(--border))" strokeWidth="0.05" opacity="0.5" />);
        }
    }

    return (
        <g className="pointer-events-none">
            {minorLines}
            {majorLines}
        </g>
    );
};

interface FloorPlanProps {
  floorId: string;
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
}

const FloorPlan: React.FC<FloorPlanProps> = ({ floorId, highlightedRoomId, onRoomClick, rooms }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [hoverCardPosition, setHoverCardPosition] = useState<{ x: number; y: number } | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; z: number | null } | null>(null);
  
  const floor = useMemo(() => allFloors.find(f => f.id === floorId), [floorId]);
  const viewBox = useMemo(() => floor && floor.level < 4 ? lowerFloorViewBox : upperFloorViewBox, [floor]);

  const handleMouseEnterRoom = useCallback((room: Room, position: { x: number; y: number }) => {
    setHoveredRoom(room);
    setHoverCardPosition(position);
  }, []);

  const handleMouseLeaveRoom = useCallback(() => {
    setHoveredRoom(null);
    setHoverCardPosition(null);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    const viewBoxParts = viewBox.split(' ').map(parseFloat);
    const viewBoxHeight = viewBoxParts[3];

    setCoords({
      x: svgPoint.x,
      y: viewBoxHeight - svgPoint.y, // Invert Y to make bottom-left the origin
      z: floor?.level ?? null
    });
  }, [floor, viewBox]);

  const handleMouseLeave = useCallback(() => {
    setCoords(null);
  }, []);

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);
  const floorName = useMemo(() => floor?.name || 'Unknown Floor', [floor]);

  return (
    <div 
      className="w-full h-full relative overflow-hidden bg-muted/20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {coords && (
        <div className="absolute top-2 right-2 bg-card/80 p-2 rounded-md text-xs font-mono z-10 pointer-events-none">
          <div>X: {coords.x.toFixed(2)}ft</div>
          <div>Y: {coords.y.toFixed(2)}ft</div>
          <div>Z: {coords.z}</div>
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full absolute p-10"
      >
          <Grid viewBox={viewBox} />
          <FloorComponent
            highlightedRoomId={highlightedRoomId}
            onRoomClick={onRoomClick}
            rooms={rooms}
            onMouseEnterRoom={handleMouseEnterRoom}
            onMouseLeaveRoom={handleMouseLeaveRoom}
          />

        <text
          x={3}
          y={4}
          dominantBaseline="hanging"
          textAnchor="left"
          fontSize="3"
          fill="hsl(var(--foreground))"
          className="font-bold"
        >
          {floorName}
        </text>

        <g transform={`translate(75, 55)`}>
            <Ruler />
        </g>
      </svg>

      <RoomHoverCard room={hoveredRoom} position={hoverCardPosition} />
    </div>
  );
};

export default FloorPlan;
