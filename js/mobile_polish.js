/* CyberLab Mobile Polish
   Draws a real circuit-style connector that follows the visible learning nodes. */
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

    const points = wrappers.map((wrapper) => {
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

  function init() {
    scheduleDraw();

    const host = document.getElementById('recorrido-root');
    if (host) {
      const observer = new MutationObserver((mutations) => {
        const onlyCircuitChanges = mutations.every(mutation => {
          const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
          return nodes.length > 0 && nodes.every(node => node.nodeType === 1 && node.classList?.contains('circuit-backbone'));
        });
        if (!onlyCircuitChanges) scheduleDraw();
      });
      observer.observe(host, { childList: true, subtree: true });
    }

    window.addEventListener('resize', scheduleDraw, { passive: true });
    window.addEventListener('orientationchange', scheduleDraw, { passive: true });
    window.addEventListener('hashchange', scheduleDraw, { passive: true });
    window.addEventListener('cyberlab_state_updated', scheduleDraw);
    window.addEventListener('cyberlab_account_changed', scheduleDraw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
