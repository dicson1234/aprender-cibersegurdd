/* CyberLab Hash Router & Navigation Switcher */

class NavigationManager {
  constructor() {
    this.currentHash = window.location.hash || '#dashboard';
    this.mobileBreakpoint = 992;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => {
      this.navigate(window.location.hash || '#dashboard');
    });

    const toggleBtn = document.getElementById('mobile-drawer-toggle');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const openSidebar = () => {
      if (!sidebar || !overlay) return;
      sidebar.classList.add('mobile-open');
      overlay.classList.add('active');
      document.body.classList.add('drawer-open');
    };

    const closeSidebar = () => {
      if (!sidebar || !overlay) return;
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
      document.body.classList.remove('drawer-open');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= this.mobileBreakpoint) closeSidebar();
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeSidebar();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > this.mobileBreakpoint) closeSidebar();
    }, { passive: true });

    this.navigate(this.currentHash);
  }

  navigate(hash) {
    this.currentHash = hash;
    const viewName = hash.replace('#', '') || 'dashboard';

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    } else {
      const fallback = document.getElementById('view-dashboard');
      if (fallback) fallback.classList.add('active');
    }

    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === hash);
    });

    // Instant scroll on mobile avoids fighting the browser's gesture/keyboard animation.
    window.scrollTo({ top: 0, behavior: window.innerWidth <= 576 ? 'auto' : 'smooth' });

    if (window.CyberApp && window.CyberApp.onViewChange) {
      window.CyberApp.onViewChange(viewName);
    }
  }
}

window.CyberNav = new NavigationManager();
