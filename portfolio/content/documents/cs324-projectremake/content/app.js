const renderer = new THREE.WebGLRenderer();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const scene = new THREE.Scene();

document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

let controls = new THREE.PointerLockControls(camera, document.body);

// Clock instance that falls back to Date version if necessary
var last = performance.now();
//var d = new THREE.Clock();

camera.position.set(0, 0, 0);

/* A Detail object to have an icon with an associated text matching it. Useful to get the mesh property part of the raycaster array (intersectObject()). */
var Detail = function(mesh, text) {
    this.mesh = mesh;
    this.text = text;
    this.set = update(mesh, text);
    this.load = function(handler) {
        //Load element and send text data to container
        const div = document.createElement('div');
        div.setAttribute('class', 'loading-card');
        //div.nodeValue = this.text;
        div.innerHTML = this.text;
        div.style.display = 'block';
        document.body.appendChild(div);
    };
}

// Control variables
var lightPosition;
var orbitSpeed = 0.1;

var velocity = new THREE.Vector3();
//var direction = new THREE.Vector3();

// Raycasting elements.
var bounds = []
var ray = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( -1, 0, -1 ));
// Sun/Star model
var orbiter = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff }));
orbiter.position.set(57, 60, -89.6);
scene.add(orbiter);
orbiter.castShadow = true;
orbiter.receiveShadow = false;

// Live adjustable scene settings
var setting = new dat.GUI({name: 'Viewpanel'});
var tools = {
    //enable: true,
    sky: 0xfffaac,
    ambience: false,
    tone: 0.6,
    day: true
};

// Lighting variables
scene.background = new THREE.Color(tools.sky);
var backdrop = new THREE.AmbientLight(tools.sky, tools.tone);

// Enable scene settings

setting.addColor(tools, 'sky').onChange(function() { 
    scene.background.set(tools.sky);
    // ambient light adjusts with the sky colour
    backdrop.color.set(tools.sky);
});

// Toggle between night and day
setting.add(tools, 'day').onChange(function() {
    if(tools.day){
        scene.background.set(tools.sky);
        backdrop.color.set (tools.sky);
    }else{
        scene.background.set(0x000000);
        backdrop.color.set(0xfffccc);
    }
});

setting.add(tools, 'ambience').onChange(function() {
    if(tools.ambience){
        scene.add(backdrop);
    }else{
        scene.remove(backdrop);
    }
});

setting.add(tools, 'tone', -1.5, 2).onChange(function() {
    backdrop.intensity = tools.tone;
});

// Keep the controls hidden upon loading.
setting.close();


var marker = function(icon) {
    icon.position.y = 9.7;
    return icon;
};

// Custom setter for updating existing information 
var update = function(icon, text) {
    icon.position.y = 9.7;
    text = text;
}

// Add animating objects into an array for a unified transformation.
var spinners = [];

// Collection of items that will go to each Detail.
var triggers = [];
var information = ["This is a scene with an inanimate reclining chair. The table was meant to have a laptop to indicate the idea a \"Focus space\" for work and breaks. The laptop was removed due its details causing performance issues and lengthly loading times.", 
                   "Having noticed a treadmill model (from online) found within my files, I presume this is where I was meant to put it. Due to its size and time difficulty that the editor had loading it, I had instead filled the space with spare chairs and a table (all being duplicated).", 
                   "The bed was one of the models made in Blender, with creases on the quilt that were edited with vertices tweaking and mesh modifiers.<br><br>Across the bed is another pillar that was meant to have another spinning globe, and a bookshelf above it that is filled with some blank books (or at least look like it).",
                   "These were originally garden platforms, but there was no time to work on the plants that would have completed the look. Adding ground texture would have also been an issue as these boxes are prebuilt THREE.js shapes with limited set of parameters and modifications.",
                   "To complete the idea that it is a living area, this corner became the kitchen with some hobs provided and additional cupboards partially copied from the living room. I found that adding an oven given my constraints too much hastle to make it at least look like one, and left it due to the possibility of such detail filling more data on my file and not loading in the editor.",
                   "The white spheres on the patio deck give a very emissive tone to emulate floor lights."];


// Bounding box for camera.
//var camCube = new THREE.Box3().setFromObject(controls.getObject());

// Scene loading notification
var loadingView = document.getElementById('loading');

// Scene importer, based off of THREE.js ObjectLoader documentation
const loader = new THREE.ObjectLoader();

loader.setCrossOrigin('anonymous');

