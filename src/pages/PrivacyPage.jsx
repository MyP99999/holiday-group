import PublicInfoLayout, { SUPPORT_EMAIL } from "../components/PublicInfoLayout";

export default function PrivacyPage() {
  return (
    <PublicInfoLayout
      eyebrow="Your data, clearly explained"
      title="Privacy Policy"
      summary="This policy explains what HolidaySplits collects, why it is used, who can see it, and how you can control or delete it."
      updated="11 August 2026"
    >
      <section>
        <h2>1. Who we are</h2>
        <p>HolidaySplits is a group-trip planning and expense-sharing service available on the web and as a mobile application. For privacy questions or requests, contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      </section>

      <section>
        <h2>2. Information we handle</h2>
        <h3>Account and profile information</h3>
        <p>When you create an online account, we process your email address, display name, authentication identifiers and, if you add one, a profile image. Password authentication is handled securely by Supabase; HolidaySplits does not receive or store your password in readable form. If you choose Google sign-in, Google supplies the identifiers needed to sign you in.</p>

        <h3>Trip and group content</h3>
        <p>We store information you and your group enter into shared trips, including member names, trip dates and locations, expenses, currencies, payers, splits, settlements, accommodation, cars, flights, plans, polls, comments, chat messages, roles, moderation decisions and action history. This may reveal travel and financial-planning information, so only add content you are comfortable sharing with that trip’s members.</p>

        <h3>Local trips</h3>
        <p>Trips created in local mode are stored on your device in browser or app storage and are not synced to a HolidaySplits account. Clearing app or browser data can remove them permanently.</p>

        <h3>Photos and receipt scanning</h3>
        <p>HolidaySplits accesses a photo only when you choose one for an avatar or receipt scan. Avatar images are uploaded to provide your profile image. In the current receipt scanner, the selected receipt image is previewed and processed on your device and is not uploaded or retained by HolidaySplits; expense details you confirm may be saved to your trip.</p>

        <h3>Technical and analytics information</h3>
        <p>Vercel Web Analytics records privacy-focused, aggregated visit information such as page, referrer, approximate location, browser, operating system and device type. It does not use analytics cookies or retain an identifier that follows you across websites. Our hosting, authentication and database providers may also process IP addresses, device details and security logs to operate and protect the service.</p>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <ul>
          <li>To create accounts, authenticate users and sync shared trips.</li>
          <li>To calculate balances, expenses and suggested settlements.</li>
          <li>To provide collaboration, messaging, planning and administrator tools.</li>
          <li>To secure, troubleshoot and improve the service.</li>
          <li>To respond to support, privacy and deletion requests and meet legal obligations.</li>
        </ul>
        <p>Depending on where you live, these uses rely on performing our agreement with you, your consent, our legitimate interests in operating and securing the service, and compliance with law.</p>
      </section>

      <section>
        <h2>4. Who receives information</h2>
        <p>Members of a shared trip can see the trip content and identity information made available in that trip. Trip administrators can manage members and correct or remove certain records.</p>
        <p>We use service providers including Supabase for database, authentication, realtime features and file storage; Vercel for hosting and privacy-focused analytics; and Google when you use Google sign-in or load Google-hosted fonts. Currency lookups use Frankfurter’s European Central Bank reference-rate feed; trip content is not sent with a rate request.</p>
        <p>We may disclose information when required by law, to protect people or the service, or as part of a business transfer subject to appropriate safeguards. We do not sell personal data, serve behavioural advertising or use an advertising identifier.</p>
      </section>

      <section>
        <h2>5. Storage, security and international transfers</h2>
        <p>We use access controls, encrypted network connections and database row-level security to protect online trip data. No online service can guarantee absolute security. Our providers may process information in countries outside your own under their contractual and legal transfer safeguards.</p>
      </section>

      <section>
        <h2>6. Retention and deletion</h2>
        <p>We keep account and online trip information while it is needed to provide the service, maintain shared financial records, resolve disputes, protect the service or satisfy legal obligations. You can delete your account in Profile → Danger zone or use our <a href="/delete-account">public account-deletion page</a>.</p>
        <p>Account deletion removes your authentication account, private profile and avatar. Trips owned only by you are deleted when no other authenticated member can take ownership. In shared trips, ownership may pass to another member and entries connected to you are detached from your account and retained under the trip member name so the other members’ expense history and balances remain correct. Trip administrators can later edit or delete eligible trip records or remove the trip.</p>
      </section>

      <section>
        <h2>7. Your choices and rights</h2>
        <p>You can update your profile, leave or manage trips according to your role, and delete your account in the app. Depending on your location, you may also have rights to access, correct, export, restrict, object to or erase personal data, and to complain to your local data-protection authority. Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to exercise a right. We may need to verify your identity first.</p>
      </section>

      <section>
        <h2>8. Children</h2>
        <p>HolidaySplits is not directed to children under 13, or below the minimum age required to consent to an online service in their country. If you believe a child has provided personal data without appropriate permission, contact us.</p>
      </section>

      <section>
        <h2>9. Changes to this policy</h2>
        <p>We may update this policy when the app, our providers or legal requirements change. We will publish the revised version here and change the date above. Material changes may also be highlighted in the app.</p>
      </section>
    </PublicInfoLayout>
  );
}
