import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

console.log('[FindMeNow] main.tsx loaded');

const rootEl = document.getElementById('root');
if (!rootEl) {
  console.error('[FindMeNow] #root not found');
}

(async () => {
  try {
    const [{ default: App }, { default: ErrorBoundary }] = await Promise.all([
      import('./App'),
      import('./components/ErrorBoundary'),
    ]);

    ReactDOM.createRoot(rootEl!).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    );

    // @ts-expect-error attach debug flag
    window.__FINDMENOW_MOUNTED__ = true;
  } catch (err) {
    console.error('[FindMeNow] Bootstrap failed:', err);
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.maxWidth = '800px';
    pre.style.padding = '16px';
    pre.style.border = '1px solid #fecaca';
    pre.style.background = '#fef2f2';
    pre.style.color = '#991b1b';
    pre.style.borderRadius = '8px';
    pre.textContent = 'Failed to start app.\n' + (err instanceof Error ? err.stack || err.message : String(err));
    rootEl?.replaceChildren(pre);
  }
})();
