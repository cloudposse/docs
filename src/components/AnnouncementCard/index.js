import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import LinkRightArrow from "../link-right-arrow/link-right-arrow";
import { formatDate } from '../../utils/date';

export default function AnnouncementCard({ title, date, intro, permalink }) {
  const handleClick = () => {
    window.location.href = permalink;
  };

  return (
    <div className={styles.card} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={styles.card__title}>{title}</div>
      <div className={styles.card__date}>{formatDate(date)}</div>
      <div className={styles.card__intro}>{intro}</div>
      <LinkRightArrow url={permalink} urlText="Read More" />
    </div>
  );
} 