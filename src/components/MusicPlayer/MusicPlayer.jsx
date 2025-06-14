import React, { useContext, useRef, useState, useEffect } from 'react';
import { MusicContext } from '../../context/MusicContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaRandom, FaHeart } from 'react-icons/fa';
import { MdRepeat, MdRepeatOne, MdQueueMusic } from 'react-icons/md';
import styles from './MusicPlayer.module.css';

const MusicPlayer = () => {
  const {
    currentTrack,
    playlist,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    showQueue,
    error,
    formatTime,
    handlePlayPause,
    handleNext,
    handlePrevious,
    playTrack,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    setShowQueue,
    isFavorite
  } = useContext(MusicContext);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const playerRef = useRef(null);

  const progressPercentage = (currentTime / currentTrack?.duration) * 100 || 0;
  const volumePercentage = isMuted ? 0 : volume;

  const handleProgressClick = (e) => {
    if (!currentTrack) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * currentTrack.duration;
    handleSeek(seekTime);
  };

  const handleVolumeClick = (e) => {
    const volumeBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const volumeBarWidth = volumeBar.clientWidth;
    const newVolume = (clickPosition / volumeBarWidth) * 100;
    handleVolumeChange(newVolume);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(playerRef.current.clientHeight);
    document.body.style.userSelect = 'none';
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const deltaY = startY - e.clientY;
    const newHeight = startHeight + deltaY;
    
    if (newHeight < 100) {
      setIsExpanded(false);
    } else if (newHeight > 150) {
      setIsExpanded(true);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);

  if (error) {
    return (
      <div className={styles.errorOverlay}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.musicPlayerContainer} ${isExpanded ? styles.expanded : ''}`}
      ref={playerRef}
    >
      <div 
        className={`${styles.playerWrapper} ${isExpanded ? styles.expandedPlayer : styles.miniPlayer}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div 
          className={styles.dragHandle}
          onMouseDown={handleDragStart}
        />

        <div className={styles.trackInfo}>
          <img 
            src={currentTrack?.coverArt} 
            alt={currentTrack?.title || 'Track cover'} 
            className={styles.albumArt}
          />
          <div className={styles.trackDetails}>
            <h4 className={styles.trackTitle}>{currentTrack?.title || 'No track selected'}</h4>
            <p className={styles.trackArtist}>{currentTrack?.artist || 'Unknown artist'}</p>
          </div>
          <button 
            className={styles.controlBtn}
            style={{ color: isFavorite(currentTrack?.id) ? '#1db954' : 'white' }}
            onClick={(e) => {
              e.stopPropagation();
              // handleAddToFavorites would need to be added to your context
            }}
          >
            <FaHeart />
          </button>
        </div>

        {isExpanded && (
          <>
            <div className={styles.progressControls}>
              <div 
                className={styles.progressBar} 
                onClick={handleProgressClick}
              >
                <div 
                  className={styles.progress} 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className={styles.timeDisplay}>{formatTime(currentTime)}</span>
              <span className={styles.timeDisplay}>{formatTime(currentTrack?.duration || 0)}</span>
            </div>

            <div className={styles.mainControls}>
              <button 
                className={`${styles.controlBtn} ${isShuffled ? styles.activeControl : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleShuffle();
                }}
              >
                <FaRandom />
              </button>
              <button 
                className={styles.controlBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                disabled={!currentTrack}
              >
                <FaStepBackward />
              </button>
              <button 
                className={styles.playPauseBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                disabled={!currentTrack}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button 
                className={styles.controlBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={!currentTrack}
              >
                <FaStepForward />
              </button>
              <button 
                className={`${styles.controlBtn} ${repeatMode !== 'none' ? styles.activeControl : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  cycleRepeatMode();
                }}
              >
                {repeatMode === 'one' ? <MdRepeatOne /> : <MdRepeat />}
              </button>
            </div>

            <div className={styles.volumeControls}>
              <button 
                className={styles.controlBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <div 
                className={styles.volumeBar} 
                onClick={handleVolumeClick}
              >
                <div 
                  className={styles.volumeLevel} 
                  style={{ width: `${volumePercentage}%` }}
                />
              </div>
            </div>

            <div className={styles.queueSection}>
              <button 
                className={styles.controlBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQueue(!showQueue);
                }}
              >
                <MdQueueMusic /> Queue
              </button>

              {showQueue && (
                <div>
                  {playlist.map((track, index) => (
                    <div 
                      key={`${track.id}-${index}`}
                      className={styles.queueItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(track);
                      }}
                    >
                      <img 
                        src={track.coverArt} 
                        alt="" 
                        className={styles.queueItemArt} 
                      />
                      <div className={styles.queueItemInfo}>
                        <h5>{track.title}</h5>
                        <p>{track.artist}</p>
                      </div>
                      <span className={styles.timeDisplay}>{formatTime(track.duration)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;