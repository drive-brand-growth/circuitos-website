'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface BlackBoxFeatureProps {
  title: string;
  industry: string;
  metrics: string[];
  results: string;
  className?: string;
  delay?: number;
}

export default function BlackBoxFeature({
  title,
  industry,
  metrics,
  results,
  className = '',
  delay = 0
}: BlackBoxFeatureProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`black-box rounded-xl p-6 transition-all duration-300 hover:border-gotham-blue-steel/60 group cursor-pointer ${className}`}
    >
      <div className="relative z-10">
        {/* Animated glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gotham-blue-night/0 to-gotham-blue-night/0 rounded-xl -z-10"
          animate={isHovered ? {
            background: [
              'radial-gradient(circle at 0% 0%, rgba(26, 48, 80, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(26, 48, 80, 0.1) 0%, transparent 50%)',
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Header with industry badge */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.1 }}
              className="text-xl font-bold text-white mb-2"
            >
              {title}
            </motion.h3>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.2 }}
              className="inline-flex items-center gap-1 text-xs bg-gotham-steel/50 border border-gotham-concrete/50 text-gotham-ash px-2 py-1 rounded"
            >
              {industry}
            </motion.span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.3, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            className="proprietary-badge flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            Proprietary
          </motion.div>
        </div>

        {/* Metrics */}
        <div className="mb-4 space-y-2">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.4 + index * 0.05 }}
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                className="w-1 h-1 bg-gotham-blue-light rounded-full"
              />
              <span className="text-gotham-text-primary">{metric}</span>
            </motion.div>
          ))}
        </div>

        {/* Redacted implementation section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.6 }}
          className="mb-4 p-3 bg-gotham-void/50 border border-gotham-steel/30 rounded font-mono text-xs relative overflow-hidden"
        >
          {/* Scanning effect */}
          <motion.div
            animate={isHovered ? { x: ['-100%', '200%'] } : {}}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gotham-blue-light/10 to-transparent"
          />
          <div className="text-gotham-ash mb-1 relative z-10">Implementation Details:</div>
          <div className="redacted h-4 w-full mb-1 relative z-10"></div>
          <div className="redacted h-4 w-3/4 relative z-10"></div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.7 }}
          whileHover={{ scale: 1.02 }}
          className="mb-4 p-3 bg-gotham-blue-night/20 border border-gotham-blue-steel/30 rounded relative overflow-hidden"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-gotham-blue-night/0 via-gotham-blue-light/10 to-gotham-blue-night/0"
          />
          <div className="text-gotham-blue-light text-sm font-semibold mb-1 relative z-10">Results</div>
          <div className="text-white font-bold relative z-10">{results}</div>
        </motion.div>

        {/* Enterprise Access badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.9 }}
          className="mt-4 pt-4 border-t border-gotham-steel/30"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gotham-ash">Full details under NDA</span>
            <motion.span
              animate={isHovered ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-gotham-blue-light font-medium group-hover:text-gotham-blue-glow transition-colors"
            >
              Enterprise Access
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
