/* CyberLab Mobile Polish
   Circuit journey + defensive UI hardening for mobile/desktop. */
(function () {
  const ROOT_SELECTOR = '#recorrido-root .serpentine-path';

  function getNodeWrappers(root) {
    return Array.from(root.querySelectorAll('.node-wrapper')).filter(w => w.querySelector('.path-node-btn[data-module-id]'));
  }

  function assignSides(wrappers) {
    const pattern = ['center', 'right', 'center', 'left'];
    wrappers.forEach((wrapper, index) => {
      wrapper.dataset.circuitSide = pattern[index % pattern.length];
    });
  }

  function drawCircuit(root) {
    if (!root || window.matchMedia('(min-width: 993px)').matches) return;

    const wrappers = getNodeWrappers(root);
    if (!wrappers.length) return;

    assignSides(wrappers);

    const old = root.querySelector('.circuit-backbone');
    if (old) old.remove();

    const rect = root.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(root.scrollHeight, rect.height, 1);
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('circuit-backbone');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    const points = wrappers.map(wrapper => {
      const button = wrapper.querySelector('.path-node-btn');
      const buttonRect = button.getBoundingClientRect();
      return {
        x: buttonRect.left - rect.left + buttonRect.width / 2,
        y: buttonRect.top - rect.top + buttonRect.height / 2
      };
    });
    if (!points.length) return;

    const pathParts = [`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`];
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midY = (prev.y + curr.y) / 2;
      pathParts.push(`L ${prev.x.toFixed(1)} ${midY.toFixed(1)}`);
      pathParts.push(`L ${curr.x.toFixed(1)} ${midY.toFixed(1)}`);
      pathParts.push(`L ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`);
    }
    const d = pathParts.join(' ');

    const glow = document.createElementNS(svgNS, 'path');
    glow.classList.add('circuit-glow');
    glow.setAttribute('d', d);
    svg.appendChild(glow);

    const line = document.createElementNS(svgNS, 'path');
    line.classList.add('circuit-line');
    line.setAttribute('d', d);
    svg.appendChild(line);

    const accent = document.createElementNS(svgNS, 'path');
    accent.classList.add('circuit-purple');
    accent.setAttribute('d', d);
    svg.appendChild(accent);

    points.forEach(point => {
      const glowDot = document.createElementNS(svgNS, 'circle');
      glowDot.classList.add('circuit-node-glow');
      glowDot.setAttribute('cx', point.x);
      glowDot.setAttribute('cy', point.y);
      glowDot.setAttribute('r', 8);
      svg.appendChild(glowDot);

      const dot = document.createElementNS(svgNS, 'circle');
      dot.classList.add('circuit-dot');
      dot.setAttribute('cx', point.x);
      dot.setAttribute('cy', point.y);
      dot.setAttribute('r', 4);
      svg.appendChild(dot);
    });

    root.insertBefore(svg, root.firstChild);
  }

  let redrawTimer = null;
  function scheduleDraw() {
    clearTimeout(redrawTimer);
    redrawTimer = setTimeout(() => {
      const root = document.querySelector(ROOT_SELECTOR);
      if (root) drawCircuit(root);
    }, 80);
  }

  function installTutorBackdrop() {
    const tutor = document.getElementById('cybertutor-drawer');
    if (!tutor || tutor.dataset.hardened === '1') return;

    let backdrop = document.getElementById('cybertutor-hard-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'cybertutor-hard-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.style.cssText = [
        'position:fixed','inset:0','background:rgba(2,6,10,.92)',
        'backdrop-filter:blur(7px)','-webkit-backdrop-filter:blur(7px)',
        'opacity:0','pointer-events:none','z-index:10040',
        'transition:opacity .18s ease'
      ].join(';');
      document.body.appendChild(backdrop);
    }

    const originalToggle = window.CyberTutorAssistant?.toggleDrawer;
    if (typeof originalToggle === 'function' && !originalToggle.__hardened) {
      const wrapped = function () {
        originalToggle.call(this);
        const open = !!this.isOpen;
        backdrop.style.opacity = open ? '1' : '0';
        backdrop.style.pointerEvents = open ? 'auto' : 'none';
        document.body.classList.toggle('cybertutor-open', open);
        if (open) {
          backdrop.onclick = () => this.toggleDrawer();
        }
      };
      wrapped.__hardened = true;
      window.CyberTutorAssistant.toggleDrawer = wrapped;
      tutor.dataset.hardened = '1';
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && window.CyberTutorAssistant?.isOpen) {
        window.CyberTutorAssistant.toggleDrawer();
      }
    }, { passive: true });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>\"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function hardenTutorMarkdown() {
    const tutor = window.CyberTutor;
    if (!tutor || typeof tutor.parseMarkdown !== 'function' || tutor.parseMarkdown.__hardened) return;

    const safeMarkdown = function (text) {
      let str = escapeHtml(text);
      str = str.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_, lang, code) => `<pre><code>${code.trim()}</code></pre>`);
      str = str.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,.3);padding:2px 6px;border-radius:4px;color:#00f0ff">$1</code>');
      str = str.replace(/^### (.*$)/gim, '<h3>$1</h3>');
      str = str.replace(/^## (.*$)/gim, '<h2>$1</h2>');
      str = str.replace(/^# (.*$)/gim, '<h1>$1</h1>');
      str = str.replace(/^---$/gim, '<hr>');
      str = str.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
      str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');
      str = str.replace(/^[\*\-] (.*$)/gim, '<ul><li>$1</li></ul>').replace(/<\/ul>\s*<ul>/g, '');
      str = str.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>').replace(/<\/ol>\s*<ol>/g, '');
      return str.split(/\n{2,}/).map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (/^<(h[1-3]|pre|blockquote|ul|ol|hr)/i.test(trimmed)) return trimmed;
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
      }).join('');
    };
    safeMarkdown.__hardened = true;
    tutor.parseMarkdown = safeMarkdown;
  }

  function hardenHeader() {
    const app = window.CyberApp;
    if (!app || app.updateHeaderStats?.__hardened) return;

    const updateHeaderStats = function () {
      const data = window.CyberStorage?.data || {};
      document.querySelectorAll('.stat-xp-val').forEach(el => { el.textContent = Number(data.xp || 0).toLocaleString(); });
      document.querySelectorAll('.stat-level-val').forEach(el => { el.textContent = String(data.level || 1); });
      document.querySelectorAll('.stat-streak-val').forEach(el => { el.textContent = `${data.streak || 1} d`; });

      const account = window.CyberAccounts?.getActive?.();
      const userBox = document.getElementById('header-user-profile-badge');
      if (!account || !userBox) return;

      userBox.replaceChildren();
      const avatar = account.avatar || '👤';
      if (avatar.startsWith('data:image/') || avatar.startsWith('https://')) {
        const img = document.createElement('img');
        img.src = avatar;
        img.alt = '';
        img.width = 24;
        img.height = 24;
        img.style.cssText = 'width:24px;height:24px;border-radius:50%;object-fit:cover;border:1px solid var(--accent-cyan)';
        userBox.appendChild(img);
      } else {
        const avatarSpan = document.createElement('span');
        avatarSpan.style.fontSize = '1.1rem';
        avatarSpan.textContent = avatar;
        userBox.appendChild(avatarSpan);
      }
      const name = document.createElement('span');
      name.style.cssText = 'font-weight:700;font-size:.85rem';
      name.textContent = account.username || 'Estudiante';
      userBox.appendChild(name);
    };

    updateHeaderStats.__hardened = true;
    app.updateHeaderStats = updateHeaderStats;
    updateHeaderStats();
  }

  function init() {
    scheduleDraw();
    installTutorBackdrop();
    hardenTutorMarkdown();
    hardenHeader();

    const host = document.getElementById('recorrido-root');
    if (host) {
      const observer = new MutationObserver(mutations => {
        const onlyCircuitChanges = mutations.every(mutation => {
          const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
          return nodes.length > 0 && nodes.every(node => node.nodeType === 1 && node.classList?.contains('circuit-backbone'));
        });
        if (!onlyCircuitChanges) scheduleDraw();
        installTutorBackdrop();
      });
      observer.observe(host, { childList: true, subtree: true });
    }

    window.addEventListener('resize', scheduleDraw, { passive: true });
    window.addEventListener('orientationchange', scheduleDraw, { passive: true });
    window.addEventListener('hashchange', scheduleDraw, { passive: true });
    window.addEventListener('cyberlab_state_updated', () => { scheduleDraw(); hardenHeader(); });
    window.addEventListener('cyberlab_account_changed', () => { scheduleDraw(); hardenHeader(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
