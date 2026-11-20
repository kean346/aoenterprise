import {
  ACESFilmicToneMapping, AmbientLight, CanvasTexture, DirectionalLight, ExtrudeGeometry,
  Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PerspectiveCamera, PMREMGenerator,
  Raycaster, Scene, Shape, ShapeGeometry, SRGBColorSpace, Vector2, Vector3, WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type Point = [number, number];

const joints: Point[] = [[.22, 0], [.515, 0], [.84, 0], [.34, 1], [.865, 1], [.385, .72], [.48, .62], [.716, .49]];
const cut = [[-1, 0, 5, 3, -4], [0, 1, 6, 5], [1, 2, 7, 6], [5, 6, 7, 4, 3], [2, -2, -3, 4, 7]];
const corners: Point[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
const clamp = (value: number) => Math.min(1, Math.max(0, value));

function roundedPolygon(points: Point[], radius: number) {
  const shape = new Shape();
  points.forEach(([x, y], index) => {
    const a = points[(index + points.length - 1) % points.length];
    const b = points[(index + 1) % points.length];
    const before = Math.min(.45, radius / Math.hypot(a[0] - x, a[1] - y));
    const after = Math.min(.45, radius / Math.hypot(b[0] - x, b[1] - y));
    const from: Point = [x + (a[0] - x) * before, y + (a[1] - y) * before];
    const to: Point = [x + (b[0] - x) * after, y + (b[1] - y) * after];
    if (index === 0) shape.moveTo(...from);
    else shape.lineTo(...from);
    shape.quadraticCurveTo(x, y, ...to);
  });
  shape.closePath();
  return shape;
}

function insetPolygon(points: Point[], amount: number): Point[] {
  const signedArea = points.reduce((area, p, i) => {
    const q = points[(i + 1) % points.length];
    return area + p[0] * q[1] - p[1] * q[0];
  }, 0);
  return points.map(([x, y], i) => {
    const previous = points[(i + points.length - 1) % points.length];
    const next = points[(i + 1) % points.length];
    const direction = Math.sign(signedArea);
    const firstLength = Math.hypot(x - previous[0], y - previous[1]);
    const nextLength = Math.hypot(next[0] - x, next[1] - y);
    const a = new Vector2(previous[1] - y, x - previous[0]).multiplyScalar(direction / firstLength);
    const b = new Vector2(y - next[1], next[0] - x).multiplyScalar(direction / nextLength);
    const offset = a.clone().add(b).multiplyScalar(amount / Math.max(1 + a.dot(b), .22));
    return [x + offset.x, y + offset.y];
  });
}

function mapOverlay(points: Vector2[], width: number, height: number) {
  const [a, b, c, d] = points;
  const x = a.x - b.x + c.x - d.x;
  const y = a.y - b.y + c.y - d.y;
  const dx1 = b.x - c.x;
  const dx2 = d.x - c.x;
  const dy1 = b.y - c.y;
  const dy2 = d.y - c.y;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = det ? (x * dy2 - dx2 * y) / det : 0;
  const h = det ? (dx1 * y - x * dy1) / det : 0;
  return `matrix3d(${(b.x - a.x + g * b.x) / width},${(b.y - a.y + g * b.y) / width},0,${g / width},${(d.x - a.x + h * d.x) / height},${(d.y - a.y + h * d.y) / height},0,${h / height},0,0,1,0,${a.x},${a.y},0,1)`;
}

function drawType(context: CanvasRenderingContext2D, field: HTMLElement, parent: DOMRect) {
  const bounds = field.getBoundingClientRect();
  const styles = getComputedStyle(field);
  const x = bounds.x - parent.x;
  const y = bounds.y - parent.y;
  const size = parseFloat(styles.fontSize);
  const lineHeight = parseFloat(styles.lineHeight) || size * 1.2;
  const tracking = parseFloat(styles.letterSpacing) || 0;
  const pill = field.hasAttribute("data-ink-button");
  context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
  context.textBaseline = "alphabetic";
  context.textAlign = pill ? "center" : "left";
  context.letterSpacing = `${tracking}px`;
  if (pill) {
    context.fillStyle = field.getAttribute("aria-pressed") === "true" ? "#bb8b77" : "#efe9e6";
    context.beginPath();
    context.roundRect(x, y, bounds.width, bounds.height, 6);
    context.fill();
  }
  context.fillStyle = pill ? "#262025" : styles.getPropertyValue("--ink-colour").trim() || "#e5dedf";
  const arrow = field.hasAttribute("data-ink-arrow");
  const lines = (arrow ? field.childNodes[0]?.textContent ?? "" : field.innerText || field.textContent || "").trim().split("\n");
  let baseline = y + (lineHeight - size) / 2 + size * .80;
  if (pill) baseline = y + (bounds.height - size) / 2 + size * .80;
  if (arrow) {
    const start = x + context.measureText(lines[0]).width + 7;
    const middle = baseline - size * .29;
    context.beginPath();
    context.moveTo(start, middle);
    context.lineTo(start + 7, middle);
    context.lineTo(start + 4, middle - 3);
    context.moveTo(start + 7, middle);
    context.lineTo(start + 4, middle + 3);
    context.lineWidth = 1;
    context.strokeStyle = context.fillStyle;
    context.stroke();
  }
  for (const line of lines) {
    const words = line.split(/\s+/);
    let buffer = "";
    for (const word of words) {
      const candidate = buffer ? buffer + " " + word : word;
      if (buffer && context.measureText(candidate).width > bounds.width + 1) {
        context.fillText(buffer, x, baseline);
        buffer = word;
        baseline += lineHeight;
      } else buffer = candidate;
    }
    context.fillText(buffer, pill ? x + bounds.width / 2 : x, baseline);
    baseline += lineHeight;
  }
}

export function createFacetScene(canvas: HTMLCanvasElement, block: HTMLElement, stage: HTMLElement, onError: () => void) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .42;
  room.dispose();
  pmrem.dispose();
  scene.add(new AmbientLight(0xffffff, .35));
  const key = new DirectionalLight(0xfce9e3, 2.5);
  key.position.set(-300, 480, 550);
  scene.add(key);

  const camera = new PerspectiveCamera(30, 1, 1, 8000);
  const slab = new Group();
  scene.add(slab);
  const ink = document.createElement("canvas");
  const texture = new CanvasTexture(ink);
  texture.colorSpace = SRGBColorSpace;
  const printing = new MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .02, depthWrite: false, toneMapped: false });
  const rim = new MeshPhysicalMaterial({ color: "#5a454a", roughness: .24, metalness: .45, clearcoat: .8 });
  const glowPosition = new Vector2(0, 0);
  const glow = { value: 0 };
  const scale = { value: 1 };

  const pieces = Array.from({ length: 6 }, (_, index) => {
    const glass = new MeshPhysicalMaterial({
      color: "#241f24", roughness: .36, clearcoat: .7, clearcoatRoughness: .12,
      specularIntensity: .7, iridescence: .44, iridescenceIOR: 1.3, iridescenceThicknessRange: [280, 620],
    });
    glass.onBeforeCompile = (shader) => {
      shader.uniforms.pointer = { value: glowPosition };
      shader.uniforms.glow = glow;
      shader.uniforms.surfaceScale = scale;
      shader.vertexShader = "varying vec2 printedPosition;\n" + shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nprintedPosition = (modelMatrix * vec4(position, 1.0)).xy;");
      shader.fragmentShader = "varying vec2 printedPosition; uniform vec2 pointer; uniform float glow; uniform float surfaceScale;\n" +
        shader.fragmentShader.replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\nfloat distanceToPointer = length(printedPosition - pointer) / max(180.0 * surfaceScale, 70.0);\ntotalEmissiveRadiance += vec3(.54,.29,.35) * glow * .14 * exp(-1.6 * distanceToPointer * distanceToPointer);");
    };
    const group = new Group();
    const body = new Mesh(new ExtrudeGeometry(), [glass, rim]);
    const face = new Mesh(new ShapeGeometry(), printing);
    group.add(body, face);
    slab.add(group);
    const direction = index - 2.5;
    return { group, body, face, glass, x: 0, y: 0, lift: 0, speed: 0, direction };
  });

  let width = 1;
  let height = 1;
  let blockWidth = 1;
  let blockHeight = 1;
  let navHeight = 0;
  let margin = 0;
  let portrait = false;
  let frame = 0;
  let visible = false;
  let destroyed = false;
  let view = false;
  let inspected = false;
  let turnAt = performance.now();
  let last = turnAt;
  let lastMesh = 0;
  let pointerInside = false;
  const cursor = new Vector2();
  const ray = new Raycaster();

  function updateInk() {
    block.style.transform = "none";
    const bounds = block.getBoundingClientRect();
    const dpi = Math.min(2, Math.max(1.5, devicePixelRatio));
    ink.width = Math.ceil(blockWidth * dpi);
    ink.height = Math.ceil(blockHeight * dpi);
    const context = ink.getContext("2d");
    if (!context) return;
    context.scale(dpi, dpi);
    block.querySelectorAll<HTMLElement>("[data-ink]").forEach((field) => drawType(context, field, bounds));
    texture.needsUpdate = true;
  }

  function shapeFor(index: number, time: number) {
    const panelTop = navHeight + margin;
    if (index === 0) return [[0, 0], [blockWidth, 0], [blockWidth, navHeight], [0, navHeight]] as Point[];
    const drift = joints.map(([x, y], i) => {
      const move = (.021 + .008 * Math.sin(i * 2.2)) * Math.sin(time * (0.32 + i * .034) + i * 1.37);
      const px = x + move;
      const py = i >= 5 ? y + .034 * Math.sin(time * (.42 + i * .018) + i * 1.2) : y;
      const mouseX = cursor.x * .5 + .5;
      const mouseY = .5 - cursor.y * .5;
      const dx = px - (portrait ? mouseY : mouseX);
      const dy = py - (portrait ? mouseX : mouseY);
      const dist = Math.hypot(dx, dy);
      const push = pointerInside ? .046 * (1 - clamp(dist / .6)) : 0;
      return [px + push * dx, py + (i >= 5 ? push * dy : 0)] as Point;
    });
    return cut[index - 1].map((point) => {
      const [x, y] = point >= 0 ? drift[point] : corners[-point - 1];
      return portrait ? [y * blockWidth, panelTop + x * (blockHeight - panelTop)]
        : [x * blockWidth, panelTop + y * (blockHeight - panelTop)];
    }) as Point[];
  }

  function updateGeometry(time: number) {
    pieces.forEach((piece, index) => {
      const outline = shapeFor(index, time);
      piece.x = outline.reduce((sum, [x]) => sum + x, 0) / outline.length - blockWidth / 2;
      piece.y = blockHeight / 2 - outline.reduce((sum, [, y]) => sum + y, 0) / outline.length;
      const points = insetPolygon(outline, Math.max(1.5, 8 * scale.value)).map(([x, y]) => (
        [x - blockWidth / 2 - piece.x, blockHeight / 2 - y - piece.y] as Point
      ));
      const shape = roundedPolygon(points, Math.max(4, 20 * scale.value));
      const depth = Math.max(5, 13 * scale.value);
      const bevel = Math.max(1, 2.6 * scale.value);
      const body = new ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 3, bevelThickness: bevel, bevelSize: bevel, curveSegments: 5, steps: 1 });
      const face = new ShapeGeometry(shape, 8);
      const uv = face.attributes.uv;
      const position = face.attributes.position;
      for (let i = 0; i < uv.count; i++) {
        uv.setXY(i, (position.getX(i) + piece.x) / blockWidth + .5, (position.getY(i) + piece.y) / blockHeight + .5);
      }
      piece.body.geometry.dispose();
      piece.face.geometry.dispose();
      piece.body.geometry = body;
      piece.face.geometry = face;
      piece.body.position.z = -depth - bevel;
      piece.face.position.z = .35;
    });
  }

  function resize() {
    width = Math.max(1, stage.clientWidth);
    height = Math.max(1, stage.clientHeight);
    blockWidth = Math.max(1, block.clientWidth);
    blockHeight = Math.max(1, block.clientHeight);
    navHeight = block.querySelector<HTMLElement>(".facet-nav")?.offsetHeight ?? 0;
    margin = block.querySelector<HTMLElement>(".facet-panel")?.offsetTop ?? navHeight;
    margin -= navHeight;
    portrait = width < 680;
    scale.value = blockWidth / 1730;
    camera.aspect = width / height;
    camera.position.z = (height / 2) / Math.tan(Math.PI / 12);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.setSize(width, height, false);
    updateInk();
    updateGeometry(performance.now() / 1000);
  }

  function frameAt(now: number) {
    frame = 0;
    if (!visible || destroyed) return;
    const delta = (now - last) / 1000;
    const dt = Math.min(1 / 30, delta);
    last = now;
    const smooth = 1 - Math.exp(-delta / .3);
    const tiltX = pointerInside && !view ? -cursor.y * .105 + .016 : .014;
    const tiltY = pointerInside && !view ? cursor.x * .13 - .021 : -.018;
    const settle = (angle: number, target: number) => (
      Math.abs(target - angle) < .0005 ? target : angle + (target - angle) * smooth
    );
    slab.rotation.x = settle(slab.rotation.x, tiltX);
    slab.rotation.y = settle(slab.rotation.y, tiltY);
    slab.updateMatrixWorld(true);
    glowPosition.set(cursor.x * width / 2, cursor.y * height / 2);
    glow.value += ((pointerInside && !view ? (inspected ? 1.7 : 1) : 0) - glow.value) * smooth;

    let hover = -1;
    if (pointerInside && !view && now - turnAt > 880) {
      ray.setFromCamera(cursor, camera);
      const hit = ray.intersectObjects(pieces.map(({ body }) => body), false)[0];
      if (hit) hover = pieces.findIndex((piece) => piece.body === hit.object);
    }

    if (!view && now - lastMesh > 27) {
      lastMesh = now;
      updateGeometry(now / 1000);
    }
    pieces.forEach((piece, index) => {
      const amount = clamp((now - turnAt - index * 25) / 720);
      const throwAmount = view ? amount ** 3 : (1 - amount) ** 3 - Math.sin(amount * Math.PI) * (1 - amount) * .055;
      const active = index === hover;
      const maximumLift = Math.max(9, (index === 0 ? 32 : 50) * scale.value);
      piece.speed += ((active ? maximumLift : 0) - piece.lift) * 170 * dt - piece.speed * 19 * dt;
      piece.lift += piece.speed * dt;
      const driftSide = piece.direction * width * .23;
      piece.group.position.set(piece.x + driftSide * throwAmount, piece.y - (height * .23 + index * 12) * throwAmount ** 2, piece.lift + throwAmount * (height * .55 + index * 33));
      piece.group.rotation.x = throwAmount * (index % 2 ? -2.5 : 2.1) + (active ? -cursor.y * .16 * piece.lift / maximumLift : 0);
      piece.group.rotation.y = throwAmount * piece.direction * .78 + (active ? cursor.x * .20 * piece.lift / maximumLift : 0);
      piece.group.visible = !view || amount < .9;
      piece.glass.iridescence += ((active ? .96 : .44) - piece.glass.iridescence) * smooth;
      piece.glass.envMapIntensity += ((active ? 1.9 : 1) - piece.glass.envMapIntensity) * smooth;
    });

    if (!view) {
      const points = corners.map(([x,y]) => {
        const world = new Vector3((x - .5) * blockWidth, (.5 - y) * blockHeight, 0).applyMatrix4(slab.matrixWorld).project(camera);
        return new Vector2((world.x + 1) * width / 2, (1 - world.y) * height / 2);
      });
      block.style.transform = mapOverlay(points, blockWidth, blockHeight);
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(frameAt);
  }

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch" || (event.target instanceof Element && event.target.closest("button"))) return;
    const bounds = stage.getBoundingClientRect();
    cursor.set((event.clientX - bounds.left) / width * 2 - 1, 1 - (event.clientY - bounds.top) / height * 2);
    pointerInside = true;
  };
  const onLeave = () => { pointerInside = false; };
  const onLost = (event: Event) => { event.preventDefault(); onError(); };
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("webglcontextlost", onLost);
  resize();

  return {
    resize,
    updateInk,
    setView(next: boolean) {
      if (next === view) return;
      view = next;
      turnAt = performance.now();
    },
    setInspection(next: boolean) { inspected = next; updateInk(); },
    setVisible(next: boolean) {
      visible = next;
      if (next && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(frameAt);
      } else if (!next) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    dispose() {
      destroyed = true;
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      block.style.transform = "";
      pieces.forEach(({ body, glass, face }) => { body.geometry.dispose(); glass.dispose(); face.geometry.dispose(); });
      environment.dispose();
      texture.dispose();
      printing.dispose();
      rim.dispose();
      renderer.dispose();
    },
  };
}
