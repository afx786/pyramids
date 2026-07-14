function Card({ children, className = '' }) {
  return (
    <section className={`rounded-xl border border-subtle bg-surface shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export default Card;
