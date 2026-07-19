function Skeleton({ className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`animate-shimmer rounded-lg ${className}`}
      {...props}
    />
  );
}

export function SkeletonLine({ width = '100%', className = '' }) {
  return <Skeleton className={`h-4 ${className}`} style={{ width }} />;
}

export function SkeletonBlock({ className = '' }) {
  return <Skeleton className={`h-24 w-full ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return <Skeleton className={`h-40 w-full ${className}`} />;
}

export function SkeletonAvatar({ size = 'sm', className = '' }) {
  const sizeClass = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-24 w-24' }[size];
  return <Skeleton className={`rounded-full ${sizeClass} ${className}`} />;
}

export default Skeleton;
