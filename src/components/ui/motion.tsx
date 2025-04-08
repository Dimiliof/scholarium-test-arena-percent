
// Απλή απεικόνιση του motion API από framer-motion 
// Χρησιμοποιούμε απλώς το children όπως είναι

import React from 'react';

interface MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const motion = {
  div: ({ children, className }: MotionProps) => (
    <div className={className}>{children}</div>
  ),
  button: ({ children, className }: MotionProps) => (
    <button className={className}>{children}</button>
  ),
};
