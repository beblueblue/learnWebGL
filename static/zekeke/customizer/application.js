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
    var Customizer;
    (function (Customizer) {
        var Application = /** @class */ (function () {
            function Application() {
                var _this = this;
                this.defaultDesignConstraints = new MPlaza.DesignItemConstraints();
                // Current model settings
                this.model = null;
                this.design = null;
                this.color = null;
                this.previousColor = null;
                this.side = null;
                this.isMobile = false;
                this.isInstagramInappBrowser = false;
                this.isImageFilterAvailable = true;
                // Other
                this.printTypeChosen = false;
                this.imagesCache = [];
                this.userID = -1;
                this.preventElementConstraintsApply = false;
                this.uploadImageSizeLimit = -1;
                this.designSizeLimit = -1;
                this.hasPrintTypesPerSide = false;
                this.hasSyncedItemsAvailable = false;
                this.hasAdaptiveZoomEnabled = false;
                this.preventAdaptiveZoom = false;
                this.socialImagesLoading = false;
                this.preview3dEnabled = false;
                this.fonts = [];
                this.isLoadingFont = false;
                this.textEditFontLoadCallback = null;
                this.preventTextFormUpdate = false;
                this.preventPrintTypeChecksWarning = false;
                this.preventItemUpdate = false;
                this.firstTimeLoad = true;
                this.photoEditorLanguageFileBase = null;
                this.photoEditorLanguageFile = null;
                this.isPreview3dExpanded = false;
                this.update3dPreview = function () { };
                this.customizerBackgroundColor = "#ffffff";
                this.isSandbox = false;
                this.forceAdminSave = false;
                this.fontIntervalUpdate = null;
                this.previousSelectedItems = [];
                this.styleRestrictions = {};
                this.pantoneColors = [];
                this.syncItemSides = [];
                this.mandatoryItems = [];
                //Template Duplicate
                //---------------------------------------------------------------------------------------------------
                this.templateDuplication = {
                    productsListRoot: $("#duplicate-products-list"),
                    productsList: $("#duplicate-products-list").find("ul"),
                    productsListContainer: $("#duplicate-products-list").parent(),
                    loadingProductsDiv: $(" #duplicate-loading-products"),
                    currentPage: 1,
                    pageSize: 5,
                    isFinalPage: false,
                    isLoading: false,
                    noProductsConfiguredCache: false,
                    isClosed: true
                };
                //---------------------------------------------------------------------------------------------------
                this.defaultTextColorsList = [
                    "#000000", "#2c3e50", "#34495e", "#ac8c8d", "#95a5a6", "#ffffff", "#c0382b", "#e74b3b", "#e67e22",
                    "#f39b11", "#f1c30f", "#f9e79c", "#8e44ad", "#9b59b6", "#287fb9", "#3599dd", "#28ae60", "#31cc6f"
                ];
                this.areasSizeCountCollection = [];
                // Share buttons
                this.shareButtons = {
                    facebook: new Customizer.FacebookShareButton(),
                    pinterest: new Customizer.PinterestShareButton(),
                    twitter: new Customizer.TwitterShareButton(),
                    whatsapp: new Customizer.WhatsappShareButton(),
                    email: new Customizer.EmailShareButton(),
                    native: new Customizer.NativeShareButton()
                };
                this.startFontUpdateInterval = function () {
                    if (_this.fontIntervalUpdate)
                        clearInterval(_this.fontIntervalUpdate);
                    var times = 0;
                    _this.fontIntervalUpdate = setInterval(function () {
                        _this.customizer.paper.project.view._needsUpdate = true;
                        _this.customizer.paper.project.view.update();
                        _this.customizer.updateSelectionState();
                        times++;
                        if (times > 10)
                            clearInterval(_this.fontIntervalUpdate);
                    }, 1000);
                };
                // Get mandatory design items that has not been changed (for templates)
                this.getNoChangedMandatoryItems = function () {
                    var designItemsNoChanged = [];
                    var that = _this;
                    designItemsNoChanged = _this.design.get("designItems").models.filter(function (x) {
                        return x.get('isChanged') === false &&
                            x.get("constraints") &&
                            x.get("constraints").get("mandatoryToEdit") === true;
                    }).map(function (d, i) {
                        var designItemSideID = d.get('areas').at(0).get('sideID');
                        var sides = that.side.collection.models.filter(function (x) { return x.id === designItemSideID; });
                        return {
                            side: sides ? sides[0] : null,
                            designItem: d
                        };
                    });
                    return designItemsNoChanged;
                };
            }
            Application.prototype.getSelectedPrintType = function () {
                var printType = null;
                //Since print types per areas are not yet supported, just take the first area (the print type of that area's side side will be taken)
                if (this.side && this.side.get("areas").length > 0) {
                    var area = this.side.get("areas").at(0);
                    printType = this.customizer.getSelectedPrintType(area);
                }
                var printTypeId = this.design ? this.design.get("printTypeID") : -1;
                if (!printType && printTypeId > 0)
                    printType = this.model.get("printTypes").get(printTypeId);
                return printType || this.model.get("printTypes").at(0);
            };
            ;
            Application.prototype.getPrintTypeProperty = function (printType, property) {
                if (!property || property === "")
                    return null;
                if (printType instanceof MPlaza.PartPrintType) {
                    var restrictions = printType.get("restrictions");
                    var propValue = null;
                    if (restrictions)
                        propValue = restrictions.get(property);
                    if (propValue == null)
                        return this.model.get("printTypes").get(printType.id).get(property);
                    else
                        return propValue;
                }
                else {
                    return printType.get(property);
                }
            };
            ;
            Object.defineProperty(Application.prototype, "printTypeAllowColors", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var modelPrintType = this.model.get("printTypes").get(printType.id);
                    var disableTextColors = this.getPrintTypeProperty(printType, "disableTextColors");
                    var textColors = this.getPrintTypeProperty(printType, "textColors");
                    var pantoneEnabled = this.getPrintTypeProperty(modelPrintType, "pantoneEnabled");
                    var textColorsList = disableTextColors ? textColors : this.defaultTextColorsList.map(function (x, i) {
                        return {
                            colorCode: x,
                            isDefault: i == 14
                        };
                    });
                    // If Pantone has been enabled, set as default text color the first of pantone color list
                    if (!disableTextColors && (pantoneEnabled && this.pantoneColors)) {
                        textColorsList = this.pantoneColors.map(function (x, i) {
                            return {
                                colorCode: x.rgbhexcode,
                                isDefault: i == 0
                            };
                        });
                    }
                    return textColorsList.length > 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowUserImage", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    return restrictions.isUserImageAllowed != null ? restrictions.isUserImageAllowed : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowJpg", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    return restrictions.isJpgAllowed != null ? restrictions.isJpgAllowed : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowPng", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    return restrictions.isPngAllowed != null ? restrictions.isPngAllowed : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowSvg", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    return restrictions.isSvgAllowed != null ? restrictions.isSvgAllowed : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowPdf", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    return restrictions.isPdfAllowed != null ? restrictions.isPdfAllowed : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowPdfWithRaster", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    return restrictions.isPdfWithRasterAllowed != null ? restrictions.isPdfWithRasterAllowed : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowEps", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    return restrictions.isEpsAllowed != null ? restrictions.isEpsAllowed : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowFacebook", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    //This is to check if Firefox has blocked the Facebook script for tracking protection
                    if (typeof (FB) !== 'undefined')
                        return restrictions.isFacebookAllowed != null ? restrictions.isFacebookAllowed : true;
                    else
                        return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowInstagram", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    var restrictions = this.getPrintTypeProperty(printType, "uploadRestrictions") || {};
                    return restrictions.isInstagramAllowed != null ? restrictions.isInstagramAllowed : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowSvgColorsChanging", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    return this.getPrintTypeProperty(printType, "canChangeSvgColors");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowImageFilters", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    return this.getPrintTypeProperty(printType, "canUseImageFilters");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowIgnoreDPIWarning", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    return this.getPrintTypeProperty(printType, "canIgnoreDPIWarning");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowUploadImages", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    return !this.getPrintTypeProperty(printType, "disableUserImages");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowSellerImages", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    return !this.getPrintTypeProperty(printType, "disableSellerImages");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "designAllowSellerImages", {
                get: function () {
                    if (Context.isTemplateEditor || !this.design)
                        return true;
                    var designSide = this.side ? this.design.getDesignSide(this.side) : null;
                    if (!designSide)
                        return !this.design.get("disableSellerImages");
                    return !designSide.get("disableSellerImages");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowText", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    return this.getPrintTypeProperty(printType, "canAddText");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "printTypeAllowPreviewPDF", {
                get: function () {
                    if (Context.isTemplateEditor || !this.side)
                        return true;
                    var printType = this.getSelectedPrintType();
                    if (!printType)
                        this.layoutManager.showError(T._("Error", "Customizer"), T._("Print type not found. The product has been edited.", "Customizer"));
                    return this.getPrintTypeProperty(printType, "canPreviewDesignsPDF");
                },
                enumerable: true,
                configurable: true
            });
            /**/
            Application.prototype.init = function (mobile) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var userAgent, href, domain, url, _a, ex_1, _b, info, url, a, aReferrer, _c, siteHost, ecommerceHost, welcomeMessage, ex_2, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                this.isMobile = mobile;
                                userAgent = navigator.userAgent || navigator.vendor;
                                if ((userAgent.indexOf('Instagram') > -1) && (userAgent.indexOf('iPhone') > -1))
                                    this.isInstagramInappBrowser = true;
                                // Parse url
                                if (!this.parseUrl()) {
                                    alert("Error parsing the URL.");
                                    return [2 /*return*/];
                                }
                                href = (window.location != window.parent.location) ? document.referrer : document.location.href;
                                domain = href.substr(0, href.indexOf("/", 10));
                                url = "https://www.zakeke.com?utm_source=dominio&utm_medium=siti-attivi&utm_campaign=zakeke_link_da_configurazione_prodotto";
                                url = url.replace("dominio", domain);
                                $("#img-brand").attr("href", url);
                                // Layout manager
                                this.layoutManager = !mobile ? new Customizer.LayoutManagerDesktop() : new Customizer.LayoutManagerMobile();
                                return [4 /*yield*/, this.layoutManager.init()];
                            case 1:
                                _f.sent();
                                this.layoutManager.onToolboxAction.add(function (button) { return _this.onToolboxAction(button); });
                                this.layoutManager.onZoomToolClicked.add(function (isZoomIn) { return _this.onZoomToolClicked(isZoomIn); });
                                // Add to shopping cart callback
                                this.layoutManager.onBuy.add(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    var multiplePreviewsPopupMessage, addToCartConfirmMessage, showAddToCartMessage, popupOptions, popup;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.updateSyncedItems(this.side)];
                                            case 1:
                                                _a.sent();
                                                // Check if design items has been changed (for models with templates)
                                                if (!Context.isTemplateEditor) {
                                                    this.mandatoryItems = this.getNoChangedMandatoryItems();
                                                    this.layoutManager.showAlertOnSides(this.mandatoryItems.map(function (x) { return x.side; }));
                                                    this.customizer.highlightsCanvasItemFromDesignItems(this.mandatoryItems.map(function (x) { return x.designItem; }));
                                                    if (this.mandatoryItems.length > 0) {
                                                        this.layoutManager.showError('', T._("There are some mandatory elements that have not been edited. Select the product sides with the alert icon to show them.", "Customizer"));
                                                        return [2 /*return*/];
                                                    }
                                                }
                                                if (!(this.customizer.customizedMessages && !Context.isDesignEditor && !Context.isTemplateEditor)) return [3 /*break*/, 6];
                                                multiplePreviewsPopupMessage = this.customizer.customizedMessages.find(function (x) { return x.EventID === EventMessages.MultiplePreviewsPopup; });
                                                addToCartConfirmMessage = this.customizer.customizedMessages.find(function (x) { return x.EventID === EventMessages.AddToCartConfirmation; });
                                                showAddToCartMessage = function () {
                                                    _this.layoutManager.showGenericDialog(addToCartConfirmMessage.Description, true, null, function (dialog) {
                                                        _this.layoutManager.closeDialog(dialog);
                                                        _this.onBuy();
                                                    });
                                                };
                                                if (!(multiplePreviewsPopupMessage && multiplePreviewsPopupMessage.Visible === true)) return [3 /*break*/, 4];
                                                popupOptions = new Customizer.GenericDialogOptions();
                                                popupOptions.popupAdditionalClass = "dialog-large";
                                                popupOptions.okButtonContent = $("<span>" + T._("Proceed to the cart", "Customizer") + "</span><i class='material-icons'>arrow_forward_ios</i>");
                                                popupOptions.cancelButtonContent = $("<i class='material-icons'>arrow_back_ios</i><span>" + T._("Cancel", "Customizer") + "</span>");
                                                popup = this.layoutManager.showGenericDialog(multiplePreviewsPopupMessage.Description, true, popupOptions, function (dialog) {
                                                    if (dialog)
                                                        _this.layoutManager.closeDialog(dialog);
                                                    if (addToCartConfirmMessage && addToCartConfirmMessage.Visible === true)
                                                        showAddToCartMessage();
                                                    else
                                                        _this.onBuy();
                                                });
                                                if (!popup) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.generateMultiplePreviewsPopupContent(popup.find("> .dialog-content"))];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                            case 4:
                                                if (addToCartConfirmMessage && addToCartConfirmMessage.Visible === true) {
                                                    showAddToCartMessage();
                                                }
                                                else
                                                    this.onBuy();
                                                _a.label = 5;
                                            case 5: return [3 /*break*/, 7];
                                            case 6:
                                                this.onBuy();
                                                _a.label = 7;
                                            case 7: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                this.layoutManager.onModelColorSelected.add(function (color) { return _this.onModelColorSelected(color); });
                                this.layoutManager.onSideSelected.add(function (side) { return _this.onSideSelected(side); });
                                this.layoutManager.onPreview3dExpanded.add(function () { return _this.onPreview3dExpanded(); });
                                this.layoutManager.onPreview3dCollapsed.add(function () { return _this.onPreview3dCollapsed(); });
                                this.layoutManager.onSvgColorChanged.add(function (settings) { return _this.onSvgColorChanged(settings); });
                                // Share
                                this.layoutManager.onPreviewRequested.add(function (callback) { return __awaiter(_this, void 0, void 0, function () {
                                    var url;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.generatePreviewUrl()];
                                            case 1:
                                                url = _a.sent();
                                                callback(url);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                this.layoutManager.onShareRequested.add(function (settings) { return _this.onShare(settings.url, settings.name); });
                                this.layoutManager.onResetRequested.add(function () { return _this.onReset(); });
                                // Text 
                                this.layoutManager.onAddText.add(function (settings) { return _this.onAddText(settings); });
                                this.layoutManager.onUpdateText.add(function (settings) { return _this.onUpdateText(settings); });
                                this.layoutManager.onAddDefaultText.add(function (text) { return _this.onAddDefaulText(text); });
                                this.layoutManager.onAddAnotherText.add(function () { return _this.onAddAnotherText(); });
                                this.layoutManager.onTextPathChanged.add(function (enabled) { return _this.onTextPathChanged(enabled); });
                                this.layoutManager.onTextAreaChanged.add(function (enabled) { return _this.onTextAreaChanged(enabled); });
                                this.layoutManager.onTextStyleChanged.add(function (settings) { return _this.onTextStyleChanged(settings); });
                                this.layoutManager.onTextAlignChanged.add(function (align) { return _this.onTextAlignChanged(align); });
                                this.layoutManager.onTextFontChanged.add(function (font) { return _this.onTextFontChanged(font); });
                                this.layoutManager.onTextContentChanged.add(function (text) { return _this.onTextContentChanged(text); });
                                this.layoutManager.onTextColorChanged.add(function (color) { return _this.onTextColorChanged(color); });
                                // Images
                                this.layoutManager.onImagesCategoriesFillRequest.add(function (settings) { return _this.onImagesCategoriesFillRequest(settings); });
                                this.layoutManager.onImagesFillRequest.add(function (categoryId) { return _this.onImagesFillRequest(categoryId); });
                                this.layoutManager.onImagesFacebookFillRequest.add(function (continueCallback) { return _this.onImagesFacebookFillRequest(continueCallback); });
                                this.layoutManager.onImagesInstagramFillRequest.add(function (continueCallback) { return _this.onImagesInstagramFillRequest(continueCallback); });
                                this.layoutManager.onImageSelected.add(function (image) { return _this.onImageSelected(image); });
                                this.layoutManager.onImageFacebookClicked.add(function (id) { return _this.onImageFacebookSelected(id); });
                                this.layoutManager.onImageInstagramClicked.add(function (id) { return _this.onImageInstagramSelected(id); });
                                this.layoutManager.onImageConvertedEdit.add(function (image) { return _this.onImageConvertedEdit(image); });
                                // Upload image
                                this.layoutManager.onUploadImageSelected.add(function (settings) { return _this.onUploadImageSelected(settings); });
                                this.layoutManager.onUploadImageFiltered.add(function (settings) { return _this.onUploadImageFiltered(settings); });
                                this.layoutManager.onUploadPdfSelected.add(function (settings) { return _this.onUploadPdfSelected(settings); });
                                this.layoutManager.onUploadImageFiltered.add(function (settings) { return _this.onUploadPdfFiltered(settings); });
                                this.layoutManager.onImageDeleted.add(function (image) { return _this.onImageDeleted(image); });
                                // Templates
                                this.layoutManager.onTemplateSelected.add(function (settings) { return _this.onTemplateSelected(settings); });
                                this.layoutManager.onTemplateSyncChange.add(function (enabled) { return _this.onTemplateSyncChange(enabled); });
                                this.layoutManager.onElementConstraintChanged.add(function (constraints) { return _this.onElementConstraintChanged(constraints); });
                                this.layoutManager.onElementConstraintUpdateRequested.add(function () { return _this.onElementConstraintUpdateRequested(); });
                                // Draft designs
                                if (!Context.canSaveDesign) {
                                    this.layoutManager.btnSaveDesign.remove();
                                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.DraftDesigns, false);
                                    if (!this.isMobile) {
                                        this.layoutManager.btnBuy.addClass('btn-large');
                                        this.layoutManager.btnBuyWait.addClass('btn-large');
                                    }
                                }
                                this.layoutManager.onSaveDesign.add(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        this.getPreviewImage(function (dataUrl, errorStates) {
                                            if (errorStates.length != 0) {
                                                var errorMessage = "";
                                                errorStates.forEach(function (x) {
                                                    errorMessage = errorMessage + " | " + (x.message);
                                                });
                                                console.log(errorMessage);
                                                _this.layoutManager.showError(T._("Error", "Customizer"), T._("Error during saving", "Customizer"));
                                                return;
                                            }
                                            _this.design.set("tempPreviewImageData", dataUrl);
                                            _this.layoutManager.showEditDrafDesignDialog(_this.design, true);
                                        });
                                        return [2 /*return*/];
                                    });
                                }); });
                                this.layoutManager.onDesignDraftDeleted.add(function (design) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        this.onDraftDesignDeleted(design);
                                        return [2 /*return*/];
                                    });
                                }); });
                                this.layoutManager.onDesignDraftSelected.add(function (design) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.onDraftDesignSelected(design)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                this.layoutManager.onDialogSaveDraftDesign.add(function (obj) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        this.onSaveDraftDesign(obj.name, obj.tags, false);
                                        return [2 /*return*/];
                                    });
                                }); });
                                this.layoutManager.onDialogSaveCopyDraftDesign.add(function (obj) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        this.onSaveDraftDesign(obj.name, obj.tags, true);
                                        return [2 /*return*/];
                                    });
                                }); });
                                // Template Duplicate
                                this.layoutManager.onUpdateDuplicateTemplateRequested.add(function (nextPage) { return _this.onUpdateDuplicateTemplate(nextPage); });
                                this.layoutManager.onDuplicateTemplateRequested.add(this.onDuplicateTemplate.bind(this));
                                this.layoutManager.onDuplicateTemplateClosed.add(this.onDuplicateTemplateClose.bind(this));
                                // Print types
                                this.layoutManager.onPrintTypeSelected.add(function (settings) { return _this.onPrintTypeSelected(settings); });
                                // Preview designs in PDF format
                                this.layoutManager.onPreviewDesignsPDF.add(this.onPreviewDesignsPDF.bind(this));
                                // Upload reset
                                this.layoutManager.uploadImageProgress = 0;
                                this.layoutManager.uploadPdfProgress = 0;
                                // Customizer
                                this.customizer = new MPlaza.Customizer(false, this.isMobile);
                                this.customizer.appendTo($('#customizer-container').get(0));
                                this.customizer.addSelectionChangedListener(function (e) { return _this.onItemSelectionChanged(e); });
                                this.customizer.addDeselectionListener(function (e) { return _this.onItemsDeselection(e); });
                                this.customizer.addItemRemovedListener(function (e) { return _this.onItemRemoved(e); });
                                this.customizer.addDesignItemRemovingListener(function (e) { return _this.onDesignItemRemoving(e); });
                                this.customizer.addItemChangedListener(function (e) { return _this.onItemChanged(e); });
                                this.customizer.addItemCreatedListener(function (e) { return _this.onItemCreated(e); });
                                this.customizer.addDesignItemChangedListener(function (e) { return _this.onDesignItemChanged(e); });
                                //PhotoEditorSDK
                                this.layoutManager.onPhotoEditorSDKOpening.add(function (settings) { return _this.onPhotoEditorSDKOpening(settings); });
                                // Post Messages Handler
                                //window.addEventListener('message', (event) => {
                                //    this.handlerMessages(event.data);
                                //});
                                // Set Auth-Token
                                if (Context.tokenOwin) {
                                    $.ajaxSetup({
                                        headers: {
                                            'Authorization': 'Bearer ' + Context.tokenOwin,
                                            "Accept-Language": Context.culture
                                        }
                                    });
                                }
                                else {
                                    $.ajaxSetup({
                                        headers: {
                                            'X-Auth-Token': Context.token,
                                            "Accept-Language": Context.culture
                                        }
                                    });
                                }
                                _f.label = 2;
                            case 2:
                                _f.trys.push([2, 4, , 5]);
                                _a = Context;
                                return [4 /*yield*/, $.getJSON(Zakeke.config.baseApiUrl + "FontFamilies", { _: new Date().getTime() })];
                            case 3:
                                _a.fonts = (_f.sent()).map(function (x) {
                                    return new Font(x.fontFamilyID, x.name, x.cssUrl, x.imageUrl, x.variations, x.stretches);
                                }).sort(function (a, b) { return a.name > b.name ? 1 : -1; });
                                return [3 /*break*/, 5];
                            case 4:
                                ex_1 = _f.sent();
                                this.layoutManager.showError(T._("Error!", "Customizer"), T._("Error loading fonts", "Customizer"));
                                Logger.error("Error loading fonts");
                                Logger.error(ex_1);
                                return [3 /*break*/, 5];
                            case 5:
                                // Price formatter
                                Context.priceFormatter = new Intl.NumberFormat(Context.culture, {
                                    style: "currency",
                                    currency: Context.currency
                                });
                                // Merchant integration
                                _b = this;
                                return [4 /*yield*/, Customizer.Integration.integrationFor(Context.ecommerce)];
                            case 6:
                                // Merchant integration
                                _b.merchantIntegration = _f.sent();
                                this.merchantIntegration.onDesignChange(function (productData) { return __awaiter(_this, void 0, void 0, function () {
                                    var colorToHideId, variations, text, color;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!productData.isOutOfStock) return [3 /*break*/, 2];
                                                colorToHideId = this.side ? this.side.getColorID() : -1;
                                                variations = this.model.get("colors").filter(function (x) { return x.id != colorToHideId; });
                                                text = variations.length > 0 ? T._("Out-of-stock product variation.<br/>Please choose another variation of the product", "Customizer") : T._("Out-of-stock product variation.", "Customizer");
                                                return [4 /*yield*/, this.layoutManager.showSelectColorDialog(text, variations)];
                                            case 1:
                                                color = _a.sent();
                                                this.layoutManager.selectColor(color);
                                                return [3 /*break*/, 3];
                                            case 2:
                                                this.layoutManager.setProductPrice(productData.finalPrice);
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                _f.label = 7;
                            case 7:
                                _f.trys.push([7, 9, , 10]);
                                return [4 /*yield*/, $.ajax({
                                        url: Zakeke.config.baseApiUrl + "customizerinfo",
                                        cache: false
                                    })];
                            case 8:
                                info = _f.sent();
                                this.userID = info.userID;
                                this.ecommerceUrl = info.ecommerceUrl;
                                this.uploadImageSizeLimit = info.uploadImageSizeLimit;
                                this.designSizeLimit = info.designSizeLimit;
                                this.referrerID = info.referrerID;
                                this.layoutManager.activeAddons = info.addons || [];
                                this.customizerBackgroundColor = info.customizerBackgroundColor;
                                this.isSandbox = info.isSandbox;
                                this.pantoneColors = info.pantoneColors;
                                this.styleRestrictions = info.styleRestrictions;
                                this.hasPrintTypesPerSide = info.hasPrintTypesPerSide;
                                this.hasSyncedItemsAvailable = info.hasPrintTypesPerSide;
                                this.hasAdaptiveZoomEnabled = this.styleRestrictions.HasAdaptiveZoomEnabled;
                                if (!this.hasPrintTypesPerSide) {
                                    $("#toolbox-sides-print-types").hide();
                                    $("#toolbox-sides-print-types-row").hide();
                                }
                                else {
                                    $("#toolbox-print-types").hide();
                                    $("#toolbox-print-types-row").hide();
                                }
                                if (!this.hasSyncedItemsAvailable) {
                                    $("#cb-template-has-sync-enabled-row").hide();
                                    $("#cb-element-constraint-is-synced-row").hide();
                                }
                                try {
                                    this.forceAdminSave = localStorage.getItem("forceAdminSave") == "1";
                                    if (!this.forceAdminSave && window.location.href.indexOf("forceAdminSave") != -1) {
                                        localStorage.setItem("forceAdminSave", "1");
                                        this.forceAdminSave = true;
                                    }
                                }
                                catch (ex) {
                                    console.log("Cannot put forceAdminSave in localstorage");
                                    console.error(ex);
                                }
                                // Shirt Tool domain
                                if (this.referrerID === UserReferrer.ShirtTools) {
                                    url = "https://www.shirttools.com";
                                    $("#img-brand-shirttools").attr("href", url);
                                    $("#img-brand-shirttools").show();
                                    $("#img-brand").remove();
                                }
                                else {
                                    $("#img-brand-shirttools").remove();
                                }
                                try {
                                    if (!Context.isTemplateEditor && !Context.isDesignEditor
                                        && document.referrer && this.ecommerceUrl.indexOf("myshopify") == -1
                                        && this.ecommerceUrl.indexOf("t-shirtshop.") == -1
                                        && document.referrer.indexOf("hotjar.") == -1
                                        && document.referrer.indexOf("luckyorange.") == -1
                                        && document.referrer.indexOf("fullstory.") == -1
                                        && document.referrer.indexOf(".local") == -1
                                        && document.referrer.indexOf("invition.") == -1
                                        && this.ecommerceUrl.indexOf(".") !== -1) {
                                        a = document.createElement('a');
                                        a.href = this.ecommerceUrl;
                                        aReferrer = document.createElement('a');
                                        aReferrer.href = document.referrer;
                                        _c = [aReferrer.hostname, a.hostname].map(function (hostname) { return hostname.split('.').reverse().find(function (x) { return x.length > 3; }); }), siteHost = _c[0], ecommerceHost = _c[1];
                                        if (siteHost != ecommerceHost && siteHost.indexOf("localhost") == -1 && siteHost.indexOf("zakeke") == -1) {
                                            this.layoutManager.showAbort(T._("Error", "Customizer"), StringHelper.format(T._("The URL of this site is not the same as the URL of the integration.<br/>(Valid URL: {0}, Current URL: {1})", "Customizer"), this.ecommerceUrl, siteHost), function (dialog) {
                                                history.back();
                                            });
                                            return [2 /*return*/];
                                        }
                                    }
                                }
                                catch (ex) {
                                }
                                // Custom user colors
                                this.layoutManager.setUserColor(info);
                                // Custom font list
                                this.layoutManager.filterFontByID(info.userID);
                                // Set image filters visibility
                                this.isImageFilterAvailable = info.imageFilter;
                                // Set custom messages and alerts
                                this.customizer.setCustomizedMessages(info.eventMessages);
                                // Show welcome message (if exists)
                                if (info.eventMessages) {
                                    welcomeMessage = info.eventMessages.find(function (x) { return x.EventID === EventMessages.WelcomeMessage; });
                                    if (welcomeMessage && welcomeMessage.Visible === true)
                                        this.layoutManager.showGenericDialog(welcomeMessage.Description);
                                }
                                ;
                                // Customize icons and text 
                                if (info.themeIconsText) {
                                    this.layoutManager.applyCustomizedIconsText(info.themeIconsText);
                                }
                                return [3 /*break*/, 10];
                            case 9:
                                ex_2 = _f.sent();
                                if (ex_2.status == 402) {
                                    this.layoutManager.showError(T._("Error", "Customizer"), T._("Feature not available", "Customizer"), function (dialog) { return window.location.reload(); });
                                    return [2 /*return*/];
                                }
                                else {
                                    this.layoutManager.showError(T._("Error", "Customizer"), T._("There was an error loading. Click OK to reload the page", "Customizer"), function (dialog) { return window.location.reload(); });
                                }
                                Logger.error("Init error");
                                Logger.error(ex_2);
                                return [3 /*break*/, 10];
                            case 10:
                                if (this.isInstagramInappBrowser) {
                                    $("#product-info").addClass("instagram");
                                    $(".toolbox-container").addClass("instagram");
                                }
                                // Load the model
                                return [4 /*yield*/, this.reloadModel()];
                            case 11:
                                // Load the model
                                _f.sent(); // Wait for model ID
                                return [4 /*yield*/, this.loadImagesGroups()];
                            case 12:
                                _f.sent();
                                this.loadImagesCategories();
                                this.loadUserImages();
                                return [4 /*yield*/, this.loadUserDraftDesigns()];
                            case 13:
                                _f.sent();
                                _d = this;
                                return [4 /*yield*/, $.get(Zakeke.config.baseUrl + "/Scripts/localizations/photoEditor_baseJSON.json")];
                            case 14:
                                _d.photoEditorLanguageFileBase = _f.sent();
                                _e = this;
                                return [4 /*yield*/, $.get(Zakeke.config.baseUrl + ("/Scripts/localizations/" + Context.culture.substring(0, 2) + "/photoEditor.json"))];
                            case 15:
                                _e.photoEditorLanguageFile = _f.sent();
                                // Select homepage tool
                                if (!mobile)
                                    if (Context.isTemplateEditor)
                                        this.layoutManager.selectToolboxPage(ToolboxItem.Settings);
                                    else
                                        this.layoutManager.selectToolboxPage(ToolboxItem.Homepage);
                                // Set UI for Addon PDF
                                this.layoutManager.setUIForPDFAddon();
                                // VR checkbox
                                if (mobile) {
                                    //var span = $("<span/>");
                                    //span.html("<input type='checkbox' /> VR Mode");
                                    //$(document.body).append(span);
                                    //span.css("position", "fixed").css("left", "15px").css("top", "30px").css("z-index", "100").hide();
                                    //$(span).children("input").change(e => {
                                    //    this.preview3d.viewer.vrMode = $(e.currentTarget).prop("checked");
                                    //    this.preview3d.viewer.showFloor = this.preview3d.viewer.vrMode;
                                    //});
                                    //this.layoutManager.onPreview3dExpanded.add(() => span.show());
                                    //this.layoutManager.onPreview3dCollapsed.add(() => span.hide());
                                }
                                this.applyTemplateEditorFunctions();
                                this.layoutManager.setToolboxItemEnabled(ToolboxItem.ElementRestrictions, false);
                                this.layoutManager.setToolboxItemEnabled(ToolboxItem.Duplicate, false);
                                this.layoutManager.setToolboxItemEnabled(ToolboxItem.MoveUpDown, false);
                                this.layoutManager.setToolboxItemEnabled(ToolboxItem.Mirror, false);
                                if (this.printTypeAllowPreviewPDF)
                                    this.layoutManager.setToolboxItemActive(ToolboxItem.PreviewDesignsPDF, false);
                                else {
                                    this.layoutManager.btnPreviewPDF.remove();
                                    this.layoutManager.btnPreviewPDF = null;
                                }
                                this.layoutManager.setBtnShareVisible(!Context.isTemplateEditor && this.styleRestrictions.CanShareImages);
                                this.layoutManager.setBtnSaveDesignVisible(this.styleRestrictions.CanSaveDraftDesing);
                                if (this.model.get("colors").length < 2)
                                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Colors, false);
                                else
                                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Colors, !Context.hideVariants);
                                if (Context.isTemplateEditor) {
                                    this.updateTemplatesCategories();
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            // Buy callback
            Application.prototype.onBuy = function () {
                if (Context.isTemplateEditor && this.isSandbox && !this.forceAdminSave) {
                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("This is a demo. To save this template try Zakeke.", "Customizer"));
                    return;
                }
                this.onSave();
            };
            // Save draft design callback (with name and tags)
            Application.prototype.onSaveDraftDesign = function (name, tags, isCopy) {
                var _this = this;
                var designToSave = this.design;
                designToSave.set("isDraft", true);
                if (name)
                    designToSave.set("name", name);
                if (tags) {
                    designToSave.set("tags", JSON.parse(tags));
                }
                this.layoutManager.saveDesignProgress = true;
                this.layoutManager.toolboxLoading = true;
                if (isCopy === true) {
                    var itemColors = this.design.get("designItems").map(function (x) { return { guid: x.get("itemGuid"), colors: x.get("itemColors") }; });
                    var designToSave = this.design.clone();
                    var _loop_1 = function (color) {
                        var item = designToSave.get("designItems").find(function (x) { return x.get("itemGuid") == color.guid; });
                        item.set("itemColors", color.colors);
                    };
                    for (var _i = 0, itemColors_1 = itemColors; _i < itemColors_1.length; _i++) {
                        var color = itemColors_1[_i];
                        _loop_1(color);
                    }
                    designToSave.id = null;
                    designToSave.set("docID", null);
                    designToSave._previousAttributes.docID = null;
                    designToSave.save(null, {
                        success: function (design, response, options) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!design) return [3 /*break*/, 2];
                                        if (design.get("isDraft") === true) {
                                            this.merchantIntegration.saveDesign(design.get("docID"));
                                        }
                                        return [4 /*yield*/, this.loadUserDraftDesigns(function () {
                                                _this.layoutManager.selectToolboxPage('draft-designs');
                                                _this.layoutManager.saveDesignProgress = false;
                                                _this.layoutManager.toolboxLoading = false;
                                            })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); },
                        error: function () {
                            _this.layoutManager.saveDesignProgress = false;
                            _this.layoutManager.toolboxLoading = false;
                        }
                    });
                    return;
                }
                if (!designToSave)
                    return;
                // Mobile will always show first the printType window
                if (this.isMobile && (this.printTypeChosen == false && this.model.get("printTypes").length > 1)) {
                    this.layoutManager.selectToolboxPage(ToolboxItem.PrintTypes);
                    // For the auto-selection of print type don't change the user selection state
                    this.printTypeChosen = true;
                    return;
                }
                this.layoutManager.saveDesignProgress = true;
                var size = this.referrerID == 2 ? { width: 700, height: 700 } : Context.previewImageSize;
                this.getPreviewImage(function (dataUrl, errorStates) {
                    if (errorStates.length != 0) {
                        var errorMessage = "";
                        errorStates.forEach(function (x) {
                            errorMessage = errorMessage + " | " + (x.message);
                        });
                        console.log(errorMessage);
                        _this.layoutManager.showError(T._("Error", "Customizer"), T._("Error during saving", "Customizer"));
                        return;
                    }
                    designToSave.set("tempPreviewImageData", dataUrl);
                    designToSave.save(null, {
                        success: function (design, response, options) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!design) return [3 /*break*/, 2];
                                        if (design.get("isDraft") === true) {
                                            this.merchantIntegration.saveDesign(design.get("docID"));
                                        }
                                        return [4 /*yield*/, this.loadUserDraftDesigns(function () {
                                                _this.layoutManager.selectToolboxPage('draft-designs');
                                                _this.layoutManager.saveDesignProgress = false;
                                                _this.layoutManager.toolboxLoading = false;
                                            })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); },
                        error: function () {
                            _this.layoutManager.saveDesignProgress = false;
                            _this.layoutManager.toolboxLoading = false;
                        }
                    });
                }, size.width, size.height);
            };
            // Save design during add to Cart
            Application.prototype.onSave = function (callback) {
                var _this = this;
                if (!this.design)
                    return;
                if (this.design.get('isDraft') === true && !Context.isTemplateEditor && !Context.isDesignEditor) {
                    this.design.id = null;
                    this.design.set("docID", null);
                    this.design.set("isDraft", false);
                    this.design._previousAttributes.docID = null;
                }
                if (!this.isOneMandatoryAreaFull()) {
                    var sidesNames = this.color.get("sides").models.reduce(function (names, side) {
                        if (side.get("areas").models.some(function (area) { return area.get("IsMandatory"); })) {
                            if (names == null)
                                names = "";
                            return names + ((names == "") ? "" : ", ") + side.get("name");
                        }
                    }, "");
                    this.layoutManager.buyProgress = false;
                    this.layoutManager.showError(T._("Warning!", "Customizer"), (T._("You have to customize all the areas of at least one of these sides: ", "Customizer") + sidesNames));
                    return;
                }
                // Mobile will always show first the printType window
                if (this.isMobile && (this.printTypeChosen == false && this.model.get("printTypes").length > 1)) {
                    this.layoutManager.selectToolboxPage(ToolboxItem.PrintTypes);
                    // For the auto-selection of print type don't change the user selection state
                    this.printTypeChosen = true;
                    return;
                }
                this.layoutManager.buyProgress = true;
                // Get template design settings
                if (Context.isTemplateEditor) {
                    var settings = this.layoutManager.getTemplateSettings();
                    if (settings.uploadRestrictions.isUserImageAllowed && !settings.uploadRestrictions.isJpgAllowed && !settings.uploadRestrictions.isPngAllowed && !settings.uploadRestrictions.isSvgAllowed) {
                        this.layoutManager.buyProgress = false;
                        this.layoutManager.showError(T._("Warning!", "Customizer"), T._("Choose one or more permitted upload image file extensions, or disable upload for user images.", "Customizer"));
                        return;
                    }
                    this.design.get("sides").reset();
                    this.design.get("categories").reset();
                    this.design.set("name", settings.name);
                    if (settings.categoryId != -1)
                        this.design.get("categories").add(new MPlaza.DesignTemplateCategory({ categoryID: settings.categoryId }));
                    if (settings.constraintsFilter == "global") {
                        this.design.get("sides").reset();
                        this.design.set("hasSyncEnabled", settings.hasSyncEnabled);
                        this.design.set("canAddText", settings.canAddText);
                        this.design.set("canAddImage", settings.canAddImage);
                        this.design.set("maxNrTexts", settings.maxNrTexts != "" ? settings.maxNrTexts : null);
                        this.design.set("maxNrImages", settings.maxNrImages != "" ? settings.maxNrImages : null);
                        this.design.set("uploadRestrictions", settings.uploadRestrictions);
                        this.design.set("disableSellerImages", settings.disableSellerImages);
                    }
                    else {
                        this.design.set("canAddText", true);
                        this.design.set("canAddImage", true);
                        this.design.set("maxNrTexts", null);
                        this.design.set("maxNrImages", null);
                        this.design.set("uploadRestrictions", null);
                        this.design.set("disableSellerImages", null);
                        try {
                            this.model.get("colors").each(function (color) {
                                for (var _i = 0, _a = settings.designSidesRestrictions; _i < _a.length; _i++) {
                                    var designSideRestriction = _a[_i];
                                    if (designSideRestriction.uploadRestrictions.isUserImageAllowed && !designSideRestriction.uploadRestrictions.isJpgAllowed && !designSideRestriction.uploadRestrictions.isPngAllowed && !designSideRestriction.uploadRestrictions.isSvgAllowed)
                                        throw new Error(T._("Choose one or more permitted upload image file extensions, or disable upload for user images.", "Customizer"));
                                    _this.design.get("sides").add(new MPlaza.DesignSide({
                                        modelID: _this.model.id,
                                        colorID: color.id,
                                        sideID: designSideRestriction.sideId,
                                        canAddText: designSideRestriction.canAddText,
                                        canAddImage: designSideRestriction.canAddImage,
                                        maxNrTexts: designSideRestriction.maxNrTexts,
                                        maxNrImages: designSideRestriction.maxNrImages,
                                        uploadRestrictions: designSideRestriction.uploadRestrictions,
                                        disableSellerImages: designSideRestriction.disableSellerImages
                                    }));
                                }
                            });
                        }
                        catch (e) {
                            this.layoutManager.buyProgress = false;
                            this.layoutManager.showError(T._("Warning!", "Customizer"), e.message);
                            return;
                        }
                    }
                }
                var size = this.referrerID == 2 ? { width: 700, height: 700 } : Context.previewImageSize;
                this.getPreviewImage(function (dataUrl, errorStates) {
                    if (errorStates.length != 0) {
                        var errorMessage = "";
                        errorStates.forEach(function (x) {
                            errorMessage = errorMessage + " | " + (x.message);
                        });
                        console.log(errorMessage);
                        _this.layoutManager.showError(T._("Error", "Customizer"), T._("Error during saving", "Customizer"));
                        return;
                    }
                    _this.design.set("tempPreviewImageData", dataUrl);
                    _this.design.save(null, {
                        success: function (design, response, options) {
                            if (design) {
                                if (design.get("isDraft") === true) {
                                    _this.merchantIntegration.saveDesign(design.get("docID"));
                                }
                                _this.merchantIntegration.addToCart(design.get("docID"), design.get("modelID"), Context.colorCode, Context.quantity);
                                if (callback != null)
                                    callback(design.get("docID"), design.get("modelID"));
                                else if (Context.isTemplateEditor)
                                    _this.layoutManager.showSuccess(T._("Success", "Customizer"), T._("Template saved successfully", "Customizer"));
                                else if (Context.isDesignEditor)
                                    _this.layoutManager.showSuccess(T._("Success", "Customizer"), T._("Design saved successfully", "Customizer"));
                                if (Context.isTemplateEditor || Context.isDesignEditor)
                                    _this.layoutManager.buyProgress = false;
                            }
                        },
                        error: function () {
                            _this.layoutManager.buyProgress = false;
                        },
                        headers: {
                            fromBackOffice: Context.isDesignEditor
                        }
                    });
                }, size.width, size.height);
            };
            // Toobox button click
            Application.prototype.onToolboxAction = function (button) {
                var _this = this;
                switch (button) {
                    case ToolboxItem.Settings:
                    case ToolboxItem.ImagesMacroCategories:
                    case ToolboxItem.UploadImage:
                    case ToolboxItem.Text:
                    case ToolboxItem.Colors:
                    case ToolboxItem.Templates:
                    case ToolboxItem.PrintTypes:
                    case ToolboxItem.ElementRestrictions:
                    case ToolboxItem.DraftDesigns:
                    case ToolboxItem.Sides:
                        this.layoutManager.selectToolboxPage(button);
                        break;
                    case ToolboxItem.EditText:
                        var info = this.customizer.getSelectedTextItemsInfo();
                        var items = this.customizer.getSelectedItems();
                        var constraints = this.defaultDesignConstraints;
                        if (items.length > 0 && !Context.isTemplateEditor) {
                            constraints = this.customizer.findDesignItemForItem(items[0]).get("constraints");
                        }
                        if (info) {
                            this.preventItemUpdate = true;
                            this.layoutManager.updateTextForm(info, constraints);
                            this.layoutManager.selectToolboxPage(ToolboxItem.EditText);
                            this.preventItemUpdate = false;
                        }
                        break;
                    case ToolboxItem.MirrorX:
                        this.customizer.mirrorSelectedItems("X");
                    case ToolboxItem.MirrorY:
                        this.customizer.mirrorSelectedItems("Y");
                        break;
                    case ToolboxItem.Duplicate:
                        this.customizer.cloneSelectedItems();
                        this.initSyncForSelectedItem();
                        break;
                    case ToolboxItem.ZoomIn:
                        this.customizer.zoomIn();
                        break;
                    case ToolboxItem.ZoomOut:
                        this.customizer.zoomOut();
                        break;
                    case ToolboxItem.MoveUp:
                        this.customizer.bringSelectionToFront();
                        break;
                    case ToolboxItem.MoveDown:
                        this.customizer.sendSelectionToBack();
                        break;
                    case ToolboxItem.CenterPosition:
                        this.customizer.moveSelectionToCenter();
                        break;
                    case ToolboxItem.ImageFilters:
                        var selectedItems = this.customizer.getSelectedItems();
                        if (!selectedItems)
                            break;
                        var selectedItem = selectedItems[0];
                        var imageUrl;
                        var imageFile;
                        //------
                        try {
                            this.layoutManager.modelLoading = true;
                            var image = new MPlaza.Image({ imageID: this.customizer.findDesignItemForItem(selectedItem).get("imageID") });
                            if (!image)
                                throw "Error trying to load image";
                            image.fetch({
                                success: function (model, response, options) {
                                    if (model && model.get("imageID") && image.attributes) {
                                        imageFile = model;
                                        imageUrl = imageFile.attributes.url;
                                        if (!imageUrl || imageUrl == "")
                                            throw "Error trying image load";
                                        _this.onPhotoEditorSDKOpening({ imageUrl: imageUrl, imageData: imageFile });
                                    }
                                    else {
                                        Logger.error("Cannot read image:  " + model.get("message"));
                                    }
                                },
                                error: function (model, response, options) {
                                    Logger.error("Error loading image");
                                    Logger.error(response);
                                },
                                complete: function () {
                                    _this.layoutManager.modelLoading = false;
                                }
                            });
                        }
                        catch (e) {
                            Logger.error(e);
                        }
                        //------
                        break;
                    case ToolboxItem.PreviewDesignsPDF:
                        this.layoutManager.onPreviewDesignsPDF.trigger();
                }
            };
            Application.prototype.onZoomToolClicked = function (isZoomIn) {
                if (this.isPreview3dExpanded && !this.isMobile) {
                    var canvas = this.preview3d.viewer.domElement;
                    //Detail is set because of Firefox
                    if (isZoomIn)
                        canvas.dispatchEvent(new WheelEvent('mousewheel', { deltaY: -100, detail: -100 }));
                    else
                        canvas.dispatchEvent(new WheelEvent('mousewheel', { deltaY: 100, detail: 100 }));
                }
                else {
                    if (isZoomIn)
                        this.customizer.zoomIn();
                    else
                        this.customizer.zoomOut();
                }
            };
            Application.prototype.applyTemplateEditorFunctions = function () {
                // Disable buttons for template editor
                if (Context.isTemplateEditor) {
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Templates, false);
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.UploadImage, false);
                }
                else {
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Settings, false);
                }
            };
            Application.prototype.initSyncForSelectedItem = function () {
                if ((Context.isTemplateEditor && this.layoutManager.getTemplateSyncEnabled()) || (this.design && this.design.get("hasSyncEnabled"))) {
                    var selectedItems = this.customizer.getSelectedItems();
                    if (selectedItems && selectedItems.length > 0) {
                        var designItem = this.customizer.findDesignItemForItem(selectedItems[0]);
                        if (designItem) {
                            designItem.set("syncGuid", MPlaza.generateUUID());
                            this.syncItemSides.push({ sides: this.color.get("sides").slice(0), syncGuid: designItem.get("syncGuid") });
                        }
                    }
                }
            };
            Application.prototype.initSyncForDesignItem = function (designItem) {
                if ((Context.isTemplateEditor && this.layoutManager.getTemplateSyncEnabled()) || (this.design && this.design.get("hasSyncEnabled"))) {
                    if (designItem) {
                        designItem.set("syncGuid", MPlaza.generateUUID());
                        this.syncItemSides.push({ sides: this.color.get("sides").slice(0), syncGuid: designItem.get("syncGuid") });
                    }
                }
            };
            // Text
            //------------------------------------------------------------------------------------
            Application.prototype.addText = function (settings, callback) {
                var _this = this;
                this.loadFont(settings.font, function () {
                    var info = {};
                    var fontWeight = [];
                    if (settings.italic)
                        fontWeight.push("italic");
                    if (settings.bold)
                        fontWeight.push("bold");
                    info.text = settings.text;
                    info.strokeColor = "#000000";
                    info.strokeWidth = 0;
                    info.fillColor = settings.color;
                    info.fontFamily = settings.font;
                    info.fontSize = "48";
                    info.fontWeight = fontWeight.join(" ");
                    info.fontStretch = settings.stretch;
                    info.justification = settings.justify;
                    _this.customizer.addTextElement(null, info);
                    if (settings.isPath)
                        _this.customizer.convertSelectedTextItemsToTextOnPath();
                    else if (settings.isTextArea)
                        _this.customizer.convertSelectionToTextArea();
                    _this.initSyncForSelectedItem();
                    if (callback)
                        callback();
                    _this.triggerLayoutUpdate();
                });
            };
            // Text add
            Application.prototype.onAddText = function (settings) {
                this.addText(settings);
            };
            Application.prototype.onAddDefaulText = function (text) {
                this.onTextContentChanged(text);
            };
            Application.prototype.onUpdateText = function (settings) {
                this.onTextContentChanged(settings.text);
                this.onTextFontChanged(settings.font);
                this.onTextStyleChanged({ bold: settings.bold, italic: settings.italic, stretch: settings.stretch });
                this.onTextColorChanged(settings.color);
                if (settings.isPath)
                    this.customizer.convertSelectedTextItemsToTextOnPath();
                else if (settings.isTextArea)
                    this.customizer.convertSelectionToTextArea();
                else
                    this.customizer.convertSelectedTextOnPathItemsToText();
            };
            // Text add another
            Application.prototype.onAddAnotherText = function () {
                this.customizer.deselectAll();
                this.layoutManager.resetTextForm();
            };
            // Text path
            Application.prototype.onTextPathChanged = function (enabled) {
                if (enabled) {
                    this.customizer.convertSelectedTextItemsToTextOnPath();
                    $("#toolbox-content").find("#btn-toolbox-edit-text-area, #btn-toolbox-text-area").removeClass("active");
                }
                else {
                    this.customizer.convertSelectedTextOnPathItemsToText();
                }
            };
            Application.prototype.onTextAreaChanged = function (enabled) {
                if (enabled) {
                    this.customizer.convertSelectionToTextArea();
                    $("#toolbox-content").find("#btn-toolbox-edit-text-path, #btn-toolbox-text-path").removeClass("active");
                }
                else {
                    this.customizer.convertSelectionToText();
                }
            };
            // Text style
            Application.prototype.onTextStyleChanged = function (settings) {
                var items = this.customizer.getSelectedTextItems();
                var style = [];
                if (settings.italic)
                    style.push("italic");
                if (settings.bold != undefined) {
                    if (typeof settings.bold == "number")
                        style.push(settings.bold);
                    else if (settings.bold === true)
                        style.push("bold");
                }
                if (style.length == 0)
                    style.push("normal");
                if (items && items.length > 0) {
                    this.customizer.modifyTextElementsFontWeight(items, style.join(' '));
                    if (settings.stretch)
                        this.customizer.modifyTextElementsFontStretch(items, settings.stretch);
                    this.startFontUpdateInterval();
                }
            };
            // Text align
            Application.prototype.onTextAlignChanged = function (align) {
                var items = this.customizer.getSelectedTextItems();
                if (items && items.length > 0) {
                    this.customizer.modifyTextElementsJustification(items, align);
                }
            };
            // Text font
            Application.prototype.onTextFontChanged = function (fontName) {
                var _this = this;
                var items = this.customizer.getSelectedTextItems();
                if (items && items.length > 0 && fontName) {
                    this.loadFont(fontName, function () {
                        _this.changeFont(items, fontName);
                        var info = _this.customizer.getSelectedTextItemsInfo();
                        var font = Context.fonts.find(function (x) { return x.name == fontName; });
                        var currentStretch = font.stretches.find(function (x) { return info.fontStretch.indexOf(x.stretch) != -1; });
                        if (!currentStretch)
                            currentStretch = font.stretches[0];
                        // Must be after bold and italic
                        _this.layoutManager.selectStretch(currentStretch.stretch);
                    });
                }
                else {
                    if (fontName) {
                        // If no item selected select the first stretch
                        var font = Context.fonts.find(function (x) { return x.name == fontName; });
                        var info = this.layoutManager.getTextSettings();
                        if (!font.stretches.find(function (x) { return x.stretch == info.stretch; }))
                            this.layoutManager.selectStretch(font.stretches[0].stretch);
                    }
                }
            };
            // Text changed
            Application.prototype.onTextContentChanged = function (text) {
                var _this = this;
                // Callback
                var callback = function () {
                    // Trova il carattere su https://apps.timwhitlock.info/unicode/inspect/hex/xxxx inserendo il codice unicode e
                    // escludi il range dei caratteri, o se è composto da più di un carattere unicode, escludi il set di Surrogates
                    // ---
                    // After the regex, a normalization is done to convert some particular characters (primarly those that have a 
                    // Decomposition Mapping property) to their alphabetical correspective
                    var unicodeEmojiTrimmedText = text.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF](?:[\u200D\uFE0F][\uD800-\uDBFF][\uDC00-\uDFFF]){2,}|\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDD6-\uDDDF])\u200D[\u2640\u2642]\uFE0F|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])\uFE0F|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708]))\uFE0F|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83D\uDC69\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D(?:(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F|[\u2600-\u26FF]|(\uD83E[\uDD00-\uDDFF])/g, '');
                    unicodeEmojiTrimmedText = unicodeEmojiTrimmedText.normalize('NFKC');
                    var items = _this.customizer.getSelectedTextItems();
                    if (items && items.length > 0) {
                        var itemConstraints = _this.customizer.getItemConstraints(items[0]);
                        var minNrCharsItem = itemConstraints ? itemConstraints.get("minNrChars") : 0;
                        if (unicodeEmojiTrimmedText && unicodeEmojiTrimmedText != "") {
                            _this.customizer.modifyTextElementsContent(items, unicodeEmojiTrimmedText);
                        }
                        else if (_this.customizer.canDeleteSelection() && !(minNrCharsItem > 0)) {
                            _this.customizer.deleteSelection();
                            _this.customizer.onItemsRemoved(items);
                        }
                    }
                    else {
                        if (text && text != "") {
                            // When we add a new text it we be selected and this will fire
                            // the callback that will update the text form
                            // But if we typed other characted this will replace the input
                            // with the initial text (eg. "ZAK" => "ZAKEKE" will return to "ZAK")
                            _this.preventTextFormUpdate = true;
                            _this.addText($.extend(_this.layoutManager.getTextSettings(), { text: unicodeEmojiTrimmedText }), function () { return _this.preventTextFormUpdate = false; });
                        }
                    }
                };
                // If font is not loading (first time or already loaded) call it directly
                if (!this.isLoadingFont)
                    callback();
                else
                    this.textEditFontLoadCallback = callback;
            };
            // Text color 
            Application.prototype.onTextColorChanged = function (color) {
                if (this.preventItemUpdate)
                    return;
                var items = this.customizer.getSelectedTextItems();
                if (items && items.length > 0) {
                    this.customizer.modifyTextElementsFillColor(items, color);
                }
            };
            // Images
            //------------------------------------------------------------------------------------
            Application.prototype.loadImagesCategories = function () {
                var _this = this;
                var categories = new MPlaza.ImageMacroCategories();
                categories.fetch({
                    success: function (model, response, options) {
                        _this.layoutManager.fillImagesMacroCategories(model);
                    }
                });
            };
            Application.prototype.loadImagesGroups = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var res, imagesGroups, _i, imagesGroups_1, _a, name, products, images, _b, images_1, image;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, fetch(Zakeke.config.baseUrl + "Content/files/images_groups.json")];
                            case 1:
                                res = _c.sent();
                                if (!res.ok) return [3 /*break*/, 3];
                                return [4 /*yield*/, res.json()];
                            case 2:
                                imagesGroups = _c.sent();
                                // Get all images of every group that contain this product
                                for (_i = 0, imagesGroups_1 = imagesGroups; _i < imagesGroups_1.length; _i++) {
                                    _a = imagesGroups_1[_i], name = _a.name, products = _a.products, images = _a.images;
                                    if (products.indexOf(Context.modelId) != -1) {
                                        for (_b = 0, images_1 = images; _b < images_1.length; _b++) {
                                            image = images_1[_b];
                                            if (Context.availableImages.indexOf(image) == -1)
                                                Context.availableImages.push(image);
                                        }
                                    }
                                }
                                _c.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            Application.prototype.onImagesCategoriesFillRequest = function (settings) {
                this.layoutManager.fillImagesCategories(settings.macroCategory.get("categories"));
                settings.callback();
            };
            Application.prototype.onImagesFillRequest = function (settings) {
                var _this = this;
                var images = new MPlaza.Images();
                var data = {
                    type: "lib",
                    c: settings.category.id
                };
                this.layoutManager.toolboxLoading = true;
                images.fetch({
                    success: function (model, response, options) {
                        var filteredImages = Context.availableImages.length == 0 ? images.filter(function (x) { return x; }) : images.filter(function (x) { return Context.availableImages.indexOf(x.id) != -1; });
                        _this.layoutManager.fillImages(filteredImages);
                        settings.callback();
                    },
                    error: function (collection, response, options) {
                        Logger.info("errore nella lettura delle immagini");
                    },
                    complete: function () {
                        _this.layoutManager.toolboxLoading = false;
                    },
                    data: data
                });
            };
            Application.prototype.onImagesFacebookFillRequest = function (settings) {
                var _this = this;
                if (this.socialImagesLoading)
                    return;
                if (!this.facebookToken) {
                    FB.login(function (response) {
                        if (response.status === 'connected') {
                            _this.facebookToken = FB.getAuthResponse()["accessToken"];
                            getPhotos.call(_this);
                        }
                        else if (response.status === 'not_authorized') {
                            alert(T._("Please authorize the application", "Customizer") + "\n" + response.status);
                        }
                        else {
                            alert(T._("Facebook access canceled or failed.", "Customizer") + "\n" + response.status);
                        }
                    }, { scope: 'user_photos' });
                }
                else {
                    getPhotos.call(this);
                }
                function getPhotos() {
                    var _this = this;
                    if (settings.clear) {
                        this.socialImagesLoading = true;
                        FB.api("/me/photos", { type: "uploaded", fields: "images" }, function (response) {
                            if (!response || response.error) {
                                // Invalid token, clear it and reclick the button for login again
                                _this.facebookToken = "";
                                $("#btn-toolbox-import-facebook").click();
                            }
                            else {
                                fillImages.call(_this, response);
                            }
                        });
                    }
                    else if (this.facebookNextUrl) {
                        this.socialImagesLoading = true;
                        $.ajax({
                            url: this.facebookNextUrl,
                            method: "GET"
                        }).done(function (response) { return fillImages.call(_this, response); });
                    }
                }
                function fillImages(response) {
                    this.facebookNextUrl = response && response.paging && response.paging.next ? response.paging.next : null;
                    this.socialImagesLoading = false;
                    var images = [];
                    for (var i = 0; i < response.data.length; i++) {
                        var thumbnails = response.data[i].images;
                        images.push({ source: thumbnails[thumbnails.length - 1].source, id: response.data[i].id });
                    }
                    if (settings.continueCallback)
                        settings.continueCallback.call(this.layoutManager, images);
                }
            };
            Application.prototype.onImagesInstagramFillRequest = function (settings) {
                var _this = this;
                if (this.socialImagesLoading)
                    return;
                var clientID = InstagramAPIConfig.ClientID;
                if (!this.instagramToken) {
                    this.popupInstagram = openWindow("https://api.instagram.com/oauth/authorize/?client_id=" + InstagramAPIConfig.ClientID + "&redirect_uri=" + InstagramAPIConfig.RedirectURI + "&response_type=token", 'Instagram', 500, 400);
                    var interval = setInterval(function () {
                        var token = window.localStorage.getItem('InstagramToken');
                        if (token) {
                            window.localStorage.setItem('InstagramToken', null);
                            _this.instagramToken = token;
                            clearInterval(interval);
                            $("#btn-toolbox-import-instagram").click();
                        }
                    }, 2000);
                }
                else {
                    getPhotos.call(this);
                }
                function getPhotos() {
                    var _this = this;
                    var httpRequest = new XMLHttpRequest();
                    if (settings.clear) {
                        this.socialImagesLoading = true;
                        httpRequest.open("GET", 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + this.instagramToken);
                        httpRequest.onreadystatechange = function () {
                            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                                if (httpRequest.status === 200) {
                                    fillImages.call(_this, JSON.parse(httpRequest.response));
                                }
                                else {
                                    console.log("Error requesting url iframe. Status: " + httpRequest.status + " Response body: " + httpRequest.responseText);
                                }
                            }
                        };
                        httpRequest.send(null);
                    }
                    else if (this.instagramNextUrl) {
                        this.socialImagesLoading = true;
                        httpRequest.open("GET", this.instagramNextUrl);
                        httpRequest.onreadystatechange = function () {
                            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                                if (httpRequest.status === 200) {
                                    fillImages.call(_this, JSON.parse(httpRequest.response));
                                }
                                else {
                                    console.log("Error requesting url iframe. Status: " + httpRequest.status + " Response body: " + httpRequest.responseText);
                                }
                            }
                        };
                        httpRequest.send(null);
                    }
                }
                function fillImages(response) {
                    this.instagramNextUrl = response && response.pagination && response.pagination.next_url ? response.pagination.next_url : null;
                    this.socialImagesLoading = false;
                    var images = [];
                    for (var i = 0; i < response.data.length; i++) {
                        images.push({ source: response.data[i].images.thumbnail.url, id: response.data[i].id });
                    }
                    if (settings.continueCallback)
                        settings.continueCallback.call(this.layoutManager, images);
                }
            };
            // Image selected
            Application.prototype.onImageSelected = function (_image) {
                var _this = this;
                try {
                    var image = this.getImageCache(_image.id);
                    if (image) {
                        this.addImageToCanvas(image);
                    }
                    else {
                        this.layoutManager.modelLoading = true;
                        image = new MPlaza.Image({ imageID: _image.get("imageID") });
                        image.fetch({
                            success: function (model, response, options) {
                                if (model && model.get("imageID")) {
                                    _this.imagesCache.push(image);
                                    _this.addImageToCanvas(image);
                                }
                                else {
                                    Logger.info("Cannot read image:  " + model.get("message"));
                                }
                            },
                            error: function (model, response, options) {
                                Logger.error("Error loading image.", response);
                            },
                            complete: function () {
                                _this.layoutManager.modelLoading = false;
                            }
                        });
                    }
                }
                catch (e) {
                    Logger.info(e);
                }
            };
            Application.prototype.onImageFacebookSelected = function (id) {
                var _this = this;
                this.layoutManager.modelLoading = true;
                $.ajax({
                    url: Zakeke.config.baseApiUrl + "images/import/facebook",
                    data: {
                        id: id, accessToken: this.facebookToken
                    },
                    method: "POST"
                }).done(function (image) {
                    _this.onImageSelected(new MPlaza.Image(image));
                    _this.loadUserImages();
                }).always(function () {
                    _this.layoutManager.modelLoading = false;
                });
            };
            Application.prototype.onImageInstagramSelected = function (id) {
                var _this = this;
                this.layoutManager.modelLoading = true;
                $.ajax({
                    url: Zakeke.config.baseApiUrl + "images/import/instagram",
                    data: {
                        id: id, accessToken: this.instagramToken
                    },
                    method: "POST"
                }).done(function (image) {
                    _this.onImageSelected(new MPlaza.Image(image));
                    _this.loadUserImages();
                }).always(function () {
                    _this.layoutManager.modelLoading = false;
                });
            };
            // Image Converted Edit
            Application.prototype.onImageConvertedEdit = function (image) {
                return __awaiter(this, void 0, void 0, function () {
                    var self, urlSourceImage, request;
                    return __generator(this, function (_a) {
                        self = this;
                        if (image) {
                            urlSourceImage = image.get('sourceUrlImage');
                            request = new XMLHttpRequest();
                            request.open('GET', urlSourceImage, true);
                            request.responseType = 'blob';
                            request.onload = function () {
                                var reader = new FileReader();
                                reader.readAsDataURL(request.response);
                                reader.onloadend = function (e) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var fileBlob;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    self.layoutManager.toolboxLoading = true;
                                                    if (request.response.type.indexOf('postscript') !== -1) {
                                                        fileBlob = new File([new Blob([request.response])], "image.eps", { type: "application/postscript" });
                                                    }
                                                    else if (request.response.type.indexOf('pdf') !== -1) {
                                                        fileBlob = new File([new Blob([request.response])], "image.pdf", { type: "application/pdf" });
                                                    }
                                                    else {
                                                        fileBlob = new File([new Blob([request.response])], "image.png", { type: "image/png" });
                                                    }
                                                    if (!(fileBlob.name === 'image.png')) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, self.onUploadImageSelected({ file: fileBlob, imageToRemove: image, callback: null })];
                                                case 1:
                                                    _a.sent();
                                                    return [3 /*break*/, 4];
                                                case 2: return [4 /*yield*/, self.onUploadPdfSelected({ file: fileBlob, imageToRemove: image, callback: null })];
                                                case 3:
                                                    _a.sent();
                                                    _a.label = 4;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    });
                                };
                            };
                            request.send();
                        }
                        return [2 /*return*/];
                    });
                });
            };
            // Image deleted
            Application.prototype.onImageDeleted = function (image) {
                var _this = this;
                var currentImages = this.customizer.getAllItems().filter(function (x) { return x instanceof _this.customizer.paper.Raster; });
                var deletingImages = currentImages.filter(function (x) { return x.image.src == image.attributes.previewUrl; });
                if (deletingImages.length == 0) {
                    this.startImageDeleting(image);
                }
                else {
                    this.layoutManager.showQuestion(T._("Warning!", "Customizer"), T._("The image you are trying to remove is still present in the design. Confirming this message will remove the image from the design too.<p>Are you sure?</p>", "Customizer"), function (dialog) {
                        deletingImages.forEach(function (x) {
                            x.remove();
                            _this.customizer.onItemRemoved(x);
                        });
                        _this.startImageDeleting(image);
                        _this.layoutManager.closeDialog(dialog);
                    });
                }
            };
            Application.prototype.startImageDeleting = function (image) {
                var _this = this;
                image.destroy({
                    success: function (model, response, options) {
                        _this.loadUserImages();
                    },
                    error: function (model, response, options) {
                    },
                    wait: true
                });
            };
            // Upload image
            //------------------------------------------------------------------------------------
            Application.prototype.getVectorPermittedExtensions = function () {
                var addonPDF_EPS = this.layoutManager.activeAddons.find(function (addon) { return addon.AddonName == "PDF_EPS"; });
                var addonPDF = this.layoutManager.activeAddons.find(function (addon) { return addon.AddonName == "PDF"; });
                var addonEPS = this.layoutManager.activeAddons.find(function (addon) { return addon.AddonName == "EPS"; });
                var restrictions = this.getFileUploadRestrictions();
                if (restrictions.isPdfAllowed && restrictions.isEpsAllowed && addonPDF_EPS !== undefined) {
                    return ["pdf", "eps"];
                }
                else if (restrictions.isPdfAllowed && addonPDF !== undefined) {
                    return ["pdf"];
                }
                else if (restrictions.isEpsAllowed && addonEPS !== undefined) {
                    return ["eps"];
                }
            };
            Application.prototype.getRasterPermittedExtensions = function () {
                var restrictions = this.getFileUploadRestrictions();
                var extensions = [];
                if (restrictions.isJpgAllowed)
                    extensions.push("jpg", "jpeg");
                if (restrictions.isPngAllowed)
                    extensions.push("png");
                if (restrictions.isSvgAllowed)
                    extensions.push("svg");
                return extensions;
            };
            Application.prototype.onUploadImageSelected = function (settings) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var file, name, size, extension, permittedExtensions, printType, modelPrintType, pantoneColorsBackgroundRecolor, previewImage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                file = settings.file;
                                name = file["name"];
                                size = file.size;
                                extension = name.lastIndexOf(".") == -1 ? "" : name.substr(name.lastIndexOf(".") + 1).toLowerCase();
                                permittedExtensions = this.getRasterPermittedExtensions();
                                if (size > this.uploadImageSizeLimit) {
                                    this.layoutManager.resetUploadImageForm();
                                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("The file is too large. You can upload files up to {0} MB.", "Customizer").replace("{0}", (this.uploadImageSizeLimit / 1048576).toString()));
                                    return [2 /*return*/];
                                }
                                if (permittedExtensions.indexOf(extension) == -1) {
                                    this.layoutManager.resetUploadImageForm();
                                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("The file format is invalid. <br/> You can only upload images in these formsts: {0}.", "Customizer").replace("{0}", permittedExtensions.join(", ").toUpperCase()));
                                    return [2 /*return*/];
                                }
                                printType = this.getSelectedPrintType();
                                modelPrintType = this.model.get("printTypes").get(printType.id);
                                pantoneColorsBackgroundRecolor = this.getPrintTypeProperty(modelPrintType, "pantoneEnabled") && this.pantoneColors ? this.pantoneColors : null;
                                if (!(this.layoutManager.backgroundRecolorRule && (["png", "jpg", "jpeg", "svg"].indexOf(extension) != -1))) return [3 /*break*/, 4];
                                this.layoutManager.toolboxLoading = true;
                                previewImage = file;
                                if (!(extension.indexOf("svg") != -1)) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.getPreviewImageFromSvg(settings.file)];
                            case 1:
                                previewImage = _a.sent();
                                _a.label = 2;
                            case 2: return [4 /*yield*/, this.layoutManager.setUIForRecolorImageAddon(file, previewImage, function (fileToUpload, backgroundColorImage, colorImage, clientConvertedImage, selectedColors) {
                                    _this.layoutManager.selectToolboxPage(ToolboxItem.UploadImage);
                                    _this.uploadImage(fileToUpload, backgroundColorImage, colorImage, function (newImage) {
                                        _this.addImageToCanvas(newImage);
                                        // Remove Image
                                        if (settings.imageToRemove)
                                            _this.startImageDeleting(settings.imageToRemove);
                                    }, null, clientConvertedImage, selectedColors);
                                }, null, pantoneColorsBackgroundRecolor)];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                this.uploadImage(file, null, null, function (newImage) {
                                    _this.addImageToCanvas(newImage);
                                    // Remove Image
                                    if (settings.imageToRemove)
                                        _this.startImageDeleting(settings.imageToRemove);
                                });
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            };
            Application.prototype.onUploadPdfSelected = function (settings) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var file, name, size, extension, permittedExtensions, previewImage, printType, modelPrintType, pantoneColorsBackgroundRecolor;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                file = settings.file;
                                name = file["name"];
                                size = file.size;
                                extension = name.lastIndexOf(".") == -1 ? "" : name.substr(name.lastIndexOf(".") + 1).toLowerCase();
                                permittedExtensions = this.getVectorPermittedExtensions();
                                if (size > this.uploadImageSizeLimit) {
                                    this.layoutManager.resetUploadPdfForm();
                                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("The file is too large. You can load up to {0} MB.", "Customizer").replace("{0}", (this.uploadImageSizeLimit / 1048576).toString()));
                                    return [2 /*return*/];
                                }
                                if (permittedExtensions.indexOf(extension) == -1) {
                                    this.layoutManager.resetUploadPdfForm();
                                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("The file format is invalid. <br/> You can only upload images in these formsts: {0}.", "Customizer").replace("{0}", permittedExtensions.join(", ").toUpperCase()));
                                    return [2 /*return*/];
                                }
                                if (!this.layoutManager.backgroundRecolorRule) return [3 /*break*/, 2];
                                this.layoutManager.toolboxLoading = true;
                                return [4 /*yield*/, this.getPreviewImageFromEpsPdf(settings.file)];
                            case 1:
                                previewImage = _a.sent();
                                printType = this.getSelectedPrintType();
                                modelPrintType = this.model.get("printTypes").get(printType.id);
                                pantoneColorsBackgroundRecolor = this.getPrintTypeProperty(modelPrintType, "pantoneEnabled") && this.pantoneColors ? this.pantoneColors : null;
                                this.layoutManager.setUIForRecolorImageAddon(file, previewImage, function (fileToUpload, backgroundColorImage, colorImage, clientConvertedImage, selectedColors) {
                                    _this.layoutManager.selectToolboxPage(ToolboxItem.UploadImage);
                                    _this.uploadPdf(fileToUpload, backgroundColorImage, colorImage, function (newImage) {
                                        _this.addImageToCanvas(newImage);
                                        // Remove Image
                                        if (settings.imageToRemove)
                                            _this.startImageDeleting(settings.imageToRemove);
                                    }, null, clientConvertedImage, selectedColors);
                                }, null, pantoneColorsBackgroundRecolor);
                                return [3 /*break*/, 3];
                            case 2:
                                this.uploadPdf(file, null, null, function (newImage) {
                                    _this.addImageToCanvas(newImage);
                                    // Remove Image
                                    if (settings.imageToRemove)
                                        _this.startImageDeleting(settings.imageToRemove);
                                });
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            Application.prototype.onUploadImageFiltered = function (settings) {
                var _this = this;
                var file = settings.file;
                var name = file["name"];
                var size = file.size;
                var extension = name.lastIndexOf(".") == -1 ? "" : name.substr(name.lastIndexOf(".") + 1).toLowerCase();
                var permittedExtensions = this.getRasterPermittedExtensions();
                if (size > this.uploadImageSizeLimit) {
                    this.layoutManager.resetUploadImageForm();
                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("The file is too large. You can upload files up to {0} MB.", "Customizer").replace("{0}", (this.uploadImageSizeLimit / 1048576).toString()));
                    return;
                }
                if (permittedExtensions.indexOf(extension) == -1) {
                    this.layoutManager.resetUploadImageForm();
                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("The file format is invalid. <br/> You can only upload images in these formsts: {0}.", "Customizer").replace("{0}", permittedExtensions.join(", ").toUpperCase()));
                    return;
                }
                // Start upload
                this.uploadImage(file, null, null, function (newImage) {
                    var oldItem = _this.customizer.getSelectedItems()[0];
                    _this.addImageToCanvas(newImage, oldItem);
                    if (oldItem)
                        _this.customizer.setEditingItem(oldItem, false);
                }, true);
            };
            Application.prototype.onUploadPdfFiltered = function (settings) {
                var _this = this;
                var file = settings.file;
                var name = file["name"];
                var size = file.size;
                var extension = name.lastIndexOf(".") == -1 ? "" : name.substr(name.lastIndexOf(".") + 1).toLowerCase();
                var permittedExtensions = this.getVectorPermittedExtensions();
                if (size > this.uploadImageSizeLimit) {
                    this.layoutManager.resetUploadImageForm();
                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("The file is too large. You can load up to {0} MB.", "Customizer").replace("{0}", (this.uploadImageSizeLimit / 1048576).toString()));
                    return;
                }
                if (permittedExtensions.indexOf(extension) == -1) {
                    this.layoutManager.resetUploadImageForm();
                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("The file format is invalid. <br/> You can only upload images in these formsts: {0}.", "Customizer").replace("{0}", permittedExtensions.join(", ").toUpperCase()));
                    return;
                }
                // Start upload
                this.uploadImage(file, null, null, function (newImage) {
                    var oldItem = _this.customizer.getSelectedItems()[0];
                    _this.addImageToCanvas(newImage, oldItem);
                    if (oldItem)
                        _this.customizer.setEditingItem(oldItem, false);
                }, true);
            };
            Application.prototype.getBackgroundRecolorRule = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var rule, addonBackgroundRemove, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                rule = null;
                                addonBackgroundRemove = this.layoutManager.activeAddons.find(function (addon) { return addon.AddonName == "BACKGROUND_REMOVE"; });
                                if (!addonBackgroundRemove) return [3 /*break*/, 5];
                                return [4 /*yield*/, $.ajax({
                                        url: Zakeke.config.baseApiUrl + "getbackgroundrulefromprinttype",
                                        data: { 'printTypeID': this.design.get("printTypeID"), 'subscriptionAddonID': addonBackgroundRemove.SubscriptionAddonID },
                                        cache: false
                                    })];
                            case 1:
                                response = _a.sent();
                                if (response) {
                                    rule = new Customizer.BackgroundRule();
                                    rule.AutoBackgroundRemove = response.autoBackgroundRemove;
                                    rule.ColorList = response.colorList;
                                    rule.EnableMultiRecoloring = response.enableMultiRecoloring;
                                }
                                if (!!rule) return [3 /*break*/, 3];
                                return [4 /*yield*/, $.ajax({
                                        url: Zakeke.config.baseApiUrl + "getbackgroundrulefromproduct",
                                        data: { 'productID': this.model.id, 'subscriptionAddonID': addonBackgroundRemove.SubscriptionAddonID },
                                        cache: false
                                    })];
                            case 2:
                                response = _a.sent();
                                if (response) {
                                    rule = new Customizer.BackgroundRule();
                                    rule.AutoBackgroundRemove = response.autoBackgroundRemove;
                                    rule.ColorList = response.colorList;
                                    rule.EnableMultiRecoloring = response.enableMultiRecoloring;
                                }
                                _a.label = 3;
                            case 3:
                                if (!!rule) return [3 /*break*/, 5];
                                return [4 /*yield*/, $.ajax({
                                        url: Zakeke.config.baseApiUrl + "getbackgroundrulefromside",
                                        data: { 'productID': this.model.id, 'sideID': this.side.id, 'subscriptionAddonID': addonBackgroundRemove.SubscriptionAddonID },
                                        cache: false
                                    })];
                            case 4:
                                response = _a.sent();
                                if (response) {
                                    rule = new Customizer.BackgroundRule();
                                    rule.AutoBackgroundRemove = response.autoBackgroundRemove;
                                    rule.ColorList = response.colorList;
                                    rule.EnableMultiRecoloring = response.enableMultiRecoloring;
                                }
                                _a.label = 5;
                            case 5: return [2 /*return*/, rule];
                        }
                    });
                });
            };
            Application.prototype.getPreviewImageFromEpsPdf = function (image) {
                return __awaiter(this, void 0, void 0, function () {
                    var fd, blobImage, fr, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                fd = new FormData();
                                if (image instanceof File || image instanceof Blob)
                                    fd.append('file', image);
                                else {
                                    blobImage = BlobHelpers.b64toBlob(image, 'image/png');
                                    fr = new FileReader();
                                    fr.onloadend = function (e) {
                                        fd.append('file', fr.result);
                                    };
                                    fr.readAsBinaryString(blobImage);
                                }
                                return [4 /*yield*/, $.ajax({
                                        url: Zakeke.config.baseApiUrl + "images/convertepspdf",
                                        contentType: false,
                                        processData: false,
                                        dataType: "json",
                                        method: 'POST',
                                        data: fd,
                                        cache: false
                                    })];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, response];
                        }
                    });
                });
            };
            Application.prototype.getPreviewImageFromSvg = function (image) {
                return __awaiter(this, void 0, void 0, function () {
                    var fd, blobImage, fr, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                fd = new FormData();
                                if (image instanceof File || image instanceof Blob)
                                    fd.append('file', image);
                                else {
                                    blobImage = BlobHelpers.b64toBlob(image, 'image/png');
                                    fr = new FileReader();
                                    fr.onloadend = function (e) {
                                        fd.append('file', fr.result);
                                    };
                                    fr.readAsBinaryString(blobImage);
                                }
                                return [4 /*yield*/, $.ajax({
                                        url: Zakeke.config.baseApiUrl + "images/convertsvg",
                                        contentType: false,
                                        processData: false,
                                        dataType: "json",
                                        method: 'POST',
                                        data: fd,
                                        cache: false
                                    })];
                            case 1:
                                response = _a.sent();
                                return [2 /*return*/, response];
                        }
                    });
                });
            };
            Application.prototype.uploadImage = function (imageFile, hexBackgroundColor, hexColorImage, callback, isFilterApplied, imageClientConvertedFile, selectedColors) {
                var _this = this;
                if (isFilterApplied === void 0) { isFilterApplied = false; }
                if (selectedColors === void 0) { selectedColors = null; }
                var data = new FormData();
                data.append("image", imageFile);
                if (hexBackgroundColor)
                    data.append("backgroundcolor", hexBackgroundColor);
                if (hexColorImage)
                    data.append("color", hexColorImage);
                if (imageClientConvertedFile)
                    data.append("clientConvertedImage", imageClientConvertedFile);
                if (selectedColors)
                    data.append("selectedColors", selectedColors);
                data.append("isPdfWithRasterAllowed", this.getFileUploadRestrictions().isPdfWithRasterAllowed.toString().toLowerCase());
                // Codice originale *****************************************************
                $.ajax({
                    url: Zakeke.config.baseApiUrl + "images/upload",
                    data: data,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    method: "POST",
                    headers: {
                        "isFilterApplied": isFilterApplied
                    },
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) {
                            myXhr.upload.addEventListener("progress", function (e) {
                                if (e.lengthComputable) {
                                    var max = e.total;
                                    var current = e.loaded;
                                    var perc = (current * 100) / max;
                                    _this.layoutManager.uploadImageProgress = perc;
                                }
                            });
                        }
                        return myXhr;
                    },
                }).done(function (response) {
                    var image = new MPlaza.Image(response[0]);
                    _this.imagesCache.push(image);
                    if (callback)
                        callback(image);
                    _this.loadUserImages();
                }).fail(function () {
                    _this.layoutManager.showError(T._("Error", "Customizer"), T._("There was an error while uploading your image. Try again", "Customizer"));
                }).always(function () {
                    _this.layoutManager.resetUploadImageForm();
                });
            };
            Application.prototype.uploadPdf = function (imageFile, hexBackgroundColor, hexColorImage, callback, isFilterApplied, imageClientConvertedFile, selectedColors) {
                var _this = this;
                if (isFilterApplied === void 0) { isFilterApplied = false; }
                if (selectedColors === void 0) { selectedColors = null; }
                var data = new FormData();
                data.append("image", imageFile);
                if (hexBackgroundColor)
                    data.append("backgroundcolor", hexBackgroundColor);
                if (hexColorImage)
                    data.append("color", hexColorImage);
                if (imageClientConvertedFile)
                    data.append("clientConvertedImage", imageClientConvertedFile);
                if (selectedColors)
                    data.append("selectedColors", selectedColors);
                data.append("isPdfWithRasterAllowed", this.getFileUploadRestrictions().isPdfWithRasterAllowed.toString().toLowerCase());
                $.ajax({
                    url: Zakeke.config.baseApiUrl + "images/upload",
                    data: data,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    method: "POST",
                    headers: {
                        "isFilterApplied": isFilterApplied
                    },
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) {
                            myXhr.upload.addEventListener("progress", function (e) {
                                if (e.lengthComputable) {
                                    var max = e.total;
                                    var current = e.loaded;
                                    var perc = (current * 100) / max;
                                    _this.layoutManager.uploadPdfProgress = perc;
                                }
                            });
                        }
                        return myXhr;
                    },
                }).done(function (response) {
                    var image = new MPlaza.Image(response[0]);
                    _this.imagesCache.push(image);
                    if (callback)
                        callback(image);
                    _this.loadUserImages();
                }).fail(function (response) {
                    if (response.status == 406)
                        _this.layoutManager.showError(T._("Warning", "Customizer"), T._("You can only upload PDF without raster images inside", "Customizer"));
                    else
                        _this.layoutManager.showError(T._("Error", "Customizer"), T._("There was an error while uploading or convert your PDF. Try again", "Customizer"));
                }).always(function () {
                    _this.layoutManager.resetUploadPdfForm();
                    //this.layoutManager.uploadOptions.hasClass('opened') ? this.layoutManager.uploadOptions.removeClass('opened') : this.layoutManager.uploadOptions.addClass('opened');
                });
            };
            Application.prototype.resizeImage = function (file, maxWidth, maxHeight) {
                return new Promise(function (resolve, reject) {
                    var image = new Image();
                    image.src = URL.createObjectURL(file);
                    image.onload = function () {
                        var width = image.width;
                        var height = image.height;
                        if (width <= maxWidth && height <= maxHeight) {
                            resolve(file);
                        }
                        var newWidth;
                        var newHeight;
                        if (width > height) {
                            newHeight = height * (maxWidth / width);
                            newWidth = maxWidth;
                        }
                        else {
                            newWidth = width * (maxHeight / height);
                            newHeight = maxHeight;
                        }
                        var canvas = document.createElement('canvas');
                        canvas.width = newWidth;
                        canvas.height = newHeight;
                        var context = canvas.getContext('2d');
                        context.drawImage(image, 0, 0, newWidth, newHeight);
                        canvas.toBlob(resolve, file.type);
                    };
                    image.onerror = reject;
                });
            };
            // Templates
            //------------------------------------------------------------------------------------
            Application.prototype.onTemplateSelected = function (settings) {
                this.loadDesign(settings.template.designID, true);
                // Re-select the side
                //this.layoutManager.selectSide(this.side ? (this.color.get("sides").get(this.side.id) ? this.color.get("sides").get(this.side.id) : this.color.get("sides").at(0)) : this.color.get("sides").toArray().find(x => { return Context.productSides.indexOf(x.get("code")) != -1 }) || this.color.get("sides").at(0));
            };
            Application.prototype.onTemplateSyncChange = function (enabled) {
                if (!this.design || !Context.isTemplateEditor)
                    return;
                if (!enabled)
                    this.design.get("designItems").each(function (item) { return item.set("syncGuid", null); });
                if (Context.isTemplateEditor)
                    this.layoutManager.setElementSyncedRowVisibility(enabled);
            };
            Application.prototype.onElementConstraintUpdateRequested = function () {
                if (Context.isTemplateEditor) {
                    var items = this.customizer.getSelectedItems();
                    if (!items || items.length < 1)
                        return;
                    var designItem = this.customizer.findDesignItemForItem(items[0]);
                    var constraints = designItem.get("constraints") || this.defaultDesignConstraints;
                    Object.assign(constraints, { syncGuid: designItem.get("syncGuid") });
                    this.preventElementConstraintsApply = true;
                    this.layoutManager.setElementRestrictions((items[0] instanceof this.customizer.paper.Raster) ? (designItem.attributes.imageFormat == "Svg" ? "svg" : "image") : "text", constraints || this.defaultDesignConstraints);
                    this.preventElementConstraintsApply = false;
                }
            };
            Application.prototype.onElementConstraintChanged = function (constraints) {
                if (this.preventElementConstraintsApply)
                    return;
                var items = this.customizer.getSelectedItems();
                if (items && items.length > 0) {
                    var item = items[0];
                    var designItem = this.customizer.findDesignItemForItem(item);
                    var designItemConstraints = designItem.get("constraints");
                    if (!designItemConstraints) {
                        designItemConstraints = new MPlaza.DesignItemConstraints();
                        designItem.set("constraints", designItemConstraints);
                    }
                    if (!designItemConstraints.get("isAlwaysOnTop") && constraints.isAlwaysOnTop)
                        this.customizer.bringSelectionToFront();
                    if (constraints.isSynced && !designItem.get("syncGuid"))
                        this.initSyncForDesignItem(designItem);
                    else if (!constraints.isSynced)
                        designItem.set("syncGuid", null);
                    designItemConstraints.set("canEdit", item instanceof this.customizer.paper.Raster ? constraints.canEditImage : constraints.canEditText);
                    designItemConstraints.set("canMove", constraints.canMove);
                    designItemConstraints.set("canRotate", constraints.canRotate);
                    designItemConstraints.set("canResize", constraints.canResize);
                    designItemConstraints.set("canDelete", constraints.canDelete);
                    designItemConstraints.set("canChangeFontFamily", constraints.canChangeFontFamily);
                    designItemConstraints.set("canChangeFontColor", constraints.canChangeFontColor);
                    designItemConstraints.set("canChangeFontWeight", constraints.canChangeFontWeight);
                    designItemConstraints.set("canChangeTextPathMode", constraints.canChangeTextPathMode);
                    designItemConstraints.set("minNrChars", constraints.minChars);
                    designItemConstraints.set("maxNrChars", constraints.maxChars);
                    designItemConstraints.set("paddingString", constraints.paddingString);
                    designItemConstraints.set("paddingTypeID", constraints.paddingTypeID);
                    designItemConstraints.set("canTransform", constraints.canTransform);
                    designItemConstraints.set("canChangeSvgColors", constraints.canChangeSvgColors);
                    designItemConstraints.set("isAlwaysOnTop", constraints.isAlwaysOnTop);
                    designItemConstraints.set("isPrintable", constraints.isPrintable);
                    designItemConstraints.set("mandatoryToEdit", constraints.mandatoryToEdit);
                    designItemConstraints.set("canSyncContent", constraints.canSyncContent);
                    designItemConstraints.set("canSyncAlignment", constraints.canSyncAlignment);
                    designItemConstraints.set("canSyncFontFamily", constraints.canSyncFontFamily);
                    designItemConstraints.set("canSyncFontStyle", constraints.canSyncFontStyle);
                    designItemConstraints.set("canSyncFontColor", constraints.canSyncFontColor);
                    designItemConstraints.set("canSyncCurved", constraints.canSyncCurved);
                    designItemConstraints.set("canSyncTransforms", constraints.canSyncTransforms);
                    this.customizer.updateAlwaysOnTopItemsIndexes();
                }
            };
            // Template Duplicate
            //------------------------------------------------------------------------------------
            Application.prototype.onUpdateDuplicateTemplate = function (nextPage) {
                var this_ = this.templateDuplication;
                if (nextPage && (this_.isLoading || (this_.isFinalPage && this_.currentPage > 1) || this_.noProductsConfiguredCache))
                    return;
                if (this_.isClosed) {
                    this.resetDuplicateTemplateValues();
                    this_.isClosed = false;
                }
                if (!nextPage) {
                    this_.productsList.empty();
                    this_.currentPage = 1;
                    this_.productsListRoot.scrollTop(0);
                    this_.productsListRoot.perfectScrollbar('update');
                }
                if (this_.currentPage == 1)
                    this_.isFinalPage = false;
                this_.isLoading = true;
                this_.loadingProductsDiv.show();
                var nameFilter = $("#duplicate-txt-product-search").val();
                $.get((Zakeke.config.baseApiUrl + "models"), {
                    ps: this_.pageSize,
                    pn: this_.currentPage,
                    f: (nameFilter !== "") ? nameFilter : null //Filter
                }).done(function (products, textStatus, request) {
                    if (products.length == 0 && this_.currentPage == 1) {
                        if (nameFilter === "") {
                            this_.noProductsConfiguredCache = true;
                            this_.productsList.hide();
                            $("#no-product-configured").show();
                        }
                        else {
                            $("#no-products-found").show();
                        }
                    }
                    if (products.length < this_.pageSize)
                        this_.isFinalPage = true;
                    //Add products
                    ////Exclude the actual product from the list to prevent exceptions
                    //products = products.filter(x => x.code != this.model.get("code"));
                    $.each(products, function (i, p) {
                        var product = $("<li class='product'>" +
                            "<div class='details'>" +
                            "<div class='image-container'>" +
                            "</div>" +
                            "<strong class='tooltip' title='" + p.name + "'>" + p.name + "</strong>" +
                            "<span>" + p.code + "</span>" +
                            "</div>" +
                            "</li>");
                        var img = new Image();
                        img.onload = function () {
                            product.addClass("loaded");
                        };
                        img.onerror = function () {
                            img.src = "/images/other/no_image.jpg";
                        };
                        img.src = p.smallImageUrl ? p.smallImageUrl : "/images/other/no_image.jpg";
                        product.find(".image-container").append(img);
                        product.data("product", p);
                        this_.productsList.append(product);
                        product.on("click", function () { product.find(".details").toggleClass("selected"); });
                    });
                    $("#tab-info").perfectScrollbar("update");
                    this_.currentPage++;
                    //---------------------------------
                }).fail(function (response) {
                    Zakeke.showError("Error loading products", "Admin");
                    Logger.error(response);
                }).always(function () {
                    this_.isLoading = false;
                    this_.loadingProductsDiv.hide();
                });
            };
            Application.prototype.onDuplicateTemplate = function () {
                var _this = this;
                if (this.isSandbox && !this.forceAdminSave) {
                    this.onDuplicateTemplateClose();
                    this.layoutManager.showError(T._("Warning!", "Customizer"), T._("This is a demo. To save this template try Zakeke.", "Customizer"));
                    return;
                }
                var this_ = this.templateDuplication;
                var selectedProducts = this_.productsList.find(".product").toArray().filter(function (x) { return $(x).find(".selected").length > 0; }).map(function (x) { return $(x).data("product"); });
                if (selectedProducts.length == 0)
                    return;
                $("#dlg-duplicate").find(".modal-footer > button").addClass("isLoading");
                this.onSave(function (templateID, sourceID) {
                    $.post((Zakeke.config.baseApiUrl + "duplicateTemplate"), {
                        sourceProductID: sourceID,
                        destProducts: selectedProducts.map(function (product) { return product.modelID; }).toString(),
                        templateID: templateID
                    }).done(function () {
                        _this.layoutManager.showSuccess(T._("Success", "Customizer"), T._("Template duplicated successfully", "Customizer"));
                    }).fail(function (xhr, textStatus) {
                        _this.layoutManager.showError(T._("Warning!", "Customizer"), T._("You can copy a template only on products with same print areas and sides. Please duplicate a product first and then apply this template.", "Customizer"));
                    }).always(function () {
                        _this.onDuplicateTemplateClose();
                        $("#dlg-duplicate").find(".modal-footer > button").removeClass("isLoading");
                    });
                });
            };
            Application.prototype.onDuplicateTemplateClose = function () {
                this.resetDuplicateTemplateValues();
                this.templateDuplication.isClosed = true;
                $("#dlg-duplicate").dialog("hide");
            };
            Application.prototype.resetDuplicateTemplateValues = function () {
                this.templateDuplication.productsList.empty();
                this.templateDuplication.currentPage = 1;
                this.templateDuplication.isLoading = false;
                this.templateDuplication.isFinalPage = false;
                this.templateDuplication.noProductsConfiguredCache = false;
            };
            // Print types
            //------------------------------------------------------------------------------------
            Application.prototype.onPrintTypeSelected = function (settings) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var printType, modelPrintType, isModelPrintType, backboneFonts, backboneFontsIds, defaultFontID, fonts, supportMulticolors, disableTextColor, canAddText, textColors, useImagesFixedSize, multicolorItems, textItemsWrongFont, textItemsWrongColor, textItemsWrong, imageItemsWrongSize, tempCanvas, newPaper, allDesignItems, items, availableFontsNames, _i, items_1, item, fillColor, _a, items_2, item, _b, items_3, item, ppmm, cleanItems, confirmChangesCallback_1, questionDialog, _c;
                    return __generator(this, function (_d) {
                        if (this.design && settings.side) {
                            this.customizer.deselectAll();
                            printType = settings.side.get("printTypes").getPrintType(settings.printTypeId);
                            modelPrintType = this.model.get("printTypes").get(settings.printTypeId);
                            if (!printType)
                                printType = modelPrintType;
                            isModelPrintType = printType instanceof MPlaza.PrintType;
                            backboneFonts = [];
                            if (!isModelPrintType)
                                backboneFonts = this.getPrintTypeProperty(printType, "useCustomFonts") ? this.getPrintTypeProperty(printType, "fonts") : [];
                            if (!backboneFonts || backboneFonts.length < 1)
                                backboneFonts = this.getPrintTypeProperty(modelPrintType, "useCustomFonts") ?
                                    modelPrintType.get("modelPrintTypeFonts") :
                                    modelPrintType.get("printTypeFonts");
                            backboneFontsIds = backboneFonts.map(function (x) {
                                return x.get("fontFamilyID");
                            });
                            defaultFontID = null;
                            if (!isModelPrintType && this.getPrintTypeProperty(printType, "useCustomFonts"))
                                defaultFontID = this.getPrintTypeProperty(printType, "defaultFontFamilyID");
                            else
                                defaultFontID = this.getPrintTypeProperty(modelPrintType, "useCustomFonts") ?
                                    modelPrintType.get("modelPrintTypeDefaultFontFamilyID") :
                                    modelPrintType.get("printTypeDefaultFontFamilyID");
                            fonts = Context.fonts;
                            if (backboneFonts.length > 0) {
                                fonts = Context.fonts.filter(function (font) {
                                    return backboneFontsIds.indexOf(font.id) != -1;
                                });
                            }
                            supportMulticolors = this.printTypeSupportMulticolor(settings.printTypeId);
                            disableTextColor = this.getPrintTypeProperty(printType, "disableTextColors");
                            canAddText = this.getPrintTypeProperty(printType, "canAddText");
                            textColors = this.getPrintTypeProperty(printType, "textColors");
                            useImagesFixedSize = this.getPrintTypeProperty(printType, "useImagesFixedSize");
                            multicolorItems = [];
                            textItemsWrongFont = [];
                            textItemsWrongColor = [];
                            textItemsWrong = [];
                            imageItemsWrongSize = [];
                            tempCanvas = document.createElement("canvas");
                            newPaper = new paper.PaperScope();
                            newPaper.setup(tempCanvas);
                            allDesignItems = this.design.get("designItems").filter(function (item) { return settings.side ? item.isOnSide(settings.side) : true; });
                            items = this.side.id == settings.side.id ?
                                this.customizer.getAllItems() :
                                allDesignItems.map(function (x) { return newPaper.project.activeLayer.importJSON(x.get("json")); });
                            availableFontsNames = fonts.map(function (font) {
                                return font.name;
                            });
                            allDesignItems.forEach(function (designItem) {
                                if (designItem.get("imageIsMulticolor")) {
                                    multicolorItems.push(designItem);
                                    return false;
                                }
                            });
                            // Check text colors
                            if (disableTextColor == true) {
                                for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                                    item = items_1[_i];
                                    if (item instanceof this.customizer.paper.TextItem || (item.data && item.data.isTextOnPath)) {
                                        fillColor = item.fillColor;
                                        if (fillColor instanceof this.customizer.paper.Color)
                                            fillColor = fillColor.toCSS(true);
                                        if (!textColors.find(function (x) { return x.colorCode == fillColor; }))
                                            textItemsWrongColor.push(item);
                                    }
                                }
                            }
                            //Check text presence
                            if (canAddText == false) {
                                for (_a = 0, items_2 = items; _a < items_2.length; _a++) {
                                    item = items_2[_a];
                                    if (item instanceof this.customizer.paper.TextItem) {
                                        textItemsWrong.push(item);
                                    }
                                }
                            }
                            else {
                                for (_b = 0, items_3 = items; _b < items_3.length; _b++) {
                                    item = items_3[_b];
                                    if (item instanceof this.customizer.paper.TextItem) {
                                        if (availableFontsNames.indexOf(item.fontFamily.replace(/"/g, "")) == -1)
                                            textItemsWrongFont.push(item);
                                    }
                                }
                            }
                            // Check images size when use fixed image size is enabled
                            if (useImagesFixedSize == true) {
                                ppmm = settings.side.get("ppcm") / 10;
                                allDesignItems.forEach(function (designItem) {
                                    var preferredWidth = designItem.get("imagePreferredWidth");
                                    var preferredHeight = designItem.get("imagePreferredHeight");
                                    if (preferredWidth || preferredHeight) {
                                        // reset the rotation for checking the real dimensions and not only the bounds
                                        var item = _this.side.id == settings.side.id ?
                                            _this.customizer.findItemForDesignItem(designItem) :
                                            items.find(function (x) { return x.data.guid == designItem.get("itemGuid"); });
                                        if (item) {
                                            var oldRotation = item.rotation;
                                            item.rotation = 0;
                                            if (item.bounds.width > preferredWidth * ppmm || item.bounds.height > preferredHeight * ppmm)
                                                imageItemsWrongSize.push({ item: item, preferredWidth: preferredWidth * ppmm, preferredHeight: preferredHeight * ppmm });
                                            item.rotation = oldRotation;
                                        }
                                    }
                                });
                            }
                            cleanItems = function () {
                                items.forEach(function (item) {
                                    var designItem = _this.design.get("designItems").getDesignItemByGuid(item.data.guid);
                                    item.visible = true;
                                    if (designItem) {
                                        designItem.set("json", item.exportJSON({ asString: true }));
                                        if (item instanceof _this.customizer.paper.Raster)
                                            designItem.set("svg", item.exportSVG({ asString: true, embedImages: false }));
                                        else
                                            designItem.set("svg", item.exportSVG({ asString: true }));
                                    }
                                });
                                tempCanvas.remove();
                            };
                            confirmChangesCallback_1 = function (dialog) {
                                if (supportMulticolors == false) {
                                    var itemsToBeRemoved_1 = [];
                                    multicolorItems.forEach(function (designItem) {
                                        if (_this.side.id == settings.side.id) {
                                            var item = _this.customizer.findItemForDesignItem(designItem);
                                            item.remove();
                                            _this.customizer.onItemRemoved(item);
                                        }
                                        else {
                                            itemsToBeRemoved_1.push(item);
                                        }
                                        itemsToBeRemoved_1.forEach(function (x) { return _this.design.get("designItems").remove(_this.design.get("designItems").getDesignItemByGuid(x.data.guid)); });
                                        if (settings.callback)
                                            settings.callback();
                                    });
                                }
                                if (disableTextColor == true)
                                    for (var _i = 0, textItemsWrongColor_1 = textItemsWrongColor; _i < textItemsWrongColor_1.length; _i++) {
                                        var item = textItemsWrongColor_1[_i];
                                        item.fillColor = textColors.find(function (x) { return x.isDefault; }).colorCode;
                                        if (_this.side.id == settings.side.id)
                                            _this.customizer.onItemUpdated(item);
                                    }
                                if (useImagesFixedSize == true)
                                    // item {item, preferredWidth, preferredHeight}
                                    for (var _a = 0, imageItemsWrongSize_1 = imageItemsWrongSize; _a < imageItemsWrongSize_1.length; _a++) {
                                        var item = imageItemsWrongSize_1[_a];
                                        var oldRotation = item.item.rotation;
                                        item.item.rotation = 0;
                                        var sx = item.preferredWidth / item.item.bounds.width;
                                        var sy = item.preferredHeight / item.item.bounds.height;
                                        item.item.scale(sx, sy);
                                        item.item.rotation = oldRotation;
                                        if (_this.side.id == settings.side.id)
                                            _this.customizer.onItemUpdated(item.item);
                                    }
                                if (canAddText == false) {
                                    for (var _b = 0, textItemsWrong_1 = textItemsWrong; _b < textItemsWrong_1.length; _b++) {
                                        var textItem = textItemsWrong_1[_b];
                                        if (_this.side.id == settings.side.id) {
                                            textItem.remove();
                                            _this.customizer.onItemRemoved(textItem);
                                        }
                                        else {
                                            _this.design.get("designItems").remove(_this.design.get("designItems").getDesignItemByGuid(textItem.data.guid));
                                        }
                                    }
                                }
                                else {
                                    // Fix text items with fonts not available in this print type
                                    // change it to the default font
                                    if (_this.side.id == settings.side.id) {
                                        var defaultFont = defaultFontID ? fonts.find(function (x) { return x.id == defaultFontID; }).name : fonts[0].name;
                                        _this.loadFont(defaultFont, function () {
                                            for (var _i = 0, textItemsWrongFont_1 = textItemsWrongFont; _i < textItemsWrongFont_1.length; _i++) {
                                                var textItem = textItemsWrongFont_1[_i];
                                                _this.customizer.modifyTextElementFontFamily(textItem, defaultFont);
                                            }
                                            // Repeat deselect here because load font is async
                                            _this.customizer.deselectAll();
                                        });
                                    }
                                }
                                if (dialog)
                                    _this.layoutManager.closeDialog(dialog);
                                _this.customizer.deselectAll();
                                if (_this.side.id == settings.side.id)
                                    _this.setPrintType(settings, printType, modelPrintType, fonts, defaultFontID);
                                else
                                    cleanItems();
                            };
                            // Check if this new print type support multi color
                            if ((supportMulticolors == false && multicolorItems.length > 0) ||
                                (disableTextColor == true && textItemsWrongColor.length > 0) ||
                                (canAddText == false && textItemsWrong.length > 0) ||
                                (canAddText == true && textItemsWrongFont.length > 0) ||
                                (useImagesFixedSize == true && imageItemsWrongSize.length > 0)) {
                                if (!this.preventPrintTypeChecksWarning) {
                                    questionDialog = this.layoutManager.showDialog(T._("Warning!", "Customizer"), T._("This type of printing does not support some features. Proceeding some items may be removed or modified. Continue?", "Customizer"), "dialog_warning", (_c = {},
                                        _c[T._("YES", "Customizer")] = function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                confirmChangesCallback_1(dialog);
                                                return [2 /*return*/];
                                            });
                                        }); },
                                        _c[T._("NO", "Customizer")] = function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                if (this.side.id != settings.side.id)
                                                    cleanItems();
                                                this.layoutManager.resetPrintTypeSelection(settings.side, settings.previousValue);
                                                this.layoutManager.closeDialog(dialog);
                                                return [2 /*return*/];
                                            });
                                        }); },
                                        _c));
                                    questionDialog.find(".btn-dlg-close").on("click", function () {
                                        if (_this.side.id != settings.side.id)
                                            cleanItems();
                                        _this.layoutManager.resetPrintTypeSelection(settings.side, settings.previousValue);
                                    });
                                }
                                else {
                                    confirmChangesCallback_1(null);
                                }
                            }
                            else {
                                if (this.side.id == settings.side.id)
                                    this.setPrintType(settings, printType, modelPrintType, fonts, defaultFontID);
                                // Deselect all anyway
                                this.customizer.deselectAll();
                                if (settings.callback)
                                    settings.callback();
                            }
                        }
                        return [2 /*return*/];
                    });
                });
            };
            Application.prototype.setPrintType = function (settings, printType, modelPrintType, fonts, defaultFontID) {
                return __awaiter(this, void 0, void 0, function () {
                    var sidePrintType, designSidePrintType, newSidePrint, textColors, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // After the auto select of print type, is an human selection
                                if (this.design.get("printTypeID") && this.design.get("printTypeID") > 0)
                                    this.printTypeChosen = true;
                                this.design.setPrintType(modelPrintType);
                                sidePrintType = settings.side.get("printTypes").getPrintType(printType.id);
                                designSidePrintType = this.design.get("sidesPrintTypes").find(function (print) {
                                    return print.get("modelID") == settings.side.getModelID() &&
                                        print.get("colorID") == settings.side.getColorID() &&
                                        print.get("sideID") == settings.side.getSideID();
                                });
                                if (!sidePrintType || (sidePrintType && sidePrintType.get("isEnabled"))) {
                                    if (designSidePrintType) {
                                        designSidePrintType.set("printTypeID", printType.id);
                                    }
                                    else {
                                        newSidePrint = new MPlaza.DesignSidePrintType({
                                            modelID: settings.side.getModelID(),
                                            colorID: settings.side.getColorID(),
                                            sideID: settings.side.getSideID(),
                                            printTypeID: printType.id
                                        });
                                        this.design.get("sidesPrintTypes").add(newSidePrint);
                                    }
                                }
                                else if (designSidePrintType) {
                                    this.design.get("sidesPrintTypes").remove(designSidePrintType);
                                }
                                // Set pantone colorpickers for customizer if it is enabled on print type
                                if (this.getPrintTypeProperty(modelPrintType, "pantoneEnabled") && this.pantoneColors) {
                                    this.layoutManager.enablePantoneColorPickerForText(this.pantoneColors);
                                }
                                textColors = this.getPrintTypeProperty(printType, "disableTextColors") ? this.getPrintTypeProperty(printType, "textColors") : this.defaultTextColorsList.map(function (x, i) {
                                    return {
                                        colorCode: x,
                                        isDefault: i == 14
                                    };
                                });
                                // If Pantone has been enabled, set as default text color the first of pantone color list
                                if (!this.getPrintTypeProperty(printType, "disableTextColors") && (this.getPrintTypeProperty(modelPrintType, "pantoneEnabled") && this.pantoneColors)) {
                                    textColors = this.pantoneColors.map(function (x, i) {
                                        return {
                                            colorCode: x.rgbhexcode,
                                            isDefault: i == 0
                                        };
                                    });
                                }
                                this.layoutManager.setTextColors(textColors);
                                this.layoutManager.setTextColorPickerEnabled(!this.getPrintTypeProperty(printType, "disableTextColors"));
                                if (!Context.isTemplateEditor) {
                                    this.layoutManager.setTextColorEnabled(textColors.length > 1);
                                    this.layoutManager.setTextColorPickerEnabled(!this.getPrintTypeProperty(printType, "disableTextColors"), (this.getPrintTypeProperty(modelPrintType, "pantoneEnabled") && this.pantoneColors != null), textColors);
                                    this.layoutManager.setCanAddText(this.getPrintTypeProperty(printType, "canAddText"));
                                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Text, this.getPrintTypeProperty(printType, "canAddText"));
                                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.UploadImage, !this.getPrintTypeProperty(printType, "disableUserImages"));
                                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.ImagesMacroCategories, !this.getPrintTypeProperty(printType, "disableSellerImages"));
                                }
                                this.triggerLayoutUpdate();
                                // Update fonts
                                this.layoutManager.fillFonts(fonts);
                                // Select default font
                                this.layoutManager.selectFont(defaultFontID ? fonts.find(function (x) { return x.id == defaultFontID; }).name : fonts[0].name);
                                // Re-apply template editor functions
                                this.applyTemplateEditorFunctions();
                                // Get Background color rule for product (if related add-on is activated)
                                _a = this.layoutManager;
                                return [4 /*yield*/, this.getBackgroundRecolorRule()];
                            case 1:
                                // Get Background color rule for product (if related add-on is activated)
                                _a.backgroundRecolorRule = _b.sent();
                                if (settings.callback)
                                    settings.callback();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            ;
            // Other
            //------------------------------------------------------------------------------------
            // PhotoEditorSDK called
            Application.prototype.onPhotoEditorSDKOpening = function (settings) {
                var _this = this;
                if (!this.photoEditorLanguageFile || !this.photoEditorLanguageFileBase) {
                    return;
                }
                var imageName = settings.imageUrl.slice(settings.imageUrl.lastIndexOf("/") + 1);
                if (!/\.(jpg|png|jpeg)$/.test(settings.imageUrl.toLowerCase()))
                    imageName += "." + settings.imageData.attributes.format.toLowerCase();
                photoStart(new PhotoEditorSettings({
                    imgUrl: settings.imageUrl,
                    onExport: function (blob) {
                        _this.onUploadImageFiltered({ file: blobToFile(blob, imageName), callback: null });
                    },
                    onImmediateExport: function () { _this.customizer.setEditingItem(_this.customizer.getSelectedItems()[0], true); },
                    allFeaturesAvailable: this.isImageFilterAvailable,
                    baseLanguageFile: this.photoEditorLanguageFileBase,
                    currentLanguageFile: this.photoEditorLanguageFile,
                    currentLanguage: Context.culture.substring(0, 2),
                    isMobile: this.isMobile,
                    onLoad: function () { $(".pesdk-CanvasHeaderButtonComponent-12r6rxb").first().addClass("btn"); }
                }));
            };
            // Design changed (already debounced)
            Application.prototype.onDesignChanged = function () {
                var _this = this;
                this.merchantIntegration.notifyDesignChange(this.design, this.model, this.color, Context.quantity);
                if (this.preview3dEnabled && !this.isMobile)
                    this.update3dPreview();
                var hasAboveLimitAreas = this.customizer.areasSizeCountCollection.some(function (area) { return area.sizeCount > _this.designSizeLimit; });
                var hasDPIWarnings = this.customizer.getAllImageItems().some(function (image) { return _this.customizer.getAreasIntersectingOrContainingItem(image).some(function (area) { return !_this.customizer.checkItemQualityForArea(image, area); }); });
                var atLeastOneItemInAreas = this.design.get("designItems").some(function (x) { return x.get("areas").length > 0; });
                var printableItems = this.customizer.getAllItems().filter(function (item) { return _this.customizer.isItemPrintable(item); });
                var DPIWarningMessage = this.customizer.customizedMessages.find(function (x) { return x.EventID === EventMessages.DPIWarning; });
                this.layoutManager.buyEnabled = !hasAboveLimitAreas &&
                    (Context.isTemplateEditor || (!this.design.isEmpty() && atLeastOneItemInAreas && printableItems.length > 0)) &&
                    (!hasDPIWarnings || !(DPIWarningMessage && DPIWarningMessage.AddToCartDisabledIfVisible));
                if (this.layoutManager.btnPreviewPDF)
                    this.layoutManager.setToolboxItemActive(ToolboxItem.PreviewDesignsPDF, atLeastOneItemInAreas && !this.design.isEmpty());
            };
            Application.prototype.isOneMandatoryAreaFull = function () {
                var _this = this;
                var mandatorySides = this.color.get("sides").models.filter(function (side) { return side.get("areas").models.filter(function (area) { return area.get("IsMandatory"); }).length > 0; });
                return Context.isTemplateEditor || mandatorySides.length == 0 ||
                    mandatorySides.some(function (side) {
                        return side.get("areas").models.filter(function (area) { return area.get("IsMandatory"); }).every(function (area) {
                            return _this.design.get("designItems").models.some(function (item) {
                                return item.get("areas").models.some(function (itemArea) {
                                    return itemArea.get("areaID") == area.get("areaID") && itemArea.get("sideID") == side.get("sideID");
                                });
                            });
                        });
                    });
            };
            // Preview3D expand
            Application.prototype.onPreview3dExpanded = function () {
                if (!this.isMobile)
                    this.preview3d.fitToParent();
                if (this.preview3dEnabled && this.isMobile) {
                    this.preview3d.loadModel(this.model, this.color.id);
                }
                // Remove alert items
                for (var _i = 0, _a = this.customizer.getAllItems(); _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.customizer.removeAlertItems(item);
                }
                this.isPreview3dExpanded = true;
            };
            Application.prototype.onPreview3dCollapsed = function () {
                if (!this.isMobile)
                    this.preview3d.fitToParent();
                if (this.isMobile) {
                    this.preview3d.clear();
                }
                // Re-check alert items
                for (var _i = 0, _a = this.customizer.getAllItems(); _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.customizer.checkAlertItems(item);
                }
                this.isPreview3dExpanded = false;
            };
            Application.prototype.initPreview3D = function () {
                var _this = this;
                if (!this.preview3dEnabled) {
                    Logger.info("Model does not have a 3D model.");
                    return;
                }
                // Preview already initiated (used when we reload the model)
                if (this.preview3d)
                    return;
                if (!this.isMobile)
                    this.preventAdaptiveZoom = true;
                // Preview 3D
                this.withPaperContext(function (paper) {
                    try {
                        _this.preview3d = new Preview3DViewer("#preview3d-container", _this.customizer, !_this.isMobile, _this.isMobile);
                        _this.update3dPreview = _.debounce(function () {
                            _this.preview3d.updateItems();
                        }, 300);
                        _this.preview3d.onModelLoadComplete = function () {
                            _this.preview3d.fitToParent();
                            _this.layoutManager.preview3dLoading = false;
                            setTimeout(function () {
                                _this.update3dPreview();
                                if (_this.customizer.side)
                                    _this.preview3d.focusSide(_this.customizer.side);
                                _this.customizer.resize(_this.customizer.domElement.offsetWidth, _this.customizer.domElement.offsetHeight);
                                if (!Context.isTemplateEditor && _this.hasAdaptiveZoomEnabled) {
                                    setTimeout(function () {
                                        _this.customizer.adaptZoomToSideAreas();
                                        _this.preventAdaptiveZoom = false;
                                    }, 1000);
                                }
                            }, 100);
                            _this.preview3d.setBackgroundColor(_this.customizerBackgroundColor);
                        };
                        _this.preview3d.onModelLoadError = function () {
                            // Disable 3d preview
                            _this.layoutManager.preview3dEnabled = false;
                            _this.update3dPreview = function () { };
                            _this.layoutManager.showError(T._("Error loading 3D model", "Customizer"), T._("There was an error in loading the 3D model. Click OK to reload the page", "Customizer"));
                        };
                    }
                    catch (ex) {
                        _this.layoutManager.preview3dEnabled = false;
                        _this.preview3d = null;
                        _this.preview3dEnabled = false;
                        console.warn("3D not supported on this device.", ex);
                    }
                });
            };
            Application.prototype.getPrintTypesEnabledForSide = function (side) {
                if (!this.model || !side)
                    return [];
                return this.model.get("printTypes").filter(function (print) { return side.get("printTypes").filter(function (y) { return !y.get("isEnabled"); }).findIndex(function (y) { return y.get("printTypeID") == print.id; }) == -1; });
            };
            // Model color selected
            Application.prototype.onModelColorSelected = function (color) {
                this.previousColor = this.color;
                this.color = color;
                Context.colorCode = color.get("code");
                this.layoutManager.fillSides(color);
                if (this.preview3dEnabled && !this.isMobile)
                    this.preview3d.setColor(color.id);
                var side = this.side ? (color.get("sides").get(this.side.id) ? color.get("sides").get(this.side.id) : color.get("sides").at(0)) : color.get("sides").toArray().find(function (x) { return Context.productSides.indexOf(x.get("code")) != -1; }) || color.get("sides").at(0);
                this.customizer.side = side;
                this.design.set("sideID", side.id);
                // Re-select the side
                this.layoutManager.selectSide(side);
            };
            // Side selected
            Application.prototype.onSideSelected = function (side) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var oldSide, sidePrintType, printTypeID, printType, modelPrintType, isModelPrintType, defaultFontID, backboneFonts, backboneFontsIds, fonts;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                oldSide = this.side;
                                this.side = side;
                                this.customizer.deselectAll();
                                this.layoutManager.resetTextForm();
                                if (!this.isMobile) {
                                    this.layoutManager.selectToolboxPage('homepage');
                                }
                                if (this.preview3dEnabled && !this.isMobile)
                                    this.preview3d.focusSide(side);
                                return [4 /*yield*/, this.updateSyncedItems(oldSide)];
                            case 1:
                                _a.sent();
                                this.customizer.setSide(side, function () { return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    var editableItems, visibleToolboxItems, _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (this.isMobile)
                                                    this.customizer.paper.view.zoom = 0.5;
                                                // If this is a template, and there is only one item, pre-select it
                                                if (this.firstTimeLoad && !Context.isTemplateEditor) {
                                                    editableItems = this.design.get("designItems").filter(function (designItem, idx) {
                                                        var item = _this.customizer.findItemForDesignItem(designItem);
                                                        return !_this.customizer.isItemStatic(item);
                                                    });
                                                    /*
                                                    if (editableItems.length == 1) {
                                                        this.customizer.setItemSelection(this.customizer.findItemForDesignItem(editableItems[0]), true);
                                                    }
                                                    else */ if (!this.isMobile) {
                                                        //First update all the toolbox items then if there is only one, select it
                                                        this.onItemSelectionChanged(null);
                                                        visibleToolboxItems = this.layoutManager.getVisibleToolboxItems().filter(function (i, x) { return $(x).data("name") != "image-filters"; });
                                                        if (visibleToolboxItems.length == 1)
                                                            this.layoutManager.selectToolboxPage(visibleToolboxItems.eq(0).data("name"));
                                                    }
                                                    this.firstTimeLoad = false;
                                                }
                                                this.customizer.checkImagesSizeLimit(this.designSizeLimit);
                                                _a = this.layoutManager;
                                                return [4 /*yield*/, this.getBackgroundRecolorRule()];
                                            case 1:
                                                _a.backgroundRecolorRule = _b.sent();
                                                this.adaptSyncedItemsToRestrictions();
                                                // Mask mandatory items (if there are)
                                                if (this.mandatoryItems.length > 0) {
                                                    this.customizer.highlightsCanvasItemFromDesignItems(this.mandatoryItems.map(function (x) {
                                                        return x.designItem;
                                                    }));
                                                }
                                                if (!Context.isTemplateEditor && this.hasAdaptiveZoomEnabled && !this.preventAdaptiveZoom) {
                                                    setTimeout(function () {
                                                        _this.customizer.adaptZoomToSideAreas();
                                                    }, 1000);
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                sidePrintType = this.design.get("sidesPrintTypes").find(function (x) { return x.get("sideID") == _this.side.id; });
                                printTypeID = this.design.get("printTypeID");
                                if (sidePrintType)
                                    printTypeID = sidePrintType.get("printTypeID");
                                else if (printTypeID <= 0)
                                    printTypeID = this.model.get("printTypes").at(0).id;
                                if (printTypeID) {
                                    printType = this.side.get("printTypes").getPrintType(printTypeID);
                                    modelPrintType = this.model.get("printTypes").get(printTypeID);
                                    if (!printType)
                                        printType = modelPrintType;
                                    isModelPrintType = printType instanceof MPlaza.PrintType;
                                    defaultFontID = null;
                                    if (!isModelPrintType && this.getPrintTypeProperty(printType, "useCustomFonts"))
                                        defaultFontID = this.getPrintTypeProperty(printType, "defaultFontFamilyID");
                                    else
                                        defaultFontID = this.getPrintTypeProperty(modelPrintType, "useCustomFonts") ?
                                            modelPrintType.get("modelPrintTypeDefaultFontFamilyID") :
                                            modelPrintType.get("printTypeDefaultFontFamilyID");
                                    backboneFonts = [];
                                    if (!isModelPrintType)
                                        backboneFonts = this.getPrintTypeProperty(printType, "useCustomFonts") ? this.getPrintTypeProperty(printType, "fonts") : [];
                                    if (!backboneFonts || backboneFonts.length < 1)
                                        backboneFonts = this.getPrintTypeProperty(modelPrintType, "useCustomFonts") ?
                                            modelPrintType.get("modelPrintTypeFonts") :
                                            modelPrintType.get("printTypeFonts");
                                    backboneFontsIds = backboneFonts.map(function (x) {
                                        return x.get("fontFamilyID");
                                    });
                                    fonts = Context.fonts;
                                    if (backboneFonts.length > 0) {
                                        fonts = Context.fonts.filter(function (font) {
                                            return backboneFontsIds.indexOf(font.id) != -1;
                                        });
                                    }
                                    this.setPrintType({ side: this.side }, printType, modelPrintType, fonts, defaultFontID);
                                    if (this.design && this.color && this.color.get("sides"))
                                        this.layoutManager.updateSidePrintTypesSelection(this.design, this.color.get("sides"));
                                    if (this.design) {
                                        this.design.changeColor(this.color);
                                        this.update3dPreview();
                                    }
                                    this.triggerLayoutUpdate();
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            Application.prototype.updateSyncedItems = function (oldSide) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var currentSyncItems, allSides, newPaper, masterGroup, _loop_2, _i, allSides_1, side;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!oldSide)
                                    return [2 /*return*/];
                                currentSyncItems = this.design.get("designItems").filter(function (item) { return item.isOnSide(oldSide) && item.get("syncGuid"); });
                                allSides = [];
                                this.color.get("sides").each(function (side) {
                                    if ((side.get("sideID") != oldSide.get("sideID")))
                                        allSides.push(side);
                                });
                                newPaper = this.createNewPaperScope();
                                masterGroup = new newPaper.Group();
                                _loop_2 = function (side) {
                                    var _loop_3, _i, currentSyncItems_1, designItem;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                //Clean new paper first
                                                newPaper.project.activeLayer.removeChildren();
                                                masterGroup.removeChildren();
                                                side.get("areas").each(function (area) {
                                                    _this.createNewPaperAreaItems(area, newPaper, masterGroup);
                                                });
                                                _loop_3 = function (designItem) {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                                                    var itemAssociations = _this.syncItemSides.find(function (x) { return x.syncGuid == designItem.get("syncGuid"); });
                                                                    var allowedSides = [];
                                                                    if (itemAssociations)
                                                                        allowedSides = itemAssociations.sides;
                                                                    else {
                                                                        allowedSides = _this.color.get("sides").slice(0).filter(function (x) {
                                                                            return _this.design.get("designItems").filter(function (item) { return item.isOnSide(x) && (item.get("syncGuid") == designItem.get("syncGuid")); }).length > 0;
                                                                        });
                                                                        _this.syncItemSides.push({ sides: allowedSides, syncGuid: designItem.get("syncGuid") });
                                                                        itemAssociations = _this.syncItemSides.find(function (x) { return x.syncGuid == designItem.get("syncGuid"); });
                                                                    }
                                                                    if (!allowedSides.find(function (x) { return x.get("sideID") == side.get("sideID"); })) {
                                                                        resolve();
                                                                        return;
                                                                    }
                                                                    var oldSyncedItem = _this.design.get("designItems").find(function (item) { return item.isOnSide(side) && item.get("syncGuid") == designItem.get("syncGuid"); });
                                                                    var oldConstraints = designItem.get("constraints");
                                                                    var canSyncContent = oldConstraints ? oldConstraints.get("canSyncContent") : true;
                                                                    var canSyncStyle = oldConstraints ? oldConstraints.get("canSyncFontFamily") : true;
                                                                    var canSyncTransforms = oldConstraints ? oldConstraints.get("canSyncTransforms") : false;
                                                                    var oldTransformMatrix = null;
                                                                    var oldChildren = null;
                                                                    var oldData = null;
                                                                    var oldTextContent = null;
                                                                    var oldImageContent = null;
                                                                    var oldTextStyle = null;
                                                                    if (oldSyncedItem) {
                                                                        var oldItem = newPaper.project.activeLayer.importJSON(oldSyncedItem.get("json"));
                                                                        if (oldItem.children)
                                                                            oldChildren = oldItem.children.slice(0);
                                                                        oldTransformMatrix = oldItem.matrix.clone();
                                                                        oldData = oldItem.data;
                                                                        oldItem.remove();
                                                                        if (oldItem.data.isText) {
                                                                            oldTextContent = oldItem.content;
                                                                            oldTextStyle = {
                                                                                rotation: oldItem.rotation,
                                                                                strokeColor: oldItem.strokeColor,
                                                                                strokeWidth: oldItem.strokeWidth,
                                                                                fillColor: oldItem.fillColor,
                                                                                fontFamily: oldItem.fontFamily,
                                                                                fontWeight: oldItem.fontWeight,
                                                                                fontStretch: oldItem.fontStretch,
                                                                                fontStyle: oldItem.fontStyle,
                                                                                fontSize: oldItem.fontSize,
                                                                                justification: oldItem.justification,
                                                                            };
                                                                        }
                                                                        else if (oldItem.data.isTextOnPath) {
                                                                            oldTextContent = oldItem.data.text;
                                                                            oldTextStyle = {
                                                                                point: oldItem.point,
                                                                                strokeColor: oldItem.strokeColor,
                                                                                strokeWidth: oldItem.strokeWidth,
                                                                                fillColor: oldItem.fillColor,
                                                                                fontFamily: oldItem.fontFamily,
                                                                                fontWeight: oldItem.fontWeight,
                                                                                fontSize: oldItem.fontSize,
                                                                                justification: oldItem.justification,
                                                                            };
                                                                        }
                                                                        else if (oldItem.data.isTextArea) {
                                                                            oldTextContent = oldItem.data.text;
                                                                            oldTextStyle = {
                                                                                rotation: oldItem.rotation,
                                                                                strokeColor: oldItem.strokeColor,
                                                                                strokeWidth: oldItem.strokeWidth,
                                                                                fillColor: oldItem.fillColor,
                                                                                fontFamily: oldItem.fontFamily,
                                                                                fontWeight: oldItem.fontWeight,
                                                                                fontStretch: oldItem.fontStretch,
                                                                                fontStyle: oldItem.fontStyle,
                                                                                fontSize: oldItem.fontSize,
                                                                                justification: oldItem.data.justification,
                                                                            };
                                                                        }
                                                                        else if (oldItem instanceof _this.customizer.paper.Raster) {
                                                                            oldImageContent = {
                                                                                source: oldItem.source,
                                                                                originalImageID: oldItem.data.originalImageID
                                                                            };
                                                                        }
                                                                        _this.design.get("designItems").remove(oldSyncedItem);
                                                                    }
                                                                    var syncedItem = new MPlaza.DesignItem();
                                                                    syncedItem.initialize();
                                                                    syncedItem.copyAttributes(designItem);
                                                                    syncedItem.get("colors").reset();
                                                                    designItem.get("colors").each(function (color) { return syncedItem.get("colors").add(color.clone()); });
                                                                    syncedItem.get("areas").reset();
                                                                    var sourceArea = oldSide.get("areas").getAreaByID(designItem.get("areas").at(0).get("areaID"));
                                                                    var newArea = null;
                                                                    if (sourceArea.get("name") != "")
                                                                        newArea = side.get("areas").find(function (x) { return x.get("name") == sourceArea.get("name"); });
                                                                    if (!newArea)
                                                                        newArea = side.get("areas").find(function (x) { return x.get("areaID") == sourceArea.get("areaID"); });
                                                                    if (!newArea)
                                                                        newArea = side.get("areas").at(0);
                                                                    syncedItem.addArea(newArea);
                                                                    var sourceItem = newPaper.project.activeLayer.importJSON(designItem.get("json"));
                                                                    var newItem = newPaper.project.activeLayer.importJSON(syncedItem.get("json"));
                                                                    var continueSync = function () {
                                                                        if (oldData) {
                                                                            var newText = null;
                                                                            var newTransform = null;
                                                                            if (newItem.data && newItem.children) {
                                                                                newText = newItem.data.text;
                                                                                newTransform = newItem.data.transformsData;
                                                                            }
                                                                            newItem.data = oldData;
                                                                            newItem.data.guid = syncedItem.get("itemGuid");
                                                                            if (canSyncContent && newText)
                                                                                newItem.data.text = newText;
                                                                            else if (!canSyncContent && newText)
                                                                                newItem.data.text = oldTextContent;
                                                                            if (!canSyncContent && oldChildren && newItem.data.isTextArea)
                                                                                newItem.children = oldChildren.slice(0);
                                                                            if (newTransform)
                                                                                newItem.data.transformsData = newTransform;
                                                                            if (newItem.data && sourceItem.data.isText) {
                                                                                newItem.data.isText = true;
                                                                                delete newItem.data.isTextOnPath;
                                                                                delete newItem.data.isTextArea;
                                                                            }
                                                                            else if (newItem.data && sourceItem.data.isTextOnPath) {
                                                                                newItem.data.isTextOnPath = true;
                                                                                delete newItem.data.isText;
                                                                                delete newItem.data.isTextArea;
                                                                                if (!newItem.data.points)
                                                                                    newItem.data.points = sourceItem.data.points;
                                                                            }
                                                                            else if (newItem.data && sourceItem.data.isTextArea && canSyncStyle) {
                                                                                newItem.data.justification = sourceItem.data.justification;
                                                                                newItem.data.isTextArea = true;
                                                                                delete newItem.data.isText;
                                                                                delete newItem.data.isTextOnPath;
                                                                                if (!newItem.data.rect)
                                                                                    newItem.data.rect = sourceItem.data.rect;
                                                                            }
                                                                        }
                                                                        if (!canSyncContent && newItem.data.isText && oldTextContent !== null)
                                                                            newItem.content = oldTextContent;
                                                                        if (!canSyncContent && oldImageContent && newItem instanceof _this.customizer.paper.Raster) {
                                                                            newItem.source = oldImageContent.source;
                                                                            newItem.data.originalImageID = oldImageContent.originalImageID;
                                                                        }
                                                                        if (!canSyncStyle && (newItem.data.isText || newItem.data.isTextOnPath || newItem.data.isTextArea) && oldTextStyle !== null) {
                                                                            Object.keys(oldTextStyle).forEach(function (key) { return newItem[key] = oldTextStyle[key]; });
                                                                            if (newItem.data && newItem.data.isTextArea)
                                                                                newItem.data.justification = oldTextStyle.justification;
                                                                        }
                                                                        if (canSyncStyle && newItem.data.isTextArea) {
                                                                            if (newItem.children && sourceItem.children) {
                                                                                newItem.children.forEach(function (child, i) {
                                                                                    child.font = sourceItem.children[0].font;
                                                                                    child.fontFamily = sourceItem.children[0].fontFamily;
                                                                                    child.fontStretch = sourceItem.children[0].fontStretch;
                                                                                    child.fontWeight = sourceItem.children[0].fontWeight;
                                                                                    child.strokeColor = sourceItem.children[0].strokeColor;
                                                                                    child.strokeWidth = sourceItem.children[0].strokeWidth;
                                                                                    child.fillColor = sourceItem.children[0].fillColor;
                                                                                });
                                                                            }
                                                                        }
                                                                        if (!canSyncTransforms && oldTransformMatrix) {
                                                                            newItem.matrix = oldTransformMatrix.clone();
                                                                            if (newItem.children) {
                                                                                newItem.children.forEach(function (child, i) {
                                                                                    if (oldChildren) {
                                                                                        child.fontSize = oldChildren[0].fontSize;
                                                                                        child.scaling = oldChildren[0].scaling;
                                                                                    }
                                                                                });
                                                                                if (newItem.data && newItem.data.isTextOnPath) {
                                                                                    _this.customizer.updateTextOnPath(newItem, null);
                                                                                    _this.customizer.adaptPathToText(newItem);
                                                                                    _this.customizer.updateTextOnPath(newItem, null);
                                                                                }
                                                                                else if (oldData && newItem.data && newItem.data.isTextArea) {
                                                                                    newItem.data.rect = oldData.rect.clone();
                                                                                    _this.customizer.updateTextArea(newItem, newItem.data.rect.clone(), null, MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd);
                                                                                }
                                                                            }
                                                                        }
                                                                        else {
                                                                            //Adapt to new area
                                                                            var newPositionX = newArea.get("boundsX") + ((newItem.position.x - sourceArea.get("boundsX")) / (sourceArea.get("boundsWidth")) * newArea.get("boundsWidth"));
                                                                            var newPositionY = newArea.get("boundsY") + ((newItem.position.y - sourceArea.get("boundsY")) / (sourceArea.get("boundsHeight")) * newArea.get("boundsHeight"));
                                                                            newItem.matrix = sourceItem.matrix.clone();
                                                                            newItem.position = new newPaper.Point(newPositionX, newPositionY);
                                                                            var printType = _this.getSelectedPrintType();
                                                                            var useImagesFixedSize = _this.getPrintTypeProperty(printType, "useImagesFixedSize");
                                                                            var ppmm = side.get("ppcm") / 10;
                                                                            var preferredWidth = syncedItem.get("imagePreferredWidth");
                                                                            var preferredHeight = syncedItem.get("imagePreferredHeight");
                                                                            if (preferredWidth || preferredHeight) {
                                                                                // reset the rotation for checking the real dimensions and not only the bounds
                                                                                if (newItem.bounds.width != preferredWidth * ppmm || newItem.bounds.height != preferredHeight * ppmm) {
                                                                                    var oldRotation = newItem.rotation;
                                                                                    newItem.rotation = 0;
                                                                                    var sx = preferredWidth * ppmm / newItem.bounds.width;
                                                                                    var sy = preferredHeight * ppmm / newItem.bounds.height;
                                                                                    newItem.scale(sx, sy);
                                                                                    newItem.rotation = oldRotation;
                                                                                }
                                                                            }
                                                                            else {
                                                                                var scaleBy = newArea.get("boundsWidth") / sourceArea.get("boundsWidth");
                                                                                if (newItem.children && sourceItem.children) {
                                                                                    newItem.children.forEach(function (child, i) {
                                                                                        child.fontSize = sourceItem.children[0].fontSize;
                                                                                        child.scaling = sourceItem.children[0].scaling;
                                                                                    });
                                                                                    if (newItem.data && newItem.data.isTextOnPath) {
                                                                                        _this.customizer.updateTextOnPath(newItem, null);
                                                                                        _this.customizer.adaptPathToText(newItem);
                                                                                        _this.customizer.updateTextOnPath(newItem, null);
                                                                                    }
                                                                                    else if (newItem.data && newItem.data.isTextArea) {
                                                                                        newItem.data.rect = _this.customizer.getItemRealBounds(newItem).clone();
                                                                                        _this.customizer.updateTextArea(newItem, newItem.data.rect.clone(), null, MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd);
                                                                                    }
                                                                                }
                                                                                newItem.scale(scaleBy);
                                                                            }
                                                                        }
                                                                        if (newItem.data && newItem.data.isTextArea)
                                                                            newItem.data.rect = _this.customizer.getItemRealBounds(newItem).clone();
                                                                        syncedItem.get("areas").reset();
                                                                        _this.getAreasIntersectingOrContainingDesignItemForSide(newItem, side, newPaper).forEach(function (area) {
                                                                            syncedItem.get("areas").add(new MPlaza.DesignItemArea({
                                                                                modelID: _this.model.get("modelID"),
                                                                                colorID: _this.color.get("colorID"),
                                                                                sideID: side.get("sideID"),
                                                                                areaID: area.get("areaID")
                                                                            }));
                                                                        });
                                                                        syncedItem.set("json", newItem.exportJSON({ asString: true }));
                                                                        syncedItem.set("svg", newItem.exportSVG({ asString: true, embedImages: false }));
                                                                        sourceItem.remove();
                                                                        newItem.remove();
                                                                        _this.design.get("designItems").add(syncedItem);
                                                                        resolve();
                                                                    };
                                                                    if (sourceItem instanceof _this.customizer.paper.Raster) {
                                                                        var loadedItems_1 = 0;
                                                                        sourceItem.onLoad = function () {
                                                                            loadedItems_1++;
                                                                            if (loadedItems_1 == 2)
                                                                                continueSync();
                                                                        };
                                                                        newItem.onLoad = function () {
                                                                            loadedItems_1++;
                                                                            if (loadedItems_1 == 2)
                                                                                continueSync();
                                                                        };
                                                                    }
                                                                    else {
                                                                        continueSync();
                                                                    }
                                                                })];
                                                            case 1:
                                                                _a.sent();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                };
                                                _i = 0, currentSyncItems_1 = currentSyncItems;
                                                _a.label = 1;
                                            case 1:
                                                if (!(_i < currentSyncItems_1.length)) return [3 /*break*/, 4];
                                                designItem = currentSyncItems_1[_i];
                                                return [5 /*yield**/, _loop_3(designItem)];
                                            case 2:
                                                _a.sent();
                                                _a.label = 3;
                                            case 3:
                                                _i++;
                                                return [3 /*break*/, 1];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                };
                                _i = 0, allSides_1 = allSides;
                                _a.label = 1;
                            case 1:
                                if (!(_i < allSides_1.length)) return [3 /*break*/, 4];
                                side = allSides_1[_i];
                                return [5 /*yield**/, _loop_2(side)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            };
            Application.prototype.adaptSyncedItemsToRestrictions = function () {
                var _this = this;
                this.color.get("sides").each(function (side) {
                    var prinTypeID = _this.design.get("printTypeID");
                    var designSidePrint = _this.design.get("sidesPrintTypes").find(function (x) { return x.get("sideID") == side.get("sideID"); });
                    if (designSidePrint) {
                        prinTypeID = designSidePrint.get("printTypeID");
                    }
                    else {
                        var modelSide = _this.color.get("sides").find(function (x) { return x.get("sideID") == side.get("sideID"); });
                        if (modelSide && modelSide.get("printTypes").length > 0) {
                            var sidePrint = modelSide.get("printTypes").find(function (x) { return x.get("printTypeID") == prinTypeID; });
                            if (!sidePrint || !sidePrint.get("isEnabled"))
                                sidePrint = modelSide.get("printTypes").filter(function (x) { return x.get("isEnabled"); })[0];
                            prinTypeID = sidePrint.get("printTypeID");
                        }
                    }
                    _this.preventPrintTypeChecksWarning = true;
                    _this.onPrintTypeSelected({
                        printTypeId: prinTypeID, side: side, previousValue: prinTypeID, callback: function () {
                            _this.preventPrintTypeChecksWarning = false;
                        }
                    });
                });
            };
            Application.prototype.createNewPaperScope = function () {
                var previewCanvas = document.createElement("canvas");
                document.body.appendChild(previewCanvas);
                var newPaper = new paper.PaperScope();
                newPaper.setup(previewCanvas);
                newPaper.view.center = new newPaper.Point(0, 0);
                newPaper.view.update();
                return newPaper;
            };
            Application.prototype.createNewPaperAreaItems = function (area, paperScope, masterGroup) {
                if (area && area instanceof MPlaza.Area) {
                    var item = paperScope.project.activeLayer.importJSON(area.get("path"));
                    item.data.guid = area.get("guid");
                    item.data.isArea = true;
                    item.data.selected = true;
                    masterGroup.addChild(item);
                    var newAreaItem = paperScope.project.activeLayer.importJSON(area.get("path"));
                    newAreaItem.data.guid = area.get("guid");
                }
            };
            Application.prototype.getAreasIntersectingOrContainingDesignItemForSide = function (item, side, paperScope) {
                var areas = [];
                if (item && item.data && item.data.guid && !item.data.isArea &&
                    side && side instanceof MPlaza.Side && side.get("areas")) {
                    var tempItem = item;
                    if (item.realBounds)
                        tempItem = new paperScope.Path.Rectangle(item.realBounds);
                    for (var i = 0; i < side.get("areas").length; i++) {
                        var area = side.get("areas").at(i);
                        var areaItem = this.customizer.findItemByGuid(area.get("guid"), paperScope);
                        if (area && areaItem && (tempItem.intersects(areaItem) ||
                            tempItem.bounds.contains(areaItem.bounds) ||
                            areaItem.bounds.contains(tempItem.bounds) ||
                            areaItem.contains(tempItem.position))) {
                            areas.push(area);
                        }
                    }
                    if (item.realBounds)
                        tempItem.remove();
                }
                return areas;
            };
            Application.prototype.onItemChanged = function (item) {
                this.customizer.checkImagesSizeLimit(this.designSizeLimit);
            };
            Application.prototype.onItemCreated = function (item) {
                if (!this.design)
                    return;
                this.update3dPreview();
            };
            // Design items changed
            Application.prototype.onDesignItemChanged = function (designItem) {
                // Imposto la propietà di design item isChanged a true
                if (designItem)
                    designItem.set('isChanged', true);
            };
            // Item selected
            Application.prototype.onItemSelectionChanged = function (event) {
                this.triggerLayoutUpdate();
            };
            // Item deselected
            Application.prototype.onItemsDeselection = function (items) {
                this.previousSelectedItems = items;
            };
            Application.prototype.triggerPrintTypesUpdate = function () {
                var _this = this;
                if (!this.model)
                    return;
                var printTypes = [{ side: null, prints: this.model.get("printTypes").map(function (x) { return x; }) }];
                this.color.get("sides").each(function (side) { return printTypes.push({ side: side, prints: _this.getPrintTypesEnabledForSide(side) }); });
                this.layoutManager.fillPrintTypes(this.design, printTypes.filter(function (x) { return x.prints.length > 0; }));
            };
            Application.prototype.triggerLayoutUpdate = function () {
                var _this = this;
                var items = this.customizer.getSelectedItems();
                var textInfo = this.customizer.getSelectedTextItemsInfo();
                var constraints = this.defaultDesignConstraints;
                var isImageSelected = items && items.length > 0 && (items[0] instanceof this.customizer.paper.Raster);
                var isTextSelected = items && items.length > 0 && (items[0] instanceof this.customizer.paper.TextItem || items[0].data && items[0].data.isTextOnPath || (items[0].data && items[0].data.isTextArea));
                var isSvgSelected = items && items.length > 0 && (items[0] instanceof this.customizer.paper.Raster && this.customizer.findDesignItemForItem(items[0]).attributes.imageFormat.toLowerCase() == "svg");
                var wasSvgSelected = this.previousSelectedItems && this.previousSelectedItems.length > 0 &&
                    (this.previousSelectedItems[0] instanceof this.customizer.paper.Raster &&
                        this.customizer.findDesignItemForItem(this.previousSelectedItems[0]) &&
                        this.customizer.findDesignItemForItem(this.previousSelectedItems[0]).attributes.imageFormat.toLowerCase() == "svg");
                var itemConstraints = this.customizer.getItemConstraints(items[0]);
                if (isTextSelected && itemConstraints && itemConstraints.get("maxNrChars") > 0)
                    $("#txt-toolbox-text-content, #txt-toolbox-edit-text-content").attr("maxlength", itemConstraints.get("maxNrChars"));
                else
                    $("#txt-toolbox-text-content, #txt-toolbox-edit-text-content").removeAttr("maxlength");
                var canAddText = this.printTypeAllowText && (this.customizer.canAddText() || (!this.customizer.canAddText() && this.customizer.canEditSelection() && isTextSelected));
                if (items && items.length > 0) {
                    var item = items[0];
                    var designItem = this.customizer.findDesignItemForItem(items[0]);
                    constraints = designItem.get("constraints") || this.defaultDesignConstraints;
                    // Callback
                    var callback = function (image) {
                        var colors = [];
                        if (image != null && (constraints.get("canChangeSvgColors") || Context.isTemplateEditor) && _this.printTypeAllowSvgColorsChanging) {
                            var imageColors = image.get("colors");
                            for (var i = 0; i < imageColors.length; i++) {
                                var color = imageColors.at(i);
                                var colorId = color.get("colorID");
                                var colorCode = color.get("code");
                                var designItemColor = designItem.get("colors").getDesignItemColor(image.id, colorId);
                                if (designItemColor) {
                                    colorCode = designItemColor.get("colorCode");
                                }
                                colors.push({
                                    imageId: image.id,
                                    id: colorId,
                                    colorCode: colorCode
                                });
                            }
                        }
                        var printType = _this.getSelectedPrintType();
                        var modelPrintType = _this.model.get("printTypes").get(printType.id);
                        if (_this.getPrintTypeProperty(modelPrintType, "pantoneEnabled") && _this.pantoneColors)
                            _this.layoutManager.fillSvgColors(designItem, image, colors, _this.pantoneColors);
                        else
                            _this.layoutManager.fillSvgColors(designItem, image, colors);
                    };
                    var imageId = designItem.get("imageID");
                    if (imageId != null && imageId > 0) {
                        try {
                            var image = this.getImageCache(imageId);
                            if (image) {
                                callback(image);
                            }
                            else {
                                image = new MPlaza.Image({ imageID: imageId });
                                image.fetch({
                                    success: function (model, response, options) {
                                        callback(model);
                                    },
                                    error: function (model, response, options) {
                                        Logger.info("Error while loading image for SVG colors");
                                    }
                                });
                            }
                        }
                        catch (e) {
                            Logger.info(e);
                        }
                    }
                    //If an image has been selected and filters can be applied to it, the icon becomes active in the toolbar
                    var isRasterImage = items[0] instanceof this.customizer.paper.Raster && designItem.attributes.imageFormat != "Svg";
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.ImageFilters, this.printTypeAllowImageFilters && isRasterImage && this.customizer.canEditSelection());
                    this.layoutManager.imageFiltersEnabled = this.isImageFilterAvailable;
                    //If is a raster, show the toolbox homepage
                    //if (isRasterImage && !this.isMobile)
                    //    this.layoutManager.selectToolboxPage("homepage");
                    // Fire event
                    this.layoutManager.onDesignItemSelected(items[0]);
                    //If is an image fire another complementary event
                    if (items[0] instanceof this.customizer.paper.Raster) {
                        this.layoutManager.onImageItemSelected(items[0], !this.customizer.canAddImage() && this.customizer.canEditSelection());
                    }
                    if (Context.isTemplateEditor) {
                        var constraints = designItem.get("constraints") || this.defaultDesignConstraints;
                        Object.assign(constraints, { syncGuid: designItem.get("syncGuid") });
                        this.preventElementConstraintsApply = true;
                        this.layoutManager.setElementRestrictions((items[0] instanceof this.customizer.paper.Raster) ? (designItem.attributes.imageFormat == "Svg" ? "svg" : "image") : "text", constraints || this.defaultDesignConstraints);
                        this.preventElementConstraintsApply = false;
                    }
                }
                else {
                    if (!this.preventTextFormUpdate) {
                        this.preventItemUpdate = true;
                        this.layoutManager.resetTextForm();
                        this.layoutManager.updateTextForm(null, this.defaultDesignConstraints);
                        this.preventItemUpdate = false;
                    }
                    this.layoutManager.fillSvgColors(null, null, null);
                    this.layoutManager.onDesignItemSelected(null);
                    this.layoutManager.setTextColorEnabled(this.printTypeAllowColors);
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.ImageFilters, false);
                }
                // Enable/Disable constraint page
                if (Context.isTemplateEditor) {
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.ElementRestrictions, items.length > 0);
                }
                //If an svg was selected, and then nothing or a raster, select the homepage
                if (wasSvgSelected && (items.length == 0 || (isImageSelected && !isSvgSelected)) && !this.isMobile)
                    this.layoutManager.selectToolboxPage("homepage");
                // Text items
                if (isTextSelected && !this.preventTextFormUpdate && !this.isMobile) {
                    this.preventItemUpdate = true;
                    this.layoutManager.updateTextForm(textInfo, !Context.isTemplateEditor ? constraints : this.defaultDesignConstraints);
                    this.layoutManager.selectToolboxPage(ToolboxItem.Text);
                    this.preventItemUpdate = false;
                }
                if (!this.isMobile && !Context.isTemplateEditor && !canAddText && this.layoutManager.selectedPage == ToolboxItem.Text && !isTextSelected)
                    this.layoutManager.selectToolboxPage(ToolboxItem.Homepage);
                if (isImageSelected && !this.isMobile && Context.isTemplateEditor) {
                    if (designItem.attributes.imageFormat == "Svg")
                        this.layoutManager.selectToolboxPage(ToolboxItem.SvgColors);
                    else
                        this.layoutManager.selectToolboxPage(ToolboxItem.ElementRestrictions);
                }
                // Filters
                this.layoutManager.setToolboxItemEnabled(ToolboxItem.ImagesMacroCategories, this.printTypeAllowSellerImages && this.designAllowSellerImages && (this.customizer.canAddImage() || (!this.customizer.canAddImage() && this.customizer.canEditSelection() && isImageSelected)));
                var canUploadImage = !Context.isTemplateEditor && !Context.isDesignEditor && this.printTypeAllowUploadImages && (this.customizer.canAddImage() || (!this.customizer.canAddImage() && this.customizer.canEditSelection() && isImageSelected));
                if (this.isMobile)
                    canUploadImage = canUploadImage && (isImageSelected || items == null || items.length == 0);
                this.layoutManager.setToolboxItemEnabled(ToolboxItem.UploadImage, canUploadImage);
                this.layoutManager.setToolboxItemEnabled(ToolboxItem.Text, canAddText);
                if (Context.isTemplateEditor) {
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Mirror, items.length > 0 && this.customizer.canEditSelection() && !(isTextSelected && items[0] && items[0].data && items[0].data.isTextArea));
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.MoveUpDown, items.length > 0 && this.customizer.canMoveSelection());
                    // Disable duplicate
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Duplicate, false);
                    if (isTextSelected)
                        this.layoutManager.setToolboxItemEnabled(ToolboxItem.Duplicate, items.length > 0 && this.customizer.canAddText());
                    if (isImageSelected)
                        this.layoutManager.setToolboxItemEnabled(ToolboxItem.Duplicate, items.length > 0 && this.customizer.canAddImage());
                }
                else {
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Mirror, items.length > 0 && this.customizer.canEditSelection() && constraints.get("canTransform") && !(isTextSelected && items[0] && items[0].data && items[0].data.isTextArea));
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.MoveUpDown, items.length > 0 && this.customizer.canMoveSelection() && constraints.get("canTransform") && !constraints.get("isAlwaysOnTop"));
                    // Disable duplicate
                    this.layoutManager.setToolboxItemEnabled(ToolboxItem.Duplicate, false);
                    if (isTextSelected)
                        this.layoutManager.setToolboxItemEnabled(ToolboxItem.Duplicate, items.length > 0 && this.customizer.canAddText() && constraints.get("canTransform"));
                    if (isImageSelected)
                        this.layoutManager.setToolboxItemEnabled(ToolboxItem.Duplicate, items.length > 0 && this.customizer.canAddImage() && constraints.get("canTransform"));
                }
                this.layoutManager.setTextColorEnabled(Context.isTemplateEditor || (this.printTypeAllowColors && constraints.get("canChangeFontColor")));
                this.layoutManager.setCanAddText(Context.isTemplateEditor || (this.printTypeAllowText && this.customizer.canAddText()));
                this.layoutManager.updateFileUploadRestrictions(this.getFileUploadRestrictions());
            };
            Application.prototype.getFileUploadRestrictions = function () {
                var isUserImageAllowed = true;
                var isJpgAllowed = true;
                var isPngAllowed = true;
                var isSvgAllowed = true;
                var isPdfAllowed = true;
                var isEpsAllowed = true;
                var isPdfWithRasterAllowed = true;
                var isFacebookAllowed = true;
                var isInstagramAllowed = true;
                if (!Context.isTemplateEditor && this.design) {
                    var uploadRestrictions_1 = this.design.get("uploadRestrictions") || {};
                    var uploadRestrictionsSide_1 = this.design.getDesignSide(this.side) ? (this.design.getDesignSide(this.side).get("uploadRestrictions") || {}) : {};
                    var checkRestriction = function (prop, printProp) {
                        if (uploadRestrictionsSide_1[prop] != null)
                            return uploadRestrictionsSide_1[prop];
                        else if (uploadRestrictions_1[prop] != null)
                            return uploadRestrictions_1[prop];
                        else if (printProp != null)
                            return printProp;
                        else
                            return true;
                    };
                    isUserImageAllowed = checkRestriction("isUserImageAllowed", this.printTypeAllowUserImage);
                    isJpgAllowed = checkRestriction("isJpgAllowed", this.printTypeAllowJpg);
                    isPngAllowed = checkRestriction("isPngAllowed", this.printTypeAllowPng);
                    isSvgAllowed = checkRestriction("isSvgAllowed", this.printTypeAllowSvg);
                    isPdfAllowed = checkRestriction("isPdfAllowed", this.printTypeAllowPdf);
                    isPdfWithRasterAllowed = checkRestriction("isPdfWithRasterAllowed", this.printTypeAllowPdfWithRaster);
                    isEpsAllowed = checkRestriction("isEpsAllowed", this.printTypeAllowEps);
                    isFacebookAllowed = checkRestriction("isFacebookAllowed", this.printTypeAllowFacebook);
                    isInstagramAllowed = checkRestriction("isInstagramAllowed", this.printTypeAllowInstagram);
                }
                return {
                    isUserImageAllowed: isUserImageAllowed,
                    isJpgAllowed: isJpgAllowed,
                    isPngAllowed: isPngAllowed,
                    isSvgAllowed: isSvgAllowed,
                    isPdfAllowed: isPdfAllowed,
                    isEpsAllowed: isEpsAllowed,
                    isPdfWithRasterAllowed: isPdfWithRasterAllowed,
                    isFacebookAllowed: isFacebookAllowed,
                    isInstagramAllowed: isInstagramAllowed
                };
            };
            // Item removed
            Application.prototype.onItemRemoved = function (event) {
                this.customizer.deselectAll();
                this.layoutManager.fillSvgColors(null, null, null);
            };
            Application.prototype.onDesignItemRemoving = function (designItem) {
                var _this = this;
                if (!designItem)
                    return;
                var syncGuid = designItem.get("syncGuid");
                if (syncGuid) {
                    var questionDialog = this.layoutManager.showDialog(T._("Delete", "Customizer"), T._("Do you want to delete this element from all the product sides?", "Customizer"), "dialog_warning", (_a = {},
                        _a[T._("YES", "Customizer")] = function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                this.design.get("designItems").slice(0).forEach(function (x) {
                                    if (x.get("syncGuid") == syncGuid)
                                        _this.design.get("designItems").remove(x);
                                });
                                this.syncItemSides.filter(function (x) { return x.syncGuid != syncGuid; });
                                this.layoutManager.closeDialog(dialog);
                                return [2 /*return*/];
                            });
                        }); },
                        _a[T._("NO", "Customizer")] = function (dialog) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                this.syncItemSides.map(function (x) {
                                    if (x.syncGuid == syncGuid)
                                        x.sides = x.sides.filter(function (y) { return y.get("sideID") != _this.side.get("sideID"); });
                                    return x;
                                });
                                this.layoutManager.closeDialog(dialog);
                                return [2 /*return*/];
                            });
                        }); },
                        _a));
                    questionDialog.find(".btn-dlg-close").on("click", function () {
                        _this.syncItemSides.map(function (x) {
                            if (x.syncGuid == syncGuid)
                                x.sides.filter(function (y) { return y.get("sideID") != _this.side.get("sideID"); });
                            return x;
                        });
                    });
                }
                var _a;
            };
            // SVG color changed
            Application.prototype.onSvgColorChanged = function (settings) {
                var changes = [];
                var designItemColors = settings.item.get("colors");
                // Add all other colors except this in this change
                for (var i = 0; i < designItemColors.length; i++) {
                    var designItemColor = designItemColors.at(i);
                    if (designItemColor.get("colorID") != settings.color.id) {
                        var change = {
                            colorID: designItemColor.get("colorID"),
                            code: designItemColor.get("colorCode")
                        };
                        changes.push(change);
                    }
                }
                // Add this change
                var originalImageColor = settings.image.get("colors").findColor(settings.color.id);
                var change = {
                    colorID: settings.color.id,
                    code: settings.color.colorCode
                };
                changes.push(change);
                this.customizer.modifyImageElementColors(this.customizer.findItemForDesignItem(settings.item), changes);
            };
            // Preview Designs in PDF format
            Application.prototype.onPreviewDesignsPDF = function (event) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var that, imageDataUrls, previewSides, _loop_4, _i, previewSides_1, side, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                that = this;
                                if (this.layoutManager.btnPreviewPDF.hasClass('inactive') || !this.layoutManager.btnPreviewPDF.is(':visible')) {
                                    event.preventDefault();
                                    return [2 /*return*/];
                                }
                                imageDataUrls = [];
                                previewSides = this.color.get("sides").models;
                                _loop_4 = function (side) {
                                    var urlPreview;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                    _this.getPreviewImage(function (url, errorStates) {
                                                        if (errorStates.length != 0) {
                                                            var errorMessage = "";
                                                            errorStates.forEach(function (x) {
                                                                errorMessage = errorMessage + " | " + (x.message);
                                                            });
                                                            console.log(errorMessage);
                                                            reject(errorMessage);
                                                        }
                                                        resolve(url);
                                                    }, 720, 1020, side);
                                                    // su 96 Dpi i[(19 / 2,54) * 96 - (27 / 2,54 ) * 96]
                                                })];
                                            case 1:
                                                urlPreview = _a.sent();
                                                imageDataUrls.push(urlPreview);
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _i = 0, previewSides_1 = previewSides;
                                _a.label = 1;
                            case 1:
                                if (!(_i < previewSides_1.length)) return [3 /*break*/, 4];
                                side = previewSides_1[_i];
                                return [5 /*yield**/, _loop_4(side)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4:
                                if (previewSides.length == imageDataUrls.length) {
                                    try {
                                        data = previewSides.map(function (x, i) {
                                            return {
                                                urlSideBase64: imageDataUrls[i],
                                                modelName: _this.model.get('name'),
                                                sideName: x.get('name')
                                            };
                                        });
                                        this.layoutManager.modelLoading = true;
                                        $.ajax({
                                            url: Zakeke.config.baseApiUrl + "previewdesigns/pdf",
                                            method: 'POST',
                                            data: JSON.stringify(data),
                                            contentType: 'application/json; charset=utf-8'
                                        }).fail(function (err) {
                                            console.log(err);
                                        }).done(function (response) {
                                            that.layoutManager.showSuccess(T._("Designs preview", "Customizer"), StringHelper.format(T._("Export PDF preview completed.<br/> Click <a style='text-decoration:underline' href='{0}' target='_blank'>here</a> to download PDF.", "Customizer"), response));
                                        }).always(function () {
                                            _this.layoutManager.modelLoading = false;
                                        });
                                    }
                                    catch (ex) {
                                        console.log(ex);
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            // Designs
            //------------------------------------------------------------------------------------
            // Delete draft design
            Application.prototype.onDraftDesignDeleted = function (draftDesign) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (draftDesign.isDraft !== true)
                                    return [2 /*return*/];
                                this.layoutManager.toolboxLoading = true;
                                return [4 /*yield*/, $.ajax(Zakeke.config.baseApiUrl + "proxydesigns/" + draftDesign.docID, {
                                        method: 'DELETE',
                                        success: function () {
                                            // Se il design rimosso � quello corrente, imposto le propriet� chiave del design corrente a NULL in modo da forzare una POST 
                                            // e quindi creare un nuovo design quando ri-salvato
                                            if (draftDesign.docID == _this.design.get('docID')) {
                                                _this.design.id = null;
                                                _this.design.set("docID", null);
                                                _this.design._previousAttributes.docID = null;
                                            }
                                            _this.loadUserDraftDesigns(function () { _this.layoutManager.toolboxLoading = false; });
                                        },
                                        error: function () {
                                            _this.layoutManager.toolboxLoading = false;
                                        }
                                    })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            // Load and show user draft design into canvas
            Application.prototype.onDraftDesignSelected = function (draftDesign) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (draftDesign.isDraft !== true)
                            return [2 /*return*/];
                        this.loadDesign(draftDesign.docID, false);
                        return [2 /*return*/];
                    });
                });
            };
            // Load user draft designs
            Application.prototype.loadUserDraftDesigns = function (callback) {
                return __awaiter(this, void 0, void 0, function () {
                    var draftDesigns;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!callback) return [3 /*break*/, 2];
                                return [4 /*yield*/, $.get(Zakeke.config.baseApiUrl + "docdesigns/product/" + Context.modelId + "/?draft=true", callback)];
                            case 1:
                                draftDesigns = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, $.get(Zakeke.config.baseApiUrl + "docdesigns/product/" + Context.modelId + "/?draft=true")];
                            case 3:
                                draftDesigns = _a.sent();
                                _a.label = 4;
                            case 4:
                                this.layoutManager.fillUserDraftDesigns(draftDesigns);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            //------------------------------------------------------------------------------------
            // Private
            //------------------------------------------------------------------------------------
            // Parse the url
            Application.prototype.parseUrl = function () {
                try {
                    var queryString = window.location.href.substring(window.location.href.lastIndexOf("?") + 1);
                    var pieces = queryString.split("&");
                    for (var i = 0; i < pieces.length; i++) {
                        var index = pieces[i].indexOf("=");
                        if (index == -1) {
                            throw { message: "Invalid key-value pair in url" };
                        }
                        var key = decodeURIComponent(pieces[i].substring(0, index));
                        var value = pieces[i].substring(index + 1);
                        switch (key) {
                            case "name":
                                Context.productName = decodeURIComponent(value.replace(/\+/g, '%20'));
                                break;
                            case "qty":
                                Context.quantity = parseInt(value);
                                break;
                            case "token":
                                Context.token = decodeURIComponent(value);
                                break;
                            case "tokenOwin":
                                Context.tokenOwin = decodeURIComponent(value);
                                break;
                            case "modelCode":
                                Context.modelCode = decodeURIComponent(value.replace(/\+/g, '%20'));
                                break;
                            case "currency":
                                Context.currency = decodeURIComponent(value);
                                break;
                            case "culture":
                                Context.culture = decodeURIComponent(value);
                                break;
                            case "colorCode":
                                Context.colorCode = decodeURIComponent(value);
                                break;
                            case "ecommerce":
                                Context.ecommerce = decodeURIComponent(value);
                                break;
                            case "design":
                                Context.designId = parseInt(value, 10);
                                break;
                            case "designdocid":
                                Context.designDocId = decodeURIComponent(value);
                                break;
                            case "cartButtonText":
                                Context.cartButtonText = decodeURIComponent(value.replace(/\+/g, '%20'));
                                break;
                            case "isTemplateEditor": {
                                Context.isTemplateEditor = decodeURIComponent(value) == "1";
                                Context.canSaveDesign = false;
                                break;
                            }
                            case "isDesignEditor": {
                                Context.isDesignEditor = decodeURIComponent(value) == "1";
                                Context.canSaveDesign = false;
                                break;
                            }
                            case "templateFilter":
                                Context.templateFilter = JSON.parse(decodeURIComponent(value));
                                break;
                            case "productSides":
                                Context.productSides = JSON.parse(decodeURIComponent(value));
                                break;
                            case "managedShare":
                                Context.managedShare = JSON.parse(decodeURIComponent(value));
                                break;
                            case "taxPricesPolicy":
                                {
                                    switch (value) {
                                        case "hidden":
                                            Context.taxPricesPolicy = Customizer.TaxPricesPolicy.Hidden;
                                            break;
                                        case "including":
                                            Context.taxPricesPolicy = Customizer.TaxPricesPolicy.PricesIncludingTax;
                                            break;
                                        case "excluding":
                                            Context.taxPricesPolicy = Customizer.TaxPricesPolicy.PricesExcludingTax;
                                            break;
                                        default:
                                            throw new Error("Unknow taxPricesPolicy " + value);
                                    }
                                }
                                break;
                            case "hideVariants":
                                Context.hideVariants = JSON.parse(decodeURIComponent(value));
                                break;
                            case "previewImageHeight":
                                Context.previewImageSize.height = parseInt(value, 10);
                                break;
                            case "previewImageWidth":
                                Context.previewImageSize.width = parseInt(value, 10);
                                break;
                            case "canSaveDesign":
                                Context.canSaveDesign = decodeURIComponent(value) === '1';
                                break;
                        }
                        // If it is an attribute
                        if (key.indexOf("attribute") == 0) {
                            var match = /.+\[(.+)]/.exec(key);
                            if (match) {
                                var id = match[1];
                                Context.attributes.push(new Attribute(id, decodeURIComponent(value.replace(/\+/g, '%20'))));
                            }
                        }
                        // If it is a preview attribute
                        if (key.indexOf("previewAttribute") == 0) {
                            var match = /previewAttribute\[(.+)]\[(.+)]/.exec(key);
                            if (match) {
                                var attributesIndex = match[1];
                                var id = match[2];
                                if (Context.previewAttributes[attributesIndex] == undefined)
                                    Context.previewAttributes[attributesIndex] = [];
                                Context.previewAttributes[attributesIndex].push(new Attribute(id, decodeURIComponent(value.replace(/\+/g, '%20'))));
                            }
                        }
                        if (Context.isTemplateEditor) {
                            Context.mode = CustomizerMode.TemplateEditor;
                        }
                        else if (Context.isDesignEditor && Context.designDocId) {
                            Context.mode = CustomizerMode.DesignEditor;
                        }
                        else if (!Context.designId && !Context.designDocId) {
                            Context.mode = CustomizerMode.Buy;
                        }
                        else {
                            Context.mode = CustomizerMode.Edit;
                        }
                    }
                    return true;
                }
                catch (ex) {
                    alert(ex.message);
                    return false;
                }
            };
            // Load model from network
            Application.prototype.reloadModel = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var that = _this;
                                _this.layoutManager.modelLoading = true;
                                // Convert codes to ids     
                                var model = new MPlaza.Model({ modelID: 1 });
                                model.fetch({
                                    success: function (model, response, options) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var color;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (model && model.get("modelID")) {
                                                            that.model = model;
                                                        }
                                                        else {
                                                            that.model = null;
                                                        }
                                                        Context.modelId = model.id;
                                                        if (Context.isDesignEditor && Context.designDocId) {
                                                            Context.colorId = -1;
                                                        }
                                                        else if (Context.isTemplateEditor)
                                                            Context.colorId = model.get("colors").at(0).id;
                                                        else
                                                            Context.colorId = that.matchColor();
                                                        if (!(Context.colorId == null)) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, that.layoutManager.showSelectColorDialog(T._("Please choose the variant of the product.", "Customizer"), that.model.get("colors"), false)];
                                                    case 1:
                                                        color = _a.sent();
                                                        Context.colorId = color.id;
                                                        _a.label = 2;
                                                    case 2:
                                                        // Remove all the model sides that are not included in the filter because they could wrongly appear 
                                                        // in output files or give other strange issues
                                                        if (Context.productSides.length > 0) {
                                                            model.get("colors").forEach(function (modelColor) {
                                                                modelColor.get("sides").filter(function (modelSide) { return Context.productSides.indexOf(modelSide.get("code")) == -1; }).forEach(function (modelSide) {
                                                                    modelColor.get("sides").remove(modelSide);
                                                                });
                                                            });
                                                        }
                                                        return [4 /*yield*/, that.updateTemplates()];
                                                    case 3:
                                                        _a.sent();
                                                        return [4 /*yield*/, that.updateModel()];
                                                    case 4:
                                                        _a.sent();
                                                        resolve();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        });
                                    },
                                    error: function (model, error2, error3) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    that.model = null;
                                                    return [4 /*yield*/, that.updateModel()];
                                                case 1:
                                                    _a.sent();
                                                    that.layoutManager.modelLoading = false;
                                                    alert(JSON.stringify(model) + " " + JSON.stringify(error2) + " " + JSON.stringify(error3));
                                                    Logger.error(JSON.stringify(model) + " " + JSON.stringify(error2) + " " + JSON.stringify(error3));
                                                    this.layoutManager.showAbort(T._("Error", "Customizer"), T._("There was an error loading. Click OK to reload the page", "Customizer"), function (dialog) {
                                                        window.location.reload();
                                                    });
                                                    reject();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                    data: {
                                        c: Context.modelCode,
                                        pricings: 1
                                    }
                                });
                            })];
                    });
                });
            };
            Application.prototype.updateTemplates = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _i, _b, macro, _c, _d, category, templatesCount;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _a = Context;
                                return [4 /*yield*/, $.get(Zakeke.config.baseApiUrl + "designs/templates/" + Context.modelId)];
                            case 1:
                                _a.templates = _e.sent();
                                // Use the templateFilters
                                if (Context.templateFilter) {
                                    for (_i = 0, _b = Context.templates; _i < _b.length; _i++) {
                                        macro = _b[_i];
                                        for (_c = 0, _d = macro.categories; _c < _d.length; _c++) {
                                            category = _d[_c];
                                            category.templates = category.templates.filter(function (x) {
                                                return Context.templateFilter.includes(x.designID);
                                            });
                                        }
                                    }
                                }
                                templatesCount = this.countTemplates();
                                this.layoutManager.fillTemplates(Context.templates);
                                this.layoutManager.setToolboxItemEnabled(ToolboxItem.Templates, templatesCount > 1 || (templatesCount > 0 && this.model.get("defaultDesignTemplateID") <= 0));
                                return [2 /*return*/];
                        }
                    });
                });
            };
            Application.prototype.countTemplates = function () {
                var templatesCount = 0;
                Context.templates.forEach(function (x) { return x.categories.forEach(function (y) { return templatesCount += y.templates.length; }); });
                return templatesCount;
            };
            Application.prototype.updateTemplatesCategories = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var categories = new MPlaza.TemplateMacroCategories();
                                categories.fetch({
                                    success: function () {
                                        _this.layoutManager.fillTemplatesCategories(categories);
                                    },
                                    data: {
                                        cache: "false"
                                    }
                                });
                            })];
                    });
                });
            };
            Application.prototype.findTemplate = function (designID) {
                for (var _i = 0, _a = Context.templates; _i < _a.length; _i++) {
                    var macroCategory = _a[_i];
                    for (var _b = 0, _c = macroCategory.categories; _b < _c.length; _b++) {
                        var category = _c[_b];
                        for (var _d = 0, _e = category.templates; _d < _e.length; _d++) {
                            var template = _e[_d];
                            if (template.designID == designID)
                                return template;
                        }
                    }
                }
                return null;
            };
            // Set model
            Application.prototype.updateModel = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(this.model != null)) return [3 /*break*/, 6];
                                this.customizer.model = this.model;
                                if (this.model.get("previewModel") != null)
                                    this.preview3dEnabled = true;
                                this.layoutManager.fillColors(this.model.get("colors"));
                                this.layoutManager.setProductInfo(Context.productName);
                                this.initPreview3D();
                                if (!(Context.designDocId != null)) return [3 /*break*/, 1];
                                this.loadDesign(Context.designDocId, false);
                                return [3 /*break*/, 5];
                            case 1:
                                if (!(Context.designId != null)) return [3 /*break*/, 2];
                                this.loadDesign(Context.designId, false);
                                return [3 /*break*/, 5];
                            case 2:
                                if (!(this.model.get("showTemplateSelection") && !Context.isTemplateEditor && this.countTemplates() > 1)) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.layoutManager.showSelectTemplateDialog(T._("Please choose one of the pre-designed templates", "Customizer"), Context.templates)];
                            case 3:
                                template = _a.sent();
                                if (template != null) {
                                    this.loadDesign(template.designID, true);
                                }
                                else {
                                    this.design = new MPlaza.Design();
                                    this.design.setModel(this.model);
                                    this.updateDesign();
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                if (this.model.get("defaultDesignTemplateID") > 0 && !Context.isTemplateEditor) {
                                    this.loadDesign(this.model.get("defaultDesignTemplateID"), true);
                                }
                                else if (this.model.get("loadFirstDesignTemplate") == true && !Context.isTemplateEditor && Context.templates.length > 0 && Context.templates[0].categories.length > 0 && Context.templates[0].categories[0].templates.length > 0) {
                                    this.loadDesign(Context.templates[0].categories[0].templates[0].designID, true);
                                }
                                else {
                                    this.design = new MPlaza.Design();
                                    this.design.setModel(this.model);
                                    this.updateDesign();
                                }
                                _a.label = 5;
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                this.customizer.setDesign(null);
                                _a.label = 7;
                            case 7: return [2 /*return*/];
                        }
                    });
                });
            };
            Application.prototype.getAllSides = function () {
                var sides = [];
                this.model.get("colors").each(function (color) {
                    color.get("sides").each(function (side) {
                        if (sides.findIndex(function (x) { return x.id == side.id; }) == -1)
                            sides.push(side);
                    });
                });
                return sides;
            };
            // Load design
            Application.prototype.loadDesign = function (id, isTemplate) {
                var _this = this;
                try {
                    var fontNotInstalled_1 = null;
                    var self_1 = this;
                    if (isNumber(id)) {
                        this.design = new MPlaza.Design({ designID: id });
                    }
                    else {
                        this.design = new MPlaza.Design({ docID: id });
                    }
                    this.design.fetch({
                        success: function (model, response, options) {
                            // Avoid reselect the print type
                            _this.printTypeChosen = true;
                            var fonts = [];
                            // Remove all the design sides, design areas, design sides print types, and the design
                            // items that are in sides that are not included in the filter because this will cause
                            // to make those sides appear in the output files
                            if (Context.productSides.length > 0) {
                                var availableSides = _this.getAllSides();
                                model.get("designItems").filter(function (item) { return item.get("areas")
                                    .find(function (area) { return availableSides.find(function (x) { return x.get("sideID") == area.get("sideID"); }); }) == null; })
                                    .forEach(function (item) { return model.get("designItems").remove(item); });
                                model.get("sidesPrintTypes").filter(function (sidePrint) { return availableSides.find(function (x) { return x.get("sideID") == sidePrint.get("sideID"); }) == null; })
                                    .forEach(function (sidePrint) { return model.get("sidesPrintTypes").remove(sidePrint); });
                                model.get("sides").filter(function (side) { return availableSides.find(function (x) { return x.get("sideID") == side.get("sideID"); }) == null; })
                                    .forEach(function (side) { return model.get("sides").remove(side); });
                                model.get("areas").filter(function (area) { return availableSides.find(function (x) { return x.get("sideID") == area.get("sideID"); }) == null; })
                                    .forEach(function (area) { return model.get("areas").remove(area); });
                            }
                            var items = model.get("designItems");
                            items.each(function (item) {
                                // If design belongs to a template or is a draft design set changed property to false
                                if ((isTemplate && !Context.isTemplateEditor) || (self_1.design.get("isDraft") === true))
                                    item.set('isChanged', false);
                                var json = item.get("json");
                                var data = JSON.parse(json);
                                var attributes = data[1];
                                //Get the global font family or from the first letter (in case of curved text)
                                var font = attributes.fontFamily || (attributes.children && attributes.children.length > 0 && attributes.children[0].length > 1 ? attributes.children[0][1].fontFamily : null);
                                // Trim quotes in fonts
                                if (font) {
                                    // Check if font is installed for this seller
                                    if (Context.fonts.find(function (y) { return y.name == font.replace(/"/g, ""); })) {
                                        fonts.push(font.replace(/"/g, ''));
                                    }
                                    else {
                                        // If the font is not installed, change to arial
                                        attributes.fontFamily = "Arial";
                                        item.set("json", JSON.stringify(data));
                                        fontNotInstalled_1 = font;
                                    }
                                }
                            });
                            if (!Context.isTemplateEditor && fontNotInstalled_1) {
                                _this.layoutManager.showAbort(T._("OPS!", "Customizer"), StringHelper.format(T._("The font {0} can't be loaded -- please contact the website administrator.", "Customizer"), fontNotInstalled_1), function () { return history.back(); });
                                return;
                            }
                            _this.design.get("sidesPrintTypes").filter(function (x) { return x.get("modelID") != _this.model.get("modelID"); }).forEach(function (x) { return _this.design.get("sidesPrintTypes").remove(x); });
                            if (fonts.length > 0) {
                                _this.loadFont(fonts, function () {
                                    _this.updateDesign();
                                });
                            }
                            else {
                                _this.updateDesign();
                            }
                        },
                        error: function (model, response, options) {
                            Logger.error("Error while reading data");
                            Logger.error(response);
                            _this.customizer.setDesign(null);
                            _this.layoutManager.showAbort(T._("Error", "Customizer"), T._("There was an error loading. Click OK to reload the page", "Customizer"), function (dialog) {
                                window.location.reload();
                            });
                        },
                        data: {
                            template: isTemplate,
                            frombackoffice: Context.isDesignEditor
                        }
                    });
                }
                catch (e) {
                    this.customizer.setDesign(null);
                }
            };
            // Update design
            Application.prototype.updateDesign = function () {
                var _this = this;
                this.design.addEventListener('change', _.debounce(function () { return _this.onDesignChanged.apply(_this); }, 300)); // Ensure that onDesignChanged is called with the correct context
                this.customizer.setDesign(this.design);
                // Select the color
                if (!this.design.id) {
                    this.layoutManager.selectColor(this.model.get("colors").get(Context.colorId));
                    this.layoutManager.selectPrintType(this.model.get("printTypes").at(0));
                }
                else {
                    this.color = this.model.get("colors").at(0);
                    this.design.get("designItems").each(function (x) {
                        if (x.get("areas").length > 0) {
                            var colorId = x.get("areas").at(0).get("colorID");
                            _this.color = _this.model.get("colors").get(colorId);
                            return false;
                        }
                    });
                    Context.colorId = this.color.id;
                    this.layoutManager.selectColor(this.color);
                    this.layoutManager.selectPrintType(this.model.get("printTypes").get(this.design.get("printTypeID")));
                }
                this.triggerPrintTypesUpdate();
                // 3D preview
                if (this.preview3dEnabled) {
                    if (!this.isMobile) {
                        this.preview3d.loadModel(this.model, this.color.id);
                    }
                    this.layoutManager.preview3dEnabled = true;
                }
                // Template editor
                if (Context.isTemplateEditor) {
                    this.layoutManager.fillTemplateRestrictionsSides(this.model.get("colors").at(0).get("sides").map(function (side) {
                        var designSide = _this.design.getDesignSide(side);
                        return { side: side, designSide: designSide };
                    }));
                    this.layoutManager.setTemplateSettings({
                        name: this.design.get("name"),
                        categoryId: this.design.get("categories").length > 0 ? this.design.get("categories").at(0).get("categoryID") : -1,
                        hasSyncEnabled: this.design.get("hasSyncEnabled"),
                        canAddImage: this.design.get("canAddImage"),
                        canAddText: this.design.get("canAddText"),
                        maxNrTexts: this.design.get("maxNrTexts"),
                        maxNrImages: this.design.get("maxNrImages"),
                        uploadRestrictions: this.design.get("uploadRestrictions") || {},
                        disableSellerImages: this.design.get("disableSellerImages")
                    });
                }
                this.onItemSelectionChanged(null); // Deselect all and trigger toolbox items update
                this.layoutManager.modelLoading = false;
            };
            // Use the paper context for avoiding paper scope conflicts
            Application.prototype.withPaperContext = function (callback) {
                var oldPaper = paper;
                callback(paper);
                paper = oldPaper;
            };
            // Change font callback for LoadFont
            Application.prototype.changeFont = function (items, font) {
                this.customizer.modifyTextElementsFontFamily(items, font);
            };
            // Match the color 
            Application.prototype.matchColor = function (attributes) {
                if (attributes === void 0) { attributes = Context.attributes; }
                var colorId = null;
                // Find the color
                colorLoop: for (var c = 0; c < this.model.get("colors").length; c++) {
                    try {
                        var color = this.model.get("colors").at(c);
                        var colorAttributes = JSON.parse(color.get("code"));
                        // Check if every color attribute is in the context attributes
                        for (var a = 0; a < colorAttributes.length; a++) {
                            var colorAttribute = colorAttributes[a];
                            var attributeFound = false;
                            for (var i = 0; i < attributes.length; i++) {
                                var attribute = attributes[i];
                                if (attribute.id == colorAttribute.Id && attribute.value == colorAttribute.Value.Id) {
                                    attributeFound = true;
                                    break;
                                }
                            }
                            // If at least one attribute of this color was not found, skip this color
                            if (attributeFound == false)
                                continue colorLoop;
                        }
                        colorId = color.id;
                        break;
                    }
                    catch (error) { }
                }
                return colorId;
            };
            // Add image in canvas
            Application.prototype.addImageToCanvas = function (image, copyItem) {
                var _this = this;
                if (copyItem === void 0) { copyItem = null; }
                // Get print type
                var printTypeId = this.design.get("printTypeID");
                var supportMulticolors = this.printTypeSupportMulticolor(printTypeId);
                if (supportMulticolors == false && image.get("isMulticolor") == true) {
                    if (image.get("format") == "Png") {
                        this.layoutManager.showPngInvalidDialog();
                    }
                    else {
                        var text = T._("SVG format with over 10 colors is not supported for the selected printing method - please choose another printing method or upload/select a SVG file with less than 10 colors.", "Customizer");
                        this.layoutManager.showError(T._("Warning!", "Customizer"), text);
                    }
                    return;
                }
                var callback = function (item) {
                    if (copyItem) {
                        var rot = copyItem.rotation;
                        copyItem.rotation = 0;
                        item.position = copyItem.position;
                        var oldBounds = copyItem.bounds;
                        var newBounds = item.bounds;
                        item.scale(oldBounds.width / newBounds.width);
                        newBounds = item.bounds;
                        if (newBounds.height > oldBounds.height)
                            item.scale(oldBounds.height / newBounds.height);
                        item.rotation = rot;
                    }
                    // If image has colors set by user (recolored by add-on background-recolor), assign them to designitem
                    var designItem = _this.customizer.findDesignItemForItem(item);
                    if (image.get('selectionColors')) {
                        var selectionColors = JSON.parse(image.get('selectionColors'));
                        if (selectionColors.backgroundcolor && selectionColors.backgroundcolor !== 'autodetect') {
                            // Background color selected from user
                            designItem.get('itemColors').push(selectionColors.backgroundcolor);
                        }
                        if (selectionColors.overlaycolor) {
                            // Single overlay color selected from user
                            designItem.get('itemColors').push(selectionColors.overlaycolor);
                        }
                        if (selectionColors.selectedColors) {
                            // List of selected colors from user (multirecoloring enabled)
                            designItem.set('itemColors', designItem.get('itemColors').concat(selectionColors.selectedColors));
                        }
                    }
                    _this.customizer.deselectAll();
                    _this.customizer.setItemSelection(item, true);
                    _this.customizer.updateSelectionState();
                    _this.customizer.onItemUpdated(item);
                    _this.customizer.paper.project.view.update();
                    if (_this.isMobile) {
                        _this.layoutManager.closeToolboxContent();
                    }
                };
                if (!this.customizer.canAddImage() && this.customizer.canEditSelection()) {
                    this.customizer.replaceSelectedImage(image, callback);
                }
                else if (this.customizer.canAddImage()) {
                    this.customizer.insertImage(image, function (item) {
                        callback(item);
                        _this.initSyncForSelectedItem();
                    });
                }
            };
            Application.prototype.printTypeSupportMulticolor = function (printTypeId) {
                var _this = this;
                var byColor = this.elementIsByColor(this.model, printTypeId);
                if (byColor == false)
                    this.model.get("colors").each(function (color) {
                        if (_this.elementIsByColor(color, printTypeId)) {
                            byColor = true;
                            return false;
                        }
                        color.get("sides").each(function (side) {
                            if (_this.elementIsByColor(side, printTypeId)) {
                                byColor = true;
                                return false;
                            }
                            side.get("areas").each(function (area) {
                                if (_this.elementIsByColor(area, printTypeId)) {
                                    byColor = true;
                                    return false;
                                }
                            });
                        });
                    });
                return !byColor;
            };
            Application.prototype.elementIsByColor = function (element, printTypeId) {
                var partPrintType = element.getPrintType(printTypeId);
                if (partPrintType) {
                    var pricing = this.model.get("pricings").get(partPrintType.get("pricingID"));
                    if (pricing && (pricing.get("setupPriceTypeID") == MPlaza.PricingType.PerColor ||
                        pricing.get("designPriceTypeID") == MPlaza.PricingType.PerColor))
                        return true;
                }
                return false;
            };
            // Load user images
            Application.prototype.loadUserImages = function () {
                var _this = this;
                var images = new MPlaza.Images();
                images.fetch({
                    success: function (collection, response, options) {
                        _this.layoutManager.fillUserImages(images);
                    },
                    error: function (collection, response, options) {
                        Logger.info("Error while loading images");
                    }
                });
            };
            // Get preview image
            Application.prototype.getPreviewImage = function (callback, width, height, 
            // model side
            fixedPreviewSide, fixedDesignItems) {
                if (width === void 0) { width = 165; }
                if (height === void 0) { height = 165; }
                // model side
                if (fixedPreviewSide === void 0) { fixedPreviewSide = null; }
                if (fixedDesignItems === void 0) { fixedDesignItems = null; }
                if (!this.design)
                    return;
                var loadedItems = 0;
                var errorStates = [];
                var previewSide = null;
                var designItems = null;
                if (!fixedPreviewSide) {
                    //Find the first customized side, or the last opened, or the first customized side of the list
                    previewSide = this.color.get("sides").models[0];
                    designItems = this.design.getSideDesignItems(previewSide);
                    if (designItems.length == 0) {
                        previewSide = this.customizer.side;
                        designItems = this.design.getSideDesignItems(previewSide);
                        if (designItems.length == 0) {
                            for (var i = 0; i < this.color.get("sides").models.length; i++) {
                                previewSide = this.color.get("sides").models[i];
                                designItems = this.design.getSideDesignItems(previewSide);
                                if (designItems.length > 0)
                                    break;
                            }
                        }
                    }
                }
                else {
                    previewSide = fixedPreviewSide;
                    designItems = fixedDesignItems || this.design.getSideDesignItems(previewSide);
                }
                var previewCanvas = document.createElement("canvas");
                var oldPaper = paper;
                var newPaper = new paper.PaperScope();
                newPaper.setup(previewCanvas);
                // After setup...
                previewCanvas.width = width;
                previewCanvas.height = height;
                previewCanvas.style.width = width + "px";
                previewCanvas.style.height = height + "px";
                newPaper.view.viewSize = [width, height];
                newPaper.view.center = new newPaper.Point(0, 0);
                newPaper.view.update();
                // Side image
                var sideImage = new newPaper.Raster({
                    crossOrigin: 'anonymous',
                    source: previewSide.get("imageUrl")
                });
                newPaper.project.layers[0].addChild(sideImage);
                sideImage.onError = function (message) {
                    errorStates.push({ message: message, source: "Side image" });
                    loadedItems++;
                    finish();
                };
                sideImage.onLoad = function () {
                    sideImage.position = new newPaper.Point(0, 0);
                    loadedItems++;
                    finish();
                };
                // Clipping group
                var masterGroup = new newPaper.Group();
                var paths = [];
                // Find all paths
                for (i = 0; i < previewSide.get("areas").length; i++) {
                    var area = previewSide.get("areas").at(i);
                    var path = newPaper.project.activeLayer.importJSON(area.get("path"));
                    if (path instanceof paper.CompoundPath) {
                        for (var j = 0; j < path.children.length; j++) {
                            paths.push(path.children[j]);
                        }
                    }
                    else
                        paths.push(path);
                }
                // Set them as not selected and remove any guid reference
                paths.forEach(function (path) {
                    path.data = undefined;
                });
                // Create the final compound path
                var clip = new paper.CompoundPath({
                    children: paths
                });
                clip.isClippingArea = true;
                clip.data = undefined;
                masterGroup.addChild(clip);
                // Must be after addChild
                clip.sendToBack();
                clip.fillRule = "nonzero";
                clip.clipMask = true;
                clip.reorient(false, true);
                // Design items
                for (var i = 0; i < designItems.length; i++) {
                    var designItem = designItems[i];
                    var child = newPaper.project.activeLayer.importJSON(designItem.get("json"));
                    masterGroup.addChild(child);
                    if (child instanceof newPaper.Raster) {
                        child.onError = function (message) {
                            errorStates.push({ message: message, source: child });
                            loadedItems++;
                            finish();
                        };
                        child.onLoad = function () {
                            loadedItems++;
                            finish();
                        };
                    }
                    else {
                        loadedItems++;
                        finish();
                    }
                }
                var that = this;
                // Called when all raster are loaded
                function finish() {
                    if (loadedItems != designItems.length + 1)
                        return;
                    if (errorStates.length != 0) {
                        callback(null, errorStates);
                        return;
                    }
                    // Zoom to fit canvas
                    var sx = 1.0;
                    var sy = 1.0;
                    //var allItems = that.customizer.getAllItems(newPaper.project, masterGroup);
                    var allItems = [sideImage, clip];
                    var itemsBounds = that.customizer.getAllItemsBounds(allItems);
                    if (Math.abs(newPaper.view.viewSize.width) > 0.0000001)
                        sx = newPaper.view.viewSize.width / itemsBounds.width;
                    if (Math.abs(newPaper.view.viewSize.height) > 0.0000001)
                        sy = newPaper.view.viewSize.height / itemsBounds.height;
                    var zoomFactor = Math.min(sx, sy);
                    var zoomTo = newPaper.view.zoom * zoomFactor;
                    newPaper.view.zoom = zoomTo;
                    newPaper.view.update();
                    paper = oldPaper;
                    // Wait one frame (ensure paper is redrawed)
                    setTimeout(function () {
                        //document.body.appendChild(previewCanvas);
                        var dataUrl = previewCanvas.toDataURL();
                        callback(dataUrl, errorStates);
                    }, 300);
                }
            };
            Application.prototype.generateMultiplePreviewsPopupContent = function (popup) {
                return __awaiter(this, void 0, void 0, function () {
                    var previewsList, actualSides, that, _i, _a, attributesList, colorId, color, variantNameRow, promises, previewedSides, remaining, i, card, results;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                previewsList = $("<div class='previews-list'></div>");
                                popup.find(".generic-dialog-container").append(previewsList);
                                actualSides = this.color.get("sides").models;
                                that = this;
                                _i = 0, _a = Context.previewAttributes;
                                _b.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 4];
                                attributesList = _a[_i];
                                colorId = that.matchColor(attributesList);
                                if (colorId == null) {
                                    this.layoutManager.showError(T._("Error", "Customizer"), "Color not found for attributes: " + attributesList);
                                    return [3 /*break*/, 4];
                                }
                                color = that.model.get("colors").models.find(function (x) { return x.id == colorId; });
                                if (!color) {
                                    this.layoutManager.showError(T._("Error", "Customizer"), "Color couldn't be found for attributes: " + attributesList);
                                    return [3 /*break*/, 4];
                                }
                                variantNameRow = $("<div class='variant-name-row'>" + color.get("name") + "</div>");
                                previewsList.append(variantNameRow);
                                promises = [];
                                previewedSides = 0;
                                actualSides.forEach(function (side) {
                                    var previewSide = color.get("sides").models.find(function (x) { return x.id == side.id; });
                                    var previewDesignItems = that.design.getSideDesignItems(side);
                                    if (previewDesignItems.length > 0) {
                                        var card = $("<div class='card'><div class='image-container'></div></div>");
                                        previewsList.append(card);
                                        card.append($("<span>" + side.get("name") + "</span>"));
                                        //Generate side preview
                                        var promise = new Promise(function (resolve, reject) {
                                            if (previewSide) {
                                                card.find(".image-container").append($("<img>", { "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=" }));
                                                that.getPreviewImage(function (dataUrl, errorStates) {
                                                    if (errorStates.length != 0) {
                                                        var errorMessage = "";
                                                        errorStates.forEach(function (x) {
                                                            errorMessage = errorMessage + " | " + (x.message);
                                                        });
                                                        console.log(errorMessage);
                                                        reject(errorMessage);
                                                        return;
                                                    }
                                                    var image = $("<img>", { "src": dataUrl });
                                                    card.find("img").attr("src", dataUrl);
                                                    resolve(dataUrl);
                                                }, 512, 512, previewSide, previewDesignItems);
                                            }
                                            else {
                                                var notFoundBox = $("<div>");
                                                notFoundBox.addClass("not-found-box");
                                                notFoundBox.append($("<img>", { "src": "/images/customizer/icons/side_not_available.png" }));
                                                notFoundBox.append($("<span>" + T._("Side not available", "Customizer") + "</span>"));
                                                card.prepend(notFoundBox);
                                                resolve(null);
                                            }
                                        });
                                        promises.push(promise);
                                        previewedSides++;
                                    }
                                });
                                //Generate the empty cards
                                if (!this.isMobile && previewedSides % 3 > 0) {
                                    remaining = previewedSides % 3;
                                    for (i = 0; i < (3 - remaining); i++) {
                                        card = $("<div class='card'><div class='image-container'></div></div>");
                                        card.find(".image-container").append($("<img>", { "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=" }));
                                        card.append($("<span> </span>"));
                                        previewsList.append(card);
                                    }
                                }
                                return [4 /*yield*/, Promise.all(promises)];
                            case 2:
                                results = _b.sent();
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            };
            Application.prototype.getImageCache = function (imageId) {
                var image = _.find(this.imagesCache, function (image) {
                    return image.get("imageID") == imageId;
                });
                return image;
            };
            Application.prototype.loadFont = function (fontFamilies, callback) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var error, fontList, fonts;
                    return __generator(this, function (_a) {
                        error = false;
                        fontList = ["Arial", "Verdana", "Comic Sans MS",
                            "Courier New", "Georgia", "Lucida Console", "Tahoma"];
                        // fontFamilies can be a single string or a list of fonts
                        if (typeof (fontFamilies) === 'string' || fontFamilies instanceof String) {
                            fontFamilies = [fontFamilies];
                        }
                        // If this array have length > 0 is a custom font, else is a system font
                        fontFamilies = _.uniq(_.difference(fontFamilies, fontList));
                        if (fontFamilies.length == 0) {
                            if (callback)
                                callback();
                        }
                        else {
                            // Load async
                            this.isLoadingFont = true;
                            fonts = fontFamilies.map(function (x) {
                                var installedFont = Context.fonts.find(function (y) { return y.name == x.replace(/"/g, ""); });
                                if (!installedFont) {
                                    error = true;
                                }
                                return installedFont;
                            });
                            if (!error) {
                                WebFont.load({
                                    timeout: 200000,
                                    custom: {
                                        families: fonts.map(function (x) { return x.name + (x.variations && x.variations != "" ? ":" + x.variations : ""); }),
                                        urls: fonts.map(function (x) { return x.cssUrl; })
                                    },
                                    active: function () {
                                        _this.isLoadingFont = false;
                                        if (callback)
                                            callback();
                                        // Automatic callback
                                        if (_this.textEditFontLoadCallback) {
                                            _this.textEditFontLoadCallback();
                                            // Clear callback for avoiding multiple calls
                                            _this.textEditFontLoadCallback = null;
                                        }
                                        _this.startFontUpdateInterval();
                                    }
                                });
                            }
                            else {
                                if (callback)
                                    callback();
                                // Automatic callback
                                if (this.textEditFontLoadCallback) {
                                    this.textEditFontLoadCallback();
                                    // Clear callback for avoiding multiple calls
                                    this.textEditFontLoadCallback = null;
                                }
                            }
                            //// Using font face API
                            //fontFamilies.forEach(async (family, idx) => {
                            //    Logger.info("Loading font... " + family);
                            //    var font = this.fonts.find(font => font.family == family);
                            //    if (font) {
                            //        var newFont = new FontFace(font.family, "url(" + font.src + ")", {
                            //            style: font.style || "normal",
                            //            weight: font.weight || "normal"
                            //        });
                            //        (<any>document).fonts.add(newFont);
                            //        newFont.load();
                            //        await newFont.ready;
                            //        Logger.info("Font " + font.family + " loaded.");
                            //        if (idx == fontFamilies.length - 1 && callback)
                            //            callback();
                            //    }
                            //});
                        }
                        return [2 /*return*/];
                    });
                });
            };
            // Share
            Application.prototype.generatePreviewUrl = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.getPreviewImage(function (dataUrl, errorStates) {
                                    if (errorStates.length != 0) {
                                        var errorMessage = "";
                                        errorStates.forEach(function (x) {
                                            errorMessage = errorMessage + " | " + (x.message);
                                        });
                                        console.log(errorMessage);
                                        reject(errorMessage);
                                        return;
                                    }
                                    var url = Zakeke.config.baseApiUrl + "designs/save-share-preview";
                                    $.ajax({
                                        url: url,
                                        data: { preview: dataUrl },
                                        dataType: "json",
                                        type: 'POST'
                                    }).done(function (response) {
                                        resolve(_this.rewriteShareUrl(response.url));
                                    }).fail(function (err) { return reject(err); });
                                }, 512, 512);
                            })];
                    });
                });
            };
            Application.prototype.rewriteShareUrl = function (url) {
                if (document.referrer && this.referrerID === 2) {
                    var path = url.split("/SharedPreview")[1];
                    return document.referrer.split("?")[0] + path;
                }
                return url;
            };
            Application.prototype.onShare = function (url, name) {
                var btn = this.shareButtons[name];
                btn.onShare(url);
            };
            Application.prototype.onReset = function () {
                var _this = this;
                this.layoutManager.showQuestion(T._("Are you sure?", "Customizer"), T._("Do you want to cancel everything and start again?", "Customizer"), function (dialog) {
                    _this.layoutManager.closeDialog(dialog);
                    _this.reloadModel();
                });
            };
            return Application;
        }());
        Customizer.Application = Application;
        //------------------------------------------------------------------------------------
        // ------- Event handler 
        //------------------------------------------------------------------------------------
        var EventHandler = /** @class */ (function () {
            function EventHandler() {
                this.callbacks = [];
            }
            EventHandler.prototype.add = function (callback) {
                this.callbacks.push(callback);
            };
            EventHandler.prototype.trigger = function (params) {
                for (var i = 0; i < this.callbacks.length; i++) {
                    var callback = this.callbacks[i];
                    if (callback)
                        callback(params);
                }
            };
            return EventHandler;
        }());
        Customizer.EventHandler = EventHandler;
        // Enums, structures, ecc
        var ToolboxItem = /** @class */ (function () {
            function ToolboxItem() {
            }
            ToolboxItem.Homepage = "homepage";
            ToolboxItem.ZoomIn = "zoom-in";
            ToolboxItem.ZoomOut = "zoom-out";
            ToolboxItem.Duplicate = "duplicate";
            ToolboxItem.Mirror = "mirror";
            ToolboxItem.MirrorX = "mirror-x";
            ToolboxItem.MirrorY = "mirror-y";
            ToolboxItem.MoveUp = "move-up";
            ToolboxItem.MoveDown = "move-down";
            ToolboxItem.MoveUpDown = "move-up-down";
            ToolboxItem.CenterPosition = "center-position";
            ToolboxItem.ImagesMacroCategories = "images-macro-categories";
            ToolboxItem.ImagesCategories = "images-categories";
            ToolboxItem.ImagesList = "images-list";
            ToolboxItem.UploadImage = "master-upload-image";
            ToolboxItem.ChooseUpload = "upload-image";
            ToolboxItem.Text = "text";
            ToolboxItem.SvgColors = "svg-colors";
            ToolboxItem.EditText = "edit-text";
            ToolboxItem.Colors = "colors";
            ToolboxItem.Sides = "sides";
            ToolboxItem.PrintTypes = "print-types";
            ToolboxItem.ImageFilters = "image-filters";
            ToolboxItem.Templates = "templates";
            ToolboxItem.Settings = "settings";
            ToolboxItem.ElementRestrictions = "element-constraints";
            ToolboxItem.Blank = "blank";
            ToolboxItem.DraftDesigns = "draft-designs";
            ToolboxItem.PreviewDesignsPDF = "preview-pdf";
            return ToolboxItem;
        }());
        Customizer.ToolboxItem = ToolboxItem;
        var TextAlign = /** @class */ (function () {
            function TextAlign() {
            }
            TextAlign.Left = "left";
            TextAlign.Right = "right";
            TextAlign.Center = "center";
            return TextAlign;
        }());
        Customizer.TextAlign = TextAlign;
        var Attribute = /** @class */ (function () {
            function Attribute(id, value) {
                this.id = id;
                this.value = value;
            }
            return Attribute;
        }());
        Customizer.Attribute = Attribute;
        var CustomizerMode;
        (function (CustomizerMode) {
            CustomizerMode[CustomizerMode["Buy"] = 0] = "Buy";
            CustomizerMode[CustomizerMode["Edit"] = 1] = "Edit";
            CustomizerMode[CustomizerMode["TemplateEditor"] = 2] = "TemplateEditor";
            CustomizerMode[CustomizerMode["DesignEditor"] = 3] = "DesignEditor";
        })(CustomizerMode = Customizer.CustomizerMode || (Customizer.CustomizerMode = {}));
        var Context = /** @class */ (function () {
            function Context() {
            }
            Context.mode = CustomizerMode.Buy;
            Context.culture = "en-US";
            Context.taxPricesPolicy = Customizer.TaxPricesPolicy.Hidden;
            Context.currency = "EUR";
            Context.quantity = 1;
            Context.attributes = [];
            Context.previewAttributes = [];
            Context.cartButtonText = null;
            Context.availableImages = [];
            Context.fonts = [];
            Context.templates = [];
            Context.draftDesigns = [];
            Context.isTemplateEditor = false;
            Context.isDesignEditor = false;
            Context.templateFilter = undefined;
            Context.productSides = [];
            Context.managedShare = false;
            Context.hideVariants = false;
            Context.previewImageSize = {
                height: 200,
                width: 200
            };
            Context.canSaveDesign = true;
            return Context;
        }());
        Customizer.Context = Context;
        Customizer.FontStretches = [
            "unused",
            "ultra-condensed",
            "extra-condensed",
            "condensed",
            "semi-condensed",
            "normal",
            "semi-expanded",
            "expanded",
            "extra-expanded",
            "ultra-expanded"
        ];
        var Font = /** @class */ (function () {
            function Font(id, name, cssUrl, imageUrl, variations, stretches) {
                this.id = id;
                this.name = name;
                this.cssUrl = cssUrl;
                this.imageUrl = imageUrl;
                this.variations = variations;
                this.stretches = [];
                for (var _i = 0, _a = stretches.split(","); _i < _a.length; _i++) {
                    var x = _a[_i];
                    var data = x.split("="); // Split stretch and weight
                    this.stretches.push(new FontStretch(parseInt(data[0]), parseInt(data[1])));
                }
            }
            return Font;
        }());
        Customizer.Font = Font;
        var FontStretch = /** @class */ (function () {
            function FontStretch(index, weight) {
                this.index = index;
                this.weight = weight;
                this.stretch = Customizer.FontStretches[index];
            }
            return FontStretch;
        }());
        Customizer.FontStretch = FontStretch;
        var EventMessages;
        (function (EventMessages) {
            EventMessages[EventMessages["DPIWarning"] = 1] = "DPIWarning";
            EventMessages[EventMessages["UploadLimitReached"] = 2] = "UploadLimitReached";
            EventMessages[EventMessages["WelcomeMessage"] = 3] = "WelcomeMessage";
            EventMessages[EventMessages["AddToCartConfirmation"] = 4] = "AddToCartConfirmation";
            EventMessages[EventMessages["MultiplePreviewsPopup"] = 5] = "MultiplePreviewsPopup";
        })(EventMessages = Customizer.EventMessages || (Customizer.EventMessages = {}));
        var UserReferrer;
        (function (UserReferrer) {
            UserReferrer[UserReferrer["None"] = 1] = "None";
            UserReferrer[UserReferrer["Shopify"] = 2] = "Shopify";
            UserReferrer[UserReferrer["CodeCanyon"] = 3] = "CodeCanyon";
            UserReferrer[UserReferrer["BigCommerce"] = 4] = "BigCommerce";
            UserReferrer[UserReferrer["ShirtTools"] = 5] = "ShirtTools";
        })(UserReferrer = Customizer.UserReferrer || (Customizer.UserReferrer = {}));
        // Utilities
        function rgb2hex(rgb) {
            var match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
        }
        Customizer.rgb2hex = rgb2hex;
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        Customizer.hexToRgb = hexToRgb;
        function rgbToString(rgb) {
            return "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
        }
        Customizer.rgbToString = rgbToString;
        function openWindow(url, name, width, height) {
            var left = (screen.width - width) / 2;
            var top = (screen.height - height) / 2;
            return window.open(url, name, "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top + ",menubar=no,location=no,status=no,toolbar=no");
        }
        Customizer.openWindow = openWindow;
        function isNumber(obj) {
            return isNaN(parseInt(obj));
        }
        Customizer.isNumber = isNumber;
        // DOM Ready
        $(document).ready(function () {
            $("#btn-search-images").on("click", function () {
                var request = $("#input-online-images").val();
                // if the request has at least one character...
                if (request != "") {
                    // ajax call
                    var endpointURL = Zakeke.config.baseApiUrl + 'searchimages';
                    $.post(endpointURL, {
                        query: request,
                        lang: Context.culture
                    }).done(function (response) {
                    }).fail(function (response) {
                    }).always(function (data, status) {
                        alert("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                    });
                }
            });
        });
    })(Customizer = Zakeke.Customizer || (Zakeke.Customizer = {}));
})(Zakeke || (Zakeke = {}));
