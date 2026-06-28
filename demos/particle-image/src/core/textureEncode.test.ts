import { describe, it, expect } from 'vitest'
import { vec3ArrayToTexture, zerosTexture, indexToUV } from './textureEncode'

describe('textureEncode', () => {
  it('indexToUV 与 texSize 方形网格对齐', () => {
    const texSize = 4
    const [u, v] = indexToUV(0, texSize)
    expect(u).toBeCloseTo(0.5 / texSize)
    expect(v).toBeCloseTo(0.5 / texSize)
  })
  it('vec3ArrayToTexture 写入 xyz 到 rgb、a=1', () => {
    const arr = new Float32Array([1, 2, 3])
    const tex = vec3ArrayToTexture(arr, 1)
    const d = tex.image.data as unknown as Float32Array
    expect(d[0]).toBe(1)
    expect(d[1]).toBe(2)
    expect(d[2]).toBe(3)
    expect(d[3]).toBe(1)
  })
  it('zerosTexture 全 0', () => {
    const tex = zerosTexture(2)
    const d = tex.image.data as unknown as Float32Array
    expect(d.length).toBe(2 * 2 * 4)
    expect(d.every((x) => x === 0)).toBe(true)
  })
})
