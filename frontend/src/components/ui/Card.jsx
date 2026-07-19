function Card({ children, className = '', hover = true, glow = false }) {
  return (
    <section
      className={`rounded-xl border card-hover ${glow ? 'animate-glow-pulse' : ''} ${className}`}
      style={{
        background: 'rgb(var(--color-glass))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'rgb(var(--color-glass-border))',
      }}
    >
      {children}
    </section>
  );
}

export default Card;
