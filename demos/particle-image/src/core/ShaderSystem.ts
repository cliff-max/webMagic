import { useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { zerosTexture } from './textureEncode'
import velocityFrag from '../shaders/velocity.glsl'
import positionFrag from '../shaders/position.glsl'

export type GPGPU = {
  velocityUniforms: Record<string, THREE.IUniform>
  compute: () => void
  positionTexture: () => THREE.Texture
}

/** 装配 GPUComputationRenderer：position/velocity 双纹理 ping-pong；origin 为常量 sampler */
export function useGPGPU({ origin, texSize }: { origin: THREE.DataTexture; texSize: number }): GPGPU | null {
  const gl = useThree((s) => s.gl)
  const ref = useRef<GPGPU | null>(null)

  // useMemo 首次构造；GPGPU 依赖 gl，在 Canvas 内 gl 已就绪
  return useMemo(() => {
    const gpu = new GPUComputationRenderer(texSize, texSize, gl)
    const pos0 = gpu.createTexture()
    const vel0 = zerosTexture(texSize)
    // 初始位置 = origin：复制 origin 像素到 pos0
    pos0.image.data.set(origin.image.data as unknown as Float32Array)

    const posVar = gpu.addVariable('tPosition', positionFrag, pos0)
    const velVar = gpu.addVariable('tVelocity', velocityFrag, vel0)
    gpu.setVariableDependencies(posVar, [posVar, velVar])
    gpu.setVariableDependencies(velVar, [posVar, velVar])

    // velocity 的常量与交互 uniform
    velVar.material.uniforms.tOrigin = { value: origin }
    velVar.material.uniforms.uMouse = { value: new THREE.Vector3() }
    velVar.material.uniforms.uMouseActive = { value: 0 }
    velVar.material.uniforms.uDelta = { value: 0.016 }
    velVar.material.uniforms.uInteractionRadius = { value: 30 }
    velVar.material.uniforms.uInteractionStrength = { value: 120 }
    velVar.material.uniforms.uReturnSpeed = { value: 8 }
    velVar.material.uniforms.uDamping = { value: 0.92 }
    // position 也要 uDelta
    posVar.material.uniforms.uDelta = { value: 0.016 }

    const error = gpu.init()
    if (error !== null) {
      console.error('[GPGPU] init error:', error)
      return null
    }

    ref.current = {
      velocityUniforms: velVar.material.uniforms,
      compute: () => {
        gpu.compute()
      },
      positionTexture: () => gpu.getCurrentRenderTarget(posVar).texture,
    }
    return ref.current
    // texSize 改变需重建；origin 引用变化时（换图）也重建
  }, [gl, texSize, origin])
}
