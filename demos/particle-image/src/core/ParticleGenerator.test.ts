import { describe, it, expect } from 'vitest'
import { generateParticles } from './ParticleGenerator'

function fakeImage(w: number, h: number, fill: [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = fill[0]; data[i * 4 + 1] = fill[1]; data[i * 4 + 2] = fill[2]; data[i * 4 + 3] = 255
  }
  return { data, width: w, height: h } as ImageData
}

describe('generateParticles', () => {
  it('采样数量 = ceil(W/step) * ceil(H/step)', () => {
    const img = fakeImage(10, 8, [255, 0, 0])
    const r = generateParticles(img, 2)
    expect(r.count).toBe(5 * 4) // ceil(10/2)=5, ceil(8/2)=4
  })
  it('颜色来自像素并归一化到 0~1', () => {
    const img = fakeImage(4, 4, [255, 128, 0])
    const r = generateParticles(img, 1)
    expect(r.colors[0]).toBeCloseTo(1, 2)
    expect(r.colors[1]).toBeCloseTo(128 / 255, 2)
    expect(r.colors[2]).toBeCloseTo(0, 2)
  })
  it('位置以图片中心为原点，y 轴向上', () => {
    const img = fakeImage(4, 4, [0, 0, 0])
    const r = generateParticles(img, 1)
    // 第一个采样点 (0,0) → x=-2, y=+2（H/2 - 0）
    expect(r.positions[0]).toBe(-2)
    expect(r.positions[1]).toBe(2)
  })
  it('texSize = ceil(sqrt(count))，uvs 落在 [0,1]', () => {
    const img = fakeImage(10, 8, [0, 0, 0])
    const r = generateParticles(img, 2)
    expect(r.texSize).toBe(Math.ceil(Math.sqrt(r.count)))
    for (let i = 0; i < r.count; i++) {
      const u = r.uvs[i * 2], v = r.uvs[i * 2 + 1]
      expect(u).toBeGreaterThanOrEqual(0); expect(u).toBeLessThanOrEqual(1)
      expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1)
    }
  })
})
