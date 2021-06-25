import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { CSG } from './CSGMesh'

const scene: THREE.Scene = new THREE.Scene()

var light1 = new THREE.SpotLight();
light1.position.set(2.5, 5, 5)
light1.angle = Math.PI / 4
light1.penumbra = 0.5
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 20
scene.add(light1);

var light2 = new THREE.SpotLight();
light2.position.set(-2.5, 5, 5)
light2.angle = Math.PI / 4
light2.penumbra = 0.5
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 20
scene.add(light2);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = .5
camera.position.y = 2
camera.position.z = 2.5

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const envTexture = new THREE.CubeTextureLoader().load(["img/px_25.jpg", "img/nx_25.jpg", "img/py_25.jpg", "img/ny_25.jpg", "img/pz_25.jpg", "img/nz_25.jpg"])
envTexture.mapping = THREE.CubeReflectionMapping
const material = new THREE.MeshPhysicalMaterial({
    color: 0xb2ffc8,
    envMap: envTexture,
    metalness: .1,
    roughness: 0.1,
    transparent: true,
    transmission: 1.0,
    side: THREE.DoubleSide,
    clearcoat: 1.0,
    clearcoatRoughness: .25
});


//create a cube and sphere and intersect them
const cubeMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 2, 2), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
const sphereMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1.45, 8, 8), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
const cylinderMesh1 = new THREE.Mesh(new THREE.CylinderBufferGeometry(.85, .85, 2, 8, 1, false), new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
const cylinderMesh2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(.85, .85, 2, 8, 1, false), new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
const cylinderMesh3 = new THREE.Mesh(new THREE.CylinderBufferGeometry(.85, .85, 2, 8, 1, false), new THREE.MeshPhongMaterial({ color: 0x00ff00 }));

cubeMesh.position.set(-5, 0, -6)
scene.add(cubeMesh)
sphereMesh.position.set(-2, 0, -6)
scene.add(sphereMesh)

const cubeCSG = CSG.fromMesh(cubeMesh);
const sphereCSG = CSG.fromMesh(sphereMesh);

const cubeSphereIntersectCSG = cubeCSG.intersect(sphereCSG);
const cubeSphereIntersectMesh = CSG.toMesh(cubeSphereIntersectCSG, new THREE.Matrix4());

cubeSphereIntersectMesh.material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
cubeSphereIntersectMesh.position.set(-2.5, 0, -3)
scene.add(cubeSphereIntersectMesh);


//create 3 cylinders at different rotations and union them
cylinderMesh1.position.set(1, 0, -6)
scene.add(cylinderMesh1)
cylinderMesh2.position.set(3, 0, -6)
cylinderMesh2.geometry.rotateX(Math.PI / 2)
scene.add(cylinderMesh2)
cylinderMesh3.position.set(5, 0, -6)
cylinderMesh3.geometry.rotateZ(Math.PI / 2)
scene.add(cylinderMesh3)

const cylinderCSG1 = CSG.fromMesh(cylinderMesh1);
const cylinderCSG2 = CSG.fromMesh(cylinderMesh2);
const cylinderCSG3 = CSG.fromMesh(cylinderMesh3);

const cylindersUnionCSG = cylinderCSG1.union(cylinderCSG2.union(cylinderCSG3));
const cylindersUnionMesh = CSG.toMesh(cylindersUnionCSG, new THREE.Matrix4());

cylindersUnionMesh.material = new THREE.MeshPhongMaterial({ color: 0xffa500 });
cylindersUnionMesh.position.set(2.5, 0, -3)
scene.add(cylindersUnionMesh);


//subtract the cylindersUnionCSG from the cubeSphereIntersectCSG
const finalCSG = cubeSphereIntersectCSG.subtract(cylindersUnionCSG)
const finalMesh = CSG.toMesh(finalCSG, new THREE.Matrix4());
finalMesh.material = material;
scene.add(finalMesh);


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

var animate = function () {
    requestAnimationFrame(animate)

    controls.update()
    if(finalMesh){
        finalMesh.rotation.y+=.005
        finalMesh.rotation.z+=.0025
    }

    render()

    stats.update()
};

function render() {
    renderer.render(scene, camera)
}
animate();