import React from 'react';
import AnnouncementCard from '../AnnouncementCard';
import styles from './styles.module.css';
import Container from "@site/src/components/container/container";

export default function AnnouncementSection({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.title}>Latest Announcements</h2>
        <div className={styles.grid}>
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.permalink}
              title={announcement.title}
              date={announcement.date}
              intro={announcement.intro}
              permalink={announcement.permalink}
            />
          ))}
        </div>
      </Container>
    </section>
  );
} 