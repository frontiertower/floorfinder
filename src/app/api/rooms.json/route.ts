import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import type { Room } from '@/lib/types';

// Sample room data - this will be stored in Vercel KV on first access
const defaultRooms: Room[] = [
  // Sample rooms for floor 2
  {
    id: "201",
    name: "Conference Room A",
    teamName: "Product Team",
    type: "Conference Room",
    floorId: "2",
    color: "rgba(76, 175, 80, 0.5)",
    notes: "Large conference room with projector",
    coords: [100, 100, 200, 150]
  },
  {
    id: "202",
    name: "Open Workspace",
    teamName: "Engineering",
    type: "Open Workspace",
    floorId: "2",
    color: "rgba(33, 150, 243, 0.5)",
    notes: "Flexible seating area",
    coords: [350, 100, 150, 200]
  },
  // Sample rooms for floor 7 (Makerspace)
  {
    id: "701",
    name: "3D Printing Lab",
    teamName: "Hardware Team",
    type: "Training Room",
    floorId: "7",
    color: "rgba(255, 152, 0, 0.5)",
    notes: "Contains 3D printers and materials",
    coords: [50, 50, 180, 120]
  },
  {
    id: "702",
    name: "Electronics Workshop",
    teamName: "Robotics Team",
    type: "Training Room",
    floorId: "7",
    color: "rgba(156, 39, 176, 0.5)",
    notes: "Soldering stations and components",
    coords: [250, 50, 200, 120]
  },
  // Sample room for floor 12 (Ethereum House)
  {
    id: "1201",
    name: "Main Hack Space",
    teamName: "Blockchain Devs",
    type: "Collaboration Space",
    floorId: "12",
    color: "rgba(244, 67, 54, 0.5)",
    notes: "24/7 access for hackathon participants",
    coords: [100, 200, 300, 200]
  }
];

let redisClient: any = null;

async function getRedisClient() {
  if (!redisClient && process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      console.log("✅ Connected to Redis");
    } catch (error) {
      console.error("❌ Failed to connect to Redis:", error);
      redisClient = null;
    }
  }
  return redisClient;
}

export async function GET() {
  try {
    const redis = await getRedisClient();

    if (!redis) {
      console.log("⚠️  Redis not configured - rooms will not persist!");
      return NextResponse.json(defaultRooms);
    }

    // Try to get rooms from Redis
    const roomsData = await redis.get('rooms');
    let rooms = roomsData ? JSON.parse(roomsData) : null;

    // If no rooms exist, initialize with default data
    if (!rooms) {
      await redis.set('rooms', JSON.stringify(defaultRooms));
      rooms = defaultRooms;
    }

    return NextResponse.json(rooms);

  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(defaultRooms);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a bulk track update request
    if (body.action === 'updateTracks') {
      return await updateRoomTracks(body);
    }

    // Check if this is a bulk track update request for multiple teams
    if (body.action === 'bulkUpdateTracks' && Array.isArray(body.updates)) {
      return await bulkUpdateTracks(body.updates);
    }

    // Regular room creation
    const newRoom = body as Room;

    // Validate required fields
    if (!newRoom.id || !newRoom.coords || !newRoom.floorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const redis = await getRedisClient();

    if (!redis) {
      console.log("Redis not configured, adding to in-memory rooms");
      defaultRooms.push(newRoom);
      return NextResponse.json(defaultRooms);
    }

    // Get existing rooms from Redis
    const roomsData = await redis.get('rooms');
    let rooms = roomsData ? JSON.parse(roomsData) : defaultRooms;

    // Add the new room
    rooms.push(newRoom);

    // Save back to Redis
    await redis.set('rooms', JSON.stringify(rooms));

    return NextResponse.json(rooms);

  } catch (error) {
    console.error("Error adding room:", error);
    return NextResponse.json(
      { error: 'Failed to add room' },
      { status: 500 }
    );
  }
}

// Helper function to update tracks for a specific room
async function updateRoomTracks(updateData: {
  roomNumber: string;
  teamNumber: string;
  tracks: string;
  addonTracks: string;
}) {
  try {
    const redis = await getRedisClient();

    // Get existing rooms from Redis
    const roomsData = await redis.get('rooms');
    let rooms = roomsData ? JSON.parse(roomsData) : defaultRooms;

    // Find the room to update
    const roomIndex = rooms.findIndex((room: Room) => {
      return room.name === updateData.roomNumber || room.id === updateData.roomNumber;
    });

    if (roomIndex === -1) {
      return NextResponse.json(
        { error: `Room ${updateData.roomNumber} not found` },
        { status: 404 }
      );
    }

    // Update the room with tracks
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      tracks: updateData.tracks,
      addonTracks: updateData.addonTracks,
      teamNumber: updateData.teamNumber
    };

    // Save back to Redis
    if (redis) {
      await redis.set('rooms', JSON.stringify(rooms));
    }

    console.log(`Updated tracks for room ${updateData.roomNumber} (${updateData.teamNumber})`);

    return NextResponse.json({
      success: true,
      message: `Updated tracks for room ${updateData.roomNumber}`,
      room: rooms[roomIndex]
    });

  } catch (error) {
    console.error("Error updating room tracks:", error);
    return NextResponse.json(
      { error: 'Failed to update room tracks' },
      { status: 500 }
    );
  }
}

