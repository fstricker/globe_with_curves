/*need to npm install three first*/

import * as THREE from 'three';
/*when using shaders, I need to load them, however a Vite plugin (Vite Plugin String) needs to be installed so it can be read in correctly*/
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

console.log(atmosphereVertexShader)
console.log(atmosphereFragmentShader)

//const dprk_excel = XLSX.readFile('./north_korea_missile_test_database__2022-03-24.xlsx');
/*const dprk_excel = read("./data/north_korea_missile_test_database__2022-03-24.xlsx");
console.log(read("./data/north_korea_missile_test_database__2022-03-24.xlsx"));
console.log(dprk_excel)*/


import dprk_data from "./data/u7gi2-xl8bt.json"
console.log(dprk_data)

var dprk_data_colnames = []

for (let k in Object.keys(dprk_data[0])) {
  dprk_data_colnames += dprk_data[0][k];
}
console.log(dprk_data_colnames);

/*for (i in len(Object.keys(dprk_data[0]))); i < len(Object.keys(dprk_data[0])); i ++):*/

console.log(Object.keys(dprk_data[0]));

/*
for (i in dprk_data[0])
*/
const scene = new THREE.Scene();

// Perspective camera takes 4 arguments:
// 1. field of view in degrees: whether to show a lot or little
// 2. aspect ratio of scene: this should be done depending on user's user device
// 3. clipping pane in: how far does an object need to be in front of the camera in order to be clipped/excluded from the screen
// 4. clipping pane out: how far does an object need to be in front of the camera in order to be clipped/excluded from the screen

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)

camera.position.z = -10
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer(
{
 /*remove some of edgy curvature. Caution: may cause performance issues for larger projects*/
 antialias: true 
})

renderer.setSize(innerWidth, innerHeight)

/*to sharpen the pixels of rendered objects depending on user device*/
renderer.setPixelRatio(devicePixelRatio)


document.body.appendChild(renderer.domElement)

/*for actual stuff to show i need: geometry and material*/

/*box geometry*/

/*const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const material = new THREE.MeshBasicMaterial({color: 0x00FF00})

const mesh = new THREE.Mesh(boxGeometry, material)
*/

// controls

var controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window ); // optional

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 1;
controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 2;

const earth_sphere = new THREE.SphereGeometry(5, 50, 50)
/*if using a vertex and fragment shader, the material needs to be changed*/
/*const material = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('./img/earth.jpg')
  })*/

const earth_material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    globeTexture: {
      value: new THREE.TextureLoader().load('./img/earth.jpg')
    }
  }
})
const earth_mesh = new THREE.Mesh(earth_sphere, earth_material)

scene.add(earth_mesh)


const atmosphere = new THREE.SphereGeometry(5, 50, 50)

const atmosphere_material = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader
})

const atmosphere_mesh = new THREE.Mesh(atmosphere, atmosphere_material)

atmosphere_mesh.scale.set(1.1, 1.1, 1.1);

/*scene.add(atmosphere_mesh)*/

const curve = new THREE.CubicBezierCurve3(
  new THREE.Vector3( -10, 0, 0 ),
  new THREE.Vector3( -5, 15, 0 ),
  new THREE.Vector3( 20, 15, 0 ),
  new THREE.Vector3( 10, 0, 0 )
);

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const cubicCurve = new THREE.Line( geometry, material );

scene.add(cubicCurve)

/*If this is a good logic, I need to supply source and target coordinates. Desired output is a line between those*/
var pyong_lonlat = [39.019444, 125.738056]
var gujarat_lonlat = [22.417175, 73.770341]

var vienna = [48.2, 16.366667]
var cairo = [30.044444, 31.235833]

var washington = [38.904722, -77.016389]
var havana = [23.136667, -82.358889]

var radius = 5

var vF = calc_3D_vector(pyong_lonlat[0], pyong_lonlat[1], radius)
var vT = calc_3D_vector(gujarat_lonlat[0], gujarat_lonlat[1], radius)

var vF = calc_3D_vector(vienna[0], vienna[1], radius)
var vT = calc_3D_vector(cairo[0], cairo[1], radius)

var vFWashington = calc_3D_vector(washington[0], washington[1], radius)
var vTHavana = calc_3D_vector(havana[0], havana[1], radius)

function calc_3D_vector(lat, lon, radius) {

  var phiFrom = lat * Math.PI / 180;
  var thetaFrom = (lon + 90) * Math.PI / 180;
  var x = radius * Math.cos(phiFrom) * Math.sin(thetaFrom);
  var y = radius * Math.sin(phiFrom);
  var z = radius * Math.cos(phiFrom) * Math.cos(thetaFrom);

  return new THREE.Vector3(x, y, z);
}

var distWH = vFWashington.distanceTo(vTHavana);

// then you get the half point of the vectors points.
var xCWH = ( 0.5 * (vFWashington.x + vTHavana.x) );
var yCWH = ( 0.5 * (vFWashington.y + vTHavana.y) );
var zCWH = ( 0.5 * (vFWashington.z + vTHavana.z) );
 
