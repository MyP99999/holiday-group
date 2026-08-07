export default function BrandButton({ className = "", onClick, label = "HolidaySplits" }) {
  return (
    <button
      type="button"
      className={`brand-lockup ${className}`.trim()}
      onClick={onClick}
      aria-label={`${label} home`}
    >
      <img src="/brand-mark.png" alt="" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
