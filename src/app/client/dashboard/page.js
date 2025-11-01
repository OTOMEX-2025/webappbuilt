'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../../context/ThemeContext';
import { MessageSquare, Calendar, BookOpen, Music, Gamepad, ChevronRight } from 'lucide-react';
import Loader from "../../../components/Loader";

const Home = () => {
  const { theme } = useTheme();
  const [highlights, setHighlights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await fetch('/api/clt/highlights');
        const data = await response.json();
        setHighlights(data);
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  if (loading) {
    return (
      <Loader theme={theme}/>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Hero Section */}
      <section className={`relative py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'} overflow-hidden`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-blue-600">MindPal</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Your companion for mental wellness and personal growth
          </p>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="container mx-auto px-4 py-12">
        {/* AI Chat Highlight */}
        {highlights?.aiChat && (
          <div className={`flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-lg mb-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} text-blue-600 mr-3`}>
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-2xl font-bold">{highlights.aiChat.title}</h2>
              </div>
              <p className="mb-6">{highlights.aiChat.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {highlights.aiChat.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className={`p-1 rounded-full mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                  Helped {highlights.aiChat.stats.usersHelped}+ users
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                  {highlights.aiChat.stats.conversations}+ conversations
                </span>
              </div>
              <Link 
                href="/client/chat" 
                className={`inline-block px-6 py-3 rounded-lg font-medium text-center ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Try AI Companion
              </Link>
            </div>
            <div className="lg:w-1/2 h-64 lg:h-auto relative">
              <Image
                src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff"
                alt="AI Chatbot"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        )}

        {/* Sections with icons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Calendar size={24} />, title: "Therapy Sessions", content: "Book or join professional therapy sessions", color: "text-purple-600", bg: theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100' },
            { icon: <BookOpen size={24} />, title: "Articles", content: "Read mental health articles and resources", color: "text-green-600", bg: theme === 'dark' ? 'bg-green-900' : 'bg-green-100' },
            { icon: <Music size={24} />, title: "Music", content: "Relaxing playlists for mindfulness", color: "text-yellow-600", bg: theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100' },
            { icon: <Gamepad size={24} />, title: "Games", content: "Therapeutic games for mental wellness", color: "text-red-600", bg: theme === 'dark' ? 'bg-red-900' : 'bg-red-100' },
          ].map((item, index) => (
            <Link
              key={index}
              href={
                item.title === "Therapy Sessions" ? "/client/meetings" :
                item.title === "Articles" ? "/client/news" :
                item.title === "Music" ? "/client/music" :
                "/client/games"
              }
              className={`p-6 rounded-xl ${item.bg} ${theme === 'dark' ? 'hover:bg-opacity-70' : 'hover:bg-opacity-50'} transition-all cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-opacity-30' : 'bg-opacity-20'} flex items-center justify-center mb-4 ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="mb-4">{item.content}</p>
              <div className={`flex items-center ${item.color} font-medium`}>
                Explore <ChevronRight size={18} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Meetings Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Calendar className="mr-2 text-blue-600" size={24} />
            Upcoming Meetings
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights?.meetings?.upcoming.map((meeting) => (
              <div 
                key={meeting.id} 
                className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="h-48 relative">
                  <Image
                    src={meeting.image}
                    alt={meeting.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{meeting.title}</h3>
                  <p className={`mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>With {meeting.therapist}</p>
                  <p className="mb-4">
                    {new Date(meeting.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="mb-4">{meeting.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(meeting.participants / meeting.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 whitespace-nowrap">{meeting.participants}/{meeting.maxParticipants}</span>
                  </div>
                  <Link 
                    href={`/client/meetings/join/${meeting.id}`}
                    className={`block w-full py-2 rounded-lg text-center ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Join Meeting
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Calendar className="mr-2 text-blue-600" size={24} />
            Recent Meetings
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights?.meetings?.past.map((meeting) => (
              <div 
                key={meeting.id} 
                className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="h-48 relative">
                  <Image
                    src={meeting.image}
                    alt={meeting.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{meeting.title}</h3>
                  <p className={`mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>With {meeting.therapist}</p>
                  <p className="mb-4">
                    {new Date(meeting.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="mb-6">{meeting.description}</p>
                  {meeting.recordingAvailable && (
                    <Link 
                      href={`/client/meetings/${meeting.id}`}
                      className={`block w-full py-2 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      Watch Recording
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="mr-2 text-blue-600" size={24} />
            Latest News & Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights?.news?.map((article) => (
              <div 
                key={article.id} 
                className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="h-48 relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                      {article.category}
                    </span>
                    <span className={`flex items-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <BookOpen size={14} className="mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{article.title}</h3>
                  <p className="mb-4">{article.summary}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      By {article.author} • {new Date(article.date).toLocaleDateString()}
                    </span>
                    <Link 
                      href={`/client/news/${article.id}`}
                      className={`flex items-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                    >
                      Read More <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Music Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Music className="mr-2 text-blue-600" size={24} />
            Relaxing Music Playlists
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights?.music?.map((playlist) => (
              <div 
                key={playlist.id} 
                className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="h-48 relative">
                  <Image
                    src={playlist.image}
                    alt={playlist.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{playlist.title}</h3>
                  <p className="mb-4">{playlist.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {playlist.tracks.length} tracks
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {playlist.duration}
                    </span>
                  </div>
                  <Link 
                    href="/client/music"
                    className={`block w-full py-2 rounded-lg text-center ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Listen Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Games Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Gamepad className="mr-2 text-blue-600" size={24} />
            Mindfulness Games
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights?.games?.map((game) => (
              <div 
                key={game.id} 
                className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="h-48 relative">
                  <Image
                    src={game.image}
                    alt={game.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                  <p className="mb-4">{game.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {game.category}
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {game.duration} min
                    </span>
                  </div>
                  <Link 
                    href="/client/games"
                    className={`block w-full py-2 rounded-lg text-center ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    Play Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;