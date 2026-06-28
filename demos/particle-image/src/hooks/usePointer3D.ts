import { useRef, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** NDC 指针 → 投射到传入的交互平面 mesh → 3D 世界坐标 */
export function usePointer3D(planeRef: React.RefObject<THREE.Mesh | null>) {
  const pointer3D = useMemo(() => new THREE.Vector3(), [])
  const active = useRef(false)
  const ndc = useMemo(() => new THREE.Vector2(), [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(), []) // 复用，避免每帧 GC
  const normal = useMemo(() => new THREE.Vector3(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const camera = useThree((s) => s.camera)
  const pointer = useThree((s) => s.pointer)

  useFrame(() => {
    if (!planeRef.current) return
    ndc.copy(pointer) // R3F pointer 已是 NDC
    raycaster.setFromCamera(ndc, camera)
    normal.set(0, 0, 1).applyQuaternion(planeRef.current.quaternion)
    plane.setFromNormalAndCoplanarPoint(normal, planeRef.current.position)
    const intersected = raycaster.ray.intersectPlane(plane, hit)
    if (intersected) pointer3D.copy(hit)
  })

  const events = {
    onPointerDown: () => (active.current = true),
    onPointerMove: () => (active.current = true),
    onPointerLeave: () => (active.current = false),
  }
  return { pointer3D, isActive: active, events }
}
