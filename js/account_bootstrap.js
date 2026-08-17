/* Connect account selection with the existing CyberLab state manager. */
(function () {
  function sync() {
    if (window.CyberStorage && window.CyberAccounts?.activeId) {
      window.CyberStorage.setActiveAccount(window.CyberAccounts.activeId);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync);
  else sync();
  window.addEventListener('cyberlab_account_changed', sync);
})();
