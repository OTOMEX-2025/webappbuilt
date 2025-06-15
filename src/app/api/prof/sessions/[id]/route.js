import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataPath = path.join(process.cwd(), 'src/backend/data.json');

export async function GET(request, { params }) {
  try {
    const file = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(file);
    const session = [...data.sessions.upcoming, ...data.sessions.past]
      .find(s => s.id === Number(params.id));
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const file = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(file);
    const updatedSession = await request.json();
    
    // Find and update session
    let found = false;
    data.sessions.upcoming = data.sessions.upcoming.map(s => {
      if (s.id === Number(params.id)) {
        found = true;
        return { ...s, ...updatedSession };
      }
      return s;
    });
    
    if (!found) {
      data.sessions.past = data.sessions.past.map(s => {
        if (s.id === Number(params.id)) {
          found = true;
          return { ...s, ...updatedSession };
        }
        return s;
      });
    }
    
    if (!found) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return NextResponse.json(updatedSession);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const file = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(file);
    
    // Remove from upcoming
    const initialUpcomingCount = data.sessions.upcoming.length;
    data.sessions.upcoming = data.sessions.upcoming.filter(
      s => s.id !== Number(params.id)
    );
    
    // If not found in upcoming, try past
    if (initialUpcomingCount === data.sessions.upcoming.length) {
      data.sessions.past = data.sessions.past.filter(
        s => s.id !== Number(params.id)
      );
    }
    
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}