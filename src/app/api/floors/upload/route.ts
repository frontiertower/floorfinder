import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import type { Floor } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const level = formData.get('level') as string;

    if (!file || !name || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only SVG, PNG, and JPEG files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique floor ID
    const floorId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'floors');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${floorId}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Create floor object
    const newFloor: Floor & { imageUrl: string; isCustom: boolean } = {
      id: floorId,
      name: name.trim(),
      level: parseInt(level),
      imageUrl: `/uploads/floors/${fileName}`,
      isCustom: true
    };

    try {
      // Store in KV
      const existingFloors = await kv.get<(Floor & { imageUrl?: string; isCustom?: boolean })[]>('customFloors') || [];
      const updatedFloors = [...existingFloors, newFloor];
      await kv.set('customFloors', updatedFloors);
    } catch (kvError) {
      console.log("KV not available, floor saved locally only");
    }

    return NextResponse.json({
      success: true,
      floor: newFloor,
      message: 'Floor uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload floor plan' },
      { status: 500 }
    );
  }
}