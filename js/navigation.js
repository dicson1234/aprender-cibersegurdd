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

    // Mobile sidebar drawer toggle
    const toggleBtn = document.getElementById('mobile-drawer-toggle');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Close sidebar on link click on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('mobile-open');
      });
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
