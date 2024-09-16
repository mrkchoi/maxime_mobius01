import { Canvas } from '@react-three/fiber';
import './App.css';
import { Suspense } from 'react';
import Scene from './components/Scene';

function App() {
  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-full">
        <Canvas dpr={[1, 2]} shadows>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
