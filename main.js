// Naziya = 'naziya'
import './style.css'
import * as THREE from "three";
import earth from './textures/Color_Map2k.jpg';
import cloud from './textures/earthcloud.png';
import specular from './textures/specular.jpg';
import bumpy from './textures/bump.jpg';
import gsap from 'gsap';

let width, height;

if (window.innerWidth <= 570) {
  width = 400;
  height = 400;
} else {
  width = 550;
  height = 550;
}

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
function SphereGenerator(radius, map, specularMap, bumpMap, transparent, opacity, position, scene, wireframe) {
  const geometry = new THREE.SphereGeometry(radius, 64, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: map,
    specularMap: specularMap,
    bumpMap: bumpMap,
    bumpScale: 0.05,
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
const directionalLight = DirectionalLightGenerator(0xffffff, 2, scene, [15, 15, 15]);

// PointLight
const pointLight = PointLightGenerator(0xffffff, 2, 100, scene, [1, 1, 0])

// Ambient Light
const al = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(al);


// Sphere Earth
const specularMap = textureLoader.load(specular)
const bump = textureLoader.load(bumpy)
// GlobeSphere
const sphere = SphereGenerator(1.9, textureLoader.load(earth), specularMap, bump, false, 'default', [0, 0, 0], scene, false);
sphere.rotation.y = 2.2;
sphere.rotation.x = .2;
sphere.rotation.z = 0.2;
rotateObjectOnMouseMove(sphere)

// CloudSphere
const sphere2 = SphereGenerator(2, textureLoader.load(cloud), null, null, true, 1.3, [0, 0, 0], scene, false);

var tl = gsap.timeline();
tl.fromTo(
  [sphere.scale, sphere2.scale], { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1, ease: 'power2.out' }

);

let lastScrollPosition = 0;
window.addEventListener('scroll', function () {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollPosition > lastScrollPosition) {
    sphere.rotation.y += 0.05;
  } else if (currentScrollPosition < lastScrollPosition) {
    sphere.rotation.y += -0.05;
  }

  lastScrollPosition = currentScrollPosition;
});



// Animation
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.0015;
  sphere2.rotation.y += 0.005;

  renderer.render(scene, camera);
};
animate();

// Windows Resizer
function onWindowResize() {
  if (window.innerWidth <= 570) {
    const width1 = 400;
    const height1 = 400;
    camera.aspect = width1 / height1;
    camera.updateProjectionMatrix();
    renderer.setSize(width1, height1);
  } else {
    const width1 = 550
    const height1 = 550
    camera.aspect = width1 / height1;
    camera.updateProjectionMatrix();
    renderer.setSize(width1, height1);
  }
}
window.addEventListener('resize', onWindowResize)
