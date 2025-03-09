let scene, camera, renderer, dice;
let rolling = false;

function init() {
    const canvas = document.getElementById('diceCanvas');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 1.5, 4);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const loader = new THREE.GLTFLoader();
    loader.load('https://cdn.jsdelivr.net/gh/Rajavasanthan/3D-Dice@main/dice.glb', function (gltf) {
        dice = gltf.scene;
        dice.scale.set(0.5, 0.5, 0.5);
        scene.add(dice);
    });

    canvas.addEventListener('click', rollDice);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function rollDice() {
    if (rolling) return;
    rolling = true;

    const rollTime = 2000;
    const startTime = Date.now();

    const endX = dice.rotation.x + Math.PI * (4 + Math.random() * 4);
    const endY = dice.rotation.y + Math.PI * (4 + Math.random() * 4);
    const endZ = dice.rotation.z + Math.PI * (4 + Math.random() * 4);

    function animateRoll() {
        const elapsed = Date.now() - startTime;
        const fraction = elapsed / rollTime;

        if (fraction < 1) {
            dice.rotation.x += 0.2;
            dice.rotation.y += 0.2;
            dice.rotation.z += 0.2;
            requestAnimationFrame(rollAnimation);
        } else {
            dice.rotation.x = endX;
            dice.rotation.y = endY;
            rolling = false;
        }
    }

    rollAnimation();

    function rollAnimation() {
        requestAnimationFrame(animateDice);
        renderer.render(scene, camera);
    }

    function rollAnimation() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}

init();
