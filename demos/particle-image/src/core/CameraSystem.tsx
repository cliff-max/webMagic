import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

type Props = {
  aspect: number // 图片 width/height
  depthScale: number
  autoRotate?: boolean
  controlsRef?: React.Ref<any>
}

/** OrbitControls + 按图片尺寸自动适配相机距离，保证横/竖/方图全入画 */
export default function CameraSystem({
  aspect,
  depthScale,
  autoRotate = false,
  controlsRef,
}: Props) {
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    const maxDim = Math.max(aspect, 1 / aspect) * 200 // 与渲染缩放一致的近似包围盒
    const fov = (camera as THREE.PerspectiveCamera).fov
    const dist = (maxDim / (2 * Math.tan((fov * Math.PI) / 360))) * 1.4 + depthScale * 0.6
    camera.position.set(0, dist * 0.12, dist) // 略高于中心
    camera.lookAt(0, 0, 0)
  }, [aspect, depthScale, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={50}
      maxDistance={4000}
      enablePan
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
    />
  )
}
