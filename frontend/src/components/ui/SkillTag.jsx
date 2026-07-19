function SkillTag({ children }) {
  return (
    <span
      className="rounded-md px-2.5 py-1 text-[11px] font-medium text-secondary"
      style={{
        background: 'rgb(var(--color-glass))',
        border: '1px solid rgb(var(--color-glass-border))',
      }}
    >
      {children}
    </span>
  );
}

export default SkillTag;
