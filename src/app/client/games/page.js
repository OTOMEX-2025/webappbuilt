import React from 'react';
import { Trophy, Clock, Users, Star } from 'lucide-react';
import styles from './Games.module.css';

const Games = () => {
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mental Health Games</h1>
        <div className={styles.pointsContainer}>
          <Trophy className={styles.pointsIcon} />
          <span className={styles.pointsText}>Your Points: 1,250</span>
        </div>
      </div>

      <div className={styles.gamesGrid}>
        {games.map((game, index) => (
          <div key={index} className={styles.gameCard}>
            <img
              src={game.image}
              alt={game.title}
              className={styles.gameImage}
            />
            <div className={styles.gameContent}>
              <h3 className={styles.gameTitle}>
                {game.title}
              </h3>
              <p className={styles.gameDescription}>
                {game.description}
              </p>
              
              <div className={styles.gameDetails}>
                <div className={styles.gameDetail}>
                  <Users className={styles.gameDetailIcon} />
                  <span>{game.players}</span>
                </div>
                <div className={styles.gameDetail}>
                  <Clock className={styles.gameDetailIcon} />
                  <span>{game.duration}</span>
                </div>
                <div className={`${styles.gameDetail} ${styles.fullWidth}`}>
                  <Star className={styles.gameDetailIcon} />
                  <span>Difficulty: {game.difficulty}</span>
                </div>
              </div>
              
              <button className={styles.playButton}>
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dailyChallenge}>
        <h2 className={styles.challengeTitle}>
          Daily Challenge
        </h2>
        <p className={styles.challengeText}>
          Complete today's mindfulness exercise to earn 100 bonus points!
        </p>
        <button className={styles.challengeButton}>
          Start Challenge
        </button>
      </div>
    </div>
  );
}

export default Games;