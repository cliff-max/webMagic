import { useRef, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** 不可见交互平面：每帧 billboard 朝向相机、位于粒子云中心；供 raycaster 投射 */
const InteractionPlane = forwardRef<THREE.Mesh>((_, ref) => {
  const inner = useRef<THREE.Mesh>(null!)
  const meshRef = (ref as React.MutableRefObject<THREE.Mesh | null>) ?? inner

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(camera.quaternion)
      meshRef.current.position.set(0, 0, 0)
    }
  })

  return (
    <mesh ref={meshRef} visible={false}>
      <planeGeometry args={[10000, 10000]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
})
InteractionPlane.displayName = 'InteractionPlane'
export default InteractionPlane
