/**
 * _spotlight.js — Shared CMD+K spotlight search
 * Works on both index.html (root) and component pages (components/).
 * Searches components and CSS design tokens.
 */
(function () {

  /* ── Component data ────────────────────────────────────────── */

  var ITEMS = [
    // Foundation
    { name: 'Colors',      desc: 'Semantic color tokens',         href: 'colors.html',      cat: 'Foundation',     icon: 'ph-palette',             keys: 'color palette semantic swatches' },
    { name: 'Typography',  desc: 'Type scale & text styles',      href: 'typography.html',  cat: 'Foundation',     icon: 'ph-text-aa',             keys: 'font size weight heading label' },
    { name: 'Tokens',      desc: 'All CSS variables',             href: 'tokens.html',      cat: 'Foundation',     icon: 'ph-brackets-curly',      keys: 'css variables primitives design system' },
    // AI Components
    { name: 'Action Overflow Menu',    desc: 'Contextual action dropdown',                href: 'action-overflow-menu.html',    cat: 'AI Components', icon: 'ph-dots-three-outline',     keys: 'action overflow menu dropdown contextual' },
    { name: 'Alert',                   desc: 'Inline feedback — info, success, warning',  href: 'alert.html',                   cat: 'AI Components', icon: 'ph-warning-circle',         keys: 'alert notification banner inline feedback info success warning error' },
    { name: 'App Bar',                 desc: 'AI assistant title bar',                    href: 'app-bar.html',                 cat: 'AI Components', icon: 'ph-app-window',             keys: 'app bar header title navigation window ai' },
    { name: 'Avatar',                  desc: 'Initials badge for workspaces',             href: 'avatar.html',                  cat: 'AI Components', icon: 'ph-user-circle',            keys: 'avatar badge initials user workspace circle photo' },
    { name: 'Badge',                   desc: 'Status labels, counts & notification overlays', href: 'badge.html',               cat: 'AI Components', icon: 'ph-seal',                   keys: 'badge label status tag count dot notification overlay pill' },
    { name: 'Bottom Sheet',            desc: 'Slide-up overlay panel',                   href: 'bottomsheet.html',             cat: 'AI Components', icon: 'ph-arrow-square-up',        keys: 'bottom sheet slide panel drawer mobile overlay' },
    { name: 'Button',                  desc: 'Primary, secondary, tertiary',              href: 'button.html',                  cat: 'AI Components', icon: 'ph-cursor-click',           keys: 'button primary secondary tertiary action cta' },
    { name: 'Card',                    desc: 'Base content container',                    href: 'card.html',                    cat: 'AI Components', icon: 'ph-rectangle',              keys: 'card container base panel header body footer layout wrapper' },
    { name: 'Chat Bubble',             desc: 'User message bubble',                       href: 'chat-bubble.html',             cat: 'AI Components', icon: 'ph-chat-circle',            keys: 'chat bubble message user conversation reply' },
    { name: 'Empty State',             desc: 'Zero-data & onboarding placeholder',        href: 'empty-state.html',             cat: 'AI Components', icon: 'ph-image-broken',           keys: 'empty state placeholder zero data no results onboarding blank' },
    { name: 'FAB',                     desc: 'Floating action button',                    href: 'fab.html',                     cat: 'AI Components', icon: 'ph-plus-circle',            keys: 'fab floating action button compose new' },
    { name: 'Fav Bar Icon',            desc: 'Favorite bar logo icon',                    href: 'fav-bar-icon.html',            cat: 'AI Components', icon: 'ph-star',                   keys: 'fav bar icon favorite logo brand' },
    { name: 'Feedback Action',         desc: 'AI response action bar',                    href: 'feedback-action.html',         cat: 'AI Components', icon: 'ph-thumbs-up',              keys: 'feedback action thumbs like copy regenerate bar' },
    { name: 'Modal',                   desc: 'Dialog overlay with header, body & footer', href: 'modal.html',                   cat: 'AI Components', icon: 'ph-frame-corners',          keys: 'modal dialog overlay popup confirm delete rename' },
    { name: 'Prompt Input',            desc: 'Contextual message composer',               href: 'prompt-input.html',            cat: 'AI Components', icon: 'ph-pencil-line',            keys: 'prompt input message composer chat text area' },
    { name: 'Search',                  desc: 'Search input with results',                 href: 'search.html',                  cat: 'AI Components', icon: 'ph-magnifying-glass',       keys: 'search input results filter find' },
    { name: 'Side Nav',                desc: 'Full chat navigation panel',                href: 'sidenav.html',                 cat: 'AI Components', icon: 'ph-sidebar-simple',         keys: 'side nav sidenav navigation panel chat history list' },
    { name: 'Side Nav Footer',         desc: 'Utility links at nav bottom',               href: 'sidenav-footer.html',          cat: 'AI Components', icon: 'ph-align-bottom',           keys: 'side nav footer utility links settings profile' },
    { name: 'Side Nav Item',           desc: 'Chat list row',                             href: 'side-nav-item.html',           cat: 'AI Components', icon: 'ph-list-dashes',            keys: 'side nav item chat list row conversation' },
    { name: 'Side Nav Section Header', desc: 'Chat list group label',                     href: 'side-nav-section-header.html', cat: 'AI Components', icon: 'ph-text-h',                 keys: 'section header chat group label divider' },
    { name: 'Suggestion List Item',    desc: 'Autocomplete & prompt suggestion row',      href: 'suggestion-list-item.html',    cat: 'AI Components', icon: 'ph-magic-wand',             keys: 'suggestion autocomplete prompt list item row completion' },
    { name: 'Thinking Indicator',      desc: 'AI reasoning & progress states',            href: 'thinking-indicator.html',      cat: 'AI Components', icon: 'ph-brain',                  keys: 'thinking indicator loading progress ai reasoning spinner' },
    { name: 'Title Bar',               desc: 'Chat title navigation bar',                 href: 'title-bar.html',               cat: 'AI Components', icon: 'ph-article',                keys: 'title bar chat header navigation back' },
    { name: 'Workspace Selector',      desc: 'Switch between workspaces',                 href: 'workspace-selector.html',      cat: 'AI Components', icon: 'ph-buildings',              keys: 'workspace selector switch org team account' },
  ];

  /* ── Path resolution ───────────────────────────────────────── */

  var isRoot = !location.pathname.includes('/components/');
  var base   = isRoot ? './components/' : './';

  function resolveHref(href) { return base + href; }

  /* ── Token data (pre-fetched from app-tokens.css) ──────────── */

  var TOKEN_CACHE       = null;   // null = not yet loaded; [] = loaded (even if empty)
  var tokenFetchStarted = false;

  function prefetchTokens() {
    if (TOKEN_CACHE !== null || tokenFetchStarted) return;
    tokenFetchStarted = true;
    var cssPath = isRoot ? './css/app-tokens.css' : '../css/app-tokens.css';

    // Try fetch first; fall back to XHR for file:// contexts
    var p;
    if (typeof fetch !== 'undefined') {
      p = fetch(cssPath).then(function (r) {
        if (!r.ok) throw new Error('fetch failed');
        return r.text();
      });
    } else {
      p = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', cssPath, true);
        xhr.onload  = function () { xhr.status < 400 ? resolve(xhr.responseText) : reject(); };
        xhr.onerror = reject;
        xhr.send();
      });
    }

    p.then(function (text) {
      TOKEN_CACHE = parseTokens(text);
      // Re-render if spotlight is open with any current query
      if (backdrop && backdrop.classList.contains('spotlight-backdrop--open') && input) {
        render(input.value);
      }
    }).catch(function () {
      // XHR fallback for file:// where fetch may be blocked
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', cssPath, false);  // synchronous as last resort
        xhr.send(null);
        if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
          TOKEN_CACHE = parseTokens(xhr.responseText);
        } else {
          TOKEN_CACHE = [];
        }
      } catch (e) {
        TOKEN_CACHE = [];
      }
      if (backdrop && backdrop.classList.contains('spotlight-backdrop--open') && input) {
        render(input.value);
      }
    });
  }

  function parseTokens(text) {
    var tokens = [];
    // Match "  --token-name: value;" lines
    var re = /^\s*(--[\w-]+)\s*:\s*([^;{]+);/gm;
    var m;
    while ((m = re.exec(text)) !== null) {
      tokens.push({ name: m[1].trim(), value: m[2].trim() });
    }
    return tokens;
  }

  function searchTokens(query) {
    if (!TOKEN_CACHE || !query || query.length < 2) return [];
    // Allow searching with or without leading --
    var q = query.toLowerCase().replace(/^--/, '');
    var exact = [], partial = [];
    for (var i = 0; i < TOKEN_CACHE.length; i++) {
      var tok  = TOKEN_CACHE[i];
      var name = tok.name.toLowerCase().replace(/^--/, '');
      var val  = tok.value.toLowerCase();
      if (name.includes(q)) {
        // Prioritise tokens where name segment starts with query
        name.split('-').some(function (seg) { return seg.startsWith(q); })
          ? exact.push(tok) : partial.push(tok);
      } else if (q.length >= 3 && val.includes(q)) {
        partial.push(tok);
      }
      if (exact.length + partial.length >= 20) break;
    }
    return exact.concat(partial).slice(0, 8);
  }

  /* ── DOM construction ──────────────────────────────────────── */

  var backdrop, input, results;

  function buildDOM() {
    backdrop = document.createElement('div');
    backdrop.className = 'spotlight-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Search components');

    backdrop.innerHTML = [
      '<div class="spotlight">',
      '  <div class="spotlight__search-row">',
      '    <i class="ph-bold ph-magnifying-glass spotlight__search-icon"></i>',
      '    <input class="spotlight__input" type="search" placeholder="Search components or tokens…" autocomplete="off" spellcheck="false">',
      '    <span class="spotlight__kbd-hint">ESC to close</span>',
      '  </div>',
      '  <div class="spotlight__results" role="listbox"></div>',
      '  <div class="spotlight__footer">',
      '    <span class="spotlight__footer-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>',
      '    <span class="spotlight__footer-hint"><kbd>↵</kbd> open</span>',
      '    <span class="spotlight__footer-hint"><kbd>ESC</kbd> close</span>',
      '  </div>',
      '</div>',
    ].join('');

    document.body.appendChild(backdrop);

    input   = backdrop.querySelector('.spotlight__input');
    results = backdrop.querySelector('.spotlight__results');

    // Close on backdrop click
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) close();
    });

    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', onKeydown);
  }

  /* ── Rendering ─────────────────────────────────────────────── */

  var activeIdx = -1;

  function render(q) {
    activeIdx = -1;
    var query = (q || '').trim().toLowerCase();

    var filtered = query
      ? ITEMS.filter(function (it) {
          return (it.name + ' ' + it.desc + ' ' + it.cat + ' ' + it.keys)
                 .toLowerCase().includes(query);
        })
      : ITEMS;

    // Token results (only when there's a query)
    var tokenResults = searchTokens(query);

    if (!filtered.length && !tokenResults.length) {
      results.innerHTML = '<p class="spotlight__empty">No results for "<strong>' + escHtml(q) + '</strong>"</p>';
      return;
    }

    // Group components by category
    var groups = {};
    var order  = [];
    filtered.forEach(function (it) {
      if (!groups[it.cat]) { groups[it.cat] = []; order.push(it.cat); }
      groups[it.cat].push(it);
    });

    var html = '';

    // ── Component results ──────────────────────────────────────
    order.forEach(function (cat) {
      html += '<div class="spotlight__group"><span class="spotlight__group-label">' + escHtml(cat) + '</span></div>';
      groups[cat].forEach(function (it) {
        html += [
          '<a class="spotlight__item" href="' + resolveHref(it.href) + '" role="option" data-href="' + resolveHref(it.href) + '">',
          '  <span class="spotlight__item-icon"><i class="ph-bold ' + it.icon + '"></i></span>',
          '  <span class="spotlight__item-body">',
          '    <span class="spotlight__item-name">' + highlight(escHtml(it.name), query) + '</span>',
          '    <span class="spotlight__item-desc">' + escHtml(it.desc) + '</span>',
          '  </span>',
          '  <i class="ph-bold ph-arrow-right spotlight__item-arrow"></i>',
          '</a>',
        ].join('');
      });
    });

    // ── Token results ──────────────────────────────────────────
    if (tokenResults.length) {
      var tokensHref = resolveHref('tokens.html');
      html += '<div class="spotlight__group"><span class="spotlight__group-label">Tokens</span></div>';
      tokenResults.forEach(function (tok) {
        var tokenUrl  = tokensHref + '?t=' + encodeURIComponent(tok.name);
        var isColor   = /color/.test(tok.name.toLowerCase());
        var iconHtml  = isColor
          ? '<span class="spotlight__token-swatch" style="background:var(' + tok.name + ')"></span>'
          : '<i class="ph-bold ph-brackets-curly"></i>';
        html += [
          '<a class="spotlight__item" href="' + tokenUrl + '" role="option" data-href="' + tokenUrl + '">',
          '  <span class="spotlight__item-icon">' + iconHtml + '</span>',
          '  <span class="spotlight__item-body">',
          '    <span class="spotlight__item-name spotlight__item-name--mono">' + highlight(escHtml(tok.name), query) + '</span>',
          '    <span class="spotlight__item-desc">' + escHtml(tok.value) + '</span>',
          '  </span>',
          '  <i class="ph-bold ph-arrow-right spotlight__item-arrow"></i>',
          '</a>',
        ].join('');
      });
    }

    // ── "More tokens" hint when cache isn't ready yet ─────────
    if (query.length >= 2 && TOKEN_CACHE === null) {
      html += '<p class="spotlight__empty" style="padding: var(--space-sm) var(--space-md); font-size: var(--font-size-xs);">Loading tokens…</p>';
    }

    results.innerHTML = html;

    // Bind mouseenter for hover-active state
    results.querySelectorAll('.spotlight__item').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        setActive(indexOfItem(el));
      });
    });
  }

  function highlight(text, q) {
    if (!q) return text;
    var re = new RegExp('(' + escRegex(q) + ')', 'gi');
    return text.replace(re, '<mark style="background:rgba(44,112,245,0.15);color:inherit;border-radius:2px;">$1</mark>');
  }

  /* ── Keyboard navigation ───────────────────────────────────── */

  function onKeydown(e) {
    var items = results.querySelectorAll('.spotlight__item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && items[activeIdx]) {
        location.href = items[activeIdx].getAttribute('data-href');
      } else if (items[0]) {
        location.href = items[0].getAttribute('data-href');
      }
    }
  }

  function setActive(idx) {
    var items = results.querySelectorAll('.spotlight__item');
    items.forEach(function (el) { el.classList.remove('spotlight__item--active'); });
    activeIdx = idx;
    if (idx >= 0 && items[idx]) {
      items[idx].classList.add('spotlight__item--active');
      items[idx].scrollIntoView({ block: 'nearest' });
    }
  }

  function indexOfItem(el) {
    return Array.from(results.querySelectorAll('.spotlight__item')).indexOf(el);
  }

  /* ── Open / Close ──────────────────────────────────────────── */

  function open() {
    if (!backdrop) buildDOM();
    backdrop.classList.add('spotlight-backdrop--open');
    document.body.style.overflow = 'hidden';
    prefetchTokens();  // no-op if already started on page load
    render('');
    setTimeout(function () { input.focus(); input.select(); }, 30);
  }

  function close() {
    if (!backdrop) return;
    backdrop.classList.remove('spotlight-backdrop--open');
    document.body.style.overflow = '';
    if (input) input.value = '';
    if (results) results.innerHTML = '';
  }

  /* ── Global keyboard shortcut CMD/CTRL+K ───────────────────── */

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      backdrop && backdrop.classList.contains('spotlight-backdrop--open') ? close() : open();
    }
    if (e.key === 'Escape') close();
  });

  /* ── Wire up nav-search on component pages ─────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    // Kick off token fetch immediately so results are ready when spotlight opens
    prefetchTokens();

    var wrap = document.querySelector('#ds-nav .nav-search-wrap');
    if (wrap) {
      wrap.classList.add('nav-search-trigger');
      wrap.style.cursor = 'pointer';

      // Inject CMD+K kbd badge
      if (!wrap.querySelector('.nav-search-kbd')) {
        var kbd = document.createElement('span');
        kbd.className = 'nav-search-kbd';
        kbd.textContent = '⌘K';
        wrap.appendChild(kbd);
      }

      // Adjust input padding to not overlap kbd
      var navInput = wrap.querySelector('.nav-search');
      if (navInput) navInput.style.paddingRight = '38px';

      wrap.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
      var navInput2 = wrap.querySelector('.nav-search');
      if (navInput2) {
        navInput2.addEventListener('focus', function (e) {
          e.preventDefault();
          navInput2.blur();
          open();
        });
      }
    }

    /* ── Wire up index.html search ──────────────────────────── */
    var indexInput = document.getElementById('search');
    if (indexInput) {
      indexInput.addEventListener('focus', function (e) {
        e.preventDefault();
        indexInput.blur();
        open();
      });
      indexInput.addEventListener('click', function () { open(); });
      // Remove the existing inline search filtering on index
      indexInput.setAttribute('readonly', 'readonly');
      indexInput.style.cursor = 'pointer';
    }
  });

  /* ── Helpers ───────────────────────────────────────────────── */

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ── Expose for external use ───────────────────────────────── */
  window.Spotlight = { open: open, close: close };

})();
