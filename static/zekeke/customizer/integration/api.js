var Zakeke;
(function (Zakeke) {
    var Customizer;
    (function (Customizer) {
        var Integration;
        (function (Integration) {
            var MerchantIntegrationApi = /** @class */ (function () {
                function MerchantIntegrationApi() {
                    this.notifyDesignChange = function (design, model, color, quantity) {
                        var modelPrice = model.getModelPriceDeltaValue(design.get('printTypeID')) || 0;
                        var percentPrice = model.getModelPriceDeltaPerc(design.get('printTypeID')) || 0;
                        var designObj = null;
                        if (model.get("pricingModelID") == MPlaza.PricingModel.Advanced) {
                            designObj = {
                                price: design.getDesignPriceEx(model, quantity),
                                percentPrice: 0
                            };
                        }
                        else {
                            designObj = {
                                price: (modelPrice + design.getDesignPrice()) * quantity,
                                percentPrice: percentPrice
                            };
                        }
                        if (color != null) {
                            designObj.color = color.get('code');
                        }
                        if (window === window.parent) {
                            return;
                        }
                        var message = {
                            zakekeMessageType: MerchantIntegrationApi.MessageType.DesignChange,
                            design: designObj
                        };
                        window.parent.postMessage(message, '*');
                        clearInterval(this.waitForDesignChange);
                        this.waitForDesignChange = setInterval(function () {
                            window.parent.postMessage(message, '*');
                        }, 200);
                    };
                    this.addToCart = function (designId, modelId, colorId) {
                        if (window === window.parent) {
                            return;
                        }
                        window.parent.postMessage({
                            zakekeMessageType: MerchantIntegrationApi.MessageType.AddToCart,
                            designId: designId,
                            modelId: modelId,
                            colorId: colorId
                        }, '*');
                    };
                    this.saveDesign = function (designId) {
                        if (window === window.parent) {
                            return;
                        }
                        window.parent.postMessage({
                            zakekeMessageType: MerchantIntegrationApi.MessageType.SaveDesign,
                            designId: designId
                        }, '*');
                    };
                    this.waitForDesignChange = null;
                    window.addEventListener('message', (function (event) {
                        if (event.data.zakekeMessageType === MerchantIntegrationApi.MessageType.DesignChange) {
                            clearInterval(this.waitForDesignChange);
                            this.onDesignChangeCallback(event.data.data);
                        }
                    }).bind(this));
                }
                MerchantIntegrationApi.prototype.onDesignChange = function (callback) {
                    this.onDesignChangeCallback = callback;
                };
                ;
                MerchantIntegrationApi.MessageType = {
                    AddToCart: 'AddToCart',
                    DesignChange: 'DesignChange',
                    SaveDesign: 'SaveDesign'
                };
                return MerchantIntegrationApi;
            }());
            Integration.MerchantIntegrationApi = MerchantIntegrationApi;
        })(Integration = Customizer.Integration || (Customizer.Integration = {}));
    })(Customizer = Zakeke.Customizer || (Zakeke.Customizer = {}));
})(Zakeke || (Zakeke = {}));
