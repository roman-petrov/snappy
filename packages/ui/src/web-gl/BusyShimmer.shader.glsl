#version 300 es
// cspell:words highp fract
precision highp float;

in vec2 v_uv;

uniform float u_time;
uniform float u_accentAlpha;

out vec4 outColor;

// HSV hue → saturated RGB
vec3 hue2rgb(float h) {
  return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
}

float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;

  vec3 colorSum = vec3(0.0);
  float weightSum = 0.0;

  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float t = u_time * (1.2 + hash(fi * 7.13) * 0.6);
    float phase = fi * 0.7854; // 2π/8 — evenly spaced

    vec2 center = vec2(
      0.5 + sin(t + phase) * 0.32,
      0.5 + cos(t * 0.72 + phase * 1.1) * 0.28
    );

    float d2 = dot(uv - center, uv - center);
    float w = exp(-d2 / 0.22); // gaussian blur, r ≈ 0.33

    float hue = fi / 8.0 + u_time * 0.15;
    colorSum += w * hue2rgb(hue);
    weightSum += w;
  }

  vec3 color = colorSum / max(weightSum, 0.001);

  // Boost saturation
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = clamp(mix(vec3(lum), color, 1.6), 0.0, 1.0);

  float alpha = u_accentAlpha * min(1.0, weightSum * 0.5);
  outColor = vec4(color * alpha, alpha);
}