// then we create a vector for the midpoints.
var midWH = new THREE.Vector3(xCWH, yCWH, zCWH);


function calc_cartesian_y (apogee, radius) {
/*info for earth's mean radius: https://en.wikipedia.org/wiki/Earth*/

var meankm_radius_earth = 6371

var vY = radius + radius * apogee / meankm_radius_earth

return vY

}

console.log('This is information on the middle point between washington and Havana')
console.log(midWH)
console.log(midWH.length())
console.log(calc_cartesian_y(6270, radius))

midWH.setLength(calc_cartesian_y(6270, radius))

const WHcurve = new THREE.QuadraticBezierCurve3(
  vFWashington,
  midWH,
  vTHavana
);

const MAX_POINTS = 300;

const WH_points = WHcurve.getPoints( MAX_POINTS );

const WH_geometry = new THREE.BufferGeometry()

// attributes
const WH_positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
WH_geometry.setAttribute( 'position', new THREE.BufferAttribute( WH_positions, 3 ) );

const WH_material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );

// draw range
const drawCount = 2; // draw the first 2 points, only
WH_geometry.setDrawRange( 0, drawCount );

// Create the final object to add to the scene
const WHObject = new THREE.Line( WH_geometry, WH_material );

scene.add(WHObject)

const WHObject_positions = WHObject.geometry.attributes.position.array;

let index = 0;

for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {

    WHObject_positions[ index ++ ] = WH_points[i].x;
    WHObject_positions[ index ++ ] = WH_points[i].y;
    WHObject_positions[ index ++ ] = WH_points[i].z;

}
 
//calculates "from" point

//Sets up vectors
/*var vT = new THREE.Vector3(xT, yT, zT);
var vF = new THREE.Vector3(xF, yF, zF);
*/
// vF = vector From
// vT vector To
var dist = vF.distanceTo(vT);

console.log(vF)
console.log(vT)
console.log(dist)
 
// here we are creating the control points for the first ones.
// the 'c' in front stands for control.
var cvT = vT.clone();
var cvF = vF.clone();
 
// then you get the half point of the vectors points.
var xC = ( 0.5 * (vF.x + vT.x) );
var yC = ( 0.5 * (vF.y + vT.y) );
var zC = ( 0.5 * (vF.z + vT.z) );
 
// then we create a vector for the midpoints.
var mid = new THREE.Vector3(xC, yC, zC);

console.log('This is the mid vector3 combined by (vF + vT)*.5')
console.log(mid)
console.log('This is the straight line length from origin to mid')
console.log(mid.length())

var smoothDist = map(dist, 0, 10, 0, 15/dist );

console.log(smoothDist)
 
mid.setLength( radius * smoothDist );
console.log('This is the mid vector3 after radius * smoothDist')
console.log(mid)
console.log('This is the straight line length from origin to mid')
console.log(mid.length())
 
cvT.add(mid);
cvF.add(mid);
 
cvT.setLength( radius * smoothDist );
cvF.setLength( radius * smoothDist );

/*console.log(cvT)
console.log(cvF)*/

function map( x,  in_min,  in_max,  out_min,  out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var curve2 = new THREE.CubicBezierCurve3( vF, cvF, cvT, vT );

/*const MAX_POINTS = 500;
*/
const quad_curve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3( -10, 0, 0 ),
  new THREE.Vector3( 20, 15, 0 ),
  new THREE.Vector3( 10, 0, 0 )
);

const curve_points = quad_curve.getPoints( MAX_POINTS );
console.log(curve_points)

// console.log(points)
const curve_geometry = new THREE.BufferGeometry()

// attributes
const curve_positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
curve_geometry.setAttribute( 'position', new THREE.BufferAttribute( curve_positions, 3 ) );

const curve_material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// draw range
/*const drawCount = 2; */// draw the first 2 points, only
curve_geometry.setDrawRange( 0, drawCount );

// Create the final object to add to the scene
const curveObject = new THREE.Line( curve_geometry, curve_material );

scene.add(curveObject)

const line_positions = curveObject.geometry.attributes.position.array;
console.log(line_positions)

index = 0;

for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {

    line_positions[ index ++ ] = curve_points[i].x;
    line_positions[ index ++ ] = curve_points[i].y;
    line_positions[ index ++ ] = curve_points[i].z;

}

let counter = 0;

/*this is just starting a loop in which I can place stuff*/
function animate() {
  requestAnimationFrame(animate)
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  renderer.render(scene, camera)


  if (counter < MAX_POINTS) {
    counter += 1
    curveObject.geometry.setDrawRange( 0, 2+counter );
    WHObject.geometry.setDrawRange(0, 2+counter);
  }

  /*earth_mesh.rotation.x += 0.01
 earth_mesh.rotation.y += 0.01*/ 
/*  camera.position.x = radius * Math.cos( angle );  
  camera.position.z = radius * Math.sin( angle );
angle += 0.01;*/

}

animate()