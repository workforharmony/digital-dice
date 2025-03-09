let scene, camera, renderer, dice, rolling;
init();

function init() {
    const canvas = document.getElementById('diceCanvas');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    const loader = new THREE.GLTFLoader();
    loader.load('https://models.babylonjs.com/Dice/glTF/Dice.glb', function (gltf) {
        dice = gltf.scene;
        dice.scale.set(1.5, 1.5, 1.5);
        scene.add(dice);
    });

    rolling = false;
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

    const duration = 2500;
    const startTime = Date.now();

    const randomX = Math.PI * (4 + Math.random() * 2);
    const randomY = Math.PI * (4 + Math.random() * 2);
    const randomZ = Math.PI * (4 + Math.random() * 2);

    function animateDice() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            dice.rotation.x += 0.2;
            dice.rotation.y += 0.2;
            dice.rotation.z += 0.2;
            requestAnimationFrame(animate);
        } else {
            dice.rotation.set(randomX, randomY, randomZ);
            rolling = false;
        }
    }

    animate();

    function animate() {
        requestAnimationFrame(animateDice);
        renderer.render(scene, camera);
    }

    function animateDice() {
        if (rolling) animateRoll();
        renderer.render(scene, camera);
    }

    function animateDice() {
        requestAnimationFrame(animateDice);
        renderer.render(scene, camera);
    }
}

init();
