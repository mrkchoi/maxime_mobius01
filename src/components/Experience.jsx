import React, { useRef } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { Effects, useFBO } from '@react-three/drei';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';

import MoebiusPass from '../postprocessing/MoebiusPass02';
import CustomNormalMaterial from '../postprocessing/CustomNormalMaterial';
import { useControls } from 'leva';
import GroundMaterial from '../postprocessing/GroundMaterial';
import GroundNormalMaterial from '../postprocessing/GroundNormalMaterial';
import Spaceship from './Spaceship';

extend({ MoebiusPass, GroundMaterial });

// const lightPosition = [10, 10, 10];

function Experience() {
  const { shadowType, lightPosition } = useControls({
    lightPosition: { value: [-50, 50, 15] },
    shadowType: {
      value: 3.0,
      options: {
        tonal: 1.0,
        raster: 2.0,
        crosshatch: 3.0,
      },
    },
  });
  const mesh = useRef(null);
  const spaceship = useRef(null);
  const ground = useRef(null);

  const { scene, camera } = useThree();

  const depthTexture = new THREE.DepthTexture(
    window.innerWidth,
    window.innerHeight
  );
  const depthRenderTarget = useFBO(window.innerWidth, window.innerHeight, {
    depthTexture,
    depthBuffer: true,
  });

  const normalRenderTarget = useFBO();

  useFrame((state) => {
    state.camera.lookAt(0, 0, 0);

    const { gl, scene, camera, clock } = state;

    gl.setRenderTarget(depthRenderTarget);
    gl.render(scene, camera);

    const materials = [];

    gl.setRenderTarget(normalRenderTarget);

    scene.traverse((obj) => {
      if (obj.isMesh) {
        materials.push(obj.material);
        if (obj.name === 'ground') {
          obj.material = GroundNormalMaterial;
          obj.material.uniforms.uTime.value = clock.elapsedTime;
          obj.material.uniforms.lightPosition.value = lightPosition;
        } else {
          obj.material = CustomNormalMaterial;
          obj.material.uniforms.lightPosition.value = lightPosition;
        }
      }
    });

    gl.render(scene, camera);

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = materials.shift();
      }
    });

    gl.setRenderTarget(null);
  });

  useFrame((state) => {
    const { clock } = state;

    spaceship.current.rotation.x =
      Math.cos(state.clock.getElapsedTime() * 2.0) *
      Math.cos(state.clock.getElapsedTime()) *
      0.15;
    spaceship.current.position.y =
      Math.sin(state.clock.getElapsedTime() * 2.0) + 1.0;

    ground.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <>
      <directionalLight
        castShadow
        position={lightPosition}
        intensity={10.5}
        color={'#ffffff'}
        // target={ground.current}
      />
      <mesh position={[80, 30, 140]} scale={10}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="darkorange" />
      </mesh>
      <mesh position={[50, 35, 120]} scale={3}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
      <group rotation={[0, Math.PI / 2, 0]} position={[0, 2, 0]}>
        <Spaceship ref={spaceship} />
      </group>
      <mesh
        ref={ground}
        name="ground"
        castShadow
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
      >
        <planeGeometry args={[300, 300, 100, 100]} />
        <groundMaterial receiveShadow color="#FF6457" />
      </mesh>
      <Effects
        key={uuidv4()}
        multisamping={8}
        renderIndex={1}
        disableGamma={true}
        disableRenderPass={false}
        disableRender={false}
      >
        <moebiusPass
          args={[
            {
              depthRenderTarget,
              normalRenderTarget,
              camera,
              shadowType,
            },
          ]}
        />
      </Effects>
    </>
  );
}

export default Experience;
