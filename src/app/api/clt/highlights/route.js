import { getData } from '@/lib/data';

export async function GET() {
  const data = await getData();
  
  // Extract highlights from different sections
  const highlights = {
    aiChat: data.aiChat?.highlight || null,
    meetings: {
      upcoming: data.meetings?.upcoming.slice(0, 2) || [],
      past: data.meetings?.past.slice(0, 2) || []
    },
    news: data.news?.slice(0, 3) || [],
    music: data.music?.playlists.slice(0, 2) || [],
    games: data.games?.slice(0, 2) || []
  };

  return new Response(JSON.stringify(highlights), {
    headers: { 'Content-Type': 'application/json' },
  });
}