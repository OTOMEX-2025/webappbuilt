'use client';
import React from 'react';
import { Video, Calendar, Users, Clock } from 'lucide-react';
import styles from './Meetings.module.css';

const Meetings = () => {
  const upcomingMeetings = [
    {
      title: "Mindfulness Meditation Group",
      time: "2:00 PM - 3:00 PM",
      date: "Tomorrow",
      participants: 12,
      host: "Dr. Sarah Johnson"
    },
    {
      title: "Anxiety Support Circle",
      time: "11:00 AM - 12:00 PM",
      date: "Thursday",
      participants: 8,
      host: "Dr. Michael Chen"
    },
    {
      title: "Stress Management Workshop",
      time: "4:00 PM - 5:00 PM",
      date: "Friday",
      participants: 15,
      host: "Dr. Emily Williams"
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Virtual Meetings</h1>

      <div className={styles.meetingsContainer}>
        <div className={styles.meetingCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Upcoming Sessions</h2>
            <button className={styles.createButton}>
              <Video size={16} />
              Create Meeting
            </button>
          </div>

          <div className={styles.meetingsList}>
            {upcomingMeetings.map((meeting, index) => (
              <div key={index} className={styles.meetingItem}>
                <div className={styles.meetingHeader}>
                  <h3 className={styles.meetingName}>{meeting.title}</h3>
                  <span className={styles.dateBadge}>{meeting.date}</span>
                </div>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <Clock className={styles.detailIcon} />
                    <span>{meeting.time}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Users className={styles.detailIcon} />
                    <span>{meeting.participants} participants</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Calendar className={styles.detailIcon} />
                    <span>{meeting.host}</span>
                  </div>
                </div>
                <button className={styles.joinButton}>Join Session</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
