var Zakeke;
(function (Zakeke) {
    var Customizer;
    (function (Customizer) {
        var Integration;
        (function (Integration) {
            function integrationFor(platform) {
                return new Promise(function (resolve, reject) {
                    switch (platform) {
                        case "shopify":
                            resolve(new Integration.MerchantIntegrationShopify());
                            break;
                        case "api":
                            resolve(new Integration.MerchantIntegrationApi());
                            break;
                        default:
                            resolve(new Integration.MerchantIntegrationGeneric());
                    }
                });
            }
            Integration.integrationFor = integrationFor;
        })(Integration = Customizer.Integration || (Customizer.Integration = {}));
    })(Customizer = Zakeke.Customizer || (Zakeke.Customizer = {}));
})(Zakeke || (Zakeke = {}));
