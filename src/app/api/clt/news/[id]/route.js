import { getData, saveData } from '@/lib/data';

export async function GET(request, { params }) {
  const { id } = params;
  const data = await getData();
  const article = data.news.find(item => item.id === id);
  
  if (!article) {
    return new Response(JSON.stringify({ error: 'Article not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify(article), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request, { params }) {
  const { id } = params;
  const updatedArticle = await request.json();
  const data = await getData();
  
  const index = data.news.findIndex(item => item.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Article not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  data.news[index] = { ...data.news[index], ...updatedArticle };
  await saveData(data);
  
  return new Response(JSON.stringify(data.news[index]), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const data = await getData();
  
  const index = data.news.findIndex(item => item.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Article not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const deletedArticle = data.news.splice(index, 1)[0];
  await saveData(data);
  
  return new Response(JSON.stringify(deletedArticle), {
    headers: { 'Content-Type': 'application/json' },
  });
}