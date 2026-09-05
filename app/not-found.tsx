import { sitePath } from '@/lib/site-path';
export default function NotFound(){return <main className="wrap not-found"><span className="eyebrow">404 — PAGE NOT FOUND</span><h1>This page<br/>could not be found.</h1><a href={sitePath('/')}>Return to the portfolio ↗</a></main>}
