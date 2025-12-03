import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Room } from '@/lib/types';

// Hardcoded room data - this will be stored in Vercel KV on first access
const defaultRooms: Room[] = [
  // Start with empty rooms array - users can create their own
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

export async function POST(request: Request) {
  try {
    const newRoom = await request.json() as Room;

    // Validate required fields
    if (!newRoom.id || !newRoom.coords || !newRoom.floorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Try to get existing rooms from Vercel KV
      let rooms = await kv.get<Room[]>('rooms') || defaultRooms;

      // Add the new room
      rooms.push(newRoom);

      // Save back to KV
      await kv.set('rooms', rooms);

      return NextResponse.json(rooms);
    } catch (kvError) {
      // If KV is not configured (local development), just add to defaultRooms
      console.log("Vercel KV not configured, adding to in-memory rooms");
      defaultRooms.push(newRoom);
      return NextResponse.json(defaultRooms);
    }

  } catch (error) {
    console.error("Error adding room:", error);
    return NextResponse.json(
      { error: 'Failed to add room' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updatedRoom = await request.json() as Room;

    // Validate required fields
    if (!updatedRoom.id || !updatedRoom.coords || !updatedRoom.floorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Try to get existing rooms from Vercel KV
      let rooms = await kv.get<Room[]>('rooms') || defaultRooms;

      // Find and update the room
      const roomIndex = rooms.findIndex(room => room.id === updatedRoom.id);
      if (roomIndex === -1) {
        return NextResponse.json(
          { error: 'Room not found' },
          { status: 404 }
        );
      }

      rooms[roomIndex] = updatedRoom;

      // Save back to KV
      await kv.set('rooms', rooms);

      return NextResponse.json(rooms);
    } catch (kvError) {
      // If KV is not configured (local development), update in defaultRooms
      console.log("Vercel KV not configured, updating in-memory rooms");
      const roomIndex = defaultRooms.findIndex(room => room.id === updatedRoom.id);
      if (roomIndex > -1) {
        defaultRooms[roomIndex] = updatedRoom;
      }
      return NextResponse.json(defaultRooms);
    }

  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { roomId } = await request.json();

    if (!roomId) {
      return NextResponse.json(
        { error: 'Missing roomId' },
        { status: 400 }
      );
    }

    try {
      // Try to get existing rooms from Vercel KV
      let rooms = await kv.get<Room[]>('rooms') || defaultRooms;

      // Filter out the room to delete
      rooms = rooms.filter(room => room.id !== roomId);

      // Save back to KV
      await kv.set('rooms', rooms);

      return NextResponse.json(rooms);
    } catch (kvError) {
      // If KV is not configured (local development), filter from defaultRooms
      console.log("Vercel KV not configured, removing from in-memory rooms");
      const index = defaultRooms.findIndex(room => room.id === roomId);
      if (index > -1) {
        defaultRooms.splice(index, 1);
      }
      return NextResponse.json(defaultRooms);
    }

  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}
