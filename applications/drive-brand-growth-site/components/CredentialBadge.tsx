import React from 'react';
import Image from 'next/image';
import { GraduationCap, Award, LinkIcon } from 'lucide-react';

interface CredentialBadgeProps {
  className?: string;
}

export default function CredentialBadge({ className = '' }: CredentialBadgeProps) {
  return (
    <div className={`bg-gotham-charcoal/50 border border-gotham-steel/30 rounded-xl p-8 ${className}`}>
      <div className="flex items-start gap-6">
        {/* Professional headshot */}
        <div className="w-24 h-24 rounded-lg overflow-hidden border border-gotham-blue-steel/30 flex-shrink-0">
          <Image
            src="/headshot.jpg"
            alt="Noel Peña - Founder & Chief AI Architect"
            width={96}
            height={96}
            className="w-full h-full object-cover object-top"
            priority
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">Noel Peña</h3>
          <p className="text-gotham-blue-light font-semibold mb-4">Founder & Chief AI Architect</p>
          
          {/* University of Michigan Certification */}
          <div className="mb-4 p-3 bg-gotham-dark/50 border border-gotham-blue-steel/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-gotham-blue-light" />
              <span className="text-white font-semibold">Chief Data & AI Officer</span>
            </div>
            <div className="text-sm text-gotham-ash">University of Michigan · In Progress</div>
          </div>
          
          {/* Specializations */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gotham-blue-light" />
              <span className="text-sm font-semibold text-gotham-ash">Specializations:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Multi-Agent Orchestration', 'Decision Model Notation (DMN)', 'Predictive ML', 'Revenue Operations'].map((spec) => (
                <span key={spec} className="text-xs bg-gotham-steel/50 border border-gotham-concrete/50 text-gotham-text-primary px-3 py-1 rounded-full">
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="flex items-center gap-1 text-gotham-blue-light hover:text-gotham-blue-glow transition-colors">
              <LinkIcon className="w-4 h-4" />
              LinkedIn
            </a>
            <a href="mailto:noel@drivebrandgrowth.com" className="text-gotham-blue-light hover:text-gotham-blue-glow transition-colors">
              noel@drivebrandgrowth.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}








