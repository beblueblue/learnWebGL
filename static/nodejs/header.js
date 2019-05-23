// Some node.js + webgl support code
var WebGL = require("node-webgl");
var document = WebGL.document();
module.exports = THREE;
THREE.document = document;

// TODO: what is stored here?
// Maybe we need to write something here?
var self = {};

// Poly-fill for requestAnimationFrame
THREE.requestAnimationFrame = document.requestAnimationFrame;

// node-webgl <-> webgl constants differences
WebGL.webgl.MAX_VERTEX_UNIFORM_VECTORS = 36347;
WebGL.webgl.DEPTH_STENCIL = 34041;
WebGL.webgl.DEPTH_STENCIL_ATTACHMENT = 33306;