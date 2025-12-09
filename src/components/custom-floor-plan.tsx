'use client';

import { useEffect, useState } from 'react';
import type { Room } from '@/lib/types';

interface CustomFloorPlanProps {
  floorId: string;
  imageUrl: string;
  rooms: Room[];
  searchQuery?: string;
  highlightedRoom?: string | null;
  onRoomClick?: (room: Room) => void;
  className?: string;
}

export function CustomFloorPlan({
  floorId,
  imageUrl,
  rooms,
  searchQuery,
  highlightedRoom,
  onRoomClick,
  className = ''
}: CustomFloorPlanProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);

  const filteredRooms = searchQuery
    ? rooms.filter(room =>
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rooms;

  return (
    <div className={`relative w-full ${className}`}>
      {!imageLoaded && !imageError && (
        <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {imageError && (
        <div className="flex flex-col items-center justify-center h-96 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-2">Failed to load floor plan</p>
          <p className="text-sm text-muted-foreground">Check if the image file exists</p>
        </div>
      )}

      <img
        src={imageUrl}
        alt={`Floor plan for ${floorId}`}
        className={`w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg ${
          imageLoaded ? 'block' : 'hidden'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />

      {imageLoaded && (
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
        >
          {filteredRooms.map((room) => {
            const isHighlighted = highlightedRoom === room.id;
            const isSearchResult = filteredRooms.length < rooms.length;

            return (
              <g key={room.id}>
                {/* Room highlight overlay */}
                <rect
                  x={room.coords[0]}
                  y={room.coords[1]}
                  width={room.coords[2] - room.coords[0]}
                  height={room.coords[3] - room.coords[1]}
                  fill={room.color || 'rgba(59, 130, 246, 0.3)'}
                  stroke={isHighlighted ? '#ef4444' : '#3b82f6'}
                  strokeWidth={isHighlighted ? 3 : 1}
                  className="cursor-pointer pointer-events-auto"
                  onClick={() => onRoomClick?.(room)}
                />

                {/* Room label */}
                <text
                  x={(room.coords[0] + room.coords[2]) / 2}
                  y={(room.coords[1] + room.coords[3]) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-current pointer-events-none"
                  fontSize="12"
                >
                  {room.name || room.id}
                  {room.teamName && (
                    <tspan x={(room.coords[0] + room.coords[2]) / 2} dy="14">
                      {room.teamName}
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}