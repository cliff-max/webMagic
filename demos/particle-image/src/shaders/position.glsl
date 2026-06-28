// GPGPU：位置积分。vUv 由 GPUComputationRenderer 内置提供。
uniform sampler2D tPosition;
uniform sampler2D tVelocity;
uniform float uDelta;

void main() {
  vec3 pos = texture2D(tPosition, vUv).xyz + texture2D(tVelocity, vUv).xyz * uDelta;
  gl_FragColor = vec4(pos, 1.0);
}
