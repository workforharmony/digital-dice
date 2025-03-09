let scene, camera, renderer, dice, controls;
let rolling = false;

function init() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 3, 5);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    const diceTextures = [
        textureLoader.load('https://i.imgur.com/6YAnSgT.png'), // 1 dot
        textureLoader.load('https://i.imgur.com/YV6rTSQ.png'), // 2 dots
        textureLoader.load('https://i.imgur.com/AjPjP6U.png'), // 3 dots
        textureLoader.load('https://i.imgur.com/YPc0TFV.png'), // 4 dots
        textureLoader.load('https://i.imgur.com/2NqQAYJ.png'), // 5 dots
        textureLoader.load('https://i.imgur.com/NkE6kH6.png')  // 6 dots
    ];

    const materials = diceTextures.map(texture => new THREE.MeshStandardMaterial({ map: texture }));

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    dice = new THREE.Mesh(geometry, materials);
    scene.add(dice);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('click', rollDice);
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
    const targetRotationX = dice.rotation.x + Math.PI * (2 + Math.random() * 2);
    const targetRotationY = dice.rotation.y + Math.PI * (2 + Math.random() * 2);
    const targetRotationZ = dice.rotation.z + Math.PI * (2 + Math.random() * 2);

    function animateRoll() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            dice.rotation.x += 0.2;
            dice.rotation.y += 0.2;
            dice.rotation.z += 0.2;
            requestAnimationFrame(animateRoll);
        } else {
            dice.rotation.x = targetRotationX;
            dice.rotation.y = targetRotationY;
            dice.rotation.z = targetRotationZ;
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
