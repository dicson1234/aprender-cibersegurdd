/* Mobile-only app shell controls. Desktop remains unchanged. */
(function () {
  const THEME_KEY = 'cyberlab_mobile_theme';

  function setTheme(theme) {
    const dark = theme !== 'light';
    document.documentElement.classList.toggle('mobile-dark-mode', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    const btn = document.getElementById('mobile-dark-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.innerHTML = dark
        ? '<span class="mobile-dark-dot">●</span><span>MODO OSCURO</span>'
        : '<span class="mobile-dark-dot">○</span><span>MODO CLARO</span>';
    }
  }

  function init() {
    const saved = localStorage.getItem(THEME_KEY);
    setTheme(saved || 'dark');

    document.getElementById('mobile-dark-toggle')?.addEventListener('click', function () {
      const isDark = document.documentElement.classList.contains('mobile-dark-mode');
      setTheme(isDark ? 'light' : 'dark');
    });

    document.getElementById('mobile-profile-btn')?.addEventListener('click', function () {
      window.location.hash = '#profile';
    });

    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
