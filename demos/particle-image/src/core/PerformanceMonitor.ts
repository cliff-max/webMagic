import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const FPS_LOW = 45      // 低于此值考虑降级
const FPS_HIGH = 58     // 高于此值且余量足考虑升级
const WINDOW = 60       // 滑窗帧数
const MIN_STEP = 2
const MAX_STEP = 6

/** FPS 滑窗 → 自适应 samplingStep；通过 onChange 回调上抛新 step */
export function useAdaptiveStep(initialStep: number, onChange: (step: number) => void) {
  const stepRef = useRef(initialStep)
  const frames = useRef<number[]>([])
  const stableLow = useRef(0)
  const stableHigh = useRef(0)

  useFrame((_, delta) => {
    const fps = 1 / delta
    frames.current.push(fps)
    if (frames.current.length < WINDOW) return
    const avg = frames.current.reduce((a, b) => a + b, 0) / frames.current.length
    frames.current = []

    if (avg < FPS_LOW) {
      stableLow.current++
      stableHigh.current = 0
      if (stableLow.current >= 2 && stepRef.current < MAX_STEP) {
        stepRef.current++
        stableLow.current = 0
        onChange(stepRef.current)
      }
    } else if (avg > FPS_HIGH) {
      stableHigh.current++
      stableLow.current = 0
      if (stableHigh.current >= 3 && stepRef.current > MIN_STEP) {
        stepRef.current--
        stableHigh.current = 0
        onChange(stepRef.current)
      }
    } else {
      stableLow.current = 0
      stableHigh.current = 0
    }
  })
}

/** 按粒子数锁范围 [10000, 200000]（调用方在生成前 clamp） */
export function clampParticleCount(count: number): number {
  return Math.max(10000, Math.min(200000, count))
}