loader.load('room.json', function(model) {
    model.traverse(function(elem) {
        // Box 19 == Fences
        // Box == Open walls / Columns
        // Box 9 == Garden porch
        // Box 5 == Shelf top
        // Box 6 doesn't need explicit calling
        // Box 14 == Cupboard 'edge'
        // Box 23 == Pillar
        if(elem.name == 'Box 19' || elem.name == 'Box 9'){
            bounds.push(elem);
        }
        // Add collision on the lamp in case we align.
        if(elem.name == "Box 23" || elem.name == "Icosahedron 29"){
            bounds.push(elem);
        }
        if (elem instanceof THREE.DirectionalLight || elem instanceof THREE.PointLight) {
            elem.castShadow = true;
        }
        if (elem.name == 'Floor') {
            elem.receiveShadow = true;
        }
        if (elem.name == 'Box' || elem.name.includes('Wall')) {
            elem.castShadow = true;
            elem.receiveShadow = true;
            bounds.push(elem);
        }
        if (elem.name.includes('WindowDoor')){
            bounds.push(elem);
        }
        if (elem.name.includes('sofa')) {
            elem.castShadow = true;
            bounds.push(elem);
        }
        if (elem.name.includes('Lamp_001')) {
            elem.castShadow = true;
            bounds.push(elem);
        }
        if (elem.name == 'Table') {
            elem.traverse(function(child) {
                if(child.name.includes('TableTop'))
                    child.receiveShadow = true;
                child.castShadow = true;
            });
            bounds.push(elem);
        }
        /*if (elem.name.includes('tablecup.dae')) {
            elem.castShadow = true;
        }*/
        if (elem.name.includes('plate.dae')) {
            elem.castShadow = true;
        }
        if (elem.name.includes('Cup')) {
            elem.castShadow = true;
        }
        // Fragile items
        if (elem.name.includes('Glass') || elem.name == 'Trophy') {
            elem.castShadow = true;
        }
        if (elem.name.includes('TorusKnot') || elem.name == 'Icosahedron 2') {
            spinners.push(elem);
        }
    });
    model.position.y = 6.7;
    //model.castShadow = true;
    //model.receiveShadow = true;
    scene.add(model);
    loadingView.style.display = 'none';
}, function(xhr) {
    console.log(xhr);
    loadingView.style.display = 'inline'; //or block , minimal difference in the current setup.
    //loadingView.textContent = Math.round(xhr.loaded / xhr.total * 100) + '% complete';
    //loadingView.textContent = 'Loaded ' + Math.round(xhr.loaded) + ' data';
    loadingView.textContent = 'Loading...';
}, function(err) {
    console.error('Scene did not load');
});


// The intersected collision models.
let intersect;
// Raycaster for interactive icons.
let interact;

// Array of Details (composed of triggers and associated text)
let cards = [];

// New click icons added into the scene
while(triggers.length < 6){
    // standard or basic material will be suitable
    triggers.push(marker(new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5), new THREE.MeshStandardMaterial({color: 0xF2EF42}))
                        ));
}

triggers.forEach(function(oc) {
    scene.add(oc);
});

// Location of triggers in the room
triggers[0].position.z = -5;

triggers[1].position.z = 8.5;

triggers[2].position.x = 6;
triggers[2].position.z = 15.5;

triggers[3].position.x = 16;
triggers[3].position.z = 28;

triggers[4].position.z = 14;
triggers[4].position.x = -10;

triggers[5].position.z = -20;

// Possible pause function?
//function stop(e) {}

/* Project a raycast to point to an intersection. (We only need this projection for
 the tour elements in order to engage with them.) */
