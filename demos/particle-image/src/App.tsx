import { useState, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import ParticleImage, { type ParticleImageProps } from './components/ParticleImage/ParticleImage'
import HUD, { type HUDState } from './components/ParticleImage/HUD'
import { loadImageFromFile } from './core/imageLoader'
import defaultImg from './assets/default.jpg'

export default function App() {
  const controlsRef = useRef<any>(null)
  const [image, setImage] = useState<string>(defaultImg)
  const [error, setError] = useState<string | null>(null)
  const [hud, setHud] = useState<HUDState>({
    particleSize: 2, depthScale: 40, samplingStep: 3,
    interactionRadius: 30, interactionStrength: 120, returnSpeed: 8,
    damping: 0.92, opacity: 1, autoRotate: false,
  })

  const onUpload = useCallback(async (file: File) => {
    try {
      setError(null)
      await loadImageFromFile(file) // 校验格式/可加载
      // 替换前释放旧 blob URL，防止内存泄漏
      setImage(prev => {
        if (prev.startsWith('blob:')) URL.revokeObjectURL(prev)
        return URL.createObjectURL(file)
      })
    } catch (e) {
      setError((e as Error).message)
    }
  }, [])

  const onChange = useCallback((patch: Partial<HUDState>) => setHud((s) => ({ ...s, ...patch })), [])
  const onResetView = useCallback(() => controlsRef.current?.reset(), [])

  const props: ParticleImageProps = {
    image,
    particleSize: hud.particleSize, depthScale: hud.depthScale, samplingStep: hud.samplingStep,
    interactionRadius: hud.interactionRadius, interactionStrength: hud.interactionStrength,
    returnSpeed: hud.returnSpeed, damping: hud.damping, opacity: hud.opacity, autoRotate: hud.autoRotate,
    controlsRef,
  }

  return (
    <>
      <Canvas camera={{ fov: 60 }}>
        <ParticleImage {...props} />
      </Canvas>
      <HUD state={hud} onChange={onChange} onUpload={onUpload} onResetView={onResetView} />
      {error && (
        <div style={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,80,80,0.15)', color: '#ffd0d0', padding: '8px 16px',
          borderRadius: 8, border: '1px solid rgba(255,80,80,0.4)', zIndex: 11 }}>
          {error}（已保留当前图片）
        </div>
      )}
    </>
  )
}
