export function isPublicId(value) {
  if (!value || typeof value !== 'string') return false;
  return /^PYR-[A-Z]+-[A-Z0-9]{6}$/i.test(value.trim());
}

export function resolveParam(param) {
  if (!param) return null;
  const str = String(param).trim();
  if (isPublicId(str)) return { type: 'public', value: str.toUpperCase() };
  if (/^\d+$/.test(str)) return { type: 'numeric', value: str };
  return { type: 'slug', value: str };
}

export function buildEntityUrl(basePath, param) {
  const resolved = resolveParam(param);
  if (!resolved) return basePath;
  if (resolved.type === 'public') return `${basePath}?public_id=${resolved.value}`;
  return `${basePath}/${resolved.value}`;
}
