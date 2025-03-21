import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import AnnouncementSection from './index';

export default function MDXAnnouncementSection() {
  const {siteConfig} = useDocusaurusContext();
  const announcements = siteConfig.customFields?.announcements || [];
  return <AnnouncementSection announcements={announcements} />;
} 