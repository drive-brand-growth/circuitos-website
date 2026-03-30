'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import TerminalBox from './TerminalBox';

interface Stat {
  label: string;
  value: string;
  icon?: string;
}

interface StatsPanelProps {
  stats?: Stat[];
  className?: string;
}

const defaultStats: Stat[] = [
  { label: 'Lead Qualification Accuracy', value: '91%' },
  { label: 'Decisions Automated Monthly', value: '10M+' },
  { label: 'Active Production Systems', value: '16' },
  { label: 'Average Response Time', value: '<200ms' }
];

// Animated number counter
function AnimatedValue({ value, inView }: { value: string; inView: boolean }) {
  const [displayValue, setDisplayValue] = useState('0');
  
  useEffect(() => {
    if (!inView) return;
    
    // Extract number from string
    const numMatch = value.match(/\d+/);
    if (!numMatch) {
      setDisplayValue(value);
      return;
    }
    
    const targetNum = parseInt(numMatch[0]);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetNum / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNum) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        // Reconstruct the string with current number
        setDisplayValue(value.replace(/\d+/, Math.floor(current).toString()));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [inView, value]);
  
  return <span>{displayValue}</span>;
}

export default function StatsPanel({ stats = defaultStats, className = '' }: StatsPanelProps) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  
  return (
    <div ref={ref}>
      <TerminalBox title="CURRENT DEPLOYMENT STATS" className={className}>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center justify-between py-2 border-b border-gotham-steel/20 last:border-0 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-gotham-blue-light font-mono text-sm">[{String(index + 1).padStart(2, '0')}]</span>
                <span className="text-gotham-ash group-hover:text-gotham-text-primary transition-colors">
                  {stat.label}
                </span>
              </div>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-gotham-blue-light font-bold"
              >
                <AnimatedValue value={stat.value} inView={inView} />
              </motion.span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-4 pt-4 border-t border-gotham-steel/30 text-gotham-ash text-xs"
        >
          <div>
            Powered by <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-gotham-blue-light font-semibold cursor-pointer inline-block"
            >
              proprietary infrastructure
            </motion.span>
          </div>
        </motion.div>
      </TerminalBox>
    </div>
  );
}
