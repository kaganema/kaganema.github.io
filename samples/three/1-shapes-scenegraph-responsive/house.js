/**
* File created by Emir Atik (kaganema) on 09/10/20
* Version 1.0
* Here you can see some of earlier ideas have been commented out.
*/

var scene = new THREE.Scene();
// width, height;

var renderer = new THREE.WebGLRenderer();
//renderer.setSize(window.innerWidth, window.innerHeight);
var camera = new THREE.PerspectiveCamera(75, renderer.domElement.width / renderer.domElement.height, 0.3, 1000);
document.body.appendChild(renderer.domElement);

var pan = new THREE.OrbitControls(camera, renderer.domElement);

var mat = new THREE.MeshBasicMaterial({color: 0xcc6600, side: THREE.DoubleSide});
var plane = new THREE.PlaneGeometry(20, 20, 2, 2);
var floor = new THREE.Mesh(plane, mat);

// Adding walls
//var walls = [];
var walls = new THREE.Group();

// Used for additional side windows.
//var wins = new THREE.Group();

var paint = new THREE.MeshBasicMaterial({color: 0x661400});
var col = new THREE.BoxGeometry(0.4, 5, 6);
var wall = new THREE.Mesh(col, paint);

floor.rotateX(1.57);
wall.position.x = 3;
wall.position.y = 2.1;
camera.position.set( 0, 1, 10 );
pan.update();

scene.add(floor);

walls.add(wall);

var wall2 = wall.clone();
wall2.position.x = -3;
walls.add(wall2);

var wall3 = wall.clone();
wall3.rotateY(1.57);
wall3.position.x = 0;
wall3.position.z = -3;
walls.add(wall3);

var wall4 = wall3.clone();
wall4.position.x = 0;
wall4.position.z = 3;
walls.add(wall4);

// The front of the house.
var entry = new THREE.Group();

// The door shape
var wood = new THREE.MeshBasicMaterial({color: 0x1a0000});
var rect = new THREE.BoxGeometry(0.3, 2, 1);
var door = new THREE.Mesh(rect, wood);
door.position.x = 3.1;
door.position.y = 1;
entry.add(door);

// The windows above the door.
var glass = new THREE.MeshBasicMaterial({color: 0xffffff});
var panel = new THREE.BoxGeometry(0.3, 0, 2);
var wind = new THREE.Mesh(panel, glass);
wind.position.x = 3.1;
wind.position.y = 3;
wind.position.z = -1.4;

var wind2 = wind.clone();
wind2.position.z = 1.4;

entry.add(wind);
entry.add(wind2);

// The rear entry to the house.
var exit = entry.clone();
exit.position.x = -6.2;

// Roof top
var tile = new THREE.MeshBasicMaterial({color: 0xe60000});
var upper = new THREE.ConeGeometry(5, 2, 4);
var roof = new THREE.Mesh(upper, tile);
roof.position.y = 5.5;
roof.rotateY(0.79);

// Secret item
var tone = new THREE.MeshBasicMaterial({color: 0xff0000});
var cube = new THREE.BoxGeometry();
var secret = new THREE.Mesh(cube, tone);

secret.position.y = 2.4;

// Building from bottom up

//Add the grouped content
scene.add(walls);
//scene.add(wins);
scene.add(entry);
scene.add(exit);
scene.add(roof);

// Chimney structure
var chimMat = new THREE.MeshBasicMaterial({color: 0xa52a2a});
var block = new THREE.BoxGeometry(0.7, 1.2, 0.7);
var tube = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 7, 1, true);
var chimneyBlock = new THREE.Mesh(block, chimMat);
var chimney = new THREE.Mesh(tube, chimMat);

roof.add(chimneyBlock);
chimneyBlock.add(chimney);

// Points from the roof's position
chimneyBlock.position.z = 2;
chimneyBlock.position.y = 0.4;

chimney.position.y = 0.7;

// The smoke.
var fuse = new THREE.MeshBasicMaterial({color: 0xa9a9a9});
var ball = new THREE.IcosahedronGeometry(0.3, 2);
var smoke = new THREE.Mesh(ball, fuse);

// It will come out from the chimney.
chimney.add(smoke);
smoke.position.y = 0.3;

// Finally, add the secret item.
scene.add(secret);

// Re-scale the scene to be adjusted to the screen size
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
	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	pan.update();
    
    // Reset to the chimney origin.
    if(smoke.position.y > 8) { 
        smoke.position.y = 0.3;
        //smoke.position.x = 0;
        //smoke.position.z = 0;
        smoke.scale.x = 1;
        smoke.scale.y = 1;
        smoke.scale.z = 1;
    } else {
        //smoke.position.x -= 0.01;
        smoke.position.y += 0.05;
        //smoke.position.z += 0.01;
        smoke.scale.x += 0.01;
        smoke.scale.y += 0.02;
        smoke.scale.z += 0.01;
    }
    
    /* backup code. */
    /*secret.rotation.x += 0.01;
    secret.rotation.y += 0.01;
    secret.rotation.z += 0.01;*/
    
    secret.rotateX(0.01);
    secret.rotateY(0.01);
    secret.rotateZ(0.01);

	renderer.render( scene, camera );

}
animate();

renderer.render(scene, camera);