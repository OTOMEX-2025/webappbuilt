import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataPath = path.join(process.cwd(), 'src/backend/data.json');

export async function GET(request, { params }) {
  try {
    const file = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(file);
    
    // Find patient in both active and inactive lists
    const patient = [...data.patients.active].find(p => p.id === Number(params.id));
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
      { status: 500 }
    );
  }
}