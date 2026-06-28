// 公共：index ↔ 纹素 uv（备用，当前 shader 直接用 vUv/aUv）
vec2 indexToUV(float index, float texSize) {
  float tx = mod(index, texSize);
  float ty = floor(index / texSize);
  return vec2((tx + 0.5) / texSize, (ty + 0.5) / texSize);
}
