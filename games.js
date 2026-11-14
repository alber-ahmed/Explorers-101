/**
 * EXPLORERS-101 - Interactive Simulations & Games
 * Explorers-101 | Coded by Antigravity
 */

// Web Audio API Synthesizer for Space Sounds & UI Clicks
class SpaceAudio {
  constructor() {
    this.ctx = null;
    this.windNode = null;
    this.windGain = null;
    this.isPlayingWind = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(freq = 600, type = 'sine', duration = 0.08, gainVal = 0.05) {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio disabled or blocked by browser policy", e);
    }
  }

  playImpact() {
    try {
      this.init();
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.5);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start();
    } catch (e) {}
  }

  playMoonquake() {
    try {
      this.init();
      const dur = 3.5;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(45, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + dur);
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {}
  }

  toggleMartianWind(onStateChange) {
    this.init();
    if (this.isPlayingWind) {
      if (this.windGain) {
        this.windGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.windNode) {
            this.windNode.stop();
            this.windNode.disconnect();
          }
          this.isPlayingWind = false;
          if (onStateChange) onStateChange(false);
        }, 500);
      }
      return false;
    } else {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      this.windNode = this.ctx.createBufferSource();
      this.windNode.buffer = noiseBuffer;
      this.windNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.windGain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 1.2);

      this.windNode.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);

      this.windNode.start();
      this.isPlayingWind = true;
      if (onStateChange) onStateChange(true);
      return true;
    }
  }
}

const audio = new SpaceAudio();
window.audio = audio;

