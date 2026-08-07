import { LANGUAGE_META } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelect({ compact = false }) {
  const { language, setLanguage } = useLanguage();
  return (
    <label className={`language-control${compact ? " compact" : ""}`}>
      <span className="visually-hidden">Language</span>
      <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Language">
        {Object.entries(LANGUAGE_META).map(([code, item]) => (
          <option key={code} value={code}>{compact ? item.short : item.label}</option>
        ))}
      </select>
    </label>
  );
}
