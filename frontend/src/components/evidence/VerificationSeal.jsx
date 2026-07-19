import { CheckCircle, Clock, XCircle } from 'lucide-react';

const statusConfig = {
  verified: { icon: CheckCircle, color: 'var(--color-success)', label: 'Verified' },
  pending: { icon: Clock, color: 'var(--color-warning)', label: 'Pending' },
  failed: { icon: XCircle, color: 'var(--color-error)', label: 'Failed' },
};

const sizeConfig = {
  sm: { iconSize: 14, textSize: 'text-[10px]', gap: 'gap-1', padding: 'px-1.5 py-0.5' },
  md: { iconSize: 16, textSize: 'text-[11px]', gap: 'gap-1.5', padding: 'px-2 py-1' },
  lg: { iconSize: 20, textSize: 'text-body-sm', gap: 'gap-2', padding: 'px-3 py-1.5' },
};

function VerificationSeal({ status = 'verified', size = 'md', showLabel = true, className = '' }) {
  const config = statusConfig[status] || statusConfig.verified;
  const s = sizeConfig[size] || sizeConfig.md;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center ${s.gap} ${s.padding} rounded-full font-semibold ${s.textSize} ${className}`}
      style={{
        background: `rgb(${config.color} / 0.12)`,
        color: `rgb(${config.color})`,
      }}
      role="status"
      aria-label={`Verification status: ${config.label}`}
    >
      <Icon size={s.iconSize} strokeWidth={2} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export default VerificationSeal;
