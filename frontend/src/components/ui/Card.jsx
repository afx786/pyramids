function Card({ children, className = '', hover = false, glow = false }) {
  return (
    <section
      className={`rounded-xl p-lg card-border card-hover ${glow ? 'animate-glow-pulse' : ''} ${className}`}
      style={{
        background: 'rgb(var(--color-surface-container-low))',
      }}
    >
      {children}
    </section>
  );
}

export default Card;
