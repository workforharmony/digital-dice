let scene, camera, renderer, dice;
let isRolling = false;

function init() {
    const canvas = document.getElementById('diceCanvas');

    // Create scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        50,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Resize handling for perfect responsiveness
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    // Dice geometry and appearance
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const diceMaterials = [
        new THREE.MeshBasicMaterial({ color: '#ff5555' }), // Side 1
        new THREE.MeshBasicMaterial({ color: '#55ff55' }), // Side 2
        new THREE.MeshBasicMaterial({ color: '#5555ff' }), // Side 3
        new THREE.MeshBasicMaterial({ color: '#ffff55' }), // Side 4
        new THREE.MeshBasicMaterial({ color: '#55ffff' }), // Side 5
        new THREE.MeshBasicMaterial({ color: '#ff55ff' }), // Side 6
    ];

    dice = new THREE.Mesh(geometry, diceMaterials);
    scene.add(dice);

    animate();

    // Click or tap listener to roll dice
    canvas.addEventListener('click', rollDice);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function rollDice() {
    if (isRolling) return;
    isRolling = true;

    const rollDuration = 2000; // Rolling for 2 seconds
    const randomRotationX = Math.PI * 4 + Math.random() * Math.PI * 2;
    const randomRotationY = Math.PI * 4 + Math.random() * Math.PI * 2;

    const initialRotationX = dice.rotation.x;
    const initialRotationY = dice.rotation.y;

    const startTime = Date.now();

    function animateRoll() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / rollDuration;

        if (progress < 1) {
            dice.rotation.x = initialRotationX + randomRotationX * progress;
            dice.rotation.y = initialRotationY + randomRotationY * progress;
            requestAnimationFrame(animateRoll);
        } else {
            dice.rotation.x = initialRotationX + randomRotationX;
            dice.rotation.y = initialRotationY + randomRotationY;
            isRolling = false;
        }
    }

    animateRoll();
}

init();