// Helper function to bulk update tracks for multiple rooms
async function bulkUpdateTracks(updates: Array<{
  roomNumber: string;
  teamNumber: string;
  tracks: string;
  addonTracks: string;
}>) {
  try {
    const redis = await getRedisClient();

    // Get existing rooms from Redis
    const roomsData = await redis.get('rooms');
    let rooms = roomsData ? JSON.parse(roomsData) : defaultRooms;

    let updatedCount = 0;
    const updateResults: Array<{room: string, success: boolean, message: string}> = [];

    for (const update of updates) {
      // Find the room to update
      const roomIndex = rooms.findIndex((room: Room) => {
        return room.name === update.roomNumber || room.id === update.roomNumber;
      });

      if (roomIndex === -1) {
        updateResults.push({
          room: update.roomNumber,
          success: false,
          message: `Room ${update.roomNumber} not found`
        });
        continue;
      }

      // Update the room with tracks
      rooms[roomIndex] = {
        ...rooms[roomIndex],
        tracks: update.tracks,
        addonTracks: update.addonTracks,
        teamNumber: update.teamNumber
      };

      updatedCount++;
      updateResults.push({
        room: update.roomNumber,
        success: true,
        message: `Updated tracks for ${update.teamNumber}`
      });
    }

    // Save back to Redis
    if (redis) {
      await redis.set('rooms', JSON.stringify(rooms));
    }

    console.log(`Bulk updated tracks for ${updatedCount} rooms`);

    return NextResponse.json({
      success: true,
      message: `Updated tracks for ${updatedCount} rooms`,
      results: updateResults,
      updatedCount
    });

  } catch (error) {
    console.error("Error bulk updating room tracks:", error);
    return NextResponse.json(
      { error: 'Failed to bulk update room tracks' },
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

    const redis = await getRedisClient();

    if (!redis) {
      console.log("Redis not configured, updating in-memory rooms");
      const roomIndex = defaultRooms.findIndex(room => room.id === updatedRoom.id);
      if (roomIndex > -1) {
        defaultRooms[roomIndex] = updatedRoom;
      }
      return NextResponse.json(defaultRooms);
    }

    // Get existing rooms from Redis
    const roomsData = await redis.get('rooms');
    let rooms = roomsData ? JSON.parse(roomsData) : defaultRooms;

    // Find and update the room
    const roomIndex = rooms.findIndex((room: Room) => room.id === updatedRoom.id);
    if (roomIndex === -1) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    rooms[roomIndex] = updatedRoom;

    // Save back to Redis
    await redis.set('rooms', JSON.stringify(rooms));

    return NextResponse.json(rooms);

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

    const redis = await getRedisClient();

    if (!redis) {
      console.log("Redis not configured, removing from in-memory rooms");
      const index = defaultRooms.findIndex(room => room.id === roomId);
      if (index > -1) {
        defaultRooms.splice(index, 1);
      }
      return NextResponse.json(defaultRooms);
    }

    // Get existing rooms from Redis
    const roomsData = await redis.get('rooms');
    let rooms = roomsData ? JSON.parse(roomsData) : defaultRooms;

    // Filter out the room to delete
    rooms = rooms.filter((room: Room) => room.id !== roomId);

    // Save back to Redis
    await redis.set('rooms', JSON.stringify(rooms));

    return NextResponse.json(rooms);

  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}
