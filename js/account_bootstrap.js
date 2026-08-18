/* Connect account selection with the existing CyberLab state manager. */
(function () {
  function sync() {
    if (!window.CyberStorage || !window.CyberAccounts?.activeId) return;
    window.CyberStorage.setActiveAccount(window.CyberAccounts.activeId);
    setTimeout(() => {
      if (window.CyberApp?.renderAllViews) window.CyberApp.renderAllViews();
    }, 0);
  }

  // Scripts are loaded at the end of <body>, so hydrate the account immediately.
  // Waiting only for DOMContentLoaded allowed onboarding to read the default state.
  sync();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync, { once: true });
  }
  window.addEventListener('cyberlab_account_changed', sync);
})();
