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

    console.log('[Floor API] PUT request:', { floorId, name });

    if (!floorId || !name) {
      console.error('[Floor API] Missing required fields:', { floorId, name });
      return NextResponse.json(
        { error: 'Missing floorId or name' },
        { status: 400 }
      );
    }

    try {
      // Get existing custom names
      const customFloorNames = await kv.get<Record<string, string>>('floorNames') || {};
      console.log('[Floor API] Current floor names:', customFloorNames);

      // Update the floor name
      customFloorNames[floorId] = name;
      console.log('[Floor API] Updated floor names:', customFloorNames);

      // Save back to KV
      await kv.set('floorNames', customFloorNames);
      console.log('[Floor API] Successfully saved to KV');

      // Return updated floors
      const floors = allFloors.map(floor => ({
        ...floor,
        name: customFloorNames[floor.id] || floor.name,
        isCustom: false
      }));

      console.log('[Floor API] Returning updated floors');
      return NextResponse.json({ success: true, floors });
    } catch (kvError) {
      // If KV is not configured (local development)
      console.error('[Floor API] KV error:', kvError);
      console.log('[Floor API] Vercel KV not configured, floor name update simulated');
      return NextResponse.json({ 
        success: false, 
        error: 'KV not configured',
        message: 'Floor names cannot be saved without Vercel KV' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[Floor API] Error updating floor name:', error);
    return NextResponse.json(
      { error: 'Failed to update floor name', details: String(error) },
      { status: 500 }
    );
  }
}
