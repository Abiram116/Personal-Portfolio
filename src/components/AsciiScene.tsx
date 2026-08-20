import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import * as THREE from 'three';

/**
 * A rotating torus resolved into ASCII, filling the hero as a full-bleed
 * backdrop.
 *
 * Deliberately simple. A short 10-step ramp at a coarse resolution is what
 * makes it read as a stable, solid form: a long ramp reassigns characters on
 * every frame and the whole field shimmers. Likewise the render loop runs
 * continuously — toggling frameloop re-initialises it and shows as a flicker.
 * Background tabs are already throttled by the browser, so there is nothing to
 * win there anyway.
 */

function Knot(props: ThreeElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.18;
    mesh.current.rotation.z += delta * 0.08;
    // the pointer tips the ring rather than sliding it around
    const { x } = state.pointer;
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, x * 0.5, 0.03);
  });

  return (
    <mesh {...props} ref={mesh}>
      {/* A knot again, but with a thin tube: the gaps between the windings are
          what make it legible at character resolution. A fat tube fills them in
          and it collapses into a tangle. */}
      <torusKnotGeometry args={[1.1, 0.38, 240, 28, 2, 3]} />
      <meshStandardMaterial color="#ffffff" roughness={0.28} metalness={0.18} />
    </mesh>
  );
}

/**
 * The ASCII pass, driven directly rather than through drei's wrapper.
 *
 * AsciiEffect computes its pixel buffer as Math.floor(width * resolution) and
 * passes that straight to getImageData. drei renders once before it calls
 * setSize, so on the first frame those are NaN and it throws. Owning the effect
 * lets us guarantee setSize runs first and skip rendering until it has.
 */
function AsciiPass({
  characters,
  fgColor,
  bgColor,
  resolution,
}: {
  characters: string;
  fgColor: string;
  bgColor: string;
  resolution: number;
}) {
  const { gl, scene, camera, size } = useThree();
  const sized = useRef(false);

  const effect = useMemo(() => {
    // invert: true — the library's default maps dark pixels to the densest
    // character and bright pixels to blank, which is backwards for a black
    // scene background (it would render as a dense block and the lit knot
    // surface as empty space). Inverted, bright = dense symbol, black = blank.
    const e = new AsciiEffect(gl, characters, { resolution, scale: 1, color: false, invert: true });
    e.domElement.style.color = fgColor;
    e.domElement.style.backgroundColor = bgColor;
    return e;
  }, [gl, characters, resolution, fgColor, bgColor]);

  // size first, always
  useEffect(() => {
    if (size.width > 0 && size.height > 0) {
      effect.setSize(size.width, size.height);
      sized.current = true;
    }
  }, [effect, size.width, size.height]);

  useEffect(() => {
    const parent = gl.domElement.parentNode as HTMLElement | null;
    if (!parent) return;
    // The real bug: this div lands as a sibling of the WebGL canvas, three
    // levels inside react-three-fiber's own wrapper structure — confirmed by
    // dumping the live DOM tree. The canvas sits in NORMAL FLOW at full height
    // (opacity:0 hides it but does not remove it from layout), so an
    // also-normal-flow sibling appended after it starts one full viewport
    // height down — exactly the "ASCII renders but is entirely invisible"
    // symptom. Setting this element's own position directly (rather than
    // relying on a stylesheet selector reaching three levels into another
    // library's DOM) is what actually guarantees it overlaps the canvas
    // instead of flowing beneath it.
    effect.domElement.style.position = 'absolute';
    effect.domElement.style.inset = '0';
    effect.domElement.style.width = '100%';
    effect.domElement.style.height = '100%';
    parent.querySelectorAll('table').forEach((el) => el.remove());
    parent.appendChild(effect.domElement);
    gl.domElement.style.opacity = '0';
    return () => {
      if (effect.domElement.parentNode === parent) parent.removeChild(effect.domElement);
    };
  }, [effect, gl]);

  // priority 1 takes over the render loop from R3F
  useFrame(() => {
    if (sized.current) effect.render(scene, camera);
  }, 1);

  return null;
}

export default function AsciiScene() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 900px)').matches;
    const webgl = (() => {
      try {
        const c = document.createElement('canvas');
        return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
      } catch {
        return false;
      }
    })();
    if (reduced || small || !webgl) {
      // Nothing will render, so don't make the intro wait on it.
      window.dispatchEvent(new Event('scene-ready'));
      return;
    }

    // Mount only once the container has real dimensions — the ASCII pass reads
    // pixels off the canvas and throws if it is ever measured at zero size.
    let raf = 0;
    const check = () => {
      const el = host.current;
      if (el && el.clientWidth > 0 && el.clientHeight > 0) setReady(true);
      else raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => window.dispatchEvent(new Event('scene-ready')), 120);
    return () => clearTimeout(id);
  }, [ready]);

  return (
    <div className="ascii-stage" ref={host} aria-hidden="true">
      {ready && (
        <Canvas
          camera={{ position: [0, 0, 6.9], fov: 40 }}
          dpr={1}
          gl={{ antialias: false, powerPreference: 'low-power', alpha: false }}
        >
          {/* Black ground so empty space maps to a blank character on the
              light page; the DOM copy of that black is dropped in CSS. */}
          <color attach="background" args={['#000000']} />

          {/* invert:true on the ASCII pass means bright = dense character, dark
              = blank. Flooding the scene with ambient (an earlier pass at
              intensity 20) made everything saturate to the densest character
              uniformly — visible, but flat, no read of the curved surface.
              A moderate three-point rig instead: a strong key for the main
              gradient across the tube, a dim fill so the shadow side doesn't
              drop to pure blank, and a rim light from behind to pop the
              silhouette edge — the combination is what actually reads as 3D
              once it's run through a 10-step character ramp. */}
          <ambientLight intensity={0.85} />
          <directionalLight position={[1.4, 3, 5]} intensity={3.4} />
          <directionalLight position={[-3, -1.5, 2]} intensity={1.1} />
          <directionalLight position={[-1, -2.5, -4]} intensity={1.9} />

          <Suspense fallback={null}>
            <Knot />
          </Suspense>

          <AsciiPass
            characters=" .:-=+*#%@"
            fgColor="#14110f"
            bgColor="#000000"
            resolution={0.17}
          />
        </Canvas>
      )}
    </div>
  );
}
