// src/components/StepNumber.js
import React, { useContext } from 'react';
import { StepContext } from '@site/src/components/Steps';
import clsx from 'clsx';
import styles from './index.module.css';

const StepNumber = () => {
  const stepNumber = useContext(StepContext); // Get the step number from the context

  return (
    <i className={clsx(styles.stepNumber)}>{`${stepNumber}`}</i>
  );
};

export default StepNumber;
