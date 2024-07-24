import React from 'react';
import styles from './home-callouts.module.css';
import CalloutBox from "@site/src/components/callout-box/callout-box";
import Container from "@site/src/components/container/container";
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function HomeCallouts() {
    const callouts = [
        {
            title: 'Getting Started',
            subtitle: 'Start with getting familiar with the geodesic, atmos and other tools',
            urlText: 'Get Started',
            url: useBaseUrl('/intro/'),
        },
        {
            title: 'Start Building',
            subtitle: 'Use our reference architecture to build your own infrastructure',
            urlText: 'Start Building',
            url: useBaseUrl('/fundamentals/building-blocks/'),
        },
        {
            title: 'Maintenance',
            subtitle: 'Lessons on how to utilize SweetOps to implement a project',
            urlText: 'Get Started With Our Tools',
            url: useBaseUrl('/category/tutorials/'),
        },
        {
            title: 'Support',
            subtitle: 'We have support options available for you',
            urlText: 'Get Support',
            url: useBaseUrl('/support'),
        },
        {
            title: 'Infrastructure as Code Library',
            subtitle: 'Reference all of our Terraform components, modules, and GitHub Actions',
            urlText: 'Get Started',
            url: useBaseUrl('/reference/'),
        },
        {
            title: 'Community',
            subtitle: 'Community, Slack, GitHub Discussions, Office Hours, and more',
            urlText: 'Get Involved',
            url: useBaseUrl('/community'),
        }
    ]
    return (
        <Container>
            <div className={styles.homeCallouts}>
                {callouts.map((callout, i) => (
                    <div key={i} className={styles.homeCallouts__item}>
                        <CalloutBox title={callout.title}
                                    subtitle={callout.subtitle}
                                    url={callout.url}
                                    urlText={callout.urlText}
                         />
                    </div>
                ))}
            </div>
        </Container>
    );
}
