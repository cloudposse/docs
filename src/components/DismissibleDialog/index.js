import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from './index.module.css';
import clsx from 'clsx';

const DismissibleDialog = ({ id, expires, className, children}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the dialog has been dismissed
    const dismissed = Cookies.get(`dismissible-dialog-dismissed-${id}`);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Set a cookie that expires in the given number of days
    Cookies.set(`dismissible-dialog-dismissed-${id}`, 'true', { expires: parseInt(expires, 10) });
  };

  if (!isVisible) {
    return null;
  }

  const additionalClasses = className
    ? className.split(' ').map(cls => styles[cls] || cls)
    : [];

  return (
    <div className={clsx(styles.dialog, ...additionalClasses)}>
      <div className={styles.nav}>
        <button className={styles.closeButton} onClick={handleClose}>&times;</button>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default DismissibleDialog;
