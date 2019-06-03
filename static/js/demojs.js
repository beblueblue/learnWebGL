const width  = 600
const height = 400

const THREE = require('three')
const PNG = require('pngjs').PNG
const gl = gl = require('gl')(width, height, { preserveDrawingBuffer: true })
const fs = require('fs')
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
const window = dom.window;
const document = window.document;
var canvas = document.createElement('canvas');


const path = 'out.png'
let png = new PNG({ width: width, height: height })

let scene = new THREE.Scene()

const VIEW_ANGLE = 45
const ASPECT = width / height
const NEAR = 0.1
const FAR  = 100

let camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

scene.add(camera)
camera.position.set(0, 2, 2)
camera.lookAt(scene.position)

let renderer = new THREE.WebGLRenderer({
    antialias: true,
    width: 0,
    height: 0,
    canvas: canvas,
    context: gl
})

let geometry = new THREE.BoxGeometry( 1, 1, 1 )

let material = new THREE.ShaderMaterial()
const vec4 = new THREE.Vector4( 1.0, 0.0, 0.0, 1.0 )

material.vertexShader = `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `
material.fragmentShader = `
        uniform vec4 solidColor;
        void main() {
            gl_FragColor = solidColor;
        }
    `
material.uniforms = { solidColor: { type: "v4", value: vec4 } }

let cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Let's create a render target object where we'll be rendering
let rtTexture = new THREE.WebGLRenderTarget(
    width, height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
})

renderer.render(scene, camera, rtTexture, true)

let newGl = renderer.getContext()

let pixels = new Uint8Array(4 * width * height)

newGl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

for(let j = 0; j < height; j++){
    for(let i = 0; i < width; i++){
        const k = j * width + i
        const r = pixels[4*k]
        const g = pixels[4*k + 1]
        const b = pixels[4*k + 2]
        const a = pixels[4*k + 3]

        const m = (height - j + 1) * width + i
        png.data[4*m]     = r
        png.data[4*m + 1] = g
        png.data[4*m + 2] = b
        png.data[4*m + 3] = a
    }
}

let stream = fs.createWriteStream(path)
png.pack().pipe(stream)

stream.on('close', () =>
    console.log("Image written: #{ path }")
)