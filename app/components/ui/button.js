"use client";

import React from 'react';

/**
 
Button Component
A reusable button component with variant and size options.
Props:
variant: The style variant of the button ('default', 'ghost', 'outline').
size: The size of the button ('sm', 'md', 'lg').
onClick: Function to handle click events.
disabled: Boolean to disable the button.
children: Button content (e.g., text, icons).
*/
export function Button({ 
  variant = 'default', 
  size = 'md', 
  onClick, 
  disabled, 
  children 
}) {
  const baseClasses = ` 
    inline-flex items-center justify-center rounded-md font-medium transition-all 
    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`
  ;
  const variantClasses = {
    default: 'bg-teal-500 text-white hover:bg-teal-600',
    ghost: 'bg-transparent text-teal-500 hover:bg-teal-100',
    outline: 'border border-teal-500 text-teal-500 hover:bg-teal-100',
  };
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  const disabledClasses = disabled ? 'opacity-50 pointer-events-none' : '';

  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant] || variantClasses.default} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${disabledClasses}`
  ;

  return (
    <button 
      className={combinedClasses.trim()} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
}