// ==========================================
// SIMULATION 1: Mars Pathfinder Airbag Bounce
// ==========================================
class PathfinderBounceSim {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.running = false;
    this.altitude = 350; // meters
    this.vx = 4;
    this.vy = 8;
    this.x = 40;
    this.y = 40;
    this.airbagsInflated = false;
    this.parachuteDeployed = true;
    this.bounces = 0;
    this.maxBounces = 15;
    this.settled = false;
    this.roverDeployed = false;
    this.statusText = "Descending under supersonic parachute at 31 mph...";
    this.reqId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.parentElement.clientWidth;
    this.height = 360;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.groundY = this.height - 60;
    this.draw();
  }

  reset() {
    cancelAnimationFrame(this.reqId);
    this.running = false;
    this.altitude = 330; // 330 feet / 100m altimeter mark
    this.vx = 3.8;
    this.vy = 6;
    this.x = 50;
    this.y = 40;
    this.airbagsInflated = false;
    this.parachuteDeployed = true;
    this.bounces = 0;
    this.settled = false;
    this.roverDeployed = false;
    this.statusText = "Ready for Descent. Altimeter primed at 330 ft (100 m).";
    this.updateStatsUI();
    this.draw();
  }

  start() {
    this.reset();
    this.running = true;
    this.statusText = "Entering thin Martian atmosphere... Parachute slowed descent!";
    audio.playBeep(450, 'sine', 0.2);
    this.loop();
  }

  inflateAirbags() {
    if (!this.airbagsInflated) {
      this.airbagsInflated = true;
      this.statusText = "Gas generators fired! 24 giant multi-lobed airbags inflated!";
      audio.playBeep(320, 'square', 0.3, 0.1);
      this.updateStatsUI();
    }
  }

  deploySojourner() {
    if (this.settled && !this.roverDeployed) {
      this.roverDeployed = true;
      this.statusText = "Petals opened! Sojourner rolled down 20° ramp into Ares Vallis!";
      audio.playBeep(700, 'triangle', 0.4);
      this.draw();
      this.updateStatsUI();
    }
  }

  loop() {
    if (!this.running) return;

    if (!this.settled) {
      // Auto-inflate airbags at 100m altitude if user hasn't pressed button
      if (this.altitude <= 100 && !this.airbagsInflated) {
        this.inflateAirbags();
      }

      this.x += this.vx;
      this.y += this.vy;
      this.altitude = Math.max(0, Math.round((this.groundY - this.y) * 1.2));

      // Gravity & damping
      if (this.parachuteDeployed && this.altitude > 40) {
        this.vy += 0.08;
      } else {
        this.vy += 0.35; // Free bounce
      }

      // Ground impact
      if (this.y >= this.groundY - (this.airbagsInflated ? 25 : 12)) {
        this.y = this.groundY - (this.airbagsInflated ? 25 : 12);
        this.bounces++;
        audio.playImpact();

        if (this.airbagsInflated) {
          this.vy = -this.vy * 0.72; // Elastic bounce
          this.vx = this.vx * 0.88;
          this.parachuteDeployed = false; // Parachute cut away
          this.statusText = `BOUNCE #${this.bounces}! Rebounding up to ${Math.round(Math.abs(this.vy) * 4)} feet into the sky!`;
        } else {
          // Crashed without airbags
          this.running = false;
          this.statusText = "CRITICAL HARD IMPACT! Airbags were not inflated at 100m!";
          this.draw();
          this.updateStatsUI();
          return;
        }

        if (this.bounces >= this.maxBounces || (Math.abs(this.vy) < 0.8 && Math.abs(this.vx) < 0.4)) {
          this.settled = true;
          this.vy = 0;
          this.vx = 0;
          this.y = this.groundY - 14;
          this.statusText = `Touchdown confirmed in Ares Vallis! Bounced 15 times, rolled ~1 km to rest.`;
          audio.playBeep(880, 'sine', 0.5);
        }
      }
    }

    this.updateStatsUI();
    this.draw();

    if (this.running) {
      this.reqId = requestAnimationFrame(() => this.loop());
    }
  }

  updateStatsUI() {
    const altEl = document.getElementById('sim-alt');
    const bounceEl = document.getElementById('sim-bounces');
    const statusEl = document.getElementById('sim-status');
    const deployBtn = document.getElementById('btn-deploy-rover');
    if (altEl) altEl.textContent = `${this.altitude} m`;
    if (bounceEl) bounceEl.textContent = `${this.bounces} / 15`;
    if (statusEl) statusEl.textContent = this.statusText;
    if (deployBtn) {
      deployBtn.disabled = !this.settled || this.roverDeployed;
    }
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Martian Sky (salmon / rust gradient)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.groundY);
    skyGrad.addColorStop(0, '#1c0f16');
    skyGrad.addColorStop(0.6, '#421d1b');
    skyGrad.addColorStop(1, '#87462c');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, this.groundY);

    // Stars / Atmospheric dust haze
    ctx.fillStyle = 'rgba(235, 175, 140, 0.25)';
    ctx.fillRect(0, this.groundY - 80, w, 80);

    // Distant Martian crater rim & hills
    ctx.fillStyle = '#52261a';
    ctx.beginPath();
    ctx.moveTo(0, this.groundY - 30);
    ctx.bezierCurveTo(w * 0.25, this.groundY - 65, w * 0.45, this.groundY - 20, w * 0.7, this.groundY - 50);
    ctx.lineTo(w, this.groundY - 25);
    ctx.lineTo(w, this.groundY);
    ctx.lineTo(0, this.groundY);
    ctx.fill();

    // Ares Vallis Ground (red soil + boulders)
    const groundGrad = ctx.createLinearGradient(0, this.groundY, 0, h);
    groundGrad.addColorStop(0, '#b85433');
    groundGrad.addColorStop(0.3, '#8e3a20');
    groundGrad.addColorStop(1, '#4f1e10');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, this.groundY, w, h - this.groundY);

    // Boulders
    ctx.fillStyle = '#612a19';
    const rocks = [60, 140, 260, 390, 520, 680, 820, 960];
    rocks.forEach((rx, idx) => {
      ctx.beginPath();
      ctx.ellipse(rx % w, this.groundY + 8 + (idx % 3) * 6, 14 + (idx % 5) * 4, 7 + (idx % 3) * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Parachute if deployed
    if (this.parachuteDeployed && this.y < this.groundY - 50) {
      ctx.strokeStyle = 'rgba(255, 235, 220, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 20);
      ctx.lineTo(this.x - 30, this.y - 65);
      ctx.moveTo(this.x, this.y - 20);
      ctx.lineTo(this.x + 30, this.y - 65);
      ctx.stroke();

      // Canopy
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(this.x, this.y - 70, 34, Math.PI, 0, false);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(this.x, this.y - 70, 16, Math.PI, 0, false);
      ctx.fill();
    }

    // Spacecraft Body / Airbag
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.settled) {
      // Landed state: deflated petals
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(-28, 4);
      ctx.lineTo(0, -12);
      ctx.lineTo(28, 4);
      ctx.lineTo(0, 8);
      ctx.closePath();
      ctx.fill();

      // Carl Sagan Memorial Station mast
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(0, -32);
      ctx.stroke();
      // Camera head
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-5, -36, 10, 6);

      // Deflated white airbag cloth around base
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(-24, 6, 14, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(24, 6, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sojourner Rover
      if (this.roverDeployed) {
        ctx.fillStyle = '#fbbf24'; // Rover body
        ctx.fillRect(40, -4, 24, 10);
        // Solar panel top
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(42, -7, 20, 3);
        // 6 small wheels
        ctx.fillStyle = '#0f172a';
        for (let wx = 42; wx <= 62; wx += 9) {
          ctx.beginPath();
          ctx.arc(wx, 8, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        // Label
        ctx.fillStyle = '#fef08a';
        ctx.font = '10px monospace';
        ctx.fillText('Sojourner (10.6 kg)', 34, -12);
      }
    } else if (this.airbagsInflated) {
      // Giant cluster of multi-lobed airbags
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;

      const lobes = [
        { ox: -16, oy: -14, r: 16 },
        { ox: 16, oy: -14, r: 16 },
        { ox: -18, oy: 12, r: 15 },
        { ox: 18, oy: 12, r: 15 },
        { ox: 0, oy: -18, r: 18 },
        { ox: 0, oy: 16, r: 18 },
        { ox: -22, oy: 0, r: 14 },
        { ox: 22, oy: 0, r: 14 },
        { ox: 0, oy: 0, r: 20 }
      ];

      lobes.forEach(l => {
        ctx.beginPath();
        ctx.arc(l.ox, l.oy, l.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Airbag seam straps
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Streamlined lander descending prior to inflation
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-14, 10);
      ctx.lineTo(0, -16);
      ctx.lineTo(14, 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-6, -6, 12, 6);
    }

    ctx.restore();

    // Official NASA SI Watermark (Challenge Compliance Rule)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '10px monospace';
    ctx.fillText('[SI Generated Simulation | NASA Space Apps 2026]', 14, 24);
  }
}

// ==========================================
// SIMULATION 2: Rover Distance Grand Prix
// ==========================================
class RoverGrandPrix {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  }

  render() {
    const data = CELESTIAL_DATA.distanceRecords;
    const maxDist = 50; // km for track scaling
    const marathon = data.marathonDistanceKm;

    let html = `
      <div class="grand-prix-header">
        <div class="gp-title-wrap">
          <h4>${data.title}</h4>
          <span class="gp-date">Benchmark Record Date: <strong>${data.asOfDate}</strong></span>
        </div>
        <p class="gp-sub">Scroll or inspect every off-world rover's actual journey. In October 2026, NASA's <strong>Perseverance</strong> officially broke Opportunity's 22-year legendary mark!</p>
      </div>

      <div class="marathon-banner">
        <span class="flag-icon">🏁</span>
        <span>Official Olympic Marathon Baseline: <strong>${marathon} km (26.22 miles)</strong></span>
      </div>

      <div class="rover-tracks-table">
    `;

    data.rovers.forEach((rover) => {
      const pct = Math.min(100, (rover.distanceKm / maxDist) * 100);
      const isMarathoner = rover.distanceKm >= marathon;
      const planetBadge = rover.planet === 'Mars' ? 'badge-mars' : 'badge-moon';

      html += `
        <div class="rover-row ${rover.active ? 'is-active-rover' : 'is-retired-rover'}">
          <div class="rover-meta">
            <span class="rover-name">${rover.name} ${rover.active ? '<span class="live-dot" title="Active on Surface"></span>' : ''}</span>
            <div class="rover-tags">
              <span class="mini-badge ${planetBadge}">${rover.planet}</span>
              <span class="mini-badge">${rover.country}</span>
              <span class="mini-badge text-muted">${rover.years}</span>
            </div>
          </div>
          
          <div class="rover-track-lane">
            <div class="marathon-marker" style="left: ${(marathon / maxDist) * 100}%;" title="Marathon Mark: 42.195 km"></div>
            <div class="rover-progress-bar" style="width: ${pct}%;">
              <span class="rover-icon-drive">${rover.planet === 'Mars' ? '🚙' : '🚜'}</span>
            </div>
          </div>

          <div class="rover-dist-badge">
            <span class="dist-num">${rover.distanceKm.toFixed(2)} km</span>
            <span class="dist-mi">(${(rover.distanceKm * 0.621371).toFixed(2)} mi)</span>
            ${isMarathoner ? '<span class="trophy-tag" title="Marathon Champion!">🏆 Ultra</span>' : ''}
          </div>
        </div>
        <div class="rover-row-note">${rover.note}</div>
      `;
    });

    html += `
      </div>
      <div class="grand-prix-footer">
        <small>Data Source: NASA/JPL-Caltech Odometer Telemetry & 2026 NASA Space Apps Challenge Data.</small>
      </div>
    `;

    this.container.innerHTML = html;
  }
}

// ==========================================
// SIMULATION 3: Kepler Exoplanet Transit Hunter
// ==========================================
class KeplerTransitLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.planetSize = 14; // pixels
    this.planetSpeed = 1.6;
    this.planetX = -40;
    this.starRadius = 55;
    this.lightCurveHistory = [];
    this.maxHistory = 180;
    this.reqId = null;
    this.activeSystem = "Kepler-11 (Multi-Planet System)";

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.parentElement.clientWidth;
    this.height = 300;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setPlanetSize(size) {
    this.planetSize = size;
    audio.playBeep(size * 40, 'sine', 0.05);
  }

  loop() {
    this.planetX += this.planetSpeed;
    if (this.planetX > this.width + 40) {
      this.planetX = -40;
    }

    const starCenterX = this.width * 0.35;
    const starCenterY = 90;

    // Calculate light dip (transit percentage)
    const distToStar = Math.abs(this.planetX - starCenterX);
    let dipFraction = 0;
    if (distToStar < this.starRadius + this.planetSize) {
      // Area ratio formula approximation
      const rRatio = this.planetSize / this.starRadius;
      dipFraction = (rRatio * rRatio) * Math.max(0, 1 - (distToStar / (this.starRadius + this.planetSize)));
    }

    const brightness = 1.0 - dipFraction;
    this.lightCurveHistory.push(brightness);
    if (this.lightCurveHistory.length > this.maxHistory) {
      this.lightCurveHistory.shift();
    }

    this.draw(starCenterX, starCenterY, brightness, dipFraction);
    this.reqId = requestAnimationFrame(() => this.loop());
  }

  draw(starX, starY, brightness, dipFraction) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Deep space background with subtle stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 30; i++) {
      const sx = (i * 47) % w;
      const sy = (i * 31) % (h * 0.55);
      ctx.fillRect(sx, sy, 1.2, 1.2);
    }

    // Top View: Telescope Field of View
    // Target Yellow Dwarf Star (Kepler-11 archetype)
    const starGlow = ctx.createRadialGradient(starX, starY, 10, starX, starY, this.starRadius * 1.5);
    starGlow.addColorStop(0, '#fef08a');
    starGlow.addColorStop(0.5, '#f59e0b');
    starGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = starGlow;
    ctx.beginPath();
    ctx.arc(starX, starY, this.starRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(starX, starY, this.starRadius, 0, Math.PI * 2);
    ctx.fill();

    // Orbital transit line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, starY);
    ctx.lineTo(w, starY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Transiting Exoplanet
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.planetX, starY, this.planetSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Exoplanet Atmosphere halo
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.arc(this.planetX, starY, this.planetSize + 3, 0, Math.PI * 2);
    ctx.stroke();

    // Star/Planet labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('Target Star: Yellow Dwarf (2,000 ly away)', 15, 22);
    ctx.fillText(`Transiting World: ~${(this.planetSize * 0.22).toFixed(1)}x Earth Radii (Sub-Neptune)`, 15, 38);

    // ===========================
    // Bottom Section: Photometer Light Curve
    // ===========================
    const graphY = h - 110;
    const graphH = 80;
    const graphW = w - 40;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(20, graphY, graphW, graphH);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, graphY, graphW, graphH);

    // Graph axes & labels
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.fillText('Kepler High-Precision Photometer (Stellar Brightness)', 26, graphY + 14);
    ctx.fillStyle = '#64748b';
    ctx.fillText('100.0% Normal', 26, graphY + 30);
    ctx.fillText(`Current: ${(brightness * 100).toFixed(2)}%`, graphW - 90, graphY + 30);

    // Baseline 100% line
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
    ctx.setLineDash([3, 3]);
    const baselineY = graphY + 28;
    ctx.beginPath();
    ctx.moveTo(25, baselineY);
    ctx.lineTo(graphW + 15, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Light Curve Line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    const step = graphW / this.maxHistory;
    for (let i = 0; i < this.lightCurveHistory.length; i++) {
      const gx = 25 + i * step;
      // Map 1.0 -> baselineY, and 0.85 -> bottom
      const dipPixels = (1.0 - this.lightCurveHistory[i]) * 450;
      const gy = baselineY + dipPixels;
      if (i === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.stroke();

    if (dipFraction > 0.005) {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`TRANSIT IN PROGRESS: -${(dipFraction * 100).toFixed(2)}% DIP`, starX - 80, starY - this.starRadius - 12);
    }

    // SI Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px monospace';
    ctx.fillText('[SI Generated Photometry | Kepler Transit Engine]', w - 270, h - 8);
  }
}

// ==========================================
// SIMULATION 4: Apollo 15 Vacuum Gravity Drop
// ==========================================
class ApolloVacuumDrop {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = 'moon'; // 'moon' (vacuum, g=1.62) or 'earth' (air, g=9.8)
    this.running = false;
    this.hammerY = 40;
    this.featherY = 40;
    this.hammerV = 0;
    this.featherV = 0;
    this.dropHeight = 40;
    this.hasLanded = false;
    this.reqId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.draw();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.parentElement.clientWidth;
    this.height = 320;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.groundY = this.height - 45;
    this.draw();
  }

  setEnvironment(env) {
    this.mode = env;
    audio.playBeep(520, 'sine', 0.1);
    this.reset();
  }

  reset() {
    cancelAnimationFrame(this.reqId);
    this.running = false;
    this.hammerY = 45;
    this.featherY = 45;
    this.hammerV = 0;
    this.featherV = 0;
    this.hasLanded = false;
    const descEl = document.getElementById('drop-result-text');
    if (descEl) {
      descEl.textContent = this.mode === 'moon' 
        ? "Lunar Vacuum (1.62 m/s²): No air molecules to cause drag. Commander Scott's experiment ready."
        : "Earth Atmosphere (9.8 m/s² with Air Resistance): Air density creates drag force on low-mass shapes.";
    }
    this.draw();
  }

  drop() {
    this.reset();
    this.running = true;
    audio.playBeep(750, 'triangle', 0.15);
    this.loop();
  }

  loop() {
    if (!this.running) return;

    if (this.mode === 'moon') {
      // Lunar Vacuum: Both fall with identical g = 1.62 m/s² (scaled)
      const lunarG = 0.22;
      this.hammerV += lunarG;
      this.featherV += lunarG;
      this.hammerY += this.hammerV;
      this.featherY += this.featherV;
    } else {
      // Earth Air: Hammer accelerates fast with minimal drag; Feather reaches rapid terminal velocity due to air resistance!
      const earthG = 0.65;
      this.hammerV += earthG;
      this.hammerY += this.hammerV;

      // Air resistance on feather
      const dragFactor = 0.12;
      this.featherV += (earthG - this.featherV * dragFactor);
      this.featherY += this.featherV;
    }

    // Check touchdown
    let hammerDown = false;
    let featherDown = false;

    if (this.hammerY >= this.groundY - 18) {
      this.hammerY = this.groundY - 18;
      hammerDown = true;
    }
    if (this.featherY >= this.groundY - 10) {
      this.featherY = this.groundY - 10;
      featherDown = true;
    }

    if (hammerDown && featherDown) {
      this.running = false;
      this.hasLanded = true;
      audio.playImpact();
      const descEl = document.getElementById('drop-result-text');
      if (descEl) {
        if (this.mode === 'moon') {
          descEl.innerHTML = `<strong>SIMULTANEOUS TOUCHDOWN!</strong> In the lunar vacuum, the 1.32 kg steel hammer and 0.03 kg falcon feather struck the regolith at the exact same millisecond. Galileo was right!`;
        } else {
          descEl.innerHTML = `<strong>AIR RESISTANCE EFFECT:</strong> On Earth, atmospheric drag arrests the feather's fall, while the heavy hammer slams the ground seconds earlier.`;
        }
      }
    }

    this.draw();
    if (this.running) {
      this.reqId = requestAnimationFrame(() => this.loop());
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Background
    if (this.mode === 'moon') {
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, w, h);
      // Apollo 15 Hadley Rille backdrop
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, this.groundY - 60);
      ctx.lineTo(w * 0.4, this.groundY - 110);
      ctx.lineTo(w * 0.75, this.groundY - 70);
      ctx.lineTo(w, this.groundY - 95);
      ctx.lineTo(w, this.groundY);
      ctx.lineTo(0, this.groundY);
      ctx.fill();

      // Regolith
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, this.groundY, w, h - this.groundY);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px monospace';
      ctx.fillText('Hadley-Apennine Lunar Vacuum Chamber (Apollo 15)', 16, 24);
    } else {
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, this.groundY, w, h - this.groundY);
      ctx.fillStyle = '#e0f2fe';
      ctx.font = '11px monospace';
      ctx.fillText('Earth Atmospheric Sea-Level Lab (1 atm Air Pressure)', 16, 24);
    }

    const col1X = w * 0.32;
    const col2X = w * 0.68;

    // Col 1: Geological Hammer (1.32 kg)
    ctx.save();
    ctx.translate(col1X, this.hammerY);
    // Handle
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-3, -22, 6, 28);
    // Steel Head
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-18, -28, 36, 10);
    // Mass Label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '10px monospace';
    ctx.fillText('Hammer (1.32 kg)', -45, -34);
    ctx.restore();

    // Col 2: Falcon Feather (0.03 kg)
    ctx.save();
    ctx.translate(col2X, this.featherY);
    // Feather quill and barb
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 16);
    ctx.stroke();

    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.ellipse(0, -4, 12, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '10px monospace';
    ctx.fillText('Falcon Feather (0.03 kg)', -60, -30);
    ctx.restore();

    // Ground line
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(w, this.groundY);
    ctx.stroke();

    // SI Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px monospace';
    ctx.fillText('[SI Generated Simulation | Galileo Vacuum Verification]', 16, h - 14);
  }
}

