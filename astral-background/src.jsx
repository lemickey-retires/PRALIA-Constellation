import React, { Component, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useFrame, useThree } from '@react-three/fiber';
import { ShaderGradient, ShaderGradientCanvas, presets } from '@shadergradient/react';

const host = document.getElementById('astral-background');
const status = document.getElementById('background-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const allowedPresets = ['nightyNight', 'universe'];

function readSettings() {
  return {
    preset: allowedPresets.includes(host.dataset.preset) ? host.dataset.preset : 'universe',
    enabled: host.dataset.enabled !== 'false',
    playing: host.dataset.paused !== 'true' && !reducedMotion.matches && !document.hidden,
  };
}

// Only native playback and a frame counter live here. ShaderGradient retains
// its own clock, geometry, materials and rendering loop; no custom time values,
// frame-rate cap, colours, opacity, lighting, shape or shader replacements.
function Playback({ playing }) {
  const setFrameloop = useThree(s => s.setFrameloop);
  const sample = useRef({ start: performance.now(), frames: 0 });
  useEffect(() => {
    setFrameloop(playing ? 'always' : 'demand');
    host.dataset.motion = playing ? 'running' : 'paused';
    sample.current = { start: performance.now(), frames: 0 };
  }, [playing, setFrameloop]);
  useFrame(() => {
    const now = performance.now();
    sample.current.frames++;
    host.dataset.renderer = 'shadergradient';
    if (now - sample.current.start >= 1500) {
      host.dataset.fps = String(Math.round(sample.current.frames * 1000 / (now - sample.current.start)));
      sample.current = { start: now, frames: 0 };
    }
  });
  return null;
}

class BackgroundBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {
    host.dataset.renderer = 'unavailable';
    status.textContent = 'Background unavailable. The graph still works.';
  }
  render() { return this.state.failed ? null : this.props.children; }
}

function Background() {
  const [settings, setSettings] = useState(readSettings);
  useEffect(() => {
    const sync = () => setSettings(readSettings());
    window.addEventListener('constellation-background-settings', sync);
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    return () => {
      window.removeEventListener('constellation-background-settings', sync);
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', sync);
    };
  }, []);
  const preset = presets[settings.preset];
  useEffect(() => {
    host.dataset.renderer = settings.enabled ? 'loading' : 'off';
    host.dataset.motion = settings.enabled && settings.playing ? 'running' : 'paused';
    status.textContent = settings.enabled
      ? preset.title + ' · original ShaderGradient preset' + (settings.playing ? '.' : ' · paused.')
      : 'Background off.';
  }, [settings.enabled, settings.playing, preset]);
  if (!settings.enabled) return null;
  return (
    <BackgroundBoundary key={settings.preset}>
      <ShaderGradientCanvas pixelDensity={preset.props.pixelDensity} fov={preset.props.fov}
        pointerEvents="none" powerPreference="high-performance" preserveDrawingBuffer={false}
        style={{ position: 'absolute', inset: 0 }}>
        <ShaderGradient {...preset.props} animate={settings.playing ? preset.props.animate : 'off'} />
        <Playback playing={settings.playing} />
      </ShaderGradientCanvas>
    </BackgroundBoundary>
  );
}

createRoot(host).render(<Background />);
