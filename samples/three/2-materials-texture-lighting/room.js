var scene = new THREE.Scene();
//var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(75, renderer.domElement.width / renderer.domElement.height, 0.1, 1000);

if ( WEBGL.isWebGL2Available() === false ) {

	document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );

}

//renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Change camera controls
var control = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 20, 0);
control.update();

//Check the src.txt files in src to find where to get the images.

//Floor
var plane = new THREE.PlaneGeometry(20, 20);
//var tile = new THREE.Texture("http://www.myfreetextures.com/wp-content/uploads/2014/10/seamless-wood-planks-4.jpg", THREE.RepeatWrapping, THREE.RepeatWrapping);
//var tile = new THREE.Texture();
var wood = new THREE.TextureLoader();
var ground = new THREE.MeshStandardMaterial({map: wood.load("src/seamless-wood-planks-4.jpg"), roughness: 120, metalness: 0});
var floor = new THREE.Mesh(plane, ground);

floor.rotateX(-1.57);
floor.position.y = -1.3;

scene.add(floor);

//Walls (ADJUST BUMP MAP)
var walls = new THREE.Group();
//var wallTex = new THREE.Texture();
var bricks = new THREE.TextureLoader();
//(ADD BRICK TEXTURE)
var cemBlock = new THREE.BoxGeometry(2, 7, 14);
var cel = new THREE.MeshPhysicalMaterial({color: 0xffffff});
var cement = new THREE.MeshStandardMaterial({color: 0xbfbfbf, map : bricks.load("src/stone-walls.jpg"), metalness: 0, bumpMap: bricks.load("src/stone-walls.jpg")});
var wall = new THREE.Mesh(cemBlock, cement);
var wallCpy = wall.clone();

var wall3 = wall.clone();

wall.position.x = -6;
wallCpy.position.x = 6;

//wall3.rotation.y = 1.57;
wall3.rotateY(1.57);

var wall4 = wall3.clone();
wall3.position.z = -6.1;
wall4.position.z = 6.1;

walls.add(wall);
walls.add(wallCpy);
walls.add(wall3);
walls.add(wall4);

// Group idea:
// Create a wall instance, add to group or array.
// Loop 3 times to copy and add other walls
// Change each of their positions respectively.

walls.position.y = 2;
scene.add(walls);

var c = new THREE.PlaneGeometry(10, 12);
var ceiling = new THREE.Mesh(c, new THREE.MeshStandardMaterial({color: 0xffffff}));
ceiling.rotateX(1.57);
ceiling.position.y = 5.3;
scene.add(ceiling);

//Door
var door = new THREE.Group();
var oblong = new THREE.BoxGeometry(0.5, 4, 2);
var doortex = new THREE.TextureLoader();
var doormat = new THREE.MeshLambertMaterial({map: doortex.load("src/wooden_door_texture_by_ancientorange-d4iwzs7.jpg")});
var board = new THREE.Mesh(oblong, doormat);

door.add(board);

//Door handle
var knMat = new THREE.MeshPhongMaterial({color: 0xe6b800, shininess: 30});
var knob = new THREE.SphereGeometry(0.4, 10);
var handle = new THREE.Mesh(knob, knMat);
door.add(handle);

handle.position.z = 0.3;
handle.position.y = -0.2;

scene.add(door);

door.position.x = 5.2;
door.position.y = 0.5;

//one window for this room, which will emit light source
var glass = new THREE.BoxGeometry(4, 2, 0.6);
var emitter = new THREE.MeshStandardMaterial({emissive: 0xffffff});
var win = new THREE.Mesh(glass, emitter);

win.position.y = 2.5;
win.position.z = 5.3;

scene.add(win);

