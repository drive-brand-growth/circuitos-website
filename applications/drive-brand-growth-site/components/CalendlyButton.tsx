'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Loader2 } from 'lucide-react';

interface CalendlyButtonProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  text?: string;
}

export default function CalendlyButton({
  variant = 'primary',
  className = '',
  text = 'Book Technical Walkthrough'
}: CalendlyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // GoHighLevel Calendar URL - configured via environment variable
  // Format: https://[subdomain].myhighlevel.com/widget/bookings/[calendar-id]
  // Or: https://api.leadconnectorhq.com/widget/booking/[calendar-id]
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ||
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    'https://api.leadconnectorhq.com/widget/booking/SdWBEiO1GW0MRzl9FuO0'; // Placeholder - replace with actual

  const handleClick = () => {
    setIsLoading(true);
    // Open GHL calendar in new tab
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    // Reset loading state after brief delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  const baseStyles = variant === 'primary'
    ? 'bg-gradient-to-r from-gotham-blue-steel to-gotham-blue-night hover:from-gotham-blue-night hover:to-gotham-blue-steel text-white border border-gotham-blue-light/30'
    : 'bg-gotham-charcoal hover:bg-gotham-steel text-white border border-gotham-steel/50';

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
        transition-all duration-300 shadow-lg hover:shadow-gotham-blue-night/20
        disabled:opacity-70 disabled:cursor-not-allowed
        ${baseStyles}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Opening Calendar...</span>
        </>
      ) : (
        <>
          <Calendar className="w-5 h-5" />
          <span>{text}</span>
          <ExternalLink className="w-4 h-4 opacity-70" />
        </>
      )}
    </motion.button>
  );
}
