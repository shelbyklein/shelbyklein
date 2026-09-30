import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Client portal — Shelby Klein',
  description: 'Invoices, payments, proposals, and deliverables for Shelby Klein’s clients.',
};

// Stripe no-code customer portal login link (Dashboard → Settings → Billing → Customer portal).
// Test mode only. CP-08 must replace this with the live link before deployment.
const billingPortalURL = 'https://billing.stripe.com/p/login/test_cNidR89dBc1l7p59R7ffy00';
const sharedFilesURL = 'https://drive.google.com/drive/shared-with-me';
const contactEmail = 'shelbykleindesign@gmail.com';

const steps = [
  { title: 'Proposal', body: 'A proposal PDF lands in your project folder.' },
  { title: 'Approve', body: 'Reply by email to approve the scope and price.' },
  { title: 'Invoice', body: 'Stripe emails an invoice you can pay online.' },
  { title: 'Deliver', body: 'Final files appear in your folder.' },
];

export default function ClientsPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="main" className="apps-main wrap">
        <header className="apps-heading">
          <span className="eyebrow">CLIENTS</span>
          <h1>Client<br />portal.</h1>
          <p>
            Everything for our work together lives in two places: invoices and payments through
            Stripe, and proposals and deliverables in a private folder shared with you.
          </p>
        </header>

        <section className="clients-grid" aria-label="Client resources">
          <div className="clients-card">
            <span className="eyebrow">STRIPE · SECURE BILLING</span>
            <h2>Invoices &amp; payments</h2>
            <p>Sign in with the email address I bill. Stripe emails you a one-time login link.</p>
            <ul>
              <li>View and pay open invoices</li>
              <li>Download invoices and receipts</li>
              <li>Update saved payment methods</li>
            </ul>
            <a className="clients-button" href={billingPortalURL} target="_blank" rel="noreferrer">
              Open billing portal <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="clients-card">
            <span className="eyebrow">GOOGLE DRIVE · SHARED WITH YOU</span>
            <h2>Proposals &amp; deliverables</h2>
            <p>
              Each project has a private folder shared only with your email. You’ll find proposals,
              proofs, and final files there.
            </p>
            <ul>
              <li>Review proposal PDFs, then approve by email</li>
              <li>Download proofs and final assets</li>
            </ul>
            <a className="clients-link" href={sharedFilesURL} target="_blank" rel="noreferrer">
              Open files shared with you <ArrowUpRight size={17} />
            </a>
            <p className="clients-note">
              Can’t find your folder? Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </div>
        </section>

        <ol className="clients-steps" aria-label="How it works">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooter />
    </div>
  );
}
