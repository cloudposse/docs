import React from 'react';
import './index.css';
  
export default function File({ title, className, children }) {

    return (
        <div className={className}>
            <div className="file">
                <div className="tab">
                    <h1><span>{title}</span></h1>
                </div>
                <div className="viewport">{children}</div>
            </div>
        </div>
    );
};

