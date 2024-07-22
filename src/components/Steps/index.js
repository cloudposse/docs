// src/components/Steps.js
import React, { useEffect, useState, createContext, useContext } from 'react';
import clsx from 'clsx';
import styles from './index.module.css';

let stepCounter = 0;

export const StepContext = createContext(0);

export const resetStepCounter = () => {
  stepCounter = 0;
};

const Steps = ({ title, children }) => {
  const [stepNumber, setStepNumber] = useState(stepCounter);

  useEffect(() => {
    stepCounter += 1;
    setStepNumber(stepCounter);
  }, []);

  return (
    <StepContext.Provider value={stepNumber}>
      <div className={clsx(styles.steps)}>{children}</div>
    </StepContext.Provider>
  );
};

export default Steps;
