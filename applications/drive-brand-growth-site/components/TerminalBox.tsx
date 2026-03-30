import React from 'react';

interface TerminalBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function TerminalBox({ title, children, className = '' }: TerminalBoxProps) {
  return (
    <div className={`terminal rounded-lg overflow-hidden ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dot red"></div>
        <div className="terminal-dot yellow"></div>
        <div className="terminal-dot green"></div>
        {title && <span className="text-gotham-ash text-sm ml-2">{title}</span>}
      </div>
      <div className="p-4 font-mono text-sm text-gotham-text-primary">
        {children}
      </div>
    </div>
  );
}








