/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PieceProps {
  className?: string;
}

// 1. CLASSIC SET: Premium Shaded "Standard Elite" Vector Pieces with 3D Pearlescent Gradients & Royal Accent Gold.
export const ChessPieces: Record<string, React.FC<PieceProps>> = {
  // White Pieces
  wp: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wpGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <filter id="wpGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#wpGlow)">
        <path d="M22.5 9c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm6.5 13.5c0-1.7-1.3-3-3-3-.7 0-1.3.2-1.8.6-.2-.3-.5-.6-.9-.8.4-.7.7-1.5.7-2.3 0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .8.3 1.6.7 2.3-.4.2-.7.5-.9.8-.5-.4-1.1-.6-1.8-.6-1.7 0-3 1.3-3 3 0 .7.3 1.4.7 1.9C13.2 24.1 11 27.3 11 31c0 .6.4 1 1 1h21c.6 0 1-.4 1-1 0-3.7-2.2-6.9-5.3-8.6.4-.5.7-1.2.7-1.9z" 
          fill="url(#wpGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 36h21v3H12z" fill="url(#wpGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  wn: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wnGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <filter id="wnGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#wnGlow)">
        <path d="M22 10c-5 0-8 3-10 8.5C11 21 11.5 24 13 25.5c1.5 1.5 4 1 5-1 .5-.5.5-2.5 0-3-.5-.5-1-1-1-2.5 0-2 2-3 4-3s4 .5 4 2.5c0 1.5-.5 2-1 2.5-.5.5-.5 2.5 0 3 1 2 3.5 2.5 5 1 1.5-1.5 2-4.5 1-7C28 13 27 10 22 10z" 
          fill="url(#wnGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 25.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm20 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" stroke="#1E293B" strokeWidth="0.8"/>
        <path d="M20 23.5c-2.5 1.5-5 5.5-6.5 10-.5 1.5-1.5 3-2.5 3h23c-1 0-2-1.5-2.5-3-1.5-4.5-4-8.5-6.5-10h-5.5z" 
          fill="url(#wnGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 39h23v2.5H11z" fill="url(#wnGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  wb: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wbGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="wbGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#wbGlow)">
        {/* Crown Cross/Mitre top adorned with custom Royalty Gold ornament */}
        <path d="M22.5 8s-3 3.5-3 5.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.8.3-1.2.7-1.5.4.3.7.7.7 1.5 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-2-3-5.5-3-5.5z" 
          fill="url(#goldGrad)" stroke="#78350F" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M17.5 18c-2 2-3 5-3 8.5 0 4 2.5 7.5 5.5 8.5V26.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V35c3-1 5.5-4.5 5.5-8.5 0-3.5-1-6.5-3-8.5F22.5 15.5 17.5 18z" 
          fill="url(#wbGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22.5 22.5v-3.5" stroke="#1E293B" strokeWidth="1.8" />
        <path d="M12 38h21v3H12z" fill="url(#wbGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  wr: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wrGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <filter id="wrGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#wrGlow)">
        <path d="M9 37h27v3H9z" fill="url(#wrGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 37V19h21v18H12z" fill="url(#wrGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11 14h5v5h-5zm7 0h5v5h-5zm7 0h5v5h-5zm7 0h5v5h-5z" fill="url(#wrGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 19h27v1.5H9z" fill="url(#wrGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  wq: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wqGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="goldGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="wqGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#wqGlow)">
        <path d="M9 23c1.5-1.5 3-4.5 4.5-8.5l4 9L22.5 11l5 12.5 4-9c1.5 4 3 7 4.5 8.5v11H9V23z" 
          fill="url(#wqGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 37h27v3H9z" fill="url(#wqGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
        
        {/* Crown jewels highlighted in shimmering elegant yellow Gold */}
        <circle cx="9" cy="14" r="1.8" fill="url(#goldGrad2)" stroke="#78350F" strokeWidth="1" />
        <circle cx="17.5" cy="11.5" r="1.8" fill="url(#goldGrad2)" stroke="#78350F" strokeWidth="1" />
        <circle cx="22.5" cy="8.5" r="2.2" fill="url(#goldGrad2)" stroke="#78350F" strokeWidth="1" />
        <circle cx="27.5" cy="11.5" r="1.8" fill="url(#goldGrad2)" stroke="#78350F" strokeWidth="1" />
        <circle cx="36" cy="14" r="1.8" fill="url(#goldGrad2)" stroke="#78350F" strokeWidth="1" />
      </g>
    </svg>
  ),
  wk: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wkGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="goldGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="wkGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25"/>
        </filter>
      </defs>
      <g filter="url(#wkGlow)">
        {/* Imperial Golden cross and crown base band trim */}
        <path d="M22.5 11.5V6m-3 2.5h6" stroke="url(#goldGrad3)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12.5 35c2-1 4-3.5 5.5-6.5C19 26.5 20.5 21 22.5 19.5c2 1.5 3.5 7 4.5 9 1.5 3 3.5 5.5 5.5 6.5h-20z" 
          fill="url(#wkGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11.5 19.5c2 2 5.5 3.5 11 3.5s9-1.5 11-3.5c-4-4.5-5.5-7.5-11-7.5s-7 3-11 7.5z" 
          fill="url(#wkGrad)" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M11.5 38h22v3h-22z" fill="url(#goldGrad3)" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
    </svg>
  ),

  // Black Pieces (Standard Elite - Obsidian Luxury Shaded)
  bp: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bpGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="bpGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#F1F5F9" floodOpacity="0.12"/>
        </filter>
      </defs>
      <g filter="url(#bpGlow)">
        <path d="M22.5 9c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm6.5 13.5c0-1.7-1.3-3-3-3-.7 0-1.3.2-1.8.6-.2-.3-.5-.6-.9-.8.4-.7.7-1.5.7-2.3 0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .8.3 1.6.7 2.3-.4.2-.7.5-.9.8-.5-.4-1.1-.6-1.8-.6-1.7 0-3 1.3-3 3 0 .7.3 1.4.7 1.9C13.2 24.1 11 27.3 11 31c0 .6.4 1 1 1h21c.6 0 1-.4 1-1 0-3.7-2.2-6.9-5.3-8.6.4-.5.7-1.2.7-1.9z" 
          fill="url(#bpGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 36h21v3H12z" fill="url(#bpGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  bn: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bnGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <g>
        <path d="M22 10c-5 0-8 3-10 8.5C11 21 11.5 24 13 25.5c1.5 1.5 4 1 5-1 .5-.5.5-2.5 0-3-.5-.5-1-1-1-2.5 0-2 2-3 4-3s4 .5 4 2.5c0 1.5-.5 2-1 2.5-.5.5-.5 2.5 0 3 1 2 3.5 2.5 5 1 1.5-1.5 2-4.5 1-7C28 13 27 10 22 10z" 
          fill="url(#bnGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 25.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm20 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" stroke="#F8FAFC" strokeWidth="0.5"/>
        <path d="M20 23.5c-2.5 1.5-5 5.5-6.5 10-.5 1.5-1.5 3-2.5 3h23c-1 0-2-1.5-2.5-3-1.5-4.5-4-8.5-6.5-10h-5.5z" 
          fill="url(#bnGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 39h23v2.5H11z" fill="url(#bnGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  bb: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bbGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="silverCross" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <g>
        <path d="M22.5 8s-3 3.5-3 5.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.8.3-1.2.7-1.5.4.3.7.7.7 1.5 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-2-3-5.5-3-5.5z" 
          fill="url(#silverCross)" stroke="#475569" strokeWidth="1" strokeLinejoin="round" />
        <path d="M17.5 18c-2 2-3 5-3 8.5 0 4 2.5 7.5 5.5 8.5V26.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V35c3-1 5.5-4.5 5.5-8.5 0-3.5-1-6.5-3-8.5F22.5 15.5 17.5 18z" 
          fill="url(#bbGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22.5 22.5v-3.5" stroke="#F8FAFC" strokeWidth="1.2" />
        <path d="M12 38h21v3H12z" fill="url(#bbGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  br: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <g>
        <path d="M9 37h27v3H9z" fill="url(#brGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 37V19h21v18H12z" fill="url(#brGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M11 14h5v5h-5zm7 0h5v5h-5zm7 0h5v5h-5zm7 0h5v5h-5z" fill="url(#brGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M9 19h27v1.5H9z" fill="url(#brGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  bq: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bqGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="silverJewels" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <g>
        <path d="M9 23c1.5-1.5 3-4.5 4.5-8.5l4 9L22.5 11l5 12.5 4-9c1.5 4 3 7 4.5 8.5v11H9V23z" 
          fill="url(#bqGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 37h27v3H9z" fill="url(#bqGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="9" cy="14" r="1.5" fill="url(#silverJewels)" stroke="#475569" strokeWidth="0.8" />
        <circle cx="17.5" cy="11.5" r="1.5" fill="url(#silverJewels)" stroke="#475569" strokeWidth="0.8" />
        <circle cx="22.5" cy="8.5" r="1.7" fill="url(#silverJewels)" stroke="#475569" strokeWidth="0.8" />
        <circle cx="27.5" cy="11.5" r="1.5" fill="url(#silverJewels)" stroke="#475569" strokeWidth="0.8" />
        <circle cx="36" cy="14" r="1.5" fill="url(#silverJewels)" stroke="#475569" strokeWidth="0.8" />
      </g>
    </svg>
  ),
  bk: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bkGrad" x1="0.3" y1="0.1" x2="0.7" y2="0.9">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="silverCross2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <g>
        <path d="M22.5 11.5V6m-3 2.5h6" stroke="url(#silverCross2)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12.5 35c2-1 4-3.5 5.5-6.5C19 26.5 20.5 21 22.5 19.5c2 1.5 3.5 7 4.5 9 1.5 3 3.5 5.5 5.5 6.5h-20z" 
          fill="url(#bkGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M11.5 19.5c2 2 5.5 3.5 11 3.5s9-1.5 11-3.5c-4-4.5-5.5-7.5-11-7.5s-7 3-11 7.5z" 
          fill="url(#bkGrad)" stroke="#F8FAFC" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M11.5 38h22v3h-22z" fill="url(#silverCross2)" stroke="#475569" strokeWidth="1.2" strokeLinejoin="round" />
      </g>
    </svg>
  ),
};

