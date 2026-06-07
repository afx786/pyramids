function FieldError({ children }) {
  if (!children) {
    return null;
  }

  return <p className="text-xs font-bold text-accent">{children}</p>;
}

export default FieldError;
