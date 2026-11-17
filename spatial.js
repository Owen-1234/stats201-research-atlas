import * as THREE from 'three';
import { OrbitControls } from './assets/vendor/three/OrbitControls.js';

const q = (selector) => document.querySelector(selector);
const clamp = THREE.MathUtils.clamp;
const radians = THREE.MathUtils.degToRad;

function coordinates(lat, lon, radius = 1) {
  return new THREE.Vector3(Math.cos(radians(lat)) * Math.cos(radians(lon)) * radius, Math.sin(radians(lat)) * radius, -Math.cos(radians(lat)) * Math.sin(radians(lon)) * radius);
}

function sceneFor(mount, background = null) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(background || '#000000', background ? 1 : 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.addEventListener('wheel', (event) => {
    if (!event.ctrlKey && !event.metaKey) event.stopImmediatePropagation();
  }, { capture: true, passive: true });
  mount.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(39, 1, 0.05, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.enableZoom = true;
  renderer.domElement.style.touchAction = 'pan-y';
  // Keep ordinary scrolling available; pinch and explicit buttons handle zoom.
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  const resize = new ResizeObserver(() => {
    const { width, height } = mount.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
  resize.observe(mount);
  return { renderer, scene, camera, controls, mount, resize };
}

function animateWhenVisible(host, context, tick) {
  let visible = false;
  let running = false;
  let lastTime = 0;
  function animate(time) {
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    tick(time, delta);
    context.controls.update(delta);
    context.renderer.render(context.scene, context.camera);
  }
  function sync() {
    const next = visible && !document.hidden;
    if (next === running) return;
    running = next;
    lastTime = 0;
    context.renderer.setAnimationLoop(next ? animate : null);
  }
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(host);
  document.addEventListener('visibilitychange', sync);
  addEventListener('pagehide', () => context.renderer.setAnimationLoop(null), { once: true });
  return sync;
}

function lineFrom(points, color, opacity = 1) {
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
}

function orbitToward(camera, target, amount) {
  const distance = THREE.MathUtils.lerp(camera.position.length(), target.length(), amount);
  const direction = camera.position.clone().normalize();
  const rotation = new THREE.Quaternion().setFromUnitVectors(direction, target.clone().normalize());
  direction.applyQuaternion(new THREE.Quaternion().slerp(rotation, amount));
  camera.position.copy(direction.multiplyScalar(distance));
}

function earthTexture(geojson) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#17383e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const drawRing = (ring) => {
    ring.forEach(([lon, lat], index) => {
      const x = (lon + 180) / 360 * canvas.width;
      const y = (90 - lat) / 180 * canvas.height;
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
  };
  for (const feature of geojson.features) {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    for (const polygon of polygons) {
      ctx.beginPath();
      polygon.forEach(drawRing);
      ctx.fillStyle = '#659487';
      ctx.fill('evenodd');
      ctx.strokeStyle = '#a5c4a0';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
  // Fine geographic rules belong on the surface, so they rotate with the land.
  ctx.strokeStyle = '#b4ccbb20';
  ctx.lineWidth = 0.65;
  for (let lon = 0; lon < 360; lon += 15) {
    const x = lon / 360 * canvas.width;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let lat = 15; lat < 180; lat += 15) {
    const y = lat / 180 * canvas.height;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function routeBetween(a, b) {
  const start = coordinates(a.lat, a.lon);
  const end = coordinates(b.lat, b.lon);
  const dot = clamp(start.dot(end), -1, 1);
  const angle = Math.acos(dot);
  const height = 0.06 + angle * 0.18;
  return Array.from({ length: 97 }, (_, i) => {
    const t = i / 96;
    const point = angle < 0.001 ? start.clone() : start.clone().multiplyScalar(Math.sin((1 - t) * angle) / Math.sin(angle)).add(end.clone().multiplyScalar(Math.sin(t * angle) / Math.sin(angle)));
    return point.normalize().multiplyScalar(1.012 + Math.sin(Math.PI * t) * height);
  });
}

export async function createGlobe({ cities, onSelect, reducedMotion }) {
  const response = await fetch('./assets/world-land.geojson');
  if (!response.ok) throw new Error('Bundled world geometry is unavailable.');
  const land = await response.json();
  const context = sceneFor(q('#globe-mount'));
  const { scene, camera, renderer, controls, mount } = context;
  camera.position.copy(coordinates(18, 110, 3.5));
  controls.minDistance = 2.55;
  controls.maxDistance = 5.4;
  controls.minPolarAngle = 0.28;
  controls.maxPolarAngle = Math.PI - 0.28;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.32;
  controls.rotateSpeed = 0.55;
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshPhongMaterial({ map: earthTexture(land), shininess: 9, specular: '#2e504c' }));
  scene.add(globe);
  scene.add(new THREE.AmbientLight('#c9dec8', 1.7));
  const key = new THREE.DirectionalLight('#f3e8c9', 2.3);
  key.position.set(-2, 3, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#86baab', 1.9);
  rim.position.set(2, 0, -3);
  scene.add(rim);
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.025, 64, 48), new THREE.ShaderMaterial({
    vertexShader: 'varying vec3 vNormal; varying vec3 vView; void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
    fragmentShader: 'varying vec3 vNormal; varying vec3 vView; void main(){float edge=pow(1.0-max(dot(vNormal,vView),0.0),3.4);gl_FragColor=vec4(0.48,0.77,0.66,edge*0.38);}',
    transparent: true, depthWrite: false,
  }));
  scene.add(atmosphere);
  const labels = [];
  const markers = [];
  const routePoints = [];
  cities.forEach((city, index) => {
    const position = coordinates(city.lat, city.lon, 1.018);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.018, 14, 10), new THREE.MeshBasicMaterial({ color: '#e5bf8e' }));
    marker.position.copy(position);
    marker.userData.city = city.id;
    markers.push(marker);
    scene.add(marker);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.026, 0.033, 32), new THREE.MeshBasicMaterial({ color: '#d7af7d', transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
    halo.position.copy(position);
    halo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
    scene.add(halo);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'globe-city-label';
    button.dataset.city = city.id;
    button.setAttribute('aria-label', `Focus globe on ${city.name}`);
    button.innerHTML = `<span>${city.number}</span>${city.name} ↗`;
    button.addEventListener('click', () => onSelect(city.id));
    q('#globe-labels').append(button);
    const leader = lineFrom([position, position.clone().multiplyScalar(1.08)], '#d4b78b', 0.6);
    scene.add(leader);
    labels.push({ city, element: button, position, halo, leader });
    if (index < cities.length - 1) {
      const points = routeBetween(city, cities[index + 1]);
      routePoints.push(points);
      scene.add(lineFrom(points, '#d2ac7d', 0.72));
    }
  });
  const movingDots = routePoints.map(() => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), new THREE.MeshBasicMaterial({ color: '#f4d7a8' }));
    scene.add(dot);
    return dot;
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.24, 1.242, 160), new THREE.MeshBasicMaterial({ color: '#95bfa0', transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  let target = null;
  let selected = cities[0].id;
  const autoButton = q('#globe-rotate');
  function setAuto(value) {
    controls.autoRotate = value;
    autoButton.setAttribute('aria-pressed', String(value));
    autoButton.setAttribute('aria-label', value ? 'Pause globe rotation' : 'Start globe rotation');
    autoButton.textContent = value ? 'Ⅱ' : '▷';
  }
  setAuto(!reducedMotion);
  controls.addEventListener('start', () => { target = null; setAuto(false); });
  autoButton.addEventListener('click', () => { target = null; setAuto(!controls.autoRotate); });
  q('#globe-reset').addEventListener('click', () => { target = coordinates(18, 110, 3.5); setAuto(!reducedMotion); });
  function zoom(factor) {
    target = camera.position.clone().normalize().multiplyScalar(clamp(camera.position.length() * factor, controls.minDistance, controls.maxDistance));
    setAuto(false);
  }
  q('#globe-zoom-in').addEventListener('click', () => zoom(0.86));
  q('#globe-zoom-out').addEventListener('click', () => zoom(1.16));
  const raycaster = new THREE.Raycaster();
  let pointerStart;
  renderer.domElement.addEventListener('pointerdown', (event) => { pointerStart = [event.clientX, event.clientY]; });
  renderer.domElement.addEventListener('pointerup', (event) => {
    if (!pointerStart || Math.hypot(event.clientX - pointerStart[0], event.clientY - pointerStart[1]) > 6) return;
    const rect = mount.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = raycaster.intersectObjects(markers)[0];
    if (hit) onSelect(hit.object.userData.city);
  });
  const projected = new THREE.Vector3();
  animateWhenVisible(q('#globe-experience'), context, (time, delta) => {
    if (target) {
      orbitToward(camera, target, reducedMotion ? 1 : 1 - Math.exp(-delta * 5));
      if (camera.position.distanceTo(target) < 0.003) { camera.position.copy(target); target = null; }
    }
    const { width, height } = mount.getBoundingClientRect();
    const view = camera.position.clone().normalize();
    const compact = width < 430;
    for (const { city, element, position, halo } of labels) {
      const visible = position.clone().normalize().dot(view) > 0.23;
      element.hidden = !visible;
      if (!visible) continue;
      projected.copy(position).project(camera);
      const [dx, dy] = city.offset;
      const labelX = clamp((projected.x * 0.5 + 0.5) * width + dx * (compact ? 0.6 : 1), 50, width - 58);
      const labelY = clamp((-projected.y * 0.5 + 0.5) * height + dy * (compact ? 0.65 : 1), 105, height - 105);
      element.style.transform = `translate(${labelX}px,${labelY}px) translate(-50%,-50%)`;
      const pulse = reducedMotion ? 1 : 1 + Math.sin(time * 0.0018) * 0.15;
      halo.scale.setScalar(city.id === selected ? pulse * 1.2 : 1);
    }
    movingDots.forEach((dot, index) => {
      const points = routePoints[index];
      const t = reducedMotion ? 0.5 : ((time * 0.000055 + index * 0.27) % 1);
      const position = t * (points.length - 1);
      const lower = Math.floor(position);
      dot.position.copy(points[lower]).lerp(points[Math.min(lower + 1, points.length - 1)], position - lower);
    });
  });
  q('#globe-loading').hidden = true;
  return {
    select(id, focus) {
      selected = id;
      if (focus) {
        const city = cities.find((item) => item.id === id);
        target = coordinates(city.lat + 4, city.lon - 4, 3.35);
        setAuto(false);
      }
      markers.forEach((marker) => marker.scale.setScalar(marker.userData.city === id ? 1.35 : 1));
    },
  };
}

export function createLandscape({ reducedMotion }) {
  const evidence = window.SolarEvalEvidence;
  if (!evidence?.records?.length) throw new Error('Recorded evaluation evidence is missing.');
  const context = sceneFor(q('#spatial-mount'));
  const { scene, camera, controls, renderer, mount } = context;
  const names = { static: 'Static', random: 'Random', myopic: 'Myopic', ppo: 'PPO', sac: 'SAC', dqn: 'DQN' };
  const colors = { static: '#9baca1', random: '#bda989', myopic: '#8f91a2', ppo: '#4383a0', sac: '#4a9271', dqn: '#c39955' };
  const allPolicies = Object.keys(names);
  let setting = q('#spatial-setting').value, policy = 'all', detailMode = 'episodes', rangeMode = 'focused';
  let records = evidence.records.filter(record => record.setting === setting);
  function meanRows(rows) {
    const groups = new Map();
    rows.forEach(record => { const key = `${record.setting}:${record.policy}`; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(record); });
    return [...groups.values()].map(group => ({ policy: group[0].policy, setting: group[0].setting, n: group.length, ...Object.fromEntries(['reward','violation','liquidity'].map(key => [key,group.reduce((sum,record)=>sum+record[key],0)/group.length])) }));
  }
  const domain = (key) => {
    const source = rangeMode === 'shared' ? evidence.records : records;
    const values = (detailMode === 'means' ? meanRows(source) : source).map(record => record[key]);
    const min = Math.min(...values), max = Math.max(...values), span = max - min || Math.max(Math.abs(min) * .1, .001);
    const padding = span * .16;
    return [key === 'reward' ? min - padding : Math.max(0, min - padding), key === 'violation' ? Math.min(1, max + padding) : max + padding];
  };
  let domains = { violation: domain('violation'), reward: domain('reward'), liquidity: domain('liquidity') };
  const scale = (value, key) => (value - domains[key][0]) / (domains[key][1] - domains[key][0]) * 2.4;
  const positionOf = (record) => new THREE.Vector3(scale(record.violation, 'violation') - 1.2, scale(record.reward, 'reward') - 1.2, scale(record.liquidity, 'liquidity') - 1.2);
  controls.target.set(0, 0, 0);
  controls.minDistance = 3.8;
  controls.maxDistance = 11;
  controls.maxPolarAngle = Math.PI * 0.85;
  camera.position.set(4.3, 3.2, 4.8);
  camera.fov = 39;
  camera.updateProjectionMatrix();
  const home = camera.position.clone();
  const grid = new THREE.GridHelper(2.4, 4, '#a5b49a', '#d7dfcf');
  grid.position.y = -1.2;
  scene.add(grid);
  const gridPoints = [];
  for (let i = 0; i <= 4; i++) {
    const v = -1.2 + i * 0.6;
    gridPoints.push(new THREE.Vector3(-1.2, v, -1.2), new THREE.Vector3(1.2, v, -1.2));
    gridPoints.push(new THREE.Vector3(-1.2, v, -1.2), new THREE.Vector3(-1.2, v, 1.2));
    gridPoints.push(new THREE.Vector3(v, -1.2, -1.2), new THREE.Vector3(v, 1.2, -1.2));
    gridPoints.push(new THREE.Vector3(-1.2, -1.2, v), new THREE.Vector3(-1.2, 1.2, v));
  }
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPoints), new THREE.LineBasicMaterial({ color: '#c9d4bf', transparent: true, opacity: 0.55 })));
  [
    [new THREE.Vector3(-1.2, -1.2, 1.2), new THREE.Vector3(1.38, -1.2, 1.2)],
    [new THREE.Vector3(-1.2, -1.2, 1.2), new THREE.Vector3(-1.2, 1.38, 1.2)],
    [new THREE.Vector3(1.2, -1.2, 1.2), new THREE.Vector3(1.2, -1.2, -1.38)],
  ].forEach((points) => scene.add(lineFrom(points, '#8d9f7c', 0.8)));

  const axisLabels = [];
  function label(text, position, kind = 'tick', key = null, fraction = 0) {
    const element = document.createElement('span');
    element.textContent = text;
    element.dataset.kind = kind;
    q('#spatial-axis-labels').append(element);
    axisLabels.push({ element, position, key, fraction });
  }
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const at = (key) => domains[key][0] + (domains[key][1] - domains[key][0]) * t;
    label('', new THREE.Vector3(-1.2 + t * 2.4, -1.35, 1.24), 'tick', 'violation', t);
    label('', new THREE.Vector3(-1.43, -1.2 + t * 2.4, 1.2), 'tick', 'reward', t);
    if (i > 0) label('', new THREE.Vector3(1.38, -1.25, 1.2 - t * 2.4), 'tick', 'liquidity', t);
  }
  label('Physics violation rate (%) →', new THREE.Vector3(0.1, -1.65, 1.3), 'title');
  label('Cumulative reward ↑', new THREE.Vector3(-1.15, 1.65, 1.2), 'title');
  label('Artificial liquidity (MWh) →', new THREE.Vector3(1.5, -1.55, -0.2), 'title');

  const geometry = new THREE.BufferGeometry();
  const shader = new THREE.ShaderMaterial({
    uniforms: { pixelRatio: { value: Math.min(devicePixelRatio || 1, 1.75) } },
    vertexShader: 'attribute vec3 color; attribute float pointSize; varying vec3 vColor; uniform float pixelRatio; void main(){vColor=color;vec4 p=modelViewMatrix*vec4(position,1.0);gl_PointSize=pointSize*pixelRatio*(5.0/-p.z);gl_Position=projectionMatrix*p;}',
    fragmentShader: 'varying vec3 vColor;void main(){float d=length(gl_PointCoord-0.5);if(d>0.5)discard;float a=1.0-smoothstep(0.35,0.5,d);gl_FragColor=vec4(vColor,a*0.86);}',
    transparent: true, depthWrite: false,
  });
  const cloud = new THREE.Points(geometry, shader);
  scene.add(cloud);
  scene.add(new THREE.AmbientLight('#eaf6dc', 2.4));
  const meanLight = new THREE.DirectionalLight('#fff3d1', 2.5); meanLight.position.set(-3,5,4); scene.add(meanLight);
  const meanLabelMount = document.createElement('div'); meanLabelMount.className = 'spatial-mean-labels'; q('#spatial-stage').append(meanLabelMount);
  const meanGeometry = new THREE.SphereGeometry(.067, 24, 18);
  const meanNodes = allPolicies.map(item => {
    const sphere = new THREE.Mesh(meanGeometry, new THREE.MeshPhongMaterial({color:colors[item],shininess:65,specular:'#d3e8c7'}));
    sphere.userData.policy = item; scene.add(sphere);
    const stem = lineFrom([new THREE.Vector3(),new THREE.Vector3()],colors[item],.35); scene.add(stem);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.055,.066,32),new THREE.MeshBasicMaterial({color:colors[item],transparent:true,opacity:.55,side:THREE.DoubleSide})); ring.rotation.x=-Math.PI/2; scene.add(ring);
    const element = document.createElement('button'); element.type='button';element.textContent=names[item];element.style.setProperty('--policy-color',colors[item]);element.setAttribute('aria-label',`Select ${names[item]} policy mean`);element.addEventListener('click',()=>choosePolicy(item));meanLabelMount.append(element);
    return {policy:item,sphere,stem,ring,element};
  });
  const selection = new THREE.Mesh(new THREE.SphereGeometry(0.039, 16, 12), new THREE.MeshBasicMaterial({ color: '#d89554', wireframe: true }));
  selection.visible = false;
  scene.add(selection);
  let selectedRecord = null;
  let cameraTarget = null;
  const backdrop = new THREE.Color('#eef2e6');
  const recordPickerLabel = document.createElement('label');
  recordPickerLabel.className = 'spatial-episode-label';
  recordPickerLabel.htmlFor = 'spatial-episode';
  recordPickerLabel.textContent = 'Inspect a recorded episode';
  const recordPicker = document.createElement('select');
  recordPicker.id = 'spatial-episode';
  recordPicker.setAttribute('aria-label', 'Inspect a recorded episode');
  recordPickerLabel.append(recordPicker);
  q('#spatial-policies').after(recordPickerLabel);

  function availablePolicies() { return allPolicies.filter((item) => records.some((record) => record.policy === item)); }
  function updatePicker() {
    const candidates = policy === 'all' ? [] : records.filter((record) => record.policy === policy);
    recordPicker.disabled = candidates.length === 0;
    recordPicker.innerHTML = `<option value="">${candidates.length ? 'Policy summary · 90 episodes' : 'Select a policy to inspect episodes'}</option>` + candidates.map((record) => `<option value="${evidence.records.indexOf(record)}">Seed ${String(record.run).slice(-2)} · episode ${String(record.episode).padStart(2, '0')}</option>`).join('');
    if (selectedRecord) recordPicker.value = String(evidence.records.indexOf(selectedRecord));
  }
  function renderReadout() {
    const rows = records.filter((record) => policy === 'all' || record.policy === policy);
    const mean = (key) => rows.reduce((sum, record) => sum + record[key], 0) / rows.length;
    if (selectedRecord) {
      const record = selectedRecord;
      q('#spatial-readout').innerHTML = `<span>ONE RECORDED EPISODE</span><h4>${names[record.policy]} · ${String(record.episode).padStart(2, '0')}</h4><p>Training seed ${record.run}</p><dl><dt>Reward</dt><dd>${record.reward.toFixed(2)}</dd><dt>Physics violations</dt><dd>${(record.violation * 100).toFixed(2)}%</dd><dt>Artificial liquidity</dt><dd>${record.liquidity.toFixed(4)} MWh</dd><dt>Slippage</dt><dd>${(record.slippage * 100).toFixed(2)}%</dd></dl>`;
    } else if (policy !== 'all') {
      q('#spatial-readout').innerHTML = `<span>90 EPISODES / POLICY MEANS</span><h4>${names[policy]}</h4><dl><dt>Reward</dt><dd>${mean('reward').toFixed(2)}</dd><dt>Physics violations</dt><dd>${(mean('violation') * 100).toFixed(2)}%</dd><dt>Artificial liquidity</dt><dd>${mean('liquidity').toFixed(4)} MWh</dd></dl>`;
    } else {
      q('#spatial-readout').innerHTML = `<span>${detailMode === 'means' ? 'POLICY AVERAGES' : 'INDIVIDUAL EPISODES'}</span><h4>Find the trade-offs.</h4><p>${detailMode === 'means' ? 'Each sphere is a policy mean from 90 recorded episodes. Select a sphere, then inspect the original episodes.' : 'Each dot is one original recorded episode. Select a policy or choose an episode for exact values.'}</p>`;
    }
    q('#spatial-clear').hidden = !selectedRecord;
  }
  function renderPoints() {
    domains = { violation: domain('violation'), reward: domain('reward'), liquidity: domain('liquidity') };
    axisLabels.forEach(({element,key,fraction})=>{if(!key)return;const factor=key==='violation'?100:1,span=(domains[key][1]-domains[key][0])*factor;const digits=Math.min(6,Math.max(key==='liquidity'?3:1,Math.ceil(-Math.log10(Math.max(span/4,1e-10)))));const value=(domains[key][0]+fraction*(domains[key][1]-domains[key][0]))*factor;element.textContent=value.toFixed(digits)+(key==='violation'?'%':'');});
    document.querySelectorAll('[data-spatial-detail]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.spatialDetail===detailMode)));
    document.querySelectorAll('[data-spatial-scale]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.spatialScale===rangeMode)));
    q('#spatial-scale-note').textContent=rangeMode==='focused'?`Focused axes · ranges fit this experiment’s ${detailMode==='means'?'policy means':'recorded episodes'}. Baselines need not begin at zero.`:'Shared axes · identical ranges across experiments. Reward definitions still differ between penalty settings.';
    q('#spatial-count').textContent=detailMode==='means'?`${availablePolicies().length} policy means · ${records.length} episodes`:`${records.length} recorded episodes`;
    cloud.visible=detailMode==='episodes';
    const means=meanRows(records);
    meanNodes.forEach(node=>{
      const row=means.find(item=>item.policy===node.policy),visible=detailMode==='means'&&Boolean(row),active=policy==='all'||policy===node.policy;
      node.sphere.visible=node.stem.visible=node.ring.visible=visible;node.element.hidden=!visible;
      if(!row)return;
      const point=positionOf(row),ground=point.clone();ground.y=-1.195;
      node.sphere.position.copy(point);node.sphere.scale.setScalar(policy===node.policy?1.35:1);
      const color=new THREE.Color(colors[node.policy]);if(!active)color.lerp(backdrop,.58);node.sphere.material.color.copy(color);
      node.stem.geometry.setFromPoints([ground,point]);node.stem.material.opacity=active?.45:.12;node.ring.position.copy(ground);node.ring.material.opacity=active?.55:.15;
      node.element.setAttribute('aria-pressed',String(policy===node.policy));node.element.style.opacity=active?'1':'.65';
    });
    const positions = [], pointColors = [], sizes = [];
    records.forEach((record) => {
      positions.push(...positionOf(record).toArray());
      const active = policy === 'all' || record.policy === policy;
      const color = new THREE.Color(colors[record.policy]);
      if (!active) color.lerp(backdrop, 0.62);
      pointColors.push(...color.toArray());
      sizes.push(record === selectedRecord ? 12 : active ? 6.5 : 4);
    });
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));
    geometry.setAttribute('pointSize', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.computeBoundingSphere();
    selection.visible = detailMode === 'episodes' && Boolean(selectedRecord);
    if (selectedRecord) selection.position.copy(positionOf(selectedRecord));
    document.querySelectorAll('[data-spatial-policy]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.spatialPolicy === policy)));
    renderReadout();
    updatePicker();
  }
  function choosePolicy(next) { policy = next; selectedRecord = null; renderPoints(); }
  function setSetting(next) {
    setting = next;
    records = evidence.records.filter((record) => record.setting === setting);
    if (!availablePolicies().includes(policy)) policy = 'all';
    selectedRecord = null;
    q('#spatial-count').textContent = `${records.length} recorded episodes`;
    q('#spatial-policies').innerHTML = `<button type="button" data-spatial-policy="all" aria-pressed="${policy === 'all'}"><i style="--policy-color:#788e6a"></i>All policies<small>${records.length}</small></button>` + availablePolicies().map((item) => `<button type="button" data-spatial-policy="${item}" aria-pressed="${policy === item}" style="--policy-color:${colors[item]}"><i></i>${names[item]}<small>90</small></button>`).join('');
    renderPoints();
  }
  document.querySelectorAll('[data-spatial-detail]').forEach(button=>button.addEventListener('click',()=>{detailMode=button.dataset.spatialDetail;selectedRecord=null;renderPoints();}));
  document.querySelectorAll('[data-spatial-scale]').forEach(button=>button.addEventListener('click',()=>{rangeMode=button.dataset.spatialScale;renderPoints();}));
  q('#spatial-policies').addEventListener('click', (event) => { const button = event.target.closest('[data-spatial-policy]'); if (button) choosePolicy(button.dataset.spatialPolicy); });
  q('#spatial-setting').addEventListener('change', (event) => setSetting(event.target.value));
  q('#spatial-clear').addEventListener('click', () => { selectedRecord = null; renderPoints(); });
  recordPicker.addEventListener('change', () => { selectedRecord = recordPicker.value ? evidence.records[Number(recordPicker.value)] : null; if(selectedRecord)detailMode='episodes'; renderPoints(); });
  q('#spatial-home').addEventListener('click', () => { cameraTarget = home.clone(); });
  q('#spatial-front').addEventListener('click', () => { cameraTarget = new THREE.Vector3(0.05, 0.25, 7); });
  controls.addEventListener('start', () => { cameraTarget = null; });
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.055;
  let pointerStart;
  renderer.domElement.addEventListener('pointerdown', (event) => { pointerStart = [event.clientX, event.clientY]; });
  renderer.domElement.addEventListener('pointerup', (event) => {
    if (!pointerStart || Math.hypot(event.clientX - pointerStart[0], event.clientY - pointerStart[1]) > 6) return;
    const rect = mount.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    if(detailMode==='means'){const hit=raycaster.intersectObjects(meanNodes.map(node=>node.sphere).filter(mesh=>mesh.visible))[0];if(hit)choosePolicy(hit.object.userData.policy);return;}
    const hit = raycaster.intersectObject(cloud).find((item) => policy === 'all' || records[item.index].policy === policy);
    if (hit) { selectedRecord = records[hit.index]; policy = selectedRecord.policy; renderPoints(); }
  });
  const projected = new THREE.Vector3();
  animateWhenVisible(q('#spatial-lab'), context, (_time, delta) => {
    if (cameraTarget) {
      camera.position.lerp(cameraTarget, reducedMotion ? 1 : 1 - Math.exp(-delta * 5));
      if (camera.position.distanceTo(cameraTarget) < 0.003) { camera.position.copy(cameraTarget); cameraTarget = null; }
    }
    const { width, height } = mount.getBoundingClientRect();
    axisLabels.forEach(({ element, position }) => {
      projected.copy(position).project(camera);
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      const title = element.dataset.kind === 'title';
      element.hidden = projected.z > 1 || (!title && (x < 18 || x > width - 18 || y < 55 || y > height - 55));
      const halfWidth = title ? element.offsetWidth / 2 : 0;
      element.style.left = `${title ? clamp(x, halfWidth + 9, width - halfWidth - 9) : x}px`;
      element.style.top = `${title ? clamp(y, 56, height - 45) : y}px`;
    });
    if(detailMode==='means'){
      const placed=[];
      meanNodes.filter(node=>node.sphere.visible).forEach(node=>{
        projected.copy(node.sphere.position).project(camera);
        let x=clamp((projected.x*.5+.5)*width+35,42,width-44),y=clamp((-projected.y*.5+.5)*height-21,65,height-63);
        for(const previous of placed){if(Math.abs(x-previous.x)<66&&Math.abs(y-previous.y)<24)y=clamp(previous.y+26,65,height-55);}
        node.element.hidden=projected.z>1;node.element.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;placed.push({x,y});
      });
    }
  });
  setSetting(setting);
  q('#spatial-loading').hidden = true;
}
