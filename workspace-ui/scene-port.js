// A future renderer subscribes here. This preview deliberately mounts no engine.
const channel = new EventTarget();
let current = null;
const copy = value => JSON.parse(JSON.stringify(value));
export const scenePort = {
  getState: () => copy(current),
  subscribe(listener) {
    const handler = event => listener(copy(event.detail));
    channel.addEventListener('workspace:change', handler);
    return () => channel.removeEventListener('workspace:change', handler);
  },
  update(state) {
    current = copy(state);
    channel.dispatchEvent(new CustomEvent('workspace:change', {detail: copy(current)}));
  }
};
