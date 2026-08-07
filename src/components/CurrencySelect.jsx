import { CURRENCIES, CURRENCY_META } from "../constants";

export default function CurrencySelect({ value, onChange, className = "currency-select", showName = false }) {
  return (
    <select className={className} value={value} onChange={(event) => onChange(event.target.value)}>
      {CURRENCIES.map((code) => (
        <option key={code} value={code}>
          {code} · {CURRENCY_META[code].symbol}{showName ? ` — ${CURRENCY_META[code].name}` : ""}
        </option>
      ))}
    </select>
  );
}
