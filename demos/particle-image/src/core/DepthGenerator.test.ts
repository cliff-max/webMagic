import { describe, it, expect } from 'vitest'
import { generateParticles } from './ParticleGenerator'
import { applyDepth } from './DepthGenerator'

function fakeImage(w: number, h: number, fill: [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = fill[0]
    data[i * 4 + 1] = fill[1]
    data[i * 4 + 2] = fill[2]
    data[i * 4 + 3] = 255
  }
  return { data, width: w, height: h } as ImageData
}

describe('applyDepth', () => {
  it('亮部 z>0、暗部 z<0、随 depthScale 缩放', () => {
    const img = fakeImage(4, 4, [255, 255, 255])
    const p = generateParticles(img, 1)
    applyDepth(p, 40)
    // 纯白 brightness≈1 → z = (1-0.5)*40 = 20
    expect(p.positions[2]).toBeCloseTo(20, 1)
  })
  it('纯黑 z<0', () => {
    const img = fakeImage(4, 4, [0, 0, 0])
    const p = generateParticles(img, 1)
    applyDepth(p, 40)
    expect(p.positions[2]).toBeLessThan(0)
  })
  it('中性灰（r=g=b=128）z ≈ 0', () => {
    const img = fakeImage(4, 4, [128, 128, 128])
    const p = generateParticles(img, 1)
    applyDepth(p, 40)
    // brightness ≈ 0.502 → z = (0.502-0.5)*40 ≈ 0.08，接近 0
    expect(p.positions[2]).toBeCloseTo(0, 0)
  })
})
