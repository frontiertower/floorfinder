import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';
import type { Floor } from '@/lib/types';
import { allFloors } from '@/lib/config';

// Store custom floor names and custom floors
export async function GET() {
  try {
    const redis = await getRedisClient();
    
    const customFloorNamesStr = await redis.get('floorNames');
    const customFloorNames = customFloorNamesStr ? JSON.parse(customFloorNamesStr) : {};
    
    const customFloorsStr = await redis.get('customFloors');
    const customFloors = customFloorsStr ? JSON.parse(customFloorsStr) : [];

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
    console.error('[Floor API GET] Redis error:', error);
    // If Redis is not configured, return default floors
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
      const redis = await getRedisClient();
      
      // Get existing custom names
      const customFloorNamesStr = await redis.get('floorNames');
      const customFloorNames = customFloorNamesStr ? JSON.parse(customFloorNamesStr) : {};
      console.log('[Floor API] Current floor names:', customFloorNames);

      // Update the floor name
      customFloorNames[floorId] = name;
      console.log('[Floor API] Updated floor names:', customFloorNames);

      // Save back to Redis
      await redis.set('floorNames', JSON.stringify(customFloorNames));
      console.log('[Floor API] Successfully saved to Redis');

      // Return updated floors
      const floors = allFloors.map(floor => ({
        ...floor,
        name: customFloorNames[floor.id] || floor.name,
        isCustom: false
      }));

      console.log('[Floor API] Returning updated floors');
      return NextResponse.json({ success: true, floors });
    } catch (redisError) {
      console.error('[Floor API] Redis error:', redisError);
      return NextResponse.json({ 
        success: false, 
        error: 'Redis not configured',
        message: 'Floor names cannot be saved without Redis connection' 
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
