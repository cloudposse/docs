// src/components/Step.js
import React, { useEffect, useState, createContext, useContext } from 'react';
import './index.css';

let stepCounter = 0;

export const StepContext = createContext(0);

export const resetStepCounter = () => {
  stepCounter = 0;
};

const Step = ({ title, children }) => {
  const [stepNumber, setStepNumber] = useState(stepCounter);

  useEffect(() => {
    stepCounter += 1;
    setStepNumber(stepCounter);
  }, []);

  return (
    <StepContext.Provider value={stepNumber}>
      <div className="step">
        {title && <h2><i className="step-number">{`Step ${stepNumber}: ${title}`}</i></h2>}
        <div className="content">{children}</div>
      </div>
    </StepContext.Provider>
  );
};

export default Step;
