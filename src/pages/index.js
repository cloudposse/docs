import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from "../theme/sections/hero/hero";
import HomeCallouts from "../theme/sections/home-callouts/home-callouts";
import AnnouncementSection from "../components/AnnouncementSection";
import { formatDate } from '../utils/date';
import "./index.css"

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const title = `${siteConfig.title}`
  const tagline = `${siteConfig.tagline}`
  
  // Get announcements from siteConfig.customFields
  const announcements = siteConfig.customFields?.announcements || [];

  return (
    <div className="landing-page">
      <Layout
        description={tagline}>
        <main>
          <Hero title={title} />
          <HomeCallouts />
          <AnnouncementSection announcements={announcements} />
        </main>
      </Layout>
    </div>
  );
}
