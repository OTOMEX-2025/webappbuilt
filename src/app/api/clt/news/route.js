import { getData } from '@/lib/data';

export async function GET() {
  const data = await getData();
  return new Response(JSON.stringify(data.news), {
    headers: { 'Content-Type': 'application/json' },
  });
}