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
        var TaxPricesPolicy;
        (function (TaxPricesPolicy) {
            TaxPricesPolicy[TaxPricesPolicy["PricesIncludingTax"] = 0] = "PricesIncludingTax";
            TaxPricesPolicy[TaxPricesPolicy["PricesExcludingTax"] = 1] = "PricesExcludingTax";
            TaxPricesPolicy[TaxPricesPolicy["Hidden"] = 2] = "Hidden";
        })(TaxPricesPolicy = Customizer.TaxPricesPolicy || (Customizer.TaxPricesPolicy = {}));
        var Addon = /** @class */ (function () {
            function Addon(AddonName, SubscriptionAddonID) {
                this.AddonName = AddonName;
                this.SubscriptionAddonID = SubscriptionAddonID;
            }
            return Addon;
        }());
        var BackgroundRule = /** @class */ (function () {
            function BackgroundRule() {
                this.ColorList = null;
                this.AutoBackgroundRemove = false;
                this.EnableMultiRecoloring = true;
            }
            return BackgroundRule;
        }());
        Customizer.BackgroundRule = BackgroundRule;
        var LayoutManager = /** @class */ (function () {
            function LayoutManager() {
                // DOM cache
                this.mainLayout = $("#main-layout");
                this.toolbox = $("#toolbox");
                this.toolboxContent = $("#toolbox-content");
                this.customizerContainer = $("#customizer-container");
                this.preview3dContainer = $("#preview3d-container");
                this.btnBuy = $("#btn-buy");
                this.btnDuplicateTemplate = $("#btn-duplicate-template");
                this.btnShare = $("#btn-share");
                this.btnSaveDesign = $('#btn-save-design');
                this.btnSaveDesignWait = $('#btn-save-design-wait');
                this.btnBuyWait = $("#btn-buy-wait");
                this.btnPreviewPDF = $('#btn-preview-pdf');
                this.modelColors = $("#model-colors");
                this.sides = $("#sides");
                this.productInfo = $("#product-info");
                this.svgColors = $("#svg-colors");
                this.zoomContainer = $("#zoom-buttons-container");
                this.imagesMacroCategories = this.toolboxContent.find("#toolbox-images-macro-categories");
                this.imagesCategories = this.toolboxContent.find("#toolbox-images-categories");
                this.imagesList = this.toolboxContent.find("#toolbox-images-list");
                this.imagesFilter = this.toolboxContent.find("#images-search-container input");
                this.btnMasterUploadImage = this.toolboxContent.find("#btn-master-upload-image");
                this.uploadOptions = this.toolboxContent.find("#btn-master-upload-image+div.upload-buttons");
                this.btnUploadImage = this.toolboxContent.find("#btn-toolbox-upload-image");
                this.btnUploadPdf = this.toolboxContent.find("#btn-toolbox-upload-pdf");
                this.btnUploadFacebook = this.toolboxContent.find("#btn-toolbox-import-facebook");
                this.btnUploadInstagram = this.toolboxContent.find("#btn-toolbox-import-instagram");
                this.pbUploadImageProgress = this.toolboxContent.find("#pb-toolbox-upload-image-progress");
                this.pbUploadPdfProgress = this.toolboxContent.find("#pb-toolbox-upload-image-pdf-progress");
                this.btnRecolorUploadImage = this.toolboxContent.find("#btn-upload-with-recoloring");
                this.uploadImageFileInput = this.toolboxContent.find("#upload-image-file");
                this.uploadPdfFileInput = this.toolboxContent.find("#upload-image-file-pdf");
                this.userImagesList = this.toolboxContent.find("#toolbox-user-images-list");
                this.userID = -1;
                this.cbTemplatesCategories = $("#cb-templates-categories");
                this.templatesList = $("#templates");
                this.draftDesignList = $('#draft-designs');
                this.draftDesignTags = $('#draft-design-tags');
                this.noDraftDesigns = $('#no-draft-designs');
                this.imageColorOverlayPicker = this.toolboxContent.find('#image-overlay-colorpicker');
                this.imageColorBackgroundPicker = this.toolboxContent.find('#image-background-colorpicker');
                this.imageToRecoloredCanvas = this.toolboxContent.find("#preview-image-to-recolored")[0];
                this.backgroundColorMode = this.toolboxContent.find('input[name=detectbackgroundcolormode]');
                this.canvasAreaImagePreview = this.toolboxContent.find('.canvas-area-image-preview');
                this.colorListForImageSection = this.toolboxContent.find("#color-list-for-recoloring");
                this.selectedPage = null;
                this.isImageFilterAvailable = true;
                this.eyedropperIsActive = false;
                this.isMobile = false;
                // Parameters for colors recognizer plugin
                this.thresholdRecognizeColors = 10;
                this.percMinOccurrencesColors = .5;
                this.scale = 1;
                // Parameters for colors replacement plugin
                this.thresholdReplaceColors = 2.3;
                // Max num color changeable
                this.maxChangeableColors = 10;
                // Active Addons
                this.activeAddons = null;
                // Active BackgroundColorRule
                this.backgroundRecolorRule = null;
                // Events
                this.onBuy = new Customizer.EventHandler();
                this.onToolboxAction = new Customizer.EventHandler();
                this.onZoomToolClicked = new Customizer.EventHandler();
                this.onModelColorSelected = new Customizer.EventHandler();
                this.onSideSelected = new Customizer.EventHandler();
                this.onPreview3dExpanded = new Customizer.EventHandler();
                this.onPreview3dCollapsed = new Customizer.EventHandler();
                this.onSvgColorChanged = new Customizer.EventHandler();
                this.onPreviewRequested = new Customizer.EventHandler();
                this.onShareRequested = new Customizer.EventHandler();
                this.onResetRequested = new Customizer.EventHandler();
                this.onUpdateDuplicateTemplateRequested = new Customizer.EventHandler();
                this.onDuplicateTemplateRequested = new Customizer.EventHandler();
                this.onDuplicateTemplateClosed = new Customizer.EventHandler();
                this.onPreviewDesignsPDF = new Customizer.EventHandler();
                // Design draft events
                this.onSaveDesign = new Customizer.EventHandler();
                this.onDesignDraftSelected = new Customizer.EventHandler();
                this.onDesignDraftDeleted = new Customizer.EventHandler();
                this.onDialogSaveDraftDesign = new Customizer.EventHandler();
                this.onDialogSaveCopyDraftDesign = new Customizer.EventHandler();
                // Text toolbox events
                this.onAddAnotherText = new Customizer.EventHandler();
                this.onAddText = new Customizer.EventHandler();
                this.onAddDefaultText = new Customizer.EventHandler();
                this.onUpdateText = new Customizer.EventHandler();
                this.onTextPathChanged = new Customizer.EventHandler();
                this.onTextAreaChanged = new Customizer.EventHandler();
                this.onTextStyleChanged = new Customizer.EventHandler();
                this.onTextAlignChanged = new Customizer.EventHandler();
                this.onTextFontChanged = new Customizer.EventHandler();
                this.onTextContentChanged = new Customizer.EventHandler();
                this.onTextColorChanged = new Customizer.EventHandler();
                // Images toolbox events
                this.onImagesCategoriesFillRequest = new Customizer.EventHandler();
                this.onImagesFillRequest = new Customizer.EventHandler();
                this.onImagesFacebookFillRequest = new Customizer.EventHandler();
                this.onImagesInstagramFillRequest = new Customizer.EventHandler();
                this.onImageSelected = new Customizer.EventHandler();
                this.onImageDeleted = new Customizer.EventHandler();
                this.onImageFacebookClicked = new Customizer.EventHandler();
                this.onImageInstagramClicked = new Customizer.EventHandler();
                // Image edit event
                this.onImageConvertedEdit = new Customizer.EventHandler();
                // Upload toolbox event
                this.onUploadImageSelected = new Customizer.EventHandler();
                this.onUploadImageFiltered = new Customizer.EventHandler();
                this.onUploadPdfSelected = new Customizer.EventHandler();
                this.onUploadPdfFiltered = new Customizer.EventHandler();
                // Upload restrictions
                this.uploadFileRestrictions = {};
                // Templates events
                this.onTemplateSelected = new Customizer.EventHandler();
                this.onTemplateSyncChange = new Customizer.EventHandler();
                this.onElementConstraintChanged = new Customizer.EventHandler();
                this.onElementConstraintUpdateRequested = new Customizer.EventHandler();
                // Print types toolbox events
                this.onPrintTypeSelected = new Customizer.EventHandler();
                //PhotoEditorSDK initialize
                this.onPhotoEditorSDKOpening = new Customizer.EventHandler();
                this.currentColor = null;
            }
            Object.defineProperty(LayoutManager.prototype, "imageFiltersEnabled", {
                // Properties
                set: function (enabled) {
                    this.isImageFilterAvailable = enabled;
                    if (enabled) {
                        if (this.isMobile)
                            $(".toolbox > .toolbox-item[data-name='image-filters'] > span").text(T._("Image Editing", "Customizer"));
                        else
                            this.toolbox.find(".toolbox-item[data-name='image-filters'] > .toolbox-item-label").text(T._("Image Editing", "Customizer"));
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "buyButtonText", {
                set: function (str) {
                    this.btnBuy.children("span").text(str);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "buyEnabled", {
                set: function (enabled) {
                    if (!enabled) {
                        this.btnBuy.attr("disabled", "disabled");
                        this.btnDuplicateTemplate.attr("disabled", "disabled");
                        this.btnSaveDesign.attr("disabled", "disabled");
                    }
                    else {
                        this.btnBuy.removeAttr("disabled");
                        this.btnDuplicateTemplate.removeAttr("disabled");
                        this.btnSaveDesign.removeAttr("disabled");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "buyProgress", {
                set: function (enabled) {
                    if (enabled) {
                        this.btnBuy.hide();
                        this.btnBuyWait.show();
                        this.btnBuyWait.css("display", "flex"); // Fix on mobile where display is set as list-item
                    }
                    else {
                        this.btnBuy.show();
                        this.btnBuyWait.hide();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "saveDesignProgress", {
                // btn-save-design-wait
                set: function (enabled) {
                    if (enabled) {
                        this.btnSaveDesign.hide();
                        this.btnSaveDesignWait.show();
                        this.btnSaveDesignWait.css("display", "flex"); // Fix on mobile where display is set as list-item
                    }
                    else {
                        this.btnSaveDesign.show();
                        this.btnSaveDesignWait.hide();
                    }
                },
                enumerable: true,
                configurable: true
            });
            LayoutManager.prototype.setBtnSaveDesignVisible = function (visible) {
                if (visible) {
                    this.btnSaveDesign.show();
                    this.setToolboxItemEnabled(Customizer.ToolboxItem.DraftDesigns, true);
                }
                else {
                    this.btnSaveDesign.hide();
                    this.setToolboxItemEnabled(Customizer.ToolboxItem.DraftDesigns, false);
                }
            };
            LayoutManager.prototype.setBtnShareVisible = function (visible) {
                if (visible)
                    this.btnShare.show();
                else
                    this.btnShare.hide();
            };
            Object.defineProperty(LayoutManager.prototype, "uploadImageEnabled", {
                set: function (enabled) {
                    if (!enabled)
                        this.btnUploadImage.attr("disabled", "disabled");
                    else
                        this.btnUploadImage.removeAttr("disabled");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "uploadPdfEnabled", {
                set: function (enabled) {
                    if (!enabled)
                        this.btnUploadPdf.attr("disabled", "disabled");
                    else
                        this.btnUploadPdf.removeAttr("disabled");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "uploadImageProgress", {
                set: function (progress) {
                    this.uploadOptions.removeClass('opened');
                    this.pbUploadImageProgress.children("div").css("width", progress + "%");
                    this.pbUploadImageProgress.next().text(Math.round(progress) == 100 ?
                        T._("processing...", "Customizer")
                        : T._("uploading...", "Customizer") + Math.round(progress) + "%");
                    if (progress == 0) {
                        this.pbUploadImageProgress.slideUp().next().slideUp();
                    }
                    else {
                        this.pbUploadImageProgress.slideDown().next().slideDown();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "uploadPdfProgress", {
                set: function (progress) {
                    this.uploadOptions.removeClass('opened');
                    this.pbUploadPdfProgress.children("div").css("width", progress + "%");
                    this.pbUploadPdfProgress.next().text(Math.round(progress) == 100 ?
                        T._("processing...", "Customizer")
                        : T._("uploading...", "Customizer") + Math.round(progress) + "%");
                    if (progress == 0) {
                        this.pbUploadPdfProgress.slideUp().next().slideUp();
                    }
                    else {
                        this.pbUploadPdfProgress.slideDown().next().slideDown();
                    }
                },
                enumerable: true,
                configurable: true
            });
            LayoutManager.prototype.resetUploadImageForm = function () {
                this.uploadImageFileInput.val("");
                this.uploadImageEnabled = true;
                this.uploadImageProgress = 0;
            };
            LayoutManager.prototype.resetUploadPdfForm = function () {
                this.uploadPdfFileInput.val("");
                this.uploadPdfEnabled = true;
                this.uploadPdfProgress = 0;
            };
            Object.defineProperty(LayoutManager.prototype, "toolboxLoading", {
                set: function (loading) {
                    if (loading) {
                        this.toolboxContent.children(".loading").show();
                    }
                    else {
                        this.toolboxContent.children(".loading").hide();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "modelLoading", {
                set: function (loading) {
                    if (loading) {
                        this.customizerContainer.children(".loading").show();
                    }
                    else {
                        this.customizerContainer.children(".loading").hide();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutManager.prototype, "preview3dEnabled", {
                set: function (enabled) {
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(LayoutManager.prototype, "preview3dLoading", {
                set: function (loading) {
                    if (loading) {
                        this.preview3dContainer.children(".loading").show();
                    }
                    else {
                        this.preview3dContainer.children(".loading").hide();
                    }
                },
                enumerable: true,
                configurable: true
            });
            LayoutManager.prototype.loadScript = function (src) {
                return new Promise(function (resolve, reject) {
                    var script = document.createElement("script");
                    script.onload = resolve;
                    script.src = src;
                    document.body.appendChild(script);
                });
            };
            LayoutManager.prototype.initLocalitazion = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var lang;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                lang = Customizer.Context.culture;
                                // Try zh-TW
                                if (Zakeke.config.avaibleLanguages.indexOf(lang) == -1)
                                    lang = Customizer.Context.culture.substring(0, 2);
                                // Try zh
                                if (Zakeke.config.avaibleLanguages.lastIndexOf(lang) == -1)
                                    lang = "en";
                                return [4 /*yield*/, this.loadScript("/Scripts/localizations/" + lang.toLowerCase() + "/customizer.js")];
                            case 1:
                                _a.sent();
                                // Master Upload image page
                                this.btnMasterUploadImage.children("span").text(T._("Upload your image", "Customizer"));
                                // Upload image page
                                this.btnUploadImage.children("span").text(T._("From your device", "Customizer"));
                                $("#btn-toolbox-import-facebook > span").text(T._("Facebook", "Customizer"));
                                $("#btn-toolbox-import-instagram > span").text(T._("Instagram", "Customizer"));
                                // Clipart and images page
                                $("#input-online-images").attr("placeholder", T._("Search online images", "Customizer"));
                                // Text page
                                $("#lbl-toolbox-text-font").text(T._("Font", "Customizer"));
                                $("#opt-toolbox-text-font-last").text(T._("Last fonts used", "Customizer"));
                                $("#opt-toolbox-text-font-font").text(T._("Fonts", "Customizer"));
                                $("#lbl-toolbox-text-path").text(T._("Curved", "Customizer"));
                                $("#lbl-toolbox-text-area").text(T._("Text area", "Customizer"));
                                $("#lbl-toolbox-text-style").text(T._("Style", "Customizer"));
                                $("#lbl-toolbox-text-alignment").text(T._("Alignment", "Customizer"));
                                $("#lbl-toolbox-text-color").text(T._("Color", "Customizer"));
                                // Cart
                                switch (Customizer.Context.mode) {
                                    case Customizer.CustomizerMode.Buy:
                                        this.btnBuy.find("i").text("shopping_cart");
                                        this.btnBuy.find("span").text(T._("Add to Cart", "Customizer"));
                                        break;
                                    case Customizer.CustomizerMode.Edit:
                                        this.btnBuy.find("i").text("save");
                                        this.btnBuy.find("span").text(T._("Save changes", "Customizer"));
                                        break;
                                    case Customizer.CustomizerMode.TemplateEditor:
                                    case Customizer.CustomizerMode.DesignEditor:
                                        this.btnBuy.find("i").text("save");
                                        this.btnBuy.find("span").text(T._("Save changes", "Customizer"));
                                        break;
                                    default:
                                        throw new Error("Unknow mode " + Customizer.Context.mode);
                                }
                                // Override with query string cartButtonText
                                if (Customizer.Context.cartButtonText != null) {
                                    this.btnBuy.find("span").text(Customizer.Context.cartButtonText);
                                }
                                // Background remove and recolor Add-on
                                $('div.toolbox-page[data-name="recolor-image"]').find('label.header').text(T._("Remove background", "Customizer"));
                                $('div.toolbox-page[data-name="recolor-image"]').find('span.header-toolbox-page').text(T._("Recolor image", "Customizer"));
                                $('#lblRadioAutoDetectBC > input').before(T._("Auto detect background", "Customizer"));
                                $('#lblRadioManualSelectBC > input').before(T._("Manually select background", "Customizer"));
                                $('#lblRadioNoneBC > input').before(T._("No remove", "Customizer"));
                                $('#color-list-for-recoloring > label.header').text(T._("Pick a color to recolor your image", "Customizer"));
                                $('#btn-upload-with-recoloring span').text(T._("Upload image", "Customizer"));
                                $('#alert-unselected-colors p').text(T._("You must change all image colors", "Customizer"));
                                return [2 /*return*/];
                        }
                    });
                });
            };
            // Custom user colors
            LayoutManager.prototype.setUserColor = function (info) {
                if (info != null) {
                    $("<link rel='stylesheet' href='" + info.styleUrl + "' type='text/css' media='screen'/>").appendTo($("head"));
                    // Hide/show brand
                    if (info.brand) {
                        $("#img-brand").fadeIn();
                    }
                    //Color toolbox filter icon
                    if (!this.isMobile)
                        $(".toolbox-item[data-name='image-filters'] > svg circle").css("fill", info.iconColor);
                }
            };
            // Font list
            LayoutManager.prototype.filterFontByID = function (userID) {
                this.userID = userID;
                // Rubinia -> 76
                if (userID == 76) {
                    $("#btn-toolbox-text-bold").remove();
                    $("#btn-toolbox-text-italic").remove();
                    $("#svg-colors").remove();
                    $("#lbl-toolbox-text-style").remove();
                    $("#cb-toolbox-text-font option[value!='Steelfish'][value!='Angelface']").remove();
                    $("#cb-toolbox-edit-text-font option[value!='Steelfish'][value!='Angelface']").remove();
                }
                else {
                    //$("#cb-toolbox-text-font option[value='Steelfish'], #cb-toolbox-text-font option[value='Angelface']").remove();
                    //$("#cb-toolbox-edit-text-font option[value='Steelfish'], #cb-toolbox-edit-text-font option[value='Angelface']").remove();
                }
                $("select").combobox("refreshItems");
                //First font
                this.toolboxContent.find("#cb-toolbox-text-font").combobox("value", userID == 76 ? "Steelfish" : "Adamina");
                this.toolboxContent.find("#cb-toolbox-edit-text-font").combobox("value", userID == 76 ? "Steelfish" : "Adamina");
            };
            // Initialization
            LayoutManager.prototype.init = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                });
            };
            ;
            LayoutManager.prototype.setToolboxItemEnabled = function (itemName, enabled) {
                var item = $(document.body).find(".toolbox-item[data-name='" + itemName + "'], #toolbox-homepage-items > li[data-name='" + itemName + "']");
                //This is because in mobile we have the same 2 icons for adding images in 2 different toolboxes
                //if (this.isMobile)
                //    item = item.first();
                if (enabled)
                    item.show();
                else
                    item.hide();
            };
            LayoutManager.prototype.isToolboxItemEnabled = function (itemName) {
                var item = $(document.body).find(".toolbox-item[data-name='" + itemName + "'], #toolbox-homepage-items > li[data-name='" + itemName + "']");
                return item.is(":visible");
            };
            LayoutManager.prototype.setToolboxItemActive = function (itemName, active) {
                var item = $(document.body).find(".toolbox-item[data-name='" + itemName + "'], #toolbox-homepage-items > li[data-name='" + itemName + "']");
                if (active)
                    item.removeClass("inactive");
                else
                    item.addClass("inactive");
            };
            LayoutManager.prototype.isToolboxItemActive = function (itemName) {
                var item = $(document.body).find(".toolbox-item[data-name='" + itemName + "'], #toolbox-homepage-items > li[data-name='" + itemName + "']");
                return !item.hasClass("inactive");
            };
            LayoutManager.prototype.getImageUploadAllowedMIME = function () {
                var mimes = [];
                if (this.uploadFileRestrictions.isJpgAllowed)
                    mimes.push("image/jpeg");
                if (this.uploadFileRestrictions.isPngAllowed)
                    mimes.push("image/png");
                if (this.uploadFileRestrictions.isSvgAllowed)
                    mimes.push("image/svg+xml");
                return mimes.join(", ");
            };
            LayoutManager.prototype.updateFileUploadRestrictions = function (settings) {
                this.uploadFileRestrictions = settings;
                var pdfEpsButtonEnabled = this.setUIForPDFAddon();
                var userImagesButtonEnabled = this.updateUserImageAllowed();
                var facebookButtonEnabled = this.updateFacebookAllowed();
                var instagramButtonEnabled = this.updateInstagramAllowed();
                if (this.isToolboxItemEnabled(Customizer.ToolboxItem.UploadImage) && (pdfEpsButtonEnabled || userImagesButtonEnabled || facebookButtonEnabled || instagramButtonEnabled) && !Customizer.Context.isTemplateEditor)
                    this.setToolboxItemEnabled(Customizer.ToolboxItem.UploadImage, true);
                else
                    this.setToolboxItemEnabled(Customizer.ToolboxItem.UploadImage, false);
            };
            LayoutManager.prototype.updateUserImageAllowed = function () {
                if (this.uploadFileRestrictions.isUserImageAllowed) {
                    this.btnUploadImage.siblings("input").prop("accept", this.getImageUploadAllowedMIME());
                    this.btnUploadImage.show();
                    return true;
                }
                else {
                    this.btnUploadImage.hide();
                    return false;
                }
            };
            LayoutManager.prototype.updateFacebookAllowed = function () {
                if (this.uploadFileRestrictions.isFacebookAllowed) {
                    this.btnUploadFacebook.show();
                    return true;
                }
                else {
                    this.btnUploadFacebook.hide();
                    return false;
                }
            };
            LayoutManager.prototype.updateInstagramAllowed = function () {
                if (this.uploadFileRestrictions.isInstagramAllowed) {
                    this.btnUploadInstagram.show();
                    return true;
                }
                else {
                    this.btnUploadInstagram.hide();
                    return false;
                }
            };
            // Set UI for PDF Addon
            LayoutManager.prototype.setUIForPDFAddon = function () {
                // Remove upload PDF if not allowed
                if (this.activeAddons == null ||
                    ((this.activeAddons.find(function (a) { return a.AddonName === "PDF_EPS"; }) === undefined || (!this.uploadFileRestrictions.isPdfAllowed && !this.uploadFileRestrictions.isEpsAllowed)) &&
                        (this.activeAddons.find(function (a) { return a.AddonName === "PDF"; }) === undefined || !this.uploadFileRestrictions.isPdfAllowed) &&
                        (this.activeAddons.find(function (a) { return a.AddonName === "EPS"; }) === undefined || !this.uploadFileRestrictions.isEpsAllowed))) {
                    this.btnUploadPdf.hide();
                    this.btnMasterUploadImage.children("span").text(T._("Upload your image", "Customizer"));
                    return false;
                }
                else {
                    if ((this.activeAddons.find(function (a) { return a.AddonName === "PDF_EPS"; }) !== undefined) && this.uploadFileRestrictions.isPdfAllowed && this.uploadFileRestrictions.isEpsAllowed) {
                        this.btnUploadPdf.children("span").text(T._("PDF/EPS", "Customizer"));
                        $("#toolbox-homepage-items > li[data-name='master-upload-image']  span").html(T._("Upload<br />image, PDF or EPS", "Customizer"));
                        this.btnMasterUploadImage.children("span").text(T._("Upload your image, PDF or EPS", "Customizer"));
                    }
                    else if ((this.activeAddons.find(function (a) { return a.AddonName === "PDF"; }) !== undefined) && this.uploadFileRestrictions.isPdfAllowed) {
                        this.btnUploadPdf.children("span").text(T._("PDF", "Customizer"));
                        $("#toolbox-homepage-items > li[data-name='master-upload-image']  span").html(T._("Upload<br />image or PDF", "Customizer"));
                        this.btnMasterUploadImage.children("span").text(T._("Upload your image or PDF", "Customizer"));
                    }
                    else if ((this.activeAddons.find(function (a) { return a.AddonName === "EPS"; }) !== undefined) && this.uploadFileRestrictions.isEpsAllowed) {
                        this.btnUploadPdf.children("span").text(T._("EPS", "Customizer"));
                        $("#toolbox-homepage-items > li[data-name='master-upload-image']  span").html(T._("Upload<br />image or EPS", "Customizer"));
                        this.btnMasterUploadImage.children("span").text(T._("Upload your image or EPS", "Customizer"));
                    }
                    this.btnUploadPdf.show();
                    return true;
                }
            };
            LayoutManager.prototype.getRecolorImageToUploaded = function (colorlist) {
                if (colorlist && colorlist.length > 0) {
                    var selectedColor = this.colorListForImageSection.find('li.checked input');
                    return selectedColor ? selectedColor.val() : null;
                }
                else
                    return this.imageColorOverlayPicker.data('color');
            };
            LayoutManager.prototype.setTextColorEnabled = function (enabled) {
                var item = this.toolboxContent.find("#toolbox-text-color-row");
                if (enabled)
                    item.show();
                else
                    item.hide();
            };
            LayoutManager.prototype.setTextColorPickerEnabled = function (enabled, pantoneEnabled, textColors) {
                if (enabled) {
                    $("#toolbox-text-colorpicker, #toolbox-edit-text-colorpicker").css("display", "unset");
                    $("#text-colors, #edit-text-colors").removeClass("large-palette");
                    $("#text-colors, #edit-text-colors").addClass("col-2");
                }
                else {
                    $("#toolbox-text-colorpicker, #toolbox-edit-text-colorpicker").css("display", "none");
                    $("#text-colors, #edit-text-colors").removeClass("col-2");
                    $("#text-colors, #edit-text-colors").addClass("large-palette");
                }
                if (pantoneEnabled && enabled) {
                    $("#text-colors, #edit-text-colors").hide();
                }
            };
            LayoutManager.prototype.setCanAddText = function (enabled) {
                if (enabled) {
                    $("#btn-toolbox-text-add").show();
                }
                else {
                    $("#btn-toolbox-text-add").hide();
                    $("#btn-toolbox-text-add").hide();
                }
            };
            LayoutManager.prototype.selectStretch = function (stretch) {
                this.toolboxContent.find("#toolbox-text-font-stretches-row input[value='" + stretch + "']").click();
            };
            LayoutManager.prototype.onUploadRecolorImageEvent = function (event) {
                var files = this.uploadImageFileInput.prop("files");
                if (!files || files.length == 0)
                    return;
                var file = files[0];
                this.onUploadImageSelected.trigger({ file: file, callback: null });
            };
            LayoutManager.managedShare = function (url) {
                if (window === window.parent) {
                    return;
                }
                window.parent.postMessage({
                    zakekeMessageType: "Share",
                    preview: url
                }, '*');
            };
            LayoutManager.fitImageToCanvas = function (canvas, image, paddingX, paddingY) {
                canvas.width = (paddingX) ? canvas.getBoundingClientRect().width - paddingX : canvas.getBoundingClientRect().width;
                canvas.height = (paddingY) ? canvas.getBoundingClientRect().height - paddingY : canvas.getBoundingClientRect().height;
                var contextCanvas = canvas.getContext('2d');
                contextCanvas.clearRect(0, 0, canvas.width, canvas.height);
                var imageAspectRatio = image.width / image.height;
                var canvasAspectRatio = canvas.width / canvas.height;
                var xStart, yStart, renderableWidth, renderableHeight;
                // If image's aspect ratio is less than canvas's we fit on height
                // and place the image centrally along width
                if (imageAspectRatio < canvasAspectRatio) {
                    renderableHeight = canvas.height;
                    renderableWidth = image.width * (renderableHeight / image.height);
                    xStart = (canvas.width - renderableWidth) / 2;
                    yStart = 0;
                }
                else if (imageAspectRatio > canvasAspectRatio) {
                    renderableWidth = canvas.width;
                    renderableHeight = image.height * (renderableWidth / image.width);
                    xStart = 0;
                    yStart = (canvas.height - renderableHeight) / 2;
                }
                else {
                    renderableHeight = canvas.height;
                    renderableWidth = canvas.width;
                    xStart = 0;
                    yStart = 0;
                }
                contextCanvas.drawImage(image, xStart, yStart, renderableWidth, renderableHeight);
            };
            LayoutManager.prototype.applyCustomizedIconsText = function (json) {
                if (!json)
                    return;
                for (var prop in json) {
                    switch (json[prop].type) {
                        case 'image_toolbox': {
                            var urlImg = json[prop].value;
                            if (urlImg)
                                $(json[prop].css_selector).replaceWith($("<img src=\"" + urlImg + "\" alt=\"icon-image\" />"));
                            break;
                        }
                        case 'image_toolboxpage': {
                            var urlImg = json[prop].value;
                            if (urlImg)
                                $(json[prop].css_selector).append($("<img src=\"" + urlImg + "\" alt=\"icon-image\" />")).attr('class', 'iconImage');
                            break;
                        }
                        case 'text_toolbox':
                        case 'text_toolboxpage': {
                            var txtValue = json[prop].value;
                            if (txtValue) {
                                $(json[prop].css_selector).html(txtValue);
                                if (json[prop].css_selector.indexOf('data-name=images-macro-categories') !== -1) {
                                    $('.toolbox-page[data-name=images-list] span.header-toolbox-page').html(txtValue);
                                    $('.toolbox-page[data-name=images-categories] span.header-toolbox-page').html(txtValue);
                                }
                            }
                            break;
                        }
                    }
                }
            };
            return LayoutManager;
        }());
        Customizer.LayoutManager = LayoutManager;
        var GenericDialogOptions = /** @class */ (function () {
            function GenericDialogOptions() {
            }
            return GenericDialogOptions;
        }());
        Customizer.GenericDialogOptions = GenericDialogOptions;
    })(Customizer = Zakeke.Customizer || (Zakeke.Customizer = {}));
})(Zakeke || (Zakeke = {}));
