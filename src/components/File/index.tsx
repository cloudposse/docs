import React from 'react';
import './index.css';

// Import the original mapper
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.

import { faFile } from '@fortawesome/free-solid-svg-icons';

  
export default function File({ title, className, type, icon, size = '1x', children }) {
    // Determine the icon to use
    const guessedType = type || 'file';
    const selectedIcon = icon || faFile;

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

