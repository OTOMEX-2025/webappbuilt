
import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import styles from './Music.module.css';

const Music = () => {
  const playlists = [
    {
      title: "Calming Nature Sounds",
      description: "Immersive 8D nature sounds for deep relaxation",
      duration: "2h 15m",
      tracks: 12,
      image: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Meditation Melodies",
      description: "Peaceful 8D music for meditation and mindfulness",
      duration: "1h 45m",
      tracks: 8,
      image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Sleep Sounds",
      description: "Gentle 8D ambient sounds for better sleep",
      duration: "8h",
      tracks: 10,
      image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2000"
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>8D Music Therapy</h1>

      <div className={styles.player}>
        <div className={styles.playerContent}>
          <img
            src="https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&q=80&w=2000"
            alt="Now Playing"
            className={styles.playerImage}
          />
          <div className={styles.playerInfo}>
            <h3 className={styles.playerTitle}>Peaceful Meditation</h3>
            <p className={styles.playerSubtitle}>8D Ambient Music</p>
            
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progress}></div>
              </div>
              <div className={styles.timeInfo}>
                <span>1:23</span>
                <span>4:56</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.controls}>
          <button className={styles.controlButton}>
            <SkipBack size={24} />
          </button>
          <button className={styles.playButton}>
            <Pause size={24} />
          </button>
          <button className={styles.controlButton}>
            <SkipForward size={24} />
          </button>
          <div className={styles.volumeControl}>
            <Volume2 size={20} />
            <div className={styles.volumeBar}>
              <div className={styles.volumeProgress}></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.playlists}>
        {playlists.map((playlist, index) => (
          <div key={index} className={styles.playlistCard}>
            <img
              src={playlist.image}
              alt={playlist.title}
              className={styles.playlistImage}
            />
            <div className={styles.playlistContent}>
              <h3 className={styles.playlistTitle}>{playlist.title}</h3>
              <p className={styles.playlistDescription}>{playlist.description}</p>
              <div className={styles.playlistFooter}>
                <span className={styles.playlistMeta}>
                  {playlist.tracks} tracks • {playlist.duration}
                </span>
                <button className={styles.playlistButton}>
                  <Play size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Music;