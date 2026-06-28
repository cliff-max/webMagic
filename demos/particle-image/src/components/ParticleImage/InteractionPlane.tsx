import { forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** 不可见交互平面：每帧 billboard 朝向相机、位于粒子云中心；供 raycaster 投射 */
const InteractionPlane = forwardRef<THREE.Mesh>((_, ref) => {
  useFrame(({ camera }) => {
    const mesh = (ref as React.RefObject<THREE.Mesh | null>).current
    if (mesh) {
      mesh.quaternion.copy(camera.quaternion)
      mesh.position.set(0, 0, 0)
    }
  })

  return (
    <mesh ref={ref} visible={false}>
      <planeGeometry args={[10000, 10000]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
})
InteractionPlane.displayName = 'InteractionPlane'
export default InteractionPlane
