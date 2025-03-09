let scene, camera, renderer, dice;
let rolling = false;

init();

function init() {
    const canvas = document.getElementById('diceCanvas');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000
    );
    camera.position.set(0, 1.5, 3.5);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    const loader = new THREE.GLTFLoader();
    loader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Dice.glb',
        function (gltf) {
            dice = gltf.scene;
            dice.scale.set(1.5, 1.5, 1.5);
            scene.add(dice);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    canvas.addEventListener('click', rollDice);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function rollDice() {
    if (rolling || !dice) return;
    rolling = true;

    const duration = 2000;
    const start = Date.now();
    const endRotationX = dice.rotation.x + Math.PI * (4 + Math.random() * 4);
    const endRotationY = dice.rotation.y + Math.PI * (4 + Math.random() * 4);
    const endRotationZ = dice.rotation.z + Math.PI * (4 + Math.random() * 4);

    function rollAnimation() {
        const elapsed = Date.now() - start;
        const progress = elapsed / duration;

        if (progress < 1) {
            dice.rotation.x += 0.2;
            dice.rotation.y += 0.2;
            dice.rotation.z += 0.2;
            requestAnimationFrame(rollAnimation);
        } else {
            dice.rotation.x = endRotationX;
            dice.rotation.y = endRotationY;
            dice.rotation.z = endRotationZ;
            rolling = false;
        }
    }

    rollAnimation();
}
