/**
 * EXPLORERS-101 - 3D Spacecraft Rendering Engine
 * Self-contained 3D Vector & Mesh Engine (Zero External Dependencies)
 * Made by Explorers-101 | Coded by Antigravity
 */

class Spacecraft3DEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Camera & Transform state
    this.rotX = 0.35;
    this.rotY = -0.6;
    this.rotZ = 0;
    this.zoom = 1.0;
    this.autoRotate = true;
    this.renderMode = 'shaded'; // 'shaded' or 'wireframe'
    this.activeModel = 'apollo'; // 'apollo', 'kepler', 'pioneer', 'ingenuity'
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.animTime = 0;
    this.lightDir = this.normalize([0.6, -0.8, -1.0]);

    this.resize();
    this.initEvents();
    this.buildModels();
    this.loop();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.parentElement.clientWidth;
    this.height = Math.max(340, Math.min(480, window.innerHeight * 0.55));
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  initEvents() {
    window.addEventListener('resize', () => this.resize());

    // Mouse / Touch Drag to Rotate
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.rotY += dx * 0.01;
      this.rotX += dy * 0.01;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    // Touch support for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.lastMouseX;
      const dy = e.touches[0].clientY - this.lastMouseY;
      this.rotY += dx * 0.012;
      this.rotX += dy * 0.012;
      this.lastMouseX = e.touches[0].clientX;
      this.lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    // Wheel to Zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.zoom = Math.max(0.5, Math.min(2.5, this.zoom - e.deltaY * 0.0015));
    }, { passive: false });
  }

  setModel(modelKey) {
    this.activeModel = modelKey;
    this.rotX = 0.35;
    this.rotY = -0.6;
    if (window.audio) window.audio.playBeep(580, 'sine', 0.06);
    this.updateUI();
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    if (window.audio) window.audio.playBeep(420, 'triangle', 0.05);
    this.updateUI();
  }

  toggleRenderMode() {
    this.renderMode = this.renderMode === 'shaded' ? 'wireframe' : 'shaded';
    if (window.audio) window.audio.playBeep(640, 'sine', 0.05);
    this.updateUI();
  }

  updateUI() {
    document.querySelectorAll('.btn-3d-model').forEach(btn => {
      if (btn.dataset.model === this.activeModel) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    const spinBtn = document.getElementById('btnToggle3dSpin');
    if (spinBtn) {
      spinBtn.textContent = this.autoRotate ? '⏸️ Pause Auto-Spin' : '▶️ Resume Auto-Spin';
    }

    const modeBtn = document.getElementById('btnToggle3dMode');
    if (modeBtn) {
      modeBtn.textContent = this.renderMode === 'shaded' ? '🕸️ Wireframe' : '🎨 Shaded Surface';
    }

    const titleEl = document.getElementById('model3dTitle');
    const descEl = document.getElementById('model3dDesc');
    const info = {
      apollo: {
        title: "Apollo 11 Lunar Module 'Eagle'",
        desc: "Interactive 3D geometry of the descent stage (gold Kapton foil), 4 landing gear struts with pads, and faceted ascent stage cabin with steerable antennas."
      },
      kepler: {
        title: "Kepler & K2 Space Telescope",
        desc: "Features the 1.4m primary mirror aperture, cylindrical baffle tube, dual solar wings used for solar photon radiation steering, and high-gain dish."
      },
      pioneer: {
        title: "Pioneer 10 Interstellar Explorer",
        desc: "Features the 2.74-meter parabolic dish antenna, hexagonal bus, nuclear SNAP-19 RTG boom trusses, and the gold-anodized Carl Sagan plaque."
      },
      ingenuity: {
        title: "Ingenuity Mars Helicopter ('Ginny')",
        desc: "Features twin counter-rotating carbon-fiber rotor blades spinning at 2,400+ RPM in real time, top solar panel, and lightweight tube landing gear."
      }
    }[this.activeModel];

    if (titleEl && info) titleEl.textContent = info.title;
    if (descEl && info) descEl.textContent = info.desc;
  }

  // Vector Math Utilities
  normalize(v) {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  // 3D Procedural Mesh Generators
  buildModels() {
    this.models = {
      apollo: this.createApolloLM(),
      kepler: this.createKeplerTelescope(),
      pioneer: this.createPioneer10(),
      ingenuity: this.createIngenuityHelicopter()
    };
  }

  createApolloLM() {
    const polys = [];
    const scale = 38;

    // 1. Octagonal Descent Stage (gold Kapton foil)
    const sides = 8;
    const rTop = 2.0 * scale;
    const rBot = 2.4 * scale;
    const hHalf = 0.9 * scale;
    const goldColor = '#eab308';
    const goldDark = '#ca8a04';

    const topVerts = [];
    const botVerts = [];
    for (let i = 0; i < sides; i++) {
      const ang = (i / sides) * Math.PI * 2;
      topVerts.push([Math.cos(ang) * rTop, -hHalf, Math.sin(ang) * rTop]);
      botVerts.push([Math.cos(ang) * rBot, hHalf, Math.sin(ang) * rBot]);
    }

    // Top and bottom caps
    polys.push({ verts: topVerts, color: goldDark, type: 'gold' });
    polys.push({ verts: [...botVerts].reverse(), color: '#475569', type: 'metal' });

    // Side faces
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      polys.push({
        verts: [topVerts[i], topVerts[next], botVerts[next], botVerts[i]],
        color: goldColor,
        type: 'gold'
      });
    }

    // Descent engine bell nozzle at bottom
    const bellTop = hHalf;
    const bellBot = hHalf + 1.2 * scale;
    const bellR = 1.0 * scale;
    const bellVerts = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      bellVerts.push([Math.cos(a) * bellR, bellBot, Math.sin(a) * bellR]);
    }
    polys.push({ verts: bellVerts, color: '#334155', type: 'metal' });

    // 4 Landing Gear Legs with footpads
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const legX = Math.cos(ang) * 4.2 * scale;
      const legZ = Math.sin(ang) * 4.2 * scale;
      const legY = hHalf + 1.6 * scale;

      // Leg strut lines (rendered as thin quad)
      const baseIdx = Math.floor(i * 2);
      const start = botVerts[baseIdx % sides];
      polys.push({
        verts: [
          [start[0], start[1], start[2]],
          [legX, legY, legZ],
          [legX + 2, legY, legZ + 2],
          [start[0] + 2, start[1], start[2] + 2]
        ],
        color: '#94a3b8',
        type: 'strut'
      });

      // Circular Footpad
      const padVerts = [];
      for (let p = 0; p < 6; p++) {
        const pa = (p / 6) * Math.PI * 2;
        padVerts.push([legX + Math.cos(pa) * 10, legY, legZ + Math.sin(pa) * 10]);
      }
      polys.push({ verts: padVerts, color: '#cbd5e1', type: 'metal' });
    }

    // 2. Ascent Stage Cabin (silver/white aluminum faceted structure)
    const cabY = -hHalf;
    const cabH = 1.6 * scale;
    const cabW = 1.6 * scale;
    const cabColor = '#f1f5f9';

    // Cabin front box
    polys.push({
      verts: [
        [-cabW, cabY, cabW],
        [cabW, cabY, cabW],
        [cabW * 0.8, cabY - cabH, cabW * 0.7],
        [-cabW * 0.8, cabY - cabH, cabW * 0.7]
      ],
      color: '#e2e8f0',
      type: 'cabin-front'
    });

    // Cabin back box
    polys.push({
      verts: [
        [cabW, cabY, -cabW],
        [-cabW, cabY, -cabW],
        [-cabW * 0.8, cabY - cabH, -cabW * 0.7],
        [cabW * 0.8, cabY - cabH, -cabW * 0.7]
      ],
      color: '#94a3b8',
      type: 'cabin-back'
    });

    // Cabin sides
    polys.push({
      verts: [
        [cabW, cabY, cabW],
        [cabW, cabY, -cabW],
        [cabW * 0.8, cabY - cabH, -cabW * 0.7],
        [cabW * 0.8, cabY - cabH, cabW * 0.7]
      ],
      color: '#cbd5e1',
      type: 'cabin-side'
    });
    polys.push({
      verts: [
        [-cabW, cabY, -cabW],
        [-cabW, cabY, cabW],
        [-cabW * 0.8, cabY - cabH, cabW * 0.7],
        [-cabW * 0.8, cabY - cabH, -cabW * 0.7]
      ],
      color: '#cbd5e1',
      type: 'cabin-side'
    });

    // Cabin Top & Docking Hatch
    polys.push({
      verts: [
        [-cabW * 0.8, cabY - cabH, cabW * 0.7],
        [cabW * 0.8, cabY - cabH, cabW * 0.7],
        [cabW * 0.8, cabY - cabH, -cabW * 0.7],
        [-cabW * 0.8, cabY - cabH, -cabW * 0.7]
      ],
      color: '#f8fafc',
      type: 'cabin-top'
    });

    // Triangular Cockpit Windows
    polys.push({
      verts: [
        [-cabW * 0.6, cabY - cabH * 0.4, cabW * 0.95],
        [-cabW * 0.2, cabY - cabH * 0.4, cabW * 0.95],
        [-cabW * 0.4, cabY - cabH * 0.7, cabW * 0.85]
      ],
      color: '#0284c7',
      type: 'glass'
    });
    polys.push({
      verts: [
        [cabW * 0.2, cabY - cabH * 0.4, cabW * 0.95],
        [cabW * 0.6, cabY - cabH * 0.4, cabW * 0.95],
        [cabW * 0.4, cabY - cabH * 0.7, cabW * 0.85]
      ],
      color: '#0284c7',
      type: 'glass'
    });

    // S-Band Dish on top
    const dishY = cabY - cabH - 12;
    const dishVerts = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      dishVerts.push([Math.cos(a) * 14, dishY - 6, Math.sin(a) * 14]);
    }
    polys.push({ verts: dishVerts, color: '#f8fafc', type: 'antenna' });

    return polys;
  }

  createKeplerTelescope() {
    const polys = [];
    const scale = 36;
    const segs = 12;
    const r = 1.4 * scale;
    const len = 3.6 * scale;

    // Main Cylindrical Telescope Barrel
    for (let i = 0; i < segs; i++) {
      const a1 = (i / segs) * Math.PI * 2;
      const a2 = ((i + 1) / segs) * Math.PI * 2;
      const x1 = Math.cos(a1) * r, z1 = Math.sin(a1) * r;
      const x2 = Math.cos(a2) * r, z2 = Math.sin(a2) * r;

      // Tube wall
      polys.push({
        verts: [
          [x1, -len * 0.5, z1],
          [x2, -len * 0.5, z2],
          [x2, len * 0.4, z2],
          [x1, len * 0.4, z1]
        ],
        color: '#64748b',
        type: 'barrel'
      });
    }

    // Primary Mirror Inside Aperture (1.4m diameter)
    const mirrorVerts = [];
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      mirrorVerts.push([Math.cos(a) * (r * 0.85), -len * 0.45, Math.sin(a) * (r * 0.85)]);
    }
    polys.push({ verts: mirrorVerts, color: '#38bdf8', type: 'mirror' });

    // Angled Sunshield Baffle at top
    polys.push({
      verts: [
        [-r * 1.1, -len * 0.5, -r * 0.5],
        [r * 1.1, -len * 0.5, -r * 0.5],
        [r * 1.3, -len * 0.8, -r * 1.2],
        [-r * 1.3, -len * 0.8, -r * 1.2]
      ],
      color: '#eab308',
      type: 'gold-baffle'
    });

    // Dual Solar Array Panels (used for K2 Solar Photon Kayak Steering)
    const panelW = 3.2 * scale;
    const panelH = 1.8 * scale;
    // Left Wing
    polys.push({
      verts: [
        [-r, -panelH * 0.3, 0],
        [-r - panelW, -panelH * 0.3, 0],
        [-r - panelW, panelH * 0.7, 0],
        [-r, panelH * 0.7, 0]
      ],
      color: '#1e3a8a',
      type: 'solar'
    });
    // Right Wing
    polys.push({
      verts: [
        [r, -panelH * 0.3, 0],
        [r + panelW, -panelH * 0.3, 0],
        [r + panelW, panelH * 0.7, 0],
        [r, panelH * 0.7, 0]
      ],
      color: '#1e3a8a',
      type: 'solar'
    });

    return polys;
  }

  createPioneer10() {
    const polys = [];
    const scale = 34;

    // 1. Large Parabolic Dish Antenna (2.74 m diameter)
    const dishSegs = 16;
    const dishR = 3.8 * scale;
    const dishDepth = 0.8 * scale;
    const dishVerts = [];

    for (let i = 0; i < dishSegs; i++) {
      const a = (i / dishSegs) * Math.PI * 2;
      dishVerts.push([Math.cos(a) * dishR, Math.sin(a) * dishR, 0]);
    }
    polys.push({ verts: dishVerts, color: '#f1f5f9', type: 'dish' });

    // Feed horn tripod
    const apex = [0, 0, dishDepth * 2.2];
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      polys.push({
        verts: [
          [Math.cos(a) * (dishR * 0.6), Math.sin(a) * (dishR * 0.6), 0],
          apex,
          [Math.cos(a) * (dishR * 0.6) + 2, Math.sin(a) * (dishR * 0.6) + 2, 0]
        ],
        color: '#94a3b8',
        type: 'strut'
      });
    }

    // 2. Hexagonal Equipment Bus Behind Dish
    const busY = -1.2 * scale;
    const busR = 1.6 * scale;
    const busTop = [];
    const busBot = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      busTop.push([Math.cos(a) * busR, Math.sin(a) * busR, -10]);
      busBot.push([Math.cos(a) * busR, Math.sin(a) * busR, -scale * 1.4]);
    }
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      polys.push({
        verts: [busTop[i], busTop[next], busBot[next], busBot[i]],
        color: '#475569',
        type: 'metal'
      });
    }

    // 3. Two Deployable RTG Boom Trusses holding SNAP-19 Generators
    const boomLen = 4.2 * scale;
    // Boom 1 Left
    polys.push({
      verts: [
        [-busR, 0, -scale],
        [-boomLen, 0, -scale * 1.5],
        [-boomLen, 12, -scale * 1.5],
        [-busR, 12, -scale]
      ],
      color: '#cbd5e1',
      type: 'boom'
    });
    // RTG Cylinder Left
    polys.push({
      verts: [
        [-boomLen - 15, -12, -scale * 1.5],
        [-boomLen + 15, -12, -scale * 1.5],
        [-boomLen + 15, 12, -scale * 1.5],
        [-boomLen - 15, 12, -scale * 1.5]
      ],
      color: '#f59e0b',
      type: 'rtg'
    });

    // Boom 2 Right
    polys.push({
      verts: [
        [busR, 0, -scale],
        [boomLen, 0, -scale * 1.5],
        [boomLen, 12, -scale * 1.5],
        [busR, 12, -scale]
      ],
      color: '#cbd5e1',
      type: 'boom'
    });
    // RTG Cylinder Right
    polys.push({
      verts: [
        [boomLen - 15, -12, -scale * 1.5],
        [boomLen + 15, -12, -scale * 1.5],
        [boomLen + 15, 12, -scale * 1.5],
        [boomLen - 15, 12, -scale * 1.5]
      ],
      color: '#f59e0b',
      type: 'rtg'
    });

    // 4. Golden Plaque Mounted on Antenna Truss
    polys.push({
      verts: [
        [-18, -dishR * 0.4, 4],
        [18, -dishR * 0.4, 4],
        [18, -dishR * 0.4 - 24, 4],
        [-18, -dishR * 0.4 - 24, 4]
      ],
      color: '#eab308',
      type: 'gold-plaque'
    });

    return polys;
  }

  createIngenuityHelicopter() {
    const polys = [];
    const scale = 40;

    // 1. Solar Panel Top Deck
    polys.push({
      verts: [
        [-scale * 0.7, -scale * 2.2, -scale * 0.3],
        [scale * 0.7, -scale * 2.2, -scale * 0.3],
        [scale * 0.7, -scale * 2.2, scale * 0.3],
        [-scale * 0.7, -scale * 2.2, scale * 0.3]
      ],
      color: '#1e3a8a',
      type: 'solar'
    });

    // 2. Central Rotor Mast
    polys.push({
      verts: [
        [-3, -scale * 2.2, 0],
        [3, -scale * 2.2, 0],
        [3, 0, 0],
        [-3, 0, 0]
      ],
      color: '#94a3b8',
      type: 'strut'
    });

    // 3. Cube Fuselage Body
    const bw = scale * 0.6;
    const bh = scale * 0.6;
    polys.push({
      verts: [
        [-bw, -bh, bw],
        [bw, -bh, bw],
        [bw, bh, bw],
        [-bw, bh, bw]
      ],
      color: '#eab308',
      type: 'gold'
    });
    polys.push({
      verts: [
        [bw, -bh, bw],
        [bw, -bh, -bw],
        [bw, bh, -bw],
        [bw, bh, bw]
      ],
      color: '#ca8a04',
      type: 'gold'
    });
    polys.push({
      verts: [
        [-bw, -bh, -bw],
        [-bw, -bh, bw],
        [-bw, bh, bw],
        [-bw, bh, -bw]
      ],
      color: '#ca8a04',
      type: 'gold'
    });

    // 4. Slanted Carbon-Fiber Tube Landing Legs
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const lx = Math.cos(a) * scale * 1.8;
      const lz = Math.sin(a) * scale * 1.8;
      const ly = scale * 1.6;

      polys.push({
        verts: [
          [Math.cos(a) * bw * 0.8, bh * 0.8, Math.sin(a) * bw * 0.8],
          [lx, ly, lz],
          [lx + 2, ly, lz + 2],
          [Math.cos(a) * bw * 0.8 + 2, bh * 0.8, Math.sin(a) * bw * 0.8 + 2]
        ],
        color: '#0f172a',
        type: 'carbon-leg'
      });
    }

    return polys;
  }

  // Real-time 3D Projection & Rendering Loop
  loop() {
    this.animTime += 0.025;

    if (this.autoRotate) {
      this.rotY += 0.008;
    }

    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w * 0.5;
    const cy = h * 0.52;

    // Clear background
    ctx.clearRect(0, 0, w, h);

    // Deep cosmic radial glow behind spacecraft
    const isMorning = document.documentElement.getAttribute('data-theme') === 'morning';
    const bgGlow = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(w, h) * 0.6);
    if (isMorning) {
      bgGlow.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
      bgGlow.addColorStop(0.5, 'rgba(244, 63, 94, 0.08)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      bgGlow.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
      bgGlow.addColorStop(0.5, 'rgba(192, 132, 252, 0.06)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, w, h);

    // Get current model polygons
    const basePolys = this.models[this.activeModel] || this.models.apollo;
    const renderList = [];

    // Matrix Rotation Math
    const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
    const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
    const cosZ = Math.cos(this.rotZ), sinZ = Math.sin(this.rotZ);

    // Dynamic animation for Ingenuity rotors
    let dynamicPolys = [...basePolys];
    if (this.activeModel === 'ingenuity') {
      const rotorLen = 40 * 2.8;
      const rAngle1 = this.animTime * 14;
      const rAngle2 = -this.animTime * 14;

      // Rotor 1 (Upper)
      dynamicPolys.push({
        verts: [
          [Math.cos(rAngle1) * rotorLen, -40 * 1.8, Math.sin(rAngle1) * rotorLen],
          [-Math.cos(rAngle1) * rotorLen, -40 * 1.8, -Math.sin(rAngle1) * rotorLen],
          [-Math.cos(rAngle1) * rotorLen + 6, -40 * 1.8, -Math.sin(rAngle1) * rotorLen + 6],
          [Math.cos(rAngle1) * rotorLen + 6, -40 * 1.8, Math.sin(rAngle1) * rotorLen + 6]
        ],
        color: '#0f172a',
        type: 'carbon-blade'
      });

      // Rotor 2 (Lower)
      dynamicPolys.push({
        verts: [
          [Math.cos(rAngle2) * rotorLen, -40 * 1.2, Math.sin(rAngle2) * rotorLen],
          [-Math.cos(rAngle2) * rotorLen, -40 * 1.2, -Math.sin(rAngle2) * rotorLen],
          [-Math.cos(rAngle2) * rotorLen + 6, -40 * 1.2, -Math.sin(rAngle2) * rotorLen + 6],
          [Math.cos(rAngle2) * rotorLen + 6, -40 * 1.2, Math.sin(rAngle2) * rotorLen + 6]
        ],
        color: '#1e293b',
        type: 'carbon-blade'
      });
    }

    // Transform and Project Polygons
    dynamicPolys.forEach(poly => {
      const projVerts = [];
      let avgZ = 0;

      for (let i = 0; i < poly.verts.length; i++) {
        let [x, y, z] = poly.verts[i];

        // Scale by zoom
        x *= this.zoom;
        y *= this.zoom;
        z *= this.zoom;

        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Perspective Projection
        const fov = 420;
        const pz = z2 + 350;
        const factor = fov / (pz || 1);
        const px = cx + x1 * factor;
        const py = cy + y2 * factor;

        projVerts.push({ x: px, y: py, z: z2 });
        avgZ += z2;
      }

      avgZ /= poly.verts.length;

      // Surface Normal for Flat Shading
      let normal = [0, 0, 1];
      if (projVerts.length >= 3) {
        const v0 = poly.verts[0];
        const v1 = poly.verts[1];
        const v2 = poly.verts[2];
        const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
        const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
        normal = this.normalize(this.cross(edge1, edge2));
      }

      renderList.push({
        verts: projVerts,
        avgZ: avgZ,
        color: poly.color,
        type: poly.type,
        normal: normal
      });
    });

    // Depth Sorting (Painters Algorithm)
    renderList.sort((a, b) => b.avgZ - a.avgZ);

    // Draw Polygons
    renderList.forEach(item => {
      if (item.verts.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(item.verts[0].x, item.verts[0].y);
      for (let i = 1; i < item.verts.length; i++) {
        ctx.lineTo(item.verts[i].x, item.verts[i].y);
      }
      ctx.closePath();

      if (this.renderMode === 'wireframe') {
        ctx.strokeStyle = isMorning ? '#f59e0b' : '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else {
        // Calculate Light Reflection Factor
        const light = Math.max(0.25, Math.min(1.0, this.dot(item.normal, this.lightDir) * 0.6 + 0.5));
        ctx.fillStyle = this.applyLighting(item.color, light);
        ctx.fill();

        ctx.strokeStyle = isMorning ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    // 3D Orbital Axis Ring / Grid Ground Plane
    ctx.strokeStyle = isMorning ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.18)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.ellipse(cx, cy + 90 * this.zoom, 140 * this.zoom, 35 * this.zoom, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Watermark
    ctx.fillStyle = isMorning ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.45)';
    ctx.font = '10px monospace';
    ctx.fillText('[SI Generated 3D Mesh Engine | Explorers-101]', 18, h - 16);
  }

  applyLighting(hex, factor) {
    if (!hex.startsWith('#')) return hex;
    let num = parseInt(hex.slice(1), 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    r = Math.min(255, Math.max(0, Math.round(r * factor)));
    g = Math.min(255, Math.max(0, Math.round(g * factor)));
    b = Math.min(255, Math.max(0, Math.round(b * factor)));

    return `rgb(${r}, ${g}, ${b})`;
  }
}

// Global 3D Engine Instance
window.initSpace3D = function() {
  window.spacecraft3D = new Spacecraft3DEngine('spacecraft3dCanvas');
};
