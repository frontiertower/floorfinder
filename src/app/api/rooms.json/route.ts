import { NextResponse } from 'next/server';
import { initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { Room } from '@/lib/types';

// IMPORTANT: Replace the placeholder in your .env file
// with your actual Firebase service account JSON.
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountString) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set. Please update your .env file.');
}
const serviceAccount = JSON.parse(serviceAccountString);

// Initialize Firebase Admin SDK if not already initialized
// and get a reference to the app.
try {
  getApp();
} catch (error) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

// Get a reference to the Firestore database
const db = getFirestore('frontier-tower');

export async function GET() {
  try {

    const roomsCollection = db.collection('rooms');
    const snapshot = await roomsCollection.get();

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const rooms: Room[] = [];
    snapshot.forEach(doc => {
      // Assuming doc.data() matches the Room type structure
      const roomData = doc.data() as Omit<Room, 'id'>;
      rooms.push({
        id: doc.id,
        ...roomData
      });
    });

    return NextResponse.json(rooms);

  } catch (error) {
    console.error("Error fetching rooms from Firestore:", error);
    // It's good practice to not expose detailed error messages to the client
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
