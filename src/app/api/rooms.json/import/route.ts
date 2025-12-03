import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import type { Room } from '@/lib/types';

let redisClient: any = null;

async function getRedisClient() {
  if (!redisClient && process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      redisClient = null;
    }
  }
  return redisClient;
}

export async function POST(request: Request) {
  try {
    const { rooms: importedRooms } = await request.json() as { rooms: Room[] };

    if (!importedRooms || !Array.isArray(importedRooms)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const redis = await getRedisClient();

    if (!redis) {
      console.log("Redis not configured, returning imported rooms");
      return NextResponse.json(importedRooms);
    }

    // Try to get existing rooms from Redis
    const roomsData = await redis.get('rooms');
    let existingRooms = roomsData ? JSON.parse(roomsData) : [];

    // Merge imported rooms with existing ones (replace duplicates by ID)
    const roomMap = new Map<string, Room>();

    // Add existing rooms first
    existingRooms.forEach((room: Room) => roomMap.set(room.id, room));

    // Override with imported rooms (will replace existing ones with same ID)
    importedRooms.forEach(room => {
      // Validate required fields
      if (room.id && room.coords && room.floorId) {
        roomMap.set(room.id, room);
      }
    });

    // Convert back to array
    const mergedRooms = Array.from(roomMap.values());

    // Save back to Redis
    await redis.set('rooms', JSON.stringify(mergedRooms));

    return NextResponse.json(mergedRooms);

  } catch (error) {
    console.error("Error importing rooms:", error);
    return NextResponse.json(
      { error: 'Failed to import rooms' },
      { status: 500 }
    );
  }
}