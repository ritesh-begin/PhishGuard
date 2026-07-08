import { useEffect, useState } from 'react';

export default function ThreatScoreGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simple count up animation on mount
    const duration = 1000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = score / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  let strokeColor = 'text-threatSafe';
  if (score > 70) strokeColor = 'text-threatHigh';
  else if (score > 45) strokeColor = 'text-threatMedium';
  else if (score > 20) strokeColor = 'text-threatLow';

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-40 w-40 -rotate-90 transform" viewBox="0 0 140 140">
        <circle
          className="text-slate-100"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
        <circle
          className={`${strokeColor} transition-all duration-100 ease-out`}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-900">{animatedScore}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Score</span>
      </div>
    </div>
  );
}
