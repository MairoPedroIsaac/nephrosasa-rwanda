/**
 * Button Component
 * Reusable button with different variants (primary, secondary, outline)
 */

import React from 'react';

// TypeScript interface - defines what props this component accepts
interface ButtonProps {
  children: React.ReactNode;  // Button text/content
  onClick?: () => void;        // Function to run when clicked (optional)
  type?: 'button' | 'submit' | 'reset';  // HTML button type
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';  // Style variant
  size?: 'sm' | 'md' | 'lg';  // Button size
  disabled?: boolean;          // Disable button
  className?: string;          // Additional CSS classes
  fullWidth?: boolean;         // Make button full width
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
}) => {
  // Base styles (applied to all buttons)
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  
  // Variant styles (different colors)
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300',
    secondary: 'bg-ink-2 text-white hover:bg-ink dark:bg-white dark:text-ink dark:hover:bg-gray-200 disabled:bg-gray-300',
    outline: 'bg-transparent border border-gray-300 text-gray-900 hover:border-gray-900 dark:border-gray-700 dark:text-white dark:hover:border-white disabled:border-gray-300 disabled:text-gray-300',
    danger: 'bg-danger text-white hover:bg-red-600 disabled:bg-gray-300',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3.5 text-[15px]',
    lg: 'px-8 py-4 text-lg',
  };
  
  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Combine all styles
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button;