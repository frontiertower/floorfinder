'use client';

import { useEffect, useState } from 'react';
import { allFloors } from '@/lib/config';
import type { Room, Floor } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';

const SELECTED_FLOORS = ['2', '7', '12', '15', '16'];

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
    const teams = [...new Set(rooms.filter(r => r.teamName).map(r => r.teamName))];

    return {
      ...floor,
      customName: customFloorNames[floorId] || floor.name,
      rooms,
      teams
    };
  }).filter(Boolean).reverse(); // Reverse to show top floor first

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Building Slice View</h1>
            <p className="text-muted-foreground">Vertical cross-section showing teams by floor</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Back to Floor Plans
            </a>
          </div>
        </div>

        {/* Building Visualization */}
        <div className="relative">
          {/* Building outline */}
          <div className="absolute inset-0 border-4 border-border rounded-lg"></div>

          {/* Floors */}
          <div className="relative z-10">
            {floorsWithRooms.map((floor, index) => {
              if (!floor) return null;

              return (
                <div
                  key={floor.id}
                  className="border-b-2 border-border last:border-b-0"
                  style={{ minHeight: '120px' }}
                >
                  <div className="p-6">
                    {/* Floor Header */}
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-2xl font-bold text-primary">
                        Floor {floor.id}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        {floor.customName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({floor.rooms.length} rooms)
                      </span>
                    </div>

                    {/* Teams Grid */}
                    {floor.teams.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {floor.teams.sort().map((team) => {
                          const teamRooms = floor.rooms.filter(r => r.teamName === team);
                          return (
                            <div
                              key={team}
                              className="bg-card p-3 rounded-md border border-border hover:bg-accent transition-colors"
                            >
                              <div className="font-semibold text-foreground">
                                {team}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {teamRooms.length} {teamRooms.length === 1 ? 'room' : 'rooms'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">
                        No teams assigned to this floor
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Elevator shaft visual */}
          <div className="absolute left-8 top-0 bottom-0 w-12 bg-muted/20 border-x-2 border-border">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="writing-mode-vertical text-xs text-muted-foreground font-semibold tracking-wider"
                   style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                ELEVATOR
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 p-4 bg-card rounded-lg border border-border">
          <h3 className="font-semibold mb-2">Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Floor Number</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-card border border-border rounded"></div>
              <span>Team Space</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted/20 rounded"></div>
              <span>Elevator Shaft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};