import { getData, saveData } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  const newArticle = await request.json();
  const data = await getData();
  
  const articleWithId = {
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    comments: 0,
    ...newArticle
  };
  
  data.news.unshift(articleWithId);
  await saveData(data);
  
  return new Response(JSON.stringify(articleWithId), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}