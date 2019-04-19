var Zakeke;
(function (Zakeke) {
    var Preview3D;
    (function (Preview3D) {
        var Point = Zakeke.Preview3D.Extra.Point;
        // Model
        var Model = /** @class */ (function () {
            //===
            // SETUP METHOD
            //===
            function Model(colorId) {
                // Fields
                this._parts = [];
                this._baseColor = "#FFFFFF";
                this._backface = false;
                this._scale = 1;
                this._color = -1;
                // Properties
                this.id = -1;
                this.materials = [];
                if (colorId)
                    this.color = colorId;
                var isWebAssemblySupported = function () {
                    var ret = false;
                    // A try section is much more convenient as we don't need to keep adding ifs  
                    try {
                        /* This is the minimum and useful webassembly module
                            explanation of every bit is here:
                            https://webassemblycode.com/dissecting-minimum-useful-webassembly-module/ */
                        var xorBinWasm = new Uint8Array([0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00,
                            0x01, 0x07, 0x01, 0x60, 0x02, 0x7F, 0x7F, 0x01,
                            0x7F, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01,
                            0x03, 0x58, 0x4F, 0x52, 0x00, 0x00, 0x0A, 0x09,
                            0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x73,
                            0x0B]);
                        var WebAssemblyInstance = new WebAssembly.Instance(new WebAssembly.Module(xorBinWasm));
                        var xorFunc = WebAssemblyInstance.exports.XOR;
                        /* Is the webassembly code working?
                            details on dead beef can be found here:
                            https://webassemblycode.com/xor-english-word/ */
                        if ((xorFunc(0xFF00, 0x21AD) !== 0xdead) || (xorFunc(0xAA55, 0x14BA) !== 0xbeef)) {
                            // NO! let the world know about  
                            throw false;
                        }
                        // Everything worked, webassembly is supported  
                        ret = true;
                    }
                    catch (e) {
                        ret = false;
                    }
                    return ret;
                };
                //Set DRACOLoader settings
                THREE.DRACOLoader.setDecoderPath('../../../Scripts/libs/threejs/');
                if (!isWebAssemblySupported())
                    THREE.DRACOLoader.setDecoderConfig({ type: 'js' });
                THREE.DRACOLoader.getDecoderModule();
            }
            Object.defineProperty(Model.prototype, "baseColor", {
                // Setter/Getters
                get: function () {
                    return this._baseColor;
                },
                set: function (color) {
                    this._baseColor = color;
                    $.each(this.parts, function (i, p) { return p.color = color; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Model.prototype, "parts", {
                get: function () {
                    return this._parts;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Model.prototype, "backface", {
                get: function () {
                    return this._backface;
                },
                set: function (enabled) {
                    this._backface = enabled;
                    $.each(this._parts, function (i, part) {
                        var mat = part.material;
                        var threeMat = mat.threeMaterial;
                        threeMat.side = enabled ? THREE.DoubleSide : THREE.FrontSide;
                        threeMat.needsUpdate = true;
                    });
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(Model.prototype, "scale", {
                get: function () {
                    return this._scale;
                },
                set: function (scale) {
                    this._scale = scale;
                    this.mesh.scale.set(scale, scale, scale);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Model.prototype, "color", {
                get: function () {
                    return this._color;
                },
                set: function (colorId) {
                    this._color = colorId;
                    this.update();
                },
                enumerable: true,
                configurable: true
            });
            Model.prototype.buildFromTemp = function (key, url, dto) {
                var _this = this;
                this.modelUrl = url;
                this.modelKey = key;
                if (url.endsWith("gltf")) {
                    var loader = new THREE.GLTFLoader();
                    loader.setDRACOLoader(new THREE.DRACOLoader());
                    loader.load(url, function (gltf) {
                        _this.buildGLTF(gltf);
                    });
                }
                else {
                    var loader = new THREE.LegacyJSONLoader();
                    loader.crossOrigin = "anonymous";
                    loader.load(url, function (geometry, materials) {
                        _this.buildDTO(dto, geometry, materials);
                    });
                }
            };
            Model.prototype.getGLTFMaterials = function (scene) {
                var materials = [];
                var getMaterials = function (childs) {
                    for (var _i = 0, childs_1 = childs; _i < childs_1.length; _i++) {
                        var child = childs_1[_i];
                        if (child.material && materials.indexOf(child.material) == -1) {
                            materials.push(child.material);
                        }
                        getMaterials(child.children);
                    }
                    return materials;
                };
                getMaterials(scene.children);
                return materials;
            };
            Model.prototype.buildFromBackbone = function (model) {
                var _this = this;
                this.id = model.id;
                var previewModel = model.get("previewModel");
                if (previewModel) {
                    this.modelUrl = previewModel.get("model3DUrl");
                    if (this.modelUrl.endsWith("gltf")) {
                        var loader = new THREE.GLTFLoader();
                        loader.setDRACOLoader(new THREE.DRACOLoader());
                        loader.crossOrigin = "anonymous";
                        loader.load(previewModel.get("model3DUrl"), function (gltf) {
                            _this.buildGLTFFromBackbone(previewModel, gltf);
                        }, function (progress) {
                        }, function (error) {
                            if (_this.onError)
                                _this.onError();
                        });
                    }
                    else {
                        var loader = new THREE.LegacyJSONLoader();
                        loader.crossOrigin = "anonymous";
                        loader.load(previewModel.get("model3DUrl"), function (geometry, materials) {
                            _this.buildBackbone(previewModel, geometry, materials);
                        }, function (progress) {
                        }, function (error) {
                            if (_this.onError)
                                _this.onError();
                        });
                    }
                }
                else {
                    if (this.onError)
                        this.onError();
                }
            };
            // Build model parts
            Model.prototype.buildDTO = function (dto, geometry, materials) {
                var _this = this;
                var material = new THREE.MultiMaterial(materials);
                this.geometry = geometry;
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(0, 0, 0);
                this.mesh.rotation.set(0, 0, 0);
                this.mesh.castShadow = false;
                this.mesh.receiveShadow = false;
                // Adjust materials
                $.each(materials, function (i, mat) {
                    mat.needsUpdate = true;
                    // Add material to list
                    _this.materials.push(new Material(i, mat));
                });
                this.backface = dto.backface;
                this.scale = !dto.scale ? 1 : dto.scale;
                // Build parts
                $.each(dto.parts, function (i, p) {
                    var part = Part.FromDTO(_this, p);
                    _this._parts.push(part);
                });
                if (this.onLoad)
                    this.onLoad(this.mesh);
            };
            Model.prototype.buildBackbone = function (previewModel, geometry, materials) {
                var _this = this;
                var material = new THREE.MultiMaterial(materials);
                this.geometry = geometry;
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(0, 0, 0);
                this.mesh.rotation.set(0, 0, 0);
                this.mesh.castShadow = false;
                this.mesh.receiveShadow = false;
                // Adjust materials
                $.each(materials, function (i, mat) {
                    mat.needsUpdate = true;
                    _this.materials.push(new Material(i, mat));
                });
                // Build parts
                this.backface = previewModel.get("backface");
                this.scale = previewModel.get("scale") || 1;
                previewModel.get("parts").each(function (p) {
                    var part = Part.FromBackbone(_this, p);
                    _this._parts.push(part);
                });
                if (this.onLoad)
                    this.onLoad(this.mesh);
            };
            Model.prototype.buildGLTF = function (gltf) {
                this.mesh = gltf.scene;
                this.mesh.position.set(0, 0, 0);
                this.mesh.rotation.set(0, 0, 0);
                this.mesh.castShadow = false;
                this.mesh.receiveShadow = false;
                this.backface = true;
                this.scale = 1;
                var materials = this.getGLTFMaterials(gltf.scene);
                // Build parts
                var index = 0;
                for (var _i = 0, materials_1 = materials; _i < materials_1.length; _i++) {
                    var mat = materials_1[_i];
                    var material = new Material(index++, mat);
                    this.materials.push(material);
                    var part = Part.FromMaterial(this, material);
                    this._parts.push(part);
                }
                if (this.onLoad)
                    this.onLoad(this.mesh);
            };
            Model.prototype.buildGLTFFromBackbone = function (previewModel, gltf) {
                var _this = this;
                this.mesh = gltf.scene;
                this.mesh.position.set(0, 0, 0);
                this.mesh.rotation.set(0, 0, 0);
                this.mesh.castShadow = false;
                this.mesh.receiveShadow = false;
                this.backface = true;
                this.scale = 1;
                var materials = this.getGLTFMaterials(gltf.scene);
                // Build parts
                this.backface = previewModel.get("backface");
                this.scale = previewModel.get("scale") || 1;
                // Add materials
                var index = 0;
                for (var _i = 0, materials_2 = materials; _i < materials_2.length; _i++) {
                    var mat = materials_2[_i];
                    var material = new Material(index++, mat);
                    this.materials.push(material);
                }
                // Build parts
                previewModel.get("parts").each(function (p) {
                    var part = Part.FromBackbone(_this, p);
                    _this._parts.push(part);
                });
                if (this.onLoad)
                    this.onLoad(this.mesh);
            };
            Model.prototype.findPartByMatIndex = function (materialIndex) {
                var part = null;
                $.each(this._parts, function (i, p) {
                    if (p.material.index == materialIndex) {
                        part = p;
                        return false;
                    }
                });
                return part;
            };
            Model.prototype.findPartBySideId = function (sideId) {
                var part = null;
                $.each(this._parts, function (i, p) {
                    if (p.side && p.side.id == sideId) {
                        part = p;
                        return false;
                    }
                });
                return part;
            };
            Model.prototype.findPartBySide = function (side) {
                var part = null;
                $.each(this._parts.filter(function (x) { return x.side; }), function (i, p) {
                    if ((p.side.id && p.side.id == side.id) || (p.side.tempID && p.side.tempID == side.tempID)) {
                        part = p;
                        return false;
                    }
                });
                return part;
            };
            Model.prototype.update = function () {
                $.each(this._parts, function (i, part) { return part.update(); });
            };
            Model.prototype.dispose = function () {
                try {
                    this.disposeHierarchy(this.mesh, this.disposeNode);
                }
                catch (e) {
                    Logger.info("cannot dispose model:" + e.message);
                }
            };
            Model.prototype.disposeNode = function (node) {
                if (node instanceof THREE.Mesh) {
                    if (node.geometry) {
                        node.geometry.dispose();
                    }
                    if (node.material) {
                        if (node.material instanceof THREE.MeshFaceMaterial) {
                            $.each(node.material.materials, function (idx, mtrl) {
                                if (mtrl.map)
                                    mtrl.map.dispose();
                                if (mtrl.lightMap)
                                    mtrl.lightMap.dispose();
                                if (mtrl.bumpMap)
                                    mtrl.bumpMap.dispose();
                                if (mtrl.normalMap)
                                    mtrl.normalMap.dispose();
                                if (mtrl.specularMap)
                                    mtrl.specularMap.dispose();
                                if (mtrl.envMap)
                                    mtrl.envMap.dispose();
                                mtrl.dispose(); // disposes any programs associated with the material
                            });
                        }
                        else {
                            var material = node.material;
                            if (material.map)
                                material.map.dispose();
                            if (material.lightMap)
                                material.lightMap.dispose();
                            if (material.bumpMap)
                                material.bumpMap.dispose();
                            if (material.normalMap)
                                material.normalMap.dispose();
                            if (material.specularMap)
                                material.specularMap.dispose();
                            if (material.envMap)
                                material.envMap.dispose();
                            node.material.dispose(); // disposes any programs associated with the material
                        }
                    }
                }
            }; // disposeNode
            Model.prototype.disposeHierarchy = function (node, callback) {
                for (var i = node.children.length - 1; i >= 0; i--) {
                    var child = node.children[i];
                    this.disposeHierarchy(child, callback);
                    callback(child);
                }
            };
            Model.prototype.toBackboneModel = function (model) {
                var previewModel = model.get("previewModel") && this.id != -1 ? model.get("previewModel") : new MPlaza.PreviewModel();
                var parts = previewModel.get("parts");
                previewModel.set("scale", this.scale);
                previewModel.set("backface", this.backface);
                // Model js
                if (this.id == -1) {
                    previewModel.set("model3DUrl", this.modelUrl);
                    previewModel.set("tempModel3DFileKey", this.modelKey);
                }
                // Parts
                $.each(this.parts, function (i, part) {
                    parts.push(part.toBackboneModel(previewModel));
                });
                return previewModel;
            };
            Model.prototype.focusSide = function (sideId) {
                var part = this.findPartBySideId(sideId);
                var meshes = this.getMeshes(this.mesh);
                if (part) {
                    for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
                        var mesh_1 = meshes_1[_i];
                        mesh_1.visible = false;
                    }
                    var mesh = this.findMeshWithMaterial(part.material.threeMaterial);
                    if (mesh) {
                        var root = this.getRootFromMesh(mesh);
                        if (root) {
                            for (var _a = 0, _b = this.getMeshes(root); _a < _b.length; _a++) {
                                var mesh_2 = _b[_a];
                                mesh_2.visible = true;
                            }
                        }
                    }
                }
            };
            Model.prototype.getMeshes = function (root) {
                var meshes = [];
                var getMeshes = function (childs) {
                    for (var _i = 0, childs_2 = childs; _i < childs_2.length; _i++) {
                        var child = childs_2[_i];
                        if (child instanceof THREE.Mesh) {
                            meshes.push(child);
                        }
                        getMeshes(child.children);
                    }
                    return meshes;
                };
                getMeshes([root]);
                return meshes;
            };
            Model.prototype.findMeshWithMaterial = function (material) {
                var meshes = this.getMeshes(this.mesh);
                for (var _i = 0, meshes_2 = meshes; _i < meshes_2.length; _i++) {
                    var mesh = meshes_2[_i];
                    if (mesh.material) {
                        if (mesh.material.isMultiMaterial && mesh.material.materials.find(function (x) { return x == material; })) {
                            return mesh;
                        }
                        else {
                            if (mesh.material == material)
                                return mesh;
                        }
                    }
                }
                return null;
            };
            Model.prototype.getRootFromMesh = function (mesh) {
                var parent = mesh;
                var getParent = function (mesh) {
                    if (mesh.parent && !(mesh.parent instanceof THREE.Scene)) {
                        parent = mesh.parent;
                        getParent(parent);
                    }
                };
                getParent(parent);
                return parent;
            };
            return Model;
        }());
        Preview3D.Model = Model;
        // Part
        var Part = /** @class */ (function () {
            //===
            // SETUP
            //===
            function Part() {
                // Fields
                this._paper = new paper.PaperScope();
                // Used when switching from refraction mode and normal transparency
                this.previousOpacity = 0;
                this.previousReflectivity = 0;
                this._opacityAffectCustomization = true;
                this._refractionMode = false;
                this.isHoverEffect = false;
                this.id = -1;
                this.tempid = '';
                this.side = null;
                this.sideId = null;
                this.colors = [];
                this.isTemp = false;
            }
            Object.defineProperty(Part.prototype, "color", {
                // Getters/Setters
                get: function () {
                    return this._baseColor;
                },
                set: function (color) {
                    this._baseColor = color;
                    this.updateColor();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Part.prototype, "hasTexture", {
                get: function () {
                    return this._hasTexture;
                },
                set: function (has) {
                    this._hasTexture = has;
                    this.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Part.prototype, "textureWidth", {
                get: function () {
                    return this._textureWidth;
                },
                set: function (width) {
                    this._textureWidth = width;
                    if (this.canvas && this.paper) {
                        this.canvas.width = this.hasTexture ? this.textureWidth : 512;
                        // Buffer paper scope
                        this.paper.view.viewSize = [this.canvas.width, this.canvas.height];
                        this.paper.view.center = new this.paper.Point(0, 0);
                        this.update();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Part.prototype, "textureHeight", {
                get: function () {
                    return this._textureHeight;
                },
                set: function (height) {
                    this._textureHeight = height;
                    if (this.canvas && this.paper) {
                        this.canvas.height = this.hasTexture ? this.textureHeight : 512;
                        // Buffer paper scope
                        this.paper.view.viewSize = [this.canvas.width, this.canvas.height];
                        this.paper.view.center = new this.paper.Point(0, 0);
                        this.update();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Part.prototype, "texture", {
                get: function () {
                    return this.material.texture;
                },
                set: function (texture) {
                    this.material.texture = texture;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Part.prototype, "hoverEffect", {
                set: function (enabled) {
                    this.isHoverEffect = enabled;
                    this.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Part.prototype, "paper", {
                get: function () {
                    paper = this._paper;
                    return paper;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Part.prototype, "refractionMode", {
                get: function () {
                    return this._refractionMode;
                },
                set: function (mode) {
                    this._refractionMode = mode;
                    this.material.envMap = Preview3D.ENVIRONMENT_MAP;
                    this.material.combine = THREE.MultiplyOperation;
                    this.material.refractionRatio = 0;
                    //if (mode) {
                    //    this.opacity = 1;
                    //    this.reflectivity = 1;
                    //    this.material.envMap = REFRACTION_MAP;
                    //    this.material.refractionRatio = 0.95;
                    //} else {
                    //    this.material.envMap = ENVIRONMENT_MAP;
                    //    this.material.combine = THREE.MultiplyOperation;
                    //    this.material.refractionRatio = 0;
                    //    if (this.previousOpacity)
                    //        this.opacity = this.previousOpacity;
                    //    if (this.previousReflectivity)
                    //        this.reflectivity = this.previousReflectivity;
                    //}
                },
                enumerable: true,
                configurable: true
            });
            ;
            Part.FromDTO = function (model, dto) {
                var part = new Part();
                // Convert from DTO
                part.model = model;
                part.id = dto.id;
                part.tempid = MPlaza.generateUUID();
                part.material = model.materials[dto.materialIndex]; // Must be on top
                part.name = part.material.name;
                //part.sideId = dto.sideId;
                part.reflectivity = dto.reflectivity;
                part.opacity = dto.opacity;
                part.opacityAffectCustomization = true;
                part._hasTexture = dto.hasTexture; // Backing field
                part.isTemp = dto.isTemp;
                part.textureName = dto.textureName;
                part.textureUrl = dto.textureUrl;
                part.textureKey = dto.textureKey;
                part.textureWidth = dto.textureWidth == null || dto.textureWidth == 0 ? 512 : dto.textureWidth;
                part.textureHeight = dto.textureHeight == null || dto.textureHeight == 0 ? 512 : dto.textureHeight;
                part.itemsPosition = dto.itemsPosition ? dto.itemsPosition : new Point(0, 0);
                part.itemsScale = dto.itemsScale ? dto.itemsScale : new Point(1, 1);
                part.refractionMode = false;
                // Buffer canvas
                part.canvas = document.createElement("canvas");
                part.canvas.width = part.hasTexture ? part.textureWidth : 512;
                part.canvas.height = part.hasTexture ? part.textureHeight : 512;
                // Buffer texture
                part.texture = new THREE.Texture(part.canvas);
                part.texture.flipY = true;
                part.texture.wrapT = THREE.RepeatWrapping;
                part.texture.wrapS = THREE.RepeatWrapping;
                part.texture.minFilter = THREE.LinearFilter;
                part.texture.needsUpdate = true;
                // Buffer paper scope
                part.paper.setup(part.canvas);
                part.paper.view.viewSize = [part.canvas.width, part.canvas.height];
                part.paper.view.center = new part.paper.Point(0, 0);
                part.paper.Layer.inject({
                    _selectChildren: false
                });
                // Background layer
                var layer = new paper.Layer();
                layer.name = "backgroundLayer";
                layer.activate();
                layer.sendToBack();
                // Base color path
                part.baseColorPath = new part.paper.Path.Rectangle(new part.paper.Point(0, 0), new part.paper.Point(1, 1));
                part.baseColorPath.name = "baseColorPath";
                // Items layer
                layer = new part.paper.Layer();
                layer.name = "itemsLayer";
                layer.bringToFront();
                layer.activate();
                if (dto.colors)
                    $.each(dto.colors, function (i, _color) {
                        var color = new PartColor(part, _color.colorId, _color.color, _color.hasTexture, _color.textureUrl, _color.isCustomTexture, _color.reflectivity, _color.opacity, _color.opacityAffectCustomization, _color.itemsPosition, _color.itemsScale);
                        part.colors.push(color);
                    });
                part.color = dto.color;
                part.update();
                return part;
            };
            Part.FromMaterial = function (model, material) {
                var part = new Part();
                // Convert from DTO
                part.model = model;
                part.id = -1;
                part.tempid = MPlaza.generateUUID();
                part.material = material;
                part.name = part.material.name;
                //part.sideId = dto.sideId;
                part.reflectivity = 0;
                part.opacity = 1;
                part.opacityAffectCustomization = true;
                part._hasTexture = false; // Backing field
                part.isTemp = true;
                part.textureName = "";
                part.textureUrl = "";
                part.textureKey = "";
                part.textureWidth = 512;
                part.textureHeight = 512;
                part.itemsPosition = new Point(0, 0);
                part.itemsScale = new Point(1, 1);
                part.refractionMode = false;
                // Buffer canvas
                part.canvas = document.createElement("canvas");
                part.canvas.width = part.hasTexture ? part.textureWidth : 512;
                part.canvas.height = part.hasTexture ? part.textureHeight : 512;
                // Buffer texture
                part.texture = new THREE.Texture(part.canvas);
                part.texture.flipY = false;
                part.texture.wrapT = THREE.RepeatWrapping;
                part.texture.wrapS = THREE.RepeatWrapping;
                part.texture.minFilter = THREE.LinearFilter;
                part.texture.needsUpdate = true;
                // Buffer paper scope
                part.paper.setup(part.canvas);
                part.paper.view.viewSize = [part.canvas.width, part.canvas.height];
                part.paper.view.center = new part.paper.Point(0, 0);
                part.paper.Layer.inject({
                    _selectChildren: false
                });
                // Background layer
                var layer = new paper.Layer();
                layer.name = "backgroundLayer";
                layer.activate();
                layer.sendToBack();
                // Base color path
                part.baseColorPath = new part.paper.Path.Rectangle(new part.paper.Point(0, 0), new part.paper.Point(1, 1));
                part.baseColorPath.name = "baseColorPath";
                // Items layer
                layer = new part.paper.Layer();
                layer.name = "itemsLayer";
                layer.bringToFront();
                layer.activate();
                part.color = "#" + part.material.threeMaterial.color.getHexString();
                part.update();
                return part;
            };
            Part.FromBackbone = function (model, p) {
                // Convert from DTO
                var part = new Part();
                part.model = model;
                part.id = p.id;
                part.material = model.materials[p.get("materialIndex")]; // Must be on top
                part.name = part.material.name;
                part.material.color = "#FFFFFF";
                var colors = p.collection.parentModel.parents[0].get("colors");
                colors.each(function (color) {
                    var side = color.get("sides").get(p.get("sideID"));
                    if (side) {
                        part.side = side;
                        return false;
                    }
                });
                part.reflectivity = p.get("reflectivity");
                part.opacity = p.get("opacity");
                part.opacityAffectCustomization = p.get("opacityAffectCustomization");
                part._hasTexture = p.get("hasTexture"); // Backing field
                part.isTemp = p.get("isTemp");
                part.textureName = p.get("textureName");
                part.textureUrl = p.get("textureUrl");
                part.textureWidth = p.get("textureWidth") > 0 ? p.get("textureWidth") : 512;
                part.textureHeight = p.get("textureHeight") > 0 ? p.get("textureHeight") : 512;
                part.itemsPosition = new Point(p.get("itemsPositionX"), p.get("itemsPositionY"));
                part.itemsScale = new Point(p.get("itemsScaleX"), p.get("itemsScaleY"));
                part.refractionMode = !!p.get("refractionMode");
                // Buffer canvas
                part.canvas = document.createElement("canvas");
                part.canvas.width = part.hasTexture ? part.textureWidth : 512;
                part.canvas.height = part.hasTexture ? part.textureHeight : 512;
                // Buffer texture
                part.texture = new THREE.Texture(part.canvas);
                part.texture.minFilter = THREE.LinearFilter;
                part.texture.wrapT = THREE.RepeatWrapping;
                part.texture.wrapS = THREE.RepeatWrapping;
                part.texture.needsUpdate = true;
                part.texture.flipY = !model.modelUrl.endsWith("gltf");
                // Buffer paper scope
                part.paper.setup(part.canvas);
                part.paper.view.viewSize = [part.textureWidth, part.textureHeight];
                part.paper.view.center = new part.paper.Point(0, 0);
                part.paper.Layer.inject({
                    _selectChildren: false
                });
                // Background layer
                var layer = new paper.Layer();
                layer.name = "backgroundLayer";
                layer.activate();
                layer.sendToBack();
                // Base color path
                var point = new part.paper.Point(-part.textureWidth / 2, -part.textureHeight / 2);
                part.baseColorPath = new part.paper.Path.Rectangle(new part.paper.Point(0, 0), new part.paper.Point(1, 1));
                part.baseColorPath.name = "baseColorPath";
                // Items layer
                layer = new part.paper.Layer();
                layer.name = "itemsLayer";
                layer.bringToFront();
                layer.activate();
                if (p.get("colors"))
                    p.get("colors").each(function (_color) {
                        var color = new PartColor(part, _color.id, _color.get("color"), _color.get("hasTexture"), _color.get("textureUrl"), _color.get("isCustomTexture"), _color.get("reflectivity"), _color.get("opacity"), _color.get("opacityAffectCustomization"), (_color.get("itemsPositionX") != null && _color.get("itemsPositionY") != null) ? new Point(_color.get("itemsPositionX"), _color.get("itemsPositionY")) : null, (_color.get("itemsScaleX") != null && _color.get("itemsScaleY") != null) ? new Point(_color.get("itemsScaleX"), _color.get("itemsScaleY")) : null);
                        part.colors.push(color);
                    });
                part.color = p.get("color");
                part.update();
                return part;
            };
            //===
            // TEXTURE AND COLORS
            //===
            Part.prototype.updateTexture = function () {
                var _this = this;
                var src = this.getTexturable().getTextureUrl();
                // This is used for ensure that when the texture will finish to load, 
                // the color is the same as when it started to load.
                var currentColor = this.model.color;
                if (src != null && src != "") {
                    // Colorize path
                    // N.B must be created at this instant or the color will not change correcly
                    //if (!this.colorizePath) {
                    //    this.colorizePath = new this.paper.Path.Rectangle(new this.paper.Point(0, 0), new this.paper.Size(1, 1));
                    //    this.colorizePath.name = "colorizePath";
                    //    this.colorizePath.fillColor = "#FFFFFF";
                    //    this.colorizePath.blendMode = "multiply";
                    //}
                    if (this.lastTextureSrc != src) {
                        this.lastTextureSrc = src;
                        var raster = new this.paper.Raster({ crossOrigin: "anonymous", source: src });
                        raster.onLoad = function (e) {
                            if (currentColor != _this.model.color) {
                                // Remove the last loaded raster
                                raster.remove();
                                Logger.info("Color changed while texture was loading: " + src);
                                return;
                            }
                            if (_this.baseTextureRaster) {
                                _this.baseTextureRaster.remove();
                            }
                            _this.baseTextureRaster = raster;
                            _this.baseTextureRaster.position = new _this.paper.Point(0, 0);
                            _this.paper.project.layers[0].addChild(_this.baseTextureRaster);
                            // this.colorizePath.bringToFront(); // Move colorizer over the raster
                            fitTexture.apply(_this);
                        };
                    }
                    else {
                        fitTexture.apply(this); // Maybe we changed textureWidth or textureHeight, so resize the texture.
                    }
                }
                else {
                    if (this.baseTextureRaster) {
                        this.baseTextureRaster.remove();
                        this.baseTextureRaster = null;
                        //this.colorizePath.remove();
                        //this.colorizePath = null;
                        this.lastTextureSrc = null;
                    }
                    fitTexture.apply(this);
                }
                function fitTexture() {
                    // Adapt to texture size
                    if (this.baseTextureRaster)
                        this.baseTextureRaster.scaling = new this.paper.Point((this.textureWidth + 1) / this.baseTextureRaster.width, (this.textureHeight + 1) / this.baseTextureRaster.height);
                    // TODO: Change to scale
                    if (this.colorizePath)
                        this.colorizePath.scaling = new this.paper.Point((this.textureWidth + 1) / this.colorizePath.bounds.width, (this.textureHeight + 1) / this.colorizePath.bounds.height);
                    if (this.baseColorPath)
                        this.baseColorPath.scaling = new this.paper.Point((this.textureWidth + 1) / this.baseColorPath.bounds.width, (this.textureHeight + 1) / this.baseColorPath.bounds.height);
                    this.flush();
                }
            };
            Part.prototype.updateColor = function () {
                var texturable = this.getTexturable();
                if (this.colorizePath) {
                    this.colorizePath.fillColor = texturable.color;
                    this.baseColorPath.fillColor = "#FFFFFF";
                }
                else {
                    this.baseColorPath.fillColor = texturable.color;
                }
                // If the opacity does not affect customization, then the material is opaque and we 
                // must manually set transparent all except the user customization, so the baseColorPath and the side image
                if (!texturable.opacityAffectCustomization) {
                    if (this.baseTextureRaster) {
                        this.baseColorPath.opacity = 0;
                        this.baseTextureRaster.opacity = texturable.opacity;
                    }
                    else {
                        this.baseColorPath.opacity = texturable.opacity;
                    }
                    this.material.opacity = 1;
                }
                else {
                    //this.material.opacity = this.opacity;
                    this.material.opacity = texturable.opacity;
                    this.baseColorPath.opacity = 1;
                    if (this.baseTextureRaster)
                        this.baseTextureRaster.opacity = 1;
                }
                this.material.setThreeMaterialData({ isTransparent: texturable.opacity < 1 });
                this.material.color = "#ffffff";
                this.material.reflectivity = texturable.reflectivity;
                this.material.transparent = this.baseTextureRaster ? true : texturable.opacity < 1;
                this.flush();
            };
            Part.prototype.getColor = function (colorId) {
                var partColor;
                $.each(this.colors, function (i, color) {
                    if (color.colorId == colorId) {
                        partColor = color;
                        return false;
                    }
                });
                // If color not exist, add it
                if (!partColor) {
                    partColor = new PartColor(this, colorId, this.color, this.hasTexture, null, false, this.reflectivity, this.opacity, this.opacityAffectCustomization, this.itemsPosition, this.itemsScale);
                    this.colors.push(partColor);
                }
                return partColor;
            };
            Part.prototype.getCurrentColor = function () {
                return this.model.color == -1 ? null : this.getColor(this.model.color);
            };
            Part.prototype.setOpacity = function (opacity) {
                // Prende il color
                var texturable = this.getTexturable();
                // Salvo il valore precedente
                this.previousOpacity = texturable.opacity;
                // Imposto sul color l'opacit�
                texturable.opacity = opacity;
            };
            Part.prototype.setReflectivity = function (reflectivity) {
                var texturable = this.getTexturable();
                this.previousReflectivity = texturable.reflectivity;
                texturable.reflectivity = reflectivity;
            };
            Part.prototype.setOpacityAffectCustomization = function (opacityAffectCustomization) {
                var texturable = this.getTexturable();
                texturable.opacityAffectCustomization = opacityAffectCustomization;
            };
            Part.prototype.setItemsScale = function (ItemsScaleX, ItemsScaleY) {
                var texturable = this.getTexturable();
                texturable.itemsScale = new Point(ItemsScaleX, ItemsScaleY);
            };
            Part.prototype.setItemsPosition = function (ItemsPositionX, ItemsPositionY) {
                var texturable = this.getTexturable();
                texturable.itemsPosition = new Point(ItemsPositionX, ItemsPositionY);
            };
            //===
            // ITEMS PLACEHOLDER
            //===
            Part.prototype.setPlaceholder = function (src, position, scale) {
                var _this = this;
                if (!this.placeholderRaster) {
                    this.placeholderRaster = new this.paper.Raster();
                    this.placeholderRaster.selected = false;
                    this.placeholderRaster.opacity = 0.5;
                }
                this.placeholderRaster.scaling = scale;
                this.placeholderRaster.position = position;
                Utils.changeRasterImage(this.paper, this.placeholderRaster, src, function () { return _this.update(); });
            };
            Part.prototype.setPlaceholderTransform = function (position, scale) {
                this.placeholderRaster.position.x = position.x;
                this.placeholderRaster.position.y = position.y;
                this.placeholderRaster.scaling.x = scale.x;
                this.placeholderRaster.scaling.y = scale.y;
                this.update();
            };
            //===
            // UTILITIES
            //===
            Part.prototype.getItems = function () {
                if (this.paper.project.layers[1].children.length == 0)
                    return [];
                var json = this.paper.project.layers[1].children;
                return json;
            };
            Part.prototype.setItems = function (items, areas) {
                var _this = this;
                this.paper.project.layers[1].removeChildren();
                var texturable = this.getTexturable();
                // Clipping areas
                var masterGroup = new this.paper.Group();
                var paths = [];
                // Find all paths
                for (var i = 0; i < areas.length; i++) {
                    var area = areas.at(i);
                    var path = this.paper.project.activeLayer.importJSON(area.get("path"));
                    if (path instanceof this.paper.CompoundPath) {
                        for (var j = 0; j < path.children.length; j++) {
                            paths.push(path.children[j]);
                        }
                    }
                    else
                        paths.push(path);
                }
                // Adjust them
                paths.forEach(function (path) {
                    path.data = undefined;
                    path.scale(texturable.itemsScale.x, texturable.itemsScale.y);
                    path.position = new _this.paper.Point(path.position.x * texturable.itemsScale.x + texturable.itemsPosition.x, path.position.y * texturable.itemsScale.y + texturable.itemsPosition.y);
                });
                // Create the final compound path
                var clip = new this.paper.CompoundPath({
                    children: paths
                });
                clip.isClippingArea = true;
                clip.data = undefined;
                masterGroup.addChild(clip);
                // Must be after the addChild
                clip.sendToBack();
                clip.fillRule = "nonzero";
                clip.clipMask = true;
                clip.reorient(false, true);
                // Add all items
                $.each(items, function (i, item) {
                    var child = _this.paper.project.layers[1].importJSON(item.json);
                    masterGroup.addChild(child);
                    child.scale(texturable.itemsScale.x, texturable.itemsScale.y);
                    child.position = new _this.paper.Point(child.position.x * texturable.itemsScale.x + texturable.itemsPosition.x, child.position.y * texturable.itemsScale.y + texturable.itemsPosition.y);
                    child.guid = item.guid;
                    if (child instanceof _this.paper.Raster) {
                        child.onLoad = function () {
                            _this.update();
                        };
                    }
                });
                $.each(masterGroup.children, function (i, c) { return c.selected = false; });
                this.update();
            };
            Part.prototype.findPaperItem = function (guid) {
                var item = null;
                $.each(this.paper.project.layers[1].children, function (i, c) {
                    if (c.guid && c.guid == guid) {
                        item = c;
                        return false;
                    }
                });
                return item;
            };
            Part.prototype.getTextureUrl = function () {
                if (this.hasTexture) {
                    return this.textureUrl;
                }
                else {
                    return null;
                }
            };
            // Will return THIS object or a PartColor based on the current color
            // of the model. Used as shorthand for updating a property without 
            // checking if is for a color or the base part
            Part.prototype.getTexturable = function () {
                return this.model.color == -1 ? this : this.getColor(this.model.color);
            };
            Part.prototype.update = function () {
                if (!this.canvas)
                    return;
                if (this.isHoverEffect) {
                    if (this.baseTextureRaster) {
                        this.baseTextureRaster.visible = false;
                        //this.colorizePath.visible = false;
                    }
                    this.baseColorPath.fillColor = "#FF0000";
                    this.baseColorPath.opacity = 1;
                    this.material.opacity = 1;
                    this.material.reflectivity = 0;
                    this.flush();
                }
                else {
                    if (this.baseTextureRaster) {
                        this.baseTextureRaster.visible = true;
                        //this.colorizePath.visible = true;
                    }
                    this.updateTexture();
                    this.updateColor();
                }
            };
            Part.prototype.flush = function () {
                this.paper.view.viewSize = [this.textureWidth, this.textureHeight];
                this.paper.view.center = new this.paper.Point(0, 0);
                this.paper.view.update();
                this.texture.needsUpdate = true;
            };
            Part.prototype.toBackboneModel = function (previewModel) {
                var part = previewModel.get("parts").get(this.id);
                if (!part)
                    part = new MPlaza.PreviewPart();
                part.set("color", this.color);
                part.set("textureWidth", this.textureWidth);
                part.set("textureHeight", this.textureHeight);
                part.set("tempTextureFileKey", this.isTemp ? this.textureKey : "");
                part.set("hasTexture", this.hasTexture);
                part.set("materialIndex", this.material.index);
                part.set("opacity", this.opacity);
                part.set("opacityAffectCustomization", this.opacityAffectCustomization);
                part.set("reflectivity", this.reflectivity);
                part.set("sideID", this.side != null ? this.side.id : null);
                part.set("itemsPositionX", this.itemsPosition.x);
                part.set("itemsPositionY", this.itemsPosition.y);
                part.set("itemsScaleX", this.itemsScale.x);
                part.set("itemsScaleY", this.itemsScale.y);
                part.set("refractionMode", this.refractionMode);
                $.each(this.colors, function (i, color) { return part.get("colors").push(color.toBackboneModel(part)); });
                return part;
            };
            return Part;
        }());
        Preview3D.Part = Part;
        var PartColor = /** @class */ (function () {
            function PartColor(part, colorId, color, hasTexture, textureUrl, isCustomTexture, reflectivity, opacity, opacityAffectCustomization, itemsPosition, itemsScale) {
                this._opacityAffectCustomization = true;
                this.isTemp = false;
                // No triggers or stack overflow
                this._hasTexture = hasTexture;
                this._isCustomTexture = isCustomTexture;
                this._color = color;
                this.part = part;
                this.colorId = colorId;
                this.textureUrl = textureUrl;
                this._opacity = opacity;
                this._reflectivity = reflectivity;
                this._opacityAffectCustomization = opacityAffectCustomization;
                this._itemsPosition = itemsPosition;
                this._itemsScale = itemsScale;
            }
            Object.defineProperty(PartColor.prototype, "hasTexture", {
                // Getters / setters
                get: function () {
                    return this._hasTexture;
                },
                set: function (has) {
                    this._hasTexture = has;
                    this.part.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PartColor.prototype, "isCustomTexture", {
                get: function () {
                    return this._isCustomTexture;
                },
                set: function (is) {
                    this._isCustomTexture = is;
                    this.part.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PartColor.prototype, "color", {
                get: function () {
                    return this._color;
                },
                set: function (color) {
                    this._color = color;
                    this.part.updateColor();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PartColor.prototype, "opacityAffectCustomization", {
                get: function () {
                    if (this._opacityAffectCustomization !== undefined && this._opacityAffectCustomization != null)
                        return this._opacityAffectCustomization;
                    return this.part.opacityAffectCustomization;
                },
                set: function (a) {
                    this._opacityAffectCustomization = a;
                    this.part.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PartColor.prototype, "reflectivity", {
                get: function () {
                    if (this._reflectivity !== undefined && this._reflectivity != null)
                        return this._reflectivity;
                    return this.part.reflectivity;
                },
                set: function (reflectivity) {
                    this._reflectivity = reflectivity;
                    this.part.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PartColor.prototype, "opacity", {
                get: function () {
                    if (this._opacity !== undefined && this._opacity != null)
                        return this._opacity;
                    return this.part.opacity;
                },
                set: function (opacity) {
                    this._opacity = opacity;
                    this.part.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PartColor.prototype, "itemsPosition", {
                get: function () {
                    if (this._itemsPosition !== undefined && this._itemsPosition != null)
                        return this._itemsPosition;
                    return this.part.itemsPosition;
                },
                set: function (itemsPosition) {
                    this._itemsPosition = itemsPosition;
                    this.part.update();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PartColor.prototype, "itemsScale", {
                get: function () {
                    if (this._itemsScale !== undefined && this._itemsScale != null)
                        return this._itemsScale;
                    return this.part.itemsScale;
                },
                set: function (itemsScale) {
                    this._itemsScale = itemsScale;
                    this.part.update();
                },
                enumerable: true,
                configurable: true
            });
            PartColor.prototype.getTextureUrl = function () {
                if (this.hasTexture) {
                    // Check if we checked "CustomTexture" but we not selected a texture yet...
                    if (this.isCustomTexture) {
                        return this.textureUrl;
                    }
                    else {
                        return this.part.getTextureUrl();
                    }
                }
                else {
                    return null;
                }
            };
            PartColor.prototype.toBackboneModel = function (part) {
                var partColor = part.get("colors").get(this.colorId);
                if (!partColor) {
                    partColor = new MPlaza.PreviewColor();
                    partColor.set("colorID", this.colorId);
                }
                partColor.set("color", this.color);
                partColor.set("tempTextureFileKey", this.isTemp ? this.textureKey : "");
                partColor.set("hasTexture", this.hasTexture);
                partColor.set("isCustomTexture", this.isCustomTexture);
                partColor.set("reflectivity", this.reflectivity);
                partColor.set("opacity", this.opacity);
                partColor.set("opacityAffectCustomization", this.opacityAffectCustomization);
                partColor.set("itemsPositionX", this.itemsPosition.x);
                partColor.set("itemsPositionY", this.itemsPosition.y);
                partColor.set("itemsScaleX", this.itemsScale.x);
                partColor.set("itemsScaleY", this.itemsScale.y);
                return partColor;
            };
            PartColor.prototype.setTextureParam = function (hasTexture, isCustomTexture) {
                this._isCustomTexture = isCustomTexture;
                this._hasTexture = hasTexture;
                this.part.update();
            };
            return PartColor;
        }());
        Preview3D.PartColor = PartColor;
        // THREE material wrapper
        var Material = /** @class */ (function () {
            // Constructor
            function Material(index, material) {
                this.index = index;
                this.threeMaterial = material;
                material.needsUpdate = true;
            }
            Object.defineProperty(Material.prototype, "name", {
                // Getter/Setters
                get: function () {
                    return this.threeMaterial.name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "color", {
                get: function () {
                    return this._color;
                },
                set: function (color) {
                    this._color = color;
                    this.threeMaterial.color = new THREE.Color(color);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "opacity", {
                get: function () {
                    return this.threeMaterial.opacity;
                },
                set: function (a) {
                    this.threeMaterial.opacity = a;
                    this.threeMaterial.side = THREE.DoubleSide; //a == 1 ? THREE.DoubleSide : THREE.FrontSide;
                    this.threeMaterial.needsUpdate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "reflectivity", {
                get: function () {
                    return this.threeMaterial.reflectivity;
                },
                set: function (value) {
                    this.threeMaterial.reflectivity = value;
                    this.threeMaterial.roughness = 1 - value;
                    this.threeMaterial.needsUpdate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "texture", {
                get: function () {
                    return this._texture;
                },
                set: function (tex) {
                    this._texture = tex;
                    this.threeMaterial.map = tex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "transparent", {
                get: function () {
                    return this.threeMaterial.transparent;
                },
                set: function (transparent) {
                    this.threeMaterial.transparent = transparent;
                    this.threeMaterial.needsUpdate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "envMap", {
                set: function (map) {
                    this.threeMaterial.envMap = map;
                    this.threeMaterial.needsUpdate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "refractionRatio", {
                set: function (ratio) {
                    this.threeMaterial.refractionRatio = ratio;
                    this.threeMaterial.needsUpdate = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "combine", {
                set: function (combine) {
                    this.threeMaterial.combine = combine;
                    this.threeMaterial.needsUpdate = true;
                },
                enumerable: true,
                configurable: true
            });
            Material.prototype.setThreeMaterialData = function (data) {
                if (this.threeMaterial)
                    this.threeMaterial.data = this.threeMaterial.data ? Object.assign(this.threeMaterial.data, data) : data;
            };
            Material.prototype.getThreeMaterialData = function () {
                return this.threeMaterial ? this.threeMaterial.data : null;
            };
            return Material;
        }());
        Preview3D.Material = Material;
    })(Preview3D = Zakeke.Preview3D || (Zakeke.Preview3D = {}));
})(Zakeke || (Zakeke = {}));
