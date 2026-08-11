# HolidaySplits Google Play publishing checklist

## App identity

- Android application ID: `com.HolidaySplits`
- Public website: `https://holidaysplits.com`
- Privacy Policy: `https://holidaysplits.com/privacy`
- Account deletion: `https://holidaysplits.com/delete-account`
- Support: `https://holidaysplits.com/support`
- Terms of Service: `https://holidaysplits.com/terms`
- Support email used by the app: `support@holidaysplits.com`

Deploy the current web build and make sure all four URLs open without authentication before submitting the store listing. Create or forward the support mailbox before publishing.

## Play Console tasks that cannot be completed in code

1. Add the Privacy Policy URL under **Policy and programmes → App content** and in the store listing where requested.
2. In **Data safety**, describe every data type handled by HolidaySplits and its configured providers. Recheck the live Supabase, Vercel and Google OAuth configuration before answering.
3. In the account deletion section, declare that accounts can be created and deleted, then enter `https://holidaysplits.com/delete-account` as the external deletion URL.
4. Complete the Ads, App access, Content rating, Target audience, News apps and Data safety declarations truthfully for the release being uploaded.
5. Upload the signed Android App Bundle (`.aab`) for Play production. Keep the signed APK for direct testing; Google Play normally expects the bundle.

## Data Safety review notes

These are prompts for the final Console review, not automatic answers:

- Account/profile: email address, display name, user/authentication ID and optional avatar.
- User content: trip locations and dates, member names, expenses, payments, settlements, logistics, comments, polls and chat messages.
- Financial information: the app stores user-entered expense, balance and settlement information but does not move money or collect card/bank credentials.
- Photos: avatar uploads are stored; the current receipt image preview is processed locally and not uploaded, though confirmed expense details are stored.
- Analytics: Vercel Web Analytics is enabled and records anonymous aggregate page-view and device information without analytics cookies.
- Third parties used by the release: Supabase, Vercel, Google when Google sign-in/fonts are used, and Frankfurter for ECB reference exchange rates.
- Data is sent over HTTPS. Verify production configuration before selecting “encrypted in transit”.
- No advertising SDK or sale of personal data is currently present in the repository.
- Account deletion is available in-app and through the public deletion-request page. Shared financial history may be retained in detached form to preserve other members’ balances, as disclosed in the Privacy Policy.

Official references:

- https://support.google.com/googleplay/android-developer/answer/10144311
- https://support.google.com/googleplay/android-developer/answer/13327111
- https://support.google.com/googleplay/android-developer/answer/10787469
