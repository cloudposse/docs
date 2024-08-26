// src/components/Step.js
import React, { useContext } from 'react';
import { StepContext } from '@site/src/components/Steps';
import './index.css';

const Step = ({ title, children }) => {
  const stepNumber = useContext(StepContext); // Consume the step number from context

  return (
    <div className="step">
      {title && <h2><i className="step-number">{`Step ${stepNumber}: ${title}`}</i></h2>}
      <div className="content">{children}</div>
    </div>
  );
};

export default Step;
