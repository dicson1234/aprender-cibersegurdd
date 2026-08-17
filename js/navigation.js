/* CyberLab Hash Router & Navigation Switcher */

class NavigationManager {
  constructor() {
    this.currentHash = window.location.hash || '#dashboard';
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => {
      this.navigate(window.location.hash || '#dashboard');
    });

    // Mobile sidebar drawer toggle & overlay management
    const toggleBtn = document.getElementById('mobile-drawer-toggle');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const openSidebar = () => {
      if (sidebar) sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
    };

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Close sidebar on link click on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', closeSidebar);
    });

    this.navigate(this.currentHash);
  }

  navigate(hash) {
    this.currentHash = hash;
    const viewName = hash.replace('#', '') || 'dashboard';

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target view
    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    } else {
      const fallback = document.getElementById('view-dashboard');
      if (fallback) fallback.classList.add('active');
    }

    // Update Desktop Nav Active States
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === hash) {
        item.classList.add('active');
      }
    });

    // Update Mobile Bottom Nav Active States
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === hash) {
        item.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger re-renders if view handlers exist
    if (window.CyberApp && window.CyberApp.onViewChange) {
      window.CyberApp.onViewChange(viewName);
    }
  }
}

window.CyberNav = new NavigationManager();
