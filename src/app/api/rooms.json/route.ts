import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Room } from '@/lib/types';

// Hardcoded room data - this will be stored in Vercel KV on first access
const defaultRooms: Room[] = [
  // Floor 1 rooms
  { id: "101", name: "Conference Room A", color: "#4CAF50", coords: [100, 100, 200, 150], floorId: "floor-1" },
  { id: "102", name: "Office Space", color: "#2196F3", coords: [250, 100, 350, 150], floorId: "floor-1" },
  { id: "103", name: "Break Room", color: "#FF9800", coords: [100, 200, 200, 250], floorId: "floor-1" },

  // Floor 2 rooms
  { id: "201", name: "Executive Suite", color: "#9C27B0", coords: [100, 100, 250, 200], floorId: "floor-2" },
  { id: "202", name: "Meeting Room B", color: "#4CAF50", coords: [300, 100, 400, 150], floorId: "floor-2" },

  // Add more rooms as needed for other floors
];

export async function GET() {
  try {
    // Try to get rooms from Vercel KV
    let rooms = await kv.get<Room[]>('rooms');

    // If no rooms exist in KV, initialize with default data
    if (!rooms) {
      await kv.set('rooms', defaultRooms);
      rooms = defaultRooms;
    }

    return NextResponse.json(rooms);

  } catch (error) {
    // If KV is not configured (local development), return default rooms
    console.log("Vercel KV not configured, using default rooms");
    return NextResponse.json(defaultRooms);
  }
}
