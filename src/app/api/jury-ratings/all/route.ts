import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { JuryRating } from '../route';

// GET - Retrieve all ratings from all judges for the overall view
export async function GET() {
  try {
    const judgeIds = [
      'Judge 1', 'Judge 2', 'Judge 3', 'Judge 4', 'Judge 5',
      'Judge 6', 'Judge 7', 'Judge 8', 'Judge 9', 'Judge 10',
      'Judge 11', 'Judge 12', 'Judge 13', 'Judge 14', 'Judge 15'
    ];

    const allRatings: Record<string, Record<string, JuryRating>> = {};

    try {
      // Fetch ratings for all judges
      const promises = judgeIds.map(async (judgeId) => {
        try {
          const ratings = await kv.get<Record<string, JuryRating>>(`juryRatings_${judgeId}`) || {};
          return { judgeId, ratings };
        } catch (error) {
          console.log(`Failed to get ratings for ${judgeId}`);
          return { judgeId, ratings: {} };
        }
      });

      const results = await Promise.all(promises);

      results.forEach(({ judgeId, ratings }) => {
        allRatings[judgeId] = ratings;
      });

    } catch (kvError) {
      console.log("KV not available, returning empty ratings");
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