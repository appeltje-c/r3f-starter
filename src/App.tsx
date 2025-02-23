import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'
import { GLTF } from 'three-stdlib'
import { useTweaks } from './tweaks/use-tweaks'

const model = '/suzanne.gltf'

function Box({ ...args }) {

  const { color, otherColor, scale } = useTweaks({
    color: { value: '#ff0000' },
    otherColor: { value: '#00ff00' },
    scale: { value: 1.5 },
    someName: { value: 'some' }
  })

  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null!)

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_, delta) => (ref.current.rotation.x += delta))

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...args}
      ref={ref}
      scale={clicked ? scale : 1}
      onClick={() => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? color : otherColor} />
    </mesh>
  )
}

export type DreiGLTF = GLTF & {
  nodes: Record<string, Mesh>
  materials: Record<string, MeshStandardMaterial>
}

function App() {

  const { rotation, position } = useTweaks({
    rotation: { value: 0, min: 0, max: 10, step: 0.1 },
    position: { value: 0, min: -10, max: 10, step: 0.1 },
  })

  const { nodes } = useGLTF(model) as DreiGLTF

  return (
    <Canvas>

      <ambientLight intensity={1} />
      <directionalLight intensity={3} />

      <Suspense>
        <mesh
          position={[position, 0, 0]}
          rotation={[0, rotation, 0]}
          castShadow
          receiveShadow
          geometry={nodes.Suzanne.geometry}
          material={nodes.Suzanne.material}>
        </mesh>
      </Suspense>

      <Box position={[2, 0.2, 0]} />

      <OrbitControls />


    </Canvas>
  )
}

export default App

useGLTF.preload(model)
