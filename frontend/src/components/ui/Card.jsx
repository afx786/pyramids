function Card({ children, className = '' }) {
  return (
    <section className={`rounded-lg border border-subtle bg-surface ${className}`}>
      {children}
    </section>
  );
}

export default Card;
