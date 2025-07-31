
"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { allFloors, getRoomsForFloor } from '@/lib/floor-data';
import type { Room, Floor } from '@/lib/types';
import { Search } from 'lucide-react';

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
          (room.name && room.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

  const roomsForSelectedFloor = selectedFloor ? getRoomsForFloor(selectedFloor.id) : [];
  
  // Flatten search results for rendering
  const flatSearchResults = Array.from(searchResults.entries()).flatMap(([floorId, rooms]) => {
      const floor = allFloors.find(f => f.id === floorId);
      return rooms.map(room => ({ ...room, floorName: floor?.name || 'Unknown' }));
  });


  return (
    <div className="flex h-screen bg-background">
      {/* Floor Selection Sidebar */}
      <div className="w-64 bg-white p-4 shadow-md flex flex-col">
        <h1 className="text-3xl font-headline text-center mb-4">FloorFinder</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by room name or ID..."
            className="w-full p-2 pl-8 border rounded mb-2 border-accent ring-1 ring-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto">
          {searchQuery ? (
            <div>
              {flatSearchResults.length === 0 ? (
                <p className="text-muted-foreground p-4 text-center">No results found.</p>
              ) : (
                <ul>
                  {flatSearchResults.map(room => (
                    <li key={room.id} className="mb-2">
                      <button
                        className="w-full text-left p-2 rounded hover:bg-gray-100"
                        onClick={() => {
                          const floor = allFloors.find(f => f.id === room.floorId);
                          if (floor) {
                            setSelectedFloor(floor);
                          }
                          setHighlightedRoom(room.id);
                        }}
                      >
                        <div className="font-bold">{room.name} [{room.id}]</div>
                        <div className="text-sm text-muted-foreground">{room.floorName}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-2">Floors</h2>
              <ul className="overflow-y-auto">
                {allFloors.map(floor => (
                  <li key={floor.id} className="mb-2">
                    <button
                      className={`w-full text-left py-2 px-4 rounded ${selectedFloor?.id === floor.id ? 'bg-primary/20 text-primary-foreground' : 'hover:bg-gray-200'}`}
                      onClick={() => handleFloorChange(floor)}
                    >
                      {floor.name}
                    </button>
                  </li>
                ))}
              </ul>
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
