'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ThumbsUp, MessageSquare, Share2, Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const NewsPage = () => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/clt/news');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return (
    <div className={`flex text-center items-center justify-center min-h-screen min-w-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      <div className="animate-pulse">Loading articles...</div>
    </div>
  );

  if (error) return (
    <div className={`flex text-center items-center justify-center min-h-screen min-w-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      <div className="text-red-500">Error: {error}</div>
    </div>
  );

  return (
    <div className={`min-h-screen min-w-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`mb-8 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <h1 className="text-3xl font-bold mb-2">Mental Health News & Articles</h1>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Stay informed with the latest research and insights on mental wellbeing
          </p>
          <Link 
            href="/client/news/create" 
            className={`inline-flex items-center px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <Plus size={18} className="mr-2" />
            Create New Article
          </Link>
        </div>
        
        {/* Articles List */}
        <div className="space-y-6">
          {articles.map((article) => (
            <article 
              key={article.id} 
              className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <Link href={`/client/news/${article.id}`} className="hover:opacity-90 transition-opacity">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                        {article.category}
                      </span>
                      <span className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <BookOpen size={14} className="mr-1" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3">
                      {article.title}
                    </h2>
                    
                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {article.summary}
                    </p>
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <span className={`text-sm mb-3 md:mb-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        By {article.author} • {new Date(article.date).toLocaleDateString()}
                      </span>
                      
                      <div className="flex space-x-4">
                        <button className={`flex items-center ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                          <ThumbsUp size={16} className="mr-1" />
                          <span>{article.likes}</span>
                        </button>
                        <button className={`flex items-center ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                          <MessageSquare size={16} className="mr-1" />
                          <span>{article.comments}</span>
                        </button>
                        <button className={`flex items-center ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;