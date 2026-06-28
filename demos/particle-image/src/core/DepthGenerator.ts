import type { ParticleData } from './ParticleGenerator'

/**
 * 根据像素亮度生成 z 深度：brightness=(r+g+b)/3，中心化后乘 depthScale。
 * 亮部靠前(z>0)、暗部靠后(z<0)。原地写入 positions.z。
 * 独立函数：未来可整体替换为 AI 深度图 / 真实 Depth Map（保持签名不变）。
 */
export function applyDepth(particles: ParticleData, depthScale: number): void {
  const { positions, colors, count } = particles
  for (let i = 0; i < count; i++) {
    const r = colors[i * 3]
    const g = colors[i * 3 + 1]
    const b = colors[i * 3 + 2]
    const brightness = (r + g + b) / 3
    positions[i * 3 + 2] = (brightness - 0.5) * depthScale
  }
}
