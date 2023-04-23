import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import GUI from 'lil-gui';

const gui = new GUI();

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/assets/6.png');

const scene = new THREE.Scene();
window.addEventListener('resize', () => {
// Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// Objects
//Particles
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

particlesGeometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
particlesGeometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    alphaMap: particleTexture,
    vertexColors: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);
// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 6;
scene.add(camera);

// renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0x0f0f0f, 1);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();

const tick = () => {
    // update objects
    controls.update();
    const elapsedTime = clock.getElapsedTime() * 1.5;
    /*
        camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
        camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
        camera.position.y = cursor.y * 5;
        camera.lookAt(cube1.position);*/
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();