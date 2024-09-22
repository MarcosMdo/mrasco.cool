import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function GET(req) {
  try {
    // Retrieve all messages from Redis
    const messages = await redis.lrange('messages', -10, -1)
    console.log(messages)
    // Parse the JSON strings back into objects
    //const body = messages.map(msg => JSON.parse(msg))
    return NextResponse.json( messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Error fetching messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.text()
    const message = JSON.parse(data)
    await redis.rpush('messages', JSON.stringify(message))
      
    return NextResponse.json({ body: "Message stored successfully" }, { status: 201 });
  } catch (error) {
    console.error('Error storing message:', error)
    return NextResponse.json({ error: "Error storing message" }, { status: 500 });
  }
}
