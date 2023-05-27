// Naziya = 'naziya'
import './style.css'
import * as THREE from "three";
import earth from './textures/Color_Map2k.jpg';
import cloud from './textures/earthcloud.png';

// Width Height
// let element = document.getElementById("headerheight");
// let elemheight = element.offsetHeight;
// let title = document.getElementById('title')
// title.style.height = `calc(100vh - ${elemheight}px)`;

const width = window.innerWidth-17;
const height = window.innerHeight-190;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 0, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(2);

// CanvasSize
renderer.setSize(width, height);
const firstsection = document.getElementById('firstsection');
const firstChild = firstsection.firstChild;
firstsection.insertBefore(renderer.domElement, firstChild);

// GlobeTexture
const textureLoader = new THREE.TextureLoader();

// DirectionalLightGenerator
function DirectionalLightGenerator(color, intensity, scene, position) {
  const directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  directionalLight.position.set(...position);
  return directionalLight;
};

// PointLightGenerator
function PointLightGenerator(color, intensity, far, scene, position) {
  const pointLight = new THREE.PointLight(color, intensity, far);
  pointLight.position.set(...position);
  scene.add(pointLight);
  pointLight.castShadow = true;
}

// SphereGenerator
function SphereGenerator(radius, map, transparent, opacity, position, scene, wireframe) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: map,
    transparent: transparent,
    opacity: opacity,
    wireframe: wireframe
  })
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  sphere.position.set(...position)
  sphere.castShadow = true;
  return sphere
};

// RotateObjectFunction
function rotateObjectOnMouseMove(obj) {
  let mouse = new THREE.Vector2();
  let lastMouse = new THREE.Vector2();
  renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

  function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    lastMouse.copy(mouse);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

  }

  function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;

    let deltaX = mouse.x - lastMouse.x;
    let angle = Math.sqrt(deltaX * deltaX) * Math.PI;
    let axis = new THREE.Vector3(0, deltaX, 0).normalize();

    obj.rotateOnAxis(axis, angle);
    lastMouse.copy(mouse);
  }

  function onDocumentMouseUp() {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
  }
};

// DirectionalLight
DirectionalLightGenerator(0xffffff, 2.6, scene, [15, 15, 15]);

// PointLight
PointLightGenerator(0xffffff, 2, 100, scene, [1, 1, 0])

// GlobeSphere
const sphere = SphereGenerator(1.8, textureLoader.load(earth), false, 'default', [0, 0, 0], scene, false);
rotateObjectOnMouseMove(sphere)

// CloudSphere
const sphere2 = SphereGenerator(1.9, textureLoader.load(cloud), true, 1.3, [0, 0, 0], scene, false);

// Animation
function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.002;
  sphere2.rotation.y += 0.005;

  renderer.render(scene, camera);
};
animate();

// Windows Resizer
function onWindowResize() {
  const width1 = window.innerWidth-17
  const height1 = window.innerHeight
  camera.aspect = width1 / height1;
  camera.updateProjectionMatrix();
  renderer.setSize(width1, height1);
}
window.addEventListener('resize', onWindowResize)
