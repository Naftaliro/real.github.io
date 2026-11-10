// mitchellberg.org
// flavor switcher and the wallpaper. that's it.
(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ── catppuccin flavors ───────────────────────────── */
  // no saved pick: latte if your system is in light mode, mocha otherwise (set in the <head>)

  const FLAVORS = ['mocha', 'macchiato', 'frappe', 'latte'];
  const PRETTY = { mocha: 'mocha', macchiato: 'macchiato', frappe: 'frappé', latte: 'latte' };
  let flavor = FLAVORS.includes(root.dataset.flavor) ? root.dataset.flavor : 'mocha';

  function setFlavor(f, save) {
    flavor = f;
    root.dataset.flavor = f;
    $$('.flavor-name').forEach(el => { el.textContent = PRETTY[f]; });
    $('#flavor')?.setAttribute('aria-label', `catppuccin flavor: ${PRETTY[f]}. click to switch`);
    const base = getComputedStyle(root).getPropertyValue('--base').trim();
    $('meta[name="theme-color"]')?.setAttribute('content', base);
    if (save) { try { localStorage.setItem('flavor', f); } catch {} }
    wall.build();
  }
  const nextFlavor = () => setFlavor(FLAVORS[(FLAVORS.indexOf(flavor) + 1) % FLAVORS.length], true);
  $('#flavor')?.addEventListener('click', nextFlavor);
  addEventListener('keydown', e => {
    if (e.key !== 't' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    nextFlavor();
  });

  /* ── wallpaper ────────────────────────────────────── */
  // the prairie from 3hz.dev (night) and naftaliro.dev (sunset), but in the daytime:
  // blue sky, a few clouds, green grass. the dark flavors get sunrise instead.
  // drawn once, nothing moves.

  const wall = (() => {
    const canvas = $('#wall');
    if (!canvas) return { build() {} };
    const ctx = canvas.getContext('2d');
    const P = {};
    let W = 0;

    const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
    const HOVER = ['#...........#', '##.........##', '.##.......##.', '..###.#.###..', '....#####....', '.....###.....', '.....###.....', '....##.##....'];
    const PERCH = ['.##..', '###..', '.###.', '.###.', '.####', '..###', '...#.', '...#.'];
    const CLOUD = ['.....####......', '...########....', '.############..', '###############'];

    const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const css = c => `rgb(${c[0]},${c[1]},${c[2]})`;
    function rng(seed) {
      return () => {
        seed |= 0; seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    function sprite(rows, x0, y0, color) {
      ctx.fillStyle = css(color);
      rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') ctx.fillRect(x0 + x, y0 + y, 1, 1); });
    }

    function build() {
      const cs = getComputedStyle(root);
      ['crust', 'mantle', 'base', 'surface0', 'surface1', 'surface2', 'overlay0', 'overlay1', 'overlay2', 'lavender', 'blue', 'peach']
        .forEach(k => { P[k] = hex(cs.getPropertyValue('--' + k).trim()); });
      const day = flavor === 'latte';
      // latte's accents are darkened for text contrast, so the scenery uses the original pastels
      const GRASS = hex('#40a02b'), SKY = hex('#04a5e5'), SUN = hex('#df8e1d'), WHITE = [255, 255, 255];

      const scale = innerWidth < 720 ? 3 : 4;
      W = Math.ceil(innerWidth / scale);
      const H = Math.ceil(Math.max(innerHeight, canvas.clientHeight || 0) / scale);
      canvas.width = W;
      canvas.height = H;

      const rand = rng(11);
      const img = ctx.createImageData(W, H);
      const d = img.data;
      const put = (x, y, c) => { const i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; };

      // the side margins are wherever the page column isn't
      const pageW = $('.page')?.getBoundingClientRect().width || 960;
      const margin = (innerWidth - pageW) / 2 / scale;
      const roomy = margin > 24;
      const horizon = Math.round(H * 0.8);

      // sky
      const stops = day
        ? [[0, mix(P.base, SKY, 0.22)], [0.45, mix(P.base, SKY, 0.12)], [0.8, mix(P.base, SKY, 0.05)], [1, mix(P.base, WHITE, 0.4)]]
        : [[0, P.crust], [0.4, P.mantle], [0.7, mix(P.base, P.blue, 0.1)], [0.9, mix(P.base, P.lavender, 0.14)], [1, mix(P.base, P.peach, 0.22)]];
      for (let y = 0; y < H; y++) {
        const t = Math.min(y / horizon, 1);
        let s = 0;
        while (s < stops.length - 2 && t > stops[s + 1][0]) s++;
        const [p0, c0] = stops[s], [p1, c1] = stops[s + 1];
        const k = (t - p0) / (p1 - p0);
        for (let x = 0; x < W; x++) put(x, y, k > BAYER[(y & 3) * 4 + (x & 3)] ? c1 : c0);
      }

      // the sun: high up on the left in the daytime, just coming up on the left at sunrise
      if (roomy) {
        const sx = Math.round(margin * 0.45), sy = day ? Math.round(H * 0.16) : horizon - 4, sr = day ? 7 : 8;
        const sun = day ? mix(SUN, WHITE, 0.45) : mix(P.base, mix(P.peach, SUN, 0.3), 0.5);
        for (let y = sy - sr - 2; y <= sy + sr + 2; y++) for (let x = sx - sr - 2; x <= sx + sr + 2; x++) {
          if (x < 0 || x >= W || y < 0 || y >= H) continue;
          const dist = Math.hypot(x - sx, y - sy) - sr;
          if (dist < 0 || (dist < 2 && dist / 2 < BAYER[(y & 3) * 4 + (x & 3)])) put(x, y, sun);
        }
      }

      // the last few stars (sunrise only)
      if (!day) {
        const n = Math.round(W * horizon / 1400);
        for (let i = 0; i < n; i++) {
          const x = Math.floor(rand() * W), y = Math.floor(Math.pow(rand(), 2) * horizon * 0.35);
          put(x, y, rand() < 0.3 ? P.overlay1 : P.overlay0);
        }
      }

      // hills, same shapes as the other two sites
      const ph = [rand() * 9, rand() * 9, rand() * 9, rand() * 9];
      const far = day ? mix(P.surface0, GRASS, 0.18) : mix(P.surface0, P.base, 0.25);
      const mid = day ? mix(P.surface0, GRASS, 0.3) : P.mantle;
      const near = day ? mix(P.surface1, GRASS, 0.38) : P.crust;
      const farY = x => horizon - 4 - Math.round(Math.sin(x * 0.011 + ph[0]) * 4 + Math.sin(x * 0.037 + ph[1]) * 2 + Math.abs(Math.sin(x * 0.29 + ph[2])) * 3);
      const midY = x => horizon + 3 + Math.round(Math.sin(x * 0.008 + ph[3]) * 2);
      const nearY = x => Math.round(H * 0.93 + Math.sin(x * 0.02 + ph[1]) * 2);
      for (let x = 0; x < W; x++) {
        for (let y = Math.max(farY(x), 0); y < H; y++) put(x, y, far);
        for (let y = midY(x); y < H; y++) put(x, y, mid);
        for (let y = nearY(x); y < H; y++) put(x, y, near);
        if (rand() < 0.45) {
          const h = 1 + Math.floor(rand() * 3);
          for (let k = 1; k <= h; k++) if (nearY(x) - k >= 0) put(x, nearY(x) - k, near);
        }
      }
      ctx.putImageData(img, 0, 0);

      // clouds (daytime)
      if (day) {
        const cloud = mix(P.base, WHITE, 0.75);
        const n = Math.max(3, Math.round(W / 70));
        for (let i = 0; i < n; i++) sprite(CLOUD, Math.floor(rand() * W) - 7, Math.floor(H * (0.08 + rand() * 0.35)), cloud);
      }

      // power line
      const ink = day ? P.overlay1 : P.crust;
      const wireC = day ? mix(P.overlay0, P.base, 0.3) : mix(P.crust, P.surface0, 0.6);
      const gapX = 110, poleH = 30;
      const poles = [];
      for (let x = 14 - Math.round(ph[0] * 6); x < W + gapX; x += gapX) poles.push(x);
      ctx.fillStyle = css(ink);
      poles.forEach(x => {
        const g = midY(x);
        ctx.fillRect(x, g - poleH, 2, poleH);
        ctx.fillRect(x - 5, g - poleH + 2, 12, 1);
        ctx.fillRect(x - 5, g - poleH + 1, 1, 1);
        ctx.fillRect(x + 6, g - poleH + 1, 1, 1);
      });
      const wire = [];
      ctx.fillStyle = css(wireC);
      for (let i = 0; i < poles.length - 1; i++) {
        const a = poles[i], b = poles[i + 1];
        for (const off of [-5, 6]) {
          const ya = midY(a) - poleH + 1, yb = midY(b) - poleH + 1;
          for (let x = a + off; x < b + off; x++) {
            const u = (x - a - off) / gapX;
            const y = Math.round(ya + (yb - ya) * u + 5 * 4 * u * (1 - u));
            ctx.fillRect(x, y, 1, 1);
            if (off === 6) wire[x] = y;
          }
        }
      }

      // the kestrels, in the margins where the page doesn't cover them
      if (!roomy) return;
      const birdInk = day ? P.overlay2 : P.crust;
      const px = Math.round(W - margin * 0.6);
      if (wire[px] != null) sprite(PERCH, px - 2, wire[px] - 6, birdInk);
      sprite(HOVER, Math.round(W - margin * 0.45), Math.round(H * 0.3), birdInk);
    }

    let resizeT;
    addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        const w = Math.ceil(innerWidth / (innerWidth < 720 ? 3 : 4));
        if (w !== W || Math.abs(innerHeight - canvas.clientHeight) > 120) build();
      }, 150);
    });

    return { build };
  })();

  setFlavor(flavor, false);
})();
