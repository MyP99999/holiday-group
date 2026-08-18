import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import CurrencySelect from "../components/CurrencySelect";
import PersonAvatar from "../components/PersonAvatar";
import { useApp } from "../context/AppContext";
import { calculateSettlements, convert, fmt, isBalanceSettled } from "../utils";
import { createId } from "../storage/tripState";
import { useLanguage } from "../context/LanguageContext";
import { useCurrencyRates } from "../context/CurrencyRatesContext";
import { isMemberClaimed } from "../utils/memberClaims";
import { appendActivity, createActivityEntry } from "../utils/activityLog";
import { getTripExpenses, getTripPayments, removePaymentFromTripState } from "../utils/tripFinancials";
import {
  calculateExpenseSettlements,
  canConfirmSettlementPayment,
  editablePaymentLimitEUR,
  getSettlementPaymentReasons,
  normalizeSettlementPaymentReason,
  resolveSettlementPaymentAmountEUR,
  toLocalDateTimeInput,
} from "../utils/settlementPayments";

export default function SettlePage() {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const {
    rateDate,
    selectedCurrency: currency, setSelectedCurrency: setCurrency,
  } = useCurrencyRates();
  const {
    people, expenses, accommodations, vehicles, flights, otherCosts,
    paymentRoutes, setPaymentRoutes,
    settlementPayments, setSettlementPayments, logisticsPayments,
    currentMemberId, currentPerson, canManageMembers, canModerateMembers, moderateMember,
    activityLog, updateTripState,
  } = useApp();
  const [activeTab, setActiveTab] = useState("pending");
  const [settlementMethod, setSettlementMethod] = useState("expense");
  const [confirmingPayment, setConfirmingPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentReasonId, setPaymentReasonId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [editingPayment, setEditingPayment] = useState(null);
  const [historyPaymentAmount, setHistoryPaymentAmount] = useState("");
  const [historyPaymentDate, setHistoryPaymentDate] = useState("");
  const [historyPaymentError, setHistoryPaymentError] = useState("");
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [memberModeration, setMemberModeration] = useState(null);
  const [memberModerationError, setMemberModerationError] = useState("");
  const [memberModerationBusy, setMemberModerationBusy] = useState(false);
  const allExpenses = useMemo(
    () => getTripExpenses({ expenses, accommodations, vehicles, flights, otherCosts }),
    [expenses, accommodations, vehicles, flights, otherCosts]
  );
  const allPayments = useMemo(
    () => getTripPayments({ settlementPayments, logisticsPayments }),
    [settlementPayments, logisticsPayments]
  );
  const { balances, transactions } = useMemo(
    () => calculateSettlements(people, allExpenses, allPayments),
    [people, allExpenses, allPayments, rateDate]
  );
  const expenseTransactions = useMemo(
    () => calculateExpenseSettlements(people, allExpenses, allPayments),
    [people, allExpenses, allPayments, rateDate]
  );
  const pendingTransactions = settlementMethod === "expense" ? expenseTransactions : transactions;
  const paymentHistory = useMemo(
    () => [...allPayments].sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)),
    [allPayments]
  );
  const orderedTransactions = useMemo(() => [...pendingTransactions].sort((left, right) => (
    Number(String(right.from) === String(currentMemberId)) - Number(String(left.from) === String(currentMemberId))
  )), [pendingTransactions, currentMemberId]);
  const orderedActivity = useMemo(
    () => [...(activityLog || [])].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    [activityLog]
  );
  const personById = (id) => people.find((person) => String(person.id) === String(id));
  const personName = (id) => personById(id)?.name || "Unknown";
  const selectedPaymentReason = confirmingPayment?.reasonOptions.find((reason) => reason.expenseId === paymentReasonId) || null;
  const selectedMaximumAmountEUR = selectedPaymentReason && confirmingPayment
    ? Math.min(selectedPaymentReason.remainingEUR, confirmingPayment.transaction.amountEUR)
    : 0;
  const closePaymentConfirmation = () => {
    setConfirmingPayment(null);
    setPaymentAmount("");
    setPaymentReasonId("");
    setPaymentError("");
  };
  const closePaymentEditor = () => {
    setEditingPayment(null);
    setHistoryPaymentAmount("");
    setHistoryPaymentDate("");
    setHistoryPaymentError("");
  };
  const closeMemberModeration = () => {
    if (memberModerationBusy) return;
    setMemberModeration(null);
    setMemberModerationError("");
  };

  useEffect(() => {
    if (!confirmingPayment && !editingPayment && !paymentToDelete && !memberModeration) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      if (memberModerationBusy) return;
      closePaymentConfirmation();
      closePaymentEditor();
      setPaymentToDelete(null);
      setMemberModeration(null);
      setMemberModerationError("");
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [confirmingPayment, editingPayment, paymentToDelete, memberModeration, memberModerationBusy]);

  const openPaymentConfirmation = (transaction, viaId) => {
    if (!canConfirmSettlementPayment(transaction, currentMemberId, canManageMembers)) return;
    setPaymentAmount("");
    setPaymentError("");
    const isExpenseSettlement = transaction.settlementMethod === "expense" && transaction.expenseId;
    const reasonOptions = isExpenseSettlement ? [{
      expenseId: transaction.expenseId,
      title: transaction.reason,
      payeeId: transaction.to,
      source: transaction.expenseSource,
      remainingEUR: transaction.amountEUR,
    }] : getSettlementPaymentReasons(transaction, allExpenses, allPayments);
    setPaymentReasonId(isExpenseSettlement ? transaction.expenseId : "");
    setConfirmingPayment({
      transaction,
      method: isExpenseSettlement ? "expense" : "minimum",
      viaId,
      from: personById(transaction.from),
      to: personById(transaction.to),
      via: viaId ? personById(viaId) : null,
      reasonOptions,
    });
  };

  const useFullPaymentAmount = () => {
    if (!confirmingPayment || !selectedMaximumAmountEUR) return;
    const amount = convert(selectedMaximumAmountEUR, "EUR", currency);
    setPaymentAmount(String(Number(amount.toFixed(2))));
    setPaymentError("");
  };

  const markPaymentPaid = () => {
    if (!confirmingPayment) return;
    const { transaction, viaId, from, to, via } = confirmingPayment;
    if (!canConfirmSettlementPayment(transaction, currentMemberId, canManageMembers)) {
      closePaymentConfirmation();
      return;
    }
    if (!selectedPaymentReason) {
      setPaymentError(t("payment_reason_required"));
      return;
    }
    const amountEUR = resolveSettlementPaymentAmountEUR(paymentAmount, currency, selectedMaximumAmountEUR);
    if (amountEUR === null) {
      setPaymentError(t("payment_amount_invalid"));
      return;
    }
    const reason = normalizeSettlementPaymentReason(selectedPaymentReason.title);
    if (!reason) {
      setPaymentError(t("payment_reason_required"));
      return;
    }
    const isFullPayment = transaction.amountEUR - amountEUR < 0.01;
    setSettlementPayments((current) => [...current, {
      id: createId("payment"),
      source: "settlement",
      fromId: transaction.from,
      fromName: from?.name || personName(transaction.from),
      fromColor: from?.color || "",
      toId: transaction.to,
      toName: to?.name || personName(transaction.to),
      toColor: to?.color || "",
      viaId: viaId || "",
      viaName: via?.name || "",
      expenseId: selectedPaymentReason.expenseId,
      expenseSource: selectedPaymentReason.source,
      reason,
      settlementMethod: confirmingPayment.method,
      amountEUR,
      confirmedById: currentMemberId || "",
      isPartial: !isFullPayment,
      paidAt: new Date().toISOString(),
    }]);
    if (isFullPayment) {
      const routeKey = `${transaction.from}:${transaction.to}`;
      setPaymentRoutes((current) => {
        const next = { ...current };
        delete next[routeKey];
        return next;
      });
    }
    closePaymentConfirmation();
    setActiveTab("history");
  };

  const openHistoryPaymentEditor = (payment) => {
    if (!canManageMembers) return;
    const maximumEUR = editablePaymentLimitEUR(people, allExpenses, allPayments, payment.id);
    setEditingPayment({ payment, maximumEUR });
    setHistoryPaymentAmount(String(Number(convert(payment.amountEUR, "EUR", currency).toFixed(2))));
    setHistoryPaymentDate(toLocalDateTimeInput(payment.paidAt));
    setHistoryPaymentError("");
  };

  const saveHistoryPayment = (event) => {
    event.preventDefault();
    if (!canManageMembers || !editingPayment) return;
    const maximumEUR = editablePaymentLimitEUR(people, allExpenses, allPayments, editingPayment.payment.id);
    const amountEUR = resolveSettlementPaymentAmountEUR(historyPaymentAmount, currency, maximumEUR);
    const paidAt = new Date(historyPaymentDate);
    if (amountEUR === null || Number.isNaN(paidAt.getTime())) {
      setHistoryPaymentError(t("payment_edit_invalid", { amount: fmt(convert(maximumEUR, "EUR", currency), currency) }));
      return;
    }

    const paymentField = editingPayment.payment.source === "logistics" ? "logisticsPayments" : "settlementPayments";
    const fields = [];
    if (Math.abs(Number(editingPayment.payment.amountEUR) - amountEUR) > 0.005) fields.push("amount");
    if (toLocalDateTimeInput(editingPayment.payment.paidAt) !== historyPaymentDate) fields.push("date");
    if (!fields.length) {
      closePaymentEditor();
      return;
    }
    updateTripState((current) => appendActivity({
      ...current,
      [paymentField]: current[paymentField].map((payment) => String(payment.id) === String(editingPayment.payment.id) ? {
        ...payment,
        amountEUR,
        ...(payment.source === "logistics" ? { originalAmount: Number(historyPaymentAmount), originalCurrency: currency } : {}),
        isPartial: amountEUR + 0.01 < maximumEUR,
        paidAt: paidAt.toISOString(),
        editedAt: new Date().toISOString(),
        editedById: currentMemberId || "",
      } : payment),
    }, createActivityEntry({
      type: "payment_edited",
      actor: currentPerson,
      subject: { id: editingPayment.payment.id, name: `${editingPayment.payment.fromName} → ${editingPayment.payment.toName}` },
      fields,
    })));
    closePaymentEditor();
  };

  const deleteHistoryPayment = () => {
    if (!canManageMembers || !paymentToDelete) return;
    updateTripState((current) => appendActivity(removePaymentFromTripState(
      current,
      paymentToDelete.id
    ), createActivityEntry({
      type: "payment_deleted",
      actor: currentPerson,
      subject: { id: paymentToDelete.id, name: `${paymentToDelete.fromName} → ${paymentToDelete.toName}` },
    })));
    setPaymentToDelete(null);
  };

  const openMemberModeration = (person, action) => {
    if (!canModerateMembers || String(person.id) === String(currentMemberId)) return;
    setMemberModeration({ person, action });
    setMemberModerationError("");
  };

  const confirmMemberModeration = async () => {
    if (!memberModeration || !canModerateMembers) return;
    setMemberModerationBusy(true);
    setMemberModerationError("");
    try {
      await moderateMember(memberModeration.person.id, memberModeration.action);
      setMemberModeration(null);
    } catch (error) {
      setMemberModerationError(error.message || t("member_moderation_failed"));
    } finally {
      setMemberModerationBusy(false);
    }
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
                const balanceEUR = balances[String(person.id)] || 0;
                const balance = convert(balanceEUR, "EUR", currency);
                const isSettled = isBalanceSettled(balanceEUR);
                const claimed = isMemberClaimed(person);
                const canModeratePerson = canModerateMembers && String(person.id) !== String(currentMemberId);
                return (
                  <div className={`balance-ledger-row${person.isBanned ? " is-banned" : ""}`} key={person.id}>
                    <div className="balance-member-identity">
                      <PersonAvatar person={person} people={people} index={index} />
                      <span><strong>{person.name}</strong>{person.isBanned ? <small>{t("banned_identity")}</small> : !claimed ? <small>{t("unclaimed_identity")}</small> : null}</span>
                    </div>
                    <span className={isSettled ? "money-muted" : balance > 0 ? "money-positive" : "money-negative"}>{isSettled ? t("settled") : balance > 0 ? `${t("gets_back")} ${fmt(balance, currency)}` : `${t("owes")} ${fmt(Math.abs(balance), currency)}`}</span>
                    {canModeratePerson && (
                      <div className="balance-admin-actions">
                        {person.isBanned ? (
                          <button className="row-action" onClick={() => openMemberModeration(person, "unban")}>{t("unban")}</button>
                        ) : claimed ? (
                          <>
                            <button className="row-action" onClick={() => openMemberModeration(person, "kick")}>{t("kick")}</button>
                            <button className="row-action danger-link" onClick={() => openMemberModeration(person, "ban")}>{t("ban")}</button>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="surface-panel payment-panel">
            <div className="panel-heading settle-payment-heading"><div><h2>{t("payments_to_make")}</h2><p>{t(settlementMethod === "expense" ? "expense_route_help" : "route_help")}</p></div></div>
            <div className="settlement-methods" role="radiogroup" aria-label={t("settlement_method")}>
              <button
                type="button"
                role="radio"
                aria-checked={settlementMethod === "expense"}
                className={`settlement-method-option${settlementMethod === "expense" ? " active" : ""}`}
                onClick={() => setSettlementMethod("expense")}
              >
                <span><strong>{t("by_expense")}</strong><small>{t("primary")}</small></span>
                <em>{t("by_expense_desc")}</em>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={settlementMethod === "minimum"}
                className={`settlement-method-option${settlementMethod === "minimum" ? " active" : ""}`}
                onClick={() => setSettlementMethod("minimum")}
              >
                <span><strong>{t("fewest_payments")}</strong></span>
                <em>{t("fewest_payments_desc")}</em>
              </button>
            </div>
            <div className="settle-tabs" role="tablist" aria-label={t("payments_to_make")}>
              <button role="tab" aria-selected={activeTab === "pending"} className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>{t("pending")} <span>{pendingTransactions.length}</span></button>
              <button role="tab" aria-selected={activeTab === "history"} className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>{t("history")} <span>{paymentHistory.length}</span></button>
              <button role="tab" aria-selected={activeTab === "actions"} className={activeTab === "actions" ? "active" : ""} onClick={() => setActiveTab("actions")}>{t("actions")} <span>{orderedActivity.length}</span></button>
            </div>

            {activeTab === "pending" ? (pendingTransactions.length ? (
              <div className="payment-list">{orderedTransactions.map((transaction, index) => {
                const routeKey = `${transaction.from}:${transaction.to}`;
                const viaId = paymentRoutes[routeKey] || "";
                const alternatives = people.filter((person) => ![String(transaction.from), String(transaction.to)].includes(String(person.id)));
                const amount = fmt(convert(transaction.amountEUR, "EUR", currency), currency);
                const canConfirm = canConfirmSettlementPayment(transaction, currentMemberId, canManageMembers);
                const isYourPayment = String(transaction.from) === String(currentMemberId);
                return (
                  <article className={`payment-route${viaId ? " rerouted" : ""}${isYourPayment ? " your-payment" : ""}`} key={`${routeKey}-${index}`}>
                    <div className="payment-route-main">
                      <span>{isYourPayment && <small className="your-payment-label">{t("your_payment")}</small>}<strong>{personName(transaction.from)}</strong> {t("pays")} <strong>{personName(transaction.to)}</strong></span>
                      <b>{amount}</b>
                    </div>
                    {transaction.reason && <div className="payment-route-reason"><span>{t("payment_reason")}</span><strong>{transaction.reason}</strong></div>}
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
                    <div className="payment-route-footer">
                      <button className="text-link" onClick={() => navigate(`../people/${viaId || transaction.to}`)}>{t("view_payment_details", { name: personName(viaId || transaction.to) })}</button>
                      {canConfirm
                        ? <button className="button primary small-button mark-paid-button" onClick={() => openPaymentConfirmation(transaction, viaId)}>{t("mark_as_paid")}</button>
                        : <small className="payment-permission-note">{t("payer_or_admin_only")}</small>}
                    </div>
                  </article>
                );
              })}</div>
            ) : <div className="settled-message"><strong>{t("everything_even")}</strong><span>{allExpenses.length ? t("no_payments") : t("add_first_expense")}</span></div>) : activeTab === "history" ? (paymentHistory.length ? (
              <div className="payment-history-list">{paymentHistory.map((payment) => {
                const from = personById(payment.fromId) || { id: payment.fromId, name: payment.fromName, color: payment.fromColor };
                const amount = fmt(convert(payment.amountEUR, "EUR", currency), currency);
                return (
                  <article className="payment-history-row" key={payment.id}>
                    <PersonAvatar person={from} people={people} size="small" />
                    <div><strong>{payment.fromName} {t("paid")} {payment.toName}</strong><span>{t("paid_on", { date: new Date(payment.paidAt).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) })}{payment.viaName ? ` · ${t("paid_via", { name: payment.viaName })}` : ""}{payment.editedAt ? ` · ${t("edited")}` : ""}</span></div>
                    {payment.reason
                      ? <span className="payment-history-reason">{t("payment_reason_history", { reason: payment.reason })}</span>
                      : payment.source === "logistics" && payment.logisticsTitle
                        ? <span className="payment-history-reason">{t("advance_for", { title: payment.logisticsTitle })}</span>
                        : null}
                    <div className="payment-history-side">
                      <b>{amount}</b>
                      {canManageMembers && <span><button className="row-action" onClick={() => openHistoryPaymentEditor(payment)}>{t("edit")}</button><button className="row-action danger-link" onClick={() => setPaymentToDelete(payment)}>{t("delete")}</button></span>}
                    </div>
                  </article>
                );
              })}</div>
            ) : <div className="settled-message history-empty"><strong>{t("no_payment_history")}</strong><span>{t("no_payment_history_desc")}</span></div>) : orderedActivity.length ? (
              <div className="activity-history-list">{orderedActivity.map((entry) => {
                const actor = personById(entry.actorId) || { id: entry.actorId, name: entry.actorName, color: "#6f8f7b" };
                return (
                  <article className="activity-history-row" key={entry.id}>
                    <PersonAvatar person={actor} people={people} size="small" inControl />
                    <div>
                      <strong>{t(`activity_${entry.type}`, { actor: entry.actorName || t("admin"), subject: entry.subjectName || t("item") })}</strong>
                      <span>{new Date(entry.createdAt).toLocaleString(locale, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      {entry.fields?.length ? <small>{t("activity_fields_changed", { fields: entry.fields.map((field) => t(`activity_field_${field}`)).join(", ") })}</small> : null}
                    </div>
                  </article>
                );
              })}</div>
            ) : <div className="settled-message history-empty"><strong>{t("no_actions_history")}</strong><span>{t("no_actions_history_desc")}</span></div>}
          </section>
        </div>
      )}

      {editingPayment && (
        <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && closePaymentEditor()}>
          <form className="confirm-dialog payment-history-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-payment-title" aria-describedby="edit-payment-description" onSubmit={saveHistoryPayment}>
            <h2 id="edit-payment-title">{t("edit_payment")}</h2>
            <p id="edit-payment-description">{t("edit_payment_desc")}</p>
            <div className="confirm-payment-summary">
              <span><strong>{editingPayment.payment.fromName}</strong> {t("paid")} <strong>{editingPayment.payment.toName}</strong></span>
              <b>{fmt(convert(editingPayment.payment.amountEUR, "EUR", currency), currency)}</b>
              <small>{t("maximum_supported_payment", { amount: fmt(convert(editingPayment.maximumEUR, "EUR", currency), currency) })}</small>
            </div>
            <label className="confirm-payment-amount">
              <span>{t("payment_amount")}</span>
              <div><input autoFocus type="number" min="0.01" max={Number(convert(editingPayment.maximumEUR, "EUR", currency).toFixed(2))} step="0.01" inputMode="decimal" value={historyPaymentAmount} onChange={(event) => { setHistoryPaymentAmount(event.target.value); setHistoryPaymentError(""); }} /><strong>{currency}</strong></div>
            </label>
            <label className="confirm-payment-date"><span>{t("payment_date")}</span><input type="datetime-local" value={historyPaymentDate} onChange={(event) => { setHistoryPaymentDate(event.target.value); setHistoryPaymentError(""); }} /></label>
            {historyPaymentError && <p className="form-error" role="alert">{historyPaymentError}</p>}
            <div className="confirm-actions"><button type="button" className="button secondary" onClick={closePaymentEditor}>{t("cancel")}</button><button type="submit" className="button primary">{t("save_changes")}</button></div>
          </form>
        </div>
      )}

      {paymentToDelete && (
        <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && setPaymentToDelete(null)}>
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-payment-title" aria-describedby="delete-payment-description">
            <h2 id="delete-payment-title">{t("delete_payment_title")}</h2>
            <p id="delete-payment-description">{t("delete_payment_desc")}</p>
            <div className="confirm-payment-summary"><span><strong>{paymentToDelete.fromName}</strong> {t("paid")} <strong>{paymentToDelete.toName}</strong></span><b>{fmt(convert(paymentToDelete.amountEUR, "EUR", currency), currency)}</b></div>
            <div className="confirm-actions"><button type="button" className="button secondary" autoFocus onClick={() => setPaymentToDelete(null)}>{t("cancel")}</button><button type="button" className="button danger" onClick={deleteHistoryPayment}>{t("delete_payment")}</button></div>
          </section>
        </div>
      )}

      {memberModeration && (
        <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeMemberModeration()}>
          <section className="confirm-dialog member-moderation-dialog" role="dialog" aria-modal="true" aria-labelledby="member-moderation-title" aria-describedby="member-moderation-description">
            <h2 id="member-moderation-title">{t(`${memberModeration.action}_member_title`, { name: memberModeration.person.name })}</h2>
            <p id="member-moderation-description">{t(`${memberModeration.action}_member_desc`, { name: memberModeration.person.name })}</p>
            <div className="moderation-member-summary"><PersonAvatar person={memberModeration.person} people={people} inControl /><span><strong>{memberModeration.person.name}</strong><small>{memberModeration.person.role === "admin" ? t("admin") : t("member")}</small></span></div>
            {memberModeration.action !== "unban" && <p className="moderation-preserves-data">{t("moderation_preserves_data")}</p>}
            {memberModerationError && <p className="form-error" role="alert">{memberModerationError}</p>}
            <div className="confirm-actions"><button type="button" className="button secondary" disabled={memberModerationBusy} onClick={closeMemberModeration}>{t("cancel")}</button><button type="button" className={`button ${memberModeration.action === "ban" ? "danger" : "primary"}`} disabled={memberModerationBusy} onClick={confirmMemberModeration}>{memberModerationBusy ? t("working") : t(memberModeration.action)}</button></div>
          </section>
        </div>
      )}

      {confirmingPayment && (
        <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && closePaymentConfirmation()}>
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-payment-title" aria-describedby="confirm-payment-description">
            <h2 id="confirm-payment-title">{t("confirm_payment")}</h2>
            <p id="confirm-payment-description">{t("confirm_payment_desc")}</p>
            <div className="confirm-payment-summary">
              <small className="confirm-payment-due-label">{t("total_left_to_settle")}</small>
              <span><strong>{confirmingPayment.from?.name}</strong> {t("pays")} <strong>{confirmingPayment.to?.name}</strong></span>
              <b>{fmt(convert(confirmingPayment.transaction.amountEUR, "EUR", currency), currency)}</b>
              {confirmingPayment.via && <small className="confirm-payment-via">{t("paid_via", { name: confirmingPayment.via.name })}</small>}
            </div>
            {confirmingPayment.method !== "expense" && <label className="confirm-payment-reason">
              <span>{t("payment_reason")}</span>
              <select
                autoFocus
                value={paymentReasonId}
                onChange={(event) => {
                  setPaymentReasonId(event.target.value);
                  setPaymentAmount("");
                  setPaymentError("");
                }}
              >
                <option value="">{t("choose_payment_reason")}</option>
                {confirmingPayment.reasonOptions.map((reason) => (
                  <option key={reason.expenseId} value={reason.expenseId}>
                    {reason.title} · {fmt(convert(Math.min(reason.remainingEUR, confirmingPayment.transaction.amountEUR), "EUR", currency), currency)}
                  </option>
                ))}
              </select>
            </label>}
            {selectedPaymentReason && (
              <div className="confirm-reason-summary">
                <span><small>{t("sum_to_pay")}</small><strong>{selectedPaymentReason.title}</strong></span>
                <b>{fmt(convert(selectedMaximumAmountEUR, "EUR", currency), currency)}</b>
              </div>
            )}
            <label className="confirm-payment-amount">
              <span>{t("payment_amount")}</span>
              <div>
                <input
                  autoFocus={confirmingPayment.method === "expense"}
                  type="number"
                  min="0.01"
                  max={convert(selectedMaximumAmountEUR, "EUR", currency) || undefined}
                  step="0.01"
                  inputMode="decimal"
                  disabled={!selectedPaymentReason}
                  value={paymentAmount}
                  onChange={(event) => {
                    setPaymentAmount(event.target.value);
                    setPaymentError("");
                  }}
                  placeholder="0.00"
                />
                <strong>{currency}</strong>
              </div>
            </label>
            {selectedPaymentReason && <button type="button" className="text-link full-payment-button" onClick={useFullPaymentAmount}>
              {t("use_full_amount")} · {fmt(convert(selectedMaximumAmountEUR, "EUR", currency), currency)}
            </button>}
            {paymentError && <p className="form-error" role="alert">{paymentError}</p>}
            <div className="confirm-actions"><button className="button secondary" onClick={closePaymentConfirmation}>{t("cancel")}</button><button className="button primary" disabled={!paymentAmount || !selectedPaymentReason} onClick={markPaymentPaid}>{t("confirm_paid")}</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
