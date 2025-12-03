
'use client';

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import type { Room } from '@/lib/types';
import { allFloors, floorComponentMap } from '@/lib/config';

import { InfoBox } from './infobox';

import '../app/svg.css';

const DefaultFloor = () => (
    <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Floor plan not available.</p>
    </div>
);

const Grid = ({ viewBox }: { viewBox: string }) => {
    const viewBoxParts = viewBox.split(' ').map(parseFloat);
    const [x, y, width, height] = viewBoxParts;

    const majorLines = [];
    const minorLines = [];

    // The floor plans are in meters, so grid lines are at 1m and 10m intervals.
    const majorGridSpacing = 10;
    const minorGridSpacing = 1;

    // Vertical lines
    for (let i = Math.ceil(x / minorGridSpacing) * minorGridSpacing; i <= x + width; i += minorGridSpacing) {
        if (i % majorGridSpacing === 0) {
            majorLines.push(<line key={`v-maj-${i}`} x1={i} y1={y} x2={i} y2={y + height} stroke="hsl(var(--border))" strokeWidth="0.1" />);
        } else {
            minorLines.push(<line key={`v-min-${i}`} x1={i} y1={y} x2={i} y2={y + height} stroke="hsl(var(--border))" strokeWidth="0.05" opacity="0.5" />);
        }
    }

    // Horizontal lines
    for (let i = Math.ceil(y / minorGridSpacing) * minorGridSpacing; i <= y + height; i += minorGridSpacing) {
        if (i % majorGridSpacing === 0) {
            majorLines.push(<line key={`h-maj-${i}`} x1={x} y1={i} x2={x + width} y2={i} stroke="hsl(var(--border))" strokeWidth="0.1" />);
        } else {
            minorLines.push(<line key={`h-min-${i}`} x1={x} y1={i} x2={x + width} y2={i} stroke="hsl(var(--border))" strokeWidth="0.05" opacity="0.5" />);
        }
    }

    return (
        <g className="pointer-events-none">
          <rect x={x + .25} y={y + .25} width={width - .5 } height={height - .5} fill="white" stroke="none" />
          {minorLines}
          {majorLines}
          <rect x={x + .25} y={y + .25} width={width - .5 } height={height - .5} fill="none" stroke="black" strokeWidth="0.25" />
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
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; z: number | null } | null>(null);

  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointer, setLastPointer] = useState<{ x: number; y: number } | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const floor = useMemo(() => allFloors.find(f => f.id === floorId), [floorId]);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Reset zoom/pan when floor changes
  useEffect(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, [floorId]);

  const basementViewBox = '0 0 205 100';
  const lowerFloorViewBox = '0 0 180 90';
  const upperFloorViewBox = '0 0 100 60';
  let viewBox = basementViewBox;
  if (floor?.level > 3) {
    viewBox = upperFloorViewBox;
  } else if (floor?.level > 0) {
    viewBox = lowerFloorViewBox;
  }

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();

    const paths = svg.querySelectorAll('path');

    paths.forEach((path) => {
        const pathRect = path.getBoundingClientRect();

        const isOutside = 
            pathRect.right < svgRect.left || 
            pathRect.left > svgRect.right || 
            pathRect.bottom < svgRect.top || 
            pathRect.top > svgRect.bottom;

        if (isOutside) {
            console.warn('Path is outside SVG viewport:', path);
        }
    });
  }, [floorId]); // Re-run when floor changes

  // Zoom and pan handlers
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (!containerRef.current) return;
    event.preventDefault();

    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.5), 4);

    setScale(newScale);
  }, [scale]);

  const getPointerPosition = (event: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in event && event.touches.length > 0) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else if ('clientX' in event) {
      return { x: event.clientX, y: event.clientY };
    }
    return { x: 0, y: 0 };
  };

  const handlePointerDown = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in event && event.touches.length > 1) return; // Ignore multi-touch for now

    setIsDragging(true);
    setLastPointer(getPointerPosition(event));
    event.preventDefault();
  }, []);

  const handlePointerMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !lastPointer) return;

    const currentPointer = getPointerPosition(event);
    const deltaX = currentPointer.x - lastPointer.x;
    const deltaY = currentPointer.y - lastPointer.y;

    setTranslateX(prev => prev + deltaX);
    setTranslateY(prev => prev + deltaY);
    setLastPointer(currentPointer);

    event.preventDefault();
  }, [isDragging, lastPointer]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setLastPointer(null);
  }, []);

  // Handle pinch-to-zoom on touch devices
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 2) {
      // Calculate initial distance for pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setLastPointer({ x: distance, y: 0 }); // Store distance in x for pinch
    } else {
      handlePointerDown(event);
    }
  }, [handlePointerDown]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 2 && lastPointer) {
      // Handle pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      const scaleDelta = distance / lastPointer.x;
      const newScale = Math.min(Math.max(scale * scaleDelta, 0.5), 4);
      setScale(newScale);
      setLastPointer({ x: distance, y: 0 });
      event.preventDefault();
    } else {
      handlePointerMove(event);
    }
  }, [lastPointer, scale, handlePointerMove]);

  const handleMouseEnterRoom = useCallback((room: Room) => {
    setHoveredRoom(room);
  }, []);

  const handleMouseLeaveRoom = useCallback(() => {
    setHoveredRoom(null);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // Handle coordinate tracking for InfoBox
    if (!svgRef.current || !viewBox) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const viewBoxParts = viewBox.split(' ').map(parseFloat);
    const viewBoxHeight = viewBoxParts[3];

    setCoords({
      x: svgPoint.x,
      y: viewBoxParts[1] + viewBoxHeight - svgPoint.y, // Invert Y and offset by viewbox start
      z: floor?.level ?? null
    });

    // Handle pan functionality if dragging
    if (!isTouchDevice) {
      handlePointerMove(event);
    }
  }, [floor, viewBox, isTouchDevice, handlePointerMove]);

  const handleMouseLeave = useCallback(() => {
    setCoords(null);
  }, []);

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);
  const floorName = useMemo(() => floor?.name || 'Unknown Floor', [floor]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-background touch-none select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      onMouseDown={!isTouchDevice ? handlePointerDown : undefined}
      onMouseUp={!isTouchDevice ? handlePointerUp : undefined}
      onTouchStart={isTouchDevice ? handleTouchStart : undefined}
      onTouchMove={isTouchDevice ? handleTouchMove : undefined}
      onTouchEnd={isTouchDevice ? handlePointerUp : undefined}
    >
      <InfoBox floor={floor?.level}  floorName={floorName} coords={coords} hoveredRoom={hoveredRoom} />

      {/* Zoom controls for mobile */}
      {isTouchDevice && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            className="bg-background border border-border rounded p-2 shadow-lg"
            onTouchStart={(e) => {
              e.preventDefault();
              setScale(prev => Math.min(prev * 1.2, 4));
            }}
          >
            <span className="text-lg font-bold">+</span>
          </button>
          <button
            className="bg-background border border-border rounded p-2 shadow-lg"
            onTouchStart={(e) => {
              e.preventDefault();
              setScale(prev => Math.max(prev * 0.8, 0.5));
            }}
          >
            <span className="text-lg font-bold">−</span>
          </button>
          <button
            className="bg-background border border-border rounded p-1 shadow-lg text-xs"
            onTouchStart={(e) => {
              e.preventDefault();
              setScale(1);
              setTranslateX(0);
              setTranslateY(0);
            }}
          >
            Reset
          </button>
        </div>
      )}

      <div
        className="w-full h-full absolute"
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="w-full h-full p-10"
        >
            <Grid viewBox={viewBox} />
            <FloorComponent
              highlightedRoomId={highlightedRoomId}
              onRoomClick={onRoomClick}
              rooms={rooms}
              viewBox={viewBox}
              onMouseEnterRoom={handleMouseEnterRoom}
              onMouseLeaveRoom={handleMouseLeaveRoom}
            />
        </svg>
      </div>
    </div>
  );
};

export default FloorPlan;
