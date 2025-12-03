'use client';

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import type { Room } from '@/lib/types';
import { allFloors, floorComponentMap } from '@/lib/config';
import { InfoBox } from './infobox';
import { RoomEditorDialog } from './room-editor-dialog';
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

interface FloorPlanEditableProps {
  floorId: string;
  highlightedRoomId: string | null;
  onRoomClick: (roomId: string | null) => void;
  rooms: Room[];
  isEditMode: boolean;
  onRoomCreated: (room: Partial<Room>) => void;
}

const FloorPlanEditable: React.FC<FloorPlanEditableProps> = ({
  floorId,
  highlightedRoomId,
  onRoomClick,
  rooms,
  isEditMode,
  onRoomCreated
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; z: number | null } | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [drawnCoords, setDrawnCoords] = useState<[number, number, number, number] | null>(null);

  const floor = useMemo(() => allFloors.find(f => f.id === floorId), [floorId]);

  const basementViewBox = '0 0 205 100';
  const lowerFloorViewBox = '0 0 180 90';
  const upperFloorViewBox = '0 0 100 60';
  let viewBox = basementViewBox;
  if (floor?.level > 3) {
    viewBox = upperFloorViewBox;
  } else if (floor?.level > 0) {
    viewBox = lowerFloorViewBox;
  }

  const getSVGPoint = useCallback((event: React.MouseEvent) => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(svg.getScreenCTM()?.inverse());
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!isEditMode) return;
    event.preventDefault();
    const point = getSVGPoint(event);
    if (point) {
      setIsDrawing(true);
      setDrawStart({ x: point.x, y: point.y });
      setDrawEnd({ x: point.x, y: point.y });
    }
  }, [isEditMode, getSVGPoint]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!svgRef.current || !viewBox) return;

    const point = getSVGPoint(event);
    if (!point) return;

    const viewBoxParts = viewBox.split(' ').map(parseFloat);
    const viewBoxHeight = viewBoxParts[3];

    setCoords({
      x: point.x,
      y: viewBoxParts[1] + viewBoxHeight - point.y,
      z: floor?.level ?? null
    });

    if (isDrawing && drawStart) {
      setDrawEnd({ x: point.x, y: point.y });
    }
  }, [floor, viewBox, isDrawing, drawStart, getSVGPoint]);

  const handleMouseUp = useCallback((event: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !drawEnd) return;

    setIsDrawing(false);

    // Calculate the rectangle coordinates
    const x1 = Math.min(drawStart.x, drawEnd.x);
    const y1 = Math.min(drawStart.y, drawEnd.y);
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);

    // Only create a room if the rectangle is large enough
    if (width > 1 && height > 1) {
      setDrawnCoords([x1, y1, width, height]);
      setShowRoomDialog(true);
    }

    // Reset drawing state
    setDrawStart(null);
    setDrawEnd(null);
  }, [isDrawing, drawStart, drawEnd]);

  const handleMouseLeave = useCallback(() => {
    setCoords(null);
    if (isDrawing) {
      setIsDrawing(false);
      setDrawStart(null);
      setDrawEnd(null);
    }
  }, [isDrawing]);

  const handleMouseEnterRoom = useCallback((room: Room) => {
    if (!isEditMode) {
      setHoveredRoom(room);
    }
  }, [isEditMode]);

  const handleMouseLeaveRoom = useCallback(() => {
    setHoveredRoom(null);
  }, []);

  const handleRoomSave = useCallback((room: Partial<Room>) => {
    onRoomCreated(room);
    setDrawnCoords(null);
  }, [onRoomCreated]);

  const FloorComponent = useMemo(() => floorComponentMap[floorId] || DefaultFloor, [floorId]);
  const floorName = useMemo(() => floor?.name || 'Unknown Floor', [floor]);

  // Calculate the preview rectangle
  const previewRect = useMemo(() => {
    if (!isDrawing || !drawStart || !drawEnd) return null;

    const x = Math.min(drawStart.x, drawEnd.x);
    const y = Math.min(drawStart.y, drawEnd.y);
    const width = Math.abs(drawEnd.x - drawStart.x);
    const height = Math.abs(drawEnd.y - drawStart.y);

    return { x, y, width, height };
  }, [isDrawing, drawStart, drawEnd]);

  return (
    <div
      className={`w-full h-full relative overflow-hidden bg-background ${isEditMode ? 'cursor-crosshair' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <InfoBox floor={floor?.level} floorName={floorName} coords={coords} hoveredRoom={hoveredRoom} />

      {isEditMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full z-10 shadow-lg">
          Draw a rectangle to create a room
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full absolute p-10"
      >
        <Grid viewBox={viewBox} />
        <FloorComponent
          highlightedRoomId={highlightedRoomId}
          onRoomClick={isEditMode ? undefined : onRoomClick}
          rooms={rooms}
          viewBox={viewBox}
          onMouseEnterRoom={handleMouseEnterRoom}
          onMouseLeaveRoom={handleMouseLeaveRoom}
        />

        {/* Drawing preview */}
        {previewRect && (
          <rect
            x={previewRect.x}
            y={previewRect.y}
            width={previewRect.width}
            height={previewRect.height}
            fill="rgba(33, 150, 243, 0.3)"
            stroke="rgba(33, 150, 243, 0.8)"
            strokeWidth="0.2"
            strokeDasharray="0.5,0.5"
          />
        )}
      </svg>

      {drawnCoords && (
        <RoomEditorDialog
          isOpen={showRoomDialog}
          onClose={() => {
            setShowRoomDialog(false);
            setDrawnCoords(null);
          }}
          onSave={handleRoomSave}
          coords={drawnCoords}
          floorId={floorId}
        />
      )}
    </div>
  );
};

export default FloorPlanEditable;