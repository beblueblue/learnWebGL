var MPlaza = MPlaza || {};


// -----------------------------------------------------------
// Utility functions
// -----------------------------------------------------------
MPlaza.EmptyUUID = "00000000-0000-0000-0000-000000000000";

MPlaza.generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

MPlaza.getContrastYIQ = function (r, g, b) {
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

MPlaza.getContrastYIQHex = function (hexcolor) {
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

MPlaza.makeID = function (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// Enums
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MPlaza.PricingModel = {
    Simple: 1,
    Advanced: 2,
};

MPlaza.PricingType = {
    Undefined: 1,
    Global: 2,
    PerColor: 3,
};

MPlaza.PricingApplicationType = {
    Undefined: 1,
    Global: 2,
    PerSide: 3,
    PerArea: 4,
};

MPlaza.AttributeType = {
    Options: 1,
    Color: 2,
    Number: 3,
    String: 4
};

MPlaza.LogicalOperator = {
    AND: "AND",
    OR: "OR"
};

MPlaza.ComparisonOperator = {
    Equal: "Equal",
    NotEqual: "NotEqual",
    In: "In",
    NotIn: "NotIn",
};

MPlaza.SceneElementType = {
    None: 0,
    Mesh: 1,
    Material: 2,
    Light: 4,
    Camera: 8,
    CameraLocation: 16,
    SubMesh: 32,
};

MPlaza.SceneElementType.All = MPlaza.SceneElementType.Mesh | MPlaza.SceneElementType.Material |
    MPlaza.SceneElementType.Light | MPlaza.SceneElementType.Camera |
    MPlaza.SceneElementType.CameraLocation | MPlaza.SceneElementType.SubMesh;

MPlaza.SceneActionType = {
    Filter: 1,
    ShowHideMesh: 2,
    SetMeshMaterial: 3,
    SetMaterialColor: 4,
    SetCameraLocation: 5,
    AdjustCamera: 6,
    SetSubMeshMaterial: 7,
    SetCameraPivot: 8,
    ResetCameraPivot: 9,
    EnableDiableZoom: 10,
};


MPlaza.PaddingType = {
    Start: 1,
    End: 2,
    StartEnd: 3
};

MPlaza.AttributeOptionPreviewShape = {
    Rectangle: 1,
    Circle: 2
};

MPlaza.AttributeGroupDirection = {
    Horizontal: 0,
    Vertical: 1
};

MPlaza.DeviceType = {
    Any: 0,
    PC: 1,
    Phone: 2,
    Tablet: 4,
};

MPlaza.DeviceType.All = MPlaza.DeviceType.PC | MPlaza.DeviceType.Phone | MPlaza.DeviceType.Tablet;

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Temp state interface
// -----------------------------------------------------------

var TempStateObjectInterface = {

    tempState: null,

    initTempState: function () {
        this.tempState = this.clone();

        this.callToTempStateChildren("initTempState");
    },

    applyTempState: function () {
        if (this.tempState)
            this.set(this.tempState.attributes);

        this.callToTempStateChildren("applyTempState");
    },

    resetTempState: function () {
        this.tempState = null;
    },

    childHasTempState: function (child) {
        if (child && child.hasOwnProperty("tempState"))
            return true;
        else
            return false;
    },

    hasTempStateChildren: function () {
        if (this.tempStateChildren && Array.isArray(this.tempStateChildren) && this.tempStateChildren.length > 0)
            return true;
        else
            return false;
    },

    callToTempStateChildren: function (callback) {
        if (!this.hasTempStateChildren() || !this.tempState)
            return;

        this.tempStateChildren.forEach(x => {
            var child = this.tempState.get(x);

            if (this.childHasTempState(child) && callback)
                child[callback]();
        });
    }
}

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// UserIdentity
// -----------------------------------------------------------
MPlaza.UserIdentity = Backbone.AssociatedModel.extend({
    defaults: {
        nominative: "",
        token: ""
    },

    idAttribute: "userID",

    initialize: function () {
    },

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'login';
        return urlRoot;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// AttributeProposition
// -----------------------------------------------------------
MPlaza.AttributeProposition = Backbone.AssociatedModel.extend({
    defaults: {
        attributeGuid: "",
        op: "Equal",
        value: "",
    },

    initialize: function () {
    },

    relations: [],

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// AttributePropositions
// -----------------------------------------------------------
MPlaza.AttributePropositions = Backbone.Collection.extend({
    model: MPlaza.AttributeProposition,
});

// -----------------------------------------------------------
// AttributeExpression
// -----------------------------------------------------------
MPlaza.AttributeExpression = Backbone.AssociatedModel.extend({
    defaults: {
        op: "AND",
        propositions: null,
        expressions: null,
    },

    initialize: function () {
        var model = this;

        // Gestisco il fetch, in quel caso gli array sono pieni e non vanno reinizializzati.
        if (!this.get("propositions"))
            this.set("propositions", []);
        if (!this.get("expressions"))
            this.set("expressions", []);

        this.get("propositions").parentModel = this;
        this.get('expressions').parentModel = this;
    },

    getAllAttributeGuids: function () {
        var guids = [];

        var addPropositionGuids = function (proposition) {
            var guid = proposition.attributeGuid;
            if (!Zakeke.arrayContains(guids, guid))
                guids.push(guid);
        }

        var addExpressionGuids = function (expression) {
            for (var i = 0; i < expression.propositions.length; i++) {
                var prop = expression.proposition[i];
                addPropositionGuids(prop);
            }
        }

        for (var i = 0; i < this.get("propositions").length; i++) {
            var prop = this.get("propositions")[i];
            addPropositionGuids(prop);
        }

        for (var i = 0; i < this.get("expressions").length; i++) {
            var expr = this.get("expressions")[i];
            addExpressionGuids(expr);
        }

        return guids;
    },

    isEmpty: function () {
        return this.get("propositions").length == 0 && this.get("expressions").length == 0;
    }
});

// -----------------------------------------------------------
// AttributeExpressions
// -----------------------------------------------------------
MPlaza.AttributeExpressions = Backbone.Collection.extend({
    model: MPlaza.AttributeExpression,
});





// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



// -----------------------------------------------------------
// AttributeSelectionColor
// -----------------------------------------------------------
MPlaza.AttributeSelectionColor = Backbone.AssociatedModel.extend({
    defaults: {
        selectionExpression: null,
        colorID: -1,
    },

    idAttribute: "selectionID",
});

// -----------------------------------------------------------
// AttributeSelectionColors
// -----------------------------------------------------------
MPlaza.AttributeSelectionColors = Backbone.Collection.extend({
    model: MPlaza.AttributeSelectionColor,

    getAttributeSelectionColor: function (selectionID) {
        for (var i = 0; i < this.length; i++) {
            var attributeSelectionColor = this.at(i);
            if (attributeSelectionColor.get("selectionID") == selectionID)
                return attributeSelectionColor;
        }
        return null;
    },
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// ComposerPricingPrice
// -----------------------------------------------------------
MPlaza.ComposerPricingPrice = Backbone.AssociatedModel.extend({
    defaults: {
        qtyFrom: 0,
        qtyTo: null,
        price: 0,
    },

    idAttribute: "priceID",

    initialize: function () {
    },

    relations: [],

    getPricingID: function () {
        if (this.collection && this.collection.getPricingID) {
            return this.collection.getPricingID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// ComposerPricingPrices
// -----------------------------------------------------------
MPlaza.ComposerPricingPrices = Backbone.Collection.extend({
    model: MPlaza.ComposerPricingPrice,

    getPricingID: function () {
        if (this.parentModel && this.parentModel.getPricingID) {
            return this.parentModel.getPricingID();
        }
        return null;
    },
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// ComposerPricing
// -----------------------------------------------------------
MPlaza.ComposerPricing = Backbone.AssociatedModel.extend({
    defaults: {
        prices: [],
    },

    // modificare in docID per salvare su NoSQL
    //idAttribute: "designID",
    idAttribute: "pricingID",

    initialize: function () {
        var model = this;
        this.get("prices").parentModel = this;

        this.on("change", function () {
            model._fireEvent("change");
        });

        this.get("prices").on("add", function () {
            model._fireEvent("change");
        });

        this.get("prices").on("remove", function () {
            model._fireEvent("change");
        });

        this.get("prices").on("change", function () {
            model._fireEvent("change");
        });
    },

    _eventListeners: {
        change: []
    },

    _fireEvent: function (eventName, e) {
        if (this._eventListeners &&
            _.isObject(this._eventListeners) &&
            _.has(this._eventListeners, eventName) &&
            _.isArray(this._eventListeners[eventName])) {
            var listeners = this._eventListeners[eventName];
            for (var i = 0; i < listeners.length; ++i) {
                listeners[i](e);
            }
        }
    },

    trigger: function (eventName) {
        this._fireEvent(eventName);
    },

    addEventListener: function (eventName, listenerFunction) {
        if (this._eventListeners &&
            _.isObject(this._eventListeners)) {
            if (!_.has(this._eventListeners, eventName)) {
                this._eventListeners[eventName] = [];
            }
            this._eventListeners[eventName].push(listenerFunction);
        }
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'prices',
            collectionType: MPlaza.ComposerPricingPrices
        },
    ],

    url: function () {
        // da modificare per utilizzare NoSQL
        // url: pricings/<pricingID>
        var urlRoot = Zakeke.config.baseApiUrl + 'composerpricings';
        if (this.id != undefined && this.id != null && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getPricingID: function () {
        return this.get("pricingID");
    },

    toString: function () {
        // todo.......
    },

    getComposerPricingPriceForQuantity: function (quantity) {
        for (var i = 0; i < this.get("prices").length; i++) {
            var price = this.get("prices").at(i);
            if (price.get("qtyFrom") <= quantity &&
                (!price.get("qtyTo") || quantity < price.get("qtyTo"))) {
                return price;
            }
        }
        return null;
    },
});

// -----------------------------------------------------------
// ComposerPricings
// -----------------------------------------------------------
MPlaza.ComposerPricings = Backbone.Collection.extend({
    model: MPlaza.ComposerPricing,
    url: function () {
        return Zakeke.config.baseApiUrl + 'composerpricings';
    },

    getComposerPricing: function (pricingID) {
        for (var i = 0; i < this.length; i++) {
            var pricing = this.at(i);
            if (pricing.get("pricingID") == pricingID)
                return pricing;
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx




// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


// -----------------------------------------------------------
// AttributePricing
// -----------------------------------------------------------
MPlaza.AttributePricing = Backbone.AssociatedModel.extend({
    defaults: {
        selectedOptionID: null,
        selectedOptionGuid: null,
        selectedValue: "",
        constraintExpression: null,
        price: 0,
        pricingID: -1, // ComposerPricing.PricingID
    },

    idAttribute: "attributePricingID",

    initialize: function () {
        var model = this;
    },

    relations: [
        {
            type: Backbone.One,
            key: 'constraintExpression',
            relatedModel: MPlaza.AttributeExpression
        },
    ],
});

// -----------------------------------------------------------
// AttributePricings
// -----------------------------------------------------------
MPlaza.AttributePricings = Backbone.Collection.extend({
    model: MPlaza.AttributePricing,
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// AttributeSceneAction
// -----------------------------------------------------------
MPlaza.AttributeSceneAction = Backbone.AssociatedModel.extend({
    defaults: {
        name: "",
        actionTypeID: MPlaza.SceneActionType.ShowHideMesh,
        sceneElementTypeID: MPlaza.SceneElementType.Mesh,
        selector: "",
        propertyName: "",
        value: "",
        execOrder: 0,
        deviceTypes: MPlaza.DeviceType.Any
    },

    idAttribute: "actionID",

    initialize: function () {
    },

    relations: [],

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    resetIDs: function () {
        this.tempID = Zakeke.generateUUID();
        this.unset("actionID");
    }
});

// -----------------------------------------------------------
// AttributeSceneActions
// -----------------------------------------------------------
MPlaza.AttributeSceneActions = Backbone.Collection.extend({
    model: MPlaza.AttributeSceneAction,

    resetIDs: function () {
        for (var i = 0; i < this.length; i++) {
            var action = this.at(i);
            action.resetIDs();
        }
    },

    comparator: function (model) {
        return model.get("execOrder");
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


// -----------------------------------------------------------
// AttributeOption
// -----------------------------------------------------------
MPlaza.AttributeOption = Backbone.AssociatedModel.extend({
    defaults: {
        optionCode: "",
        tempImageFileKey: "",
        imageUrl: "",
        imageFileObjectID: -1,
        tempImageFileObjectID: -1,
        displayOrder: 0,
        name: "",
        description: "",
        isDefault: false,
        constraintExpression: null,
        actions: [],
    },

    idAttribute: "optionID",

    initialize: function () {
        var model = this;
        this.get("actions").parentModel = this;
        if (!this.get("optionGuid")) {
            this.set("optionGuid", MPlaza.generateUUID());
        }
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'actions',
            collectionType: MPlaza.AttributeSceneActions
        },
        {
            type: Backbone.One,
            key: 'constraintExpression',
            relatedModel: MPlaza.AttributeExpression
        },
    ],

    resetIDs: function () {
        this.tempID = Zakeke.generateUUID();
        this.unset("optionID");
        this.set("optionGuid", MPlaza.generateUUID());
        this.get("actions").resetIDs();
    },
  

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    getPricings: function () {
        var pricings = [];
        var attribute = this.getParentModel();
        if (attribute) {
            pricings = attribute.getOptionPricings(this.get("optionGuid"));
        }
        return pricings;
    },

    addSimplePricing: function (price, constraintExpression) {
        var attribute = this.getParentModel();
        if (attribute) {
            var pricing = new MPlaza.AttributePricing();
            if (this.get("optionID"))
                pricing.set("selectedOptionID", this.get("optionID"));
            pricing.set("selectedOptionGuid", this.get("optionGuid"));
            if (constraintExpression && constraintExpression instanceof MPlaza.AttributeExpression)
                pricing.set("constraintExpression", constraintExpression);
            pricing.set("price", price);

            attribute.get("pricings").add(pricing);
            return pricing;
        }

        return null;
    },

    addAdvancedPricing: function (composerPricing, constraintExpression) {
        var attribute = this.getParentModel();
        if (attribute && composerPricing && composerPricing instanceof MPlaza.ComposerPricing) {
            var pricing = new MPlaza.AttributePricing();
            if (this.get("optionID"))
                pricing.set("selectedOptionID", this.get("optionID"));
            pricing.set("selectedOptionGuid", this.get("optionGuid"));
            if (constraintExpression && constraintExpression instanceof MPlaza.AttributeExpression)
                pricing.set("constraintExpression", constraintExpression);

            pricing.set("pricingID", composerPricing.get("pricingID"));

            attribute.get("pricings").add(pricing);
        }
    },

    removePricing: function (attributePricing) {
        var attribute = this.getParentModel();
        if (attribute) {
            attribute.get("pricings").remove(attributePricing);
        }
    },
});

// -----------------------------------------------------------
// AttributeOptions
// -----------------------------------------------------------
MPlaza.AttributeOptions = Backbone.Collection.extend({
    model: MPlaza.AttributeOption,
    comparator: function (model) {
        return model.get("displayOrder");
    },
    
    resetIDs: function () {
        for (var i = 0; i < this.length; i++) {
            var option = this.at(i);
            option.resetIDs();
        }
    },
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



// -----------------------------------------------------------
// Attribute
// -----------------------------------------------------------
MPlaza.Attribute = Backbone.AssociatedModel.extend({
    defaults: {
        //attributeGuid: "",
        attributeCode: "",
        attributeTypeID: MPlaza.AttributeType.Options,
        name: "",
        description: "",
        groupID: -1,
        groupGuid: MPlaza.EmptyUUID,
        stepID: -1,
        stepGuid: MPlaza.EmptyUUID,
        defaultValue: "",
        displayOrder: 0,
        optionPreviewShapeID: MPlaza.AttributeOptionPreviewShape.Rectangle,
        options: [],
        preActions: [],
        valueActions: [],
        postActions: [],
        pricings: [],
        constraintExpression: null,
        meshSelector: "",
        sceneCameraLocationID: MPlaza.EmptyUUID,
        hideOptionsLabel: false
    },

    idAttribute: "attributeID",

    initialize: function () {
        var model = this;
        if (!this.get("attributeGuid")) {
            this.set("attributeGuid", MPlaza.generateUUID());
        }
        this.get("options").parentModel = this;
        this.get("preActions").parentModel = this;
        this.get('valueActions').parentModel = this;
        this.get('postActions').parentModel = this;
        this.get('pricings').parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'options',
            collectionType: MPlaza.AttributeOptions
        },
        {
            type: Backbone.Many,
            key: 'preActions',
            collectionType: MPlaza.AttributeSceneActions
        },
        {
            type: Backbone.Many,
            key: 'valueActions',
            collectionType: MPlaza.AttributeSceneActions
        },
        {
            type: Backbone.Many,
            key: 'postActions',
            collectionType: MPlaza.AttributeSceneActions
        },
        {
            type: Backbone.Many,
            key: 'pricings',
            collectionType: MPlaza.AttributePricings
        },
        {
            type: Backbone.One,
            key: 'constraintExpression',
            relatedModel: MPlaza.AttributeExpression
        },
    ],

    getOption: function (optionID) {
        return this.get("options").findWhere({ optionID: optionID });
    },

    getOptionByGuid: function (optionGuid) {
        return this.get("options").findWhere({ optionGuid: optionGuid });
    },

    cloneAttribute: function (newName) {
        var clone = this.clone();
        if (newName !== undefined)
            clone.set("name", newName);

        for(var i = 0; i < this.get("options").length; i++) {
            var option = this.get("options").at(i);
            var clonedOption = clone.get("options").get(option.get("optionID"));         
            clonedOption.set("tempImageFileObjectID", option.get("imageFileObjectID"));
        }

        clone.resetIDs();

        return clone;
    },

    addClonedOption: function (originalOption, newName) {
        var clone = originalOption.clone();
        if (newName !== undefined)
            clone.set("name", newName);
        clone.resetIDs();
        clone.set("isDefault", false);
        clone.set("tempImageFileObjectID", originalOption.get("imageFileObjectID"));

        this.get("options").add(clone);

        return clone;
    },

    getOptionPricings: function (optionGuid) {
        return this.get("pricings").where({ selectedOptionGuid: optionGuid });
    },

    resetIDs: function () {
        this.tempID = Zakeke.generateUUID();
        this.unset("attributeID");
        this.set("attributeGuid", MPlaza.generateUUID());
        this.get("options").resetIDs();
    }
});

// -----------------------------------------------------------
// Attributes
// -----------------------------------------------------------
MPlaza.Attributes = Backbone.Collection.extend({
    model: MPlaza.Attribute,

    getAttribute: function (attributeID) {
        for (var i = 0; i < this.length; i++) {
            var attribute = this.at(i);
            if (attribute.get("attributeID") == attributeID)
                return attribute;
        }
        return null;
    },

    getAttributeByGuid: function (attributeGuid) {
        for (var i = 0; i < this.length; i++) {
            var attribute = this.at(i);
            if (attribute.get("attributeGuid") == attributeGuid)
                return attribute;
        }
        return null;
    },

    comparator: function (model) {
        return model.get('displayOrder');
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// AttributeGroup
// -----------------------------------------------------------
MPlaza.AttributeGroup = Backbone.AssociatedModel.extend({
    defaults: {
        tempImageFileKey: "",
        imageUrl: "",
        name: "",
        displayOrder: 0,
        sceneCameraLocationID: MPlaza.EmptyUUID,
        meshSelector: "",
        direction: 0,
        attributesAlwaysOpened: false
    },

    idAttribute: "groupID",

    initialize: function () {
        if (!this.get("groupGuid")) {
            this.set("groupGuid", MPlaza.generateUUID());
        }
    },

    relations: [],

    resetIDs: function () {
        this.tempID = Zakeke.generateUUID();
        this.unset("groupID");
        this.set("groupGuid", MPlaza.generateUUID());
    },

    cloneGroup: function (newName) {
        var clone = this.clone();
        if (newName !== undefined)
            clone.set("name", newName);

        clone.resetIDs();

        return clone;
    }

});

// -----------------------------------------------------------
// AttributeGroups
// -----------------------------------------------------------
MPlaza.AttributeGroups = Backbone.Collection.extend({
    model: MPlaza.AttributeGroup,
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// AttributeStep
// -----------------------------------------------------------
MPlaza.AttributeStep = Backbone.AssociatedModel.extend({
    defaults: {
        groupID: -1,
        groupGuid: null,
        name: "",
        displayOrder: 0
    },

    idAttribute: "stepID",

    initialize: function () {
        if (!this.get("stepGuid")) {
            this.set("stepGuid", MPlaza.generateUUID());
        }
    },

    relations: [],

    resetIDs: function () {
        this.tempID = Zakeke.generateUUID();
        this.unset("stepID");
        this.set("stepGuid", MPlaza.generateUUID());
    },

    cloneStep: function (newName) {
        var clone = this.clone();
        if (newName !== undefined)
            clone.set("name", newName);

        clone.resetIDs();

        return clone;
    }

});

// -----------------------------------------------------------
// AttributeSteps
// -----------------------------------------------------------
MPlaza.AttributeSteps = Backbone.Collection.extend({
    model: MPlaza.AttributeStep,
});

// -----------------------------------------------------------
// NormalmapConfig
// -----------------------------------------------------------
MPlaza.NormalmapConfig = Backbone.AssociatedModel.extend({
    defaults: {
        showDesign: true,
        showOnDesign: true,
        showOnMesh: true,
        bias: 50.0,
        invertR: false,
        invertG: false,
        preBlurEnabled: false,
        preBlur: 3.0,
        postBlurEnabled: false,
        postBlur: 3.0,
        intensity: 0.5,
        bevel: true,
    },

    initialize: function () {
    },

    relations: [
    ],

    getParentModel: function () {
        return this.parentModel;
    },

    toString: function () {
    },
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// ModelSceneMeshSide
// -----------------------------------------------------------
MPlaza.ModelSceneMeshSide = Backbone.AssociatedModel.extend({
    defaults: {
        meshID: "",
        subMeshID: 0,
        sideID: -1,
        matrix: "",
        percWidth: 1,
        percHeight: 1,
        uvChannel: 0,
        materialID: null,
        materialTexture: "",
        isNormalmapEnabled: false,
        normalmapConfig: null
    },

    idAttribute: "key",

    initialize: function () {
    },

    relations: [
        {
            type: Backbone.One,
            key: 'normalmapConfig',
            relatedModel: MPlaza.NormalmapConfig
        }
    ],
});

// -----------------------------------------------------------
// ModelSceneMeshSides
// -----------------------------------------------------------
MPlaza.ModelSceneMeshSides = Backbone.Collection.extend({
    model: MPlaza.ModelSceneMeshSide,
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// ModelScene
// -----------------------------------------------------------
MPlaza.ModelScene = Backbone.AssociatedModel.extend({
    defaults: {
        sceneID: "",
        isDefault: false,
        meshSides: []
    },

    initialize: function () {
        var model = this;
        this.get("meshSides").parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'meshSides',
            collectionType: MPlaza.ModelSceneMeshSides
        },
    ],
});

// -----------------------------------------------------------
// ModelScenes
// -----------------------------------------------------------
MPlaza.ModelScenes = Backbone.Collection.extend({
    model: MPlaza.ModelScene,
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

MPlaza.AttributeSelectionScript = function () {
    this.attributeID = -1;
    this.selectedValue = "";
    this.actions = [];
}

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// DesignPrice
// -----------------------------------------------------------
MPlaza.DesignPrice = Backbone.AssociatedModel.extend({
    defaults: {
        qtyFrom: 0,
        qtyTo: null,
        price: 0,
        firstColorPrice: null
    },

    idAttribute: "priceID",

    initialize: function () {
    },

    relations: [],

    getPricingID: function () {
        if (this.collection && this.collection.getPricingID) {
            return this.collection.getPricingID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// DesignPrices
// -----------------------------------------------------------
MPlaza.DesignPrices = Backbone.Collection.extend({
    model: MPlaza.DesignPrice,

    getPricingID: function () {
        if (this.parentModel && this.parentModel.getPricingID) {
            return this.parentModel.getPricingID();
        }
        return null;
    },
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// SetupPrice
// -----------------------------------------------------------
MPlaza.SetupPrice = Backbone.AssociatedModel.extend({
    defaults: {
        qtyFrom: 0,
        qtyTo: null,
        price: 0,
        firstColorPrice: null
    },

    idAttribute: "priceID",

    initialize: function () {
    },

    relations: [],

    getPricingID: function () {
        if (this.collection && this.collection.getPricingID) {
            return this.collection.getPricingID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// SetupPrices
// -----------------------------------------------------------
MPlaza.SetupPrices = Backbone.Collection.extend({
    model: MPlaza.SetupPrice,

    getPricingID: function () {
        if (this.parentModel && this.parentModel.getPricingID) {
            return this.parentModel.getPricingID();
        }
        return null;
    },
});



// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Pricing
// -----------------------------------------------------------
MPlaza.Pricing = Backbone.AssociatedModel.extend({
    defaults: {
        setupPriceTypeID: MPlaza.PricingType.Global,
        designPriceTypeID: MPlaza.PricingType.Global,
        setupPrices: [],
        designPrices: [],
    },

    // modificare in docID per salvare su NoSQL
    //idAttribute: "designID",
    idAttribute: "pricingID",

    initialize: function () {
        var model = this;
        this.get("setupPrices").parentModel = this;
        this.get('designPrices').parentModel = this;

        this.on("change", function () {
            model._fireEvent("change");
        });

        this.get("setupPrices").on("add", function () {
            model._fireEvent("change");
        });

        this.get("setupPrices").on("remove", function () {
            model._fireEvent("change");
        });

        this.get("setupPrices").on("change", function () {
            model._fireEvent("change");
        });


        this.get("designPrices").on("add", function () {
            model._fireEvent("change");
        });

        this.get("designPrices").on("remove", function () {
            model._fireEvent("change");
        });

        this.get("designPrices").on("change", function () {
            model._fireEvent("change");
        });
    },

    _eventListeners: {
        change: []
    },

    _fireEvent: function (eventName, e) {
        if (this._eventListeners &&
            _.isObject(this._eventListeners) &&
            _.has(this._eventListeners, eventName) &&
            _.isArray(this._eventListeners[eventName])) {
            var listeners = this._eventListeners[eventName];
            for (var i = 0; i < listeners.length; ++i) {
                listeners[i](e);
            }
        }
    },

    trigger: function (eventName) {
        this._fireEvent(eventName);
    },

    addEventListener: function (eventName, listenerFunction) {
        if (this._eventListeners &&
            _.isObject(this._eventListeners)) {
            if (!_.has(this._eventListeners, eventName)) {
                this._eventListeners[eventName] = [];
            }
            this._eventListeners[eventName].push(listenerFunction);
        }
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'setupPrices',
            collectionType: MPlaza.SetupPrices
        },
        {
            type: Backbone.Many,
            key: 'designPrices',
            collectionType: MPlaza.DesignPrices
        }
    ],

    url: function () {
        // da modificare per utilizzare NoSQL
        // url: pricings/<pricingID>
        var urlRoot = Zakeke.config.baseApiUrl + 'pricings';
        if (this.id != undefined && this.id != null && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getPricingID: function () {
        return this.get("pricingID");
    },

    toString: function () {
        // todo.......
    },

    getSetupPriceForQuantity: function (quantity) {
        for (var i = 0; i < this.get("setupPrices").length; i++) {
            var setupPrice = this.get("setupPrices").at(i);
            if (setupPrice.get("qtyFrom") <= quantity &&
                (!setupPrice.get("qtyTo") || quantity < setupPrice.get("qtyTo"))) {
                return setupPrice;
            }
        }
        return null;
    },

    getDesignPriceForQuantity: function (quantity) {
        for (var i = 0; i < this.get("designPrices").length; i++) {
            var designPrice = this.get("designPrices").at(i);
            if (designPrice.get("qtyFrom") <= quantity &&
                (!designPrice.get("qtyTo") || quantity < designPrice.get("qtyTo"))) {
                return designPrice;
            }
        }
        return null;
    },
});

// -----------------------------------------------------------
// Pricings
// -----------------------------------------------------------
MPlaza.Pricings = Backbone.Collection.extend({
    model: MPlaza.Pricing,
    url: function () {
        return Zakeke.config.baseApiUrl + 'pricings';
    },

    getPricing: function (pricingID) {
        for (var i = 0; i < this.length; i++) {
            var pricing = this.at(i);
            if (pricing.get("pricingID") == pricingID)
                return pricing;
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// PrintTypeFont
// -----------------------------------------------------------
MPlaza.PrintTypeFont = Backbone.AssociatedModel.extend({
    defaults: {
        printTypeID: -1,
        fontFamilyID: -1,
        fontFamilyName: null,
    },

    idAttribute: "fontFamilyID",

    initialize: function () {
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },
});


// -----------------------------------------------------------
// PrintTypeFonts
// -----------------------------------------------------------
MPlaza.PrintTypeFonts = Backbone.Collection.extend({
    model: MPlaza.PrintTypeFont,
    getModelID: function () {
        if (this.parentModel)
            return this.parentModel.getModelID();
        return null;
    },

    getFont: function (fontFamilyID) {
        for (var i = 0; i < this.length; i++) {
            var font = this.at(i);
            if (font.get("fontFamilyID") == fontFamilyID)
                return font;
        }
        return null;
    }
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// PartPrintTypeRestriction
// -----------------------------------------------------------
MPlaza.PartPrintTypeRestriction = Backbone.AssociatedModel.extend({
    defaults: {
        disableTextColors: null,
        textColors: null,
        disableSellerImages: null,
        disableUserImages: null,
        useImagesFixedSize: null,
        canAddText: null,
        canChangeSvgColors: null,
        canUseImageFilters: null,
        uploadRestrictions: null,
        canIgnoreDPIWarning: null,
        canPreviewDesignsPDF: null,
        useCustomFonts: null,
        defaultFontFamilyID: null,
        fonts: []
    },

    idAttribute: "partPrintTypeRestrictionID",

    initialize: function () {
        var printType = this;

        this.get("fonts").url = function () {
            return printType.url() + '/fonts';
        }

        this.get('fonts').parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'fonts',
            collectionType: MPlaza.PrintTypeFonts
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'partPrintTypeRestrictions';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id != undefined && this.id != null && this.id >= 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getPartPrintTypeRestrictionID: function () {
        return this.get("partPrintTypeRestrictionID");
    },

    getParentModel: function () {
        if (this.parentModel)
            return this.parentModel;
        return null;
    },

});

// -----------------------------------------------------------
// PartPrintType
// -----------------------------------------------------------
MPlaza.PartPrintType = Backbone.AssociatedModel.extend({
    defaults: {
        isEnabled: true,
        pricingID: -1,
        patID: MPlaza.PricingApplicationType.Global,
        partPrintTypeRestrictionID: null,
        dpi: null,
        restrictions: null
    },

    idAttribute: "printTypeID",

    initialize: function () {
        if (this.get("restrictions"))
            this.get("restrictions").parentModel = this;
    },

    relations: [
        {
            type: Backbone.One,
            key: 'restrictions',
            relatedModel: MPlaza.PartPrintTypeRestriction
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'partprintTypes';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id != undefined && this.id != null && this.id >= 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getPrintTypeID: function () {
        return this.get("printTypeID");
    },

    toString: function () {
        // todo.......
    },

    setRestrictions: function (restrictions) {
        this.set("restrictions", restrictions);

        if (restrictions)
            this.get("restrictions").parentModel = this;
    },

});

// -----------------------------------------------------------
// PartPrintTypes
// -----------------------------------------------------------
MPlaza.PartPrintTypes = Backbone.Collection.extend({
    model: MPlaza.PartPrintType,
    url: function () {
        return Zakeke.config.baseApiUrl + 'partprinttypes';
    },

    getPrintType: function (printTypeID) {
        for (var i = 0; i < this.length; i++) {
            var printType = this.at(i);
            if (printType.get("printTypeID") == printTypeID)
                return printType;
        }
        return null;
    }
});

// -----------------------------------------------------------
// AreaTextConstraints
// -----------------------------------------------------------
MPlaza.AreaTextConstraints = Backbone.AssociatedModel.extend({
    defaults: {
        maxNumItems: -1,
        maxNumChars: -1,
        fitArea: false,
        canMove: true,
        canResize: true,
        canRotate: true,
        fixedDirection: 0
    },

    //idAttribute: "modelID",

    initialize: function () {
    },

    url: function () {
        return "";
    },

    getModelID: function () {
        if (this.parentModel)
            return this.parentModel.getModelID();
        return null;
    },


    getParentModel: function () {
        if (this.parentModel)
            return this.parentModel;
        return null;
    },

    toString: function () {
        // todo.......
    }
});

// -----------------------------------------------------------
// Area
// -----------------------------------------------------------
MPlaza.Area = Backbone.AssociatedModel.extend({

    defaults: {
        guid: "",
        name: "",
        path: "",
        pathSVG: "",
        boundsX: 0,
        boundsY: 0,
        boundsWidth: 0,
        boundsHeight: 0,
        clipOut: true,
        screenPPI: 0,
        textConstraints: null,
        printTypes: [],
    },

    idAttribute: "areaID",

    relations: [
        {
            type: Backbone.One,
            key: 'textConstraints',
            relatedModel: MPlaza.AreaTextConstraints
        },
        {
            type: Backbone.Many,
            key: 'printTypes',
            collectionType: MPlaza.PartPrintTypes
        }
    ],

    initialize: function () {
        if (!this.get("guid")) {
            this.set("guid", MPlaza.generateUUID());
        }
        if (this.get('textConstraints'))
            this.get('textConstraints').parentModel = this;
    },

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'areas';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return null;
    },

    getColorID: function () {
        if (this.collection && this.collection.getColorID) {
            return this.collection.getColorID();
        }
        return null;
    },

    getSideID: function () {
        if (this.collection && this.collection.getSideID) {
            return this.collection.getSideID();
        }
        return null;
    },

    getAreaID: function () {
        return this.get("areaID");
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    getPrintType: function (printTypeID) {
        for (var i = 0; i < this.get("printTypes").length; i++) {
            var printType = this.get("printTypes").at(i);
            if (printType.get("printTypeID") &&
                printType.get("printTypeID") == printTypeID)
                return printType;
        }
        return null;
    },

    getSide: function () {
        return this.getParentModel();
    },

    getColor: function () {
        var side = this.getParentModel();
        if (side && (side instanceof MPlaza.Side)) {
            return side.getParentModel();
        }
        return null;
    },

    getModel: function () {
        var side = this.getParentModel();
        if (side && (side instanceof MPlaza.Side)) {
            var color = side.getParentModel();
            if (color && color instanceof MPlaza.Color) {
                return color.getParentModel();
            }
        }
        return null;
    },
});

// -----------------------------------------------------------
// Areas
// -----------------------------------------------------------
MPlaza.Areas = Backbone.Collection.extend({
    model: MPlaza.Area,

    getArea: function (guid) {
        for (var i = 0; i < this.length; i++) {
            var area = this.at(i);
            if (area.get("guid") == guid)
                return area;
        }
        return null;
    },

    getAreaByID: function (areaID) {
        for (var i = 0; i < this.length; i++) {
            var area = this.at(i);
            if (area.get("areaID") == areaID)
                return area;
        }
        return null;
    },

    getMaxArea: function () {
        var max = 0;
        var maxArea = null;
        for (var i = 0; i < this.length; i++) {
            var area = this.at(i);
            var rect = new paper.Rectangle(area.get("boundsX"), area.get("boundsY"),
                area.get("boundsWidth"), area.get("boundsHeight"));
            var a = rect.area;
            if (max < a) {
                max = a;
                maxArea = area;
            }
        }
        return maxArea;
    },

    url: function () {
        return Zakeke.config.baseApiUrl + 'areas';
    },

    getModelID: function () {
        if (this.parentModel && this.parentModel.getModelID) {
            return this.parentModel.getModelID();
        }
        return null;
    },

    getColorID: function () {
        if (this.parentModel && this.parentModel.getColorID) {
            return this.parentModel.getColorID();
        }
        return null;
    },

    getSideID: function () {
        if (this.parentModel && this.parentModel.getSideID) {
            return this.parentModel.getSideID();
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Side
// -----------------------------------------------------------
MPlaza.Side = Backbone.AssociatedModel.extend({
    defaults: {
        name: "",
        code: "",
        ppcm: 0,
        tempImageFileKey: "",
        imageUrl: "",
        colorable: false,
        isDefault: false,
        printTypes: [],
        areas: [],
    },

    idAttribute: "sideID",

    initialize: function () {
        var side = this;
        this.get("areas").url = function () {
            return side.url() + '/areas';
        }
        this.get('areas').parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'areas',
            collectionType: MPlaza.Areas
        },
        {
            type: Backbone.Many,
            key: 'printTypes',
            collectionType: MPlaza.PartPrintTypes
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'sides';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id != undefined && this.id != null && this.id >= 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return null;
    },

    getColorID: function () {
        if (this.collection && this.collection.getColorID) {
            return this.collection.getColorID();
        }
        return null;
    },

    getSideID: function () {
        return this.get("sideID");
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    findAreaByID: function (areaID) {
        var areas = this.get("areas");
        if (areas) {
            return areas.findWhere({ areaID: areaID });
        }
        return null;
    },

    findAreaByGuid: function (guid) {
        var areas = this.get("areas");
        if (areas) {
            return areas.findWhere({ guid: guid });
        }
        return null;
    },

    getPrintType: function (printTypeID) {
        for (var i = 0; i < this.get("printTypes").length; i++) {
            var printType = this.get("printTypes").at(i);
            if (printType.get("printTypeID") &&
                printType.get("printTypeID") == printTypeID)
                return printType;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },

    getColor: function () {
        return this.getParentModel();
    },

    getModel: function () {
        var color = this.getParentModel();
        if (color && color instanceof MPlaza.Color) {
            return color.getParentModel();
        }
        return null;
    },
});

// -----------------------------------------------------------
// Sides
// -----------------------------------------------------------
MPlaza.Sides = Backbone.Collection.extend({
    model: MPlaza.Side,
    url: function () {
        return Zakeke.config.baseApiUrl + 'sides';
    },

    getModelID: function () {
        if (this.parentModel && this.parentModel.getModelID) {
            return this.parentModel.getModelID();
        }
        return null;
    },

    getColorID: function () {
        if (this.parentModel && this.parentModel.getColorID) {
            return this.parentModel.getColorID();
        }
        return null;
    },

    getSide: function (sideID) {
        for (var i = 0; i < this.length; i++) {
            var side = this.at(i);
            if (side.get("sideID") == sideID)
                return side;
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


// -----------------------------------------------------------
// CompliantColor
// -----------------------------------------------------------
MPlaza.CompliantColor = Backbone.AssociatedModel.extend({

    defaults: {
    },

    idAttribute: "colorCode",

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'compliantColors';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        var modelID;
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return modelID;
    },

    getColorID: function () {
        var colorID;
        if (this.collection && this.collection.getColorID) {
            return this.collection.getColorID();
        }
        return colorID;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    }
});

// -----------------------------------------------------------
// CompliantColors
// -----------------------------------------------------------
MPlaza.CompliantColors = Backbone.Collection.extend({
    model: MPlaza.CompliantColor,

    getCompliantColor: function (code) {
        for (var i = 0; i < this.length; i++) {
            var color = this.at(i);
            if (color.get("colorCode") == code)
                return color;
        }
        return null;
    },

    url: function () {
        return Zakeke.config.baseApiUrl + 'compliantColors';
    },

    getModelID: function () {
        if (this.parentModel && this.parentModel.getModelID())
            return this.parentModel.getModelID();
        return null;
    },

    getColorID: function () {
        if (this.parentModel && this.parentModel.getColorID())
            return this.parentModel.getColorID();
        return null;
    },
});



// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


// -----------------------------------------------------------
// Size
// -----------------------------------------------------------
MPlaza.Size = Backbone.AssociatedModel.extend({

    defaults: {
        name: "",
        genre: ""
    },

    idAttribute: "sizeID",

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'sizes';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        var modelID;
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return modelID;
    },

    getColorID: function () {
        var colorID;
        if (this.collection && this.collection.getColorID) {
            return this.collection.getColorID();
        }
        return colorID;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },
});

// -----------------------------------------------------------
// Sizes
// -----------------------------------------------------------
MPlaza.Sizes = Backbone.Collection.extend({
    model: MPlaza.Size,

    getSize: function (sizeID) {
        for (var i = 0; i < this.length; i++) {
            var size = this.at(i);
            if (size.get("sizeID") == sizeID)
                return size;
        }
        return null;
    },

    url: function () {
        return Zakeke.config.baseApiUrl + 'sizes';
    },

    getModelID: function () {
        if (this.parentModel && this.parentModel.getModelID) {
            return this.parentModel.getModelID();
        }
        return null;
    },

    getColorID: function () {
        if (this.parentModel && this.parentModel.getColorID) {
            return this.parentModel.getColorID();
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Color
// -----------------------------------------------------------
MPlaza.Color = Backbone.AssociatedModel.extend({
    defaults: {
        name: "",
        colorCode: "",
        colorHexCode: "",
        code: "",
        imageUrl: "",
        showSideImage: false,
        sizes: [],
        compliantColors: [],
        printTypes: [],
        sides: []
    },

    idAttribute: "colorID",

    initialize: function () {
        var color = this;
        this.get("sizes").url = function () {
            return color.url() + '/sizes';
        };
        this.get("compliantColors").url = function () {
            return color.url() + '/compliantColors';
        };
        this.get("sides").url = function () {
            return color.url() + '/sides';
        };

        this.get('sizes').parentModel = this;
        this.get('compliantColors').parentModel = this;
        this.get('sides').parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'sizes',
            collectionType: MPlaza.Sizes
        },
        {
            type: Backbone.Many,
            key: 'compliantColors',
            collectionType: MPlaza.CompliantColors
        },
        {
            type: Backbone.Many,
            key: 'sides',
            collectionType: MPlaza.Sides
        },
        {
            type: Backbone.Many,
            key: 'printTypes',
            collectionType: MPlaza.PartPrintTypes
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'colors';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id != undefined && this.id != null && this.id >= 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return null;
    },

    getColorID: function () {
        return this.get("colorID");
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    findSize: function (sizeID) {
        var sizes = this.get("sizes");
        if (sizes) {
            return sizes.findWhere({ sizeID: sizeID });
        }
        return null;
    },

    findCompliantColor: function (colorCode) {
        var compliantColors = this.get("compliantColors");
        if (compliantColors) {
            return sizes.findWhere({ colorCode: colorCode });
        }
        return null;
    },

    findSide: function (sideID) {
        var sides = this.get("sides");
        if (sides) {
            return sides.findWhere({ sideID: sideID });
        }
        return null;
    },

    getAreaWithGuid: function (guid) {
        var sides = this.get("sides");
        for (var i = 0; i < sides.length; i++) {
            var side = sides.at(i);
            var area = side.getArea(guid);
            if (area)
                return area;
        }
        return null;
    },

    getPrintType: function (printTypeID) {
        for (var i = 0; i < this.get("printTypes").length; i++) {
            var printType = this.get("printTypes").at(i);
            if (printType.get("printTypeID") &&
                printType.get("printTypeID") == printTypeID)
                return printType;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },

    getModel: function () {
        return this.getParentModel();
    },
});

// -----------------------------------------------------------
// Colors
// -----------------------------------------------------------
MPlaza.Colors = Backbone.Collection.extend({
    model: MPlaza.Color,
    url: function () {
        return Zakeke.config.baseApiUrl + 'colors';
    },

    getModelID: function () {
        if (this.parentModel)
            return this.parentModel.getModelID();
        return null;
    },

    getColor: function (colorID) {
        for (var i = 0; i < this.length; i++) {
            var color = this.at(i);
            if (color.get("colorID") == colorID)
                return color;
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// PrintType
// -----------------------------------------------------------
MPlaza.PrintType = Backbone.AssociatedModel.extend({
    defaults: {
        name: "",
        dpi: 0,
        priceDeltaPerc: 0,
        priceDeltaValue: 0,
        price: 0,
        textBasePrice: 0,
        imageBasePrice: 0,
        pricingID: -1,
        patID: MPlaza.PricingApplicationType.Global,
        disableTextColors: false,
        disableSellerImages: false,
        disableUserImages: false,
        useImagesFixedSize: false,
        textColors: null,
        canAddText: true,
        canChangeSvgColors: true,
        canUseImageFilters: true,
        uploadRestrictions: null,
        canIgnoreDPIWarning: true,
        useCustomFonts: false,
        printTypeFonts: [],
        modelPrintTypeFonts: [],
        printTypeDefaultFontFamilyID: null,
        modelPrintTypeDefaultFontFamilyID: null,
        pantoneEnabled: false,
        canPreviewDesignsPDF: false,
    },

    idAttribute: "printTypeID",

    initialize: function () {
        var printType = this;

        this.get("printTypeFonts").url = function () {
            return printType.url() + '/printtypefonts';
        }

        this.get("modelPrintTypeFonts").url = function () {
            return printType.url() + '/modelprinttypefonts';
        }

        this.get('printTypeFonts').parentModel = this;
        this.get('modelPrintTypeFonts').parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'printTypeFonts',
            collectionType: MPlaza.PrintTypeFonts
        },
        {
            type: Backbone.Many,
            key: 'modelPrintTypeFonts',
            collectionType: MPlaza.PrintTypeFonts
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'printTypes';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id != undefined && this.id != null && this.id >= 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return null;
    },

    getPrintTypeID: function () {
        return this.get("printTypeID");
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },


});

// -----------------------------------------------------------
// PrintTypes
// -----------------------------------------------------------
MPlaza.PrintTypes = Backbone.Collection.extend({
    model: MPlaza.PrintType,
    url: function () {
        return Zakeke.config.baseApiUrl + 'printtypes';
    },

    getModelID: function () {
        if (this.parentModel)
            return this.parentModel.getModelID();
        return null;
    },

    getPrintType: function (printTypeID) {
        for (var i = 0; i < this.length; i++) {
            var printType = this.at(i);
            if (printType.get("printTypeID") == printTypeID)
                return printType;
        }
        return null;
    }
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


// -----------------------------------------------------------
// PreviewColor
// -----------------------------------------------------------
MPlaza.PreviewColor = Backbone.AssociatedModel.extend({

    defaults: {
        color: "",
        hasTexture: false,
        textureUrl: "",
        tempTextureFileKey: "",
        isCustomTexture: false,
        refractionMode: null,
	    reflectivity: null,
	    opacity: null,
	    opacityAffectCustomization: null,
    	textureWidth: null,
    	textureHeight: null,
	    itemsPositionX: null,
	    itemsPositionY: null,
	    itemsScaleX: null,
	    itemsScaleY: null
    },

    idAttribute: "colorID",

    initialize: function () {
    },

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'previewcolors';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return null;
    },

    getPreviewModelID: function () {
        if (this.collection && this.collection.getPreviewModelID) {
            return this.collection.getPreviewModelID();
        }
        return null;
    },

    getPartID: function () {
        if (this.collection && this.collection.getPartID) {
            return this.collection.getPartID();
        }
        return null;
    },

    getColorID: function () {
        return this.get("colorID");
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },
});

// -----------------------------------------------------------
// PreviewColors
// -----------------------------------------------------------
MPlaza.PreviewColors = Backbone.Collection.extend({
    model: MPlaza.PreviewColor,

    getPreviewColor: function (colorID) {
        for (var i = 0; i < this.length; i++) {
            var previewColor = this.at(i);
            if (previewColor.get("colorID") == colorID)
                return previewColor;
        }
        return null;
    },

    url: function () {
        return Zakeke.config.baseApiUrl + 'previewcolors';
    },

    getModelID: function () {
        if (this.parentModel && this.parentModel.getModelID) {
            return this.parentModel.getModelID();
        }
        return null;
    },

    getPreviewModelID: function () {
        if (this.parentModel && this.parentModel.getPreviewModelID) {
            return this.parentModel.getPreviewModelID();
        }
        return null;
    },

    getPartID: function () {
        if (this.parentModel && this.parentModel.getPartID) {
            return this.parentModel.getPartID();
        }
        return null;
    }
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// PreviewPart
// -----------------------------------------------------------
MPlaza.PreviewPart = Backbone.AssociatedModel.extend({
    defaults: {
        materialIndex: -1,
        sideID: -1,
        color: "",
        hasTexture: false,
        textureWidth: 0,
        textureHeight: 0,
        textureUrl: "",
        tempTextureFileKey: "",
        reflectivity: 0,
        opacity: 1,
        opacityAffectCustomization: true,
        itemsPositionX: 0,
        itemsPositionY: 0,
        itemsScaleX: 0,
        itemsScaleY: 0,
        refractionMode: false,
        colors: []
    },

    idAttribute: "partID",

    initialize: function () {
        var previewPart = this;
        this.get("colors").url = function () {
            return previewPart.url() + '/previewcolors';
        }
        this.get('colors').parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'colors',
            collectionType: MPlaza.PreviewColors
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'previewparts';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id != undefined && this.id != null && this.id >= 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return null;
    },

    getPreviewModelID: function () {
        if (this.collection && this.collection.getPreviewModelID) {
            return this.collection.getPreviewModelID();
        }
        return null;
    },

    getPartID: function () {
        return this.get("partID");
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    findColor: function (colorID) {
        var previewColors = this.get("colors");
        if (previewColors) {
            return previewColors.findWhere({ colorID: colorID });
        }
        return null;
    },

    toString: function () {
        // todo.......
    }
});

// -----------------------------------------------------------
// PreviewParts
// -----------------------------------------------------------
MPlaza.PreviewParts = Backbone.Collection.extend({
    model: MPlaza.PreviewPart,
    url: function () {
        return Zakeke.config.baseApiUrl + 'previewparts';
    },

    getModelID: function () {
        if (this.parentModel && this.parentModel.getModelID) {
            return this.parentModel.getModelID();
        }
        return null;
    },

    getPreviewModelID: function () {
        if (this.parentModel && this.parentModel.getPreviewModelID) {
            return this.parentModel.getPreviewModelID();
        }
        return null;
    },

    getPreviewPart: function (partID) {
        for (var i = 0; i < this.length; i++) {
            var previewPart = this.at(i);
            if (previewPart.get("partID") == partID)
                return previewPart;
        }
        return null;
    }
});



// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// PreviewModel
// -----------------------------------------------------------
MPlaza.PreviewModel = Backbone.AssociatedModel.extend({
    defaults: {
        backface: false,
        scale: 1,
        tempModel3DFileKey: "",
        model3DUrl: "",
        parts: []
    },

    idAttribute: "modelID",

    initialize: function () {
        var previewModel = this;
        this.get("parts").url = function () {
            return previewModel.url() + '/previewparts';
        }
        this.get('parts').parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'parts',
            collectionType: MPlaza.PreviewParts
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'previewmodels';
        if (this.collection && this.collection.url) {
            urlRoot = this.collection.url();
        }
        if (this.id != undefined && this.id != null && this.id >= 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getModelID: function () {
        if (this.collection && this.collection.getModelID) {
            return this.collection.getModelID();
        }
        return null;
    },

    getPreviewModelID: function () {
        return this.get("modelID");
    },

    getParentModel: function () {
        if (this.parentModel)
            return this.parentModel;
        return null;
    },

    findPart: function (partID) {
        var previewParts = this.get("parts");
        if (previewParts) {
            return previewParts.findWhere({ partID: partID });
        }
        return null;
    },

    toString: function () {
        // todo.......
    }
});



// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Model
// -----------------------------------------------------------
MPlaza.Model = Backbone.AssociatedModel.extend({
    defaults: {
        name: "",
        description: "",
        code: "",
        tempSmallImageFileKey: "",
        smallImageUrl: "",
        tempLargeImageFileKey: "",
        largeImageUrl: "",
        price: 0,
        variantIconCode: "",
        variantTypeName: "",
        pricingModelID: MPlaza.PricingModel.Simple,
        defaultDesignTemplateID: -1,
        loadFirstDesignTemplate: false,
        showTemplateSelection: false,
        printTypes: [],
        colors: [],
        previewModel: null,
        pricings: [],
        composerPricings: [],
        scenes: [],
        attributeGroups: [],
        attributeSteps: [],
        attributes: [],
        attributeSelectionColors: [],
    },

    idAttribute: "modelID",

    initialize: function () {
        var model = this;
        this.get("printTypes").url = function () {
            return model.url() + '/printTypes';
        };
        this.get("colors").url = function () {
            return model.url() + '/colors';
        };

        this.get('printTypes').parentModel = this;
        this.get('colors').parentModel = this;

        if (this.get('previewModel'))
            this.get('previewModel').parentModel = this;

        this.get("scenes").parentModel = this;
        this.get("attributeGroups").parentModel = this;
        this.get("attributeSteps").parentModel = this;
        this.get("attributes").parentModel = this;
        this.get("attributeSelectionColors").parentModel = this;
    },

    relations: [
        {
            type: Backbone.One,
            key: 'previewModel',
            relatedModel: MPlaza.PreviewModel
        },
        {
            type: Backbone.Many,
            key: 'printTypes',
            collectionType: MPlaza.PrintTypes
        },
        {
            type: Backbone.Many,
            key: 'colors',
            collectionType: MPlaza.Colors
        },
        {
            type: Backbone.Many,
            key: 'pricings',
            collectionType: MPlaza.Pricings
        },
        {
            type: Backbone.Many,
            key: 'composerPricings',
            collectionType: MPlaza.ComposerPricings
        },
        {
            type: Backbone.Many,
            key: 'scenes',
            collectionType: MPlaza.ModelScenes
        },
        {
            type: Backbone.Many,
            key: 'attributeGroups',
            collectionType: MPlaza.AttributeGroups
        },
        {
            type: Backbone.Many,
            key: 'attributeSteps',
            collectionType: MPlaza.AttributeSteps
        },
        {
            type: Backbone.Many,
            key: 'attributes',
            collectionType: MPlaza.Attributes
        },
        {
            type: Backbone.Many,
            key: 'attributeSelectionColors',
            collectionType: MPlaza.AttributeSelectionColors
        },
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'models';
        if (this.id != undefined && this.id != null && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }

        return urlRoot;
    },

    getModelID: function () {
        return this.get("modelID");
    },

    toString: function () {
        // todo.......
    },

    getModelPriceDeltaPerc: function (printTypeID) {
        var printTypes = this.get("printTypes");
        if (printTypes) {
            var printType = printTypes.findWhere({ printTypeID: printTypeID });
            if (printType)
                return printType.get("priceDeltaPerc");
        }
        return 0;
    },

    getModelPriceDeltaValue: function (printTypeID) {
        var printTypes = this.get("printTypes");
        if (printTypes) {
            var printType = printTypes.findWhere({ printTypeID: printTypeID });
            if (printType)
                return printType.get("priceDeltaValue");
        }
        return 0;
    },

    getModelPrice: function (printTypeID) {
        var printTypes = this.get("printTypes");
        if (printTypes) {
            var printType = printTypes.findWhere({ printTypeID: printTypeID });
            if (printType)
                return printType.get("price");
        }
        return 0;
    },

    getModelTextBasePrice: function (printTypeID) {
        var printTypes = this.get("printTypes");
        if (printTypes) {
            var printType = printTypes.findWhere({ printTypeID: printTypeID });
            if (printType)
                return printType.get("textBasePrice");
        }
        return 0;
    },

    getModelImageBasePrice: function (printTypeID) {
        var printTypes = this.get("printTypes");
        if (printTypes) {
            var printType = printTypes.findWhere({ printTypeID: printTypeID });
            if (printType)
                return printType.get("imageBasePrice");
        }
        return 0;
    },

    getPrintType: function (printTypeID) {
        var printTypes = this.get("printTypes");
        if (printTypes)
            return printTypes.findWhere({ printTypeID: printTypeID });
        return null;
    },

    getDefaultSceneID: function () {
        for (var i = 0; i < this.get("scenes").length; i++) {
            var scene = this.get("scenes").at(i);
            if (scene.get("isDefault"))
                return scene.get("sceneID");
        }
        return null;
    },

    getAttributesByGroupID: function (groupID) {
        var attributes = [];
        for (var i = 0; i < this.get("attributes").length; i++) {
            var attribute = this.get("attributes").at(i);
            if (attribute.get("groupID") == groupID) {
                attributes.push(attribute);
            }
        }
        return attributes;
    },

    getAttributesWithoutGroup: function () {
        var attributes = [];
        for (var i = 0; i < this.get("attributes").length; i++) {
            var attribute = this.get("attributes").at(i);
            if (attribute.get("groupID") <= 0) {
                attributes.push(attribute);
            }
        }
        return attributes;
    },

    getAttribute: function (attributeID) {
        return this.get("attributes").getAttribute(attributeID);
    },

    getAttributeByGuid: function (attributeGuid) {
        return this.get("attributes").getAttributeByGuid(attributeGuid);
    },

    getOption: function (optionID) {
        for (var i = 0; i < this.get("attributes").length; i++) {
            var attribute = this.get("attributes").at(i);
            var option = attribute.get("options").findWhere({ optionID: optionID });
            if (option)
                return option;
        }
        return null;
    },

    getOptionByGuid: function (optionGuid) {
        for (var i = 0; i < this.get("attributes").length; i++) {
            var attribute = this.get("attributes").at(i);
            var option = attribute.get("options").findWhere({ optionGuid: optionGuid });
            if (option)
                return option;
        }
        return null;
    },

    getComposerPricing: function (pricingID) {
        for (var i = 0; i < this.get("composerPricings").length; i++) {
            var pricing = this.get("composerPricings").at(i);
            if (pricing.get("pricingID") == pricingID)
                return pricing;
        }
        return null;
    },

    getModelSide: function (colorID, sideID) {
        for (var i = 0; i < this.get("colors").length; i++) {
            var color = this.get("colors").at(i);
            if (color.get("colorID") == colorID) {
                for (var j = 0; j < color.get("sides").length; j++) {
                    var side = color.get("sides").at(j);
                    if (side.get("sideID") == sideID)
                        return side;
                }
            }
        }
        return null;
    },

    getAttributeSelectionColor: function (selectionID) {
        return this.get("attributeSelectionColors").getAttributeSelectionColor(selectionID);
    },

    setShowTemplateSelection(show) {
        this.set("showTemplateSelection", show);
    },
});


// -----------------------------------------------------------
// Models
// -----------------------------------------------------------
MPlaza.Models = Backbone.Collection.extend({
    model: MPlaza.Model,
    url: function () {
        return Zakeke.config.baseApiUrl + 'models';
    },

    getModel: function (modelID) {
        for (var i = 0; i < this.length; i++) {
            var model = this.at(i);
            if (model.get("modelID") == modelID)
                return model;
        }
        return null;
    },

});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


// -----------------------------------------------------------
// DesignItemColor
// -----------------------------------------------------------
MPlaza.DesignItemColor = Backbone.AssociatedModel.extend({

    defaults: {
        imageID: -1,
        colorID: -1,
        colorCode: ""
    },

    idAttribute: "key",

    initialize: function () {
    },

    getDesignID: function () {
        if (this.collection && this.collection.getDesignID) {
            return this.collection.getDesignID();
        }
        return null;
    },

    getDesignItemID: function () {
        if (this.collection && this.collection.getDesignItemID) {
            return this.collection.getDesignItemID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },
});

// -----------------------------------------------------------
// DesignItemColors
// -----------------------------------------------------------
MPlaza.DesignItemColors = Backbone.Collection.extend({
    model: MPlaza.DesignItemColor,

    getDesignItemColor: function (imageID, colorID) {
        for (var i = 0; i < this.length; i++) {
            var color = this.at(i);
            if (color.get("imageID") == imageID &&
                color.get("colorID") == colorID)
                return color;
        }
        return null;
    },

    getDesignID: function () {
        if (this.parentModel && this.parentModel.getDesignID) {
            return this.parentModel.getDesignID();
        }
        return null;
    },

    getDesignItemID: function () {
        if (this.parentModel && this.parentModel.getDesignItemID) {
            return this.parentModel.getDesignItemID();
        }
        return null;
    }
});




// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



// -----------------------------------------------------------
// DesignItemArea
// -----------------------------------------------------------
MPlaza.DesignItemArea = Backbone.AssociatedModel.extend({

    defaults: {
        modelID: -1,
        colorID: -1,
        sideID: -1,
        areaID: -1
    },

    idAttribute: "id",

    initialize: function () {
    },

    getDesignID: function () {
        if (this.collection && this.collection.getDesignID) {
            return this.collection.getDesignID();
        }
        return null;
    },

    getDesignItemID: function () {
        if (this.collection && this.collection.getDesignItemID) {
            return this.collection.getDesignItemID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },
});

// -----------------------------------------------------------
// DesignItemAreas
// -----------------------------------------------------------
MPlaza.DesignItemAreas = Backbone.Collection.extend({
    model: MPlaza.DesignItemArea,

    getDesignItemArea: function (modelID, colorID, sideID, areaID) {
        for (var i = 0; i < this.length; i++) {
            var area = this.at(i);
            if (area.get("modelID") == modelID &&
                area.get("colorID") == colorID &&
                area.get("sideID") == sideID &&
                area.get("areaID") == areaID)
                return area;
        }
        return null;
    },

    getDesignID: function () {
        if (this.parentModel && this.parentModel.getDesignID) {
            return this.parentModel.getDesignID();
        }
        return null;
    },

    getDesignItemID: function () {
        if (this.parentModel && this.parentModel.getDesignItemID) {
            return this.parentModel.getDesignItemID();
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// DesignItemConstraints
// -----------------------------------------------------------
MPlaza.DesignItemConstraints = Backbone.AssociatedModel.extend({
    defaults: {
        itemID: -1,
        canMove: true,
        canRotate: true,
        canResize: true,
        canDelete: true,
        canEdit: true,
        keepNrChars: false,
        minNrChars: 0,
        maxNrChars: 0,
        paddingTypeID: MPlaza.PaddingType.Start,
        paddingString: "",
        canChangeFontFamily: true,
        canChangeFontSize: true,
        canChangeFontColor: true,
        canChangeFontWeight: true,
        canChangeFontItalic: true,
        canChangeTextPathMode: true,
        canChangeJustification: true,
        canTransform: true,
        canChangeSvgColors: true,
        isAlwaysOnTop: false,
        isPrintable: true,
        mandatoryToEdit: false,
        canSyncContent: true,
        canSyncAlignment: true,
        canSyncFontFamily: true,
        canSyncFontStyle: true,
        canSyncFontColor: true,
        canSyncCurved: true,
        canSyncTransforms: false
    },

    idAttribute: "itemID",

    initialize: function () {
    },

    url: function () {
        return "";
    },

    getDesignID: function () {
        if (this.parentModel)
            return this.parentModel.getDesignID();
        return null;
    },


    getParentModel: function () {
        if (this.parentModel)
            return this.parentModel;
        return null;
    },

    toString: function () {
        // todo.......
    },

    copyAttributes: function (source) {
        this.set("canMove", source.get("canMove"));
        this.set("canRotate", source.get("canRotate"));
        this.set("canResize", source.get("canResize"));
        this.set("canDelete", source.get("canDelete"));
        this.set("canEdit", source.get("canEdit"));
        this.set("keepNrChars", source.get("keepNrChars"));
        this.set("minNrChars", source.get("minNrChars"));
        this.set("maxNrChars", source.get("maxNrChars"));
        this.set("paddingTypeID", source.get("paddingTypeID"));
        this.set("paddingString", source.get("paddingString"));
        this.set("canChangeFontFamily", source.get("canChangeFontFamily"));
        this.set("canChangeFontSize", source.get("canChangeFontSize"));
        this.set("canChangeFontColor", source.get("canChangeFontColor"));
        this.set("canChangeFontWeight", source.get("canChangeFontWeight"));
        this.set("canChangeTextPathMode", source.get("canChangeTextPathMode"));
        this.set("canChangeJustification", source.get("canChangeJustification"));
        this.set("canTransform", source.get("canTransform"));
        this.set("canChangeSvgColors", source.get("canChangeSvgColors"));
        this.set("isAlwaysOnTop", source.get("isAlwaysOnTop"));
        this.set("isPrintable", source.get("isPrintable"));
        this.set("mandatoryToEdit", source.get("mandatoryToEdit"));
        this.set("canSyncContent", source.get("canSyncContent"));
        this.set("canSyncAlignment", source.get("canSyncAlignment"));
        this.set("canSyncFontFamily", source.get("canSyncFontFamily"));
        this.set("canSyncFontStyle", source.get("canSyncFontStyle"));
        this.set("canSyncFontColor", source.get("canSyncFontColor"));
        this.set("canSyncCurved", source.get("canSyncCurved"));
        this.set("canSyncTransforms", source.get("canSyncTransforms"));
    },
});


// -----------------------------------------------------------
// DesignItem
// -----------------------------------------------------------
MPlaza.DesignItem = Backbone.AssociatedModel.extend({
    defaults: {
        index: 0,
        json: "",
        svg: "",
        imageID: -1,
        imageType: "",
        imageFormat: "",
        imageWidth: 0,
        imageHeight: 0,
        imageDpiX: 0,
        imageDpiY: 0,
        imageFileSize: 0,
        imageCustomerID: -1,
        imageVisitorID: -1,
        imagePrice: 0,
        imageIsMulticolor: false,
        imagePreferredWidth: null,
        imagePreferredHeight: null,
        itemColors: [],
        syncGuid: null,
        isChanged: true,
        areas: [],
        colors: [],
        constraints: null,
    },

    copyAttributes: function (source) {
        this.set("index", source.get("index"));
        this.set("json", source.get("json"));
        this.set("svg", source.get("svg"));
        this.set("imageID", source.get("imageID"));
        this.set("imageType", source.get("imageType"));
        this.set("imageFormat", source.get("imageFormat"));
        this.set("imageWidth", source.get("imageWidth"));
        this.set("imageHeight", source.get("imageHeight"));
        this.set("imageDpiX", source.get("imageDpiX"));
        this.set("imageDpiY", source.get("imageDpiY"));
        this.set("imageFileSize", source.get("imageFileSize"));
        this.set("imageCustomerID", source.get("imageCustomerID"));
        this.set("imageVisitorID", source.get("imageVisitorID"));
        this.set("imagePrice", source.get("imagePrice"));
        this.set("imageIsMulticolor", source.get("imageIsMulticolor"));
        this.set("imagePreferredWidth", source.get("imagePreferredWidth"));
        this.set("imagePreferredHeight", source.get("imagePreferredHeight"));
        this.set("isChanged", source.get("isChanged"));

        this.set("itemColors", []);
        if (source.get("itemColors")) {
            for (var i = 0; i < source.get("itemColors").length; i++) {
                this.get("itemColors").push(source.get("itemColors")[i]);
            }
        }

        this.set("syncGuid", source.get("syncGuid"));

        for (var i = 0; i < source.get("colors").length; i++) {
            var sourceColor = source.get("colors").at(i);
            var color = new MPlaza.DesignItemColor();
            color.set("imageID", sourceColor.get("imageID"));
            color.set("colorID", sourceColor.get("colorID"));
            color.set("colorCode", sourceColor.get("colorCode"));
            this.get("colors").add(color);
        }

        this.unset("constraints");
        if (source.get("constraints")) {
            var sourceConstraints = source.get("constraints");
            var constraints = new MPlaza.DesignItemConstraints();
            constraints.set("itemID", this.get("itemID"));
            constraints.copyAttributes(sourceConstraints);
            this.set("constraints", constraints);
        }
    },

    copyConstraints: function (sourceConstraints) {
        this.unset("constraints");
        if (sourceConstraints) {
            var constraints = new MPlaza.DesignItemConstraints();
            constraints.set("itemID", this.get("itemID"));
            constraints.copyAttributes(sourceConstraints);
            this.set("constraints", constraints);
        }
    },

    idAttribute: "itemGuid",

    initialize: function () {
        this.get('areas').parentModel = this;
        this.get('colors').parentModel = this;
        if (this.get('constraints'))
            this.get('constraints').parentModel = this;
        if (!this.get("itemGuid")) {
            this.set("itemGuid", MPlaza.generateUUID());
        }

        this.set("itemColors", []);
    },


    relations: [
        {
            type: Backbone.Many,
            key: 'areas',
            collectionType: MPlaza.DesignItemAreas
        },
        {
            type: Backbone.Many,
            key: 'colors',
            collectionType: MPlaza.DesignItemColors
        },
        {
            type: Backbone.One,
            key: 'constraints',
            relatedModel: MPlaza.DesignItemConstraints
        },
    ],

    getDesignID: function () {
        if (this.collection && this.collection.getDesignID) {
            return this.collection.getDesignID();
        }
        return null;
    },

    getDesignItemID: function () {
        return this.get("itemID");
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    findArea: function (modelID, colorID, sideID, areaID) {
        var areas = this.get("areas");
        if (areas) {
            return areas.getDesignItemArea(modelID, colorID, sideID, areaID);
        }
        return null;
    },

    findColor: function (imageID, colorID) {
        var colors = this.get("colors");
        if (colors) {
            return colors.getDesignItemColor(imageID, colorID);
        }
        return null;
    },

    toString: function () {
        // todo.......
    },

    isOnSide: function (side) {
        if (!side || !(side instanceof MPlaza.Side))
            return false;

        var areas = this.get("areas");
        for (var i = 0; i < areas.length; i++) {
            var area = areas.at(i);
            if (area.get("modelID") == side.getModelID() &&
                area.get("colorID") == side.getColorID() &&
                area.get("sideID") == side.getSideID())
                return true;
        }
        return false;
    },

    inOnArea: function (area) {
        if (!area && !(area instanceof MPlaza.Area))
            return false;

        return this.findArea(area.getModelID(), area.getColorID(), area.getSideID(), area.getAreaID()) != null;
    },

    updateAreas: function (areas) {
        while (this.get("areas").length > 0)
            this.get("areas").pop();

        for (var i = 0; i < areas.length; i++) {
            this.addArea(areas[i]);
        }
    },

    addArea: function (area) {
        if (area && area instanceof MPlaza.Area) {

            var existingArea = this.findArea(area.getModelID(), area.getColorID(), area.getSideID(), area.getAreaID());
            if (!existingArea) {
                var designItemArea = new MPlaza.DesignItemArea();
                designItemArea.set("modelID", area.getModelID());
                designItemArea.set("colorID", area.getColorID());
                designItemArea.set("sideID", area.getSideID());
                designItemArea.set("areaID", area.getAreaID());

                this.get("areas").add(designItemArea);
            }
        }
    },

    changeColor: function (imageID, colorID, colorCode) {
        if (imageID == this.get("imageID")) {
            var color = this.findColor(imageID, colorID);
            if (!color) {
                color = new MPlaza.DesignItemColor();
                color.set("imageID", imageID);
                color.set("colorID", colorID);

                this.get("colors").add(color);
            }
            color.set("colorCode", colorCode);
        }
    },

    setConstraintsFromSource: function (source) {
        this.unset("constraints");
        var constraints = new MPlaza.DesignItemConstraints();
        constraints.itemID = this.get("itemID");
        constraints.copyAttributes(source);
        this.set("constraints", constraints);
    },

});

// -----------------------------------------------------------
// DesignItems
// -----------------------------------------------------------
MPlaza.DesignItems = Backbone.Collection.extend({
    model: MPlaza.DesignItem,

    getDesignID: function () {
        if (this.parentModel && this.parentModel.getDesignID) {
            return this.parentModel.getDesignID();
        }
        return null;
    },

    getDesignItemByGuid: function (guid) {
        for (var i = 0; i < this.length; i++) {
            var designItem = this.at(i);
            if (designItem.get("itemGuid") == guid)
                return designItem;
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// DesignTemplateCategory
// -----------------------------------------------------------
MPlaza.DesignTemplateCategory = Backbone.AssociatedModel.extend({
    defaults: {
        categoryID: -1,
        name: "",
    },

    initialize: function () {
    },

    relations: [],

    getDesignID: function () {
        if (this.collection && this.collection.getDesignID) {
            return this.collection.getDesignID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// DesignTemplateCategories
// -----------------------------------------------------------
MPlaza.DesignTemplateCategories = Backbone.Collection.extend({
    model: MPlaza.DesignTemplateCategory,

    getDesignID: function () {
        if (this.parentModel && this.parentModel.getDesignID) {
            return this.parentModel.getDesignID();
        }
        return null;
    },

    findCategory: function (categoryID) {
        for (var i = 0; i < this.length; i++) {
            var category = this.at(i);
            if (category.get("categoryID") == categoryID)
                return category;
        }
        return null;
    },
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// DesignArea
// -----------------------------------------------------------
MPlaza.DesignArea = Backbone.AssociatedModel.extend({
    defaults: {
        modelID: -1,
        colorID: -1,
        sideID: -1,
        areaID: -1,
        printTypeID: -1,
    },

    initialize: function () {
    },

    relations: [],

    getDesignID: function () {
        if (this.collection && this.collection.getDesignID) {
            return this.collection.getDesignID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// DesignAreas
// -----------------------------------------------------------
MPlaza.DesignAreas = Backbone.Collection.extend({
    model: MPlaza.DesignArea,

    getDesignID: function () {
        if (this.parentModel && this.parentModel.getDesignID) {
            return this.parentModel.getDesignID();
        }
        return null;
    },

    findArea: function (modelID, colorID, sideID, areaID) {
        for (var i = 0; i < this.length; i++) {
            var area = this.at(i);
            if (area.get("modelID") == modelID &&
                area.get("colorID") == colorID &&
                area.get("sideID") == sideID &&
                area.get("areaID") == areaID)
                return area;
        }
        return null;
    },
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// DesignSidePrintType
// -----------------------------------------------------------
MPlaza.DesignSidePrintType = Backbone.AssociatedModel.extend({
    defaults: {
        modelID: -1,
        colorID: -1,
        sideID: -1,
        printTypeID: -1
    },

    initialize: function () {
    },

    relations: [],

    getDesignID: function () {
        if (this.collection && this.collection.getDesignID) {
            return this.collection.getDesignID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// DesignSide
// -----------------------------------------------------------
MPlaza.DesignSidesPrintTypes = Backbone.Collection.extend({
    model: MPlaza.DesignSidePrintType,

    getDesignID: function () {
        if (this.parentModel && this.parentModel.getDesignID) {
            return this.parentModel.getDesignID();
        }
        return null;
    },

    findSidePrintType: function (modelID, colorID, sideID, printTypeID) {
        for (var i = 0; i < this.length; i++) {
            var sidePrintType = this.at(i);
            if (sidePrintType.get("modelID") == modelID &&
                sidePrintType.get("colorID") == colorID &&
                sidePrintType.get("sideID") == sideID &&
                sidePrintType.get("printTypeID") == printTypeID)
                return sidePrintType;
        }
        return null;
    },
});


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// DesignSide
// -----------------------------------------------------------
MPlaza.DesignSide = Backbone.AssociatedModel.extend({
    defaults: {
        modelID: -1,
        colorID: -1,
        sideID: -1,
        fillColor: "",
        canAddText: true,
        canAddImage: true,
        maxNrTexts: null,
        maxNrImages: null,
        canChangeSvgColors: true,
        uploadRestrictions: null,
        disableSellerImages: false
    },

    initialize: function () {
    },

    relations: [],

    getDesignID: function () {
        if (this.collection && this.collection.getDesignID) {
            return this.collection.getDesignID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// DesignSide
// -----------------------------------------------------------
MPlaza.DesignSides = Backbone.Collection.extend({
    model: MPlaza.DesignSide,

    getDesignID: function () {
        if (this.parentModel && this.parentModel.getDesignID) {
            return this.parentModel.getDesignID();
        }
        return null;
    },

    findSide: function (modelID, colorID, sideID) {
        for (var i = 0; i < this.length; i++) {
            var side = this.at(i);
            if (side.get("modelID") == modelID &&
                side.get("colorID") == colorID &&
                side.get("sideID") == sideID)
                return side;
        }
        return null;
    },
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Design
// -----------------------------------------------------------
MPlaza.Design = Backbone.AssociatedModel.extend({
    defaults: {
        modelID: -1,
        modelName: "",
        pricingModelID: -1,
        modelPriceDeltaPerc: 0,
        modelPriceDeltaValue: 0,
        modelPrice: 0,
        modelTextBasePrice: 0,
        modelImageBasePrice: 0,
        printTypeID: -1,
        description: "",
        info: "",
        isTemplate: false,
        isDraft: false,
        name: "",
        templateDesignID: -1,
        customerID: -1,
        visitorID: -1,
        sells: 0,
        finalPrice: 0,
        tempPreviewImageData: null,
        tempPreviewImageUrl: "",
        canAddText: true,
        canAddImage: true,
        maxNrTexts: null,
        maxNrImages: null,
        filterCode: "",
        canChangeSvgColors: true,
        uploadRestrictions: null,
        disableSellerImages: false,
        hasSyncEnabled: false,
        sides: [],
        sidesPrintTypes: [],
        areas: [],
        designItems: [],
        categories: [],
        tags: []
    },

    // modificare in docID per salvare su NoSQL
    //idAttribute: "designID",
    idAttribute: "docID",

    initialize: function () {
        var model = this;
        this.get("sides").parentModel = this;
        this.get("sidesPrintTypes").parentModel = this;
        this.get("areas").parentModel = this;
        this.get('designItems').parentModel = this;
        this.get("categories").parentModel = this;

        this.on("change", function () {
            model._fireEvent("change");
        });

        this.get("designItems").on("add", function () {
            model._fireEvent("change");
        });

        this.get("designItems").on("remove", function () {
            model._fireEvent("change");
        });

        this.get("designItems").on("change", function () {
            model._fireEvent("change");
        });

        this.get("categories").on("change", function () {
            model._fireEvent("change");
        });
    },

    _eventListeners: {
        change: []
    },

    _fireEvent: function (eventName, e) {
        if (this._eventListeners &&
            _.isObject(this._eventListeners) &&
            _.has(this._eventListeners, eventName) &&
            _.isArray(this._eventListeners[eventName])) {
            var listeners = this._eventListeners[eventName];
            for (var i = 0; i < listeners.length; ++i) {
                listeners[i](e);
            }
        }
    },

    trigger: function (eventName) {
        this._fireEvent(eventName);
    },

    addEventListener: function (eventName, listenerFunction) {
        if (this._eventListeners &&
            _.isObject(this._eventListeners)) {
            if (!_.has(this._eventListeners, eventName)) {
                this._eventListeners[eventName] = [];
            }
            this._eventListeners[eventName].push(listenerFunction);
        }
    },

    isEmpty: function () {
        return this.get("designItems").length == 0;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'sides',
            collectionType: MPlaza.DesignSides
        },
        {
            type: Backbone.Many,
            key: 'sidesPrintTypes',
            collectionType: MPlaza.DesignSidesPrintTypes
        },
        {
            type: Backbone.Many,
            key: 'areas',
            collectionType: MPlaza.DesignAreas
        },
        {
            type: Backbone.Many,
            key: 'designItems',
            collectionType: MPlaza.DesignItems
        },
        {
            type: Backbone.Many,
            key: 'categories',
            collectionType: MPlaza.DesignTemplateCategories
        }
    ],

    url: function () {
        // da modificare per utilizzare NoSQL
        // url: designdocs/<docID>
        //var urlRoot = Zakeke.config.baseApiUrl + 'designs';
        //if (this.id != undefined && this.id != null && this.id > 0) {
        //    urlRoot = urlRoot + "/" + this.id;
        //}
        //var urlRoot = Zakeke.config.baseApiUrl + 'designdocs';

        // Test per la versione unificata
        var urlRoot = Zakeke.config.baseApiUrl + 'proxydesigns';
        if (this.id != undefined && this.id != null) {
            urlRoot = urlRoot + "/" + this.id;
        }

        if (this.attributes.isDraft === true) {
            urlRoot = urlRoot + "/?draft=true";
        }

        return urlRoot;
    },

    getDesignID: function () {
        return this.get("designID");
    },

    toString: function () {
        // todo.......
    },

    getSideDesignItems: function (side) {
        var items = [];
        for (var i = 0; i < this.get("designItems").length; i++) {
            var designItem = this.get("designItems").at(i);
            if (designItem.isOnSide(side))
                items.push(designItem);
        }

        items.sort(function (a, b) {
            return a.get("index") - b.get("index");
        });

        return items;
    },

    getAreaDesignItems: function (area) {
        var items = [];

        if (area && (area instanceof MPlaza.Area)) {
            for (var i = 0; i < this.get("designItems").length; i++) {
                var designItem = this.get("designItems").at(i);
                if (designItem.inOnArea(area))
                    items.push(designItem);
            }
        }

        items.sort(function (a, b) {
            return a.get("index") - b.get("index");
        });

        return items;
    },

    setModel: function (model) {
        if (!model || !(model instanceof MPlaza.Model))
            return;

        this.set("modelID", model.get("modelID"));
        this.set("modelName", model.get("name"));

        this.set("pricingModelID", model.get("pricingModelID"));

        var printTypeID = this.get("printTypeID");

        this.set("modelPriceDeltaPerc", model.getModelPriceDeltaPerc(printTypeID));
        this.set("modelPriceDeltaValue", model.getModelPriceDeltaValue(printTypeID));
        this.set("modelPrice", model.getModelPrice(printTypeID));
        this.set("modelTextBasePrice", model.getModelTextBasePrice(printTypeID));
        this.set("modelImageBasePrice", model.getModelImageBasePrice(printTypeID));
    },

    setPrintType: function (printType) {
        if (!printType || !(printType instanceof MPlaza.PrintType))
            return;

        this.set("printTypeID", printType.get("printTypeID"));

        this.set("modelPriceDeltaPerc", printType.get("priceDeltaPerc"));
        this.set("modelPriceDeltaValue", printType.get("priceDeltaValue"));
        this.set("modelPrice", printType.get("price"));
        this.set("modelTextBasePrice", printType.get("textBasePrice"));
        this.set("modelImageBasePrice", printType.get("imageBasePrice"));
    },

    cloneWithDifferentModel: function (model) {
        var design = new MPlaza.Design();

        if (!model || !(model instanceof MPlaza.Model))
            return design;

        if (model.get("modelID") == this.get("modelID"))
            return this.clone();

        if (model.get("colors").length == 0)
            return design;

        design.setModel(model);
        //design.set("modelID", model.get("modelID"));

        // Print Type
        var printType = model.get("printTypes").getPrintType(this.get("printTypeID"));
        if (!printType && model.get("printTypes").length > 0)
            printType = model.get("printTypes").at(0);
        if (printType)
            design.set("printTypeID", printType.get("printTypeID"));
        else
            design.set("printTypeID", -1);

        // Assegno gli elmenti grafici al primo colore disponibile
        var modelColor = model.get("colors").at(0);
        if (modelColor) {

            // Design Items
            for (var i = 0; i < this.get("designItems").length; i++) {
                var sourceDesignItem = this.get("designItems").at(i);

                var designItem = new MPlaza.DesignItem();
                designItem.copyAttributes(sourceDesignItem);

                // Reassign areas
                for (var j = 0; j < sourceDesignItem.get("areas").length; j++) {
                    var sourceDesignItemArea = sourceDesignItem.get("areas").at(j);

                    var modelSide = modelColor.get("sides").getSide(sourceDesignItemArea.get("sideID"));
                    if (modelSide) {
                        var modelArea = modelSide.get("areas").getAreaByID(sourceDesignItemArea.get("areaID"));
                        if (modelArea) {
                            designItem.addArea(modelArea);
                        }
                    }
                }

                if (designItem.get("areas").length > 0)
                    design.get("designItems").add(designItem);
            }
        }

        // categorie
        for (var k = 0; k < this.get("categories").length; k++) {
            var sourceCategory = this.get("categories").at(k);

            var category = new MPlaza.DesignTemplateCategory();
            category.set("categoryID", sourceCategory.get("categoryID"));
            category.set("name", sourceCategory.get("name"));
            designs.get("categories").add(category);
        }

        return design;
    },
    
    changeColor: function (color) {
        if (!color)
            return;

        // Modifico il colore dei lati corrispondenti ed elimino
        // i lati non presenti nella versione del nuovo colore
        var sidesToRemove = [];
        var sidesPrintTypesToRemove = [];

        for (var k = 0; k < this.get("sides").length; k++) {
            var designSide = this.get("sides").at(k);

            var found = false;
            var sideFound = null;

            if (designSide.get("modelID") == color.getModelID()) {
                var side = color.get("sides").getSide(designSide.get("sideID"));
                if (side) {
                    found = true;
                    sideFound = side;
                }
            }

            var designSidePrintType = this.get("sidesPrintTypes").find(print =>
                print.get("modelID") == designSide.get("modelID") &&
                print.get("sideID") == designSide.get("sideID") &&
                print.get("colorID") == designSide.get("colorID"));

            if (found) {
                designSide.set("colorID", color.get("colorID"));

                if (designSidePrintType) {
                    designSidePrintType.set("colorID", color.get("colorID"));
                }
                else {
                    var newPrintTypeID = -1;

                    if (sideFound.get("printTypes").length > 0)
                        newPrintTypeID = sideFound.get("printTypes").at(0);
                    else
                        newPrintTypeID = color.getParentModel().get("printTypes").at(0);

                    var newSidePrint = new MPlaza.DesignSidePrintType();
                    newSidePrint.set("modelID", designSide.get("modelID"));
                    newSidePrint.set("colorID", designSide.get("colorID"));
                    newSidePrint.set("sideID", designSide.get("sideID"));
                    newSidePrint.set("printTypeID", newPrintTypeID);

                    this.get("sidesPrintTypes").add(newSidePrint);
                }
            } else {
                sidesToRemove.push(designSide);

                if (designSidePrintType)
                    sidesPrintTypesToRemove.push(designSidePrintType);
            }
        }
        
        if (sidesToRemove.length > 0)
            this.get("sides").remove(sidesToRemove);

        if (sidesPrintTypesToRemove.length > 0)
            this.get("sidesPrintTypes").remove(sidesPrintTypesToRemove);

        // Assegno i designItem alle aree corrispondenti nel nuovo colore
        var designItemsToRemove = [];
        for (var i = 0; i < this.get("designItems").length; i++) {
            var designItem = this.get("designItems").at(i);

            // Modifico il colore delle aree corrispondenti ed elimino
            // le aree non presenti nella versione del nuovo colore
            var areasToRemove = [];
            for (var j = 0; j < designItem.get("areas").length; j++) {
                var designItemArea = designItem.get("areas").at(j);

                var found = false;
                if (designItemArea.get("modelID") == color.getModelID()) {
                    var side = color.get("sides").getSide(designItemArea.get("sideID"));
                    if (side) {
                        var area = side.get("areas").getAreaByID(designItemArea.get("areaID"));
                        if (area) {
                            found = true;
                        }
                    }
                }

                if (found) {
                    designItemArea.set("colorID", color.get("colorID"));
                } else {
                    areasToRemove.push(designItemArea);
                }
            }
            if (areasToRemove.length > 0)
                designItem.get("areas").remove(areasToRemove);

            if (designItem.get("areas").length == 0)
                designItemsToRemove.push(designItem);
        }

        if (designItemsToRemove.length > 0)
            this.get("designItems").remove(designItemsToRemove);
        
        // Force trigger the change event
        this._fireEvent("change");
    },

    addSide: function (side) {
        if (side && side instanceof MPlaza.Side) {

            var existingSide = this.get("sides").findSide(side.getModelID(), side.getColorID(), side.getSideID());
            if (!existingSide) {
                var designSide = new MPlaza.DesignSide();
                designSide.set("modelID", area.getModelID());
                designSide.set("colorID", area.getColorID());
                designSide.set("sideID", area.getSideID());

                this.get("sides").add(designSide);
            }
        }
    },

    addSidePrintType: function (side, sidePrintType) {
        if (side && sidePrintType && side instanceof MPlaza.Side && sidePrintType instanceof MPlaza.PartPrintType) {

            var existingSidePrintType = this.get("sidesPrintTypes").findSidePrintType(side.getModelID(), side.getColorID(), side.getSideID(), sidePrintType.getPrintTypeID());
            if (!existingSidePrintType) {
                var designSidePrintType = new MPlaza.DesignSidePrintType();
                designSidePrintType.set("modelID", side.getModelID());
                designSidePrintType.set("colorID", side.getColorID());
                designSidePrintType.set("sideID", side.getSideID());
                designSidePrintType.set("printTypeID", sidePrintType.getPrintTypeID());

                this.get("sidesPrintTypes").add(designSidePrintType);
            }
        }
    },

    addArea: function (area) {
        if (area && side instanceof MPlaza.Area) {

            var existingArea = this.get("areas").findArea(area.getModelID(), area.getColorID(), area.getSideID(), area.getAreaID());
            if (!existingArea) {
                var designArea = new MPlaza.DesignArea();
                designArea.set("modelID", area.getModelID());
                designArea.set("colorID", area.getColorID());
                designArea.set("sideID", area.getSideID());
                designArea.set("areaID", area.getAreaID());

                this.get("areas").add(designArea);
            }
        }
    },

    getDesignSide: function (side) {
        if (side && side instanceof MPlaza.Side) {
            return this.get("sides").findSide(side.getModelID(), side.getColorID(), side.getSideID());
        }
    },

    getDesignSidePrintType: function (side, sidePrintType) {
        if (side && sidePrintType && side instanceof MPlaza.Side && sidePrintType instanceof MPlaza.PartPrintType) {
            return this.get("sidesPrintTypes").findSide(side.getModelID(), side.getColorID(), side.getSideID(), sidePrintType.getPrintTypeID());
        }
    },

    getDesignArea: function (area) {
        if (area && area instanceof MPlaza.Area) {
            return this.get("areas").findArea(area.getModelID(), area.getColorID(), area.getSideID(), area.getAreaID());
        }
    },

    getSelectedPrintTypeForArea: function (area) {
        var designArea = this.getDesignArea(area);

        if (designArea) {
            var designSidePrintType = this.get("sidesPrintTypes").find(print =>
                print.get("modelID") == designArea.get("modelID") &&
                print.get("colorID") == designArea.get("colorID") &&
                print.get("sideID") == designArea.get("sideID"));

            if (designSidePrintType)
                return designSidePrintType.get("printTypeID");
        }

        if (designArea && designArea.get("printTypeID") && designArea.get("printTypeID") > 0)
            return designArea.get("printTypeID");
        return this.get("printTypeID");
    },

    getImageDesignItems: function (imageID) {
        var items = [];
        for (var i = 0; i < this.get("designItems").length; i++) {
            var designItem = this.get("designItems").at(i);
            if (designItem.get("imageID") == imageID)
                items.push(designItem);
        }
        return items;
    },

    getDesignPrice: function () {
        var price = 0;
        var customerID = this.get("customerID");
        var visitorID = this.get("visitorID");
        for (var i = 0; i < this.get("designItems").length; i++) {
            var designItem = this.get("designItems").at(i);

            if (designItem.get("imageID") > 0) {
                price += this.get("modelImageBasePrice");
                if (customerID > 0) {
                    if (customerID != designItem.get("imageCustomerID"))
                        price += designItem.get("imagePrice");
                } else if (visitorID > 0) {
                    if (visitorID != designItem.get("imageVisitorID"))
                        price += designItem.get("imagePrice");
                } else {
                    price += designItem.get("imagePrice");
                }
            } else {
                price += this.get("modelTextBasePrice");
            }
        }

        return price;
    },

    getPrice: function () {
        var price = this.get("modelFinalPrice");

        return Math.round(price * 100) / 100
    },

    getDesignPriceEx: function (model, quantity) {

        counter = {};

        if (model && (model instanceof MPlaza.Model) && quantity > 0) {
            for (var i = 0; i < model.get("colors").length; i++) {
                var color = model.get("colors").at(i);
                for (var j = 0; j < color.get("sides").length; j++) {
                    var side = color.get("sides").at(j);

                    for (var k = 0; k < side.get("areas").length; k++) {
                        var area = side.get("areas").at(k);
                        var designItems = this.getAreaDesignItems(area).filter(function (item) {
                            let constraints = item.get("constraints");

                            if (!constraints)
                                return true;

                            return constraints.get("isPrintable") == true;
                        });

                        if (designItems.length > 0) {

                            this.addAreaPrice(area, designItems, quantity, counter);
                        }
                    }
                }
            }
        }

        // Il prezzo finale è dato dalla somma di tutti i valori in counterS
        var sum = 0;
        for (var key in counter) {
            if (counter.hasOwnProperty(key)) {
                var value = counter[key];
                if (!isNaN(value)) {
                    sum += value;
                }
            }
        }
        var price = Math.round(sum * 100) / 100;
        return price;
    },

    // Aggiunge a counter il prezzo dovuto per l'area
    addAreaPrice: function (area, items, quantity, counter) {

        //var printTypeID = this.get("printTypeID"); // In futuro il tipo di stampa sarà assegnabile alla singola area
        var printTypeID = this.getSelectedPrintTypeForArea(area); // Quel futuro è arrivato
        var pricingRef = this.getAreaPricingRef(area, printTypeID);
        if (pricingRef.pricingID <= 0)
            return;

        var pricingApplicationType = pricingRef.pricingApplicationType;
        var model = area.getModel();

        if (model && (model instanceof MPlaza.Model) && model.get("pricings")) {
            var pricing = model.get("pricings").getPricing(pricingRef.pricingID);

            if (pricing && pricing instanceof MPlaza.Pricing) {

                var areaColorsCount = 0;
                if (pricing.get("setupPriceTypeID") == MPlaza.PricingType.PerColor ||
                    pricing.get("designPriceTypeID") == MPlaza.PricingType.PerColor) {
                    areaColorsCount = this.getAreaColorsCount(area, items);
                }

                // Prezzo di setup
                var setupPrice = 0;
                var setupPriceInfo = pricing.getSetupPriceForQuantity(quantity);
                if (setupPriceInfo) {
                    if (pricing.get("setupPriceTypeID") == MPlaza.PricingType.PerColor) {
                        // Il prezzo del setup va calcolato in base al numero di colori del design
                        if (areaColorsCount > 0) {
                            var remainder = areaColorsCount;
                            if (setupPriceInfo.get("firstColorPrice")) {
                                setupPrice += setupPriceInfo.get("firstColorPrice");
                                remainder--;
                            }
                            setupPrice += remainder * setupPriceInfo.get("price");
                        }
                    }
                    else if (pricing.get("setupPriceTypeID") == MPlaza.PricingType.Global) {
                        setupPrice += setupPriceInfo.get("price");
                    }
                }

                // Prezzo di design
                var designPrice = 0;
                var designPriceInfo = pricing.getDesignPriceForQuantity(quantity);
                if (designPriceInfo) {
                    if (pricing.get("designPriceTypeID") == MPlaza.PricingType.PerColor) {
                        // Il prezzo del design va calcolato in base al numero di colori del design
                        if (areaColorsCount > 0) {
                            var remainder = areaColorsCount;
                            if (designPriceInfo.get("firstColorPrice")) {
                                designPrice += designPriceInfo.get("firstColorPrice") * quantity;
                                remainder--;
                            }
                            designPrice += remainder * designPriceInfo.get("price") * quantity;
                        }
                    }
                    else if (pricing.get("designPriceTypeID") == MPlaza.PricingType.Global) {
                        designPrice += designPriceInfo.get("price") * quantity;
                    }
                }


                // Ora il prezzo (setup + design) va assegnato
                var counterKey = null;
                switch (pricingApplicationType) {
                    case MPlaza.PricingApplicationType.Global:
                        counterKey = this.getModelCounterKey(area.getModel(), printTypeID);
                        break;
                    case MPlaza.PricingApplicationType.PerSide:
                        counterKey = this.getSideCounterKey(area.getSide(), printTypeID);
                        break;
                    case MPlaza.PricingApplicationType.PerArea:
                        counterKey = this.getAreaCounterKey(area, printTypeID);
                        break;
                }

                if (counterKey != null)
                    counter[counterKey] = setupPrice + designPrice;

                // Aggiungo l'eventuale prezzo per le immagini a pagamento utilizzate
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.get("imageID") > 0 && item.get("imagePrice") > 0) {

                        // TODO aggiungere la verifica del customerCode/visitorCode per l'immagine
                        var key = this.getImageCounterKey(item.get("imageID"));
                        var imagePrice = item.get("imagePrice") * quantity;
                        counter[key] = imagePrice + (counter[key] || 0);
                    }
                }
            }
        }
    },

    // Per l'area e il tipo di stampa in input determina il pricing con il tipo di applicazione
    getAreaPricingRef: function (area, printTypeID) {
        var pricingID = -1;
        var pat = MPlaza.PricingApplicationType.Undefined;

        var areaPrintType = area.getPrintType(printTypeID);
        if (areaPrintType && areaPrintType.get("pricingID") > 0) {
            pricingID = areaPrintType.get("pricingID");
            pat = areaPrintType.get("patID");
        } else {
            var side = area.getParentModel();
            var sidePrintType = side.getPrintType(printTypeID);
            if (sidePrintType && sidePrintType.get("pricingID") > 0) {
                pricingID = sidePrintType.get("pricingID");
                pat = sidePrintType.get("patID");
            } else {
                var color = side.getParentModel();
                var colorPrintType = color.getPrintType(printTypeID);
                if (colorPrintType && colorPrintType.get("pricingID") > 0) {
                    pricingID = colorPrintType.get("pricingID");
                    pat = colorPrintType.get("patID");
                } else {
                    var model = color.getParentModel();
                    var modelPrintType = model.getPrintType(printTypeID);
                    if (modelPrintType && modelPrintType.get("pricingID") > 0) {
                        pricingID = modelPrintType.get("pricingID");
                        pat = modelPrintType.get("patID");
                    }
                }
            }
        }

        return { pricingID: pricingID, pricingApplicationType: pat };
    },

    getAreaColorsCount: function (area, items) {
        var counts = {};
        for (var i = 0; i < items.length; i++) {
            var colors = items[i].get("itemColors");

            for (var j = 0; j < colors.length; j++) {
                counts[colors[j]] = 1 + (counts[colors[j]] || 0);
            }
        }
        return Object.keys(counts).length;
    },

    getModelCounterKey: function (model, printTypeID) {
        return printTypeID + "_" + model.get("modelID");
    },

    getColorCounterKey: function (color, printTypeID) {
        return printTypeID + "_" + color.getModelID() + "_" + color.get("colorID");
    },

    getSideCounterKey: function (side, printTypeID) {
        return printTypeID + "_" + side.getModelID() + "_" + side.getColorID() + "_" + side.get("sideID");
    },

    getAreaCounterKey: function (area, printTypeID) {
        return printTypeID + "_" + area.getModelID() + "_" + area.getColorID() + "_" + area.getSideID() + "_" + area.get("areaID");
    },

    getImageCounterKey: function (imageID) {
        return "img_" + imageID;
    },

    countTextItemsForColor: function (modelID, colorID) {

        var hash = {}; // serve per contare un elemento una sola volta

        var count = 0;
        for (var i = 0; i < this.get("designItems").length; i++) {
            var designItem = this.get("designItems").at(i);

            if (designItem.get("imageID") <= 0) {

                // Elemento di testo
                for (var j = 0; j < designItem.get("areas").length; j++) {
                    var designItemArea = designItem.get("areas").at(j);
                    if (designItemArea.get("modelID") == modelID &&
                        designItemArea.get("colorID") == colorID) {
                        if (!hash.hasOwnProperty(designItem.get("itemGuid"))) {
                            count++;
                            hash[designItem.get("itemGuid")] = true;
                        }
                    }
                }
            }
        }
        return count;
    },

    countTextItemsForSide: function (modelID, colorID, sideID) {
        var hash = {}; // serve per contare un elemento una sola volta
        var count = 0;
        for (var i = 0; i < this.get("designItems").length; i++) {
            var designItem = this.get("designItems").at(i);

            if (designItem.get("imageID") <= 0) {

                // Elemento di testo
                for (var j = 0; j < designItem.get("areas").length; j++) {
                    var designItemArea = designItem.get("areas").at(j);
                    if (designItemArea.get("modelID") == modelID &&
                        designItemArea.get("colorID") == colorID &&
                        designItemArea.get("sideID") == sideID) {
                        if (!hash.hasOwnProperty(designItem.get("itemGuid"))) {
                            count++;
                            hash[designItem.get("itemGuid")] = true;
                        }
                    }
                }
            }
        }
        return count;
    },

    countImageItemsForColor: function (modelID, colorID) {
        var hash = {};
        var count = 0;
        for (var i = 0; i < this.get("designItems").length; i++) {
            var designItem = this.get("designItems").at(i);

            if (designItem.get("imageID") > 0) {

                // Immagine
                for (var j = 0; j < designItem.get("areas").length; j++) {
                    var designItemArea = designItem.get("areas").at(j);
                    if (designItemArea.get("modelID") == modelID &&
                        designItemArea.get("colorID") == colorID) {
                        if (!hash.hasOwnProperty(designItem.get("itemGuid"))) {
                            count++;
                            hash[designItem.get("itemGuid")] = true;
                        }
                    }
                }
            }
        }
        return count;
    },

    countImageItemsForSide: function (modelID, colorID, sideID) {
        var hash = {};
        var count = 0;
        for (var i = 0; i < this.get("designItems").length; i++) {
            var designItem = this.get("designItems").at(i);

            if (designItem.get("imageID") > 0) {

                // Immagine
                for (var j = 0; j < designItem.get("areas").length; j++) {
                    var designItemArea = designItem.get("areas").at(j);
                    if (designItemArea.get("modelID") == modelID &&
                        designItemArea.get("colorID") == colorID &&
                        designItemArea.get("sideID") == sideID) {
                        if (!hash.hasOwnProperty(designItem.get("itemGuid"))) {
                            count++;
                            hash[designItem.get("itemGuid")] = true;
                        }
                    }
                }
            }
        }
        return count;
    },
});

// -----------------------------------------------------------
// Designs
// -----------------------------------------------------------
MPlaza.Designs = Backbone.Collection.extend({
    model: MPlaza.Design,
    url: function () {
        return Zakeke.config.baseApiUrl + 'designs';
    },

    getDesign: function (designID) {
        for (var i = 0; i < this.length; i++) {
            var design = this.at(i);
            if (design.get("designID") == designID)
                return design;
        }
        return null;
    }
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// ImageColor
// -----------------------------------------------------------
MPlaza.ImageColor = Backbone.AssociatedModel.extend({
    defaults: {
        colorID: -1,
        code: ""
    },

    initialize: function () {
    },

    relations: [],

    getImageID: function () {
        if (this.collection && this.collection.getImageID) {
            return this.collection.getImageID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// ImageColors
// -----------------------------------------------------------
MPlaza.ImageColors = Backbone.Collection.extend({
    model: MPlaza.ImageColor,

    getImageID: function () {
        if (this.parentModel && this.parentModel.getImageID) {
            return this.parentModel.getImageID();
        }
        return null;
    },

    findColor: function (colorID) {
        for (var i = 0; i < this.length; i++) {
            var imageColor = this.at(i);
            if (imageColor.get("colorID") == colorID)
                return imageColor;
        }
        return null;
    },

    setupUrlForImageID: function (imageID) {
        this.url = function () {
            return Zakeke.config.baseApiUrl + 'images/' + imageID + "/colors";
        }
    },
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// ImageAssignedCategory
// -----------------------------------------------------------
MPlaza.ImageAssignedCategory = Backbone.AssociatedModel.extend({
    defaults: {
        categoryID: -1,
        name: ""
    },

    initialize: function () {
    },

    relations: [],

    getImageID: function () {
        if (this.collection && this.collection.getImageID) {
            return this.collection.getImageID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// ImageAssignedCategories
// -----------------------------------------------------------
MPlaza.ImageAssignedCategories = Backbone.Collection.extend({
    model: MPlaza.ImageAssignedCategory,

    getImageID: function () {
        if (this.parentModel && this.parentModel.getImageID) {
            return this.parentModel.getImageID();
        }
        return null;
    },

    findCategory: function (categoryID) {
        for (var i = 0; i < this.length; i++) {
            var category = this.at(i);
            if (category.get("categoryID") == categoryID)
                return category;
        }
        return null;
    },

    setupUrlForImageID: function (imageID) {
        this.url = function () {
            return Zakeke.config.baseApiUrl + 'images/' + imageID + "/categories";
        }
    },
});


// -----------------------------------------------------------
// Image
// -----------------------------------------------------------
MPlaza.Image = Backbone.AssociatedModel.extend({
    defaults: {
        imageID: -1,
        name: "",
        type: "",
        format: "",
        width: 0,
        height: 0,
        dpiX: 0,
        dpiY: 0,
        isMulticolor: false,
        isFilterApplied: false,
        imageFileSize: 0,
        sellerID: -1,
        visitorID: -1,
        customerID: -1,
        price: 0,
        url: "",
        previewUrl: "",
        choiceUrl: "",
        preferredWidth: null,
        preferredHeight: null,
        colors: [],
        categories: [],
        selectionColors: "",
        sourceUrlImage: ""
    },

    idAttribute: "imageID",

    initialize: function () {
        var image = this;
        this.get("colors").parentModel = this;
        this.get('colors').url = function () {
            return image.url() + '/' + image.id + '/imagecolors';
        }

        this.get("categories").parentModel = this;
        this.get('categories').url = function () {
            return image.url() + '/' + image.id + '/categories';
        }
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'colors',
            collectionType: MPlaza.ImageColors
        },
        {
            type: Backbone.Many,
            key: 'categories',
            collectionType: MPlaza.ImageAssignedCategories
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'images';
        if (this.id != undefined && this.id != null && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getImageID: function () {
        return this.get("imageID");
    },

    toString: function () {
        // todo.......
    },

});

// -----------------------------------------------------------
// Images
// -----------------------------------------------------------
MPlaza.Images = Backbone.Collection.extend({
    model: MPlaza.Image,

    url: function () {
        return Zakeke.config.baseApiUrl + 'images';
    },

    getImage: function (imageID) {
        for (var i = 0; i < this.length; i++) {
            var image = this.at(i);
            if (image.get("imageID") == imageID)
                return image;
        }
        return null;
    },

});

// -----------------------------------------------------------
// Image Marco Category
// -----------------------------------------------------------

MPlaza.ImageCategory = Backbone.AssociatedModel.extend({
    defaults: {
        categoryID: -1,
        name: "",
        imagesCount: 0
    },

    idAttribute: "categoryID",

    url: function () {
        return null;
    }
});

// -----------------------------------------------------------
// Images Categories
// -----------------------------------------------------------

MPlaza.ImageCategories = Backbone.Collection.extend({
    model: MPlaza.ImageCategory,

    url: function () {
        return null;
    },

    comparator: function (model) {
        return model.get("name");
    }

});

// -----------------------------------------------------------
// Image Marco Category
// -----------------------------------------------------------
MPlaza.ImageMacroCategory = Backbone.AssociatedModel.extend({
    defaults: {
        macroCategoryID: -1,
        name: "",
        imagesCount: 0,
        categories: []
    },

    idAttribute: "macroCategoryID",

    initialize: function () {
        this.get("categories").parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'categories',
            collectionType: MPlaza.ImageCategories
        }
    ],


    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'imagesMacroCategories';
        if (this.id != undefined && this.id != null && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    }
});

// -----------------------------------------------------------
// Images Macro Categories
// -----------------------------------------------------------
MPlaza.ImageMacroCategories = Backbone.Collection.extend({
    model: MPlaza.ImageMacroCategory,

    url: function () {
        return Zakeke.config.baseApiUrl + 'imageMacroCategories';
    },

    comparator: function (model) {
        return model.get("name");
    }

});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// ColorChange
// -----------------------------------------------------------
MPlaza.ColorChange = Backbone.AssociatedModel.extend({
    defaults: {
        colorID: -1,
        code: ""
    },

    initialize: function () {
    },

    relations: [],

    getImageID: function () {
        if (this.collection && this.collection.getImageID) {
            return this.collection.getImageID();
        }
        return null;
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// ColorChanges
// -----------------------------------------------------------
MPlaza.ColorChanges = Backbone.Collection.extend({
    model: MPlaza.ColorChange,

    getImageID: function () {
        if (this.parentModel && this.parentModel.getImageID) {
            return this.parentModel.getImageID();
        }
        return null;
    },

    findColor: function (colorID) {
        for (var i = 0; i < this.length; i++) {
            var change = this.at(i);
            if (change.get("colorID") == colorID)
                return change;
        }
        return null;
    },
});

// -----------------------------------------------------------
// RecoloredImage
// -----------------------------------------------------------
MPlaza.RecoloredImage = Backbone.AssociatedModel.extend({
    defaults: {
        imageID: -1,
        colorChanges: [],
        versionKey: "",
        imageData: null
    },

    idAttribute: "imageID",

    initialize: function () {
        this.get("colorChanges").parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'colorChanges',
            collectionType: MPlaza.ColorChanges
        }
    ],

    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'recoloredimages';
        if (this.id != undefined && this.id != null && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getImageID: function () {
        return this.get("imageID");
    },

    toString: function () {
        // todo.......
    },

});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Drawing Item
// -----------------------------------------------------------
MPlaza.DrawingItem = Backbone.Model.extend({
    defaults: {
        guid: null,
        info: ""
    },

    initialize: function () {
        this.set("guid", MPlaza.generateUUID());
    },
});

// -----------------------------------------------------------
// Drawing Items
// -----------------------------------------------------------
MPlaza.DrawingItems = Backbone.Collection.extend({
    model: MPlaza.DrawingItem,

    getDrawingItem: function (guid) {
        for (var i = 0; i < this.length; i++) {
            var item = this.at(i);
            if (item.get("guid") == guid)
                return item;
        }
        return null;
    }
});




// ------------------------------------------------------------
// Compositions 
// ------------------------------------------------------------


// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// CompositionItem
// -----------------------------------------------------------
MPlaza.CompositionItem = Backbone.AssociatedModel.extend({
    defaults: {
        attributeID: -1,
        attributeGuid: "",
        attributeTypeID: MPlaza.AttributeType.Options,
        attributeCode: "",
        attributeName: "",
        selectedOptionID: null,
        selectedOptionGuid: null,
        selectedOptionCode: "",
        selectedOptionName: null,
        selectedValue: null,
    },

    copyAttributes: function (source) {
        this.set("attributeID", source.get("attributeID"));
        this.set("attributeGuid", source.get("attributeGuid"));
        this.set("attributeTypeID", source.get("attributeTypeID"));
        this.set("attributeCode", source.get("attributeCode"));
        this.set("attributeName", source.get("attributeName"));
        this.set("selectedOptionID", source.get("selectedOptionID"));
        this.set("selectedOptionGuid", source.get("selectedOptionGuid"));
        this.set("selectedOptionCode", source.get("selectedOptionCode"));
        this.set("selectedOptionName", source.get("selectedOptionName"));
        this.set("selectedValue", source.get("selectedValue"));
    },

    idAttribute: "itemGuid",

    initialize: function () {
        if (!this.get("itemGuid")) {
            this.set("itemGuid", MPlaza.generateUUID());
        }
    },

    getCompositionID: function () {
        if (this.collection && this.collection.getCompositionID) {
            return this.collection.getCompositionID();
        }
        return null;
    },

    getCompositionItemID: function () {
        return this.get("itemID");
    },

    getParentModel: function () {
        if (this.collection && this.collection.parentModel) {
            return this.collection.parentModel;
        }
        return null;
    },

    toString: function () {
        // todo.......
    },
});

// -----------------------------------------------------------
// CompositionItems
// -----------------------------------------------------------
MPlaza.CompositionItems = Backbone.Collection.extend({
    model: MPlaza.CompositionItem,

    getCompositionID: function () {
        if (this.parentModel && this.parentModel.getCompositionID) {
            return this.parentModel.getCompositionID();
        }
        return null;
    },

    getCompositionItem: function (itemID) {
        for (var i = 0; i < this.length; i++) {
            var item = this.at(i);
            if (item.get("itemID") == itemID)
                return item;
        }
        return null;
    },

    getCompositionItemByAttributeID: function (attributeID) {
        for (var i = 0; i < this.length; i++) {
            var item = this.at(i);
            if (item.get("attributeID") == attributeID)
                return item;
        }
        return null;
    },

    getCompositionItemByAttributeGuid: function (attributeGuid) {
        for (var i = 0; i < this.length; i++) {
            var item = this.at(i);
            if (item.get("attributeGuid") == attributeGuid)
                return item;
        }
        return null;
    },
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Composition
// -----------------------------------------------------------
MPlaza.Composition = Backbone.AssociatedModel.extend({
    defaults: {
        name: "",
        modelID: -1,
        modelName: "",
        modelPrice: 0,
        customerID: -1,
        visitorID: -1,
        finalPrice: 0,
        previewImageData: null,
        previewImageUrl: "",
        compositionItems: [],
    },

    // modificare in docID per salvare su NoSQL
    //idAttribute: "designID",
    idAttribute: "docID",

    initialize: function () {
        var model = this;
        this.get('compositionItems').parentModel = this;

        this.on("change", function () {
            model._fireEvent("change");
        });

        this.get("compositionItems").on("add", function () {
            model._fireEvent("change");
        });

        this.get("compositionItems").on("remove", function () {
            model._fireEvent("change");
        });

        this.get("compositionItems").on("change", function () {
            model._fireEvent("change");
        });
    },

    _eventListeners: {
        change: []
    },

    _fireEvent: function (eventName, e) {
        if (this._eventListeners &&
            _.isObject(this._eventListeners) &&
            _.has(this._eventListeners, eventName) &&
            _.isArray(this._eventListeners[eventName])) {
            var listeners = this._eventListeners[eventName];
            for (var i = 0; i < listeners.length; ++i) {
                listeners[i](e);
            }
        }
    },

    trigger: function (eventName) {
        this._fireEvent(eventName);
    },

    addEventListener: function (eventName, listenerFunction) {
        if (this._eventListeners &&
            _.isObject(this._eventListeners)) {
            if (!_.has(this._eventListeners, eventName)) {
                this._eventListeners[eventName] = [];
            }
            this._eventListeners[eventName].push(listenerFunction);
        }
    },

    isEmpty: function () {
        return this.get("compositionItems").length == 0;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'compositionItems',
            collectionType: MPlaza.CompositionItems
        },
    ],

    url: function () {
        // da modificare per utilizzare NoSQL
        // url: designdocs/<docID>
        //var urlRoot = Zakeke.config.baseApiUrl + 'designs';
        //if (this.id != undefined && this.id != null && this.id > 0) {
        //    urlRoot = urlRoot + "/" + this.id;
        //}
        var urlRoot = Zakeke.config.baseApiUrl + 'compositiondocs';
        if (this.id != undefined && this.id != null) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    },

    getCompositionID: function () {
        return this.get("compositionID");
    },

    toString: function () {
        // todo.......
    },

    setModel: function (model) {
        if (!model || !(model instanceof MPlaza.Model))
            return;

        this.set("modelID", model.get("modelID"));
        this.set("modelName", model.get("name"));
        this.set("modelPrice", model.getModelPrice(printTypeID));
    },

    getCompositionItemByAttributeID: function (attributeID) {
        return this.get("compositionItems").getCompositionItemByAttributeID(attributeID);
    },

    getCompositionItemByAttributeGuid: function (attributeGuid) {
        return this.get("compositionItems").getCompositionItemByAttributeGuid(attributeGuid);
    },

    getPrice: function (model, quantity) {

        var price = model.get("price");

        for (var i = 0; i < this.get("compositionItems").length; i++) {
            var item = this.get("compositionItems").at(i);
            var attribute = model.getAttribute(item.get("attributeID"));
            var attributePricing = this.getAttributePricing(item, model);
            if (attributePricing) {
                if (attributePricing.get("pricingID") != undefined && attributePricing.get("pricingID") > 0) {
                    // Pricing avanzato
                    var pricing = model.getComposerPricing(attributePricing.get("pricingID"));
                    if (pricing) {
                        var composerPrice = pricing.getComposerPricingPriceForQuantity(quantity);
                        if (composerPrice) {
                            price += composerPrice.get("price");
                        }
                    }
                } else {
                    // Pricing semplice
                    price += attributePricing.get("price");
                }
            }
        }

        return price * quantity;
    },

    getAttributePricing: function (compositionItem, model) {
        var attributePricing = null;

        var attribute = model.getAttribute(compositionItem.get("attributeID"));

        // Verifico prima se ci sono pricing legati alla specifica opzione
        if (compositionItem.get("attributeTypeID") == MPlaza.AttributeType.Options && compositionItem.get("selectedOptionID")) {
            // Attributo di tipo elenco opzioni
            for (var i = 0; i < attribute.get("pricings").length; i++) {
                var pricing = attribute.get("pricings").at(i);
                if (pricing.get("selectedOptionID") == compositionItem.get("selectedOptionID")) {
                    var attributeExpression = pricing.get("constraintExpression");
                    if (!attributeExpression || this.evaluateAttributeExpression(attributeExpression)) {
                        attributePricing = pricing;
                        break;
                    }
                }
            }

        } else if (compositionItem.get("selectedValue")) {
            // Attributo a valore aperto
            for (var i = 0; i < attribute.get("pricings").length; i++) {
                var pricing = attribute.get("pricings").at(i);
                if (pricing.get("selectedValue") == compositionItem.get("selectedValue")) {
                    var attributeExpression = pricing.get("constraintExpression");
                    if (!attributeExpression || this.evaluateAttributeExpression(attributeExpression)) {
                        attributePricing = pricing;
                        break;
                    }
                }
            }
        }

        // Se non c'è un pricing specifico per opzione/valore cerco verifico se
        // c'è un pricing generico per l'attributo
        if (!attributePricing) {
            // Attributo di tipo elenco opzioni
            for (var i = 0; i < attribute.get("pricings").length; i++) {
                var pricing = attribute.get("pricings").at(i);

                if (!pricing.get("selectedOptionID") && !pricing.get("selectedValue")) {
                    attributePricing = pricing;
                    break;
                }
            }

        }

        return attributePricing;
    },

    // Per la valutazione delle espressioni, sono necessarie due funzioni, una per l'espressione
    // principale e una per le espressione figlie. Questo perché l'espressione principale è un
    // modello Backbone JS e quelle secondarie risultano come semplici oggetti javascript.

    // Il codice andrebbe unificato con quello presente in ComposerSelection

    // Valuta l'espressione principale (modello backbone js)
    evaluateAttributeExpression: function (expression) {
        if (!expression || !(expression instanceof MPlaza.AttributeExpression))
            return false;

        var op = expression.get("op");

        var result = (op == MPlaza.LogicalOperator.AND) ? true : false;

        for (var i = 0; i < expression.get("propositions").length; i++) {
            var proposition = expression.get("propositions")[i];
            var partial = this.evaluateAttributeProposition(proposition);
            if (op == MPlaza.LogicalOperator.AND) {
                result = result && partial;
                if (!result)
                    return false;
            }
            else {
                result = result || partial;
                if (result)
                    return true;
            }
        }

        for (var i = 0; i < expression.get("expressions").length; i++) {
            var childExpression = expression.get("expressions")[i];
            var partial = this.evaluateChildAttributeExpression(childExpression);
            if (op == MPlaza.LogicalOperator.AND) {
                result = result && partial;
                if (!result)
                    return false;
            }
            else {
                result = result || partial;
                if (result)
                    return true;
            }
        }

        return result;
    },

    // Valuta un'espressione figlia (oggetto plain javascript object)
    evaluateChildAttributeExpression: function (expression) {

        var op = expression.op;

        var result = (op == MPlaza.LogicalOperator.AND) ? true : false;

        for (var i = 0; i < expression.propositions.length; i++) {
            var proposition = expression.propositions[i];
            var partial = this.evaluateAttributeProposition(proposition);
            if (op == MPlaza.LogicalOperator.AND) {
                result = result && partial;
                if (!result)
                    return false;
            }
            else {
                result = result || partial;
                if (result)
                    return true;
            }
        }

        for (var i = 0; i < expression.expressions.length; i++) {
            var childExpression = expression.expressions[i];
            var partial = this.evaluateChildAttributeExpression(childExpression);
            if (op == MPlaza.LogicalOperator.AND) {
                result = result && partial;
                if (!result)
                    return false;
            }
            else {
                result = result || partial;
                if (result)
                    return true;
            }
        }

        return result;
    },

    // Valuta una singola proposizione (semplice oggetto javascript)
    evaluateAttributeProposition: function (proposition) {
        if (proposition && proposition.hasOwnProperty("attributeGuid") && proposition.hasOwnProperty("op") && proposition.hasOwnProperty("value")) {
            var guid = proposition.attributeGuid;
            var compositionItem = this.getCompositionItemByAttributeGuid(guid);
            // se l'attributo non è stato selezionato la preposizione deve essere falsa
            if (compositionItem) {
                var selectedValue = compositionItem.get("selectedValue");
                if (compositionItem.get("attributeTypeID") == MPlaza.AttributeType.Options) {
                    // Nel caso di attributi con opzioni, deve essere considerato il guid dell'opzione selezionata
                    selectedValue = compositionItem.get("selectedOptionGuid");
                }
                var result = false;
                if (proposition.op == MPlaza.ComparisonOperator.Equal)
                    result = selectedValue == proposition.value;
                else if (proposition.op == MPlaza.ComparisonOperator.NotEqual)
                    result = selectedValue != proposition.value;
                else if (proposition.op == MPlaza.ComparisonOperator.In || proposition.op == MPlaza.ComparisonOperator.NotIn) {
                    var parts = proposition.value.split(';');
                    if (proposition.op == MPlaza.ComparisonOperator.In)
                        result = Zakeke.arrayContains(parts, selectedValue);
                    else
                        result = !Zakeke.arrayContains(parts, selectedValue);
                }
                return result;
            }
        }
        return false;
    },
});

// -----------------------------------------------------------
// Compositions
// -----------------------------------------------------------
MPlaza.Compositions = Backbone.Collection.extend({
    model: MPlaza.Composition,
    url: function () {
        return Zakeke.config.baseApiUrl + 'compositiondocs';
    },

    getComposition: function (compositionID) {
        for (var i = 0; i < this.length; i++) {
            var composition = this.at(i);
            if (composition.get("compositionID") == compositionID)
                return composition;
        }
        return null;
    },

    getCompositionByDocID: function (docID) {
        for (var i = 0; i < this.length; i++) {
            var composition = this.at(i);
            if (composition.get("docID") == docID)
                return composition;
        }
        return null;
    },
});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// -----------------------------------------------------------
// Template Category
// -----------------------------------------------------------

MPlaza.TemplateCategory = Backbone.AssociatedModel.extend({
    defaults: {
        id: -1,
        name: "",
        isDummy: false,
        displayOrder: 0
    },

    url: function () {
        return null;
    }
});

// -----------------------------------------------------------
// Template Categories
// -----------------------------------------------------------

MPlaza.TemplateCategories = Backbone.Collection.extend({
    model: MPlaza.TemplateCategory,

    url: function () {
        return null;
    }

});

// -----------------------------------------------------------
// Template Macro Category
// -----------------------------------------------------------
MPlaza.TemplateMacroCategory = Backbone.AssociatedModel.extend({

    defaults: {
        id: -1,
        name: "",
        isDummy: false,
        displayOrder: 0,
        categories: []
    },

    initialize: function () {
        this.get("categories").parentModel = this;
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'categories',
            collectionType: MPlaza.TemplateCategories
        }
    ],


    url: function () {
        var urlRoot = Zakeke.config.baseApiUrl + 'designs/templatemacrocategories';
        if (this.id != undefined && this.id != null && this.id > 0) {
            urlRoot = urlRoot + "/" + this.id;
        }
        return urlRoot;
    }
});

// -----------------------------------------------------------
// Template Macro Categories
// -----------------------------------------------------------
MPlaza.TemplateMacroCategories = Backbone.Collection.extend({
    model: MPlaza.TemplateMacroCategory,

    url: function () {
        return Zakeke.config.baseApiUrl + 'designs/templatemacrocategories';
    }

});

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
