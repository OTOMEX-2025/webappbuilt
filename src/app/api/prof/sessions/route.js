import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataPath = path.join(process.cwd(), 'src/backend/data.json');

export async function GET() {
  try {
    const file = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(file);
    
    // Filter upcoming sessions (future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Convert to ISO string and take just the date part for comparison
    const todayString = today.toISOString().split('T')[0];

    const upcoming = data.sessions.upcoming.filter(session => {
    return session.date >= todayString;
    });

    const past = data.sessions.past.concat(
    data.sessions.upcoming.filter(session => {
        return session.date < todayString;
    })
);
    
    return NextResponse.json({ upcoming, past });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const file = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(file);
    const newSession = await request.json();
    
    // Generate new ID
    const allSessions = [...data.sessions.upcoming, ...data.sessions.past];
    const newId = allSessions.length > 0 
      ? Math.max(...allSessions.map(s => s.id)) + 1 
      : 1;
    
    newSession.id = newId;
    newSession.status = newSession.status || 'Pending';
    
    data.sessions.upcoming.push(newSession);
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}