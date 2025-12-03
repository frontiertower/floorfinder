import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Check if KV environment variables are present
    const kvConfigured = !!(
      process.env.KV_URL &&
      process.env.KV_REST_API_URL &&
      process.env.KV_REST_API_TOKEN
    );

    if (!kvConfigured) {
      return NextResponse.json({
        status: 'warning',
        message: 'Vercel KV not configured - data will not persist across deployments',
        kv_configured: false,
        env_vars: {
          KV_URL: !!process.env.KV_URL,
          KV_REST_API_URL: !!process.env.KV_REST_API_URL,
          KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
        }
      });
    }

    // Test KV connection
    try {
      await kv.ping();
      return NextResponse.json({
        status: 'success',
        message: 'Vercel KV is properly configured and accessible',
        kv_configured: true,
      });
    } catch (kvError) {
      return NextResponse.json({
        status: 'error',
        message: 'Vercel KV is configured but not accessible',
        kv_configured: true,
        error: 'Connection failed'
      });
    }

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unable to check KV status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}