function SkillTag({ children }) {
  return (
    <span
      className="rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all duration-200"
      style={{
        background: 'rgb(var(--color-accent) / 0.08)',
        border: '1px solid rgb(var(--color-accent) / 0.12)',
        color: 'rgb(var(--color-accent))',
      }}
    >
      {children}
    </span>
  );
}

export default SkillTag;
