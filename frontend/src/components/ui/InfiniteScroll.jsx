import { useEffect, useRef } from 'react';

function InfiniteScroll({ onLoadMore, hasMore, loading, children }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading]);

  return (
    <>
      {children}
      {hasMore && <div ref={sentinelRef} className="h-4" />}
      {loading && <p className="py-4 text-center text-xs font-medium text-secondary">Loading more...</p>}
    </>
  );
}

export default InfiniteScroll;
