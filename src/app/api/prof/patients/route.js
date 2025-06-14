import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataPath = path.join(process.cwd(), 'src/backend/data.json');

export async function GET() {
  try {
    const file = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(file);
    
    // Return only active patients
    const activePatients = data.patients.active.map(patient => ({
      id: patient.id,
      name: patient.name,
      primaryDiagnosis: patient.primaryDiagnosis,
      lastSession: patient.lastSession
    }));
    
    return NextResponse.json({ active: activePatients });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}