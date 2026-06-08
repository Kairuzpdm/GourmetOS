import React from 'react';
import './Button.css';

export const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false, ...props }) => {
    return (
        <button 
            className={`btn-${variant} ${className}`} 
            onClick={onClick} 
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};
