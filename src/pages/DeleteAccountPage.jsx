import { Link } from "react-router-dom";
import PublicInfoLayout, { SUPPORT_EMAIL } from "../components/PublicInfoLayout";

const deletionSubject = encodeURIComponent("HolidaySplits account deletion request");

export default function DeleteAccountPage() {
  return (
    <PublicInfoLayout
      eyebrow="Account and data controls"
      title="Delete your HolidaySplits account"
      summary="You can permanently delete your account inside HolidaySplits or request deletion without reinstalling the app."
      updated="11 August 2026"
    >
      <section className="public-info-callout">
        <h2>Delete in the app or browser</h2>
        <ol>
          <li><Link to="/online">Sign in to HolidaySplits</Link>.</li>
          <li>Open <strong>Profile</strong>.</li>
          <li>Under <strong>Danger zone</strong>, choose <strong>Delete account</strong>.</li>
          <li>Confirm the permanent deletion. Email/password accounts re-enter their current password; Google accounts use their active authenticated session.</li>
        </ol>
      </section>

      <section>
        <h2>If you cannot sign in</h2>
        <p>Email <a href={`mailto:${SUPPORT_EMAIL}?subject=${deletionSubject}`}>{SUPPORT_EMAIL}</a> from the address connected to your HolidaySplits account, using the subject “HolidaySplits account deletion request”. Tell us that you want the account deleted. We will verify that the account belongs to you, process the request, and confirm completion.</p>
        <a className="button primary public-info-email" href={`mailto:${SUPPORT_EMAIL}?subject=${deletionSubject}`}>Request account deletion</a>
      </section>

      <section>
        <h2>What is deleted</h2>
        <ul>
          <li>Your authentication account and ability to sign in.</li>
          <li>Your private HolidaySplits profile and stored avatar.</li>
          <li>A trip owned only by you when there is no other authenticated member who can become its owner.</li>
        </ul>
      </section>

      <section>
        <h2>What may be retained</h2>
        <p>When a trip is shared with other people, ownership may transfer to another authenticated member. Expense, payment, settlement, message and action records associated with the trip may remain so other members keep an accurate group history and balance. Your account is disconnected from the trip member entry, your private profile and avatar are removed, and the remaining entry is no longer usable to sign in as you.</p>
        <p>We may also retain the minimum information required for security, fraud prevention, dispute resolution or legal compliance. Any retained information is kept only for the applicable purpose and period described in our <Link to="/privacy">Privacy Policy</Link>.</p>
      </section>

      <section>
        <h2>Local-only trips</h2>
        <p>Local trips are stored on your device and are not connected to your online account. Remove them from the local trip list before deleting the account, or clear HolidaySplits app/browser storage. Clearing local storage cannot be undone.</p>
      </section>
    </PublicInfoLayout>
  );
}
