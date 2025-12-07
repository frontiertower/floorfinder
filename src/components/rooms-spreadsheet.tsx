'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Upload } from 'lucide-react';
import type { Room, Floor } from '@/lib/types';
import { allFloors } from '@/lib/config';
import { ROOM_TYPES } from '@/lib/types';
import { RoomOptionsDialog } from './room-options-dialog';

interface RoomsSpreadsheetProps {
  rooms: Room[];
  customFloorNames: Record<string, string>;
  isEditMode?: boolean;
  onRoomUpdate?: (room: Room) => void;
  onRoomDelete?: (roomId: string) => void;
  onRoomsImport?: (rooms: Room[]) => void;
}

export function RoomsSpreadsheet({ rooms, customFloorNames, isEditMode = false, onRoomUpdate, onRoomDelete, onRoomsImport }: RoomsSpreadsheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string>('all');

  const roomsWithFloorData = useMemo(() => {
    return rooms.map(room => {
      const floor = allFloors.find(f => f.id === room.floorId?.replace('floor-', ''));
      const floorName = customFloorNames[room.floorId || ''] || floor?.name || 'Unknown';

      // Calculate room size (area) from coordinates
      const coords = room.coords || [0, 0, 0, 0];
      const [x, y, width, height] = coords.map(c => c ?? 0);
      const area = width * height;

      return {
        ...room,
        floorName,
        floorLevel: floor?.level || 0,
        area: area.toFixed(1),
        dimensions: `${width.toFixed(1)} × ${height.toFixed(1)}`
      };
    });
  }, [rooms, customFloorNames]);

  const importCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      const lines = text.split('\n');

      // Skip header row
      const dataLines = lines.slice(1).filter(line => line.trim());

      const importedRooms: Room[] = [];

      dataLines.forEach((line, index) => {
        // Parse CSV line (handle quoted values)
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 10) {
          console.warn(`Skipping line ${index + 2}: insufficient columns (${matches?.length || 0}/10)`);
          return;
        }

        // Clean up values (remove quotes)
        const values = matches.map(val => val.replace(/^"|"$/g, ''));

        // Debug log the coordinates parsing
        console.log(`Parsing line ${index + 2}:`, {
          originalCoords: values[9],
          roomId: values[0],
          roomName: values[1]
        });

        // Parse coordinates array
        let coords: [number, number, number, number];
        try {
          // Handle multiple formats: ""[x, y, w, h]"", "[x, y, w, h]", "x, y, w, h"
          let coordsStr = values[9];

          // Remove outer quotes first (handles both single and double quotes)
          while ((coordsStr.startsWith('"') && coordsStr.endsWith('"')) ||
                 (coordsStr.startsWith("'") && coordsStr.endsWith("'"))) {
            coordsStr = coordsStr.slice(1, -1);
          }

          // Remove brackets if present
          if (coordsStr.startsWith('[') && coordsStr.endsWith(']')) {
            coordsStr = coordsStr.slice(1, -1);
          }

          const coordsArr = coordsStr.split(',').map(c => parseFloat(c.trim()));
          console.log(`Parsed coordinates for ${values[0]}:`, {
            original: values[8],
            cleaned: coordsStr,
            parsed: coordsArr,
            types: coordsArr.map(c => typeof c),
            isNaN: coordsArr.map(c => isNaN(c))
          });

          if (coordsArr.length !== 4) {
            console.warn(`Wrong number of coordinates for ${values[0]}: expected 4, got ${coordsArr.length}`);
            return;
          }

          if (coordsArr.some(isNaN)) {
            console.warn(`NaN coordinates found for ${values[0]}:`, coordsArr);
            return;
          }

          // Additional validation: all coordinates should be finite numbers
          if (coordsArr.some(c => !Number.isFinite(c))) {
            console.warn(`Non-finite coordinates for ${values[0]}:`, coordsArr);
            return;
          }

          console.log(`✅ Valid coordinates for ${values[0]}:`, coordsArr);
          coords = coordsArr as [number, number, number, number];
        } catch (error) {
          console.error(`Error parsing coordinates for ${values[0]}:`, error);
          return;
        }

        // Find floor ID from floor name
        let floorId = '';
        for (const floor of allFloors) {
          const floorName = customFloorNames[floor.id] || floor.name;
          if (floorName === values[4]) {
            floorId = floor.id;
            break;
          }
        }

        if (!floorId) return;

        const room: Room = {
          id: values[0],
          name: values[1] || 'Unnamed Room',
          teamName: values[2] || undefined,
          type: values[3] || undefined,
          floorId,
          color: values[7] || 'rgba(76, 175, 80, 0.5)',
          notes: values[8] || undefined,
          coords
        };

        importedRooms.push(room);
      });

      if (importedRooms.length > 0 && onRoomsImport) {
        onRoomsImport(importedRooms);
      }
    };

    input.click();
  };

  const exportToCSV = () => {
    const headers = [
      'Room ID',
      'Name',
      'Team Name',
      'Type',
      'Floor',
      'Dimensions',
      'Area',
      'Color',
      'Notes',
      'Coordinates'
    ];

    const csvData = filteredAndSortedRooms.map(room => [
      room.id,
      room.name,
      room.teamName || '',
      room.type || '',
      room.floorName,
      room.dimensions,
      room.area,
      room.color,
      room.notes || '',
      `"[${room.coords ? room.coords.map(c => (c ?? 0).toFixed(1)).join(', ') : '0.0, 0.0, 0.0, 0.0'}]"`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'rooms_data.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const filteredAndSortedRooms = useMemo(() => {
    let filtered = roomsWithFloorData;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = roomsWithFloorData.filter(room =>
        room.name.toLowerCase().includes(query) ||
        room.id.toLowerCase().includes(query) ||
        (room.teamName && room.teamName.toLowerCase().includes(query)) ||
        (room.type && room.type.toLowerCase().includes(query)) ||
        (room.notes && room.notes.toLowerCase().includes(query)) ||
        room.floorName.toLowerCase().includes(query)
      );
    }

    // Sort by floor level first, then by room name
    return filtered.sort((a, b) => {
      if (a.floorLevel !== b.floorLevel) {
        return a.floorLevel - b.floorLevel;
      }
      return a.name.localeCompare(b.name);
    });
  }, [roomsWithFloorData, searchQuery]);

  const handleRoomClick = (room: Room) => {
    if (isEditMode) {
      setSelectedRoom(room);
      setShowOptionsDialog(true);
    }
  };

  const handleRoomUpdate = (updatedRoom: Room) => {
    if (onRoomUpdate) {
      onRoomUpdate(updatedRoom);
    }
    setSelectedRoom(null);
    setShowOptionsDialog(false);
  };

  const handleRoomDelete = () => {
    if (selectedRoom && onRoomDelete) {
      onRoomDelete(selectedRoom.id);
    }
    setSelectedRoom(null);
    setShowOptionsDialog(false);
  };

  const totalRooms = rooms.length;
  const totalTeams = roomsWithFloorData.filter(room => room.teamName && room.teamName.trim()).length;

  // Calculate available rooms by floor (rooms without team names)
  const availableFloorCounts = useMemo(() => {
    return roomsWithFloorData
      .filter(room => !room.teamName || !room.teamName.trim()) // Only available rooms
      .filter(room => selectedRoomType === 'all' || room.type === selectedRoomType) // Filter by room type
      .reduce((acc, room) => {
        acc[room.floorName] = (acc[room.floorName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  }, [roomsWithFloorData, selectedRoomType]);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        <div className="bg-card p-2 sm:p-3 md:p-4 rounded-lg border">
          <h3 className="font-semibold text-xs sm:text-sm md:text-lg">Total Rooms</h3>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{totalRooms}</p>
        </div>
        <div className="bg-card p-2 sm:p-3 md:p-4 rounded-lg border">
          <h3 className="font-semibold text-xs sm:text-sm md:text-lg">Total Teams</h3>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{totalTeams}</p>
        </div>
        <div className="bg-card p-2 sm:p-3 md:p-4 rounded-lg border">
          <h3 className="font-semibold text-xs sm:text-sm md:text-lg">Rooms with Teams</h3>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{totalRooms > 0 ? Math.round((totalTeams / totalRooms) * 100) : 0}%</p>
        </div>
      </div>

      {/* Available Rooms by Floor */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
          <h3 className="font-semibold text-lg">Available Rooms by Floor</h3>
          <div className="w-full sm:w-48">
            <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Room Types</SelectItem>
                {ROOM_TYPES.map((roomType) => (
                  <SelectItem key={roomType} value={roomType}>
                    {roomType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(availableFloorCounts).map(([floorName, count]) => (
            <div key={floorName} className="text-sm">
              <span className="font-medium">{floorName}:</span> {count}
            </div>
          ))}
          {Object.keys(availableFloorCounts).length === 0 && (
            <div className="col-span-full text-center text-muted-foreground text-sm py-4">
              {selectedRoomType === 'all' ? 'No available rooms found' : `No available ${selectedRoomType.toLowerCase()} rooms found`}
            </div>
          )}
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-3 md:p-4 border-b space-y-3 md:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <h3 className="font-semibold text-lg md:text-xl">All Rooms</h3>
              {isEditMode && (
                <p className="text-xs md:text-sm text-muted-foreground">Tap any row to edit room details</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              {isEditMode && onRoomsImport && (
                <Button onClick={importCSV} variant="outline" size="sm" className="w-full sm:w-auto text-xs md:text-sm">
                  <Upload className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Import CSV
                </Button>
              )}
              <Button onClick={exportToCSV} variant="outline" size="sm" className="w-full sm:w-auto text-xs md:text-sm">
                <Download className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                Export CSV
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms, teams, floors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm md:text-base"
            />
          </div>
          {searchQuery && (
            <p className="text-xs md:text-sm text-muted-foreground">
              Showing {filteredAndSortedRooms.length} of {totalRooms} rooms
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 hidden md:table-cell">Room ID</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4">Room</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4">Team</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 hidden sm:table-cell">Type</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 hidden sm:table-cell">Floor</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 sm:hidden">Floor#</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 hidden md:table-cell">Size</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 hidden lg:table-cell">Area</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 hidden lg:table-cell">Color</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 hidden xl:table-cell">Notes</TableHead>
                <TableHead className="text-xs md:text-sm px-2 md:px-4 hidden xl:table-cell">Coordinates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRooms.map((room) => (
                <TableRow
                  key={room.id}
                  className={isEditMode ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => handleRoomClick(room)}
                >
                  <TableCell className="font-mono text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 hidden md:table-cell">{room.id}</TableCell>
                  <TableCell className="font-medium text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{room.name}</TableCell>
                  <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3">{room.teamName || '-'}</TableCell>
                  <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 hidden sm:table-cell">{room.type || '-'}</TableCell>
                  <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 hidden sm:table-cell">{room.floorName}</TableCell>
                  <TableCell className="text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 sm:hidden">{room.floorLevel}</TableCell>
                  <TableCell className="font-mono text-xs px-2 md:px-4 py-2 md:py-3 hidden md:table-cell">{room.dimensions}</TableCell>
                  <TableCell className="font-mono text-xs px-2 md:px-4 py-2 md:py-3 hidden lg:table-cell">{room.area}</TableCell>
                  <TableCell className="px-2 md:px-4 py-2 md:py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div
                        className="w-3 h-3 md:w-4 md:h-4 border border-gray-300 rounded"
                        style={{ backgroundColor: room.color }}
                        title={room.color}
                      />
                      <span className="text-xs text-muted-foreground hidden xl:inline">{room.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs px-2 md:px-4 py-2 md:py-3 hidden xl:table-cell" title={room.notes}>
                    {room.notes || '-'}
                  </TableCell>
                  <TableCell className="font-mono text-xs px-2 md:px-4 py-2 md:py-3 hidden xl:table-cell">
                    [{room.coords ? room.coords.map(c => (c ?? 0).toFixed(1)).join(', ') : '0.0, 0.0, 0.0, 0.0'}]
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedRooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-6 md:py-8 text-sm">
                    {searchQuery ? 'No rooms found matching your search' : 'No rooms found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Room Options Dialog for Edit Mode */}
      <RoomOptionsDialog
        isOpen={showOptionsDialog}
        onClose={() => {
          setShowOptionsDialog(false);
          setSelectedRoom(null);
        }}
        onSave={handleRoomUpdate}
        onDelete={handleRoomDelete}
        room={selectedRoom}
      />
    </div>
  );
}