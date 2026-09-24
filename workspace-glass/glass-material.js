/* Local adapter for unmodified dashersw/liquid-glass-js (MIT).
 * Only the bundled still becomes a texture. No document capture or render loop.
 * Native buttons retain interaction, focus and accessible names.
 */
(() => {
  const initialise = function () { this.createElement(); this.setupCanvas(); };
  const setupCanvas = function () {
    this.gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: true });
  };
  let draws = 0;
  const startRenderLoop = function () {
    this.render = () => {
      const refs = this.gl_refs, gl = refs.gl;
      if (!gl || gl.isContextLost()) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(refs.scrollYLoc, 0);
      const pos = this.getPosition();
      gl.uniform2f(refs.containerPositionLoc, pos.x, pos.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      draws++;
    };
    this.render();
  };
  class Surface extends Container {
    init() { initialise.call(this); }
    setupCanvas() { setupCanvas.call(this); }
    startRenderLoop() { startRenderLoop.call(this); }
  }
  class Action extends Button {
    init() { initialise.call(this); }
    setupCanvas() { setupCanvas.call(this); }
    setSizeFromText() { this.borderRadius = 22; }
    startRenderLoop() { startRenderLoop.call(this); }
  }
  window.WorkspaceGlassMaterials = { mount() {
    const backdrop = document.querySelector('#scene-image');
    const toggle = document.querySelector('#material-mode');
    const surfaces = new Map();
    const snapshot = document.createElement('canvas');
    const context = snapshot.getContext('2d');
    // Material recipes from the existing local Liquid Glass lab (lab-config.js).
    const defaults = { blurRadius:5, tintOpacity:.2, edgeIntensity:.01, rimIntensity:.05,
      baseIntensity:.01, edgeDistance:.15, rimDistance:.8, baseDistance:.1,
      cornerBoost:.02, rippleEffect:.1, warp:false };
    const presets = {
      clear:{...defaults,blurRadius:1.5,tintOpacity:.08,edgeIntensity:.007,rimIntensity:.025,cornerBoost:.01,rippleEffect:.025},
      soft:{...defaults,tintOpacity:.3,edgeIntensity:.014,rimIntensity:.065,cornerBoost:.025},
      liquid:{...defaults,blurRadius:3,tintOpacity:.22,edgeIntensity:.045,rimIntensity:.12,cornerBoost:.055,rippleEffect:.28,warp:true,baseIntensity:.025}
    };
    let timer, mode = 'soft', disposed = false;
    try { const saved = localStorage.getItem('second-brain-glass-material');
      if (['clear','soft','liquid','frost','solid'].includes(saved)) mode = saved;
    } catch {}
    const hosts = [...document.querySelectorAll('[data-glass], [data-glass-button]')];
    function syncMode() {
      document.documentElement.dataset.material = presets[mode] ? 'glass' : mode;
      document.documentElement.dataset.glassPreset = mode;
      toggle.value = mode;
    }
    function refresh() {
      if (disposed || !presets[mode] || document.hidden || !backdrop.naturalWidth || !context) return;
      snapshot.width = innerWidth; snapshot.height = innerHeight;
      context.fillStyle = '#010102'; context.fillRect(0, 0, innerWidth, innerHeight);
      const scale = Math.max(innerWidth / backdrop.naturalWidth, innerHeight / backdrop.naturalHeight);
      const w = backdrop.naturalWidth * scale, h = backdrop.naturalHeight * scale;
      context.globalAlpha = .78;
      context.drawImage(backdrop, (innerWidth - w) / 2, (innerHeight - h) / 2, w, h);
      context.globalAlpha = 1;
      for (const host of hosts) {
        if (!host.checkVisibility()) continue;
        let surface = surfaces.get(host);
        if (!surface) {
          surface = host.hasAttribute('data-glass-button')
            ? new Action({ text: 'Save view', size: 12, type: 'pill', tintOpacity: .08 })
            : new Surface({ borderRadius: parseFloat(getComputedStyle(host).borderRadius) || 24, tintOpacity: .06 });
          surfaces.set(host, surface);
          surface.element.classList.add('glass-material');
          surface.element.setAttribute('aria-hidden', 'true');
          surface.element.inert = true;
          host.prepend(surface.element);
          surface.canvas.addEventListener('webglcontextlost', () => {
            host.classList.remove('material-ready');
          });
        }
        if (!surface.gl || surface.gl.isContextLost()) continue;
        const rect = host.getBoundingClientRect();
        const width = Math.ceil(rect.width), height = Math.ceil(rect.height);
        if (!width || !height) continue;
        surface.width = width; surface.height = height;
        surface.canvas.width = width; surface.canvas.height = height;
        if (!surface.webglInitialized) {
          surface.setupShader(snapshot);
          surface.webglInitialized = !!surface.gl_refs.gl;
        }
        const refs = surface.gl_refs, gl = refs.gl;
        if (!gl) continue;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(refs.resolutionLoc, width, height);
        gl.uniform2f(refs.textureSizeLoc, innerWidth, innerHeight);
        gl.uniform1f(refs.pageHeightLoc, innerHeight);
        gl.uniform1f(refs.viewportHeightLoc, innerHeight);
        gl.uniform1f(refs.borderRadiusLoc, surface.borderRadius);
        const recipe = presets[mode];
        for (const [key, value] of Object.entries(recipe)) {
          const location = refs[key + 'Loc'];
          if (location != null) gl.uniform1f(location, key === 'warp' ? Number(value) : value);
        }
        gl.bindTexture(gl.TEXTURE_2D, refs.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snapshot);
        surface.render();
        host.classList.add('material-ready');
      }
    }
    function schedule() { clearTimeout(timer); timer = setTimeout(refresh, 380); }
    toggle.addEventListener('change', () => {
      mode = toggle.value; syncMode();
      try { localStorage.setItem('second-brain-glass-material', mode); } catch {}
      schedule();
    });
    const observer = new ResizeObserver(schedule);
    hosts.forEach(host => observer.observe(host));
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    document.addEventListener('click', schedule);
    document.addEventListener('keydown', schedule);
    backdrop.addEventListener('load', schedule);
    window.addEventListener('pagehide', () => {
      disposed = true; clearTimeout(timer); observer.disconnect();
      surfaces.forEach(surface => surface.gl?.getExtension('WEBGL_lose_context')?.loseContext());
    }, { once: true });
    syncMode(); schedule();
    return { getState: () => ({ mode, enabled: !!presets[mode], recipe: presets[mode] || null, instances: surfaces.size, draws,
      ready: hosts.filter(host => host.classList.contains('material-ready')).length,
      containers: [...surfaces.values()].filter(surface => surface instanceof Surface).length,
      buttons: [...surfaces.values()].filter(surface => surface instanceof Action).length,
      continuousAnimation: false, snapshotSource: 'bundled universe still only' }) };
  } };
})();
