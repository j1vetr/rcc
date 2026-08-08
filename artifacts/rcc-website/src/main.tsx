import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';

// The prerendered HTML is served to crawlers for SEO; the browser always
// mounts a fresh React tree. We intentionally do not use hydrateRoot because
// the SSR entry renders a lightweight content-only tree, not the full
// interactive client tree, making hydration incompatible.
createRoot(document.getElementById('root')!).render(<App />);
