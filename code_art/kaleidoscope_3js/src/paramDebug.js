// src/paramDebug.js
// Param-change debugger for lil-gui controls.
// - Logs to console + optional on-screen panel
// - Positionable (corner + offsets) and draggable
// - Hotkeys: toggle/cycle, robust parsing with preventDefault

export function setupParamDebugger(options = {}) {
  const {
    panel = true,
    maxRows = 10,                 // ✅ default to last 10 entries
    hotkey = 'Ctrl+Shift+D',      // ✅ safer default than Alt+D (menus)
    cycleHotkey = 'Ctrl+Alt+Shift+D',
    // Positioning
    corner = 'bottom-left',       // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    offsetX = 8,
    offsetY = 8,
    zIndex = 99999,
    width = 320,
    timeFmt = (d) => d.toLocaleTimeString(),
    draggable = true,
  } = options;

  let panelEl = null;
  let visible = !!panel;
  let dragging = false;
  let dragStart = null;
  const rows = [];

  function cornerToCSS(c) {
    const base = { top: '', right: '', bottom: '', left: '' };
    if (c === 'top-right')    { base.top = `${offsetY}px`;    base.right = `${offsetX}px`; }
    if (c === 'top-left')     { base.top = `${offsetY}px`;    base.left  = `${offsetX}px`; }
    if (c === 'bottom-right') { base.bottom = `${offsetY}px`; base.right = `${offsetX}px`; }
    if (c === 'bottom-left')  { base.bottom = `${offsetY}px`; base.left  = `${offsetX}px`; }
    return base;
  }

  function ensurePanel() {
    if (panelEl || !panel) return;
    panelEl = document.createElement('div');
    panelEl.id = 'param-debugger';

    const edge = cornerToCSS(corner);
    panelEl.style.position = 'fixed';
    panelEl.style.zIndex = String(zIndex);
    panelEl.style.top = edge.top;
    panelEl.style.right = edge.right;
    panelEl.style.bottom = edge.bottom;
    panelEl.style.left = edge.left;

    panelEl.style.background = 'rgba(0,0,0,0.78)';
    panelEl.style.color = '#d7f9ff';
    panelEl.style.font = '12px/1.35 monospace';
    panelEl.style.padding = '8px 10px';
    panelEl.style.border = '2px solid #2aa0c5';
    panelEl.style.borderRadius = '8px';
    panelEl.style.maxHeight = '50vh';
    panelEl.style.overflow = 'auto';
    panelEl.style.minWidth = width + 'px';
    panelEl.style.boxShadow = '0 6px 20px rgba(0,0,0,.35)';
    panelEl.style.whiteSpace = 'pre-wrap';
    panelEl.style.userSelect = 'none';
    panelEl.style.cursor = draggable ? 'grab' : 'default';
    panelEl.title = 'Param Debugger';

    if (draggable) {
      panelEl.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        dragging = true;
        dragStart = { x: e.clientX, y: e.clientY, rect: panelEl.getBoundingClientRect() };
        panelEl.style.cursor = 'grabbing';
        e.preventDefault();
      });
      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        // Reposition using left/bottom anchors
        panelEl.style.top = '';
        panelEl.style.right = '';
        panelEl.style.left = Math.max(0, dragStart.rect.left + dx) + 'px';
        panelEl.style.bottom = Math.max(0, window.innerHeight - (dragStart.rect.bottom + dy)) + 'px';
      });
      window.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        panelEl.style.cursor = 'grab';
      });
    }

    document.body.appendChild(panelEl);
    renderPanel(); // ensure initial visibility state
  }

  function renderPanel() {
    if (!panelEl) return;
    panelEl.innerHTML = rows.join('\n');
    panelEl.style.display = visible ? 'block' : 'none';
  }

  function togglePanel() {
    if (!panelEl) ensurePanel();
    visible = !visible;
    renderPanel();
  }

  function getCurrentCorner() {
    const s = window.getComputedStyle(panelEl);
    const top = s.top !== 'auto' && s.top !== '';
    const right = s.right !== 'auto' && s.right !== '';
    const bottom = s.bottom !== 'auto' && s.bottom !== '';
    const left = s.left !== 'auto' && s.left !== '';
    if (top && right) return 'top-right';
    if (top && left) return 'top-left';
    if (bottom && right) return 'bottom-right';
    return 'bottom-left';
  }

  function applyCorner(c) {
    const edge = cornerToCSS(c);
    panelEl.style.top = edge.top;
    panelEl.style.right = edge.right;
    panelEl.style.bottom = edge.bottom;
    panelEl.style.left = edge.left;
  }

  function cycleCorner() {
    if (!panelEl) ensurePanel();
    const order = ['top-right', 'bottom-right', 'bottom-left', 'top-left'];
    const idx = order.indexOf(getCurrentCorner());
    const next = order[(idx + 1) % order.length];
    applyCorner(next);
  }

  // --- Hotkey parsing ---
  function parseHotkey(spec) {
    // e.g. "Ctrl+Shift+D" or "Alt+D"
    const parts = spec.split('+').map(s => s.trim().toLowerCase());
    const out = { alt:false, ctrl:false, shift:false, meta:false, key:'' };
    for (const p of parts) {
      if (p === 'alt') out.alt = true;
      else if (p === 'ctrl' || p === 'control') out.ctrl = true;
      else if (p === 'shift') out.shift = true;
      else if (p === 'meta' || p === 'cmd' || p === 'command') out.meta = true;
      else out.key = p;
    }
    return out;
  }
  const hkToggle = parseHotkey(hotkey);
  const hkCycle  = parseHotkey(cycleHotkey);

  function matchesHotkey(e, hk) {
    const key = (e.key || '').toLowerCase();
    const code = (e.code || '').toLowerCase();
    // Accept either the character key (e.key === 'd') or the physical code ('KeyD')
    const keyMatch = key === hk.key || code === ('key' + hk.key);
    return keyMatch &&
      (!!hk.alt   === e.altKey) &&
      (!!hk.ctrl  === e.ctrlKey) &&
      (!!hk.shift === e.shiftKey) &&
      (!!hk.meta  === e.metaKey);
  }

  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.isComposing) return;

    if (matchesHotkey(e, hkToggle)) {
      e.preventDefault();
      togglePanel();
    } else if (matchesHotkey(e, hkCycle)) {
      e.preventDefault();
      if (!panelEl) ensurePanel();
      cycleCorner();
    }
  });

  // --- Logging ---
  function logChange({ group, key, from, to }) {
    const ts = timeFmt(new Date());
    const line = `[${ts}] ${group ? group + ' • ' : ''}${key}: ${fmt(from)} → ${fmt(to)}`;
    console.log('%c[param]', 'color:#2aa0c5', line);
    if (panel) {
      ensurePanel();
      rows.push(line);
      if (rows.length > maxRows) rows.splice(0, rows.length - maxRows); // ✅ keep last N
      renderPanel();
    }
  }

  function fmt(v) {
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'number') return Number.isInteger(v) ? v.toString() : v.toFixed(4);
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (Array.isArray(v)) return JSON.stringify(v);
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }

  // --- lil-gui glue ---
  function bindController(controller, paramsObj, key, group, ...callbacks) {
    if (!controller) return controller;
    let last = paramsObj[key];
    controller.onChange((val) => {
      logChange({ group, key, from: last, to: val });
      last = val;
      for (const cb of callbacks) { try { cb && cb(val); } catch (err) { console.warn(err); } }
    });
    return controller;
  }

  return { bindController, togglePanel, logChange };
}
