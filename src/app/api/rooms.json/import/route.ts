import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Room } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { rooms: importedRooms } = await request.json() as { rooms: Room[] };

    if (!importedRooms || !Array.isArray(importedRooms)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    try {
      // Try to get existing rooms from Vercel KV
      let existingRooms = await kv.get<Room[]>('rooms') || [];

      // Merge imported rooms with existing ones (replace duplicates by ID)
      const roomMap = new Map<string, Room>();

      // Add existing rooms first
      existingRooms.forEach(room => roomMap.set(room.id, room));

      // Override with imported rooms (will replace existing ones with same ID)
      importedRooms.forEach(room => {
        // Validate required fields
        if (room.id && room.coords && room.floorId) {
          roomMap.set(room.id, room);
        }
      });

      // Convert back to array
      const mergedRooms = Array.from(roomMap.values());

      // Save back to KV
      await kv.set('rooms', mergedRooms);

      return NextResponse.json(mergedRooms);
    } catch (kvError) {
      // If KV is not configured (local development), just return the imported rooms
      console.log("Vercel KV not configured, returning imported rooms");
      return NextResponse.json(importedRooms);
    }

  } catch (error) {
    console.error("Error importing rooms:", error);
    return NextResponse.json(
      { error: 'Failed to import rooms' },
      { status: 500 }
    );
  }
}