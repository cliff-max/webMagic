/** 从 File 加载为 HTMLImageElement */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!/image\/(jpeg|png|webp)/.test(file.type)) {
      reject(new Error(`不支持的图片格式：${file.type}`))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
}

/** 把图片绘制到 Canvas 并读取完整 RGBA 像素；超过 maxDim 则等比缩小（控制粒子规模） */
export function imageToImageData(img: HTMLImageElement, maxDim = 512): ImageData {
  if (img.naturalWidth === 0 || img.naturalHeight === 0) {
    throw new Error('图片尚未加载完成或尺寸为 0，无法读取像素')
  }
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('无法获取 2D 上下文')
  ctx.drawImage(img, 0, 0, w, h)
  return ctx.getImageData(0, 0, w, h)
}

/** 便于下游统一类型（浏览器原生 ImageData 即可，此处仅占位以备 node 环境） */
export type PixelData = ImageData
