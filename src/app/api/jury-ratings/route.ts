import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

export interface JuryRating {
  teamKey: string;
  judgeId: string;
  teamName: string;
  teamNumber: string;
  projectName: string;
  roomNumber: string;
  tracks: string;
  addonTracks: string;
  concept: number;
  quality: number;
  implementation: number;
  passthroughCameraAPI: number;
  immersiveEntertainment: number;
  handTracking: number;
  mrAndVR: number;
  projectUpgrade: number;
  notes: string;
  total: number;
  lastUpdated: string;
}

let redisClient: any = null;

async function getRedisClient() {
  if (!redisClient && process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      console.log("✅ Connected to Redis for jury ratings");
    } catch (error) {
      console.error("❌ Failed to connect to Redis:", error);
      redisClient = null;
    }
  }
  return redisClient;
}

// GET - Retrieve all ratings for a specific juror
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const judgeId = searchParams.get('judgeId');

    if (!judgeId) {
      return NextResponse.json(
        { error: 'Missing judgeId parameter' },
        { status: 400 }
      );
    }

    try {
      const redis = await getRedisClient();
      if (!redis) {
        console.log("Redis not available, returning empty ratings");
        return NextResponse.json({});
      }

      const ratingsData = await redis.get(`juryRatings_${judgeId}`);
      const ratings = ratingsData ? JSON.parse(ratingsData) : {};
      return NextResponse.json(ratings);
    } catch (redisError) {
      console.log("Redis error, returning empty ratings:", redisError);
      return NextResponse.json({});
    }

  } catch (error) {
    console.error('Error retrieving jury ratings:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve ratings' },
      { status: 500 }
    );
  }
}

// POST - Save or update ratings for a specific juror
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judgeId, ratings } = body;

    if (!judgeId || !ratings) {
      return NextResponse.json(
        { error: 'Missing judgeId or ratings data' },
        { status: 400 }
      );
    }

    // Add lastUpdated timestamp to each rating
    const timestampedRatings: Record<string, JuryRating> = {};
    Object.keys(ratings).forEach(teamKey => {
      timestampedRatings[teamKey] = {
        ...ratings[teamKey],
        lastUpdated: new Date().toISOString()
      };
    });

    try {
      const redis = await getRedisClient();
      if (!redis) {
        console.log("Redis not available, cannot save");
        return NextResponse.json({
          success: false,
          message: 'Database connection unavailable',
          count: 0
        }, { status: 503 });
      }

      await redis.set(`juryRatings_${judgeId}`, JSON.stringify(timestampedRatings));

      return NextResponse.json({
        success: true,
        message: 'Ratings saved successfully',
        count: Object.keys(timestampedRatings).length
      });
    } catch (redisError) {
      console.error("Redis save error:", redisError);
      return NextResponse.json({
        success: false,
        message: 'Failed to save ratings',
        error: redisError.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error saving jury ratings:', error);
    return NextResponse.json(
      { error: 'Failed to save ratings' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific team rating for a juror
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { judgeId, teamKey, rating } = body;

    if (!judgeId || !teamKey || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: judgeId, teamKey, or rating' },
        { status: 400 }
      );
    }

    try {
      const redis = await getRedisClient();
      if (!redis) {
        console.log("Redis not available, cannot update");
        return NextResponse.json({
          success: false,
          message: 'Database connection unavailable'
        }, { status: 503 });
      }

      // Get existing ratings
      const existingData = await redis.get(`juryRatings_${judgeId}`);
      const existingRatings = existingData ? JSON.parse(existingData) : {};

      // Update the specific team rating
      existingRatings[teamKey] = {
        ...rating,
        lastUpdated: new Date().toISOString()
      };

      // Save back to Redis
      await redis.set(`juryRatings_${judgeId}`, JSON.stringify(existingRatings));

      return NextResponse.json({
        success: true,
        message: 'Rating updated successfully',
        rating: existingRatings[teamKey]
      });
    } catch (redisError) {
      console.error("Redis update error:", redisError);
      return NextResponse.json({
        success: false,
        message: 'Failed to update rating',
        error: redisError.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error updating jury rating:', error);
    return NextResponse.json(
      { error: 'Failed to update rating' },
      { status: 500 }
    );
  }
}

// DELETE - Remove all ratings for a juror (optional, for cleanup)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const judgeId = searchParams.get('judgeId');

    if (!judgeId) {
      return NextResponse.json(
        { error: 'Missing judgeId parameter' },
        { status: 400 }
      );
    }

    try {
      const redis = await getRedisClient();
      if (!redis) {
        console.log("Redis not available, cannot delete");
        return NextResponse.json({
          success: false,
          message: 'Database connection unavailable'
        }, { status: 503 });
      }

      await redis.del(`juryRatings_${judgeId}`);

      return NextResponse.json({
        success: true,
        message: `Ratings deleted for judge ${judgeId}`
      });
    } catch (redisError) {
      console.error("Redis delete error:", redisError);
      return NextResponse.json({
        success: false,
        message: 'Failed to delete ratings',
        error: redisError.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error deleting jury ratings:', error);
    return NextResponse.json(
      { error: 'Failed to delete ratings' },
      { status: 500 }
    );
  }
}