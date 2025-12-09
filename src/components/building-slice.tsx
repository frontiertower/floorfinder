'use client';

import { useEffect, useState } from 'react';
import { allFloors } from '@/lib/config';
import type { Room, Floor } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';

const SELECTED_FLOORS = ['2', '7', '12', '15', '16'];
const FLOOR_HEIGHT = 80; // Height of each floor in pixels
const BUILDING_WIDTH = 800; // Width of building in pixels

export const BuildingSlice = () => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [customFloorNames, setCustomFloorNames] = useState<Record<string, string>>({});

  // Fetch custom floor names
  useEffect(() => {
    const fetchFloorNames = async () => {
      try {
        const response = await fetch('/api/floors');
        if (response.ok) {
          const floors = await response.json();
          const names: Record<string, string> = {};
          floors.forEach((floor: Floor) => {
            names[floor.id] = floor.name;
          });
          setCustomFloorNames(names);
        }
      } catch (error) {
        console.error('Failed to fetch floor names', error);
      }
    };
    fetchFloorNames();
  }, []);

  // Fetch all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms.json');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const rooms = await response.json();
        setAllRooms(rooms);
      } catch (error) {
        console.error('Error loading room data:', error);
      }
    };
    fetchRooms();
  }, []);

  // Get floors and their rooms
  const floorsWithRooms = SELECTED_FLOORS.map(floorId => {
    const floor = allFloors.find(f => f.id === floorId);
    if (!floor) return null;

    const rooms = allRooms.filter(room => room.floorId === floorId);
    const teams = [...new Set(rooms.filter(r => r.teamName && r.teamName !== 'Private').map(r => r.teamName))];

    return {
      ...floor,
      customName: customFloorNames[floorId] || floor.name,
      rooms,
      teams
    };
  }).filter(Boolean).reverse(); // Reverse to show top floor first

  const totalHeight = floorsWithRooms.length * FLOOR_HEIGHT + 100;

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-slate-950 p-8">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');

        .blueprint-bg {
          background-color: #0d47a1;
          background-image:
            linear-gradient(rgba(255, 255, 255, .03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, .03) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .blueprint-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        .architect-font {
          font-family: 'Architects Daughter', cursive;
        }

        .hatching {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 3px,
            rgba(255, 255, 255, 0.1) 3px,
            rgba(255, 255, 255, 0.1) 4px
          );
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 architect-font text-blue-900 dark:text-blue-100">
              BUILDING SECTION A-A'
            </h1>
            <p className="text-blue-700 dark:text-blue-300 blueprint-text text-sm">
              SCALE: 1:200 | DATE: {new Date().toLocaleDateString()} | DWG NO: BS-001
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="/"
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors blueprint-text"
            >
              FLOOR PLANS
            </a>
          </div>
        </div>

        {/* Blueprint Drawing */}
        <div className="blueprint-bg rounded-lg p-8 shadow-2xl">
          <svg
            width="100%"
            viewBox={`0 0 ${BUILDING_WIDTH + 200} ${totalHeight}`}
            className="w-full"
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
              </pattern>

              {/* Hatching pattern for walls */}
              <pattern id="wall-hatch" patternUnits="userSpaceOnUse" width="4" height="4">
                <line x1="0" y1="0" x2="4" y2="4" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
              </pattern>

              {/* Concrete pattern for slabs */}
              <pattern id="concrete" patternUnits="userSpaceOnUse" width="10" height="10">
                <circle cx="2" cy="2" r="0.5" fill="rgba(255,255,255,0.2)"/>
                <circle cx="7" cy="5" r="0.5" fill="rgba(255,255,255,0.2)"/>
                <circle cx="5" cy="8" r="0.5" fill="rgba(255,255,255,0.2)"/>
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Building outline */}
            <g transform="translate(100, 50)">
              {/* Foundation */}
              <rect
                x="-20"
                y={floorsWithRooms.length * FLOOR_HEIGHT}
                width={BUILDING_WIDTH + 40}
                height="20"
                fill="url(#concrete)"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={BUILDING_WIDTH / 2}
                y={floorsWithRooms.length * FLOOR_HEIGHT + 15}
                fill="white"
                fontSize="10"
                textAnchor="middle"
                className="blueprint-text"
              >
                FOUNDATION
              </text>

              {/* Floors */}
              {floorsWithRooms.map((floor, index) => {
                if (!floor) return null;
                const y = index * FLOOR_HEIGHT;

                return (
                  <g key={floor.id}>
                    {/* Floor slab */}
                    <rect
                      x="0"
                      y={y + FLOOR_HEIGHT - 10}
                      width={BUILDING_WIDTH}
                      height="10"
                      fill="url(#concrete)"
                      stroke="white"
                      strokeWidth="1"
                    />

                    {/* Floor space */}
                    <rect
                      x="0"
                      y={y}
                      width={BUILDING_WIDTH}
                      height={FLOOR_HEIGHT - 10}
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    />

                    {/* Side walls */}
                    <rect
                      x="0"
                      y={y}
                      width="15"
                      height={FLOOR_HEIGHT - 10}
                      fill="url(#wall-hatch)"
                      stroke="white"
                      strokeWidth="1"
                    />
                    <rect
                      x={BUILDING_WIDTH - 15}
                      y={y}
                      width="15"
                      height={FLOOR_HEIGHT - 10}
                      fill="url(#wall-hatch)"
                      stroke="white"
                      strokeWidth="1"
                    />

                    {/* Floor number and elevation - left side */}
                    <circle
                      cx="-40"
                      cy={y + FLOOR_HEIGHT / 2 - 5}
                      r="18"
                      fill="rgba(255,255,255,0.1)"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x="-40"
                      cy={y + FLOOR_HEIGHT / 2 - 8}
                      dy="5"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="blueprint-text"
                    >
                      {floor.id}
                    </text>

                    {/* Floor elevation */}
                    <text
                      x="-70"
                      y={y + FLOOR_HEIGHT - 5}
                      fill="white"
                      fontSize="9"
                      className="blueprint-text"
                    >
                      +{(parseInt(floor.id) * 3.5).toFixed(1)}m
                    </text>

                    {/* Horizontal elevation line */}
                    <line
                      x1="-60"
                      y1={y + FLOOR_HEIGHT - 10}
                      x2="0"
                      y2={y + FLOOR_HEIGHT - 10}
                      stroke="white"
                      strokeWidth="0.5"
                      strokeDasharray="2,1"
                    />
                    <polygon
                      points="-60,${y + FLOOR_HEIGHT - 12} -55,${y + FLOOR_HEIGHT - 10} -60,${y + FLOOR_HEIGHT - 8}"
                      fill="white"
                    />

                    {/* Floor name */}
                    <text
                      x="30"
                      y={y + 25}
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                      className="blueprint-text"
                    >
                      {floor.customName.toUpperCase()}
                    </text>

                    {/* Team spaces */}
                    {floor.teams.length > 0 && (
                      <g>
                        {floor.teams.slice(0, 6).map((team, teamIndex) => {
                          const roomsPerRow = 3;
                          const row = Math.floor(teamIndex / roomsPerRow);
                          const col = teamIndex % roomsPerRow;
                          // Full width for team spaces
                          const usableWidth = BUILDING_WIDTH - 60; // Leave space for margins
                          const roomWidth = usableWidth / roomsPerRow;
                          const startX = 30; // Start with margin
                          const x = startX + col * roomWidth;
                          const y2 = y + 30 + row * 20;

                          return (
                            <g key={team}>
                              <rect
                                x={x}
                                y={y2}
                                width={roomWidth - 10}
                                height="18"
                                fill="none"
                                stroke="rgba(255,255,255,0.5)"
                                strokeWidth="0.5"
                                strokeDasharray="2,2"
                              />
                              <text
                                x={x + 8}
                                y={y2 + 13}
                                fill="rgba(255,255,255,0.95)"
                                fontSize="12"
                                fontWeight="500"
                                className="blueprint-text"
                              >
                                {team?.substring(0, 20)}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* Dimension line - right side */}
                    <line
                      x1={BUILDING_WIDTH + 20}
                      y1={y}
                      x2={BUILDING_WIDTH + 20}
                      y2={y + FLOOR_HEIGHT}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <line
                      x1={BUILDING_WIDTH + 15}
                      y1={y}
                      x2={BUILDING_WIDTH + 25}
                      y2={y}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <line
                      x1={BUILDING_WIDTH + 15}
                      y1={y + FLOOR_HEIGHT}
                      x2={BUILDING_WIDTH + 25}
                      y2={y + FLOOR_HEIGHT}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <text
                      x={BUILDING_WIDTH + 30}
                      y={y + FLOOR_HEIGHT / 2}
                      fill="white"
                      fontSize="8"
                      className="blueprint-text"
                    >
                      3.5m
                    </text>
                  </g>
                );
              })}


              {/* Section cut indicators */}
              <g>
                <line
                  x1="-80"
                  y1="-20"
                  x2="-80"
                  y2={floorsWithRooms.length * FLOOR_HEIGHT + 40}
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="10,5"
                />
                <circle cx="-80" cy="-20" r="8" fill="white"/>
                <text x="-80" y="-16" fill="#0d47a1" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>

                <circle cx="-80" cy={floorsWithRooms.length * FLOOR_HEIGHT + 40} r="8" fill="white"/>
                <text x="-80" y={floorsWithRooms.length * FLOOR_HEIGHT + 44} fill="#0d47a1" fontSize="12" fontWeight="bold" textAnchor="middle">A'</text>
              </g>
            </g>

            {/* Title block */}
            <g transform={`translate(${BUILDING_WIDTH - 150}, ${totalHeight - 40})`}>
              <rect x="0" y="0" width="200" height="30" fill="white" stroke="white" strokeWidth="1"/>
              <text x="10" y="12" fill="#0d47a1" fontSize="8" className="blueprint-text">PROJECT: SENSAI HACK</text>
              <text x="10" y="22" fill="#0d47a1" fontSize="8" className="blueprint-text">DRAWN BY: AI ARCHITECT</text>
              <text x="130" y="12" fill="#0d47a1" fontSize="8" className="blueprint-text">SHEET: 1 OF 1</text>
              <text x="130" y="22" fill="#0d47a1" fontSize="8" className="blueprint-text">REV: A</text>
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-lg">
          <h3 className="font-bold mb-3 text-blue-900 dark:text-blue-100 blueprint-text">LEGEND:</h3>
          <div className="grid grid-cols-3 gap-4 text-sm blueprint-text">
            <div className="flex items-center gap-2">
              <svg width="30" height="15">
                <rect width="30" height="15" fill="url(#wall-hatch)" stroke="black" strokeWidth="1"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">STRUCTURAL WALL</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="30" height="15">
                <rect width="30" height="15" fill="url(#concrete)" stroke="black" strokeWidth="1"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">CONCRETE SLAB</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="30" height="15">
                <rect width="30" height="15" fill="none" stroke="black" strokeWidth="1" strokeDasharray="2,2"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">TEAM SPACE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};