export type ParticleData = {
  positions: Float32Array
  colors: Float32Array
  uvs: Float32Array
  count: number
  texSize: number
}

/** 按 samplingStep 隔点采样像素，生成粒子位置/颜色/纹素 uv */
export function generateParticles(image: ImageData, step: number): ParticleData {
  const { data, width: W, height: H } = image
  const cols = Math.ceil(W / step)
  const rows = Math.ceil(H / step)
  const count = cols * rows
  const texSize = Math.ceil(Math.sqrt(count))

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const uvs = new Float32Array(count * 2)

  let i = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const px = Math.min(col * step, W - 1)
      const py = Math.min(row * step, H - 1)
      const idx = (py * W + px) * 4
      // 位置：中心为原点，y 向上
      positions[i * 3] = px - W / 2
      positions[i * 3 + 1] = H / 2 - py
      positions[i * 3 + 2] = 0 // 深度由 DepthGenerator 填
      // 颜色：归一化
      colors[i * 3] = data[idx] / 255
      colors[i * 3 + 1] = data[idx + 1] / 255
      colors[i * 3 + 2] = data[idx + 2] / 255
      // 纹素 uv：i → (x, y) in texSize 方形纹理
      const tx = i % texSize
      const ty = Math.floor(i / texSize)
      uvs[i * 2] = (tx + 0.5) / texSize
      uvs[i * 2 + 1] = (ty + 0.5) / texSize
      i++
    }
  }
  return { positions, colors, uvs, count, texSize }
}
