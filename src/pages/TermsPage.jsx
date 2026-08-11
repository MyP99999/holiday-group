import PublicInfoLayout, { SUPPORT_EMAIL } from "../components/PublicInfoLayout";

export default function TermsPage() {
  return (
    <PublicInfoLayout
      eyebrow="Using HolidaySplits"
      title="Terms of Service"
      summary="These terms set the ground rules for using HolidaySplits and collaborating responsibly with your travel group."
      updated="11 August 2026"
    >
      <section><h2>1. Acceptance and eligibility</h2><p>By using HolidaySplits, you agree to these terms and our Privacy Policy. You must be legally able to enter into this agreement and meet the minimum digital-consent age in your country. If you do not agree, do not use the service.</p></section>
      <section><h2>2. Your account</h2><p>Provide accurate account information, protect your sign-in credentials and tell us promptly if you suspect unauthorised access. You are responsible for activity performed through your account. Do not claim another person’s trip identity unless you are that person or have their clear permission.</p></section>
      <section><h2>3. Trips, expenses and settlements</h2><p>HolidaySplits helps groups record and calculate shared costs. It is not a bank, payment processor, accountant or financial adviser, and it does not transfer money. Balances and settlement suggestions depend on the information your group enters. Confirm amounts, currencies, exchange rates and recipient details before making a real payment.</p><p>Exchange rates are reference values and may differ from bank, card or cash-conversion rates. Users remain responsible for taxes, reimbursements and agreements within their group.</p></section>
      <section><h2>4. Group administration</h2><p>Trip administrators may manage members, edit or delete eligible payment and expense records, and kick or ban members. Administrators must use these powers fairly and verify changes before confirming them. HolidaySplits records certain administrative and financial edits in trip history for accountability.</p></section>
      <section><h2>5. Your content</h2><p>You keep ownership of content you submit. You give HolidaySplits a limited permission to host, process, display and transmit it only as needed to operate and improve the service. You confirm that you have the right to share the content and member information you add. Shared-trip content is visible to that trip’s members.</p></section>
      <section><h2>6. Acceptable use</h2><p>Do not misuse the service, break the law, impersonate others, harass members, upload malicious or infringing content, attempt unauthorised access, interfere with the service, scrape it at scale, or use it to deceive people about debts or payments. We may restrict or terminate access when reasonably necessary to protect users or the service.</p></section>
      <section><h2>7. Service availability</h2><p>We aim to keep HolidaySplits available and accurate, but features may change and the service may occasionally be interrupted. Keep independent records of important bookings, receipts and payment confirmations. Local-only data can be lost if device or browser storage is cleared.</p></section>
      <section><h2>8. Account termination</h2><p>You may stop using HolidaySplits or delete your account at any time. We may suspend or terminate access for serious or repeated violations, legal requirements or security risks. The treatment of shared records after deletion is explained in the Privacy Policy and on the Delete Account page.</p></section>
      <section><h2>9. Disclaimers and liability</h2><p>HolidaySplits is provided “as is” and “as available” to the extent permitted by law. We do not guarantee uninterrupted availability, error-free calculations or that another member will pay an amount shown. To the extent permitted by law, HolidaySplits is not liable for indirect or consequential losses, lost data, travel disruption, or disputes and payments between group members. Nothing here excludes rights or liability that cannot legally be excluded.</p></section>
      <section><h2>10. Changes and contact</h2><p>We may update these terms to reflect product or legal changes. The revised terms will be posted here with a new date. Questions can be sent to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p></section>
    </PublicInfoLayout>
  );
}
