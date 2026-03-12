const vertex = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/* cspell:words highp fract specl conv Blinn Phong artefacts heightfield
   Smooth grain bump-map (value noise), static surface, animated light. */
const fragment = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_origin;
uniform vec3 u_color;
uniform float u_expand;
uniform float u_opacity;
uniform float u_time;

out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Bilinear value noise — smooth, no rectangular artefacts
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Two-octave FBM for richer micro-surface
float height(vec2 p) {
  return noise(p) * 0.65 + noise(p * 2.3 + 5.1) * 0.35;
}

void main() {
  vec2 res = max(u_resolution, vec2(1.0));
  vec2 px = gl_FragCoord.xy;
  float uvx = px.x / res.x;
  float uvy = px.y / res.y;

  vec2 originPx = u_origin * res;
  float dist = length(px - originPx);
  float d00 = length(originPx);
  float d10 = length(originPx - vec2(res.x, 0.0));
  float d01 = length(originPx - vec2(0.0, res.y));
  float d11 = length(originPx - vec2(res.x, res.y));
  float maxRadius = max(max(d00, d10), max(d01, d11)) + 1.0;
  float radius = u_expand * maxRadius;
  float edge = 2.0;
  float mask = 1.0 - smoothstep(radius - edge, radius, dist);

  if (mask < 0.001) { discard; }

  // Sample heightfield at pixel-level steps for normal derivation
  float sc = 0.28;
  float h  = height(px * sc);
  float hR = height((px + vec2(1.0, 0.0)) * sc);
  float hU = height((px + vec2(0.0, 1.0)) * sc);

  // Tangent-space normal from gradient
  vec3 N = normalize(vec3(-(hR - h) * 5.5, -(hU - h) * 5.5, 1.0));

  // Light sweeps in XY; low z makes it grazing — dramatic shadows
  float lx = cos(u_time * 2.2) * 1.1;
  float ly = sin(u_time * 2.2) * 0.65;
  vec3 L = normalize(vec3(lx, ly, 0.65));

  float diff = max(dot(N, L), 0.0);

  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float specl = pow(max(dot(N, H), 0.0), 22.0);

  // Vertical convexity (button looks rounded top-to-bottom)
  float conv = 1.0 - pow(2.0 * abs(uvy - 0.5), 1.8);

  vec3 rgb = u_color * (0.52 + 0.40 * diff + 0.06 * conv) + vec3(0.16) * specl;

  outColor = vec4(rgb, mask * u_opacity);
}
`;

export const SparkleShaders = { fragment, vertex };
