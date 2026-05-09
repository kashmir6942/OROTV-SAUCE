'use client'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Light TV Logo */}
        <div className="relative">
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            className="animate-pulse"
          >
            {/* Lightbulb */}
            <ellipse cx="35" cy="35" rx="15" ry="18" fill="none" stroke="#f5c518" strokeWidth="2" />
            <path d="M28 50 L28 58 L42 58 L42 50" fill="none" stroke="#f5c518" strokeWidth="2" />
            <line x1="28" y1="52" x2="42" y2="52" stroke="#f5c518" strokeWidth="1" />
            <line x1="28" y1="55" x2="42" y2="55" stroke="#f5c518" strokeWidth="1" />
            {/* Rays */}
            <line x1="35" y1="10" x2="35" y2="5" stroke="#f5c518" strokeWidth="2" />
            <line x1="20" y1="20" x2="15" y2="15" stroke="#f5c518" strokeWidth="2" />
            <line x1="50" y1="20" x2="55" y2="15" stroke="#f5c518" strokeWidth="2" />
            <line x1="12" y1="35" x2="7" y2="35" stroke="#f5c518" strokeWidth="2" />
            <line x1="58" y1="35" x2="63" y2="35" stroke="#f5c518" strokeWidth="2" />
            {/* Text */}
            <text x="70" y="45" fill="#fafafa" fontSize="24" fontWeight="bold">ght</text>
          </svg>
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        </div>
        
        {/* Loading text */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <span>Loading</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </div>
      </div>
    </div>
  )
}
