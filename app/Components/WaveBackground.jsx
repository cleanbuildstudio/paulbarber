"use client";

/**
 * Monochrome dotted "breathing wave" background.
 * - Fixed full-screen WebGL canvas behind the whole page.
 * - Wave direction per section: data-wave-angle="225" (top right -> bottom left) or "315" (top left -> bottom right).
 *   If no attributes are found, top-level <section> elements are used and alternate 225 / 315 automatically.
 * - Hovering an element matching `rowSelector` pulls the band toward it.
 * Props: look ("light" | "dark"), sectionSelector, rowSelector, cursor (false), animateOnTouch (true)
 */
import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float u_time;
uniform float u_dpr;
uniform float u_angle;
uniform float u_theme;
uniform float u_scroll;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform vec4 u_fx;      // organic, print, cursor, row pull
uniform vec3 u_hover;   // y = hovered row height (0..1), z = strength
uniform vec3 u_trail[10]; // cursor trail: x, y (0..1), strength

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(7.1, 3.7);
    a *= 0.5;
  }
  return v / 0.875;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  vec2 dir = vec2(cos(u_angle), sin(u_angle));
  vec2 perp = vec2(-dir.y, dir.x);
  float s = dot(p, dir);
  float q = dot(p, perp);

  float sinWob = 0.09 * sin(q * 3.2 + u_time * 0.35) + 0.045 * cos(q * 5.6 - u_time * 0.27);
  float nz = fbm(vec2(q * 1.5, s * 0.7) + vec2(u_time * 0.05, -u_time * 0.04));
  float nzWob = (nz - 0.5) * 0.22;
  float sw = s + mix(sinWob, nzWob, u_fx.x);

  // 4-second rhythmic breathing cycle (2 * PI / 4.0 = 1.5708 rad/s)
  float breath = 0.5 + 0.5 * sin(u_time * 1.5708);

  // Dynamic diagonal travelling wave: wavelength scales to the viewport
  float extent = abs(dir.x) * aspect + abs(dir.y);
  float k = 3.0 * 1.35 / max(extent, 0.55);
  float ph = sw * k - u_time * 0.85;

  // Wave envelope: smooth, organic travelling wave band
  float gSin = smoothstep(0.25, 0.95, 0.5 + 0.5 * sin(ph));
  float x = fract(ph / 6.28318);
  float gPrint = smoothstep(0.18, 0.78, x) * (1.0 - smoothstep(0.78, 0.92, x));
  float g = mix(gSin, gPrint, u_fx.y) * (0.68 + 0.32 * breath);

  // Interactive mouse breathing: localized breathing aura wherever the cursor moves
  vec2 m = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);
  float mDist = distance(p, m);
  float mZone = smoothstep(0.38, 0.0, mDist);
  float mouseBreath = 0.5 + 0.5 * sin(u_time * 1.5708 - mDist * 5.5);
  float mouseSwell = mZone * (0.35 + 0.65 * mouseBreath);

  // Cursor trail wake
  float swell = 0.0;
  for (int i = 0; i < 10; i++) {
    vec3 t = u_trail[i];
    vec2 tp = vec2((t.x - 0.5) * aspect, t.y - 0.5);
    swell += t.z * smoothstep(0.20, 0.0, distance(p, tp));
  }
  swell = min(swell, 1.0);

  // Row hover pull
  vec2 d = vec2((uv.x - 0.40) / 0.55, (uv.y - u_hover.y) / 0.085);
  float rowS = exp(-dot(d, d)) * u_hover.z * u_fx.w;

  // Total wave + interactive mouse breathing swell:
  // Wave breathes across the screen; mouse adds its own localized breathing aura wherever it goes
  float combinedG = clamp(g + mouseSwell * 0.85 + swell * 0.45 + rowS * 0.8, 0.0, 1.0);

  // Monolog-style Halftone Dot Grid: pristine 45° rotation with exact alignment (no random jitter)
  float cell = 3.6 * u_dpr;
  mat2 rot = mat2(0.70710678, -0.70710678, 0.70710678, 0.70710678);
  vec2 sc = (rot * frag) / cell;
  vec2 cp = fract(sc) - 0.5;

  // Razor-sharp anti-aliased circular dots (crisp 1px falloff like luxury print)
  float aa = 0.85 / cell;
  float maxRadius = mix(0.36, 0.46, breath);
  float radius = mix(0.04, maxRadius, combinedG);
  float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, length(cp));

  // Colors: #111111 background and #000000 pure black dots
  vec3 darkBg = vec3(17.0 / 255.0);        // #111111
  vec3 darkDot = vec3(0.0);                 // #000000 pure black
  vec3 lightBg = vec3(0.925, 0.92, 0.895); // Off-white paper
  vec3 lightDot = vec3(0.05);              // Near black dots

  vec3 bg = mix(darkBg, lightBg, u_theme);
  vec3 dotc = mix(darkDot, lightDot, u_theme);

  // Clean canvas (tinted background band removed)
  vec3 col = bg;
  // Halftone wave: dots smoothly swell and breathe
  float dotOpacity = mix(0.80, 1.0, breath);
  col = mix(col, dotc, dotMask * combinedG * dotOpacity);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function WaveBackground({
  look = "dark",
  sectionSelector = "[data-wave-angle]",
  rowSelector = "[data-wave-row]",
  cursor = true,
  animateOnTouch = true,
}) {
  const ref = useRef(null);
  const propsRef = useRef({ look, cursor });
  propsRef.current = { look, cursor };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl", {
        powerPreference: "high-performance",
        alpha: false,
        antialias: false,
      }) || canvas.getContext("experimental-webgl");
    if (!gl || gl.isContextLost()) return; // no WebGL: the page keeps its plain background

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Animate continuously on all devices unless user explicitly enabled prefers-reduced-motion
    const animated = !reduce;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(s);
        if (info) console.error(info);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(prog);
      if (info) console.error(info);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const uTime = U("u_time"),
      uRes = U("u_res"),
      uDpr = U("u_dpr"),
      uAngle = U("u_angle");
    const uTheme = U("u_theme"),
      uMouse = U("u_mouse"),
      uScroll = U("u_scroll");
    const uFx = U("u_fx"),
      uHover = U("u_hover"),
      uTrail = U("u_trail[0]");

    // ---- state ----
    let dpr = 1;
    let angle = 0,
      theme = propsRef.current.look === "light" ? 1 : 0;
    let clock = 4.0,
      last = 0,
      running = false,
      raf = 0;
    const mouse = { x: -10.0, y: -10.0, tx: -10.0, ty: -10.0 };
    const fxT = {
      organic: 1,
      print: 1,
      cursor: propsRef.current.cursor ? 1 : 0,
      scroll: 1,
      pull: 1,
    };
    const fxC = { ...fxT };
    const TRAIL = 10;
    const trail = new Float32Array(TRAIL * 3);
    let trailHead = 0,
      lastTx = -1,
      lastTy = -1;
    let scrollY0 = window.scrollY,
      scrollVel = 0,
      boost = 0;
    const hover = { y: 0.5, s: 0, ts: 0 };

    // ---- sections drive the wave direction ----
    let sections = [];
    let angles = [];
    let tops = [];
    const measure = () => {
      let found = Array.from(document.querySelectorAll(sectionSelector));
      if (!found.length) {
        // no attributes added: use the page's top-level <section> elements, in order
        found = Array.from(document.querySelectorAll("section")).filter(
          (el) => !el.parentElement?.closest("section")
        );
      }
      sections = found;
      angles = sections.map((el, i) => {
        const attr = el.getAttribute("data-wave-angle");
        const deg = attr ? parseFloat(attr) : i % 2 === 0 ? 225 : 315;
        return (deg * Math.PI) / 180;
      });
      tops = sections.map((el) => el.getBoundingClientRect().top + window.scrollY);
    };
    const smooth = (a, b, x) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    const targetAngle = () => {
      if (!sections.length) return (225 * Math.PI) / 180;
      const vh = window.innerHeight;
      const y = window.scrollY + vh * 0.5;
      let a = angles[0];
      for (let i = 0; i < sections.length - 1; i++) {
        a +=
          (angles[i + 1] - angles[i]) *
          smooth(tops[i + 1] - vh * 0.4, tops[i + 1] + vh * 0.4, y);
      }
      return a;
    };

    const draw = (t) => {
      gl.uniform1f(uTime, t);
      gl.uniform1f(uAngle, angle);
      gl.uniform1f(uTheme, theme);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, boost * fxC.scroll);
      gl.uniform4f(uFx, fxC.organic, fxC.print, fxC.cursor, fxC.pull);
      gl.uniform3f(uHover, 0, hover.y, hover.s);
      gl.uniform3fv(uTrail, trail);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const resize = () => {
      dpr = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDpr, dpr);
      measure();
      angle = targetAngle();
      draw(clock);
    };

    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      const sy = window.scrollY;
      scrollVel += (Math.abs(sy - scrollY0) - scrollVel) * 0.15;
      scrollY0 = sy;
      boost = Math.min(1, scrollVel / 40);
      clock += dt * (1 + 0.35 * boost * fxC.scroll);
      fxT.cursor = propsRef.current.cursor ? 1 : 0;
      Object.keys(fxT).forEach((k) => {
        fxC[k] += (fxT[k] - fxC[k]) * 0.12;
      });
      for (let i = 0; i < TRAIL; i++) trail[i * 3 + 2] *= 0.955;
      hover.s += (hover.ts - hover.s) * 0.1;
      angle += (targetAngle() - angle) * 0.07;
      theme += ((propsRef.current.look === "light" ? 1 : 0) - theme) * 0.1;
      if (mouse.tx > -5.0) {
        mouse.x += (mouse.tx - mouse.x) * 0.12;
        mouse.y += (mouse.ty - mouse.y) * 0.12;
      }
      draw(clock);
    };

    const loop = (now) => {
      if (!running) return;
      step(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || !animated || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // ---- events ----
    const onMove = (e) => {
      if (coarse) return;
      const nx = e.clientX / window.innerWidth;
      const ny = 1 - e.clientY / window.innerHeight;
      if (mouse.tx < -5.0) {
        mouse.x = nx;
        mouse.y = ny;
      }
      mouse.tx = nx;
      mouse.ty = ny;
      const dx = (mouse.tx - lastTx) * (window.innerWidth / window.innerHeight);
      const dy = mouse.ty - lastTy;
      if (lastTx < 0 || dx * dx + dy * dy > 0.0004) {
        trail[trailHead * 3] = mouse.tx;
        trail[trailHead * 3 + 1] = mouse.ty;
        trail[trailHead * 3 + 2] = 1;
        trailHead = (trailHead + 1) % TRAIL;
        lastTx = mouse.tx;
        lastTy = mouse.ty;
      }
    };

    const onOver = (e) => {
      const row = e.target?.closest?.(rowSelector);
      if (!row) return;
      const r = row.getBoundingClientRect();
      hover.y = 1 - (r.top + r.height / 2) / window.innerHeight;
      hover.ts = 1;
    };

    const onOut = (e) => {
      const row = e.target?.closest?.(rowSelector);
      if (row && !row.contains(e.relatedTarget)) hover.ts = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    let staticRaf = 0;
    const onScrollStatic = () => {
      cancelAnimationFrame(staticRaf);
      staticRaf = requestAnimationFrame(() => {
        angle = targetAngle();
        theme = propsRef.current.look === "light" ? 1 : 0;
        draw(clock);
      });
    };

    resize();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    window.addEventListener("resize", resize);
    window.addEventListener("load", resize);
    if (animated) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
      document.addEventListener("visibilitychange", onVisibility);
      start();
    } else {
      window.addEventListener("scroll", onScrollStatic, { passive: true });
    }

    return () => {
      stop();
      cancelAnimationFrame(staticRaf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScrollStatic);
      if (buf) gl.deleteBuffer(buf);
      if (prog) {
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        gl.deleteProgram(prog);
      }
    };
  }, [sectionSelector, rowSelector, animateOnTouch]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
