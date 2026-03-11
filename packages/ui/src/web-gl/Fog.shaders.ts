// cspell:words vanta lowlight midtone patricio highp fract
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

export const FogShaders = { fragment, vertex };
