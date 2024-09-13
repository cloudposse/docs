// src/components/Steps.js
import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './index.module.css';

export const StepContext = React.createContext();

const Steps = ({ children }) => {
  const [stepCounter, setStepCounter] = useState(0);

  return (
    <div className={clsx(styles.steps)}>
      {React.Children.map(children, (child, index) => {
        // Provide a unique step number for each child
        return (
          <StepContext.Provider value={index + 1}>
            {child}
          </StepContext.Provider>
        );
      })}
    </div>
  );
};

export default Steps;
