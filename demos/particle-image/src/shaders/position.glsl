// GPGPU：位置积分。uv 由 resolution + gl_FragCoord 派生。
// tPosition / tVelocity 由 GPUComputationRenderer 根据 setVariableDependencies 自动注入，无需手动声明。
uniform float uDelta;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(tPosition, uv).xyz + texture2D(tVelocity, uv).xyz * uDelta;
  gl_FragColor = vec4(pos, 1.0);
}