// ==========================================
// SIMULATION 5: Pioneer 10 Golden Plaque Cryptography
// ==========================================
class PioneerPlaqueInspector {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.activeKey = "pulsars";
    this.render();
  }

  selectKey(key) {
    this.activeKey = key;
    audio.playBeep(480, 'sine', 0.08);
    this.render();
  }

  render() {
    const explanations = {
      hydrogen: {
        title: "1. Hyperfine Transition of Neutral Hydrogen (The Universal Clock)",
        glyph: "⚪—|—⚪",
        detail: "At top left, two hydrogen atoms illustrate the spin-flip transition of an electron. This specifies a universal unit of time (0.704 nanoseconds) and length (21.1 cm / 8.3 inches), allowing any extraterrestrial civilization to decipher all measurements on the plaque."
      },
      humans: {
        title: "2. The Figures of Earth's Inhabitants",
        glyph: "🧍‍♂️🧍‍♀️",
        detail: "Drawings of a man and a woman in front of the spacecraft outline for scale. The man's right hand is raised in a goodwill greeting. Beside the woman, binary 8 indicates her height of 168 cm (8 x 21 cm)."
      },
      pulsars: {
        title: "3. The 14 Pulsar Galactic Beacon Map (Our Galactic Address)",
        glyph: "✳️ 14 Rays",
        detail: "The 14 lines radiate from our Sun. Each line carries a binary number representing the spin period of a known pulsating neutron star (pulsar). Because pulsars slow over millions of years, an alien astronomer can calculate both WHERE our Sun is located and WHEN Pioneer 10 was launched!"
      },
      planets: {
        title: "4. Solar System Trajectory Diagram",
        glyph: "☀️☿♀♁♂♃♄♅♆♇ 🚀",
        detail: "At the bottom, our Sun and nine planets are displayed (with Saturn's rings). A trajectory curve arcs away from the third planet (Earth), swings past the fifth planet (Jupiter), and heads outward into interstellar space."
      }
    };

    const current = explanations[this.activeKey];

    let html = `
      <div class="plaque-card-wrapper">
        <div class="plaque-interactive-canvas">
          <div class="plaque-gold-plate">
            <div class="plaque-hotspot hotspot-hydrogen ${this.activeKey === 'hydrogen' ? 'active' : ''}" onclick="window.plaqueSim.selectKey('hydrogen')">
              <span class="hotspot-badge">⚛️ Hydrogen</span>
            </div>
            <div class="plaque-hotspot hotspot-pulsars ${this.activeKey === 'pulsars' ? 'active' : ''}" onclick="window.plaqueSim.selectKey('pulsars')">
              <span class="hotspot-badge">✨ 14 Pulsars</span>
            </div>
            <div class="plaque-hotspot hotspot-humans ${this.activeKey === 'humans' ? 'active' : ''}" onclick="window.plaqueSim.selectKey('humans')">
              <span class="hotspot-badge">👥 Humans</span>
            </div>
            <div class="plaque-hotspot hotspot-planets ${this.activeKey === 'planets' ? 'active' : ''}" onclick="window.plaqueSim.selectKey('planets')">
              <span class="hotspot-badge">🪐 Trajectory</span>
            </div>

            <div class="plaque-engraving-svg">
              <svg viewBox="0 0 500 320" class="plaque-svg-view">
                <!-- Golden Base Metal -->
                <rect width="500" height="320" rx="12" fill="#c99738" stroke="#8a6119" stroke-width="4"/>
                
                <!-- Hyperfine Hydrogen (Top Left) -->
                <g stroke="#3e2908" stroke-width="2" fill="none">
                  <circle cx="90" cy="50" r="18"/>
                  <circle cx="90" cy="50" r="4" fill="#3e2908"/>
                  <circle cx="170" cy="50" r="18"/>
                  <circle cx="170" cy="50" r="4" fill="#3e2908"/>
                  <line x1="108" y1="50" x2="152" y2="50"/>
                  <line x1="130" y1="42" x2="130" y2="58"/>
                </g>

                <!-- Pulsar Map Rays (Center Left) -->
                <g stroke="#3e2908" stroke-width="1.8">
                  <circle cx="180" cy="180" r="3" fill="#3e2908"/>
                  <!-- 14 Pulsar lines -->
                  <line x1="180" y1="180" x2="40" y2="120"/>
                  <line x1="180" y1="180" x2="60" y2="200"/>
                  <line x1="180" y1="180" x2="90" y2="250"/>
                  <line x1="180" y1="180" x2="130" y2="270"/>
                  <line x1="180" y1="180" x2="220" y2="260"/>
                  <line x1="180" y1="180" x2="260" y2="220"/>
                  <line x1="180" y1="180" x2="270" y2="140"/>
                  <line x1="180" y1="180" x2="240" y2="90"/>
                  <line x1="180" y1="180" x2="190" y2="70"/>
                  <line x1="180" y1="180" x2="120" y2="90"/>
                  <line x1="180" y1="180" x2="50" y2="160"/>
                  <line x1="180" y1="180" x2="70" y2="80"/>
                  <line x1="180" y1="180" x2="310" y2="180" stroke-width="2.5"/> <!-- longest ray to galactic center -->
                  <line x1="180" y1="180" x2="210" y2="210"/>
                </g>

                <!-- Spacecraft Outline behind Humans -->
                <g stroke="#785316" stroke-width="2" fill="none" opacity="0.6">
                  <ellipse cx="370" cy="150" rx="65" ry="45"/>
                  <line x1="370" y1="150" x2="370" y2="80"/>
                </g>

                <!-- Man & Woman -->
                <g stroke="#3e2908" stroke-width="2" fill="none">
                  <!-- Man -->
                  <circle cx="340" cy="115" r="10"/>
                  <line x1="340" y1="125" x2="340" y2="175"/>
                  <line x1="340" y1="140" x2="315" y2="160"/>
                  <line x1="340" y1="140" x2="365" y2="125"/> <!-- Hand raised -->
                  <line x1="365" y1="125" x2="365" y2="110"/>
                  <line x1="340" y1="175" x2="328" y2="225"/>
                  <line x1="340" y1="175" x2="352" y2="225"/>

                  <!-- Woman -->
                  <circle cx="390" cy="120" r="9"/>
                  <line x1="390" y1="129" x2="390" y2="175"/>
                  <line x1="390" y1="145" x2="375" y2="175"/>
                  <line x1="390" y1="145" x2="405" y2="175"/>
                  <line x1="390" y1="175" x2="380" y2="225"/>
                  <line x1="390" y1="175" x2="400" y2="225"/>
                </g>

                <!-- Solar System & Trajectory at bottom -->
                <g fill="#3e2908" stroke="#3e2908" stroke-width="1.2">
                  <circle cx="50" cy="290" r="11"/> <!-- Sun -->
                  <circle cx="78" cy="290" r="2.5"/> <!-- Mercury -->
                  <circle cx="95" cy="290" r="4"/> <!-- Venus -->
                  <circle cx="115" cy="290" r="4.2"/> <!-- Earth -->
                  <circle cx="136" cy="290" r="3"/> <!-- Mars -->
                  <circle cx="175" cy="290" r="9"/> <!-- Jupiter -->
                  <ellipse cx="225" cy="290" rx="8" ry="7"/> <!-- Saturn -->
                  <circle cx="270" cy="290" r="5.5"/> <!-- Uranus -->
                  <circle cx="310" cy="290" r="5.5"/> <!-- Neptune -->
                  <circle cx="345" cy="290" r="1.8"/> <!-- Pluto -->

                  <!-- Pioneer trajectory curving from Earth past Jupiter -->
                  <path d="M 115 285 Q 155 250 175 275 T 260 250" fill="none" stroke="#684511" stroke-width="2" stroke-dasharray="3,3"/>
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div class="plaque-explanation-panel">
          <div class="plaque-tabs">
            <button class="plaque-tab-btn ${this.activeKey === 'pulsars' ? 'active' : ''}" onclick="window.plaqueSim.selectKey('pulsars')">✨ 14 Pulsars</button>
            <button class="plaque-tab-btn ${this.activeKey === 'hydrogen' ? 'active' : ''}" onclick="window.plaqueSim.selectKey('hydrogen')">⚛️ Hydrogen Unit</button>
            <button class="plaque-tab-btn ${this.activeKey === 'humans' ? 'active' : ''}" onclick="window.plaqueSim.selectKey('humans')">👥 Earthlings</button>
            <button class="plaque-tab-btn ${this.activeKey === 'planets' ? 'active' : ''}" onclick="window.plaqueSim.selectKey('planets')">🪐 Solar Path</button>
          </div>

          <div class="plaque-detail-card">
            <h4>${current.title}</h4>
            <p>${current.detail}</p>
            <div class="plaque-fact-quote">
              <em>"In case Pioneer 10 is intercepted by intelligent life, it carries this message so galactic travelers can determine the position of the Sun and the date of launch."</em>
              <span>— NASA History Program Office</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
}

// ==========================================
// SIMULATION 6: Celestial Hardware Trivia Quiz (3-Tier Progressive Challenge)
// ==========================================
class CelestialSpaceQuiz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Internal 60-Question Bank (Hidden from page display, categorized into 3 progressive tiers)
    this.questionBank = {
      basic: [
        {
          q: "What was the name of the Apollo 11 Lunar Module that landed on the Moon on July 20, 1969?",
          options: ["Eagle", "Falcon", "Intrepid", "Columbia"],
          correct: 0,
          explanation: "The Apollo 11 Lunar Module (LM-5) was famously named 'Eagle'."
        },
        {
          q: "Who was the first human being to step onto the surface of the Moon?",
          options: ["Neil A. Armstrong", "Buzz Aldrin", "Michael Collins", "Pete Conrad"],
          correct: 0,
          explanation: "Commander Neil A. Armstrong was the first person to walk on the lunar surface on July 21, 1969 UT."
        },
        {
          q: "What celestial body did NASA's Surveyor 3 explore in April 1967?",
          options: ["Earth's Moon", "Mars", "Asteroid Eros", "Jupiter"],
          correct: 0,
          explanation: "Surveyor 3 made a soft landing on Earth's Moon in the Oceanus Procellarum region."
        },
        {
          q: "What was the name of the first mobile robotic rover to drive on Mars, delivered by Pathfinder in 1997?",
          options: ["Sojourner", "Curiosity", "Opportunity", "Perseverance"],
          correct: 0,
          explanation: "The 23-pound micro-rover Sojourner was humanity's first rover on Mars, named after civil-rights crusader Sojourner Truth."
        },
        {
          q: "What type of vehicle was NASA's Ingenuity that operated on Mars until 2024?",
          options: ["A dual-rotor helicopter", "A six-wheeled rover", "A stationary lander", "An orbital satellite"],
          correct: 0,
          explanation: "Ingenuity was the first powered aircraft on another planet, featuring twin counter-rotating carbon-fiber rotors."
        },
        {
          q: "What planet was explored by the Viking 1 lander beginning in July 1976?",
          options: ["Mars", "Venus", "Mercury", "Jupiter"],
          correct: 0,
          explanation: "Viking 1 was humanity's first truly successful lander on Mars, setting down on July 20, 1976."
        },
        {
          q: "What two items did Commander David Scott drop together on the Moon during Apollo 15?",
          options: ["A geological hammer and a falcon feather", "A rock and a golf ball", "A wrench and a screw", "An apple and a coin"],
          correct: 0,
          explanation: "Scott dropped a 1.32 kg hammer and a 0.03 kg falcon feather to demonstrate Galileo's law of falling bodies in a vacuum."
        },
        {
          q: "Which target celestial body was visited and touched down upon by NEAR Shoemaker in 2001?",
          options: ["Asteroid 433 Eros", "Halley's Comet", "Dwarf Planet Ceres", "Mars Moon Phobos"],
          correct: 0,
          explanation: "NEAR Shoemaker was the first spacecraft to orbit and touch down on an asteroid (433 Eros)."
        },
        {
          q: "What is the primary scientific mission of the Kepler space telescope?",
          options: ["Hunting for exoplanets orbiting distant stars", "Mapping Earth's weather", "Photographing Mars dust storms", "Tracking asteroids near the Moon"],
          correct: 0,
          explanation: "Kepler was NASA's premier planet-hunting mission, discovering over 2,600 exoplanets outside our solar system."
        },
        {
          q: "What are the names of NASA's identical twin Mars Exploration Rovers that landed in 2004?",
          options: ["Spirit and Opportunity", "Curiosity and Perseverance", "Viking 1 and Viking 2", "Pioneer 10 and 11"],
          correct: 0,
          explanation: "Spirit and Opportunity were twin robot geologists sent to search for evidence of past liquid water on Mars."
        },
        {
          q: "What natural Martian phenomenon cleaned dust off Opportunity's solar panels to prolong its life?",
          options: ["Martian wind gusts and dust devils", "Liquid rain showers", "Astronaut maintenance crews", "Ice storms"],
          correct: 0,
          explanation: "Natural Martian wind 'cleaning events' swept dust off Opportunity's arrays, extending its mission from 90 days to 14+ years!"
        },
        {
          q: "What words are inscribed on the Apollo 11 plaque left behind on the Moon?",
          options: ["'Here men from the planet Earth first set foot on the Moon... We came in peace for all mankind.'", "'One small step for man, one giant leap for mankind.'", "'Exploration is in our nature.'", "'Tranquility Base, Earth outpost 1.'"],
          correct: 0,
          explanation: "The historic plaque mounted to the descent stage ladder reads: 'We came in peace for all mankind.'"
        },
        {
          q: "What was the callsign/name of the Apollo 15 Lunar Module?",
          options: ["Falcon", "Eagle", "Intrepid", "Columbia"],
          correct: 0,
          explanation: "The Apollo 15 Lunar Module (LM-10) was named 'Falcon'."
        },
        {
          q: "How many wheels does the micro-rover Sojourner have?",
          options: ["6 wheels", "4 wheels", "8 wheels", "3 wheels"],
          correct: 0,
          explanation: "Sojourner featured a 6-wheel articulated rocker-bogie mobility chassis."
        },
        {
          q: "What is the official Olympic marathon distance used as a benchmark for planetary rovers?",
          options: ["42.195 km (26.22 miles)", "25.0 km", "50.0 km", "100.0 km"],
          correct: 0,
          explanation: "The marathon distance is 42.195 km (26.22 miles), surpassed on Mars by both Opportunity and Perseverance."
        },
        {
          q: "What star in the Taurus constellation is Pioneer 10 heading toward over the next two million years?",
          options: ["Aldebaran", "Sirius", "Betelgeuse", "Proxima Centauri"],
          correct: 0,
          explanation: "Pioneer 10 is drifting silently through interstellar space toward the giant red star Aldebaran."
        },
        {
          q: "What color is the Martian sky as documented in Viking 1's historic color panoramas?",
          options: ["Salmon-pink to dusty yellow-tan", "Deep blue like Earth", "Emerald green", "Pitch black at noon"],
          correct: 0,
          explanation: "Airborne mineral dust scatters sunlight on Mars, giving the sky a warm salmon-pink or dusty tan appearance."
        },
        {
          q: "Where on Mars did Mars Pathfinder set down on July 4, 1997?",
          options: ["Ares Vallis floodplain", "Gusev Crater", "Jezero Crater", "Gale Crater"],
          correct: 0,
          explanation: "Pathfinder landed in Ares Vallis, an ancient catastrophic flood plain in the northern hemisphere of Mars."
        },
        {
          q: "What was the name of the Apollo 12 Lunar Module that landed near Surveyor 3?",
          options: ["Intrepid", "Eagle", "Falcon", "Aquarius"],
          correct: 0,
          explanation: "The Apollo 12 Lunar Module (LM-6) was named 'Intrepid'."
        },
        {
          q: "What is the name of this off-world hardware website?",
          options: ["Explorers-101", "Apollo-11", "Pathfinder", "Voyager"],
          correct: 0,
          explanation: "This project is Explorers-101, expertly coded by Antigravity!"
        }
      ],

      intermediate: [
        {
          q: "What caused Surveyor 3 to bounce twice on the Moon's surface in 1967 before settling?",
          options: [
            "Highly reflective rocks confused the descent radar, delaying retrorocket shutoff",
            "A software glitch in the Apollo guidance computer",
            "Strong solar wind storms disrupted lunar gravity",
            "The landing footpads were made of elastic rubber"
          ],
          correct: 0,
          explanation: "Reflective lunar rocks confused Surveyor 3's descent radar altimeter! It bounced to 33 feet and then 10 feet before soft-landing."
        },
        {
          q: "How many times did Mars Pathfinder bounce across Ares Vallis before rolling to a stop in 1997?",
          options: ["About 15 times", "Only once", "Exactly 42 times", "3 times"],
          correct: 0,
          explanation: "Encased in 24 multi-lobed airbags, Pathfinder bounced about 15 times, rebounding up to 50 feet high and rolling ~1 km."
        },
        {
          q: "What was Opportunity's total driving distance on Mars when its mission concluded in June 2018?",
          options: ["45.16 km (28.06 miles)", "7.7 km", "10.5 km", "100.0 km"],
          correct: 0,
          explanation: "Opportunity drove 45.16 km (28.06 miles), holding the off-Earth distance record for over 22 years."
        },
        {
          q: "On October 11, 2026, which NASA Mars rover officially surpassed Opportunity's driving record?",
          options: ["Perseverance", "Curiosity", "Spirit", "Sojourner"],
          correct: 0,
          explanation: "Perseverance drove past Opportunity's 45.16 km mark to reach 45.20 km (and counting) as of October 2026."
        },
        {
          q: "How many historic flights did the Ingenuity Mars Helicopter complete across its nearly 3-year mission?",
          options: ["72 flights", "5 flights", "25 flights", "120 flights"],
          correct: 0,
          explanation: "Originally planned for just 5 flights in 30 days, Ingenuity accomplished 72 historic flights before retirement in January 2024."
        },
        {
          q: "What two small worlds in the main asteroid belt did NASA's Dawn spacecraft enter orbit around?",
          options: ["Asteroid Vesta and dwarf planet Ceres", "Phobos and Deimos", "Eros and Mathilde", "Ida and Dactyl"],
          correct: 0,
          explanation: "Dawn was the first spacecraft to orbit two different extraterrestrial bodies: rocky Vesta (2011) and ice-rich Ceres (2015)."
        },
        {
          q: "What happened when Apollo 12's jettisoned ascent stage was intentionally steered to crash into the Moon?",
          options: [
            "It impacted 60 km away, creating the first recorded artificial moonquake on ALSEP",
            "It bounced into outer space",
            "It destroyed the Surveyor 3 lander",
            "It vanished with no seismic signal detected"
          ],
          correct: 0,
          explanation: "The impact rang the Moon like a bell for nearly an hour, registering as humanity's first artificial moonquake on ALSEP's seismometer."
        },
        {
          q: "What hardware did Apollo 12 astronauts Conrad and Bean retrieve from the dormant Surveyor 3 lander?",
          options: [
            "The television camera and robotic soil scoop (~10 kg of hardware)",
            "The solar panel and descent fuel tanks",
            "The entire spacecraft chassis intact",
            "Only the American flag sticker"
          ],
          correct: 0,
          explanation: "Astronauts walked 180 meters to Surveyor 3, unbolted its TV camera and scoop, and returned them to Earth to test 2.5 years of space weathering."
        },
        {
          q: "What acoustic phenomenon was recorded on Mars by InSight on December 1, 2018?",
          options: [
            "Low-frequency rumble caused by 10-15 mph Martian winds vibrating its solar panels",
            "Sound of running underground rivers",
            "Radio waves from alien lightning strikes",
            "Thunderclaps from volcanic eruptions"
          ],
          correct: 0,
          explanation: "InSight's seismometer and air pressure sensor captured the haunting acoustic vibrations of Martian wind blowing at 10-15 mph."
        },
        {
          q: "What radioisotope fuel was housed in the SNAP-27 generator to power Apollo ALSEP scientific stations?",
          options: ["Plutonium-238", "Uranium-235", "Thorium-232", "Radium-226"],
          correct: 0,
          explanation: "The SNAP-27 RTG contained approximately 4 kg of Plutonium-238, delivering ~70 W of continuous electrical power."
        },
        {
          q: "What is the radioactive half-life of Plutonium-238 used in deep-space RTGs?",
          options: ["89.6 years", "10.5 years", "250 years", "5,000 years"],
          correct: 0,
          explanation: "Plutonium-238 has a half-life of 89.6 years, making it an ideal long-lasting heat and electrical source for space exploration."
        },
        {
          q: "How much did the Ingenuity Mars Helicopter weigh in the weaker gravity of Mars?",
          options: ["1.5 pounds (0.68 kg)", "4.0 pounds (1.8 kg)", "10.6 kg", "Zero weight"],
          correct: 0,
          explanation: "While weighing ~4 lbs (1.8 kg) on Earth, Mars' 38% gravity reduced Ingenuity's weight to just 1.5 lbs (0.68 kg)."
        },
        {
          q: "What did Mars Exploration Rover Opportunity discover nicknamed 'Martian blueberries'?",
          options: [
            "Hematite mineral spherules formed in ancient standing liquid water",
            "Frozen carbon-dioxide pellets",
            "Blue volcanic crystals",
            "Living cyanobacteria colonies"
          ],
          correct: 0,
          explanation: "Opportunity discovered gray hematite spherules nicknamed 'blueberries', conclusive proof that liquid water once soaked Meridiani Planum."
        },
        {
          q: "What Soviet remote-controlled rover set an early off-Earth driving record of 39 km on the Moon in 1973?",
          options: ["Lunokhod 2", "Lunokhod 1", "Sputnik 3", "Yutu"],
          correct: 0,
          explanation: "The USSR's Lunokhod 2 drove 39 kilometers across the Moon, holding the lunar distance record."
        },
        {
          q: "At what speed did NEAR Shoemaker touch down on asteroid 433 Eros on February 12, 2001?",
          options: ["A gentle 4 miles per hour (6.4 km/h)", "Over 200 miles per hour", "50 miles per hour", "It crashed at supersonic velocity"],
          correct: 0,
          explanation: "Despite not being designed as a lander, NEAR touched down at just 4 mph (6.4 km/h) and survived intact for two weeks."
        },
        {
          q: "In June 1983, what historic boundary did Pioneer 10 cross?",
          options: [
            "The orbit of Neptune, becoming the first human craft beyond the furthest planet",
            "The edge of the Milky Way galaxy",
            "The surface of Pluto",
            "The Kuiper Belt inner cliff"
          ],
          correct: 0,
          explanation: "On June 13, 1983, Pioneer 10 crossed Neptune's orbit, the first human-made artifact to travel beyond all known planets."
        },
        {
          q: "What did Viking 1's Gas Chromatograph Mass Spectrometer (GCMS) reveal about organic molecules in Martian soil?",
          options: [
            "Negative results for organic molecules above 10-100 parts per billion",
            "Abundant organic compounds everywhere",
            "Living alien microorganisms in all samples",
            "Fossilized DNA strands"
          ],
          correct: 0,
          explanation: "Viking's sensitive GCMS found no organic compounds above parts-per-billion levels in the tested soils."
        },
        {
          q: "How many reaction wheels did the Kepler space telescope lose before the 'K2' recovery?",
          options: ["2 of its 4 reaction wheels", "All 4 wheels", "1 wheel", "None (its thruster ran out of fuel)"],
          correct: 0,
          explanation: "Kepler lost 2 of its 4 reaction wheels, prompting engineers to use the physical pressure of sunlight to stabilize pointing."
        },
        {
          q: "How many total marsquakes did InSight's SEIS seismometer detect during its mission on Mars?",
          options: ["Over 1,300 marsquakes", "Exactly 5", "Zero (Mars is seismically dead)", "Over 50,000"],
          correct: 0,
          explanation: "InSight detected over 1,300 marsquakes, revealing Mars' lumpy mantle structure and liquid metallic core."
        },
        {
          q: "What was the name of the landing site of the Mars Exploration Rover Spirit?",
          options: ["Columbia Memorial Station in Gusev Crater", "Chryse Planitia", "Elysium Planitia", "Wright Brothers Field"],
          correct: 0,
          explanation: "Spirit's site was dedicated as Columbia Memorial Station in memory of the crew of Space Shuttle Columbia."
        }
      ],

      advanced: [
        {
          q: "What was the total launch mass of the Apollo 11 Lunar Module (ascent and descent stages with propellants)?",
          options: ["15,103 kg", "5,400 kg", "25,800 kg", "75,000 kg"],
          correct: 0,
          explanation: "The Apollo 11 LM mass was 15,103 kg (Ascent: 2,445 kg dry + 2,376 kg prop; Descent: 2,034 kg dry + 8,248 kg prop)."
        },
        {
          q: "What was the uplink command frequency used for Apollo ALSEP stations deployed on the Moon?",
          options: ["2119 MHz", "1420 MHz", "433 MHz", "5800 MHz"],
          correct: 0,
          explanation: "All Apollo ALSEP stations received uplink commands from Earth tracking stations at 2119 MHz."
        },
        {
          q: "What was the specific downlink telemetry frequency of the Apollo 15 ALSEP central station?",
          options: ["2278.0 MHz", "2276.5 MHz", "2119.0 MHz", "100.0 MHz"],
          correct: 0,
          explanation: "Apollo 15's ALSEP transmitted its scientific telemetry back to Earth at 2278.0 MHz (Apollo 11 EASEP was 2276.5 MHz)."
        },
        {
          q: "What was the bearing strength of lunar soil measured by Surveyor 3's surface sampler tests?",
          options: ["About 10 pounds per square inch (0.7 kg/cm² or 98 kPa)", "Over 500 psi", "1 psi", "Zero (frictionless fluid)"],
          correct: 0,
          explanation: "Surveyor 3 proved lunar soil had a bearing capacity of ~10 psi (similar to wet sand), confirming it would hold Apollo's landers."
        },
        {
          q: "How did engineers maintain 3-axis pointing stability for the Kepler space telescope during the K2 mission?",
          options: [
            "Balancing photon radiation pressure of sunlight against its solar panels like a kayak steering in current",
            "Firing emergency xenon thrusters continuously",
            "Tethering to a passing asteroid",
            "Using gravitational gradients from Earth"
          ],
          correct: 0,
          explanation: "Engineers ingeniously balanced solar photon pressure along the spacecraft's symmetry plane as a virtual third reaction wheel."
        },
        {
          q: "What unit of length and time is established at the top-left of the Pioneer 10 golden plaque?",
          options: [
            "Hyperfine transition of neutral hydrogen (21.1 cm wavelength / 0.704 ns)",
            "Speed of light in kilometers per hour",
            "The radius of Earth's orbit (1 AU)",
            "The diameter of a carbon atom"
          ],
          correct: 0,
          explanation: "The spin-flip of neutral hydrogen defines the universal dimensional unit (21 cm / 0.7 ns) for extraterrestrial decoders."
        },
        {
          q: "How many pulsating neutron stars (pulsars) are radiating from the Sun on Pioneer 10's galactic map?",
          options: ["14 pulsars", "4 pulsars", "88 pulsars", "3 pulsars"],
          correct: 0,
          explanation: "The plaque shows 14 pulsars with their binary spin periods to allow alien astronomers to locate the Sun in space and time."
        },
        {
          q: "What did InSight's seismic data reveal about the mantle of Mars?",
          options: [
            "A heterogeneous 'lumpy' mantle containing giant dense chunks from ancient impacts",
            "A mantle composed of uniform pure molten water",
            "A frozen solid mantle with zero seismic transmission",
            "A hollow honeycomb structure"
          ],
          correct: 0,
          explanation: "Marsquake waves revealed giant heterogeneous lumps scattered throughout Mars' mantle from ancient primordial impacts."
        },
        {
          q: "What was the diameter of the primary mirror on the Kepler space telescope?",
          options: ["1.4 meters (4 feet 7 inches)", "2.4 meters", "0.5 meters", "6.5 meters"],
          correct: 0,
          explanation: "Kepler's telescope featured a 1.4-meter (4 ft 7 in) primary mirror, one of the largest mirrors ever sent beyond Earth orbit."
        },
        {
          q: "What was the maximum escape velocity achieved by Pioneer 10 upon launch in March 1972?",
          options: ["32,110 miles per hour (51,682 km/h)", "15,000 mph", "25,000 mph", "65,000 mph"],
          correct: 0,
          explanation: "Pioneer 10 was boosted to 32,110 mph (51,682 km/h), making it the fastest human-made object at that point in history."
        },
        {
          q: "How long did Pioneer 10's final radio signal take to travel 7.6 billion miles to Earth on January 23, 2003?",
          options: ["11 hours and 20 minutes", "8 minutes", "3 days", "42 minutes"],
          correct: 0,
          explanation: "Traveling at the speed of light, the final faint telemetry signal took 11 hours and 20 minutes to cross 7.6 billion miles."
        },
        {
          q: "What type of propulsion system allowed the Dawn spacecraft to break orbit from Vesta and travel to Ceres?",
          options: ["Three NSTAR electrostatic xenon ion thrusters", "Hydrazine monopropellant only", "Liquid hydrogen/LOX engines", "Nuclear thermal pulse drive"],
          correct: 0,
          explanation: "Dawn used three NSTAR electrostatic ion engines that accelerated xenon ions to 40 km/s, delivering 90 mN of thrust."
        },
        {
          q: "What was the total mass of the Early Apollo Scientific Experiment Package (EASEP) deployed on Apollo 11?",
          options: ["48 kg", "125 kg", "12 kg", "250 kg"],
          correct: 0,
          explanation: "EASEP was a compact 48 kg self-contained package deployed 17 meters south of the Eagle LM."
        },
        {
          q: "How far did astronauts Scott and Irwin drive the Lunar Roving Vehicle (LRV-1) during Apollo 15 across 3 EVAs?",
          options: ["27.9 kilometers", "5.2 kilometers", "10.3 kilometers", "45.2 kilometers"],
          correct: 0,
          explanation: "Across three EVAs totaling 18 hours 35 minutes, the Apollo 15 LRV covered a total traverse of 27.9 km."
        },
        {
          q: "To what height did Surveyor 3 bounce on its very first rebound off the Moon?",
          options: ["33 feet (10 meters)", "5 feet (1.5 meters)", "100 feet (30 meters)", "1 foot"],
          correct: 0,
          explanation: "Surveyor 3 bounced 33 feet (10 m) into the vacuum on its first rebound, and 10 feet (3 m) on its second rebound."
        },
        {
          q: "At what altitude above Mars did Mars Pathfinder's computer trigger its 24 giant airbags to inflate?",
          options: ["About 330 feet (100 meters)", "10 miles", "500 meters", "Touchdown contact switch"],
          correct: 0,
          explanation: "Pathfinder's radar altimeter triggered the gas generators to inflate the airbags 100 meters (330 ft) above the surface."
        },
        {
          q: "At what RPM speed did Ingenuity's carbon-fiber blades spin to generate lift in Mars' thin atmosphere?",
          options: ["2,400 to 2,700 RPM", "500 RPM", "1,200 RPM", "5,000 RPM"],
          correct: 0,
          explanation: "In an atmosphere less than 1% as dense as Earth's, Ingenuity's counter-rotating blades had to spin at 2,400-2,700 RPM."
        },
        {
          q: "What are the exact landing coordinates of the Apollo 11 Lunar Module 'Eagle' in Mare Tranquilitatis?",
          options: ["0.67416° N latitude, 23.47314° E longitude", "26.13° N, 3.63° E", "3.01° S, 23.42° W", "19.33° N, 33.55° W"],
          correct: 0,
          explanation: "Apollo 11 set down at 0.67416° N, 23.47314° E in Mare Tranquilitatis as determined from Lunar Reconnaissance Orbiter imagery."
        },
        {
          q: "What was the electrical power output delivered by the SNAP-27 RTG on deployment at the Apollo ALSEP stations?",
          options: ["Approximately 70 W DC at 16 V (63.5 W after 1 year)", "500 W AC at 120 V", "10 W DC at 5 V", "1,000 W DC"],
          correct: 0,
          explanation: "The SNAP-27 RTG produced ~70 W DC at 16 V (decaying to 63.5 W after one year) to run ALSEP instruments continuously."
        },
        {
          q: "What planetary protection measure was taken at the end of the Dawn mission at dwarf planet Ceres?",
          options: [
            "Placed into a stable perpetual graveyard orbit calculated to stay clear of Ceres for 20-50+ years",
            "Deliberately impacted into Occator crater",
            "Ejected into interstellar space",
            "Returned to Earth orbit"
          ],
          correct: 0,
          explanation: "To protect Ceres' potentially habitable subsurface oceans from organic contamination, Dawn was placed in a stable perpetual orbit."
        }
      ]
    };

    // Progression & State Tracking
    this.tiers = ['basic', 'intermediate', 'advanced'];
    this.tierLabels = {
      basic: { name: "Tier 1: Basic", sub: "Essential Solar System Hardware & Milestones", icon: "🟢" },
      intermediate: { name: "Tier 2: Intermediate", sub: "Instruments, Discoveries & Missions", icon: "🟡" },
      advanced: { name: "Tier 3: Advanced", sub: "Orbital Mechanics, Subsystems & Telemetry", icon: "🟣" }
    };

    this.unlockedTiers = {
      basic: true,
      intermediate: false,
      advanced: false
    };

    this.currentTier = 'basic';
    this.questionsPerRound = 5;
    this.currentRoundQuestions = [];
    this.currentIndex = 0;
    this.tierScores = { basic: 0, intermediate: 0, advanced: 0 };
    this.score = 0;
    this.selectedAnswer = null;
    this.answered = false;
    this.sectionCleared = false;
    this.grandCompleted = false;

    this.startTier(this.currentTier);
  }

  // Pick 5 fresh randomized questions for the current tier
  startTier(tierName) {
    if (!this.unlockedTiers[tierName]) return;
    this.currentTier = tierName;

    const pool = this.questionBank[tierName] || this.questionBank.basic;
    
    // Fisher-Yates shuffle the tier question bank
    const shuffledPool = [...pool];
    for (let i = shuffledPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }

    // Select 5 questions and also shuffle the 4 answer choices so answers flip every time
    this.currentRoundQuestions = shuffledPool.slice(0, this.questionsPerRound).map(item => {
      const originalOptions = item.options.map((opt, idx) => ({ text: opt, isCorrect: idx === item.correct }));
      for (let i = originalOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [originalOptions[i], originalOptions[j]] = [originalOptions[j], originalOptions[i]];
      }
      const newCorrectIdx = originalOptions.findIndex(o => o.isCorrect);

      return {
        q: item.q,
        options: originalOptions.map(o => o.text),
        correct: newCorrectIdx,
        explanation: item.explanation
      };
    });

    this.currentIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.answered = false;
    this.sectionCleared = false;
    this.grandCompleted = false;
    this.render();
  }

  selectOption(idx) {
    if (this.answered) return;
    this.selectedAnswer = idx;
    this.answered = true;

    if (idx === this.currentRoundQuestions[this.currentIndex].correct) {
      this.score++;
      if (window.audio) window.audio.playBeep(880, 'sine', 0.2);
    } else {
      if (window.audio) window.audio.playBeep(220, 'sawtooth', 0.25);
    }

    this.render();
  }

  nextQuestion() {
    this.currentIndex++;
    this.selectedAnswer = null;
    this.answered = false;

    if (this.currentIndex >= this.currentRoundQuestions.length) {
      this.handleSectionCompletion();
    } else {
      this.render();
    }
  }

  handleSectionCompletion() {
    this.tierScores[this.currentTier] = this.score;
    const passed = this.score >= 3; // 3 out of 5 to clear section

    if (passed) {
      this.sectionCleared = true;
      if (this.currentTier === 'basic') {
        this.unlockedTiers.intermediate = true;
      } else if (this.currentTier === 'intermediate') {
        this.unlockedTiers.advanced = true;
      } else if (this.currentTier === 'advanced') {
        this.grandCompleted = true;
      }
    } else {
      this.sectionCleared = false;
    }

    this.render();
  }

  advanceToNextTier() {
    if (this.currentTier === 'basic' && this.unlockedTiers.intermediate) {
      this.startTier('intermediate');
    } else if (this.currentTier === 'intermediate' && this.unlockedTiers.advanced) {
      this.startTier('advanced');
    }
  }

  redoCurrentTier() {
    this.startTier(this.currentTier);
  }

  restartAll() {
    this.unlockedTiers = { basic: true, intermediate: false, advanced: false };
    this.tierScores = { basic: 0, intermediate: 0, advanced: 0 };
    this.startTier('basic');
  }

  render() {
    // Grand Master Completion Screen
    if (this.grandCompleted) {
      this.renderGrandCompletion();
      return;
    }

    // Section Result / Clearance Screen
    if (this.currentIndex >= this.currentRoundQuestions.length) {
      this.renderSectionResult();
      return;
    }

    const q = this.currentRoundQuestions[this.currentIndex];
    const currentMeta = this.tierLabels[this.currentTier];

    let html = `
      <!-- Progressive Tier Navigation Bar -->
      <div class="quiz-tier-strip">
        <button class="tier-tab-btn ${this.currentTier === 'basic' ? 'active' : ''}" onclick="window.quizSim.startTier('basic')">
          <span class="tier-status-icon">🟢</span>
          <span>Basic Tier</span>
        </button>

        <button class="tier-tab-btn ${this.currentTier === 'intermediate' ? 'active' : ''} ${!this.unlockedTiers.intermediate ? 'locked' : ''}" 
                onclick="window.quizSim.startTier('intermediate')" ${!this.unlockedTiers.intermediate ? 'disabled title=\"Clear Basic Tier to Unlock\"' : ''}>
          <span class="tier-status-icon">${this.unlockedTiers.intermediate ? '🟡' : '🔒'}</span>
          <span>Intermediate</span>
        </button>

        <button class="tier-tab-btn ${this.currentTier === 'advanced' ? 'active' : ''} ${!this.unlockedTiers.advanced ? 'locked' : ''}" 
                onclick="window.quizSim.startTier('advanced')" ${!this.unlockedTiers.advanced ? 'disabled title=\"Clear Intermediate Tier to Unlock\"' : ''}>
          <span class="tier-status-icon">${this.unlockedTiers.advanced ? '🟣' : '🔒'}</span>
          <span>Advanced</span>
        </button>
      </div>

      <div class="quiz-card">
        <div class="tier-info-banner">
          <div>
            <span class="tier-info-badge">${currentMeta.name}</span>: ${currentMeta.sub}
          </div>
          <span class="font-mono text-xs">Section Progress: ${this.currentIndex + 1} / 5</span>
        </div>

        <div class="quiz-progress-bar">
          <div class="quiz-bar-fill" style="width: ${((this.currentIndex + 1) / this.currentRoundQuestions.length) * 100}%;"></div>
        </div>

        <div class="quiz-head">
          <span class="quiz-step">Question ${this.currentIndex + 1} of 5</span>
          <span class="quiz-score">Current Score: ${this.score} / 5</span>
        </div>

        <h3 class="quiz-question">${q.q}</h3>

        <div class="quiz-options-list">
    `;

    q.options.forEach((opt, idx) => {
      let optClass = "quiz-opt-btn";
      if (this.answered) {
        if (idx === q.correct) optClass += " opt-correct";
        else if (idx === this.selectedAnswer) optClass += " opt-incorrect";
        else optClass += " opt-disabled";
      }

      html += `
        <button class="${optClass}" onclick="window.quizSim.selectOption(${idx})" ${this.answered ? 'disabled' : ''}>
          <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="opt-text">${opt}</span>
        </button>
      `;
    });

    html += `</div>`;

    if (this.answered) {
      const isCorrect = this.selectedAnswer === q.correct;
      html += `
        <div class="quiz-feedback-box ${isCorrect ? 'fb-correct' : 'fb-incorrect'}">
          <div class="fb-title">${isCorrect ? '✅ CORRECT!' : '❌ INCORRECT!'}</div>
          <p class="fb-exp">${q.explanation}</p>
          <button class="btn-next-quiz" onclick="window.quizSim.nextQuestion()">
            ${this.currentIndex + 1 === this.currentRoundQuestions.length ? 'Complete Section 🏁' : 'Next Question ➡️'}
          </button>
        </div>
      `;
    }

    html += `</div>`;
    this.container.innerHTML = html;
  }

  renderSectionResult() {
    const passed = this.score >= 3;
    const currentMeta = this.tierLabels[this.currentTier];
    const hasNext = (this.currentTier === 'basic') || (this.currentTier === 'intermediate');
    const nextTierName = this.currentTier === 'basic' ? 'Intermediate Tier' : 'Advanced Tier';

    let html = `
      <div class="quiz-tier-strip">
        <button class="tier-tab-btn ${this.currentTier === 'basic' ? 'active' : ''}" onclick="window.quizSim.startTier('basic')">
          <span class="tier-status-icon">🟢</span>
          <span>Basic Tier</span>
        </button>
        <button class="tier-tab-btn ${this.currentTier === 'intermediate' ? 'active' : ''} ${!this.unlockedTiers.intermediate ? 'locked' : ''}" 
                onclick="window.quizSim.startTier('intermediate')" ${!this.unlockedTiers.intermediate ? 'disabled' : ''}>
          <span class="tier-status-icon">${this.unlockedTiers.intermediate ? '🟡' : '🔒'}</span>
          <span>Intermediate</span>
        </button>
        <button class="tier-tab-btn ${this.currentTier === 'advanced' ? 'active' : ''} ${!this.unlockedTiers.advanced ? 'locked' : ''}" 
                onclick="window.quizSim.startTier('advanced')" ${!this.unlockedTiers.advanced ? 'disabled' : ''}>
          <span class="tier-status-icon">${this.unlockedTiers.advanced ? '🟣' : '🔒'}</span>
          <span>Advanced</span>
        </button>
      </div>

      <div class="quiz-card stage-clear-box">
        <div class="stage-clear-icon">${passed ? '🎉' : '⚠️'}</div>
        <h2 class="stage-clear-title">${passed ? `${currentMeta.name} Cleared!` : `${currentMeta.name} Incomplete`}</h2>
        <div class="result-score-large">${this.score} / 5</div>
        <p class="stage-clear-desc">
          ${passed 
            ? `Congratulations! You scored ${this.score}/5 on ${currentMeta.name}. ${hasNext ? `The <strong>${nextTierName}</strong> is now UNLOCKED!` : 'You have mastered this level!'}`
            : `You scored ${this.score}/5. You need at least 3/5 to clear this tier and unlock the next section.`}
        </p>

        <div class="stage-actions-group">
          ${passed && hasNext ? `
            <button class="btn-stage-advance" onclick="window.quizSim.advanceToNextTier()">
              <span>Unlock & Enter ${nextTierName} 🔓</span>
              <span>➡️</span>
            </button>
          ` : ''}

          <button class="btn-stage-retry" onclick="window.quizSim.redoCurrentTier()">
            🔄 Redo This Section (Fresh 5 Questions)
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  renderGrandCompletion() {
    const totalScore = this.tierScores.basic + this.tierScores.intermediate + this.tierScores.advanced;
    const percentage = Math.round((totalScore / 15) * 100);

    let rankTitle = "Deep Space Explorer";
    let badgeEmoji = "🚀";
    if (totalScore >= 14) {
      rankTitle = "Chief Flight Commander";
      badgeEmoji = "🥇";
    } else if (totalScore >= 11) {
      rankTitle = "Senior Deep Space Specialist";
      badgeEmoji = "🥈";
    } else if (totalScore >= 9) {
      rankTitle = "Planetary Science Specialist";
      badgeEmoji = "🥉";
    }

    let html = `
      <div class="quiz-card quiz-results-card">
        <div class="result-badge-icon">${badgeEmoji}</div>
        <h2>All Quiz Tiers Completed!</h2>
        <div class="result-score-large">${totalScore} / 15</div>
        <div class="result-rank-title">Rank: <span>${rankTitle}</span> (${percentage}%)</div>
        <p class="result-desc">You successfully cleared all three progressive tiers (Basic, Intermediate, and Advanced) with ${totalScore} out of 15 correct answers!</p>

        <div class="stage-actions-group" style="margin-top: 24px;">
          <button class="btn-stage-advance" onclick="window.quizSim.restartAll()">
            🔄 Play Entire Quiz Again (All New Questions)
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
}

// Global initialization helper
window.initSimulations = function() {
  window.pathfinderSim = new PathfinderBounceSim('pathfinderCanvas');
  window.keplerSim = new KeplerTransitLab('keplerCanvas');
  window.apolloDropSim = new ApolloVacuumDrop('apolloDropCanvas');
  window.roverGrandPrix = new RoverGrandPrix('roverGrandPrixContainer');
  window.plaqueSim = new PioneerPlaqueInspector('plaqueInspectorContainer');
  window.quizSim = new CelestialSpaceQuiz('quizContainer');
};
