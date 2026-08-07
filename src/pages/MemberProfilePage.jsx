import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PersonAvatar from "../components/PersonAvatar";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { createId } from "../storage/tripState";

const PAYMENT_METHOD_TYPES = ["revolut", "paypal", "wise", "venmo", "cashapp", "bizum", "bank_transfer", "cash", "other"];

function formatIban(value = "") {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 34)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function detailsFrom(person) {
  return {
    accountHolder: person?.accountHolder || "",
    iban: formatIban(person?.iban || ""),
    paymentMethods: (person?.paymentMethods || []).map((method) => ({ ...method })),
    paymentNote: person?.paymentNote || "",
  };
}

export default function MemberProfilePage() {
  const { personId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { people, currentMemberId, canEditMemberProfile, updateMemberProfile, isSyncing } = useApp();
  const person = people.find((candidate) => String(candidate.id) === String(personId));
  const personIndex = people.findIndex((candidate) => String(candidate.id) === String(personId));
  const canEdit = canEditMemberProfile(personId);
  const hasDetails = Boolean(
    person?.iban || person?.accountHolder || person?.paymentNote || person?.paymentMethods?.some((method) => method.value)
  );
  const [editing, setEditing] = useState(() => canEdit && !hasDetails);
  const [form, setForm] = useState(() => detailsFrom(person));
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!editing) setForm(detailsFrom(person));
  }, [editing, person]);

  const visibleMethods = useMemo(
    () => (person?.paymentMethods || []).filter((method) => method.value?.trim()),
    [person?.paymentMethods]
  );

  if (!person) {
    return (
      <div className="page-stack compact-page">
        <PageHeader title={t("member_not_found")} description={t("member_not_found_desc")} actions={<button className="button secondary" onClick={() => navigate("../")}>{t("back_to_people")}</button>} />
      </div>
    );
  }

  const updateMethod = (methodId, field, value) => {
    setForm((current) => ({
      ...current,
      paymentMethods: current.paymentMethods.map((method) => method.id === methodId ? { ...method, [field]: value } : method),
    }));
  };

  const addMethod = () => {
    setForm((current) => ({
      ...current,
      paymentMethods: [...current.paymentMethods, { id: createId("payment-method"), type: "revolut", value: "" }],
    }));
  };

  const removeMethod = (methodId) => {
    setForm((current) => ({
      ...current,
      paymentMethods: current.paymentMethods.filter((method) => method.id !== methodId),
    }));
  };

  const saveDetails = async (event) => {
    event.preventDefault();
    const details = {
      accountHolder: form.accountHolder.trim(),
      iban: formatIban(form.iban),
      paymentMethods: form.paymentMethods
        .map((method) => ({ ...method, type: PAYMENT_METHOD_TYPES.includes(method.type) ? method.type : "other", value: method.value.trim() }))
        .filter((method) => method.value),
      paymentNote: form.paymentNote.trim(),
    };
    if (!await updateMemberProfile(person.id, details)) return;
    setForm(details);
    setSaved(true);
    setEditing(false);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const copyValue = async (field, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  };

  return (
    <div className="page-stack compact-page member-profile-page">
      <PageHeader
        title={person.name}
        description={t("member_profile_desc")}
        actions={<button className="button secondary" onClick={() => navigate("../")}>{t("back_to_people")}</button>}
      />

      <section className="surface-panel member-profile-identity">
        <div className="member-profile-avatar"><PersonAvatar person={person} people={people} index={Math.max(personIndex, 0)} inControl /></div>
        <div>
          <span className="member-profile-eyebrow">{person.role === "admin" ? t("admin") : t("member")}{String(person.id) === String(currentMemberId) ? ` · ${t("you")}` : ""}</span>
          <h2>{t("member_profile")}</h2>
          <p>{hasDetails ? t("payment_details_ready") : t("payment_details_missing")}</p>
        </div>
        {canEdit && !editing && <button className="button secondary" onClick={() => setEditing(true)}>{t("edit_payment_details")}</button>}
      </section>

      <section className="surface-panel member-payment-panel">
        <div className="panel-heading member-payment-heading">
          <div><h2>{t("payment_details")}</h2><p>{t("payment_details_desc")}</p></div>
          <span className="private-trip-label">{t("trip_members_only")}</span>
        </div>

        {editing ? (
          <form className="member-payment-form" onSubmit={saveDetails}>
            <div className="member-payment-grid">
              <label className="field-group">
                <span className="field-label">{t("account_holder")}</span>
                <input value={form.accountHolder} onChange={(event) => setForm((current) => ({ ...current, accountHolder: event.target.value }))} placeholder={person.name} maxLength={120} autoComplete="name" />
              </label>
              <label className="field-group">
                <span className="field-label">{t("iban")}</span>
                <input className="iban-input" value={form.iban} onChange={(event) => setForm((current) => ({ ...current, iban: formatIban(event.target.value) }))} placeholder="RO49 AAAA 1B31 0075 9384 0000" maxLength={42} autoCapitalize="characters" spellCheck="false" />
              </label>
            </div>

            <div className="payment-method-editor">
              <div className="payment-method-editor-heading"><div><strong>{t("payment_methods")}</strong><span>{t("payment_methods_help")}</span></div><button type="button" className="text-link" onClick={addMethod}>{t("add_payment_method")}</button></div>
              {form.paymentMethods.length ? form.paymentMethods.map((method) => (
                <div className="payment-method-row" key={method.id}>
                  <select value={method.type} onChange={(event) => updateMethod(method.id, "type", event.target.value)} aria-label={t("payment_method")}>
                    {PAYMENT_METHOD_TYPES.map((type) => <option value={type} key={type}>{t(`payment_method_${type}`)}</option>)}
                  </select>
                  <input value={method.value} onChange={(event) => updateMethod(method.id, "value", event.target.value)} placeholder={t("payment_handle_placeholder")} maxLength={160} aria-label={t("payment_handle")} />
                  <button type="button" className="row-action" onClick={() => removeMethod(method.id)}>{t("remove")}</button>
                </div>
              )) : <p className="payment-method-empty">{t("no_payment_methods_added")}</p>}
            </div>

            <label className="field-group">
              <span className="field-label">{t("payment_note")}</span>
              <textarea value={form.paymentNote} onChange={(event) => setForm((current) => ({ ...current, paymentNote: event.target.value }))} placeholder={t("payment_note_placeholder")} maxLength={400} rows="3" />
            </label>
            <div className="member-profile-form-actions">
              {hasDetails && <button type="button" className="button secondary" onClick={() => { setForm(detailsFrom(person)); setEditing(false); }}>{t("cancel")}</button>}
              <button type="submit" className="button primary" disabled={isSyncing}>{isSyncing ? t("saving") : t("save_payment_details")}</button>
            </div>
          </form>
        ) : hasDetails ? (
          <div className="payment-details-view">
            {(person.accountHolder || person.iban) && (
              <dl className="bank-details-card">
                {person.accountHolder && <div><dt>{t("account_holder")}</dt><dd>{person.accountHolder}</dd></div>}
                {person.iban && <div><dt>{t("iban")}</dt><dd><code>{formatIban(person.iban)}</code><button className="text-link" onClick={() => copyValue("iban", person.iban.replace(/\s/g, ""))}>{copied === "iban" ? t("copied") : t("copy")}</button></dd></div>}
              </dl>
            )}
            {visibleMethods.length > 0 && (
              <div className="payment-method-list">
                {visibleMethods.map((method) => (
                  <div className="payment-method-card" key={method.id}>
                    <span>{t(`payment_method_${method.type}`)}</span>
                    <strong>{method.value}</strong>
                    <button className="text-link" onClick={() => copyValue(method.id, method.value)}>{copied === method.id ? t("copied") : t("copy")}</button>
                  </div>
                ))}
              </div>
            )}
            {person.paymentNote && <div className="payment-note-view"><strong>{t("payment_note")}</strong><p>{person.paymentNote}</p></div>}
            {saved && <p className="form-success" role="status">{t("payment_details_saved")}</p>}
          </div>
        ) : (
          <div className="empty-copy member-payment-empty">
            <h3>{t("no_payment_details")}</h3>
            <p>{canEdit ? t("add_your_payment_details") : t("no_payment_details_desc")}</p>
            {canEdit && <button className="button primary" onClick={() => setEditing(true)}>{t("add_payment_details")}</button>}
          </div>
        )}

        {!canEdit && <p className="member-profile-permission-note">{t("only_member_can_edit")}</p>}
      </section>
    </div>
  );
}
