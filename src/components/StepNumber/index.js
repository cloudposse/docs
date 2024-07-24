import React, { useContext } from 'react';
import { StepContext } from '@site/src/components/Step';
import clsx from 'clsx';
import styles from './index.module.css';

const StepNumber = () => {
  const stepNumber = useContext(StepContext);
  return (<i className={clsx(styles.stepNumber)}>{`${stepNumber}`}</i>);
};

export default StepNumber;