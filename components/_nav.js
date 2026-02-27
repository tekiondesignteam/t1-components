(() => {

  /* ── Component registry ──────────────────────────────────── */

  const COMPONENTS = [
    {
      category: "Foundation",
      items: [
        { name: "Colors",                  file: "colors.html",                  desc: "Semantic color tokens" },
        { name: "Typography",              file: "typography.html",              desc: "Type scale & text styles" },
        { name: "Tokens",                  file: "tokens.html",                  desc: "All CSS variables" },
      ],
    },
    {
      category: "AI Components",
      items: [
        { name: "Action Overflow Menu",   file: "action-overflow-menu.html",    desc: "Contextual action dropdown" },
        { name: "App Bar",                 file: "app-bar.html",                 desc: "AI assistant title bar" },
        { name: "Button",                 file: "button.html",                  desc: "Primary, secondary, tertiary" },
        { name: "FAB",                     file: "fab.html",                     desc: "Floating action button" },
        { name: "Fav Bar Icon",            file: "fav-bar-icon.html",            desc: "Favorite bar logo icon" },
        { name: "Search",                 file: "search.html",                  desc: "Search input with results" },
        { name: "Side Nav Item",          file: "side-nav-item.html",           desc: "Chat list row" },
        { name: "Side Nav Section Header",file: "side-nav-section-header.html", desc: "Chat list group label" },
        { name: "Title Bar",              file: "title-bar.html",               desc: "Chat title navigation bar" },
      ],
    },
  ];

  /* ── Detect current page ─────────────────────────────────── */

  const currentFile = location.pathname.split("/").pop();

  /* ── Inject styles ───────────────────────────────────────── */

  const style = document.createElement("style");
  style.textContent = `
    /* Push page body right to make room for sidebar */
    body {
      margin-left:  224px !important;
      width:        auto !important;
      min-width:    0   !important;
      box-sizing:   border-box !important;
    }

    /* ── Sidebar shell ─────────────────────────── */
    #ds-nav {
      position:   fixed;
      top:        0;
      left:       0;
      width:      224px;
      height:     100vh;
      background: #ffffff;
      border-right: 1px solid #edeef0;
      display:    flex;
      flex-direction: column;
      z-index:    9999;
      font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow:   hidden;
    }

    /* ── Header ────────────────────────────────── */
    #ds-nav .nav-header {
      padding:     16px 16px 12px;
      border-bottom: 1px solid #edeef0;
      flex-shrink: 0;
    }
    #ds-nav .nav-logo {
      display:     flex;
      align-items: center;
      gap:         8px;
      text-decoration: none;
      margin-bottom: 12px;
    }
    #ds-nav .nav-logo img {
      width:  20px;
      height: 20px;
      display: block;
    }
    #ds-nav .nav-logo span {
      font-size:   13px;
      font-weight: 600;
      color:       #1a1a1a;
      letter-spacing: -0.01em;
    }

    /* ── Search ────────────────────────────────── */
    #ds-nav .nav-search-wrap {
      position:   relative;
    }
    #ds-nav .nav-search-icon {
      position:   absolute;
      left:       8px;
      top:        50%;
      transform:  translateY(-50%);
      width:      14px;
      height:     14px;
      color:      #9a9a9a;
      pointer-events: none;
    }
    #ds-nav .nav-search {
      width:       100%;
      height:      30px;
      padding:     0 8px 0 28px;
      border:      1px solid #edeef0;
      border-radius: 6px;
      background:  #f7f7f8;
      font-size:   12px;
      color:       #1a1a1a;
      outline:     none;
      box-sizing:  border-box;
      transition:  border-color 0.15s, background 0.15s;
    }
    #ds-nav .nav-search::placeholder { color: #9a9a9a; }
    #ds-nav .nav-search:focus {
      border-color: #2157f5;
      background:   #ffffff;
    }

    /* ── Scrollable list ───────────────────────── */
    #ds-nav .nav-body {
      flex:       1;
      overflow-y: auto;
      padding:    8px 0 16px;
    }
    #ds-nav .nav-body::-webkit-scrollbar { width: 4px; }
    #ds-nav .nav-body::-webkit-scrollbar-thumb { background: #d4d5d6; border-radius: 4px; }

    /* ── Category label ────────────────────────── */
    #ds-nav .nav-category {
      padding:     8px 16px 4px;
      font-size:   10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color:       #9a9a9a;
    }

    /* ── Nav item ──────────────────────────────── */
    #ds-nav .nav-item {
      display:     flex;
      flex-direction: column;
      padding:     6px 16px;
      text-decoration: none;
      border-radius: 0;
      cursor:      pointer;
      transition:  background 0.1s;
      border-left: 2px solid transparent;
    }
    #ds-nav .nav-item:hover {
      background:  #f7f7f8;
    }
    #ds-nav .nav-item.active {
      background:  #eef3ff;
      border-left-color: #2157f5;
    }
    #ds-nav .nav-item-name {
      font-size:   13px;
      font-weight: 500;
      color:       #1a1a1a;
      line-height: 1.4;
    }
    #ds-nav .nav-item.active .nav-item-name {
      color: #2157f5;
    }
    #ds-nav .nav-item-desc {
      font-size:   11px;
      color:       #9a9a9a;
      line-height: 1.4;
      margin-top:  1px;
    }

    /* ── No results ────────────────────────────── */
    #ds-nav .nav-empty {
      padding:   12px 16px;
      font-size: 12px;
      color:     #9a9a9a;
    }

    /* ── Footer ────────────────────────────────── */
    #ds-nav .nav-footer {
      padding:      10px 16px;
      border-top:   1px solid #edeef0;
      font-size:    10px;
      color:        #b4b5b6;
      flex-shrink:  0;
      letter-spacing: 0.02em;
    }
  `;
  document.head.appendChild(style);

  /* ── Build sidebar HTML ──────────────────────────────────── */

  const nav = document.createElement("nav");
  nav.id = "ds-nav";
  nav.setAttribute("aria-label", "Component navigation");

  nav.innerHTML = `
    <div class="nav-header">
      <a class="nav-logo" href="../index.html">
        <img src="../assets/aiLogo.svg" alt="Tekion AI">
        <span>AI Design System</span>
      </a>
      <div class="nav-search-wrap">
        <svg class="nav-search-icon" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 10L13.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input class="nav-search" type="search" placeholder="Search components…" aria-label="Search components">
      </div>
    </div>
    <div class="nav-body" id="ds-nav-body"></div>
    <div class="nav-footer">Tekion AI · Design Tokens</div>
  `;

  document.body.prepend(nav);

  /* ── Render list ─────────────────────────────────────────── */

  const body  = document.getElementById("ds-nav-body");
  const input = nav.querySelector(".nav-search");

  function render(query = "") {
    const q = query.trim().toLowerCase();
    body.innerHTML = "";
    let anyVisible = false;

    COMPONENTS.forEach(group => {
      const filtered = group.items.filter(item =>
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      );
      if (!filtered.length) return;
      anyVisible = true;

      const cat = document.createElement("div");
      cat.className = "nav-category";
      cat.textContent = group.category;
      body.appendChild(cat);

      filtered.forEach(item => {
        const a = document.createElement("a");
        a.className = "nav-item" + (item.file === currentFile ? " active" : "");
        a.href = item.file;
        a.innerHTML = `
          <span class="nav-item-name">${item.name}</span>
          <span class="nav-item-desc">${item.desc}</span>
        `;
        body.appendChild(a);
      });
    });

    if (!anyVisible) {
      const empty = document.createElement("div");
      empty.className = "nav-empty";
      empty.textContent = "No components match "" + query + """;
      body.appendChild(empty);
    }
  }

  render();
  input.addEventListener("input", e => render(e.target.value));

  /* ── Keyboard shortcut: / to focus search ────────────────── */
  document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });

})();
