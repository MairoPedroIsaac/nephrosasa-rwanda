import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
}

export default function Collapsible({ 
  title, 
  children, 
  defaultOpen = false,
  className = '',
  headerClassName = ''
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-left font-medium text-gray-900 dark:text-white ${headerClassName}`}
      >
        <span className="flex-1">{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
        ) : (
          <ChevronDown size={20} className="text-gray-500 dark:text-gray-400 shrink-0 ml-2" />
        )}
      </button>
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}
