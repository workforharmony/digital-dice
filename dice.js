let scene, camera, renderer, dice;
let rolling = false;

function init() {
    const canvas = document.getElementById('diceCanvas');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 7);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    const diceMaterials = [
        createDiceFace('1'),
        createDiceFace('2'),
        createDiceFace('3'),
        createDiceFace('4'),
        createDiceFace('5'),
        createDiceFace('6'),
    ];

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    dice = new THREE.Mesh(geometry, diceMaterials);
    scene.add(dice);

    canvas.addEventListener('click', rollDice);

    animate();
}

function createDiceFace(number) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'bold 150px Arial';
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshBasicMaterial({ map: texture });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function rollDice() {
    if (rolling) return;
    rolling = true;

    const duration = 2000;
    const start = Date.now();
    const endRotationX = dice.rotation.x + Math.PI * (4 + Math.random() * 4);
    const endRotationY = dice.rotation.y + Math.PI * (4 + Math.random() * 4);

    function rollAnimation() {
        const now = Date.now();
        const elapsed = now - start;
        const fraction = elapsed / duration;

        if (fraction < 1) {
            dice.rotation.x += 0.3;
            dice.rotation.y += 0.3;
            requestAnimationFrame(rollAnimation);
        } else {
            dice.rotation.x = endRotationX;
            dice.rotation.y = endRotationY;
            rolling = false;
        }
    }

    rollAnimation();
}

init();
