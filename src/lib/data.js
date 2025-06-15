import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src/backend/data.json');

export async function getData() {
  const file = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(file);
}

export async function saveData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}