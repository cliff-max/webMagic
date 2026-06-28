// GPGPU：计算速度。vUv 由 GPUComputationRenderer 内置 passthrough vertex 提供。
uniform sampler2D tPosition;   // 当前位置（ping-pong，自动绑定）
uniform sampler2D tVelocity;   // 当前速度（ping-pong，自动绑定）
uniform sampler2D tOrigin;     // 原始位置（常量 DataTexture）
uniform vec3  uMouse;
uniform float uMouseActive;
uniform float uDelta;
uniform float uInteractionRadius;
uniform float uInteractionStrength;
uniform float uReturnSpeed;
uniform float uDamping;

void main() {
  vec3 pos    = texture2D(tPosition, vUv).xyz;
  vec3 origin = texture2D(tOrigin,   vUv).xyz;
  vec3 vel    = texture2D(tVelocity, vUv).xyz;

  // 鼠标排斥：靠近时沿(粒子→鼠标)反向被推开
  vec3 toMouse = pos - uMouse;
  float d = length(toMouse);
  vec3 repulsion = vec3(0.0);
  if (uMouseActive > 0.5 && d < uInteractionRadius && d > 1e-4) {
    float falloff = 1.0 - d / uInteractionRadius;
    repulsion = normalize(toMouse) * uInteractionStrength * falloff * falloff;
  }

  // 弹簧恢复：拉回原始位置
  vec3 spring = (origin - pos) * uReturnSpeed;

  // 惯性 + 阻尼 + 弹性
  vel = (vel + (spring + repulsion) * uDelta) * uDamping;
  gl_FragColor = vec4(vel, 1.0);
}
