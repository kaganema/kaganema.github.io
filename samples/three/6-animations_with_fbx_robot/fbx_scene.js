const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, renderer.domElement.width / renderer.domElement.height, 0.1, 1000);

//renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const box = new THREE.BoxGeometry(1, 0.94, 1);
const orbit = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 5);
orbit.update();

scene.background = new THREE.Color(0xaaaaaa);

// Pose mixer buttons
const presses = document.querySelectorAll('#actions > .btn');

// Tranform buttons
const rLeft = document.querySelector('#left');
const rRight = document.querySelector('#right');
const translate = document.querySelector('#move');

// Need this for animation runtime.
const clock = new THREE.Clock();

// 1. Set up area
const surface = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshStandardMaterial({color: 0x006ba8}));
surface.position.set(0, -0.37, 0);
surface.rotateX(-Math.PI/2);

const baseLight = new THREE.AmbientLight(0x404040);

const lightSource = new THREE.SpotLight(0xffffff, 2, 27, 60, 45, 0.1);
lightSource.position.set(0, 3, 0);

scene.add(baseLight);
scene.add(surface);
scene.add(lightSource);
let y = -0.04;

const boxes = [new THREE.Mesh(box, new THREE.MeshStandardMaterial({color: 0xf6e204})), 
               new THREE.Mesh(box, new THREE.MeshStandardMaterial({color: 0xad2300})),
               new THREE.Mesh(box, new THREE.MeshStandardMaterial({color: 0x096faa}))]
boxes[0].position.set(-3, y, 3);
boxes[1].position.set(5, y, 5.3);
boxes["2"].position.set(0.1, y, -5);
// Add all the box pillars to the scene.
boxes.forEach(p => scene.add(p));

// 2. Add a grid
const grid = new THREE.GridHelper(2000, 20);
//grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// 3. Load file and animation
let animations = {};
let mixer = new THREE.AnimationMixer();
// Use to switch animations
let active, past;
const loader = new THREE.FBXLoader();
loader.load('assets/protbot1.fbx', function(targ) {
    targ.scale.set(0.7, 0.7, 0.7);
    targ.traverse(child => {
        child.castShadow = true;
    });
    mixer = new THREE.AnimationMixer(targ);
    // Allow mixing to occur.
    //const action = mixer.clipAction(targ.animations[0]);
    const an = THREE.AnimationClip.findByName(targ.animations, 'Armature|IdleMove');
    const action = mixer.clipAction(an);
    // Pass it to a more permanent value
    active = action;
    console.log(targ);
    console.log(action);
    console.log(active == action);
    targ.animations.forEach(clip => {
        animations[clip.name] = clip;
    });
    console.log(animations);
    action.play();
    scene.add(targ);
}, function(xhr) {
   console.log('Loaded ');
    console.log(xhr.loaded);
}, function(err) {
    console.log(err);
});

// 4. Add controls

function switchAnimation(tg, pos) {
    console.log(tg);
    console.log(pos);
    // Don't reset action if it is the same as the current selection (on change).
    // If it is the reaching animation, don't loop (unless the user clicks again).
    if(pos._clip.name == tg.id) 
        if(tg.id != 'Armature|Reach1Full') return;
    // The new animation to transition to
    let next = mixer.clipAction(animations[tg.id]);
    console.log(next);
    // Stop the animation when something has been reached.
    if(next._clip.name == 'Armature|Reach1Full'){
        next.clampWhenFinished = true;
        next.setLoop(THREE.LoopOnce);
    }
    //Switch animation
    pos.crossFadeTo(next, 0.5);
    active = next;
    active.reset();
    active.play();
    //next.reset();
    //next.play();
}

presses.forEach(i => 
    i.onclick = e => {
        switchAnimation(e.target, active);
    } );
console.log(presses);

// Transform the model

function rotator(ms, ry) {
    ms.stop();
    ms._mixer._root.rotateY(ry);
    ms.play();
}

function slide(ms, vz) {
    ms._mixer._root.translateZ(vz);
}

// Directions controls
translate.addEventListener('click', e => {
    active.stop();
    active._mixer._root.translateX(0.05);
    active.play();
});

rLeft.addEventListener('click', e => rotator(active, 0.05));
rRight.addEventListener('click', e => rotator(active, -0.05));

// Set responsive resizing

function resize(ren) {
    const cren = ren.domElement;
    const pixelRatio = window.devicePixelRatio;
    const resize = cren.width !== cren.clientWidth || cren.height !== cren.clientHeight;
    if(resize){
        ren.setSize(cren.clientWidth, cren.clientHeight, false);
    }
    return resize;
}

// Play the animations
function animate() {
    // Update the dimensions upon resizing.
    if(resize(renderer)){
        const ren = renderer.domElement;
        camera.aspect = ren.clientWidth / ren.clientHeight;
        camera.updateProjectionMatrix();
    }
    orbit.update();
    mixer.update(clock.getDelta());
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();