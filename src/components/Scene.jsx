import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import React from 'react';
import Experience from './Experience';

function Scene() {
  return (
    <>
      <ambientLight intensity={2.2} color={'#FFFFFF'} />
      <color attach="background" args={['#3386E0']} />
      <OrbitControls />
      <PerspectiveCamera
        makeDefault
        position={[-8, 4, -20]}
        // fov={65}
        near={0.01}
        far={800}
      />
      <Experience />
    </>
  );
}

export default Scene;