// ADD CHAIR (Maybe also make an array of chairs)
var chair = new THREE.Group();
var topcube = new THREE.BoxGeometry(1, 1.4, 0.3);
var texture = new THREE.TextureLoader();
var wFurniture = new THREE.MeshStandardMaterial({map: texture.load("src/wood-furniture-texture-seamless-wooden-textures-for-designers-19.jpg")});
var back = new THREE.Mesh(topcube, wFurniture);
var midcube = new THREE.BoxGeometry(1, 1, 0.2);
var seat = new THREE.Mesh(midcube, wFurniture);
chair.add(back);
back.scale.x = 0.9;
seat.rotateX(1.57);
chair.add(seat);
seat.position.y = -0.6;
seat.position.z = 0.4;
var legs = new THREE.Group();
var legComp = new THREE.BoxGeometry(0.2, 1.2, 0.32);
var leg = new THREE.Mesh(legComp, new THREE.MeshStandardMaterial({color: 0x330d00}));
leg.position.x = -0.4;
var legCpy = leg.clone();
legCpy.position.x = 0.4;
legs.add(leg);
legs.add(legCpy);
var leg3 = leg.clone();
var leg4 = legCpy.clone();
leg3.position.z = 0.72;
legs.add(leg3);
leg4.position.z = 0.72;
legs.add(leg4);
leg.scale.set(1, 2.1, 1);
legCpy.scale.set(1, 2.1, 1);
leg.position.y = 0.7;
legCpy.position.y = 0.7;
legs.position.y = -1.2;
//chair.position.x = 3;
scene.add(chair);
chair.add(legs);
chair.position.y = 0.43;
chair.position.z = -3.2;
chair.position.x = -3;

var chCopy = chair.clone();
chCopy.position.z = 2.7;
//chCopy.rotateY(3.14);
chCopy.rotateY(Math.PI);
scene.add(chCopy);

// ADD TABLE (Very basic)
var table = new THREE.Group();
var topDesk = new THREE.BoxGeometry(2, 0.14, 2.7);
var tableTop = new THREE.Mesh(topDesk, wFurniture);
var singleLeg = new THREE.CylinderGeometry(0.3, 0.3, 2.2, 10, 5);
var tableLeg = new THREE.Mesh(singleLeg, new THREE.MeshStandardMaterial({color: 0x330d00, metalness: 100, roughness: 20}));
var singleBase = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 10);
var tableBase = new THREE.Mesh(singleBase, wFurniture);
tableTop.position.y = 1.2;
tableLeg.position.y = 0.07;
tableBase.position.y = -0.84;
table.add(tableTop);
table.add(tableLeg);
table.add(tableBase);
table.position.x = -3;
table.position.y = -0.4;
scene.add(table);

// ADD CRYSTAL SPIRE / PILLAR with transparency and point light (move light down a bit)
var spire = new THREE.Group();
var base = new THREE.BoxGeometry(1.4, 0.3, 1.4);
var marb = new THREE.TextureLoader();
var concrete = new THREE.MeshLambertMaterial({map: marb.load("src/White-Carrara-Marble.jpg"), color: 0xcccccc});
var pillarBase = new THREE.Mesh(base, concrete);
var column = new THREE.BoxGeometry(0.7, 2.7, 0.7);
var pillar = new THREE.Mesh(column, concrete);
var arch = new THREE.CylinderGeometry(0.8, 0.3, 0.5, 10);
var pl = new THREE.Mesh(arch, concrete);
var tran = new THREE.MeshPhongMaterial({/*color: 0xffffff,*/ opacity: 0.3, shininess: 100, transparent: true});
var crystal = new THREE.SphereBufferGeometry(0.4, 20, 12);
spire.add(pillarBase);
pillarBase.position.y = -1.3;

spire.add(pillar);
spire.add(pl);
pl.position.y = 1.14;

var glob = new THREE.Mesh(crystal, tran);
pl.add(glob);
glob.position.y = 1;

var lightPoint = new THREE.PointLight(0xffffff, 0.7);
glob.add(lightPoint);

scene.add(spire);
spire.position.x = 3;
spire.position.z = -3.4;

// ADD STORAGE BOX


// Create spotlight, ADJUST SPREAD AND SCALE
var spot = new THREE.SpotLight(0xF2F5A9, 1.5);
spot.position.y = 5.27;
spot.angle = 0.8;
spot.penumbra = 0.33;
scene.add(spot);

// Resize the canvas
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

function animate() {
    if(resize(renderer)){
        const ren = renderer.domElement;
        camera.aspect = ren.clientWidth / ren.clientHeight;
        camera.updateProjectionMatrix();
    }
    requestAnimationFrame(animate);
    control.update();
    renderer.render(scene, camera);
}
animate();
//renderer.render(scene, camera);