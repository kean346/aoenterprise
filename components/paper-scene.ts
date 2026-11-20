import {
  Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, SRGBColorSpace,
  TextureLoader, WebGLRenderer,
} from "three";

const columns = 88;
const rows = 30;
const cycle = 10.4;
const pivot = .48;
const slices = columns + 1;

function smoothstep(value: number) {
  const t = Math.max(0, Math.min(value, 1));
  return t * t * (3 - 2 * t);
}

function curlAt(u: number, release: number) {
  const turn = smoothstep((u - pivot) / (1 - pivot));
  return -.76 * turn * (1 - .64 * release);
}

export async function createPaperScene(canvas: HTMLCanvasElement, source: string, onError: () => void, lowPower: boolean) {
  const photograph = await new TextureLoader().loadAsync(source);
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !lowPower, powerPreference: "low-power" });
  } catch (error) {
    photograph.dispose();
    throw error;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1.15 : 1.7));
  renderer.outputColorSpace = SRGBColorSpace;
  photograph.colorSpace = SRGBColorSpace;

  const image = photograph.image as { width: number; height: number };
  const imageHeight = 2 * image.height / image.width;
  const geometry = new PlaneGeometry(2, imageHeight, columns, rows);
  const base = new Float32Array(geometry.attributes.position.array);
  const horizontal = new Float32Array(slices);
  const vertical = new Float32Array(slices);
  const material = new MeshBasicMaterial({ map: photograph, transparent: true, depthWrite: false });
  const sheet = new Mesh(geometry, material);
  sheet.frustumCulled = false;
  const scene = new Scene();
  scene.add(sheet);
  const camera = new OrthographicCamera(-1, 1, 1, -1, .1, 20);
  camera.position.z = 5;

  const handleContextLost = (event: Event) => { event.preventDefault(); onError(); };
  canvas.addEventListener("webglcontextlost", handleContextLost);

  function draw(elapsed: number) {
    const phase = 2 * Math.PI * elapsed / cycle;
    const release = smoothstep((1 - Math.cos(phase)) * .5);
    let x = 0;
    let y = 0;
    for (let column = 1; column <= columns; column++) {
      const u = (column - .5) / columns;
      const neutral = curlAt(u, 0);
      const turn = curlAt(u, release);
      // Use equal arc-length steps, then apply only the change in projection to the lit photograph.
      x += (Math.cos(turn) - Math.cos(neutral)) * 2 / columns;
      y += (Math.sin(turn) - Math.sin(neutral)) * 2 / columns;
      horizontal[column] = x;
      vertical[column] = y;
    }
    const positions = geometry.attributes.position;
    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        const i = row * slices + column;
        const u = column / columns;
        const section = smoothstep((u - pivot) / (1 - pivot));
        const warp = section * release * .039;
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        positions.setXYZ(i, x + horizontal[column] - .032 * release - y * warp,
          y + vertical[column] * .24 - .038 * release + .012 * Math.sin(phase) * (1 - u),
          .06 * section * release);
      }
    }
    positions.needsUpdate = true;
    sheet.position.y = .012 * Math.sin(phase);
    sheet.rotation.z = .008 * Math.sin(phase);
    renderer.render(scene, camera);
    return release;
  }

  return {
    draw,
    resize(width: number, height: number) {
      const ratio = width / Math.max(height, 1);
      const halfWidth = Math.max(1, imageHeight * ratio / 2) / .96;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = halfWidth / ratio;
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      photograph.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
