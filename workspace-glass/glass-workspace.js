import '../workspace-ui/workspace.js';

// Keep the original workspace's data, controls, persistence and bounded motion.
// This edition owns only its composition and the glass material adapter.
window.glassWorkspace = window.WorkspaceGlassMaterials.mount();

// One-time colourway trial for this edition; later user choices remain saved.
try {
  if (!localStorage.getItem('second-brain-glass-steel-trial')) {
    const colourway = document.querySelector('#ui-colourway');
    colourway.value = 'steel'; colourway.dispatchEvent(new Event('change', {bubbles:true}));
    localStorage.setItem('second-brain-glass-steel-trial', '1');
  }
} catch {}
