import React from 'react';
import styles from './link-right-arrow.module.css';

export default function LinkRightArrow(props) {
    const {
        urlText,
        url,
    } = props;

    const iconArrowRight = "fa fa-arrow-right";

    return (
        <a href={url} className={styles.linkRightArrow}>
            <span>{urlText}</span> <i className={iconArrowRight}>&nbsp;</i>
        </a>
    );
}
