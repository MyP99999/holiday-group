import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import CurrencySelect from "../components/CurrencySelect";
import PersonAvatar from "../components/PersonAvatar";
import { useApp } from "../context/AppContext";
import { CURRENCY_META } from "../constants";
import { calculateBalances, convert, fmt } from "../utils";
import { createId, nextPersonColor } from "../storage/tripState";
import { useLanguage } from "../context/LanguageContext";
import { useCurrencyRates } from "../context/CurrencyRatesContext";
import { buildLogisticsExpenses } from "../utils/logisticsCosts";

export default function PeoplePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { rates, rateDate, status: rateStatus, isRefreshing, refreshRates } = useCurrencyRates();
  const {
    people, setPeople, expenses, accommodations, vehicles, flights, otherCosts,
    settlementPayments, logisticsPayments, currentMemberId, canManageMembers,
  } = useApp();
  const [name, setName] = useState("");
  const [displayCurrency, setDisplayCurrency] = useState("EUR");
  const logisticsExpenses = useMemo(() => buildLogisticsExpenses({ accommodations, vehicles, flights, otherCosts }), [accommodations, vehicles, flights, otherCosts]);
  const allExpenses = useMemo(() => [...expenses, ...logisticsExpenses], [expenses, logisticsExpenses]);
  const allPayments = useMemo(() => [...settlementPayments, ...logisticsPayments], [settlementPayments, logisticsPayments]);
  const balances = useMemo(() => calculateBalances(people, allExpenses, allPayments), [people, allExpenses, allPayments, rateDate]);
  const totalSpent = useMemo(
    () => allExpenses.reduce((sum, expense) => sum + convert(expense.amount, expense.currency, displayCurrency), 0),
    [allExpenses, displayCurrency, rateDate]
  );
  const personHasRecords = (id) => allExpenses.some((expense) =>
    String(expense.paidById) === String(id) ||
    (expense.participantIds || []).some((personId) => String(personId) === String(id)) ||
    Object.keys(expense.shares || {}).includes(String(id))
  ) || allPayments.some((payment) =>
    [payment.fromId, payment.toId, payment.viaId].some((personId) => String(personId) === String(id))
  );

  const addPerson = () => {
    const trimmed = name.trim();
    if (!trimmed || people.some((person) => person.name.toLowerCase() === trimmed.toLowerCase())) return;
    const personId = createId("person");
    setPeople((current) => [...current, {
      id: personId,
      name: trimmed,
      role: current.length ? "member" : "admin",
      color: nextPersonColor(current, personId),
      addedAt: new Date().toISOString(),
      claimedAt: null,
    }]);
    setName("");
  };

  const removePerson = (id) => {
    if (!canManageMembers) return;
    const involved = personHasRecords(id);
    if (involved) return;
    setPeople((current) => {
      const target = current.find((person) => String(person.id) === String(id));
      const adminCount = current.filter((person) => person.role === "admin").length;
      if (target?.role === "admin" && adminCount <= 1) return current;
      return current.filter((person) => String(person.id) !== String(id));
    });
  };

  const toggleAdmin = (id) => {
    if (!canManageMembers) return;
    setPeople((current) => {
      const target = current.find((person) => String(person.id) === String(id));
      const adminCount = current.filter((person) => person.role === "admin").length;
      if (target?.role === "admin" && adminCount <= 1) return current;
      return current.map((person) => String(person.id) === String(id)
        ? { ...person, role: person.role === "admin" ? "member" : "admin" }
        : person);
    });
  };

  return (
    <div className="page-stack">
      <PageHeader
        title={t("trip_overview")}
        description={t("overview_desc")}
        actions={<><button className="button secondary" onClick={() => navigate("../settle")}>{t("settle_up")}</button><button className="button primary" onClick={() => navigate("../expenses")}>{t("add_expense")}</button></>}
      />

      <section className="summary-band" aria-label="Trip summary">
        <div><strong>{fmt(totalSpent, displayCurrency)}</strong><span>{t("total_spent")}</span></div>
        <div><strong>{people.length ? fmt(totalSpent / people.length, displayCurrency) : fmt(0, displayCurrency)}</strong><span>{t("per_person")}</span></div>
        <div><strong>{people.length}</strong><span>{t("people")}</span></div>
        <div className="rate-status"><span>{rateStatus === "live" ? t("live_rates") : t("rates_updated")}</span><strong>{rateDate}</strong></div>
      </section>

      <div className="overview-grid">
        <section className="surface-panel people-panel">
          <div className="panel-heading">
            <div><h2>{t("people")}</h2><p>{t("add_everyone")}</p></div>
          </div>
          <div className="inline-control add-person-control">
            <input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addPerson()} placeholder={t("name")} aria-label={t("name")} />
            <button className="button secondary" onClick={addPerson}>{t("add_person")}</button>
          </div>

          {people.length ? (
            <div className="people-ledger">
              {people.map((person, index) => {
                const balance = convert(balances[String(person.id)] || 0, "EUR", displayCurrency);
                return (
                  <div className="people-ledger-row" key={person.id}>
                    <button className="people-profile-link" onClick={() => navigate(String(person.id))} aria-label={t("view_member_profile", { name: person.name })}>
                      <PersonAvatar person={person} people={people} index={index} inControl />
                    <span className="person-name-cell"><strong>{person.name}</strong><small>{person.role === "admin" ? t("admin") : t("member")}{String(person.id) === String(currentMemberId) ? ` · ${t("you")}` : ""}</small></span>
                    </button>
                    <span className={balance > 0.01 ? "money-positive" : balance < -0.01 ? "money-negative" : "money-muted"}>
                      {balance > 0.01 ? `${t("gets")} ${fmt(balance, displayCurrency)}` : balance < -0.01 ? `${t("owes")} ${fmt(Math.abs(balance), displayCurrency)}` : t("settled")}
                    </span>
                    <span className="people-row-actions">
                      {canManageMembers && <button className="row-action" onClick={() => toggleAdmin(person.id)}>{person.role === "admin" ? t("remove_admin") : t("make_admin")}</button>}
                      {canManageMembers && <button className="row-action" disabled={personHasRecords(person.id)} onClick={() => removePerson(person.id)}>{t("remove")}</button>}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-copy"><h3>{t("start_group")}</h3><p>{t("start_group_desc")}</p></div>
          )}
          <p className="role-note"><strong>{t("creator_admin_note")}</strong><span>{t("role_help")}</span></p>
        </section>

        <aside className="surface-panel currency-panel">
          <div className="panel-heading compact-heading">
            <div><h2>{t("currency_desk")}</h2><p>{t("currency_desc")}</p></div>
            <div className="currency-panel-actions"><CurrencySelect value={displayCurrency} onChange={setDisplayCurrency} /><button className="text-link" disabled={isRefreshing} onClick={refreshRates}>{isRefreshing ? t("updating_rates") : t("refresh_rates")}</button></div>
          </div>
          <div className="rate-list">
            {Object.entries(rates).filter(([code]) => code !== "EUR").map(([code, rate]) => (
              <div className="rate-row" key={code}>
                <span><strong>{code}</strong>{CURRENCY_META[code].name}</span>
                <b>{rate.toLocaleString("en-US", { maximumFractionDigits: 4 })}</b>
              </div>
            ))}
          </div>
          <button className="text-link rates-more" onClick={() => navigate("../expenses")}>{t("use_rates")}</button>
        </aside>
      </div>
    </div>
  );
}
