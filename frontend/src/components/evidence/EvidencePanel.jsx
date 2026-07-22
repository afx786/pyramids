import { useState } from 'react';
import { ChevronDown, ChevronRight, File, AlertCircle } from 'lucide-react';
import ConfidenceIndicator from './ConfidenceIndicator.jsx';

function EvidencePanel({ technology, evidence = [], detectedFiles = [], reason, confidence, defaultExpanded = false, className = '' }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`card-border rounded-lg overflow-hidden ${className}`} style={{ background: 'rgb(var(--color-surface-container-low))' }}>
      <button
        className="w-full flex items-center justify-between p-3 transition-colors hover:opacity-80"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={`${technology} evidence details`}
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown size={14} strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} /> : <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />}
          <span className="font-body-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>{technology}</span>
        </div>
        <div className="flex items-center gap-3">
          {confidence != null && <ConfidenceIndicator value={confidence} size="sm" />}
          {evidence.length > 0 && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--color-surface-container-high))', color: 'rgb(var(--color-on-surface-variant))' }}>
              {evidence.length}
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3" style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}>
          {reason && (
            <p className="font-body-sm pt-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{reason}</p>
          )}
          {detectedFiles.length > 0 && (
            <div>
              <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Detected Files</span>
              <div className="mt-1 space-y-0.5">
                {detectedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <File size={12} strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                    <span className="font-mono text-[11px]" style={{ color: 'rgb(var(--color-on-surface))' }}>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {evidence.length > 0 && (
            <div>
              <span className="font-label-caps text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Evidence</span>
              <div className="mt-1 space-y-1">
                {evidence.map((e, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <AlertCircle size={12} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                    <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EvidencePanel;
