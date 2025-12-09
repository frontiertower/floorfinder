import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import type { JuryRating } from '../route';

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
      // Fetch ratings for all jurors
      const promises = jurorIds.map(async (jurorId) => {
        try {
          const ratings = await kv.get<Record<string, JuryRating>>(`juryRatings_${jurorId}`) || {};
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