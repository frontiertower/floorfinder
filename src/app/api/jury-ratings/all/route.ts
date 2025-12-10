import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import type { JuryRating } from '../route';

let redisClient: any = null;

async function getRedisClient() {
  if (!redisClient && process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      console.log("✅ Connected to Redis for jury ratings (all)");
    } catch (error) {
      console.error("❌ Failed to connect to Redis:", error);
      redisClient = null;
    }
  }
  return redisClient;
}

// GET - Retrieve all ratings from all jurors for the overall view
export async function GET() {
  try {
    const jurorIds = [
      'Juror 1', 'Juror 2', 'Juror 3', 'Juror 4', 'Juror 5',
      'Juror 6', 'Juror 7', 'Juror 8', 'Juror 9', 'Juror 10',
      'Juror 11', 'Juror 12', 'Juror 13', 'Juror 14', 'Juror 15'
    ];

    const allRatings: Record<string, Record<string, JuryRating>> = {};

    try {
      const redis = await getRedisClient();
      if (!redis) {
        console.log("Redis not available, returning empty ratings");
        return NextResponse.json({});
      }

      // Fetch ratings for all jurors
      const promises = jurorIds.map(async (jurorId) => {
        try {
          const ratingsData = await redis.get(`juryRatings_${jurorId}`);
          const ratings = ratingsData ? JSON.parse(ratingsData) : {};
          return { jurorId, ratings };
        } catch (error) {
          console.log(`Failed to get ratings for ${jurorId}`);
          return { jurorId, ratings: {} };
        }
      });

      const results = await Promise.all(promises);

      results.forEach(({ jurorId, ratings }) => {
        allRatings[jurorId] = ratings;
      });

    } catch (redisError) {
      console.error("Redis error:", redisError);
      return NextResponse.json({});
    }

    return NextResponse.json(allRatings);

  } catch (error) {
    console.error('Error retrieving all jury ratings:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve all ratings' },
      { status: 500 }
    );
  }
}