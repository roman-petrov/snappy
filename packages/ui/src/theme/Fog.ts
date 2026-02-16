// cspell:words vanta lowlight midtone patricio highp fract
/* eslint-disable no-bitwise */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */

/***********************************/
/* ☁️ Based on Vanta.js FOG effect */
/************************************/

export type FogOptions = {
  baseColor?: number;
  blurFactor?: number;
  highlightColor?: number;
  lowlightColor?: number;
  midtoneColor?: number;
  speed?: number;
  zoom?: number;
};

const vertex = `#version 300 es
in vec2 a_uv;
out vec2 v_uv;
void main() {
  v_uv = a_uv;
  gl_Position = vec4(2.0 * a_uv - 1.0, 0.0, 1.0);
}
`;

// Vanta FOG–style fragment: FBM noise + color mixing (from Book of Shaders / Patricio Gonzalez Vivo)
const fragment = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_blurFactor;
uniform float u_zoom;
uniform vec3 u_baseColor;
uniform vec3 u_lowlightColor;
uniform vec3 u_midtoneColor;
uniform vec3 u_highlightColor;
in vec2 v_uv;
out vec4 outColor;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(0.129898, 0.78233))) * 437.585453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

const int NUM_OCTAVES = 6;

float fbm(vec2 st) {
  float v = 0.0;
  float a = u_blurFactor;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < NUM_OCTAVES; i++) {
    v += a * noise(st);
    st = rot * st * 2.0 + shift;
    a *= (1.0 - u_blurFactor);
  }
  return v;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution * 3.0;
  st.x *= 0.7 * u_resolution.x / u_resolution.y;
  st *= u_zoom;

  vec3 color = vec3(0.0);
  vec2 q = vec2(0.0);
  q.x = fbm(st + 0.00 * u_time);
  q.y = fbm(st + vec2(1.0));

  vec2 dir = vec2(0.15, 0.126);
  vec2 r = vec2(0.0);
  r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + dir.x * u_time);
  r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + dir.y * u_time);

  float f = fbm(st + r);

  color = mix(u_baseColor, u_lowlightColor, clamp((f * f) * 4.0, 0.0, 1.0));
  color = mix(color, u_midtoneColor, clamp(length(q), 0.0, 1.0));
  color = mix(color, u_highlightColor, clamp(abs(r.x), 0.0, 1.0));

  vec3 finalColor = mix(u_baseColor, color, f * f * f + 0.6 * f * f + 0.5 * f);
  outColor = vec4(finalColor, 1.0);
}
`;

export const Fog = (element: HTMLElement, options: FogOptions = {}) => {
  const byteMask = 0xff;

  const hexToRgb = (hex: number): [number, number, number] => [
    ((hex >> 16) & byteMask) / byteMask,
    ((hex >> 8) & byteMask) / byteMask,
    (hex & byteMask) / byteMask,
  ];

  const defaultOptions: Required<
    Pick<
      FogOptions,
      `baseColor` | `blurFactor` | `highlightColor` | `lowlightColor` | `midtoneColor` | `speed` | `zoom`
    >
  > = {
    baseColor: 0x0a_0a_0c,
    blurFactor: 0.6,
    highlightColor: 0x1a_3d_42,
    lowlightColor: 0x0a_0a_0c,
    midtoneColor: 0x0d_1f_22,
    speed: 1,
    zoom: 1.2,
  };

  const config = { ...defaultOptions, ...options };

  const createShader = (gl: WebGL2RenderingContext, type: number, source: string): undefined | WebGLShader => {
    const shader = gl.createShader(type);
    if (shader === null) {
      return undefined;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
  };

  const createProgram = (gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram => {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    return program;
  };

  const effectRef = { current: undefined as undefined | { destroy: () => void } };

  const start = () => {
    const canvas = document.createElement(`canvas`);
    canvas.setAttribute(`aria-hidden`, `true`);

    const gl = canvas.getContext(`webgl2`, { alpha: false, antialias: false });
    if (gl === null) {
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertex);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragment);
    if (vs === undefined || fs === undefined) {
      if (vs !== undefined) {
        gl.deleteShader(vs);
      }
      if (fs !== undefined) {
        gl.deleteShader(fs);
      }

      return;
    }

    const program = createProgram(gl, vs, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    element.append(canvas);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);

    const uvLoc = gl.getAttribLocation(program, `a_uv`);
    const uResolution = gl.getUniformLocation(program, `u_resolution`);
    const uTime = gl.getUniformLocation(program, `u_time`);
    const uBlurFactor = gl.getUniformLocation(program, `u_blurFactor`);
    const uZoom = gl.getUniformLocation(program, `u_zoom`);
    const uBaseColor = gl.getUniformLocation(program, `u_baseColor`);
    const uLowlightColor = gl.getUniformLocation(program, `u_lowlightColor`);
    const uMidtoneColor = gl.getUniformLocation(program, `u_midtoneColor`);
    const uHighlightColor = gl.getUniformLocation(program, `u_highlightColor`);
    const baseRgb = hexToRgb(config.baseColor);
    const lowlightRgb = hexToRgb(config.lowlightColor);
    const midtoneRgb = hexToRgb(config.midtoneColor);
    const highlightRgb = hexToRgb(config.highlightColor);

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      const width = element.clientWidth;
      const height = element.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const state = { rafId: 0, time: 0 };
    const timeStep = 0.01;
    const triangleCount = 6;

    const tick = () => {
      state.time += timeStep * config.speed;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
      if (uResolution !== null) {
        gl.uniform2f(uResolution, canvas.width, canvas.height);
      }
      if (uTime !== null) {
        gl.uniform1f(uTime, state.time);
      }
      if (uBlurFactor !== null) {
        gl.uniform1f(uBlurFactor, config.blurFactor);
      }
      if (uZoom !== null) {
        gl.uniform1f(uZoom, config.zoom);
      }
      if (uBaseColor !== null) {
        gl.uniform3fv(uBaseColor, baseRgb);
      }
      if (uLowlightColor !== null) {
        gl.uniform3fv(uLowlightColor, lowlightRgb);
      }
      if (uMidtoneColor !== null) {
        gl.uniform3fv(uMidtoneColor, midtoneRgb);
      }
      if (uHighlightColor !== null) {
        gl.uniform3fv(uHighlightColor, highlightRgb);
      }
      gl.drawArrays(gl.TRIANGLES, 0, triangleCount);
      state.rafId = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(element);
    state.rafId = requestAnimationFrame(tick);

    const destroy = () => {
      cancelAnimationFrame(state.rafId);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(quadBuffer);
      canvas.remove();
    };

    effectRef.current = { destroy };
  };

  const stop = () => {
    if (effectRef.current !== undefined) {
      effectRef.current.destroy();
      effectRef.current = undefined;
    }
  };

  return { start, stop };
};

export type Fog = ReturnType<typeof Fog>;