// 2. MODERN SET: Cyber Sci-fi Vector Art with gorgeous neon outlines, neon glow, and high-tech structure lines
export const ModernChessPieces: Record<string, React.FC<PieceProps>> = {
  // White Modern pieces: Neon Cyan Core and clean glowing lines
  wp: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mw-pawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>
      <path d="M50 15 L70 50 L60 85 L40 85 L30 50 Z" fill="url(#mw-pawn)" fillOpacity="0.25" stroke="#22D3EE" strokeWidth="4.5" strokeLinejoin="round"/>
      <circle cx="50" cy="35" r="12" fill="#0891B2" stroke="#22D3EE" strokeWidth="3" />
      <line x1="40" y1="65" x2="60" y2="65" stroke="#22D3EE" strokeWidth="3" />
      <path d="M35 85 H65" stroke="#22D3EE" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  wn: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mw-knight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      <path d="M50 12 C35 15 25 30 25 45 C25 55 32 60 30 70 L40 85 L65 85 L75 60 C75 40 68 20 50 12 Z" fill="url(#mw-knight)" fillOpacity="0.25" stroke="#22D3EE" strokeWidth="4.5" strokeLinejoin="round"/>
      <path d="M38 25 L45 28" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="48" cy="32" r="3.5" fill="#22D3EE" />
      <path d="M30 52 C38 52 42 45 48 45" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round"/>
      <path d="M30 85 H70" stroke="#22D3EE" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  wb: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mw-bishop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <path d="M50 12 L30 45 C30 65 40 80 50 85 C60 80 70 65 70 45 Z" fill="url(#mw-bishop)" fillOpacity="0.25" stroke="#22D3EE" strokeWidth="4.5" strokeLinejoin="round"/>
      <line x1="50" y1="20" x2="50" y2="72" stroke="#22D3EE" strokeWidth="3.5" />
      <line x1="38" y1="42" x2="62" y2="42" stroke="#22D3EE" strokeWidth="3" />
      <circle cx="50" cy="11" r="5" fill="#E0F7FA" stroke="#22D3EE" strokeWidth="2"/>
      <path d="M32 85 H68" stroke="#22D3EE" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  wr: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mw-rook" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <path d="M30 25 H70 V42 H64 V80 C64 85 36 85 36 80 V42 H30 Z" fill="url(#mw-rook)" fillOpacity="0.25" stroke="#22D3EE" strokeWidth="4.5" strokeLinejoin="round"/>
      <path d="M30 25 V14 H40 V20 H48 V14 H52 V20 H60 V14 H70 V25" stroke="#22D3EE" strokeWidth="3.5" strokeLinejoin="round"/>
      <line x1="42" y1="55" x2="58" y2="55" stroke="#22D3EE" strokeWidth="2.5" />
      <line x1="42" y1="65" x2="58" y2="65" stroke="#22D3EE" strokeWidth="2.5" />
      <path d="M26 85 H74" stroke="#22D3EE" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  wq: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mw-queen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>
      <path d="M22 75 L30 25 L43 55 L50 18 L57 55 L70 25 L78 75 Z" fill="url(#mw-queen)" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="4.5" strokeLinejoin="round"/>
      <circle cx="30" cy="22" r="3.5" fill="#38BDF8" />
      <circle cx="50" cy="14" r="4.5" fill="#38BDF8" />
      <circle cx="70" cy="22" r="3.5" fill="#38BDF8" />
      <line x1="32" y1="65" x2="68" y2="65" stroke="#38BDF8" strokeWidth="3" />
      <circle cx="50" cy="50" r="10" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
      <path d="M20 85 H80" stroke="#38BDF8" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  wk: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mw-king" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path d="M25 80 L35 32 L44 48 L50 25 L56 48 L65 32 L75 80 Z" fill="url(#mw-king)" fillOpacity="0.25" stroke="#34D399" strokeWidth="4.5" strokeLinejoin="round"/>
      <path d="M50 25 V10 M44 14 H56" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="35" cy="28" r="3" fill="#34D399" />
      <circle cx="65" cy="28" r="3" fill="#34D399" />
      <circle cx="50" cy="55" r="9" fill="#047857" stroke="#34D399" strokeWidth="2" />
      <path d="M20 85 H80" stroke="#34D399" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),

  // Black Modern pieces: Futuristic Glowing Magenta/Purple Core and lines
  bp: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mb-pawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
      </defs>
      <path d="M50 15 L70 50 L60 85 L40 85 L30 50 Z" fill="url(#mb-pawn)" fillOpacity="0.25" stroke="#F43F5E" strokeWidth="4.5" strokeLinejoin="round"/>
      <circle cx="50" cy="35" r="12" fill="#BE123C" stroke="#F43F5E" strokeWidth="3" />
      <line x1="40" y1="65" x2="60" y2="65" stroke="#F43F5E" strokeWidth="3" />
      <path d="M35 85 H65" stroke="#F43F5E" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  bn: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mb-knight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#A21CAF" />
        </linearGradient>
      </defs>
      <path d="M50 12 C35 15 25 30 25 45 C25 55 32 60 30 70 L40 85 L65 85 L75 60 C75 40 68 20 50 12 Z" fill="url(#mb-knight)" fillOpacity="0.25" stroke="#F43F5E" strokeWidth="4.5" strokeLinejoin="round"/>
      <path d="M38 25 L45 28" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="48" cy="32" r="3.5" fill="#F43F5E" />
      <path d="M30 52 C38 52 42 45 48 45" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round"/>
      <path d="M30 85 H70" stroke="#F43F5E" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  bb: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mb-bishop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
      </defs>
      <path d="M50 12 L30 45 C30 65 40 80 50 85 C60 80 70 65 70 45 Z" fill="url(#mb-bishop)" fillOpacity="0.25" stroke="#EC4899" strokeWidth="4.5" strokeLinejoin="round"/>
      <line x1="50" y1="20" x2="50" y2="72" stroke="#EC4899" strokeWidth="3.5" />
      <line x1="38" y1="42" x2="62" y2="42" stroke="#EC4899" strokeWidth="3" />
      <circle cx="50" cy="11" r="5" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2"/>
      <path d="M32 85 H68" stroke="#EC4899" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  br: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mb-rook" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#86198F" />
        </linearGradient>
      </defs>
      <path d="M30 25 H70 V42 H64 V80 C64 85 36 85 36 80 V42 H30 Z" fill="url(#mb-rook)" fillOpacity="0.25" stroke="#EC4899" strokeWidth="4.5" strokeLinejoin="round"/>
      <path d="M30 25 V14 H40 V20 H48 V14 H52 V20 H60 V14 H70 V25" stroke="#EC4899" strokeWidth="3.5" strokeLinejoin="round"/>
      <line x1="42" y1="55" x2="58" y2="55" stroke="#EC4899" strokeWidth="2.5" />
      <line x1="42" y1="65" x2="58" y2="65" stroke="#EC4899" strokeWidth="2.5" />
      <path d="M26 85 H74" stroke="#EC4899" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  bq: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mb-queen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#701A75" />
        </linearGradient>
      </defs>
      <path d="M22 75 L30 25 L43 55 L50 18 L57 55 L70 25 L78 75 Z" fill="url(#mb-queen)" fillOpacity="0.25" stroke="#D946EF" strokeWidth="4.5" strokeLinejoin="round"/>
      <circle cx="30" cy="22" r="3.5" fill="#D946EF" />
      <circle cx="50" cy="14" r="4.5" fill="#D946EF" />
      <circle cx="70" cy="22" r="3.5" fill="#D946EF" />
      <line x1="32" y1="65" x2="68" y2="65" stroke="#D946EF" strokeWidth="3" />
      <circle cx="50" cy="50" r="10" fill="#A21CAF" stroke="#D946EF" strokeWidth="2" />
      <path d="M20 85 H80" stroke="#D946EF" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
  bk: ({ className = "w-full h-full" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mb-king" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>
      </defs>
      <path d="M25 80 L35 32 L44 48 L50 25 L56 48 L65 32 L75 80 Z" fill="url(#mb-king)" fillOpacity="0.25" stroke="#F43F5E" strokeWidth="4.5" strokeLinejoin="round"/>
      <path d="M50 25 V10 M44 14 H56" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="35" cy="28" r="3" fill="#F43F5E" />
      <circle cx="65" cy="28" r="3" fill="#F43F5E" />
      <circle cx="50" cy="55" r="9" fill="#9F1239" stroke="#F43F5E" strokeWidth="2" />
      <path d="M20 85 H80" stroke="#F43F5E" strokeWidth="5.5" strokeLinecap="round"/>
    </svg>
  ),
};

// 3. MINIMALIST SET: Beautiful Glyphs styled to look incredibly neat
export const MinimalistChessPieces: Record<string, React.FC<PieceProps>> = {
  wp: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-gray-800 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]`}>♙</div>,
  wn: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-gray-800 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]`}>♘</div>,
  wb: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-gray-800 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]`}>♗</div>,
  wr: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-gray-800 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]`}>♖</div>,
  wq: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-gray-800 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]`}>♕</div>,
  wk: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-gray-800 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]`}>♔</div>,

  bp: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-slate-200 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]`}>♟</div>,
  bn: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-slate-200 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]`}>♞</div>,
  bb: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-slate-200 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]`}>♝</div>,
  br: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-slate-200 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]`}>♜</div>,
  bq: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-slate-200 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]`}>♛</div>,
  bk: ({ className }) => <div className={`${className} font-sans flex items-center justify-center font-bold text-slate-200 text-xl sm:text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]`}>♚</div>,
};
