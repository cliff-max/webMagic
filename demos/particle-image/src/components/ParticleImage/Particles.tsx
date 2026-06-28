import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ParticleData } from '../../core/ParticleGenerator'
import type { GPGPU } from '../../core/ShaderSystem'
import renderVert from '../../shaders/render.vert.glsl'
import renderFrag from '../../shaders/render.frag.glsl'

type Props = {
  data: ParticleData
  gpgpu: GPGPU
  uSize?: number
  uOpacity?: number
}

/**
 * Particles 渲染组件
 * - geometry 一次性创建：position 占位（全 0，提供顶点 count）、aColor、aUv
 * - 每帧在 useFrame 内执行 GPGPU compute 并同步 uniforms（tPosition / uSize / uOpacity）
 * - frustumCulled={false}：顶点位置由 shader 动态采样纹理，避免错误剔除
 */
export default function Particles({ data, gpgpu, uSize = 2, uOpacity = 1 }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  // geometry 一次性创建，不每帧重建
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.count * 3), 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(data.colors, 3))
    g.setAttribute('aUv', new THREE.BufferAttribute(data.uvs, 2))
    return g
  }, [data])

  // uniforms 稳定引用：刻意保持 [] 空依赖，避免 R3F 每帧重建 material。
  // 值由下方 useFrame 每帧覆盖（tPosition/uSize/uOpacity），初始值仅作 fallback。
  const uniforms = useMemo(
    () => ({
      tPosition: { value: null as THREE.Texture | null },
      uSize: { value: uSize },
      uOpacity: { value: uOpacity },
    }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  useFrame((_, delta) => {
    gpgpu.velocityUniforms.uDelta.value = Math.min(delta, 0.033)
    gpgpu.compute()
    matRef.current.uniforms.tPosition.value = gpgpu.positionTexture()
    matRef.current.uniforms.uSize.value = uSize
    matRef.current.uniforms.uOpacity.value = uOpacity
  })

  return (
    <points geometry={geom} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={renderVert}
        fragmentShader={renderFrag}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
