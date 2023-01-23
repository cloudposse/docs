import React from 'react';
import styles from './callout-box.module.css';
import LinkRightArrow from "../link-right-arrow/link-right-arrow";

export default function CalloutBox(props) {
    const {
        title,
        subtitle,
        url,
        urlText
    } = props;

    return (
        <div className={styles.calloutBox}>
            <div className={styles.calloutBox__title}>{title}</div>
            <div className={styles.calloutBox__subtitle}>{subtitle}</div>
            <LinkRightArrow url={url} urlText={urlText} />
        </div>
    );
}
