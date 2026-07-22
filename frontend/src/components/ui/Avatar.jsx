function Avatar({ alt, src, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover border transition-all duration-150 ${className}`}
      style={{ borderColor: 'rgb(var(--color-outline-variant))' }}
    />
  );
}

export default Avatar;
