import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { Floor } from '@/lib/types';
import { allFloors } from '@/lib/config';

// Store custom floor names and custom floors
export async function GET() {
  try {
    const customFloorNames = await kv.get<Record<string, string>>('floorNames') || {};
    const customFloors = await kv.get<(Floor & { imageUrl?: string; isCustom?: boolean })[]>('customFloors') || [];

    // Merge custom names with default floors
    const defaultFloors = allFloors.map(floor => ({
      ...floor,
      name: customFloorNames[floor.id] || floor.name,
      isCustom: false
    }));

    // Combine default and custom floors, sort by level
    const allCombinedFloors = [...defaultFloors, ...customFloors].sort((a, b) => a.level - b.level);

    return NextResponse.json(allCombinedFloors);
  } catch (error) {
    // If KV is not configured, return default floors
    console.log("Vercel KV not configured, using default floors");
    const defaultFloors = allFloors.map(floor => ({ ...floor, isCustom: false }));
    return NextResponse.json(defaultFloors);
  }
}

export async function PUT(request: Request) {
  try {
    const { floorId, name } = await request.json();

    if (!floorId || !name) {
      return NextResponse.json(
        { error: 'Missing floorId or name' },
        { status: 400 }
      );
    }

    try {
      // Get existing custom names
      const customFloorNames = await kv.get<Record<string, string>>('floorNames') || {};

      // Update the floor name
      customFloorNames[floorId] = name;

      // Save back to KV
      await kv.set('floorNames', customFloorNames);

      // Return updated floors
      const floors = allFloors.map(floor => ({
        ...floor,
        name: customFloorNames[floor.id] || floor.name
      }));

      return NextResponse.json(floors);
    } catch (kvError) {
      // If KV is not configured (local development), just return success
      console.log("Vercel KV not configured, floor name update simulated");
      return NextResponse.json({ success: true });
    }

  } catch (error) {
    console.error("Error updating floor name:", error);
    return NextResponse.json(
      { error: 'Failed to update floor name' },
      { status: 500 }
    );
  }
}