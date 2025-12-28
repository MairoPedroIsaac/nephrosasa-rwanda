/**
 * Card Component
 * Container with shadow, rounded corners, and optional hover effect
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;  // Content inside card
  className?: string;         // Additional classes
  hover?: boolean;            // Add hover effect
  onClick?: () => void;       // Make card clickable
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-md p-6 border border-gray-200';
  const hoverStyles = hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;