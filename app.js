/**
 * EXPLORERS-101 - Main Application Logic
 * 2026 Space Apps Challenge
 * Explorers-101 | Coded by Antigravity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize state
  const state = {
    currentDestination: 'all',
    searchQuery: '',
    selectedCraftId: null,
    activeTab: 'catalog',
    currentTheme: localStorage.getItem('celestial_theme') || 'night'
  };

  // Cache DOM elements
  const catalogGrid = document.getElementById('catalogGrid');
  const searchInput = document.getElementById('searchInput');
  const destFilterBtns = document.querySelectorAll('.dest-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  const craftModal = document.getElementById('craftModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const windAudioToggle = document.getElementById('windAudioToggle');
  const moonquakeBtn = document.getElementById('moonquakeBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleIcon = document.getElementById('themeToggleIcon');
  const themeToggleText = document.getElementById('themeToggleText');

  // Apply Initial Theme (Night / Morning)
  function applyTheme(theme) {
    state.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('celestial_theme', theme);

    if (theme === 'morning') {
      if (themeToggleIcon) themeToggleIcon.textContent = '🌙';
      if (themeToggleText) themeToggleText.textContent = 'Night Mode';
    } else {
      if (themeToggleIcon) themeToggleIcon.textContent = '☀️';
      if (themeToggleText) themeToggleText.textContent = 'Morning Mode';
    }
  }

  applyTheme(state.currentTheme);

  // Theme Toggle Button Handler
  themeToggleBtn?.addEventListener('click', () => {
    const nextTheme = state.currentTheme === 'night' ? 'morning' : 'night';
    if (window.audio) {
      window.audio.playBeep(nextTheme === 'morning' ? 780 : 360, 'sine', 0.12);
    }
    applyTheme(nextTheme);
  });

  // Render Spacecraft Cards
  function renderCatalog() {
    if (!catalogGrid) return;

    const filtered = CELESTIAL_DATA.spacecrafts.filter(craft => {
      const matchDest = state.currentDestination === 'all' || craft.destination === state.currentDestination;
      const matchSearch = !state.searchQuery || 
        craft.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        craft.summary.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        craft.nssdcaId.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        craft.type.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchDest && matchSearch;
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔭</span>
          <h3>No Spacecraft Found</h3>
          <p>Try searching for terms like "Apollo", "Pathfinder", "RTG", "Eros", or clear your filter.</p>
          <button class="btn-clear-search" id="btnClearSearch">Reset Search</button>
        </div>
      `;
      document.getElementById('btnClearSearch')?.addEventListener('click', () => {
        state.searchQuery = '';
        state.currentDestination = 'all';
        if (searchInput) searchInput.value = '';
        updateDestActiveBtn('all');
        renderCatalog();
      });
      return;
    }

    catalogGrid.innerHTML = filtered.map(craft => {
      const destBadge = {
        'moon': 'badge-moon',
        'mars': 'badge-mars',
        'asteroids': 'badge-asteroid',
        'deep-space': 'badge-deepspace'
      }[craft.destination] || 'badge-default';

      return `
        <article class="craft-card" data-id="${craft.id}">
          <div class="craft-card-top">
            <div class="craft-header-badges">
              <span class="craft-badge ${destBadge}">${craft.destinationName.split('(')[0].trim()}</span>
              <span class="craft-id-badge">${craft.nssdcaId}</span>
            </div>
            <h3 class="craft-title">${craft.name}</h3>
            <span class="craft-type">${craft.type}</span>
          </div>

          <div class="craft-preview-art">
            ${getSpacecraftIllustrationSvg(craft.id)}
            <div class="si-watermark-tag">[SI Generated Illustration]</div>
          </div>

          <div class="craft-summary">
            <p>${craft.summary}</p>
          </div>

          <div class="craft-quick-specs">
            <div class="q-spec">
              <span class="q-label">Launched</span>
              <span class="q-val">${craft.launchDate.split(' ')[0]}</span>
            </div>
            <div class="q-spec">
              <span class="q-label">Total Mass</span>
              <span class="q-val">${craft.totalMass.split('(')[0].replace('combined.', '').trim()}</span>
            </div>
            <div class="q-spec">
              <span class="q-label">Rocket</span>
              <span class="q-val">${craft.launchVehicle.split('(')[0].trim()}</span>
            </div>
          </div>

          <div class="craft-card-footer">
            <button class="btn-inspect-craft" onclick="window.openCraftDetail('${craft.id}')">
              <span>Inspect Hardware & Story</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  // Generate SVG Schematics for Spacecraft
  function getSpacecraftIllustrationSvg(id) {
    switch (id) {
      case 'apollo-11':
      case 'apollo-12':
      case 'apollo-15':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#080c14"/>
            <path d="M0,200 Q120,185 240,205 T400,195 L400,240 L0,240 Z" fill="#334155"/>
            <polygon points="150,140 250,140 270,180 130,180" fill="#d97706" stroke="#fbbf24" stroke-width="2"/>
            <polygon points="185,180 215,180 225,198 175,198" fill="#475569"/>
            <line x1="140" y1="170" x2="100" y2="210" stroke="#94a3b8" stroke-width="4"/>
            <line x1="260" y1="170" x2="300" y2="210" stroke="#94a3b8" stroke-width="4"/>
            <circle cx="100" cy="212" r="7" fill="#64748b"/>
            <circle cx="300" cy="212" r="7" fill="#64748b"/>
            <line x1="100" y1="210" x2="140" y2="170" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3,3"/>
            <polygon points="160,95 240,95 260,140 140,140" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
            <polygon points="175,108 190,118 175,124" fill="#0284c7"/>
            <polygon points="225,108 210,118 225,124" fill="#0284c7"/>
            <line x1="200" y1="95" x2="200" y2="60" stroke="#38bdf8" stroke-width="2"/>
            <ellipse cx="200" cy="60" rx="14" ry="5" fill="none" stroke="#38bdf8" stroke-width="2"/>
            <rect x="190" y="152" width="20" height="12" fill="#ef4444" opacity="0.8"/>
            <text x="18" y="30" fill="#38bdf8" font-size="12" font-family="monospace">APOLLO LUNAR MODULE</text>
          </svg>
        `;

      case 'surveyor-3':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#080c14"/>
            <path d="M0,195 Q150,180 300,205 T400,190 L400,240 L0,240 Z" fill="#334155"/>
            <polygon points="200,90 140,175 260,175" fill="none" stroke="#e2e8f0" stroke-width="3"/>
            <line x1="200" y1="90" x2="200" y2="175" stroke="#94a3b8" stroke-width="2"/>
            <line x1="140" y1="175" x2="90" y2="205" stroke="#cbd5e1" stroke-width="4"/>
            <line x1="260" y1="175" x2="310" y2="205" stroke="#cbd5e1" stroke-width="4"/>
            <circle cx="90" cy="207" r="8" fill="#64748b"/>
            <circle cx="310" cy="207" r="8" fill="#64748b"/>
            <rect x="185" y="45" width="30" height="45" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <line x1="160" y1="165" x2="120" y2="185" stroke="#f59e0b" stroke-width="3"/>
            <line x1="120" y1="185" x2="110" y2="202" stroke="#f59e0b" stroke-width="3"/>
            <rect x="105" y="200" width="10" height="8" fill="#d97706"/>
            <rect x="215" y="120" width="14" height="25" fill="#e2e8f0" stroke="#475569"/>
            <circle cx="222" cy="125" r="4" fill="#38bdf8"/>
            <text x="18" y="30" fill="#fbbf24" font-size="12" font-family="monospace">SURVEYOR 3 SOFT-LANDER</text>
          </svg>
        `;

      case 'mars-pathfinder':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#150a0f"/>
            <path d="M0,190 Q180,175 320,195 T400,185 L400,240 L0,240 Z" fill="#9a3412"/>
            <ellipse cx="150" cy="195" rx="35" ry="12" fill="#e2e8f0" opacity="0.8"/>
            <ellipse cx="250" cy="195" rx="35" ry="12" fill="#e2e8f0" opacity="0.8"/>
            <polygon points="160,170 240,170 260,195 140,195" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
            <line x1="200" y1="170" x2="200" y2="110" stroke="#cbd5e1" stroke-width="3"/>
            <rect x="192" y="102" width="16" height="12" fill="#0284c7" rx="3"/>
            <rect x="270" y="180" width="34" height="14" fill="#fbbf24" rx="2"/>
            <rect x="273" y="176" width="28" height="4" fill="#1e3a8a"/>
            <circle cx="274" cy="198" r="4.5" fill="#0f172a"/>
            <circle cx="287" cy="198" r="4.5" fill="#0f172a"/>
            <circle cx="300" cy="198" r="4.5" fill="#0f172a"/>
            <text x="18" y="30" fill="#f87171" font-size="12" font-family="monospace">MARS PATHFINDER & SOJOURNER</text>
          </svg>
        `;

      case 'mer-spirit-opportunity':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#150a0f"/>
            <path d="M0,195 Q140,180 280,200 T400,190 L400,240 L0,240 Z" fill="#7c2d12"/>
            <polygon points="130,135 270,135 295,155 105,155" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <rect x="150" y="150" width="100" height="25" fill="#cbd5e1"/>
            <polyline points="140,165 110,195 95,210" fill="none" stroke="#64748b" stroke-width="3"/>
            <polyline points="260,165 290,195 305,210" fill="none" stroke="#64748b" stroke-width="3"/>
            <line x1="200" y1="175" x2="200" y2="210" stroke="#64748b" stroke-width="3"/>
            <circle cx="95" cy="210" r="7" fill="#0f172a"/>
            <circle cx="150" cy="210" r="7" fill="#0f172a"/>
            <circle cx="200" cy="210" r="7" fill="#0f172a"/>
            <circle cx="250" cy="210" r="7" fill="#0f172a"/>
            <circle cx="305" cy="210" r="7" fill="#0f172a"/>
            <line x1="200" y1="135" x2="200" y2="70" stroke="#e2e8f0" stroke-width="3"/>
            <rect x="188" y="62" width="24" height="12" fill="#38bdf8" rx="3"/>
            <polyline points="150,160 120,175 115,195" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="18" y="30" fill="#f97316" font-size="12" font-family="monospace">MER SPIRIT & OPPORTUNITY</text>
          </svg>
        `;

      case 'viking-1':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#150a0f"/>
            <path d="M0,195 Q200,185 400,195 L400,240 L0,240 Z" fill="#9a3412"/>
            <polygon points="160,140 240,140 265,180 135,180" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
            <line x1="140" y1="175" x2="90" y2="210" stroke="#cbd5e1" stroke-width="4"/>
            <line x1="260" y1="175" x2="310" y2="210" stroke="#cbd5e1" stroke-width="4"/>
            <circle cx="90" cy="212" r="8" fill="#475569"/>
            <circle cx="310" cy="212" r="8" fill="#475569"/>
            <rect x="145" y="130" width="18" height="16" fill="#64748b" stroke="#f59e0b" stroke-width="1"/>
            <rect x="235" y="130" width="18" height="16" fill="#64748b" stroke="#f59e0b" stroke-width="1"/>
            <line x1="175" y1="140" x2="175" y2="85" stroke="#94a3b8" stroke-width="2"/>
            <ellipse cx="175" cy="85" rx="22" ry="7" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
            <rect x="195" y="125" width="8" height="18" fill="#38bdf8"/>
            <rect x="210" y="125" width="8" height="18" fill="#38bdf8"/>
            <line x1="250" y1="170" x2="330" y2="200" stroke="#cbd5e1" stroke-width="3"/>
            <circle cx="330" cy="200" r="5" fill="#f59e0b"/>
            <text x="18" y="30" fill="#f87171" font-size="12" font-family="monospace">VIKING 1 MARS LANDER</text>
          </svg>
        `;

      case 'insight-lander':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#150a0f"/>
            <path d="M0,195 Q200,185 400,195 L400,240 L0,240 Z" fill="#881337"/>
            <circle cx="90" cy="155" r="42" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="310" cy="155" r="42" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
            <polygon points="170,140 230,140 245,175 155,175" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <line x1="165" y1="175" x2="140" y2="205" stroke="#cbd5e1" stroke-width="3"/>
            <line x1="235" y1="175" x2="260" y2="205" stroke="#cbd5e1" stroke-width="3"/>
            <path d="M110,205 Q125,185 140,205 Z" fill="#cbd5e1" stroke="#f43f5e" stroke-width="1.5"/>
            <polyline points="200,145 160,165 125,200" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="18" y="30" fill="#f43f5e" font-size="12" font-family="monospace">INSIGHT GEOPHYSICAL LANDER</text>
          </svg>
        `;

      case 'ingenuity-helicopter':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#150a0f"/>
            <path d="M0,215 Q200,205 400,215 L400,240 L0,240 Z" fill="#7c2d12"/>
            <rect x="175" y="45" width="50" height="12" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <line x1="200" y1="57" x2="200" y2="90" stroke="#cbd5e1" stroke-width="3"/>
            <line x1="90" y1="85" x2="310" y2="85" stroke="#0f172a" stroke-width="5"/>
            <polygon points="90,83 130,81 130,89 90,87" fill="#334155"/>
            <polygon points="310,83 270,81 270,89 310,87" fill="#334155"/>
            <line x1="100" y1="105" x2="300" y2="105" stroke="#0f172a" stroke-width="5"/>
            <rect x="180" y="120" width="40" height="36" fill="#d97706" rx="4" stroke="#fbbf24" stroke-width="2"/>
            <circle cx="200" cy="148" r="5" fill="#0284c7"/>
            <line x1="180" y1="145" x2="135" y2="210" stroke="#0f172a" stroke-width="2.5"/>
            <line x1="220" y1="145" x2="265" y2="210" stroke="#0f172a" stroke-width="2.5"/>
            <text x="18" y="30" fill="#38bdf8" font-size="12" font-family="monospace">INGENUITY MARS HELICOPTER</text>
          </svg>
        `;

      case 'dawn':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#05070d"/>
            <circle cx="340" cy="60" r="35" fill="#334155" stroke="#475569" stroke-width="2"/>
            <circle cx="330" cy="55" r="4" fill="#f8fafc"/>
            <rect x="30" y="105" width="130" height="30" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <rect x="240" y="105" width="130" height="30" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <rect x="165" y="90" width="70" height="60" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
            <circle cx="200" cy="155" r="12" fill="#38bdf8" opacity="0.6"/>
            <polygon points="194,150 206,150 200,168" fill="#0284c7"/>
            <ellipse cx="200" cy="85" rx="18" ry="6" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
            <text x="18" y="30" fill="#38bdf8" font-size="12" font-family="monospace">DAWN ION-PROPULSION ORBITER</text>
          </svg>
        `;

      case 'near-shoemaker':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#05070d"/>
            <path d="M0,185 Q100,160 220,180 T400,175 L400,240 L0,240 Z" fill="#475569"/>
            <ellipse cx="280" cy="190" rx="40" ry="12" fill="#334155"/>
            <polygon points="120,95 190,115 190,140 120,120" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <polygon points="280,95 210,115 210,140 280,120" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            <polygon points="180,115 220,115 230,165 170,165" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
            <ellipse cx="200" cy="100" rx="18" ry="6" fill="#e2e8f0" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="18" y="30" fill="#a855f7" font-size="12" font-family="monospace">NEAR SHOEMAKER ON ASTEROID EROS</text>
          </svg>
        `;

      case 'pioneer-10':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#030712"/>
            <circle cx="80" cy="40" r="1.5" fill="#fff"/>
            <circle cx="320" cy="70" r="1.5" fill="#fff"/>
            <circle cx="280" cy="200" r="1" fill="#fff"/>
            <circle cx="350" cy="35" r="5" fill="#ef4444"/>
            <circle cx="350" cy="35" r="12" fill="none" stroke="#ef4444" stroke-width="1" opacity="0.4"/>
            <ellipse cx="190" cy="120" rx="65" ry="45" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/>
            <line x1="190" y1="120" x2="190" y2="70" stroke="#38bdf8" stroke-width="2.5"/>
            <polygon points="175,70 205,70 190,60" fill="#0284c7"/>
            <rect x="170" y="145" width="40" height="30" fill="#475569" stroke="#94a3b8"/>
            <line x1="170" y1="160" x2="80" y2="190" stroke="#cbd5e1" stroke-width="3"/>
            <rect x="60" y="180" width="22" height="18" fill="#f59e0b" rx="2"/>
            <line x1="210" y1="160" x2="300" y2="190" stroke="#cbd5e1" stroke-width="3"/>
            <rect x="300" y="180" width="22" height="18" fill="#f59e0b" rx="2"/>
            <rect x="160" y="125" width="22" height="15" fill="#eab308" stroke="#ca8a04" stroke-width="1"/>
            <text x="18" y="30" fill="#eab308" font-size="12" font-family="monospace">PIONEER 10 INTERSTELLAR PROBE</text>
          </svg>
        `;

      case 'kepler-k2':
        return `
          <svg viewBox="0 0 400 240" class="craft-vector">
            <rect width="400" height="240" fill="#030712"/>
            <path d="M50,20 Q200,120 350,220" stroke="rgba(168, 85, 247, 0.25)" stroke-width="45" fill="none"/>
            <g transform="rotate(-25 200 120)">
              <rect x="140" y="80" width="120" height="65" rx="10" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
              <ellipse cx="260" cy="112" rx="12" ry="32" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
              <rect x="130" y="65" width="90" height="14" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
              <rect x="130" y="146" width="90" height="14" fill="#1e3a8a" stroke="#38bdf8" stroke-width="1.5"/>
            </g>
            <text x="18" y="30" fill="#a855f7" font-size="12" font-family="monospace">KEPLER / K2 SPACE TELESCOPE</text>
          </svg>
        `;

      default:
        return `<div class="craft-vector-placeholder">🛰️</div>`;
    }
  }

  // Open Spacecraft Detailed Modal
  window.openCraftDetail = function(id) {
    const craft = CELESTIAL_DATA.spacecrafts.find(c => c.id === id);
    if (!craft || !craftModal || !modalBody) return;

    if (window.audio) window.audio.playBeep(640, 'sine', 0.08);

    let html = `
      <div class="modal-craft-header">
        <div class="modal-title-wrap">
          <span class="modal-badge-id">NSSDCA/COSPAR: ${craft.nssdcaId}</span>
          <h2>${craft.name}</h2>
          <span class="modal-sub">${craft.destinationName} • ${craft.type}</span>
        </div>
      </div>

      <div class="modal-hero-art">
        ${getSpacecraftIllustrationSvg(craft.id)}
        <div class="si-watermark-tag">[SI Generated Detailed Schematic]</div>
      </div>

      <div class="modal-tabs-strip">
        <button class="m-tab active" data-tab="overview">Mission Overview</button>
        <button class="m-tab" data-tab="hardware">Hardware & Subsystems</button>
        <button class="m-tab" data-tab="science">Science Package</button>
        <button class="m-tab" data-tab="data">Official NASA Data Sheet</button>
      </div>

      <div class="modal-tab-content active" id="mtab-overview">
        <div class="story-prose">
          <h4>The Epic Journey</h4>
          <p class="story-lead">${craft.story}</p>
          
          ${craft.famousQuotes ? `
            <div class="quotes-callout">
              <strong>Historic Words from the Surface:</strong>
              <ul>
                ${craft.famousQuotes.map(q => `<li><em>"${q}"</em></li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${craft.monumentPlaque ? `
            <div class="plaque-callout">
              <span class="plaque-title">📜 The Plaque Left on the Moon</span>
              <p class="plaque-text">"${craft.monumentPlaque}"</p>
            </div>
          ` : ''}

          <div class="milestone-grid">
            <div class="ms-card">
              <span class="ms-label">Launch Date</span>
              <span class="ms-val">${craft.launchDate}</span>
            </div>
            <div class="ms-card">
              <span class="ms-label">Landing / Encounter</span>
              <span class="ms-val">${craft.landingDate}</span>
            </div>
            <div class="ms-card">
              <span class="ms-label">Coordinates</span>
              <span class="ms-val">${craft.landingCoordinates}</span>
            </div>
            <div class="ms-card">
              <span class="ms-label">Current Status</span>
              <span class="ms-val">${craft.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-tab-content" id="mtab-hardware">
        <div class="hardware-grid">
          ${Object.entries(craft.hardwareSubsystems).map(([key, val]) => `
            <div class="hw-item">
              <h5>${formatHardwareKey(key)}</h5>
              ${Array.isArray(val) ? `<ul>${val.map(item => `<li>${item}</li>`).join('')}</ul>` : `<p>${val}</p>`}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="modal-tab-content" id="mtab-science">
        <div class="science-package-card">
          <h4>${craft.sciencePackage.name || 'Scientific Investigations & Payloads'}</h4>
          ${craft.sciencePackage.mass ? `<p><strong>Package Mass:</strong> ${craft.sciencePackage.mass}</p>` : ''}
          ${craft.sciencePackage.telemetry ? `<p><strong>Telemetry Frequencies:</strong> <code>${craft.sciencePackage.telemetry}</code></p>` : ''}
          ${craft.sciencePackage.rtg ? `<div class="rtg-box">⚡ <strong>RTG Power Source:</strong> ${craft.sciencePackage.rtg}</div>` : ''}
          
          ${craft.sciencePackage.instruments ? `
            <h5 class="mt-4">Deployed Instruments</h5>
            <div class="instruments-list">
              ${craft.sciencePackage.instruments.map(inst => `
                <div class="inst-item">
                  <span class="inst-name">${inst.name}</span>
                  <span class="inst-desc">${inst.desc}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${craft.sciencePackage.fate ? `<p class="package-fate"><strong>Operational Legacy:</strong> ${craft.sciencePackage.fate}</p>` : ''}
          ${craft.sciencePackage.waterProof ? `<p><strong>Water Discovery:</strong> ${craft.sciencePackage.waterProof}</p>` : ''}
          ${craft.sciencePackage.erosComposition ? `<p><strong>Eros Asteroid Findings:</strong> ${craft.sciencePackage.erosComposition}</p>` : ''}
          ${craft.sciencePackage.goldenPlaque ? `<p><strong>The Golden Plaque:</strong> ${craft.sciencePackage.goldenPlaque}</p>` : ''}
          ${craft.sciencePackage.exoplanetDiscoveries ? `<p><strong>Exoplanet Discoveries:</strong> ${craft.sciencePackage.exoplanetDiscoveries}</p>` : ''}
        </div>
      </div>

      <div class="modal-tab-content" id="mtab-data">
        <div class="nasa-table-container">
          <table class="nasa-spec-table">
            <tbody>
              <tr><th>Spacecraft ID</th><td>${craft.nssdcaId}</td></tr>
              <tr><th>Alternate Names</th><td>${craft.alternateNames.join(', ')}</td></tr>
              <tr><th>Launch Vehicle</th><td>${craft.launchVehicle}</td></tr>
              <tr><th>Launch Site</th><td>${craft.launchSite}</td></tr>
              <tr><th>Spacecraft Mass</th><td>${craft.totalMass}</td></tr>
              <tr><th>Disciplines</th><td>${craft.disciplines.join(', ')}</td></tr>
              ${craft.fundingAgency ? `<tr><th>Funding Agency</th><td>${craft.fundingAgency}</td></tr>` : ''}
              ${craft.missionManagement ? `<tr><th>Mission Management</th><td>${craft.missionManagement}</td></tr>` : ''}
              ${craft.crew ? `
                <tr>
                  <th>Astronaut Crew</th>
                  <td>
                    <ul>
                      ${craft.crew.map(c => `<li><strong>${c.name}</strong> — ${c.role}</li>`).join('')}
                    </ul>
                  </td>
                </tr>
              ` : ''}
              ${craft.personnel ? `
                <tr>
                  <th>NASA Key Personnel</th>
                  <td>
                    <ul>
                      ${craft.personnel.map(p => `<li><strong>${p.name}</strong> (${p.role}) — ${p.affiliation}</li>`).join('')}
                    </ul>
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
          <div class="nasa-resource-citation">
            <em>Verified against NASA Space Apps Challenge 2026 Resources & NASA NSSDCA / JPL Master Catalogs.</em>
          </div>
        </div>
      </div>
    `;

    modalBody.innerHTML = html;
    craftModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Modal internal tab switcher
    const modalTabs = modalBody.querySelectorAll('.m-tab');
    modalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (window.audio) window.audio.playBeep(520, 'sine', 0.05);
        modalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetId = `mtab-${tab.dataset.tab}`;
        modalBody.querySelectorAll('.modal-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  };

  function formatHardwareKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  function closeModal() {
    craftModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  craftModal?.addEventListener('click', (e) => {
    if (e.target === craftModal) closeModal();
  });

  // Filter and Search Event Handlers
  destFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.audio) window.audio.playBeep(450, 'triangle', 0.05);
      const dest = btn.dataset.dest;
      state.currentDestination = dest;
      updateDestActiveBtn(dest);
      renderCatalog();
    });
  });

  function updateDestActiveBtn(dest) {
    destFilterBtns.forEach(b => {
      if (b.dataset.dest === dest) b.classList.add('active');
      else b.classList.remove('active');
    });
  }

  searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderCatalog();
  });

  // Navigation Links smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.audio) window.audio.playBeep(400, 'sine', 0.04);
      const targetId = link.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Sound Station Audio Controls
  windAudioToggle?.addEventListener('click', () => {
    if (!window.audio) return;
    window.audio.toggleMartianWind((playing) => {
      if (playing) {
        windAudioToggle.classList.add('is-playing');
        windAudioToggle.innerHTML = `<span>🔊 Silence Martian Wind</span>`;
      } else {
        windAudioToggle.classList.remove('is-playing');
        windAudioToggle.innerHTML = `<span>💨 Play Martian Wind (InSight Dec 2018)</span>`;
      }
    });
  });

  moonquakeBtn?.addEventListener('click', () => {
    if (!window.audio) return;
    window.audio.playMoonquake();
    const alertBox = document.getElementById('seismicAlert');
    if (alertBox) {
      alertBox.textContent = "⚡ Artificial Moonquake Triggered! Apollo 12 LM ascent stage impacted 60 km away. Moon ringing for 55 minutes!";
      alertBox.classList.add('show');
      setTimeout(() => alertBox.classList.remove('show'), 4000);
    }
  });

  // Initial Renders
  renderCatalog();

  // Initialize Simulations & 3D Engine
  if (window.initSpace3D) {
    window.initSpace3D();
  }
  if (window.initSimulations) {
    window.initSimulations();
  }
});
