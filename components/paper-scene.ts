import {
  AmbientLight, BackSide, BufferAttribute, BufferGeometry, CanvasTexture, DirectionalLight,
  DoubleSide, Group, HemisphereLight, Mesh, MeshStandardMaterial, OrthographicCamera, PCFShadowMap,
  PlaneGeometry, RepeatWrapping, Scene, ShadowMaterial, SRGBColorSpace, WebGLRenderer,
} from "three";

const segments = 100;
const across = 14;
const paperLength = 8.8;
const paperWidth = 2.42;
const loopSeconds = 10.4;
const radians = Math.PI / 180;

// Angle, in degrees, of the paper tangent at equally spaced material points.
const curled = [-10, 38, 65, 30, -48, -48, 13, 54, 31, -53, -146, -198];
const open = [-10, 38, 65, 30, -48, -48, 13, 54, 43, 22, 4, -14];

function tangentAt(u: number, release: number) {
  const sample = u * (curled.length - 1);
  const i = Math.min(Math.floor(sample), curled.length - 2);
  const t = sample - i;
  const angle = (j: number) => {
    const index = Math.min(Math.max(j, 0), curled.length - 1);
    return curled[index] + (open[index] - curled[index]) * release;
  };
  const start = angle(i);
  const end = angle(i + 1);
  const before = (end - angle(i - 1)) / 2;
  const after = (angle(i + 2) - start) / 2;
  return radians * (
    start + before * t + (3 * (end - start) - 2 * before - after) * t * t
    + (2 * (start - end) + before + after) * t * t * t
  );
}

function makeSurface() {
  const positions = new Float32Array((segments + 1) * (across + 1) * 3);
  const uv: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= segments; row++) {
    for (let column = 0; column <= across; column++) {
      uv.push((row / segments) * 2, column / across);
      if (row === segments || column === across) continue;
      const a = row * (across + 1) + column;
      const b = a + across + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
  geometry.setIndex(indices);
  return { geometry, positions };
}

function paperGrain() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const grain = context.createImageData(canvas.width, canvas.height);
  let seed = 743;
  function random() {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 2 ** 32;
  }
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = 4 * (y * canvas.width + x);
      const fibre = 11 * Math.sin(x * 0.71 + Math.cos(y * .28) * 1.3) * Math.sin(y * 1.8);
      const shade = 178 + random() * 62 + fibre;
      grain.data[i] = shade;
      grain.data[i + 1] = shade;
      grain.data[i + 2] = shade;
      grain.data[i + 3] = 255;
    }
  }
  context.putImageData(grain, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

export function createPaperScene(canvas: HTMLCanvasElement, onError: () => void, lowPower: boolean) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.15 : 1.6));
  renderer.shadowMap.enabled = !lowPower;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const targetX = 0.02;
  const targetY = 0.52;
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
  camera.position.set(4.1, 4.0, 12.2);
  camera.lookAt(targetX, targetY, 0);

  scene.add(new HemisphereLight(0xfff8ee, 0x977c6f, 1.11));
  scene.add(new AmbientLight(0xffffff, 0.32));
  const key = new DirectionalLight(0xfff3e8, 2.16);
  key.position.set(-3.8, 6.8, 4.6);
  key.castShadow = !lowPower;
  key.shadow.mapSize.set(512, 512);
  Object.assign(key.shadow.camera, { left: -6, right: 6, bottom: -5, top: 5, near: 0.5, far: 20 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias = 0.023;
  key.shadow.bias = -0.00014;
  key.shadow.radius = 4;
  scene.add(key);
  const fill = new DirectionalLight(0xfffdfa, 0.67);
  fill.position.set(3, 2, -5);
  scene.add(fill);

  const { geometry, positions } = makeSurface();
  const bump = paperGrain();
  const front = new MeshStandardMaterial({
    color: "#b78570", roughness: 0.86, bumpMap: bump, bumpScale: 0.055, shadowSide: DoubleSide,
  });
  const back = new MeshStandardMaterial({
    color: "#e7d7c5", roughness: 0.92, bumpMap: bump, bumpScale: 0.027, side: BackSide,
  });
  const ribbon = new Group();
  for (const material of [front, back]) {
    const mesh = new Mesh(geometry, material);
    mesh.castShadow = material === front;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    ribbon.add(mesh);
  }
  scene.add(ribbon);

  const floorShape = new PlaneGeometry(30, 20);
  const floorMaterial = new ShadowMaterial({ color: "#70594a", opacity: 0.14, depthWrite: false });
  const floor = new Mesh(floorShape, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.43;
  floor.receiveShadow = true;
  if (!lowPower) scene.add(floor);

  const handleContextLost = (event: Event) => { event.preventDefault(); onError(); };
  canvas.addEventListener("webglcontextlost", handleContextLost);

  function draw(elapsed: number) {
    const phase = (elapsed / loopSeconds) * Math.PI * 2;
    const sway = (1 - Math.cos(phase)) / 2;
    const release = sway * sway * (3 - 2 * sway);
    const step = paperLength / segments;
    let x = -3.8;
    let y = -0.34;

    for (let row = 0; row <= segments; row++) {
      const u = row / segments;
      if (row > 0) {
        // Fixed-length spatial steps unfurl the curve without stretching it.
        const direction = tangentAt(u - (0.5 / segments), release);
        x += Math.cos(direction) * step;
        y += Math.sin(direction) * step;
      }
      const tangent = tangentAt(u, release);
      const twist = 0.08 * Math.sin(u * 5.5 - phase) + 0.11 * Math.sin(u * Math.PI);
      const nx = -Math.sin(tangent);
      const ny = Math.cos(tangent);
      for (let column = 0; column <= across; column++) {
        const v = (column / across - 0.5);
        const width = v * paperWidth;
        const offset = width * Math.sin(twist) + v * v * 0.11 * Math.sin(Math.PI * u);
        const index = (row * (across + 1) + column) * 3;
        positions[index] = x + nx * offset;
        positions[index + 1] = y + ny * offset;
        positions[index + 2] = width * Math.cos(twist);
      }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    ribbon.position.y = 0.09 * Math.sin(phase - 0.35);
    ribbon.rotation.z = 0.14 + 0.026 * Math.sin(phase);
    ribbon.rotation.y = -0.17 + 0.043 * Math.sin(phase);
    renderer.render(scene, camera);
  }

  return {
    draw,
    resize(width: number, height: number) {
      const ratio = width / Math.max(height, 1);
      const span = Math.max(7.84, 4.85 * ratio);
      camera.left = -span / 2;
      camera.right = span / 2;
      camera.top = span / ratio / 2;
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      key.shadow.dispose();
      geometry.dispose();
      floorShape.dispose();
      front.dispose();
      back.dispose();
      floorMaterial.dispose();
      bump?.dispose();
      renderer.dispose();
    },
  };
}
