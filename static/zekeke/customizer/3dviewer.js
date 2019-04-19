
var Preview3DViewer = function (container, customizer, antialias, isMobile) {
    this.container = container;
    this.viewer = null;
    this.model = null;
    this.previewModel = null;
    this.customizer = customizer;
    this.onModelLoadComplete = null;
    this.onModelLoadError = null;
    this.isMobile = isMobile;
    this.antialias = antialias;
    this.init();

    //var stats = new Stats();
    //stats.showPanel(0);
    //document.body.appendChild(stats.dom);

    //this.viewer.statsEnd = function() { stats.begin(); };
    //this.viewer.statsEnd = function() { stats.end(); }
};


Preview3DViewer.prototype = {

    // Init scene, renderer and camera
    init: function () {

        // Viewer
        this.viewer = new Zakeke.Preview3D.Viewer(this.container, this.antialias, this.isMobile);
        this.viewer.previewMode = true;

        // Close legend
        $("#btn-close-legend").click(function () {
            $("#preview3d-viewer .legend").hide();
            window.localStorage.zakekePreview3dLegendHide = true;
        });

        // Hide legend 
        if (window.localStorage.zakekePreview3dLegendHide === "true") {
            $("#preview3d-viewer .legend").css("display", "none");
        }

        this.fitToParent();
    },

    loadModel: function (model, colorId) {
        var that = this;
        this.model = model;
        this.viewer.loadModelFromBackbone(model, colorId, function (previewModel) {
            that.previewModel = previewModel;

            // Hide all meshes at startup, focusSide will show the correct mesh
            for (let _mesh of previewModel.getMeshes(previewModel.mesh))
                _mesh.visible = false;

            if (that.onModelLoadComplete)
                that.onModelLoadComplete();
        }, function (error) {
            console.error(error);
            if (that.onModelLoadError)
                that.onModelLoadError();
        });
    },

    clear: function () {
        this.viewer.clear();
        this.model = null;
    },

    setColor: function (colorId) {
        if (this.previewModel)
            this.previewModel.color = colorId;
    },

    updateItems: function () {
        if (!this.model || !this.previewModel)
            return;

        var that = this;


        this.previewModel.parts.forEach(function (part) {
            part.setItems([], []);
        });

        this.model.get("colors").get(this.previewModel.color).get("sides").each(function (side) {
            var part = that.previewModel.findPartBySideId(side.id);

            var items = [];

            if (part) {

                // Order the design items by Index to maintain the children z-index
                // beacuse it is lost in designItems array
                var areas = side.get("areas");
                var designItems = that.customizer.design.getSideDesignItems(side);

                for (var i = 0; i < designItems.length; i++) {
                    var designItem = designItems[i];

                    if (!designItem.get("constraints") || designItem.get("constraints").get("isPrintable"))
                        items.push({ json: designItem.get("json"), index: designItem.get("index") })
                }

                part.setItems(items, areas);
            }
        });

    },

    focusSide: function (side) {
        if (this.previewModel && this.viewer)
            this.viewer.focusSide(side.id);
    },

    fitToParent: function () {
        var canvasWidth = $(this.viewer.domElement).parent().width();
        var canvasHeight = $(this.viewer.domElement).parent().height();
        this.viewer.width = canvasWidth;
        this.viewer.height = canvasHeight;
    },

    setBackgroundColor: function (colorHex) {
        this.viewer.renderer.setClearColor(colorHex, 1);
    }
};
