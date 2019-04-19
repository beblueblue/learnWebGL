var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Zakeke;
(function (Zakeke) {
    var Preview3D;
    (function (Preview3D) {
        Preview3D.DATA_ROOT = "";
        // Events
        var Viewer = /** @class */ (function () {
            //===
            // SETUP METHODS
            //===
            // Constructor
            function Viewer(containerId, antialias, isMobile) {
                if (isMobile === void 0) { isMobile = false; }
                this.viewWidth = 1;
                this.viewHeight = 1;
                // Raycast
                this.raycaster = new THREE.Raycaster();
                this.raycastTimer = 5;
                this.mouseNormalized = new THREE.Vector2(-1, -1);
                this.previewMode = false; // Configurator or user preview?
                this.vrMode = false;
                this.isMobile = false;
                this.controls = null;
                this.currentMeshes = [];
                this.invisibleMeshes = [];
                this.sceneHasTransparentMaterials = false;
                this.loaded = false;
                this.partChanged = [];
                this.init(containerId, antialias, isMobile);
            }
            Object.defineProperty(Viewer.prototype, "width", {
                // Getters / Setters
                get: function () {
                    return this.viewWidth;
                },
                set: function (w) {
                    this.viewWidth = w;
                    this.updateViewSize();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Viewer.prototype, "height", {
                get: function () {
                    return this.viewHeight;
                },
                set: function (h) {
                    this.viewHeight = h;
                    this.updateViewSize();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Viewer.prototype, "selectedPart", {
                get: function () {
                    return this._selectedPart;
                },
                set: function (part) {
                    var _this = this;
                    var oldPart = this._selectedPart;
                    this._selectedPart = part;
                    // Fire events
                    $.each(this.partChanged, function (i, e) {
                        if (e)
                            e(oldPart, _this._selectedPart);
                    });
                },
                enumerable: true,
                configurable: true
            });
            Viewer.prototype.init = function (containerId, antialias, isMobile) {
                if (isMobile === void 0) { isMobile = false; }
                return __awaiter(this, void 0, void 0, function () {
                    var texture, material;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (antialias === undefined)
                                    antialias = true;
                                // Create the main container
                                this.jqContainer = $(containerId);
                                this.container = this.jqContainer.get(0);
                                this.isMobile = isMobile;
                                // Scenes
                                this.scene = new THREE.Scene();
                                this.sceneOrtho = new THREE.Scene();
                                // Cameras
                                this.camera = new THREE.PerspectiveCamera(40, this.viewWidth / this.viewHeight, 0.1, 5000);
                                // Renderer
                                this.renderer = new THREE.WebGLRenderer({ antialias: antialias, alpha: true });
                                this.renderer.autoClear = false;
                                this.renderer.setSize(this.viewWidth, this.viewHeight);
                                this.renderer.setClearColor(0xffffff, 1);
                                // Add the viewer
                                this.jqContainer.prepend(this.renderer.domElement);
                                $(this.renderer.domElement).attr("id", "zakeke-viewer");
                                this.domElement = this.renderer.domElement;
                                // Add dom events
                                this.setupDomEvents();
                                // Orbit controls
                                this.setupOrbitControls();
                                // Load environment map
                                return [4 /*yield*/, this.loadEnvironmentMap()];
                            case 1:
                                // Load environment map
                                _a.sent();
                                return [4 /*yield*/, this.loadRefractionMap()];
                            case 2:
                                _a.sent();
                                // Fit parent
                                this.updateViewSize();
                                // Add lights
                                this.addLights();
                                // Start rendering
                                this.renderLoop();
                                texture = new THREE.TextureLoader().load('/images/3d/checker.png');
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.repeat = new THREE.Vector2(50, 50);
                                texture.anisotropy = this.renderer.getMaxAnisotropy();
                                material = new THREE.MeshLambertMaterial({
                                    color: 0xcccccc,
                                    shading: THREE.FlatShading,
                                    map: texture
                                });
                                this.loaded = true;
                                if (this.readyCallback)
                                    this.readyCallback();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            // Add lights
            Viewer.prototype.addLights = function () {
                this.backLight = new THREE.DirectionalLight(0xbbbbbb, 0.4);
                this.backLight.position.set(0, 1.5, -5);
                this.scene.add(this.backLight);
                this.directionalLight = new THREE.DirectionalLight(0xbbbbbb, 0.5);
                this.directionalLight.position.set(0, 1.5, 5);
                this.scene.add(this.directionalLight);
                this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x666666, 0.9);
                this.hemiLight.position.set(0, 10, 0);
                this.scene.add(this.hemiLight);
            };
            // Orbit controls
            Viewer.prototype.setupOrbitControls = function () {
                this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.orbitControls.enableKeys = false;
                this.orbitControls.enablePan = false;
                this.orbitControls.target.y = 0;
                //var setDC = (evt) => {
                //    if (!evt.alpha)
                //        return;
                //    this.controls = new THREE.DeviceOrientationControls(this.camera);
                //    this.controls.connect();
                //    this.controls.update();
                //    window.removeEventListener("deviceorientation", setDC, true);
                //}
                //window.addEventListener("deviceorientation", setDC, true);
            };
            // Environment map
            Viewer.prototype.loadEnvironmentMap = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                // Reflections
                                var path = Preview3D.DATA_ROOT + "/images/reflections/";
                                var urls = [
                                    path + "00_px.png", path + "00_nx.png",
                                    path + "00_py.png", path + "00_ny.png",
                                    path + "00_pz.png", path + "00_nz.png"
                                ];
                                new THREE.CubeTextureLoader().load(urls, function (texture) {
                                    Preview3D.ENVIRONMENT_MAP = texture;
                                    resolve();
                                });
                            })];
                    });
                });
            };
            // Environment map
            Viewer.prototype.loadRefractionMap = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                // Reflections
                                var path = Preview3D.DATA_ROOT + "/images/3d/refractions/";
                                var urls = [
                                    path + "RoomA_px.jpg", path + "RoomA_nx.jpg",
                                    path + "RoomA_py.jpg", path + "RoomA_ny.jpg",
                                    path + "RoomA_pz.jpg", path + "RoomA_nz.jpg"
                                ];
                                new THREE.CubeTextureLoader().load(urls, function (texture) {
                                    texture.mapping = THREE.CubeRefractionMapping;
                                    texture.format = THREE.RGBFormat;
                                    Preview3D.REFRACTION_MAP = texture;
                                    //this.scene.background = texture;
                                    resolve();
                                });
                            })];
                    });
                });
            };
            Viewer.prototype.getMeshMaterials = function (mesh) {
                if (Array.isArray(mesh.material))
                    return mesh.material;
                else
                    return [mesh.material];
            };
            // Actual render loop
            Viewer.prototype.renderLoop = function () {
                var _this = this;
                if (this.statsStart)
                    this.statsStart();
                // Update light position to follow the camera and make the scene more dynamic
                //this.directionalLight.position.x = this.camera.position.x + 2;
                //this.directionalLight.position.y = this.camera.position.y + 2;
                //this.directionalLight.position.z = this.camera.position.z + 2;
                // Update zoom / pan
                if (this.orbitControls && !this.vrMode)
                    this.orbitControls.update();
                if (this.controls && this.vrMode)
                    this.controls.update();
                // Update raycaster
                if (!this.previewMode) {
                    this.raycastTimer--;
                    if (this.raycastTimer < 0) {
                        this.raycastTimer = 5;
                        this.checkRaycast();
                    }
                }
                // Render all
                if (!this.sceneHasTransparentMaterials)
                    this.renderBase();
                else
                    this.renderWithTransparency();
                if (this.statsEnd)
                    this.statsEnd();
                requestAnimationFrame(function () { return _this.renderLoop(); });
            };
            Viewer.prototype.renderBase = function () {
                this.renderer.clear();
                this.renderer.render(this.scene, this.camera);
            };
            Viewer.prototype.renderWithTransparency = function () {
                if (this.model && this.model.mesh) {
                    var materialsValues = [];
                    for (var _i = 0, _a = this.currentMeshes; _i < _a.length; _i++) {
                        var mesh = _a[_i];
                        for (var _b = 0, _c = this.getMeshMaterials(mesh); _b < _c.length; _b++) {
                            var material = _c[_b];
                            materialsValues.push({ material: material, reflectivity: material.reflectivity, roughness: material.roughness });
                        }
                    }
                    this.renderer.clear();
                    // --------------------------------------------------
                    // First pass: render the back faces
                    // --------------------------------------------------
                    this.renderer.clearDepth();
                    for (var _d = 0, materialsValues_1 = materialsValues; _d < materialsValues_1.length; _d++) {
                        var mat = materialsValues_1[_d];
                        mat.material.side = THREE.BackSide;
                        mat.material.reflectivity = 0;
                        mat.material.roughness = 1;
                        mat.material.needsUpdate = true;
                    }
                    for (var _e = 0, _f = this.invisibleMeshes; _e < _f.length; _e++) {
                        var mesh = _f[_e];
                        mesh.visible = false;
                    }
                    this.renderer.render(this.scene, this.camera);
                    // --------------------------------------------------
                    // Second pass: render the front faces
                    // --------------------------------------------------
                    this.renderer.clearDepth();
                    for (var _g = 0, materialsValues_2 = materialsValues; _g < materialsValues_2.length; _g++) {
                        var mat = materialsValues_2[_g];
                        mat.material.side = THREE.FrontSide;
                        mat.material.reflectivity = mat.reflectivity;
                        mat.material.roughness = mat.roughness;
                        mat.material.needsUpdate = true;
                    }
                    this.renderer.render(this.scene, this.camera);
                    // Set back to visible all the completely transparent meshes
                    for (var _h = 0, _j = this.invisibleMeshes; _h < _j.length; _h++) {
                        var mesh = _j[_h];
                        mesh.visible = true;
                    }
                }
            };
            // Fit parent
            Viewer.prototype.updateViewSize = function () {
                // Adjust camera ratio
                this.camera.aspect = this.viewWidth / this.viewHeight;
                this.camera.updateProjectionMatrix();
                // ADjust renderer
                this.renderer.setSize(this.viewWidth, this.viewHeight);
            };
            // Attach dom events
            Viewer.prototype.setupDomEvents = function () {
                var _this = this;
                $(this.renderer.domElement).mousemove(function (event) { return _this.onMouseMove(event); });
                $(this.renderer.domElement).mousedown(function (event) { return _this.onMouseDown(event); });
                $(this.renderer.domElement).mouseup(function (event) { return _this.onMouseUp(event); });
            };
            // Check raycast f
            Viewer.prototype.checkRaycast = function () {
                if (!this.model)
                    return;
                // Update the picking ray with the camera and mouse position	
                this.raycaster.setFromCamera(this.mouseNormalized, this.camera);
                // Calculate objects intersecting the picking ray
                var intersects = this.raycaster.intersectObjects(this.scene.children);
                if (intersects.length > 0 && !this.isMouseDragging && intersects[0].object) {
                    var materialIndex = intersects[0].face.materialIndex;
                    // First check if we are currently selecting a new part or another part (performance reasons)
                    if (this.lastMaterialIndex != materialIndex) {
                        // Find part (i know that the object can be only the current model, no other object exist in the scene
                        var part = this.model.findPartByMatIndex(intersects[0].face.materialIndex);
                        var oldPart = this.lastIntersectedPart;
                        // Just for security
                        if (part != null && !this.previewMode) {
                            // Part changed, remove hover effect from previous part
                            if (this.lastIntersectedPart)
                                this.lastIntersectedPart.hoverEffect = false;
                            this.lastIntersectedPart = part;
                            if (this.lastIntersectedPart != undefined) {
                                this.lastIntersectedPart.hoverEffect = true;
                                this.setMouseCursor("pointer");
                            }
                        }
                        else {
                            if (this.lastIntersectedPart) {
                                this.lastIntersectedPart.hoverEffect = false;
                                this.setMouseCursor("move");
                            }
                            this.lastIntersectedPart = null;
                        }
                        this.lastMaterialIndex = materialIndex;
                        if (this.hoverPartChanged)
                            this.hoverPartChanged(oldPart, this.lastIntersectedPart);
                    }
                }
                else {
                    if (this.lastIntersectedPart) {
                        this.lastIntersectedPart.hoverEffect = false;
                        this.setMouseCursor("move");
                        if (this.hoverPartChanged)
                            this.hoverPartChanged(this.lastIntersectedPart, null);
                        this.lastIntersectedPart = null;
                        this.lastMaterialIndex = -1;
                    }
                }
            };
            // Change the current mouse cursor
            Viewer.prototype.setMouseCursor = function (cursor) {
                this.renderer.domElement.style.cursor = cursor;
            };
            //===
            // MOUSE CALLBACKS
            //===
            Viewer.prototype.onMouseMove = function (event) {
                this.mouseNormalized.x = (event.offsetX / this.viewWidth) * 2 - 1;
                this.mouseNormalized.y = -(event.offsetY / this.viewHeight) * 2 + 1;
                if (this.isMouseDown == true && this.lastMouseX != event.offsetX && this.lastMouseY != event.offsetY)
                    this.isMouseDragging = true;
                this.lastMouseX = event.offsetX;
                this.lastMouseY = event.offsetY;
            };
            Viewer.prototype.onMouseDown = function (event) {
                this.isMouseDown = true;
            };
            Viewer.prototype.onMouseUp = function (event) {
                if (this.isMouseDown && !this.isMouseDragging) {
                    this.selectPart(this.lastIntersectedPart);
                }
                this.isMouseDown = false;
                this.isMouseDragging = false;
            };
            //===
            // MANAGEMENT METHODS
            //===
            Viewer.prototype.initModel = function (colorId, callback, errorCallback) {
                var _this = this;
                // Clear scene
                this.clear();
                // Load new model
                this.model = new Preview3D.Model(colorId);
                this.model.onLoad = function (mesh) {
                    _this.scene.add(mesh);
                    // If all meshes are visible then just zoom all the scene (e.g in the backoffice)
                    var bbox = new THREE.Box3().setFromObject(mesh);
                    var size = new THREE.Vector3();
                    bbox.getSize(size);
                    var max = Math.max(size.x, size.y, size.z);
                    var ratio = 10 / max;
                    mesh.scale.set(ratio, ratio, ratio);
                    _this.fitCamera();
                    if (callback)
                        callback(_this.model);
                    _this.onSceneUpdated();
                };
                this.model.onError = function () {
                    if (errorCallback)
                        errorCallback();
                };
            };
            // Load a model by id
            Viewer.prototype.loadModelFromBackbone = function (model, colorId, callback, errorCallback) {
                var _this = this;
                var cb = function () {
                    _this.initModel(colorId, callback, errorCallback);
                    _this.model.buildFromBackbone(model);
                };
                if (this.loaded)
                    cb();
                else
                    this.readyCallback = cb;
            };
            Viewer.prototype.loadModelTemp = function (key, url, model, callback, errorCallback) {
                var _this = this;
                var cb = function () {
                    _this.initModel(-1, callback, errorCallback);
                    _this.model.buildFromTemp(key, url, model);
                };
                if (this.loaded)
                    cb();
                else
                    this.readyCallback = cb;
            };
            Viewer.prototype.fitCamera = function () {
                // Get visible meshes
                var allMeshes = this.model.getMeshes(this.model.mesh);
                var visibleMeshes = allMeshes.filter(function (x) { return x.visible; });
                if (visibleMeshes.length == 0)
                    return;
                var root = this.model.getRootFromMesh(visibleMeshes[0]);
                // If all meshes are visible then just zoom all the scene (e.g in the backoffice)
                var bbox = new THREE.Box3().setFromObject(allMeshes.length == visibleMeshes.length ? this.model.mesh : root);
                var size = new THREE.Vector3();
                var center = new THREE.Vector3();
                bbox.getSize(size);
                bbox.getCenter(center);
                var max = Math.max(size.x, size.y, size.z);
                // Move camera
                this.camera.position.z = center.z + max * 2;
                this.camera.position.x = center.x - size.x * 2;
                this.camera.position.y = center.y + size.y;
                // Set target
                this.orbitControls.target.x = center.x;
                this.orbitControls.target.y = center.y;
                this.orbitControls.target.z = center.z;
                this.orbitControls.minDistance = max;
                this.orbitControls.maxDistance = max * 10;
            };
            // Set items from 2D editor
            Viewer.prototype.setSideItems = function (sideId, items) {
                var part = this.model.findPartBySideId(sideId);
                if (part)
                    part.setItems(items, []);
            };
            Viewer.prototype.clear = function () {
                // Remove old model
                if (this.model != null) {
                    this.scene.remove(this.model.mesh);
                    this.model.dispose();
                    this.model = null;
                }
            };
            Viewer.prototype.appendTo = function (domElement) {
                $(this.renderer.domElement).appendTo(domElement);
                this.jqContainer = domElement;
                this.container = domElement.get(0);
            };
            Viewer.prototype.selectPart = function (part) {
                var oldPart = this.selectedPart;
                if (oldPart != part) {
                    this.selectedPart = part;
                }
            };
            Viewer.prototype.focusSide = function (sideId) {
                this.model.focusSide(sideId);
                this.fitCamera();
                this.onSceneUpdated();
            };
            Viewer.prototype.onSceneUpdated = function () {
                var _this = this;
                if (!this.model)
                    return;
                this.currentMeshes = [];
                this.sceneHasTransparentMaterials = false;
                this.model.getMeshes(this.model.mesh).filter(function (x) { return x.visible; }).forEach(function (mesh) {
                    _this.currentMeshes.push(mesh);
                    _this.sceneHasTransparentMaterials = _this.sceneHasTransparentMaterials || _this.getMeshMaterials(mesh).some(function (material) {
                        return (material.opacity < 1) || (material.data && material.data.isTransparent);
                    });
                    _this.getMeshMaterials(mesh).forEach(function (material) {
                        _this.model.materials.some(function (mat) {
                            var part = _this.model.findPartByMatIndex(material.index);
                            if (!part)
                                return false;
                            var texturable = part.getTexturable();
                            var isInvisible = texturable.opacityAffectCustomization == null ? texturable.opacityAffectCustomization : part.opacityAffectCustomization;
                            if (material.opacity == 0 && isInvisible)
                                _this.invisibleMeshes.push(mesh);
                        });
                    });
                });
            };
            return Viewer;
        }());
        Preview3D.Viewer = Viewer;
    })(Preview3D = Zakeke.Preview3D || (Zakeke.Preview3D = {}));
})(Zakeke || (Zakeke = {}));
