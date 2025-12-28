/**
 * Input Component
 * Reusable input field with label, error states, and validation
 */

import React from 'react';

interface InputProps {
  label: string;              // Input label (e.g., "Email Address")
  type?: string;              // Input type (text, email, password, etc.)
  name: string;               // Input name for form handling
  value: string;              // Current value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;  // Change handler
  placeholder?: string;       // Placeholder text
  error?: string;             // Error message to display
  required?: boolean;         // Is field required?
  disabled?: boolean;         // Disable input
  className?: string;         // Additional classes
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      
      {/* Input field */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border rounded-lg
          focus:ring-2 focus:ring-primary focus:border-transparent
          outline-none transition-all duration-200
          ${error ? 'border-danger' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

export default Input;