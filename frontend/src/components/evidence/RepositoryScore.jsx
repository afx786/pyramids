function letterGrade(score) {
  if (score >= 950) return 'A+';
  if (score >= 900) return 'A';
  if (score >= 850) return 'A-';
  if (score >= 800) return 'B+';
  if (score >= 750) return 'B';
  if (score >= 700) return 'B-';
  if (score >= 600) return 'C+';
  if (score >= 500) return 'C';
  if (score >= 400) return 'C-';
  if (score >= 300) return 'D+';
  if (score >= 200) return 'D';
  return 'F';
}

function RepositoryScore({ score = 0, maxScore = 1000, showGrade = true, showRing = true, trend, confidence, size = 'md', className = '' }) {
  const pct = Math.min(100, Math.round((score / maxScore) * 100));
  const grade = letterGrade(score);
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;
  const ringSize = size === 'sm' ? 48 : size === 'lg' ? 80 : 64;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showRing && (
        <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            <circle cx={ringSize / 2} cy={ringSize / 2} fill="transparent" r={ringSize / 2 - 4} stroke="currentColor" strokeWidth="2" style={{ color: 'rgb(var(--color-surface-container-highest))' }} />
            <circle cx={ringSize / 2} cy={ringSize / 2} fill="transparent" r={ringSize / 2 - 4} stroke="currentColor" strokeWidth="2" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" style={{ color: 'rgb(var(--color-primary))' }} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
            {pct}%
          </span>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className="font-headline-md font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{score}</span>
          {showGrade && (
            <span className="font-mono text-[12px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-container-high))', color: 'rgb(var(--color-on-surface-variant))' }}>
              {grade}
            </span>
          )}
        </div>
        <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Repo Score</span>
        {trend != null && (
          <span className="font-mono text-[10px]" style={{ color: trend > 0 ? 'rgb(var(--color-success))' : trend < 0 ? 'rgb(var(--color-error))' : 'rgb(var(--color-on-surface-variant))' }}>
            {trend > 0 ? '+' : ''}{trend} this week
          </span>
        )}
        {confidence != null && (
          <span className="font-mono text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            {confidence}% confidence
          </span>
        )}
      </div>
    </div>
  );
}

export default RepositoryScore;
