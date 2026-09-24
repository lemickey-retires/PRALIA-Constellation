// The display simulation is intentionally separate from Rapier. It animates
// every rendered star with bounded O(nodes + sparse links) work, while Rapier
// remains available for the much rarer direct drag/drop collision operation.
// That split keeps a large constellation continuously responsive instead of
// making a few rigid bodies move while the rest of the picture is frozen.
export function visualHash(id) {
  let h = 2166136261;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class VisualMotion {
  constructor(nodes, data) {
    this.nodes = nodes;
    this.data = data;
    this.count = nodes.length;
    this.index = new Map(nodes.map((node, index) => [node.id, index]));
    this.base = new Float32Array(this.count * 3);
    this.positions = new Float32Array(this.count * 3);
    this.velocity = new Float32Array(this.count * 3);
    this.roots = new Int32Array(this.count);
    this.phases = new Float32Array(this.count);
    this.pointer = null;
    this.time = 0;
    this.lastStepMs = 0;
    this.forceAccumulator = 0;
    this.formation = null;
    this.links = this.makeSparseLinks();
    this.syncBases(nodes, true);
  }

  makeSparseLinks() {
    // A deterministic spanning network preserves the graph's actual connected
    // structure without evaluating all 14,520 edges on every display frame.
    // The source data is untouched; selection still exposes every relation.
    const strong = new Set(this.data.attraction || []);
    const parent = Array.from({length: this.count}, (_, index) => index);
    const find = index => {
      while (parent[index] !== index) {
        parent[index] = parent[parent[index]];
        index = parent[index];
      }
      return index;
    };
    const result = [];
    const ordered = [
      ...(this.data.attraction || []),
      ...this.data.edges.map((_, index) => index).filter(index => !strong.has(index))
    ];
    for (const edgeIndex of ordered) {
      const edge = this.data.edges[edgeIndex];
      const a = this.index.get(edge.from), b = this.index.get(edge.to);
      if (a === undefined || b === undefined || a === b) continue;
      const left = find(a), right = find(b);
      if (left === right) continue;
      parent[left] = right;
      result.push({a, b, strong: strong.has(edgeIndex)});
    }
    return result;
  }

  syncBases(nodes = this.nodes, snap = false) {
    this.nodes = nodes;
    for (let index = 0; index < this.count; index++) {
      const node = nodes[index], offset = index * 3;
      this.base[offset] = node.x;
      this.base[offset + 1] = node.y;
      this.base[offset + 2] = node.z;
      if (snap) {
        this.positions[offset] = node.x;
        this.positions[offset + 1] = node.y;
        this.positions[offset + 2] = node.z;
        this.velocity[offset] = this.velocity[offset + 1] = this.velocity[offset + 2] = 0;
      }
      const rootId = this.data.routes?.[node.id]?.root || node.id;
      this.roots[index] = this.index.get(rootId) ?? index;
      this.phases[index] = visualHash(node.id + '|visual-motion') * Math.PI * 2;
    }
  }

  beginFormation(nodes = this.nodes, animate = true) {
    if (!animate) {
      this.formation = null;
      this.syncBases(nodes, true);
      return;
    }
    const origin = new Float32Array(this.positions);
    this.syncBases(nodes, false);
    let centerX = 0, centerY = 0, centerZ = 0;
    for (let index = 0; index < this.count; index++) {
      const offset = index * 3;
      centerX += this.base[offset]; centerY += this.base[offset + 1]; centerZ += this.base[offset + 2];
    }
    this.formation = {
      origin, center:{x:centerX / this.count,y:centerY / this.count,z:centerZ / this.count}, elapsed:0,
      collapseDuration:.58, formDuration:1.55
    };
    this.velocity.fill(0);
    this.pointer = null;
  }

  get isForming() { return this.formation !== null; }

  get formationProgress() {
    if (!this.formation) return 1;
    const total = this.formation.collapseDuration + this.formation.formDuration;
    return clamp(this.formation.elapsed / total, 0, 1);
  }

  setPointer(pointer) {
    this.pointer = pointer && pointer.active ? {
      origin: {...pointer.origin}, direction: {...pointer.direction}, life: .38
    } : null;
  }

  clearPointer() { this.pointer = null; }

  copyPosition(index, target) {
    const offset = index * 3;
    return target.set(this.positions[offset], this.positions[offset + 1], this.positions[offset + 2]);
  }

  nodePosition(index) {
    const offset = index * 3;
    return {x: this.positions[offset], y: this.positions[offset + 1], z: this.positions[offset + 2]};
  }

  motionTarget(index, settings) {
    const offset = index * 3, root = this.roots[index] * 3, phase = this.phases[index];
    const rootX = this.base[root], rootY = this.base[root + 1], rootZ = this.base[root + 2];
    let x = this.base[offset] - rootX, y = this.base[offset + 1] - rootY, z = this.base[offset + 2] - rootZ;
    const strength = settings.orbit, time = this.time;
    if (settings.animation === 'breathe') {
      const scale = 1 + Math.sin(time * .62 + phase * .19) * .055 * strength;
      x *= scale; y *= scale; z *= scale;
    } else if (settings.animation === 'depth') {
      const yaw = (Math.sin(time * .56 + phase * .31) * .09 + time * .018) * strength;
      const pitch = Math.cos(time * .43 + phase * .17) * .055 * strength;
      const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
      const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
      const y1 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
      z = y * Math.sin(pitch) + z1 * Math.cos(pitch);
      y = y1;
      x = x1;
    }
    const shimmer = (6 + (this.nodes[index].tier === 'yellow' ? 4 : 10) * strength) * (settings.animation === 'float' ? 1.35 : .75);
    return {
      x: rootX + x * settings.spacing + Math.sin(time * .79 + phase) * shimmer,
      y: rootY + y * settings.spacing + Math.cos(time * .63 + phase * 1.7) * shimmer,
      z: rootZ + z * settings.spacing + Math.sin(time * .51 + phase * .71) * shimmer
    };
  }

  formationTarget(index, target) {
    const formation = this.formation;
    if (!formation) return target;
    const phase = this.phases[index], offset = index * 3;
    const vector = {
      x:Math.cos(phase) * .82 + Math.sin(phase * 2.7) * .18,
      y:Math.sin(phase * 1.37) * .76 + Math.cos(phase * .53) * .24,
      z:Math.sin(phase * .71) * .72 + Math.cos(phase * 1.91) * .28
    };
    const wobble = (amount, rate) => Math.sin(formation.elapsed * rate + phase * 2.1) * amount;
    const nucleus = {
      x:formation.center.x + vector.x * wobble(24, 13),
      y:formation.center.y + vector.y * wobble(20, 16),
      z:formation.center.z + vector.z * wobble(28, 11)
    };
    if (formation.elapsed < formation.collapseDuration) {
      const ratio = formation.elapsed / formation.collapseDuration;
      const eased = ratio * ratio * (3 - 2 * ratio);
      return {
        x:formation.origin[offset] * (1 - eased) + nucleus.x * eased,
        y:formation.origin[offset + 1] * (1 - eased) + nucleus.y * eased,
        z:formation.origin[offset + 2] * (1 - eased) + nucleus.z * eased
      };
    }
    const ratio = clamp((formation.elapsed - formation.collapseDuration) / formation.formDuration, 0, 1);
    const eased = 1 - Math.pow(1 - ratio, 3);
    const squirm = (1 - eased) * Math.sin(ratio * Math.PI) * 22;
    return {
      x:nucleus.x * (1 - eased) + target.x * eased + vector.x * squirm,
      y:nucleus.y * (1 - eased) + target.y * eased + vector.y * squirm,
      z:nucleus.z * (1 - eased) + target.z * eased + vector.z * squirm
    };
  }

  applyLinks(settings, dt) {
    if (settings.linkForce <= 0) return;
    for (const link of this.links) {
      const a = link.a * 3, b = link.b * 3;
      let x = this.positions[b] - this.positions[a], y = this.positions[b + 1] - this.positions[a + 1], z = this.positions[b + 2] - this.positions[a + 2];
      const distance = Math.hypot(x, y, z) || .001;
      const first = this.nodes[link.a], second = this.nodes[link.b];
      const desired = Math.max(first.radius + second.radius + 3, settings.linkDistance * (link.strong ? .72 : 1));
      const degree = Math.sqrt(Math.max(1, first.degree + 1) * Math.max(1, second.degree + 1));
      const pull = clamp((distance - desired) * settings.linkForce * (link.strong ? 1.3 : 1) * .28 / degree, -42, 42) * dt;
      x = x / distance * pull; y = y / distance * pull; z = z / distance * pull;
      this.velocity[a] += x; this.velocity[a + 1] += y; this.velocity[a + 2] += z;
      this.velocity[b] -= x; this.velocity[b + 1] -= y; this.velocity[b + 2] -= z;
    }
  }

  applyRepulsion(settings, dt) {
    if (settings.repulsion <= 0) return;
    const range = Math.max(22, (30 + settings.repulsion * 2.2) * settings.spacing), cell = range, grid = new Map();
    // Integers in this viewer stay comfortably inside these hash multipliers.
    // Numeric keys avoid allocating roughly one hundred thousand strings per
    // field step just to find neighbouring spatial cells.
    const key = (x, y, z) => (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
    for (let index = 0; index < this.count; index++) {
      const offset = index * 3, x = this.positions[offset], y = this.positions[offset + 1], z = this.positions[offset + 2];
      const cx = Math.floor(x / cell), cy = Math.floor(y / cell), cz = Math.floor(z / cell);
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
        for (const otherIndex of grid.get(key(cx + dx, cy + dy, cz + dz)) || []) {
          const other = otherIndex * 3;
          let ux = x - this.positions[other], uy = y - this.positions[other + 1], uz = z - this.positions[other + 2];
          let distance = Math.hypot(ux, uy, uz);
          if (distance >= range) continue;
          if (distance < .001) {
            const angle = visualHash(this.nodes[index].id + '|' + this.nodes[otherIndex].id) * Math.PI * 2;
            ux = Math.cos(angle); uy = Math.sin(angle); uz = Math.sin(angle * .73); distance = 1;
          }
          const force = settings.repulsion * 2.1 * Math.pow(1 - distance / range, 2) * dt / distance;
          ux *= force; uy *= force; uz *= force;
          this.velocity[offset] += ux; this.velocity[offset + 1] += uy; this.velocity[offset + 2] += uz;
          this.velocity[other] -= ux; this.velocity[other + 1] -= uy; this.velocity[other + 2] -= uz;
        }
      }
      const own = key(cx, cy, cz);
      if (!grid.has(own)) grid.set(own, []);
      grid.get(own).push(index);
    }
  }

  applyPointer(settings, dt) {
    const pointer = this.pointer;
    if (!pointer || settings.cursor <= 0) return false;
    pointer.life -= dt;
    if (pointer.life <= 0) { this.pointer = null; return false; }
    const range = Math.max(90, 210 * settings.spacing * settings.pointerReach);
    const {origin, direction} = pointer;
    for (let index = 0; index < this.count; index++) {
      const offset = index * 3;
      const ox = this.positions[offset] - origin.x, oy = this.positions[offset + 1] - origin.y, oz = this.positions[offset + 2] - origin.z;
      const along = ox * direction.x + oy * direction.y + oz * direction.z;
      if (along < 0) continue;
      const px = origin.x + direction.x * along, py = origin.y + direction.y * along, pz = origin.z + direction.z * along;
      let x = this.positions[offset] - px, y = this.positions[offset + 1] - py, z = this.positions[offset + 2] - pz;
      let distance = Math.hypot(x, y, z);
      if (distance >= range) continue;
      if (distance < .001) {
        const angle = this.phases[index]; x = Math.cos(angle); y = Math.sin(angle); z = Math.sin(angle * .61); distance = 1;
      }
      // A pointer needs a visible wake at a graph scale of roughly a thousand
      // units, not a sub-pixel nudge. Its short lifetime and spring home keep
      // the response playful without permanently unravelling the layout.
      const force = settings.cursor * 900 * Math.pow(1 - distance / range, 2) * dt / distance;
      this.velocity[offset] += x * force; this.velocity[offset + 1] += y * force; this.velocity[offset + 2] += z * force;
    }
    return true;
  }

  step(delta, settings, running = true) {
    const started = performance.now();
    const dt = clamp(delta || 1 / 60, 1 / 180, 1 / 24);
    const pointerActive = this.pointer && this.pointer.life > 0;
    if (!running && !pointerActive) { this.lastStepMs = 0; return false; }
    if (running) this.time += dt * settings.speed;
    const forming = this.formation !== null;
    if (forming) this.formation.elapsed += dt;
    // Layout forces do not need to be recomputed for every camera frame. A
    // 24 Hz force cadence feeds the same velocity field into the 60 Hz visual
    // integrator, avoiding the old all-bodies-per-frame performance cliff.
    this.forceAccumulator += dt;
    if (this.forceAccumulator >= 1 / 24) {
      const forceDt = Math.min(this.forceAccumulator, .1);
      this.forceAccumulator = 0;
      this.applyLinks(settings, forceDt);
      this.applyRepulsion(settings, forceDt);
    }
    const stirred = this.applyPointer(settings, dt);
    const damping = Math.exp(-4.8 * dt), basePull = running ? .55 + settings.center * 2.25 : .42;
    for (let index = 0; index < this.count; index++) {
      const offset = index * 3, target = this.formationTarget(index, this.motionTarget(index, settings));
      if (forming) {
        // Formation is deliberately an authored visual sequence: it needs to
        // gather decisively at the centre, then visibly resolve into a shape.
        // The normal spring field resumes immediately after the last frame.
        const follow = 1 - Math.exp(-18 * dt);
        this.velocity[offset] = (target.x - this.positions[offset]) / dt;
        this.velocity[offset + 1] = (target.y - this.positions[offset + 1]) / dt;
        this.velocity[offset + 2] = (target.z - this.positions[offset + 2]) / dt;
        this.positions[offset] += (target.x - this.positions[offset]) * follow;
        this.positions[offset + 1] += (target.y - this.positions[offset + 1]) * follow;
        this.positions[offset + 2] += (target.z - this.positions[offset + 2]) * follow;
        continue;
      }
      // Cohesion changes how firmly a child returns to its routed community;
      // it does not remap the named layout into a different silhouette.
      const cohesion = Number.isFinite(settings.cohesion) ? settings.cohesion : 1;
      const pull = basePull * (this.roots[index] === index ? 1 : .45 + cohesion * .55);
      this.velocity[offset] = (this.velocity[offset] + (target.x - this.positions[offset]) * pull * dt) * damping;
      this.velocity[offset + 1] = (this.velocity[offset + 1] + (target.y - this.positions[offset + 1]) * pull * dt) * damping;
      this.velocity[offset + 2] = (this.velocity[offset + 2] + (target.z - this.positions[offset + 2]) * pull * dt) * damping;
      this.positions[offset] += this.velocity[offset] * dt;
      this.positions[offset + 1] += this.velocity[offset + 1] * dt;
      this.positions[offset + 2] += this.velocity[offset + 2] * dt;
    }
    if (forming && this.formationProgress >= 1) this.formation = null;
    this.lastStepMs = performance.now() - started;
    return running || stirred;
  }
}
