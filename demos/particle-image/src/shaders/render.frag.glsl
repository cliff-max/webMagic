varying vec3 vColor;
uniform float uOpacity;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;                         // 裁成圆，杜绝方块
  float alpha = smoothstep(0.5, 0.38, d);       // 柔和抗锯齿边缘
  gl_FragColor = vec4(vColor, alpha * uOpacity);
}
