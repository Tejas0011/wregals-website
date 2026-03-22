import React from 'react';

interface LogoProps {
  className?: string;
  height?: string;
}

export default function Logo({ className = "inline-block", height = "h-4" }: LogoProps) {
  return (
    <img 
      src="/wregals-text-logo.png" 
      alt="WREGALS" 
      className={`${height} w-auto object-contain ${className}`}
    />
  );
}
