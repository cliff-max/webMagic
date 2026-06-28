import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useImageParticles } from '../../hooks/useImageParticles'
import { useGPGPU } from '../../core/ShaderSystem'
import { usePointer3D } from '../../hooks/usePointer3D'
import { useAdaptiveStep } from '../../core/PerformanceMonitor'
import Particles from './Particles'
import InteractionPlane from './InteractionPlane'
import CameraSystem from '../../core/CameraSystem'

// GPGPU 未就绪时的空纹理兜底（模块级常量，避免每次渲染新建）
const EMPTY_TEX = new THREE.DataTexture()

export type ParticleImageProps = {
  image: HTMLImageElement | string
  particleSize?: number
  depthScale?: number
  samplingStep?: number
  interactionRadius?: number
  interactionStrength?: number
  returnSpeed?: number
  damping?: number
  opacity?: number
  autoRotate?: boolean
  controlsRef?: React.Ref<any>
}

/**
 * ParticleImage 主组件 —— 编排所有子系统
 * - useImageParticles: 图片 → 粒子数据 + 原始纹理
 * - useGPGPU: GPGPU 速度/位置双纹理计算
 * - usePointer3D: 鼠标 3D 指针投射
 * - Particles: 粒子渲染（从 GPGPU positionTexture 采样位置）
 * - InteractionPlane: 不可见交互平面（接收指针事件）
 * - CameraSystem: 相机自动适配 + OrbitControls
 */
export default function ParticleImage({
  image,
  particleSize = 2,
  depthScale = 40,
  samplingStep = 3,
  interactionRadius = 30,
  interactionStrength = 120,
  returnSpeed = 8,
  damping = 0.92,
  opacity = 1,
  autoRotate = false,
  controlsRef,
}: ParticleImageProps) {
  const planeRef = useRef<THREE.Mesh>(null)

  // 自适应采样步长：性能降级时自动增大 step，恢复时减小
  const [step, setStep] = useState(samplingStep)
  useAdaptiveStep(samplingStep, (s) => setStep(s))
  // HUD 手动改 samplingStep 时同步到 step
  useEffect(() => setStep(samplingStep), [samplingStep])

  const { data, originTexture, width, height } = useImageParticles(
    image,
    step,
    depthScale,
  )

  // GPGPU 未就绪时传入空纹理兜底，避免 hook 抛异常
  const gpgpu = useGPGPU(
    originTexture
      ? { origin: originTexture, texSize: data?.texSize ?? 1 }
      : { origin: EMPTY_TEX, texSize: 1 },
  )

  const { pointer3D, isActive, events } = usePointer3D(planeRef)

  // 同步交互参数到 velocity uniforms（props 变化时立即生效）
  useEffect(() => {
    if (!gpgpu) return
    gpgpu.velocityUniforms.uInteractionRadius.value = interactionRadius
    gpgpu.velocityUniforms.uInteractionStrength.value = interactionStrength
    gpgpu.velocityUniforms.uReturnSpeed.value = returnSpeed
    gpgpu.velocityUniforms.uDamping.value = damping
  }, [gpgpu, interactionRadius, interactionStrength, returnSpeed, damping])

  // 每帧把鼠标 3D 坐标写入 GPGPU velocity uniform
  useFrame(() => {
    if (!gpgpu) return
    gpgpu.velocityUniforms.uMouse.value.copy(pointer3D)
    gpgpu.velocityUniforms.uMouseActive.value = isActive.current ? 1 : 0
  })

  // 子系统未就绪时返回 null（图片加载中 / GPGPU 初始化失败）
  if (!data || !originTexture || !gpgpu) return null

  const aspect = width / height

  return (
    <group {...events}>
      <Particles data={data} gpgpu={gpgpu} uSize={particleSize} uOpacity={opacity} />
      <InteractionPlane ref={planeRef} />
      <CameraSystem
        aspect={aspect}
        depthScale={depthScale}
        autoRotate={autoRotate}
        controlsRef={controlsRef}
      />
    </group>
  )
}
