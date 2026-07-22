function SkillTag({ children }) {
  return (
    <span
      className="font-mono text-[11px] px-2 py-0.5 rounded"
      style={{
        background: 'rgb(var(--color-surface-variant))',
        color: 'rgb(var(--color-on-surface))',
      }}
    >
      {children}
    </span>
  );
}

export default SkillTag;
