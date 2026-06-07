function Avatar({ alt, src, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ring-1 ring-subtle ${className}`}
    />
  );
}

export default Avatar;
