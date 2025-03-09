import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";

let scene, camera, renderer, dice, controls;
let rolling = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 3, 5);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    const diceTextures = [
        textureLoader.load("https://raw.githubusercontent.com/workforharmony/digital-dice/main/images/inverted-dice-1.png"),
        textureLoader.load("https://raw.githubusercontent.com/workforharmony/digital-dice/main/images/inverted-dice-2.png"),
        textureLoader.load("https://raw.githubusercontent.com/workforharmony/digital-dice/main/images/inverted-dice-3.png"),
        textureLoader.load("https://raw.githubusercontent.com/workforharmony/digital-dice/main/images/inverted-dice-4.png"),
        textureLoader.load("https://raw.githubusercontent.com/workforharmony/digital-dice/main/images/inverted-dice-5.png"),
        textureLoader.load("https://raw.githubusercontent.com/workforharmony/digital-dice/main/images/inverted-dice-6.png")
    ];

    const materials = diceTextures.map(texture => new THREE.MeshStandardMaterial({ map: texture }));

    const geometry = new RoundedBoxGeometry(1, 1, 1, 10, 0.2);
    dice = new THREE.Mesh(geometry, materials);
    scene.add(dice);

    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("click", rollDice);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function rollDice() {
    if (rolling) return;
    rolling = true;

    const duration = 2000;
    const startTime = Date.now();

    const finalFace = Math.floor(Math.random() * 6) + 1;
    
    const faceRotations = {
        1: { x: 0, y: 0, z: 0 },
        2: { x: 0, y: Math.PI / 2, z: 0 },
        3: { x: -Math.PI / 2, y: 0, z: 0 },
        4: { x: Math.PI / 2, y: 0, z: 0 },
        5: { x: 0, y: -Math.PI / 2, z: 0 },
        6: { x: Math.PI, y: 0, z: 0 }
    };

    const { x: endX, y: endY, z: endZ } = faceRotations[finalFace];

    function animateRoll() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            dice.rotation.x += 0.2;
            dice.rotation.y += 0.2;
            dice.rotation.z += 0.2;
            requestAnimationFrame(animateRoll);
        } else {
            dice.rotation.x = endX;
            dice.rotation.y = endY;
            dice.rotation.z = endZ;
            rolling = false;
        }
    }

    animateRoll();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
