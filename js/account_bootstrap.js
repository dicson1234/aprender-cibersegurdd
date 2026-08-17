/* Connect account selection with the existing CyberLab state manager. */
(function () {
  function sync() {
    if (!window.CyberStorage || !window.CyberAccounts?.activeId) return;
    window.CyberStorage.setActiveAccount(window.CyberAccounts.activeId);
    setTimeout(() => {
      if (window.CyberApp?.renderAllViews) window.CyberApp.renderAllViews();
    }, 0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync);
  else sync();
  window.addEventListener('cyberlab_account_changed', sync);
})();
