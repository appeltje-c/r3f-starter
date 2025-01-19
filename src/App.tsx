import { OrbitControls, Stage, useGLTF } from '@react-three/drei'
import { Canvas, MeshProps, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import { Mesh } from 'three'
import { useTweaks } from 'tweak-tools'

const model = '/suzanne.gltf'

function Box(props: MeshProps) {

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
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function App() {

  const { nodes } = useGLTF(model)
  const { rotation } = useTweaks({
    rotation: { value: -0.4, step: 0.2, label: 'Rotate Suzanne' }
  })

  return (
    <Canvas>

      <Stage preset={'portrait'}>

        <Suspense>
          <mesh
            position={[0, 0, 0]}
            rotation={[0, rotation, 0]}
            castShadow
            receiveShadow
            geometry={nodes.Suzanne.geometry}
            material={nodes.Suzanne.material}>
          </mesh>
        </Suspense>

        <Box position={[2, 0.2, 0]} />

        <OrbitControls />

      </Stage>

    </Canvas>
  )
}

export default App

useGLTF.preload(model)
