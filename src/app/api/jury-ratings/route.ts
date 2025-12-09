import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

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
  notes: string;
  total: number;
  lastUpdated: string;
}

// GET - Retrieve all ratings for a specific judge
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
      const ratings = await kv.get<Record<string, JuryRating>>(`juryRatings_${judgeId}`) || {};
      return NextResponse.json(ratings);
    } catch (kvError) {
      console.log("KV not available, returning empty ratings");
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

// POST - Save or update ratings for a specific judge
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
      await kv.set(`juryRatings_${judgeId}`, timestampedRatings);

      return NextResponse.json({
        success: true,
        message: 'Ratings saved successfully',
        count: Object.keys(timestampedRatings).length
      });
    } catch (kvError) {
      console.log("KV not available, simulating save");
      return NextResponse.json({
        success: true,
        message: 'Ratings saved (local simulation)',
        count: Object.keys(timestampedRatings).length
      });
    }

  } catch (error) {
    console.error('Error saving jury ratings:', error);
    return NextResponse.json(
      { error: 'Failed to save ratings' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific team rating for a judge
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
      // Get existing ratings
      const existingRatings = await kv.get<Record<string, JuryRating>>(`juryRatings_${judgeId}`) || {};

      // Update the specific team rating
      existingRatings[teamKey] = {
        ...rating,
        lastUpdated: new Date().toISOString()
      };

      // Save back to KV
      await kv.set(`juryRatings_${judgeId}`, existingRatings);

      return NextResponse.json({
        success: true,
        message: 'Rating updated successfully',
        rating: existingRatings[teamKey]
      });
    } catch (kvError) {
      console.log("KV not available, simulating update");
      return NextResponse.json({
        success: true,
        message: 'Rating updated (local simulation)',
        rating: { ...rating, lastUpdated: new Date().toISOString() }
      });
    }

  } catch (error) {
    console.error('Error updating jury rating:', error);
    return NextResponse.json(
      { error: 'Failed to update rating' },
      { status: 500 }
    );
  }
}

// DELETE - Remove all ratings for a judge (optional, for cleanup)
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
      await kv.del(`juryRatings_${judgeId}`);

      return NextResponse.json({
        success: true,
        message: `Ratings deleted for judge ${judgeId}`
      });
    } catch (kvError) {
      console.log("KV not available, simulating delete");
      return NextResponse.json({
        success: true,
        message: `Ratings deleted for judge ${judgeId} (local simulation)`
      });
    }

  } catch (error) {
    console.error('Error deleting jury ratings:', error);
    return NextResponse.json(
      { error: 'Failed to delete ratings' },
      { status: 500 }
    );
  }
}