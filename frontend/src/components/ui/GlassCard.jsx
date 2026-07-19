function GlassCard({ children, className = '', hover = true }) {
  return (
    <section
      className={`rounded-xl border ${hover ? 'card-hover' : ''} ${className}`}
      style={{
        background: 'rgb(var(--color-glass))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgb(var(--color-glass-border))',
      }}
    >
      {children}
    </section>
  );
}

export default GlassCard;
