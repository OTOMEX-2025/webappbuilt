// app/api/music/route.js
import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/backend/data.json');
    const file = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(file);
export async function GET() {
  return Response.json(data.music);
}

export async function POST(request) {
  const { trackId, action, progress } = await request.json();
  
  // In a real app, you would update the database here
  // For now, we'll just return a success message
  console.log(`Track ${trackId} ${action} at ${progress}s`);
  
  return Response.json({ 
    success: true,
    message: `Track ${trackId} ${action} recorded`
  });
}