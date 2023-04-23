import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import GUI from 'lil-gui';

const gui = new GUI();

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

// Tetxture loader
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('/assets/door.jpg');
// Canvas
const fog = new THREE.Fog('#262837', 1, 20);
scene.fog = fog;

// Ambiant light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
scene.add(ambientLight);

// Point light
const pointLight = new THREE.PointLight(0xffff34a, 1, 10);
pointLight.position.set(0, 2.3, 2.7);
scene.add(pointLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.12);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.01);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.01);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.01);
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.01);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 5;
directionalLight.shadow.camera.left = -1.5;
directionalLight.shadow.camera.right = 1.5;
directionalLight.shadow.camera.top = 1.5;
directionalLight.shadow.camera.bottom = -1.5;

scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);
directionalLightCameraHelper.visible = false;

// House
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        color: '#ac8e82'
    })
);
walls.position.y = 2.5 / 2 + 0.01;
// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        color: '#b35f45',
        //wireframe: true
    })
);
roof.position.y = 2.5 + 1.5 / 2;
roof.rotation.y = Math.PI * 0.25;
// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        side: THREE.DoubleSide,
        //wireframe: true
    })
);
door.position.z = 2 + 0.01;
door.position.y = 1;
// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#89c854'
});
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

// Tomb
const tombs = new THREE.Group();
scene.add(tombs);

for (let i = 0; i < 50; i++) {
    const tomb = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.7, 0.3),
        new THREE.MeshStandardMaterial({
            color: '#6a6866',
        }
    ));
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    tomb.position.x = Math.cos(angle) * radius;
    tomb.position.z = Math.sin(angle) * radius;
    tomb.position.y = 0.7 / 2 + 0.01;
    tomb.rotation.y = (Math.random() - 0.5) * 0.4;
    tomb.rotation.z = (Math.random() - 0.5) * 0.4;
    tombs.add(tomb);
}

house.add(walls, roof, door, bush1, bush2, bush3, bush4);
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: '#a9c388',
        side: THREE.DoubleSide
    })
);

floor.rotation.x = - Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);
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
renderer.setClearColor('#262837');

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