function Card({ children, className = '', hover = false }) {
  return (
    <section
      className={`rounded-xl p-lg card-border ${hover ? 'card-hover' : ''} ${className}`}
      style={{
        background: 'rgb(var(--color-surface-container-low))',
      }}
    >
      {children}
    </section>
  );
}

export default Card;
