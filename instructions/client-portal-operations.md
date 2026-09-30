# Client portal operations

How to run a client engagement through the `/clients` page. It follows the flow in [client-portal.md](client-portal.md): proposal → approve → invoice → pay → deliver.

## One-time setup

1. **Stripe account.** Use an account you control directly, not the Wave-managed one, unless it gives full Dashboard access to Invoicing and **Settings → Billing → Customer portal**.
2. **Branding.** Go to **Settings → Branding** and add the SK mark, `#de472b` as the accent color, and your public business name.
3. **Customer portal.** In **Settings → Billing → Customer portal**, turn on invoice history and let customers update payment methods. Click **Activate link** in "Ways to get started".
4. **Put the link on the site.** Paste the login link into `billingPortalURL` in `app/clients/page.tsx`. Use the `test_` link while testing and the live link when you go live, then run the checks and deploy.
5. **Drive.** Create a top-level `Clients/` folder in Google Drive. Never share that top folder itself.

## Onboarding a new client

1. **Create the Stripe customer** (**Customers → Add customer**) with the exact email the client will sign in with. Keep one Stripe customer per email address. If two customers share an email, the portal login may open the wrong one.
2. **Create their Drive folder** at `Clients/<Client name>/<Project>/`. Share it with the same email as **Viewer**, or **Commenter** if they'll mark up proofs. Choose "Restricted", never "Anyone with the link".
3. **Send a welcome email** with the folder link, `https://shelbyklein.com/clients`, and a note that billing sign-in uses the email you have on file.

## Proposal and approval

1. Export the proposal as a PDF named `YYYY-MM-DD Proposal – <Project>.pdf` and upload it to the client's folder.
2. Email the client to say it's there.
3. The client approves by replying to the email. Keep that reply, because it's your record of approval. Save it to the folder as a PDF, or star it in Gmail.

## Invoicing and payment

1. **Invoices → Create invoice.** Pick the customer, add line items that match the approved proposal, and set payment terms, for example due in 15 days.
2. Choose **Email invoice to customer**. Stripe sends a hosted payment link.
3. The client pays through that link or at `/clients` → **Open billing portal**, where they can also download invoice and receipt PDFs and update their card.
4. Check payment status under **Invoices**. Payouts arrive on Stripe's schedule. If a client says the login email never came, make sure the email they typed matches their Stripe customer exactly.

## Delivery

1. Upload proofs to the project folder as work progresses.
2. Upload final files to a `Final/` subfolder when the project wraps up, and email the client.
3. When the engagement ends, change sharing if you want to (for example, downgrade to Viewer), but keep the folder for your records.

## Leaving Wave

- **Open Wave invoices** stay in Wave until they're paid. Don't re-issue them in Stripe.
- **New work** from now on is invoiced only in Stripe.
- **Wave history** stays in Wave for bookkeeping and tax records. It isn't imported into Stripe.
- Once the last Wave invoice is paid, turn off Wave Payments so clients can't pay through an old link by mistake.

## Rollback

- **Hide the page:** revert the portal commit and push (pushing to `main` deploys).
- **Stop portal logins:** deactivate the login link in **Settings → Billing → Customer portal**. Invoices already sent keep working through their own hosted links.
