import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import CurrencySelect from "../components/CurrencySelect";
import PersonAvatar from "../components/PersonAvatar";
import { useApp } from "../context/AppContext";
import { calculateSettlements, convert, fmt } from "../utils";
import { createId } from "../storage/tripState";
import { useLanguage } from "../context/LanguageContext";
import { useCurrencyRates } from "../context/CurrencyRatesContext";

export default function SettlePage() {
  const { t, locale } = useLanguage();
  const { rateDate } = useCurrencyRates();
  const {
    people, expenses, paymentRoutes, setPaymentRoutes,
    settlementPayments, setSettlementPayments,
  } = useApp();
  const [currency, setCurrency] = useState("EUR");
  const [activeTab, setActiveTab] = useState("pending");
  const [confirmingPayment, setConfirmingPayment] = useState(null);
  const { balances, transactions } = useMemo(
    () => calculateSettlements(people, expenses, settlementPayments),
    [people, expenses, settlementPayments, rateDate]
  );
  const paymentHistory = useMemo(
    () => [...settlementPayments].sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)),
    [settlementPayments]
  );
  const personById = (id) => people.find((person) => String(person.id) === String(id));
  const personName = (id) => personById(id)?.name || "Unknown";

  useEffect(() => {
    if (!confirmingPayment) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => event.key === "Escape" && setConfirmingPayment(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [confirmingPayment]);

  const openPaymentConfirmation = (transaction, viaId) => {
    setConfirmingPayment({
      transaction,
      viaId,
      from: personById(transaction.from),
      to: personById(transaction.to),
      via: viaId ? personById(viaId) : null,
    });
  };

  const markPaymentPaid = () => {
    if (!confirmingPayment) return;
    const { transaction, viaId, from, to, via } = confirmingPayment;
    setSettlementPayments((current) => [...current, {
      id: createId("payment"),
      fromId: transaction.from,
      fromName: from?.name || personName(transaction.from),
      fromColor: from?.color || "",
      toId: transaction.to,
      toName: to?.name || personName(transaction.to),
      toColor: to?.color || "",
      viaId: viaId || "",
      viaName: via?.name || "",
      amountEUR: transaction.amountEUR,
      paidAt: new Date().toISOString(),
    }]);
    const routeKey = `${transaction.from}:${transaction.to}`;
    setPaymentRoutes((current) => {
      const next = { ...current };
      delete next[routeKey];
      return next;
    });
    setConfirmingPayment(null);
    setActiveTab("history");
  };

  return (
    <div className="page-stack">
      <PageHeader title={t("settle_up")} description={t("settle_desc")} actions={<CurrencySelect value={currency} onChange={setCurrency} />} />
      {!people.length ? (
        <section className="surface-panel empty-copy"><h2>{t("no_balances")}</h2><p>{t("no_balances_desc")}</p></section>
      ) : (
        <div className="settle-grid">
          <section className="surface-panel">
            <div className="panel-heading"><div><h2>{t("group_balances")}</h2><p>{t("balance_help")}</p></div></div>
            <div className="balance-ledger">
              {people.map((person, index) => {
                const balance = convert(balances[String(person.id)] || 0, "EUR", currency);
                return <div className="balance-ledger-row" key={person.id}><PersonAvatar person={person} people={people} index={index} /><strong>{person.name}</strong><span className={balance > 0.01 ? "money-positive" : balance < -0.01 ? "money-negative" : "money-muted"}>{balance > 0.01 ? `${t("gets_back")} ${fmt(balance, currency)}` : balance < -0.01 ? `${t("owes")} ${fmt(Math.abs(balance), currency)}` : t("settled")}</span></div>;
              })}
            </div>
          </section>

          <section className="surface-panel payment-panel">
            <div className="panel-heading settle-payment-heading"><div><h2>{t("payments_to_make")}</h2><p>{t("route_help")}</p></div></div>
            <div className="settle-tabs" role="tablist" aria-label={t("payments_to_make")}>
              <button role="tab" aria-selected={activeTab === "pending"} className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>{t("pending")} <span>{transactions.length}</span></button>
              <button role="tab" aria-selected={activeTab === "history"} className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>{t("history")} <span>{paymentHistory.length}</span></button>
            </div>

            {activeTab === "pending" ? (transactions.length ? (
              <div className="payment-list">{transactions.map((transaction, index) => {
                const routeKey = `${transaction.from}:${transaction.to}`;
                const viaId = paymentRoutes[routeKey] || "";
                const alternatives = people.filter((person) => ![String(transaction.from), String(transaction.to)].includes(String(person.id)));
                const amount = fmt(convert(transaction.amountEUR, "EUR", currency), currency);
                return (
                  <article className={`payment-route${viaId ? " rerouted" : ""}`} key={`${routeKey}-${index}`}>
                    <div className="payment-route-main">
                      <span><strong>{personName(transaction.from)}</strong> {t("pays")} <strong>{personName(transaction.to)}</strong></span>
                      <b>{amount}</b>
                    </div>
                    <label className="route-control">
                      <span>{t("cant_pay_direct")}</span>
                      <select value={viaId} onChange={(event) => setPaymentRoutes((current) => ({ ...current, [routeKey]: event.target.value }))}>
                        <option value="">{t("pay_directly")}</option>
                        {alternatives.map((person) => <option key={person.id} value={person.id}>{t("pay_via", { name: person.name })}</option>)}
                      </select>
                    </label>
                    {viaId ? (
                      <div className="route-steps">
                        <strong>{t("route_steps")}</strong>
                        <span>{t("first_pay", { from: personName(transaction.from), via: personName(viaId) })} · {amount}</span>
                        <span>{t("then_pay", { via: personName(viaId), to: personName(transaction.to) })} · {amount}</span>
                      </div>
                    ) : !alternatives.length && <small className="route-note">{t("no_route_people")}</small>}
                    <div className="payment-route-footer"><button className="button secondary small-button" onClick={() => openPaymentConfirmation(transaction, viaId)}>{t("mark_as_paid")}</button></div>
                  </article>
                );
              })}</div>
            ) : <div className="settled-message"><strong>{t("everything_even")}</strong><span>{expenses.length ? t("no_payments") : t("add_first_expense")}</span></div>) : paymentHistory.length ? (
              <div className="payment-history-list">{paymentHistory.map((payment) => {
                const from = personById(payment.fromId) || { id: payment.fromId, name: payment.fromName, color: payment.fromColor };
                const amount = fmt(convert(payment.amountEUR, "EUR", currency), currency);
                return (
                  <article className="payment-history-row" key={payment.id}>
                    <PersonAvatar person={from} people={people} size="small" />
                    <div><strong>{payment.fromName} {t("paid")} {payment.toName}</strong><span>{t("paid_on", { date: new Date(payment.paidAt).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) })}{payment.viaName ? ` · ${t("paid_via", { name: payment.viaName })}` : ""}</span></div>
                    <b>{amount}</b>
                  </article>
                );
              })}</div>
            ) : <div className="settled-message history-empty"><strong>{t("no_payment_history")}</strong><span>{t("no_payment_history_desc")}</span></div>}
          </section>
        </div>
      )}

      {confirmingPayment && (
        <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && setConfirmingPayment(null)}>
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-payment-title">
            <h2 id="confirm-payment-title">{t("confirm_payment")}</h2>
            <p>{t("confirm_payment_desc")}</p>
            <div className="confirm-payment-summary">
              <span><strong>{confirmingPayment.from?.name}</strong> {t("pays")} <strong>{confirmingPayment.to?.name}</strong></span>
              <b>{fmt(convert(confirmingPayment.transaction.amountEUR, "EUR", currency), currency)}</b>
              {confirmingPayment.via && <small>{t("paid_via", { name: confirmingPayment.via.name })}</small>}
            </div>
            <div className="confirm-actions"><button className="button secondary" autoFocus onClick={() => setConfirmingPayment(null)}>{t("cancel")}</button><button className="button primary" onClick={markPaymentPaid}>{t("confirm_paid")}</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
