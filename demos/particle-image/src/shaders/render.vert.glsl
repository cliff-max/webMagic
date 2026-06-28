attribute vec2 aUv;        // 该粒子对应 GPGPU 纹素 uv
attribute vec3 aColor;
uniform sampler2D tPosition;
uniform float uSize;
varying vec3 vColor;

void main() {
  vec3 pos = texture2D(tPosition, aUv).xyz;
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (300.0 / -mv.z);   // 透视点大小
  gl_Position = projectionMatrix * mv;
}