Detail.prototype.detect = function(handle) {
    let contain = renderer.domElement.getBoundingClientRect();
    ray.setFromCamera({
        x: (handle.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(handle.clientY / renderer.domElement.clientHeight) * 2 + 1
    }, camera);
    //interact = ray.intersectObjects(cards);
    interact = ray.intersectObject(this.mesh);
    return interact.length > 0;
}

/* Highlight the focused icon. */
Detail.prototype.focused = function(handle) {
    if(this.detect(handle)){  // < 2
        if(interact[0].distance < 2) interact[0].object.material.emissive.set( 0xdf6d6d );
        else interact[0].object.material.emissive.set( 0x000000 );
    }
}

function hide(handle) {
    var div = document.querySelector('.loading-card');
    document.body.removeChild(div);
}

// Create a list of tour elements.
for(let i=0; i<triggers.length; i++){
    cards.push(new Detail(triggers[i], information[i]));
}

// Elements for rendering the intro page in front of the canvas.
var intro = document.getElementById('home');
var readOnlyCan = document.querySelector('.foreground');

renderer.domElement.addEventListener('click', function() {
    controls.lock();
});

// Pointer Lock controls activation
controls.addEventListener('lock', function() {
    setting.hide();
    intro.style.display = 'none';
});

controls.addEventListener('unlock', function() {
    setting.show();
    intro.style.display = 'block';
});

// Set focus to nearby point of interaction
document.addEventListener('mousemove', function(e) {
    cards.forEach(cd => cd.focused(e));
});

// Set controls for textual information
intro.addEventListener('click', function(event) {
    readOnlyCan.style.display = 'block';
    this.style.display = 'none';
    setting.hide();
});

document.getElementById('close').addEventListener('click', function(e) {
    readOnlyCan.style.display = 'none';
    intro.style.display = 'block';
    setting.show();
})

document.addEventListener('click', function(e) {
        cards.forEach(function (cd) {
            if (controls.isLocked === true) {
                // If within targeted distance.
                if (cd.detect(e)) {
                    if (interact[0].distance < 2) {
                        //load info card
                        controls.unlock();
                        cd.load(e);
                    }
                }
            }else{
                hide(e);
            }
        })
});

// Add PointerLockControls
scene.add(controls.getObject());

// Use with earlier versions, solution found in Three.js repository 
// (examples/jsm/PointerLockControls.js)
document.addEventListener('keydown', function(e) {
    if(controls.isLocked === true){
    switch(e.code){
        case 'ArrowUp':
            ray.set(controls.getObject().position, velocity);
            if(intersect.length > 0 && intersect[0].distance < 1){
                velocity.z = 0;
            }else{
            velocity.setFromMatrixColumn(controls.getObject().matrix, 0);
            velocity.crossVectors(controls.getObject().up, velocity)
            controls.getObject().position.addScaledVector(velocity, 0.4);}
            break;
        case 'ArrowDown':
            ray.set(controls.getObject().position, velocity.negate());
            if(intersect.length > 0 && intersect[0].distance < 1){
                velocity.z = 0;
            }else{
            velocity.setFromMatrixColumn(controls.getObject().matrix, 0);
            velocity.crossVectors(controls.getObject().up, velocity)
            controls.getObject().position.addScaledVector(velocity, -0.4);} 
            break;
        case 'ArrowLeft':
            ray.set(controls.getObject().position, velocity.negate());
            if(intersect.length > 0 && intersect[0].distance < 1){
                velocity.x = 0;
            }else{
            velocity.setFromMatrixColumn(controls.getObject().matrix, 0);
            controls.getObject().position.addScaledVector(velocity, -0.4);
            }
            break;
        case 'ArrowRight':
            ray.set(controls.getObject().position, velocity);
            if(intersect.length > 0 && intersect[0].distance < 1){
                velocity.x = 0;
            }else{
            velocity.setFromMatrixColumn(controls.getObject().matrix, 0);
            controls.getObject().position.addScaledVector(velocity, 0.4);}
            break;
    }
    }
});

// For an updated version of the famework
/*document.addEventListener('keydown', function(e) {
    switch(e.code){
        case 'ArrowUp':
            controls.moveForward(-0.5);
            break;
        case 'ArrowDown':
            controls.moveForward(0.5);
            break;
        case 'ArrowLeft':
            controls.moveRight(-0.5);
            break;
        case 'ArrowRight':
            controls.moveRight(0.5);
            break;
    }
});*/

//Resize the canvas to screen width
function resize(ren) {
    const cren = ren.domElement;
    const pixelRatio = window.devicePixelRatio;
    const resize = cren.width !== cren.clientWidth || cren.height !== cren.clientHeight;
    if(resize){
        ren.setSize(cren.clientWidth, cren.clientHeight, false);
        //ren.setPixelRatio(window.devicePixelRatio);
    }
    return resize;
}


function render() {
    let t = performance.now();
    if(resize(renderer)){
        const ren = renderer.domElement;
        camera.aspect = ren.clientWidth / ren.clientHeight;
        camera.updateProjectionMatrix();
    }
    spinners.forEach(function(obj) {
        obj.rotateX(0.01);
    });
    triggers.forEach(function(obj) {
        obj.rotateY(0.02);
    });
    if(controls.isLocked === true){
        // We want to get the camera position to check the distance between controller and object.
        ray.ray.origin.copy(controls.getObject().position);
        intersect = ray.intersectObjects(bounds, true);
        let delta = (t - last) / 1000;
        velocity.x += velocity.x * 0.2 * delta;
        velocity.z += velocity.z * 0.2 * delta;
        
        // Scene collision
        // Added separate raycast intersection arrays  to separate the logic and avoid conflict between collection and collision instances.
        if (intersect.length > 0) {
            if (intersect[0].distance < 1) {
                velocity.subVectors(controls.getObject().position, intersect[0].point).normalize();
                controls.getObject().position.addScaledVector(velocity, 1);
            }
        }
    }
    
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    last = t;
}

render();