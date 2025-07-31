
"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { allFloors, getRoomsForFloor } from '@/lib/floor-data';
import type { Room, Floor } from '@/lib/types';

import FloorPlan from './floor-plan';
import RoomInfoDialog from './room-info-dialog';

const FloorFinder = () => {
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(allFloors.find(f => f.id === '4') || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Map<string, Room[]>>(new Map());
  const [highlightedRoom, setHighlightedRoom] = useState<string | null>(null);
  const [isRoomInfoDialogOpen, setIsRoomInfoDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const { toast } = useToast();

  // Handle room search
  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = new Map<string, Room[]>();
      for (const floor of allFloors) {
        const floorRooms = getRoomsForFloor(floor.id);
        const floorResults = floorRooms.filter(room =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (floorResults.length > 0) {
          results.set(floor.id, floorResults);
        }
      }
      setSearchResults(results);
    } else {
      setSearchResults(new Map());
      setHighlightedRoom(null);
    }
  }, [searchQuery]);

  // Auto-select and highlight room if only one search result
  useEffect(() => {
    if (searchResults.size === 1) {
      const [floorId, rooms] = searchResults.entries().next().value;
      if (rooms.length === 1) {
        const floor = allFloors.find(f => f.id === floorId);
        if (floor) {
          setSelectedFloor(floor);
        }
        setHighlightedRoom(rooms[0].id);
      }
    }
  }, [searchResults]);

  const handleFloorChange = (floor: Floor) => {
    setSelectedFloor(floor);
    setSearchQuery(''); // Clear search on floor change
    setHighlightedRoom(null); // Clear highlight on floor change
  };

  const handleRoomClick = useCallback((room: Room) => {
    setSelectedRoom(room);
    setIsRoomInfoDialogOpen(true);
  }, []);

  const handleRoomInfoDialogClose = useCallback(() => {
    setIsRoomInfoDialogOpen(false);
    setSelectedRoom(null);
  }, []);

  const handleAIRequest = useCallback(async (room: Room) => {
    // AI functionality is disabled
  }, []);

  const roomsForSelectedFloor = selectedFloor ? getRoomsForFloor(selectedFloor.id) : [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Floor Selection Sidebar */}
      <div className="w-64 bg-white p-4 shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Floors</h2>
        <ul>
          {allFloors.map(floor => (
            <li key={floor.id} className="mb-2">
              <button
                className={`w-full text-left py-2 px-4 rounded ${selectedFloor?.id === floor.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                onClick={() => handleFloorChange(floor)}
              >
                {floor.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Search Rooms</h2>
          <input
            type="text"
            placeholder="Enter room name or ID"
            className="w-full p-2 border rounded mb-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search Results */}
          {searchQuery && (
            <div className="bg-gray-50 p-2 rounded max-h-60 overflow-y-auto">
              {searchResults.size === 0 ? (
                <p>No results found</p>
              ) : (
                Array.from(searchResults.entries()).map(([floorId, rooms]) => (
                  <div key={floorId} className="mb-2">
                    <h4 className="font-semibold">{allFloors.find(f => f.id === floorId)?.name}</h4>
                    <ul>
                      {rooms.map(room => (
                        <li
                          key={room.id}
                          className="cursor-pointer hover:underline text-blue-600"
                          onClick={() => {
                            const floor = allFloors.find(f => f.id === floorId);
                            if (floor) {
                                setSelectedFloor(floor);
                            }
                            setHighlightedRoom(room.id);
                          }}
                        >
                          {room.name || room.id}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Floor Plan View */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {selectedFloor ? (
          <FloorPlan
            floorId={selectedFloor.id}
            highlightedRoomId={highlightedRoom}
            onRoomClick={(roomId) => {
              if (roomId) {
                const room = roomsForSelectedFloor.find(r => r.id === roomId);
                if (room) {
                  handleRoomClick(room);
                }
              }
            }}
            rooms={roomsForSelectedFloor}
          />
        ) : (
          <p>Select a floor to view the plan.</p>
        )}
      </div>

      <RoomInfoDialog
        open={isRoomInfoDialogOpen}
        onOpenChange={handleRoomInfoDialogClose}
        room={selectedRoom}
      />
    </div>
  );
};

export default FloorFinder;
