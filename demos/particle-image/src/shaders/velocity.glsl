// GPGPU：计算速度。uv 由 resolution + gl_FragCoord 派生。
// tPosition / tVelocity 由 GPUComputationRenderer 根据 setVariableDependencies 自动注入，无需手动声明。
uniform sampler2D tOrigin;     // 原始位置（常量 DataTexture）
uniform vec3  uMouse;
uniform float uMouseActive;
uniform float uDelta;
uniform float uInteractionRadius;
uniform float uInteractionStrength;
uniform float uReturnSpeed;
uniform float uDamping;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos    = texture2D(tPosition, uv).xyz;
  vec3 origin = texture2D(tOrigin,   uv).xyz;
  vec3 vel    = texture2D(tVelocity, uv).xyz;

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
