'use client';
import React from 'react';
import { Trophy, Clock, Users, Star, Award } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const Games = () => {
  const { theme } = useTheme();
  const games = [
    {
      title: "Memory Match",
      description: "Enhance your memory and concentration with this relaxing card matching game",
      players: "Single Player",
      duration: "5-10 mins",
      difficulty: "Easy",
      image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Mindful Maze",
      description: "Navigate through peaceful mazes while practicing mindfulness",
      players: "Single Player",
      duration: "10-15 mins",
      difficulty: "Medium",
      image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Breathing Bubbles",
      description: "Practice deep breathing exercises with interactive bubble animations",
      players: "Single Player",
      duration: "5 mins",
      difficulty: "Easy",
      image: "https://images.unsplash.com/photo-1527112862739-c3b2f662d5d5?auto=format&fit=crop&q=80&w=2000"
    }
  ];

  return (
    <div className={`min-h-screen w-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`flex justify-between items-center mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <h1 className="text-2xl font-bold">Mindfulness Games</h1>
          <div className={`flex items-center px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} text-blue-600`}>
            <Trophy className="mr-2" size={20} />
            <span className="font-medium">Your Points: 1,250</span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game, index) => (
            <div 
              key={index} 
              className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="h-48 relative">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {game.title}
                </h3>
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {game.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Users className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} size={16} />
                    <span>{game.players}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} size={16} />
                    <span>{game.duration}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <Star className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} size={16} />
                    <span>Difficulty: {game.difficulty}</span>
                  </div>
                </div>
                
                <button className={`w-full py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Challenge */}
        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-start">
            <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100'} text-yellow-600 mr-4`}>
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">
                Daily Challenge
              </h2>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Complete today's mindfulness exercise to earn 100 bonus points!
              </p>
              <button className={`px-6 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}>
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Games;