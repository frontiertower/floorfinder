import { createClient } from 'redis';

let client: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', (err) => console.error('Redis Client Error', err));
    
    await client.connect();
  }

  return client;
}

export async function closeRedisClient() {
  if (client) {
    await client.quit();
    client = null;
  }
}
