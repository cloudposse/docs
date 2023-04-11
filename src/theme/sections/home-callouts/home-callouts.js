import React from 'react';
import styles from './home-callouts.module.css';
import CalloutBox from "../../../components/callout-box/callout-box";
import Container from "../../../components/container/container";
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
            title: 'Building Blocks',
            subtitle: 'Check out our building blocks',
            urlText: 'Our Building Blocks',
            url: useBaseUrl('/fundamentals/building-blocks/'),
        },
        {
            title: 'Tutorials',
            subtitle: 'Lessons on how to utilize SweetOps to implement a project',
            urlText: 'Get Started With Our Tools',
            url: useBaseUrl('/category/tutorials/'),
        },
        {
            title: 'How-To',
            subtitle: 'Guides on how to solve specific problems with SweetOps via a series of easy to follow steps',
            urlText: 'Our Guides',
            url: useBaseUrl('/category/how-to/'),
        },
        {
            title: 'Reference',
            subtitle: 'Informative materials on specific tools and patterns within SweetOps',
            urlText: 'Proceed',
            url: useBaseUrl('/category/reference/'),

        },
        {
            title: 'Community',
            subtitle: 'Community Resources',
            urlText: 'Check Out',
            url: useBaseUrl('/category/community/'),
        }
    ]
    return (
        <Container>
            <div className={styles.homeCallouts}>
                {callouts.map((callout, i) => (
                    <div key={i} className={styles.homeCallouts__item}>
                        <CalloutBox title={callout.title} subtitle={callout.subtitle} url={callout.url} urlText={callout.urlText} />
                    </div>
                ))}
            </div>
        </Container>
    );
}
