'use client';
import { useContext, useEffect } from 'react';
import { MusicContext } from '@/context/MusicContext';
import MusicPlayer from '@/components/MusicPlayer/MusicPlayer';
import styles from './MusicPage.module.css';

const MusicPage = () => {
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
      <div className={styles.errorContainer}>
        <h1>Music Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!musicData) {
    return <div className={styles.loading}>Loading music...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mindful Music</h1>
      
      <div className={styles.sections}>
        {/* Recently Played */}
        {musicData.userData?.recentlyPlayed?.length > 0 && (
          <section className={styles.section} aria-labelledby="recently-played-heading">
            <h2 id="recently-played-heading">Recently Played</h2>
            <div className={styles.trackGrid}>
              {musicData.userData.recentlyPlayed.map(trackId => {
                const track = musicData.tracks.find(t => t.id === trackId);
                if (!track) return null;
                return (
                  <div 
                    key={track.id} 
                    className={`${styles.trackCard} ${currentTrack?.id === track.id ? styles.active : ''}`}
                    onClick={() => playTrack(track)}
                    role="button"
                    tabIndex="0"
                    aria-label={`Play ${track.title} by ${track.artist}`}
                  >
                    <img 
                      src={track.coverArt} 
                      alt="" 
                      className={styles.trackImage} 
                    />
                    <div className={styles.trackInfo}>
                      <h3>{track.title}</h3>
                      <p>{track.artist}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Playlists */}
        {musicData.playlists?.length > 0 && (
          <section className={styles.section} aria-labelledby="playlists-heading">
            <h2 id="playlists-heading">Your Playlists</h2>
            <div className={styles.playlistGrid}>
              {musicData.playlists.map(playlist => (
                <div 
                  key={playlist.id} 
                  className={styles.playlistCard}
                  role="button"
                  tabIndex="0"
                  aria-label={`View ${playlist.title} playlist`}
                >
                  <img 
                    src={playlist.image} 
                    alt="" 
                    className={styles.playlistImage} 
                  />
                  <div className={styles.playlistInfo}>
                    <h3>{playlist.title}</h3>
                    <p>{playlist.description}</p>
                    <div className={styles.playlistMeta}>
                      <span>{playlist.tracks.length} tracks • {playlist.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Tracks */}
        <section className={styles.section} aria-labelledby="all-tracks-heading">
          <h2 id="all-tracks-heading">All Tracks</h2>
          <div className={styles.trackList}>
            {musicData.tracks?.map(track => (
              <div 
                key={track.id} 
                className={`${styles.trackItem} ${currentTrack?.id === track.id ? styles.active : ''}`}
                onClick={() => playTrack(track)}
                role="button"
                tabIndex="0"
                aria-label={`Play ${track.title} by ${track.artist}`}
              >
                <img 
                  src={track.coverArt} 
                  alt="" 
                  className={styles.trackImage} 
                />
                <div className={styles.trackDetails}>
                  <h3>{track.title}</h3>
                  <p>{track.artist}</p>
                </div>
                <div className={styles.trackDuration}>
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Player is fixed at the bottom */}
      <div className={styles.playerWrapper}>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default MusicPage;