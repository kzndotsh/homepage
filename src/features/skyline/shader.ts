/** WebGL shader for the skyline banner: a night photo, ordered-dithered to four palette colours. */

export const VERTEX =
  'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }'

/** Size of one dither cell, in CSS pixels. */
export const PIXEL = 2

export const FRAGMENT = /* glsl */ `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_pixel;
uniform sampler2D u_tex;
uniform float u_texAspect;
uniform vec3 u_c0;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
// Extra sky above the photo (a share of its height) and the star block size in cells.
uniform float u_lift;
uniform float u_block;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
// 2 x 2 ordered-dither threshold in [0, 1).
float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}
// Smooth 1D value noise in [0, 1].
float vnoise(float x) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash21(vec2(i, 0.5)), hash21(vec2(i + 1.0, 0.5)), f);
}
float bayer4(vec2 a) {
  return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
vec3 palette(float q) {
  if (q < 0.5) return u_c0;
  if (q < 1.5) return u_c1;
  if (q < 2.5) return u_c2;
  return u_c3;
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy / u_pixel);
  vec2 grid = u_res / u_pixel;
  vec2 uv = (cell + 0.5) / grid;
  float aspect = u_res.x / u_res.y;

  // Fit the photo to the banner width, looking at the skyline rather than the lots below it.
  vec2 s = vec2(1.0);
  float ca = aspect / u_texAspect;
  if (ca > 1.0) s.y = 1.0 / ca; else s.x = ca;
  // Zoom in a touch so the window can slide right, which moves the picture left.
  s *= 0.95;
  float y0 = min(0.1, 1.0 - s.y) - u_lift;

  vec3 photo = texture2D(u_tex, vec2((uv.x - 0.5) * s.x + 0.525, y0 + (1.0 - uv.y) * s.y)).rgb;
  float lum = dot(photo, vec3(0.299, 0.587, 0.114));

  // Stars on a jittered grid: one candidate per block (14 x 14 cells, 10 x 10 on a phone) of cells at a
  // random spot inside it (never on the edge), so they spread evenly with no
  // clumps or neighbours. Brightness follows a power law: many dim, few
  // bright. Only the dark sky above the buildings shows them.
  vec2 blk = floor(cell / u_block);
  vec2 inBlk = cell - blk * u_block;
  vec2 pos = floor(1.0 + vec2(hash21(blk + 3.1), hash21(blk + 17.7)) * (u_block - 2.0));
  float exists = step(hash21(blk + 91.3), 0.75);
  float mag = hash21(blk + 33.9);
  float bright = mix(0.25, 1.0, pow(mag, 2.5));
  float twinkle = 0.8 + 0.2 * sin(u_time + mag * 400.0);
  vec2 off = abs(inBlk - pos);
  float core = step(off.x + off.y, 0.5);
  float glint = step(off.x + off.y, 1.5) * step(0.8, bright) * 0.45;
  float stars = exists * max(core, glint) * bright * twinkle;
  // Sky is any pixel with nothing lit above it in its column. Scanning up the
  // photo keeps dark glass inside a tower from counting as sky.
  float lit = 0.0;
  for (int i = 1; i <= 12; i++) {
    float up = y0 + (1.0 - uv.y) * s.y - float(i) * 0.02;
    vec3 c = texture2D(u_tex, vec2((uv.x - 0.5) * s.x + 0.525, max(up, 0.0))).rgb;
    lit = max(lit, step(0.07, dot(c, vec3(0.299, 0.587, 0.114))));
  }
  float sky = (1.0 - lit) * (1.0 - smoothstep(0.03, 0.15, lum));
  stars *= sky * smoothstep(0.1, 0.55, uv.y);

  // Lift the shadows so the buildings read against the sky, then give the sky a
  // dim glow that fades up from the horizon so the roofline stands out.
  // The photo has a faint searchlight beam above the tallest tower. Raising the
  // black level up there drops it to plain sky.
  float photoY = y0 + (1.0 - uv.y) * s.y;
  float black = mix(0.08, 0.05, smoothstep(0.17, 0.3, photoY));
  float v = clamp(pow(max(lum - black, 0.0), 0.62) * 1.3, 0.0, 1.0);
  // Where the glow begins varies along the banner, in broad hills with finer
  // ridges on top, so the dithered haze fades in unevenly like paint running
  // down rather than as one straight line.
  float x = uv.x * aspect;
  float ridge = vnoise(x * 1.6 + u_time * 0.01) * 0.55
    + vnoise(x * 4.5 - 3.0) * 0.3
    + vnoise(x * 13.0 + 7.0) * 0.15;
  float top = 1.0 - 0.5 * ridge;
  float glow = smoothstep(top, top - 0.7, uv.y) * 0.6;
  v = max(max(v, stars), sky * glow);

  float q = clamp(floor(v * 3.0 + bayer4(cell)), 0.0, 3.0);
  gl_FragColor = vec4(palette(q), 1.0);
}
`
