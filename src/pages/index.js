import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from "../theme/sections/hero/hero";
import HomeCallouts from "../theme/sections/home-callouts/home-callouts";
import "./index.css"

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const title = `${siteConfig.title}`
  const tagline = `${siteConfig.tagline}`
  return (
    <div className="landing-page">
      <Layout
        description={tagline}>
        <main>
          <Hero title={title} />
          <HomeCallouts />
        </main>
      </Layout>
    </div>
  );
}
