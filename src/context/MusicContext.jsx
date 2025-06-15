'use client';
import { createContext, useState, useRef, useEffect, useMemo } from 'react';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [musicData, setMusicData] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [showQueue, setShowQueue] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Fetch music data
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const response = await fetch('/api/clt/music');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMusicData(data);
        setUserPlaylists(data.playlists || []);
        
        if (data.tracks?.length > 0) {
          setPlaylist(data.tracks);
          setCurrentTrack(data.tracks[0]);
        }
      } catch (error) {
        console.error('Failed to fetch music data:', error);
        setError(error.message);
      }
    };
    
    fetchMusicData();
  }, []);

  // Format time (seconds to MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Play/pause handler
  const handlePlayPause = async () => {
    if (!currentTrack) return;
    
    try {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          await recordPlayback('pause');
        } else {
          await audioRef.current.play();
          await recordPlayback('play');
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setError('Failed to play track');
    }
  };

  // Record playback to API
  const recordPlayback = async (action) => {
    if (!currentTrack) return;
    
    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackId: currentTrack.id,
          action,
          progress: currentTime
        }),
      });
      
      if (!response.ok) throw new Error('Failed to record playback');
    } catch (error) {
      console.error('Failed to record playback:', error);
    }
  };

  // Next track handler
  const handleNext = async () => {
    if (!playlist.length) return;
    
    try {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack?.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      const nextTrack = playlist[nextIndex];
      
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
      await recordPlayback('skip');
    } catch (error) {
      console.error('Failed to skip to next track:', error);
      setError('Failed to skip track');
    }
  };

  // Previous track handler
  const handlePrevious = async () => {
    if (!playlist.length) return;
    
    try {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack?.id);
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      const prevTrack = playlist[prevIndex];
      
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
      await recordPlayback('skip');
    } catch (error) {
      console.error('Failed to go to previous track:', error);
      setError('Failed to go to previous track');
    }
  };

  // Play specific track
  const playTrack = async (track) => {
    try {
      setCurrentTrack(track);
      setIsPlaying(true);
      await recordPlayback('play');
    } catch (error) {
      console.error('Failed to play track:', error);
      setError('Failed to play track');
    }
  };

  // Time update handler
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Seek handler
  const handleSeek = (seekTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Volume change handler
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled) {
      const shuffled = [...playlist].sort(() => Math.random() - 0.5);
      setPlaylist(shuffled);
    } else {
      setPlaylist(musicData?.tracks || []);
    }
  };

  // Cycle repeat modes
  const cycleRepeatMode = () => {
    const modes = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  // Add to favorites
  const handleAddToFavorites = async (trackId) => {
    try {
      setMusicData(prev => ({
        ...prev,
        userData: {
          ...prev.userData,
          favorites: prev.userData.favorites.includes(trackId)
            ? prev.userData.favorites.filter(id => id !== trackId)
            : [...prev.userData.favorites, trackId]
        }
      }));
    } catch (error) {
      console.error('Failed to update favorites:', error);
      setError('Failed to update favorites');
    }
  };

  // Add to playlist
  const handleAddToPlaylist = async (trackId, playlistId) => {
    try {
      // In a real app, this would call your API
      setUserPlaylists(prev => prev.map(playlist => 
        playlist.id === playlistId
          ? { ...playlist, tracks: [...playlist.tracks, trackId] }
          : playlist
      ));
    } catch (error) {
      console.error('Failed to add to playlist:', error);
      setError('Failed to add to playlist');
    }
  };

  // Reorder queue
  const handleQueueReorder = (dragIndex, dropIndex) => {
    const newPlaylist = [...playlist];
    const [removed] = newPlaylist.splice(dragIndex, 1);
    newPlaylist.splice(dropIndex, 0, removed);
    setPlaylist(newPlaylist);
  };

  // Check if track is favorite
  const isFavorite = (trackId) => {
    return musicData?.userData?.favorites?.includes(trackId) || false;
  };

  const contextValue = useMemo(() => ({
    musicData,
    currentTrack,
    playlist,
    userPlaylists,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    showQueue,
    showAddToPlaylist,
    error,
    audioRef,
    formatTime,
    handlePlayPause,
    handleNext,
    handlePrevious,
    playTrack,
    handleTimeUpdate,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    setPlaylist,
    handleAddToFavorites,
    handleAddToPlaylist,
    handleQueueReorder,
    setShowQueue,
    setShowAddToPlaylist,
    isFavorite
  }), [
    musicData,
    currentTrack,
    playlist,
    userPlaylists,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    showQueue,
    showAddToPlaylist,
    error
  ]);

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={repeatMode === 'one' ? () => audioRef.current?.play() : handleNext}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.volume = volume / 100;
          }
        }}
      />
    </MusicContext.Provider>
  );
};