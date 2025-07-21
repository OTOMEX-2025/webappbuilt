'use client';
import { useContext, useEffect } from 'react';
import { MusicContext } from '@/context/MusicContext';
import MusicPlayer from '@/components/MusicPlayer/MusicPlayer';
import { useTheme } from '@/context/ThemeContext';

const MusicPage = () => {
  const { theme } = useTheme();
  const { 
    musicData, 
    currentTrack, 
    playTrack,
    setPlaylist,
    error
  } = useContext(MusicContext);

  useEffect(() => {
    if (musicData?.tracks) {
      setPlaylist(musicData.tracks);
    }
  }, [musicData, setPlaylist]);

  if (error) {
    return (
      <div className={`min-h-screen min-  flex items-center justify-center ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}>
          <h1 className="text-2xl font-bold text-red-500 mb-2">Music Error</h1>
          <p className="mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!musicData) {
    return (
      <div className={`min-h-screen min-  flex items-center justify-center ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen min-  pb-24 ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mindful Music</h1>
        
        <div className="space-y-12">
          {/* Recently Played */}
          {musicData.userData?.recentlyPlayed?.length > 0 && (
            <section aria-labelledby="recently-played-heading">
              <h2 id="recently-played-heading" className="text-2xl font-semibold mb-6">Recently Played</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {musicData.userData.recentlyPlayed.map(trackId => {
                  const track = musicData.tracks.find(t => t.id === trackId);
                  if (!track) return null;
                  return (
                    <div 
                      key={track.id} 
                      className={`p-4 rounded-lg cursor-pointer transition-all ${currentTrack?.id === track.id 
                        ? 'bg-blue-600 text-white' 
                        : theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-md`}
                      onClick={() => playTrack(track)}
                      role="button"
                      tabIndex="0"
                      aria-label={`Play ${track.title} by ${track.artist}`}
                    >
                      <img 
                        src={track.coverArt} 
                        alt="" 
                        className="w-full aspect-square object-cover rounded mb-3"
                      />
                      <div>
                        <h3 className="font-medium truncate">{track.title}</h3>
                        <p className={`text-sm ${currentTrack?.id === track.id ? 'text-blue-100' : 'text-gray-500'}`}>
                          {track.artist}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Playlists */}
          {musicData.playlists?.length > 0 && (
            <section aria-labelledby="playlists-heading">
              <h2 id="playlists-heading" className="text-2xl font-semibold mb-6">Your Playlists</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {musicData.playlists.map(playlist => (
                  <div 
                    key={playlist.id} 
                    className={`p-4 rounded-lg cursor-pointer ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-md flex gap-4`}
                    role="button"
                    tabIndex="0"
                    aria-label={`View ${playlist.title} playlist`}
                  >
                    <img 
                      src={playlist.image} 
                      alt="" 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{playlist.title}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                        {playlist.description}
                      </p>
                      <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {playlist.tracks.length} tracks • {playlist.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Tracks */}
          <section aria-labelledby="all-tracks-heading">
            <h2 id="all-tracks-heading" className="text-2xl font-semibold mb-6">All Tracks</h2>
            <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              {musicData.tracks?.map(track => (
                <div 
                  key={track.id} 
                  className={`p-4 flex items-center gap-4 cursor-pointer border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} ${currentTrack?.id === track.id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                  onClick={() => playTrack(track)}
                  role="button"
                  tabIndex="0"
                  aria-label={`Play ${track.title} by ${track.artist}`}
                >
                  <img 
                    src={track.coverArt} 
                    alt="" 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{track.title}</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {track.artist}
                    </p>
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Player */}
      <div className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
        <div className="container mx-auto px-4">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
};

export default MusicPage;