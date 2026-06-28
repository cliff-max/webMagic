import { describe, it, expect } from 'vitest'
import { clampParticleCount } from './PerformanceMonitor'

describe('clampParticleCount', () => {
  it('低于下界 10000 时截断为 10000', () => {
    expect(clampParticleCount(5000)).toBe(10000)
    expect(clampParticleCount(0)).toBe(10000)
    expect(clampParticleCount(-1)).toBe(10000)
  })

  it('高于上界 200000 时截断为 200000', () => {
    expect(clampParticleCount(999999)).toBe(200000)
    expect(clampParticleCount(300000)).toBe(200000)
  })

  it('中间值保持不变', () => {
    expect(clampParticleCount(10000)).toBe(10000)
    expect(clampParticleCount(200000)).toBe(200000)
    expect(clampParticleCount(50000)).toBe(50000)
    expect(clampParticleCount(150000)).toBe(150000)
  })
})
