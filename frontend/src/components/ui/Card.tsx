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
  const baseStyles = 'bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors';
  const hoverStyles = hover ? 'hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.25)] transition-all duration-300 cursor-pointer' : '';
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