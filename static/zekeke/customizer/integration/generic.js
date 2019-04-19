var Zakeke;
(function (Zakeke) {
    var Customizer;
    (function (Customizer) {
        var Integration;
        (function (Integration) {
            var MessageType;
            (function (MessageType) {
                MessageType[MessageType["AddToCart"] = 0] = "AddToCart";
                MessageType[MessageType["DesignChange"] = 1] = "DesignChange";
            })(MessageType || (MessageType = {}));
            var MerchantIntegrationGeneric = /** @class */ (function () {
                function MerchantIntegrationGeneric() {
                    this.saveDesign = function (designId) {
                        if (window === window.parent) {
                            return;
                        }
                        window.parent.postMessage({
                            zakekeMessageType: Integration.MerchantIntegrationApi.MessageType.SaveDesign,
                            designId: designId
                        }, '*');
                    };
                    this.waitForDesignChange = null;
                    window.addEventListener('message', (function (event) {
                        if (event.data.zakekeMessageType === MessageType.DesignChange) {
                            clearInterval(this.waitForDesignChange);
                            this.onDesignChangeCallback(event.data.data);
                        }
                    }).bind(this));
                }
                MerchantIntegrationGeneric.prototype.addToCart = function (designId, modelId, colorId) {
                    if (window === window.parent) {
                        return;
                    }
                    window.parent.postMessage({
                        zakekeMessageType: MessageType.AddToCart,
                        designId: designId,
                        modelId: modelId,
                        colorId: colorId
                    }, '*');
                };
                MerchantIntegrationGeneric.prototype.notifyDesignChange = function (design, model, color, quantity) {
                    var modelPrice = model.getModelPriceDeltaValue(design.get('printTypeID')) || 0;
                    var percentPrice = model.getModelPriceDeltaPerc(design.get('printTypeID')) || 0;
                    var designObj = null;
                    if (window === window.parent) {
                        return;
                    }
                    if (model.get("pricingModelID") == MPlaza.PricingModel.Advanced) {
                        designObj = {
                            price: design.getDesignPriceEx(model, quantity),
                            percentPrice: 0
                        };
                    }
                    else {
                        designObj = {
                            price: (design.getDesignPrice() + modelPrice) * quantity,
                            percentPrice: percentPrice
                        };
                    }
                    if (color != null) {
                        designObj.color = color.get('code');
                    }
                    var message = {
                        zakekeMessageType: MessageType.DesignChange,
                        design: designObj
                    };
                    window.parent.postMessage({
                        zakekeMessageType: MessageType.DesignChange,
                        design: designObj
                    }, '*');
                    clearInterval(this.waitForDesignChange);
                    this.waitForDesignChange = setInterval(function () {
                        window.parent.postMessage(message, '*');
                    }, 200);
                };
                ;
                MerchantIntegrationGeneric.prototype.onDesignChange = function (callback) {
                    this.onDesignChangeCallback = callback;
                };
                ;
                return MerchantIntegrationGeneric;
            }());
            Integration.MerchantIntegrationGeneric = MerchantIntegrationGeneric;
        })(Integration = Customizer.Integration || (Customizer.Integration = {}));
    })(Customizer = Zakeke.Customizer || (Zakeke.Customizer = {}));
})(Zakeke || (Zakeke = {}));
