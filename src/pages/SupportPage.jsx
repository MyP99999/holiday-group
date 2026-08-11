import { Link } from "react-router-dom";
import PublicInfoLayout, { SUPPORT_EMAIL } from "../components/PublicInfoLayout";

export default function SupportPage() {
  return (
    <PublicInfoLayout
      eyebrow="We’re here to help"
      title="Support"
      summary="Get help with your HolidaySplits account, a shared trip, or a privacy request."
      updated="11 August 2026"
    >
      <section className="public-info-callout">
        <h2>Contact HolidaySplits</h2>
        <p>Email us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Include the email address on your account and a short description of the problem. Never send your password, full card details or other payment credentials.</p>
        <a className="button primary public-info-email" href={`mailto:${SUPPORT_EMAIL}?subject=HolidaySplits%20support%20request`}>Email support</a>
      </section>
      <section><h2>Account and sign-in</h2><p>Use “Forgot password?” on the sign-in screen if you cannot access your account. If an invitation opens the wrong trip, sign in first and enter the six-character room code from the invitation.</p></section>
      <section><h2>Wrong member selected</h2><p>Ask a trip administrator to review the member in Group balances. Administrators can kick or ban an incorrectly claimed person after confirming the action. Include the trip code in a support message, but do not post it publicly.</p></section>
      <section><h2>Incorrect expense or payment</h2><p>Expense editors and trip administrators can correct eligible expenses. Only administrators can edit or delete payment records. Important changes appear in the trip’s Actions history so the group can review them.</p></section>
      <section><h2>Local trips and backups</h2><p>Local trips live only in that browser or app installation. They do not follow you to another device, and clearing storage or uninstalling can remove them. Use a shared online trip when you need synchronisation across devices.</p></section>
      <section><h2>Delete your account</h2><p>You can delete it directly in Profile → Danger zone. If you cannot sign in, use the instructions on the <Link to="/delete-account">Delete Account page</Link>.</p></section>
      <section><h2>Privacy and terms</h2><p>Read our <Link to="/privacy">Privacy Policy</Link> to understand how data is handled, or our <Link to="/terms">Terms of Service</Link> for the rules that apply when using HolidaySplits.</p></section>
    </PublicInfoLayout>
  );
}
