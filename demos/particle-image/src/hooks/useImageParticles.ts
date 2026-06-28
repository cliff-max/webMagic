import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { generateParticles, type ParticleData } from '../core/ParticleGenerator'
import { applyDepth } from '../core/DepthGenerator'
import { imageToImageData } from '../core/imageLoader'
import { vec3ArrayToTexture } from '../core/textureEncode'

type Result = {
  data: ParticleData | null
  originTexture: THREE.DataTexture | null
  width: number
  height: number
}

async function toHTMLImage(image: HTMLImageElement | string): Promise<HTMLImageElement> {
  if (typeof image === 'string') {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = image
    })
  }
  return image
}

/** 图片 → ImageData → 粒子数据 → 深度 → origin DataTexture */
export function useImageParticles(
  image: HTMLImageElement | string,
  samplingStep: number,
  depthScale: number,
  maxDim = 512,
): Result {
  const [result, setResult] = useState<Result>({ data: null, originTexture: null, width: 1, height: 1 })

  useEffect(() => {
    let cancelled = false
    toHTMLImage(image)
      .then((img) => {
        if (cancelled) return
        const imageData = imageToImageData(img, maxDim)
        const data = generateParticles(imageData, samplingStep)
        applyDepth(data, depthScale)
        const originTexture = vec3ArrayToTexture(data.positions, data.texSize)
        if (!cancelled) setResult({ data, originTexture, width: imageData.width, height: imageData.height })
      })
      .catch((e) => console.error('[useImageParticles]', e))
    return () => {
      cancelled = true
    }
  }, [image, samplingStep, depthScale, maxDim])

  return result
}
