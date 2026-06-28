import * as THREE from 'three'

/** 粒子线性 index → GPGPU 方形纹理纹素 uv */
export function indexToUV(index: number, texSize: number): [number, number] {
  const tx = index % texSize
  const ty = Math.floor(index / texSize)
  return [(tx + 0.5) / texSize, (ty + 0.5) / texSize]
}

/** Float32Array(每粒子 xyz) → DataTexture(rgba, a=1)；texSize 为方形边长 */
export function vec3ArrayToTexture(arr: Float32Array, texSize: number): THREE.DataTexture {
  const count = arr.length / 3
  const data = new Float32Array(texSize * texSize * 4)
  for (let i = 0; i < count; i++) {
    data[i * 4] = arr[i * 3]
    data[i * 4 + 1] = arr[i * 3 + 1]
    data[i * 4 + 2] = arr[i * 3 + 2]
    data[i * 4 + 3] = 1
  }
  const tex = new THREE.DataTexture(data, texSize, texSize, THREE.RGBAFormat, THREE.FloatType)
  tex.needsUpdate = true
  return tex
}

/** 全 0 纹理（初始速度） */
export function zerosTexture(texSize: number): THREE.DataTexture {
  const data = new Float32Array(texSize * texSize * 4)
  const tex = new THREE.DataTexture(data, texSize, texSize, THREE.RGBAFormat, THREE.FloatType)
  tex.needsUpdate = true
  return tex
}
