var Zakeke;
(function (Zakeke) {
    var Customizer;
    (function (Customizer) {
        var Integration;
        (function (Integration) {
            var MessageType = {
                AddToCart: "AddToCart",
                AddToCartContext: "AddToCartContext",
                DesignChange: "DesignChange"
            };
            var MerchantIntegrationShopify = /** @class */ (function () {
                function MerchantIntegrationShopify() {
                    var _this = this;
                    this.saveDesign = function (designId) {
                        if (window === window.parent) {
                            return;
                        }
                        window.parent.postMessage({
                            zakekeMessageType: Integration.MerchantIntegrationApi.MessageType.SaveDesign,
                            designId: designId
                        }, '*');
                    };
                    window.addEventListener('message', function (event) {
                        if (event.data.zakekeMessageType === MessageType.DesignChange) {
                            _this.onDesignChangeCallback(event.data.data);
                        }
                    });
                }
                MerchantIntegrationShopify.prototype.addToCart = function (designID, modelID, colorID, quantity) {
                    if (window === window.parent) {
                        return;
                    }
                    window.addEventListener('message', function (event) {
                        if (event.data.zakekeMessageType === MessageType.AddToCartContext) {
                            fetch(Zakeke.config.baseApiUrl + 'shopify/designs', {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'X-Auth-Token': Customizer.Context.token
                                },
                                method: 'POST',
                                mode: 'cors',
                                body: JSON.stringify({
                                    docID: designID,
                                    productID: event.data.data.productID,
                                    variantID: event.data.data.variantID,
                                    qty: quantity || 1
                                })
                            })
                                .then(function (res) { return res.json(); })
                                .then(function (variant) {
                                return window.parent.postMessage({
                                    zakekeMessageType: MessageType.AddToCart,
                                    data: {
                                        designID: designID,
                                        variantID: variant,
                                        quantity: Customizer.Context.quantity
                                    }
                                }, '*');
                            });
                        }
                    });
                    window.parent.postMessage({
                        zakekeMessageType: MessageType.AddToCartContext,
                        data: {
                            colorID: colorID,
                            designID: designID,
                            quantity: Customizer.Context.quantity
                        }
                    }, '*');
                };
                ;
                MerchantIntegrationShopify.prototype.notifyDesignChange = function (design, model, color, quantity) {
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
                            price: (design.getDesignPrice() + model.getModelPriceDeltaValue(design.get('printTypeID')) || 0) * quantity,
                            percentPrice: model.getModelPriceDeltaPerc(design.get('printTypeID')) || 0
                        };
                    }
                    if (color != null) {
                        designObj.color = color.get('code');
                    }
                    window.parent.postMessage({
                        zakekeMessageType: MessageType.DesignChange,
                        design: designObj
                    }, '*');
                };
                ;
                MerchantIntegrationShopify.prototype.onDesignChange = function (callback) {
                    this.onDesignChangeCallback = callback;
                };
                ;
                return MerchantIntegrationShopify;
            }());
            Integration.MerchantIntegrationShopify = MerchantIntegrationShopify;
        })(Integration = Customizer.Integration || (Customizer.Integration = {}));
    })(Customizer = Zakeke.Customizer || (Zakeke.Customizer = {}));
})(Zakeke || (Zakeke = {}));
