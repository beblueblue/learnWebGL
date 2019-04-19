var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
        // Layout manager
        var LayoutManagerDesktop = /** @class */ (function (_super) {
            __extends(LayoutManagerDesktop, _super);
            function LayoutManagerDesktop() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                // Dom cache
                _this.printTypes = _this.toolboxContent.find("#toolbox-print-types");
                _this.sidesPrintTypes = _this.toolboxContent.find("#toolbox-sides-print-types");
                _this.txtTextContent = _this.toolboxContent.find("#txt-toolbox-text-content");
                _this.cbTextFont = _this.toolboxContent.find("#cb-toolbox-text-font");
                _this.btnTextAdd = _this.toolboxContent.find("#btn-toolbox-text-add");
                _this.btnTextPath = _this.toolboxContent.find("#btn-toolbox-text-path");
                _this.btnTextArea = _this.toolboxContent.find("#btn-toolbox-text-area");
                _this.btnTextBold = _this.toolboxContent.find("#btn-toolbox-text-bold");
                _this.btnTextItalic = _this.toolboxContent.find("#btn-toolbox-text-italic");
                _this.btnsTextAlign = _this.toolboxContent.find(".btn-toolbox-text-align");
                _this.btnsTextAlignRow = _this.toolboxContent.find("#toolbox-text-align-row");
                _this.btnTextConstraints = $("#btn-toolbox-text-constraints");
                _this.btnSvgImageConstraints = $("#btn-toolbox-svg-constraints");
                _this.textColors = _this.toolboxContent.find("#text-colors");
                _this.textColorPicker = _this.toolboxContent.find("#toolbox-text-colorpicker");
                _this.cbTemplatesAllCategories = $("#cb-template-all-categories");
                _this.cbTemplatesCanAddImage = $(".template-constraints-global .cb-template-can-add-image");
                _this.cbTemplatesCanAddText = $(".template-constraints-global .cb-template-can-add-text");
                _this.cbTemplatesMaxText = $(".template-constraints-global .txt-template-max-text");
                _this.cbTemplatesMaxImages = $(".template-constraints-global .txt-template-max-images");
                _this.cbTemplatesDisableSellerImages = $(".template-constraints-global .cb-template-disable-seller-images");
                _this.cbTemplatesRestrictionsFilter = $("#cb-template-constraints-filter");
                _this.cbTemplatesSyncEnabled = $("#cb-template-has-sync-enabled");
                _this.cbTemplatesName = $("#txt-template-name");
                _this.cbTemplatesUploadRestrictions = $(".template-constraints-global .cb-template-upload-restrictions");
                _this.uploadRestrictionsRules = ["isUserImageAllowed", "isJpgAllowed", "isPngAllowed", "isSvgAllowed", "isPdfAllowed", "isPdfWithRasterAllowed", "isEpsAllowed", "isFacebookAllowed", "isInstagramAllowed"];
                _this.svgColorsToolboxPage = $(".toolbox-page[data-name='svg-colors']");
                _this.btnReset = $("#btn-reset");
                _this.dlgDuplicateTemplate = $("#dlg-duplicate");
                _this.updateDuplicateTemplateProducts = _.debounce(function (nextPage) { _this.onUpdateDuplicateTemplateRequested.trigger(nextPage); }, 100);
                _this.updateVariantImages = _.debounce(_this.updateVariantImagesSrc.bind(_this), 100);
                return _this;
            }
            Object.defineProperty(LayoutManagerDesktop.prototype, "preview3dEnabled", {
                // Properties
                set: function (enabled) {
                    if (enabled)
                        this.preview3dContainer.show();
                    else
                        this.preview3dContainer.hide();
                },
                enumerable: true,
                configurable: true
            });
            LayoutManagerDesktop.prototype.init = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var aspectRatio, preview3dHeight;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _super.prototype.init.call(this);
                                return [4 /*yield*/, this.initLocalitazion()];
                            case 1:
                                _a.sent();
                                if (Customizer.Context.isTemplateEditor) {
                                    $(document.body).addClass("template-editor");
                                    this.btnShare.hide();
                                    this.btnReset.hide();
                                }
                                else if (Customizer.Context.isDesignEditor) {
                                    this.btnsTextAlignRow.hide();
                                    this.btnDuplicateTemplate.hide();
                                    this.btnShare.hide();
                                    this.btnReset.hide();
                                }
                                else {
                                    this.btnsTextAlignRow.hide();
                                    this.btnDuplicateTemplate.hide();
                                }
                                // Share & Reset
                                this.btnShare.click(function (e) { return _this.onShareButtonClickEvent(e); });
                                this.btnReset.click(function (e) { return _this.onResetButtonClickEvent(e); });
                                //Duplicate Template
                                this.btnDuplicateTemplate.click(function (e) { return _this.onDuplicateTemplateButtonClickEvent(e); });
                                //Duplicate Template Search
                                $("#duplicate-txt-product-search").focus();
                                $("#duplicate-txt-product-search").keyup(_.debounce(function () {
                                    _this.updateDuplicationProducts(false);
                                }, 300));
                                //Duplicate Template Infinite scrollbar
                                $("#duplicate-products-list").perfectScrollbar();
                                $("#duplicate-products-list").on("ps-y-reach-end", function () {
                                    _this.updateDuplicationProducts(true);
                                });
                                aspectRatio = this.customizerContainer.width() / this.customizerContainer.height();
                                preview3dHeight = this.preview3dContainer.height();
                                this.preview3dContainer.width(preview3dHeight * aspectRatio);
                                this.preview3dContainer.find("#preview3d-title").width(this.preview3dContainer.width() - 10);
                                // Controls (must be before the dom elements)
                                $("input[type=checkbox]").checkbox();
                                $("input[type=radio]").radio();
                                $("input[type=number]").numericInput();
                                $("select").combobox();
                                $(".btn-check").checkButton();
                                $(".btn-check-group").checkButtonGroup();
                                // DOM events
                                this.btnBuy.click(function (e) { return _this.onBuyButtonClickEvent(e); });
                                this.btnSaveDesign.click(function (e) { return _this.onSaveDesignButtonClickEvent(e); });
                                this.toolbox.children("li").click(function (e) { return _this.onToolboxButtonClickEvent(e); });
                                this.toolbox.children("li").find(".toolbox-subitem").click(function (e) { return _this.onToolboxButtonClickEvent(e); });
                                this.modelColors.on("click", "li", function (e) { return _this.onModelColorSelectedEvent(e); });
                                this.sides.on("click", "li:not(.empty)", function (e) { return _this.onSideSelectedEvent(e); });
                                this.preview3dContainer.find("#btn-preview3d-expand").click(function (e) { return _this.onPreview3dExpandEvent(e); });
                                this.preview3dContainer.find("#btn-preview3d-collapse").click(function (e) { return _this.onPreview3dCollapseEvent(e); });
                                $('.toolbox-page').perfectScrollbar();
                                //Zoom events
                                this.zoomContainer.find("#zoom-in-tool").click(function (e) { return _this.onZoomToolClicked.trigger(true); });
                                this.zoomContainer.find("#zoom-out-tool").click(function (e) { return _this.onZoomToolClicked.trigger(false); });
                                // Homepage
                                this.toolboxContent.find("#toolbox-homepage-items > li").click(function (e) { return _this.selectToolboxPage($(e.currentTarget).data("name")); });
                                // Text toolbox events
                                this.toolboxContent.find("#btn-toolbox-text-add").click(function (e) { return _this.onAddTextClickEvent(e); });
                                this.toolboxContent.find("#btn-toolbox-text-path").click(function (e) { return _this.onTextPathChangedEvent(e); });
                                this.toolboxContent.find("#btn-toolbox-text-area").click(function (e) { return _this.onTextAreaChangedEvent(e); });
                                this.toolboxContent.find("#btn-toolbox-text-bold").click(function (e) { return _this.onTextStyleClickEvent(e); });
                                this.toolboxContent.find("#btn-toolbox-text-italic").click(function (e) { return _this.onTextStyleClickEvent(e); });
                                this.toolboxContent.find(".btn-toolbox-text-align").click(function (e) { return _this.onTextAlignClickEvent(e); });
                                this.toolboxContent.find("#cb-toolbox-text-font").change(function (e) { return _this.onTextFontChangedEvent(e); });
                                this.toolboxContent.find("#toolbox-text-font-stretches-row input").change(function (e) { return _this.onTextStyleClickEvent(e); });
                                this.toolboxContent.find("#txt-toolbox-text-content").on("input propertychange", function (e) { return _this.onTextContentChangedEvent(e); });
                                this.btnTextConstraints.click(function (e) { return _this.selectToolboxPage(Customizer.ToolboxItem.ElementRestrictions); });
                                this.btnSvgImageConstraints.click(function (e) { return _this.selectToolboxPage(Customizer.ToolboxItem.ElementRestrictions); });
                                this.textColors.on("click", "li", function (e) { return _this.onTextColorChangedEvent(e); });
                                // Images toolbox events
                                this.imagesMacroCategories.on("click", "li", function (e) { return _this.onImageMacroCategoryClickEvent(e); });
                                this.imagesCategories.on("click", "li", function (e) { return _this.onImageCategoryClickEvent(e); });
                                this.imagesList.on("click", "li", function (e) { return _this.onImageClickEvent(e); });
                                this.imagesFilter.on("keyup", function (e) { return _this.onImagesFilterChange(e); });
                                // Upload image toolbox events
                                this.btnMasterUploadImage.click(function (e) { return _this.onMasterUploadButtonClickEvent(e); });
                                this.btnUploadImage.click(function (e) { return _this.uploadImageFileInput.click(); });
                                this.btnUploadPdf.click(function (e) { return _this.uploadPdfFileInput.click(); });
                                this.uploadImageFileInput.change(function (e) { return _this.onUploadImageSelectedEvent(e); });
                                this.uploadPdfFileInput.change(function (e) { return _this.onUploadPdfSelectedEvent(e); });
                                this.userImagesList.on("click", "li", function (e) { return _this.onUserImageClickEvent(e); });
                                this.toolboxContent.find("#btn-toolbox-import-facebook").click(function (e) { return _this.onFacebookClickEvent(e); });
                                this.toolboxContent.find("#btn-toolbox-import-instagram").click(function (e) { return _this.onInstagramClickEvent(e); });
                                // Templates
                                this.cbTemplatesCategories.change(function (e) { return _this.onTemplateCategoryChange(e); });
                                this.cbTemplatesRestrictionsFilter.change(function (e) { return _this.onTemplateRestrictionsFilterChange(e); });
                                this.cbTemplatesSyncEnabled.change(function (e) { return _this.onTemplateSyncChange.trigger($(e.target).prop("checked")); });
                                this.templatesList.on("click", ".template-item", function (e) { return _this.onTemplateSelectedEvent(e); });
                                $(".toolbox-page[data-name='element-constraints']").change(function (e) {
                                    _this.onElementConstraintChanged.trigger(_this.getElementRestrictions());
                                });
                                $(document.body).on("change", ".template-constraints-form", function (e) {
                                    _this.onTemplateConstraintsChanged(e);
                                });
                                // Print types toolbox events
                                this.printTypes.on("click", "li", function (e) { return _this.onPrintTypeClickEvent(e); });
                                this.toolboxContent.find("#cb-element-constraint-is-synced").on("change", function () {
                                    var itemType = _this.toolboxContent.find("#cb-element-constraint-is-synced").data("itemType");
                                    if (_this.toolboxContent.find("#cb-element-constraint-is-synced").prop("checked")) {
                                        _this.toolboxContent.find("#cb-element-constraint-is-content-synced-row").show();
                                        _this.toolboxContent.find("#cb-element-constraint-is-text-style-synced-row").show();
                                        _this.toolboxContent.find("#cb-element-constraint-is-transform-synced-row").show();
                                    }
                                    else {
                                        _this.toolboxContent.find("#cb-element-constraint-is-content-synced-row").hide();
                                        _this.toolboxContent.find("#cb-element-constraint-is-text-style-synced-row").hide();
                                        _this.toolboxContent.find("#cb-element-constraint-is-transform-synced-row").hide();
                                    }
                                    if (itemType != null && itemType != "text")
                                        _this.toolboxContent.find("#cb-element-constraint-is-text-style-synced-row").hide();
                                });
                                // Font select
                                this.cbTextFont.combobox({
                                    placeholder: "Seleziona un font...",
                                    classes: "align-center cb-fonts"
                                });
                                // Align left as default
                                this.toolboxContent.find(".btn-toolbox-text-align[data-value=center]").click();
                                // Garamond as first font
                                this.toolboxContent.find("#cb-toolbox-text-font").combobox("value", "Adamina");
                                // Color picker
                                this.textColorPicker.ColorPicker({
                                    onChange: function (hsb, hex, rgb, el) {
                                        _this.textColorPicker.children("div").eq(1).css("background-color", "#" + hex);
                                        _this.textColorPicker.data("color", "#" + hex);
                                        _this.onTextColorChanged.trigger("#" + hex);
                                    },
                                    onShow: function (colpkr) {
                                        $(colpkr).fadeIn(500);
                                        return false;
                                    }
                                });
                                // Hide on body click
                                $(document.body).click(function () {
                                    _this.textColorPicker.ColorPickerHide();
                                });
                                // Hide preview3d
                                this.preview3dEnabled = false;
                                this.preview3dContainer.children("#btn-preview3d-collapse").hide();
                                // Text and svg constraints
                                if (!Customizer.Context.isTemplateEditor && !Customizer.Context.isDesignEditor) {
                                    this.btnTextConstraints.parent().hide();
                                    this.btnSvgImageConstraints.parent().hide();
                                }
                                this.toolboxLoading = false;
                                if (Customizer.Context.isTemplateEditor && !Customizer.Context.designDocId) {
                                    this.showTemplateSaveTip();
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            LayoutManagerDesktop.prototype.updateDuplicationProducts = function (nextPage) {
                this.updateDuplicateTemplateProducts(nextPage);
            };
            LayoutManagerDesktop.prototype.showTemplateSaveTip = function () {
                try {
                    $("<div class=\"wizard-container\">\n                    <div id=\"wizard-popup\">\n                        <div class=\"arrow\"></div>\n                        <div class=\"arrow-border\"></div>\n                        <h1></h1>\n                        <div id=\"wizard-content\"></div>\n                        <div id=\"wizard-tools\">\n                            <a href=\"#\"><i class=\"material-icons\">cancel</i> " + T._("Dismiss", "Admin") + "</a>\n                            <button class=\"btn btn-primary\">" + T._("Ok", "Admin") + "</button>\n                        </div>\n                    </div>\n                    <div id=\"wizard-save-0\">\n                        <div><h1>" + T._("Tip", "Admin") + "</h1><div>" + T._("You need to add at least one element (text or image) to be able to save your pre-designed template.", "Admin") + "</div></div>\n                    </div>\n                </div>").appendTo(document.body);
                    $("#wizard-popup").css("width", "initial").css("min-width", "initial");
                    var wizardOptions = [
                        {
                            content: $("#wizard-save-0").children().eq(0),
                            anchor: $("#btn-buy"),
                            parent: $("#buy-buttons-container"),
                            position: "top-center",
                            scrollBar: null
                        }
                    ];
                    startWizardry(wizardOptions, "#wizard-template-save-0", false);
                }
                catch (error) {
                    console.error("Failed to show the save tip", error);
                }
            };
            LayoutManagerDesktop.prototype.initLocalitazion = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _super.prototype.initLocalitazion.call(this)];
                            case 1:
                                _a.sent();
                                // Toolbox
                                [
                                    ["settings", T._("Template Settings", "Customizer")],
                                    ["element-constraints", T._("Element settings", "Customizer")],
                                    ["images-macro-categories", T._("Clipart and images", "Customizer")],
                                    ["master-upload-image", T._("My gallery", "Customizer")],
                                    ["text", T._("Text", "Customizer")],
                                    ["colors", T._("Product variations", "Customizer")],
                                    ["templates", T._("Pre-made designs", "Customizer")],
                                    ["print-types", T._("Printing Method", "Customizer")],
                                    ["image-filters", T._("Image Filters", "Customizer")],
                                    ["duplicate", T._("Duplicate", "Customizer")],
                                    ["mirror-x", T._("Flip Horizontal", "Customizer")],
                                    ["mirror-y", T._("Flip Vertical", "Customizer")],
                                    ["move-up", T._("Bring forward", "Customizer")],
                                    ["move-down", T._("Send backward", "Customizer")],
                                    ["center-position", T._("Centering element", "Customizer")],
                                    ["draft-designs", T._("My saved designs", "Customizer")],
                                    ["preview-pdf", T._("Create PDF preview", "Customizer")]
                                ].forEach(function (_a) {
                                    var name = _a[0], translation = _a[1];
                                    return _this.toolbox.find(".toolbox-item[data-name='" + name + "'] > .toolbox-item-label, .toolbox-subitem[data-name='" + name + "'] > .toolbox-subitem-label").text(translation);
                                });
                                // Homepage Toolbox
                                [
                                    ["settings", T._("Template Settings", "Customizer")],
                                    ["element-constraints", T._("Element settings", "Customizer")],
                                    ["images-macro-categories", T._("Clipart and<br/>images", "Customizer")],
                                    ["master-upload-image", T._("Upload<br />image", "Customizer")],
                                    ["text", T._("Text", "Customizer")],
                                    ["colors", T._("Product<br />variations", "Customizer")],
                                    ["templates", T._("Pre-made<br/>designs", "Customizer")],
                                    ["draft-designs", T._("My saved designs", "Customizer")],
                                    ["print-types", T._("Print<br />types", "Customizer")],
                                    ["preview-pdf", T._("Create PDF preview", "Customizer")]
                                ].forEach(function (_a) {
                                    var name = _a[0], translation = _a[1];
                                    return $("#toolbox-homepage-items > li[data-name='" + name + "']  span").html(translation);
                                });
                                // Text toolbox
                                this.btnTextAdd.children("span").text(T._("Add more text", "Customizer"));
                                this.txtTextContent.attr("placeholder", T._("Text to be added to your design", "Customizer"));
                                this.btnTextConstraints.find("span").text(T._("Text settings", "Customizer"));
                                this.btnSvgImageConstraints.find("span").text(T._("Image settings", "Customizer"));
                                // Pages header
                                [
                                    ["settings", T._("Template Settings", "Customizer")],
                                    ["element-constraints", T._("Element settings", "Customizer")],
                                    ["images-macro-categories", T._("Clipart and images", "Customizer")],
                                    ["images-categories", T._("Clipart and images", "Customizer")],
                                    ["images-list", T._("Clipart and images", "Customizer")],
                                    ["master-upload-image", T._("My gallery", "Customizer")],
                                    ["upload-image", T._("Add your image", "Customizer")],
                                    ["text", T._("Text", "Customizer")],
                                    ["svg-colors", T._("Color picker", "Customizer")],
                                    ["colors", T._("Product variations", "Customizer")],
                                    ["templates", T._("Pre-made designs", "Customizer")],
                                    ["print-types", T._("Printing Methods", "Customizer")],
                                    ["draft-designs", T._("My saved designs", "Customizer")],
                                ].forEach(function (_a) {
                                    var name = _a[0], translation = _a[1];
                                    return $(".toolbox-page[data-name='" + name + "'] .header-toolbox-page").text(translation);
                                });
                                // Buttons
                                $("#btn-reset > span").text(T._("Reset", "Customizer"));
                                $("#btn-share > span").text(T._("Share", "Customizer"));
                                $("#btn-save-design > span").text(T._("Save design", "Customizer"));
                                $("#btn-duplicate-template > span").text(T._("Save and duplicate", "Customizer"));
                                $("#help-link").text(T._("Do you need help?", "Customizer"));
                                //Duplicate Template dialog
                                this.dlgDuplicateTemplate.find("> h2").text(T._("Please select the products for which you wish to apply this template", "Customizer"));
                                this.dlgDuplicateTemplate.find("#duplicate-txt-product-search").attr("placeholder", T._(" Search by product name or SKU...", "Customizer"));
                                this.dlgDuplicateTemplate.find("#duplicate-loading-products > span").text(T._("Loading in progress...", "Customizer"));
                                this.dlgDuplicateTemplate.find("#no-product-configured > h3").html(T._("No products configured yet.<br>", "Customizer") + T._("To add one <a href='{0}'>click here</a>", "Customizer").replace("{0}", (Zakeke.config.baseUrl + "Admin/Products")));
                                this.dlgDuplicateTemplate.find("#no-products-found > h3").text(T._("No products found. Please change name filter.", "Customizer"));
                                $("#dlg-duplicate").dialog({
                                    buttons: [
                                        {
                                            label: T._("Duplicate", "Admin"),
                                            func: function () {
                                                if (!$("#dlg-duplicate").find(".modal-footer > button").hasClass("isLoading"))
                                                    _this.onDuplicateTemplateRequested.trigger();
                                            },
                                            outline: true,
                                            hasLoading: true
                                        }
                                    ],
                                    style: "",
                                    closeCallback: function () { _this.onDuplicateTemplateClosed.trigger(); }
                                });
                                // 3D
                                $("#preview3d-title  > span").text(T._("3D Preview", "Customizer"));
                                $("#btn-preview3d-collapse > span").text(T._("Close 3D", "Customizer"));
                                // Share
                                $("#btn-share > span").text(T._("Share", "Customizer"));
                                // Templates
                                $("#txt-template-name").prev("label").text(T._("Template name", "Customizer"));
                                $("#cb-template-has-sync-enabled-row span").text(T._("Sync elements on all product sides", "Customizer"));
                                $("#cb-template-constraints-filter").prev("label").text(T._("Apply settings to:", "Customizer"));
                                $("#cb-template-constraints-filter option[value='global']").text(T._("Entire product", "Customizer"));
                                $("#cb-template-constraints-filter option[value='side']").text(T._("Each side", "Customizer"));
                                $("#lbl-template-category").text(T._("Category", "Customizer"));
                                $(".cb-template-disable-seller-images + span").text(T._("Disable seller images gallery", "Customizer"));
                                $(".cb-template-can-add-image + span").text(T._("Can add image", "Customizer"));
                                $(".lbl-template-max-images").text(T._("Max number of images", "Customizer"));
                                $(".cb-template-can-add-text + span").text(T._("Can add text", "Customizer"));
                                $(".lbl-template-max-text").text(T._("Max number of text", "Customizer"));
                                $(".lbl-template-upload-restrictions").text(T._("Images upload options (check to allow)", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isUserImageAllowed']").siblings("span").text(T._("User own images", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isJpgAllowed']").siblings("span").text(T._("JPG", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isPngAllowed']").siblings("span").text(T._("PNG", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isSvgAllowed']").siblings("span").text(T._("SVG", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isPdfAllowed']").siblings("span").text(T._("PDF", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isPdfWithRasterAllowed']").siblings("span").text(T._("With rasters", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isEpsAllowed']").siblings("span").text(T._("EPS", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isFacebookAllowed']").siblings("span").text(T._("Facebook", "Customizer"));
                                $(".cb-template-upload-restrictions").find("[data-source='isInstagramAllowed']").siblings("span").text(T._("Instagram", "Customizer"));
                                $("#txt-element-constraint-min-chars").prev("label").text(T._("Min characters", "Customizer"));
                                $("#txt-element-constraint-max-chars").prev("label").text(T._("Max characters", "Customizer"));
                                $("#txt-element-constraint-padding-string").prev("label").text(T._("Padding string", "Customizer"));
                                $("#lbl-element-constraints-tick-to-allow").text(T._("Tick to allow", "Customizer"));
                                [
                                    ["cb-element-constraint-is-synced", T._("Sync this element on all product sides", "Customizer")],
                                    ["cb-element-constraint-is-content-synced", T._("Sync content", "Customizer")],
                                    ["cb-element-constraint-is-text-style-synced", T._("Sync text style", "Customizer")],
                                    ["cb-element-constraint-is-transform-synced", T._("Sync position, rotation and size", "Customizer")],
                                    ["cb-element-constraint-can-edit-text", T._("Edit text", "Customizer")],
                                    ["cb-element-constraint-can-edit-image", T._("Can replace image", "Customizer")],
                                    ["cb-element-constraint-can-move", T._("Move", "Customizer")],
                                    ["cb-element-constraint-can-rotate", T._("Rotate", "Customizer")],
                                    ["cb-element-constraint-can-resize", T._("Resize", "Customizer")],
                                    ["cb-element-constraint-can-delete", T._("Delete", "Customizer")],
                                    ["cb-element-constraint-can-transform", T._("Duplicate/Mirror/Layers", "Customizer")],
                                    ["cb-element-constraint-is-always-on-top", T._("Always on top", "Customizer")],
                                    ["cb-element-constraint-font-family", T._("Font family", "Customizer")],
                                    ["cb-element-constraint-font-color", T._("Font color", "Customizer")],
                                    ["cb-element-constraint-font-weight", T._("Font weight/italic", "Customizer")],
                                    ["cb-element-constraint-can-change-svg-colors", T._("Svg colors changing", "Customizer")],
                                    ["cb-element-constraint-is-printable", T._("Printable", "Customizer")],
                                    ["cb-element-constraint-convert-to-path", T._("Curved text", "Customizer")],
                                    ["rb-element-constraint-padding-type-start", T._("Pad at start", "Customizer")],
                                    ["rb-element-constraint-padding-type-end", T._("Pad at end", "Customizer")],
                                    ["rb-element-constraint-padding-type-both", T._("Pad at start and end", "Customizer")],
                                ].forEach(function (_a) {
                                    var id = _a[0], translation = _a[1];
                                    $("#" + id + " + span").text(translation);
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            // Toolbox button click
            LayoutManagerDesktop.prototype.onToolboxButtonClickEvent = function (event) {
                var target = $(event.currentTarget);
                this.onToolboxAction.trigger(target.data("name"));
            };
            // Buy button click
            LayoutManagerDesktop.prototype.onBuyButtonClickEvent = function (event) {
                this.onBuy.trigger();
            };
            // Save design button click
            LayoutManagerDesktop.prototype.onSaveDesignButtonClickEvent = function (event) {
                this.onSaveDesign.trigger();
            };
            // Model colors
            LayoutManagerDesktop.prototype.onModelColorSelectedEvent = function (event) {
                var item = $(event.currentTarget);
                var color = item.data("color");
                this.onModelColorSelected.trigger(color);
                item.addClass("active").siblings().removeClass("active");
            };
            // Sides
            LayoutManagerDesktop.prototype.onSideSelectedEvent = function (event) {
                var item = $(event.currentTarget);
                var side = item.data("side");
                item.addClass("active").siblings().removeClass("active");
                this.onSideSelected.trigger(side);
            };
            // Preview3D expand
            LayoutManagerDesktop.prototype.onPreview3dExpandEvent = function (event) {
                var _this = this;
                this.preview3dContainer.addClass("full-size");
                this.preview3dContainer.children("canvas").addClass("transition");
                // Change icon
                this.preview3dContainer.children("#btn-preview3d-collapse").show();
                this.preview3dContainer.children("#btn-preview3d-expand").hide();
                setTimeout(function () {
                    _this.preview3dContainer.children("canvas").removeClass("transition");
                    _this.onPreview3dExpanded.trigger();
                }, 300);
            };
            // Preview3D collapse
            LayoutManagerDesktop.prototype.onPreview3dCollapseEvent = function (event) {
                var _this = this;
                this.preview3dContainer.removeClass("full-size");
                this.preview3dContainer.children("canvas").addClass("transition");
                // Change icon
                this.preview3dContainer.children("#btn-preview3d-collapse").hide();
                this.preview3dContainer.children("#btn-preview3d-expand").show();
                setTimeout(function () {
                    _this.preview3dContainer.children("canvas").removeClass("transition");
                    _this.onPreview3dCollapsed.trigger();
                }, 300);
            };
            // Share
            LayoutManagerDesktop.prototype.onShareButtonClickEvent = function (event) {
                var _this = this;
                if (Customizer.Context.managedShare) {
                    Customizer.LayoutManager.managedShare(null);
                    this.onPreviewRequested.trigger(Customizer.LayoutManager.managedShare);
                    return;
                }
                // Show classic share
                var content = "<div class='dlg-share-preview-container'><img src='/images/other/loading.gif' alt='' class='dlg-share-img-loading'/></div>";
                content += "<span>" + T._("Share", "Customizer") + "</span>";
                content += "<ul>";
                content += "<li title=\"\" data-share-btn=\"facebook\"><img src= \"/images/social/facebook_big.png\" alt= \"Facebook\" /></li>";
                content += "<li title=\"\" data-share-btn=\"pinterest\"><img src= \"/images/social/pinterest_big.png\" alt= \"Pinterest\" /></li>";
                content += "<li title=\"\" data-share-btn=\"twitter\"><img src= \"/images/social/twitter_big.png\" alt= \"Twitter\" /></li>";
                content += "<li title=\"\" data-share-btn=\"email\"><img src= \"/images/social/email_big.png\" alt= \"Email\" /></li>";
                content += "</ul>";
                var dialog = this.openDialog($(content), "dlg-share");
                // Load the URL
                this.onPreviewRequested.trigger(function (url) {
                    var imgPreview = dialog.find(".dlg-share-img-loading");
                    imgPreview.replaceWith($("<img/>").attr("src", url).addClass("dlg-share-img-preview"));
                    dialog.find("li").click(function (e) {
                        var name = $(e.currentTarget).data("shareBtn");
                        _this.closeDialog(dialog);
                        _this.onShareRequested.trigger({ url: url, name: name });
                    });
                });
            };
            // Reset
            LayoutManagerDesktop.prototype.onResetButtonClickEvent = function (event) {
                this.onResetRequested.trigger();
            };
            //Duplicate Template
            LayoutManagerDesktop.prototype.onDuplicateTemplateButtonClickEvent = function (event) {
                //Show dialog
                event.preventDefault();
                $("#dlg-duplicate").dialog("show");
                //Trigger event
                this.updateDuplicateTemplateProducts(false);
            };
            // Item selected
            LayoutManagerDesktop.prototype.onDesignItemSelected = function (item) {
                if (item && item.content && item.content.length > 0)
                    this.btnTextAdd.removeAttr("disabled");
            };
            LayoutManagerDesktop.prototype.onImageItemSelected = function (item) {
            };
            LayoutManagerDesktop.prototype.setToolboxItemEnabled = function (item, visible) {
                _super.prototype.setToolboxItemEnabled.call(this, item, visible);
                this.fixToolboxHeight();
            };
            // Text toolbox
            //-------------------------------------------------------------------------------
            // Add Text
            LayoutManagerDesktop.prototype.onAddTextClickEvent = function (event) {
                this.onAddAnotherText.trigger();
            };
            // Text as path changed
            LayoutManagerDesktop.prototype.onTextPathChangedEvent = function (event) {
                var enabled = this.btnTextPath.hasClass("active");
                this.onTextPathChanged.trigger(enabled);
            };
            // Text area changed
            LayoutManagerDesktop.prototype.onTextAreaChangedEvent = function (event) {
                var enabled = this.btnTextArea.hasClass("active");
                this.onTextAreaChanged.trigger(enabled);
            };
            // Text bold/italic changed
            LayoutManagerDesktop.prototype.onTextStyleClickEvent = function (event) {
                var bold = this.btnTextBold.hasClass("active");
                var italic = this.btnTextItalic.hasClass("active");
                var stretch = this.toolboxContent.find("#toolbox-text-font-stretches-row input:checked").val();
                var currentFontName = this.cbTextFont.combobox("value");
                var font = Customizer.Context.fonts.find(function (x) { return x.name == currentFontName; });
                if (font && font.stretches.length > 1) {
                    var fontStretch = font.stretches.find(function (x) { return x.stretch == stretch; });
                    if (fontStretch)
                        bold = fontStretch.weight;
                }
                this.onTextStyleChanged.trigger({ bold: bold, italic: italic, stretch: stretch });
            };
            // Text font changed
            LayoutManagerDesktop.prototype.onTextFontChangedEvent = function (event) {
                var select = $(event.currentTarget);
                var fontName = select.combobox("value");
                this.onTextFontChanged.trigger(fontName);
                this.updateFontStretches(fontName);
            };
            // Text align changed
            LayoutManagerDesktop.prototype.onTextAlignClickEvent = function (event) {
                var btn = $(event.currentTarget);
                var align = btn.data("value");
                this.onTextAlignChanged.trigger(align);
            };
            // Text changed
            LayoutManagerDesktop.prototype.onTextContentChangedEvent = function (event) {
                var text = this.txtTextContent.val().trim();
                if (this.btnTextPath.hasClass("active")) {
                    text = this.txtTextContent.val().replace("\n", "");
                    this.txtTextContent.val(text);
                    text = text.trim();
                }
                //(this.txtTextContent.val().indexOf("\n") !== -1) ? this.btnTextPath.attr("disabled", "disabled") : this.btnTextPath.removeAttr("disabled");
                if (text == "")
                    this.btnTextAdd.attr("disabled", "disabled");
                else
                    this.btnTextAdd.removeAttr("disabled");
                this.onTextContentChanged.trigger(text);
            };
            // Text color changed
            LayoutManagerDesktop.prototype.onTextColorChangedEvent = function (event) {
                var item = $(event.currentTarget);
                this.textColorPicker.ColorPickerSetColor(item.data("color"));
            };
            LayoutManagerDesktop.prototype.getTextSettings = function () {
                var text = this.toolboxContent.find("#txt-toolbox-text-content").val();
                var font = this.toolboxContent.find("#cb-toolbox-text-font").combobox("value");
                var bold = this.toolboxContent.find("#btn-toolbox-text-bold").hasClass("active");
                var stretch = this.toolboxContent.find("#toolbox-text-font-stretches-row input:checked").val();
                var isPath = this.toolboxContent.find("#btn-toolbox-text-path").hasClass("active");
                var isTextArea = this.toolboxContent.find("#btn-toolbox-text-area").hasClass("active");
                var italic = this.toolboxContent.find("#btn-toolbox-text-italic").hasClass("active");
                var justify = isTextArea ? this.toolboxContent.find(".btn-toolbox-text-align.active").data("value") : "center";
                var color = this.textColorPicker.data("color");
                var settings = {
                    text: text,
                    font: font,
                    bold: bold,
                    italic: italic,
                    stretch: stretch,
                    justify: justify,
                    color: color,
                    isPath: isPath,
                    isTextArea: isTextArea
                };
                return settings;
            };
            LayoutManagerDesktop.prototype.updateTextForm = function (info, constraints) {
                // Reset buttons
                this.btnTextPath.removeClass("active");
                this.btnTextArea.removeClass("active");
                this.btnTextBold.removeClass("active");
                this.btnTextItalic.removeClass("active");
                this.btnsTextAlign.removeClass("active");
                if (info && info.text && info.text != "")
                    this.btnTextConstraints.show();
                var currentFontName = this.cbTextFont.combobox("value");
                var currentFont = Customizer.Context.fonts.find(function (x) { return x.name == currentFontName; });
                // Text
                if (info) {
                    this.txtTextContent.val(info.text);
                    // Font family
                    if (info.fontFamily) {
                        if (this.cbTextFont.combobox("value") != info.fontFamily) {
                            this.cbTextFont.combobox("value", info.fontFamily);
                            this.updateFontStretches(info.fontFamily);
                            // New font
                            currentFontName = this.cbTextFont.combobox("value");
                            currentFont = Customizer.Context.fonts.find(function (x) { return x.name == currentFontName; });
                        }
                    }
                    // Path
                    if (info.isTextOnPath) {
                        this.btnTextPath.addClass("active");
                    }
                    else if (info.isTextArea) {
                        this.btnTextArea.addClass("active");
                        this.btnsTextAlignRow.show();
                    }
                    if (!info.isTextArea)
                        this.btnsTextAlignRow.hide();
                    // Bold and italic
                    if (info.fontWeight) {
                        if (info.fontWeight.indexOf("bold") != -1)
                            this.btnTextBold.addClass("active");
                        if (info.fontWeight.indexOf("italic") != -1)
                            this.btnTextItalic.addClass("active");
                    }
                    // Stretch
                    var fontStretch = currentFont.stretches.find(function (x) { return info.fontStretch.indexOf(x.stretch) != -1; });
                    if (fontStretch)
                        this.toolboxContent.find("#toolbox-text-font-stretches-row input[value='" + fontStretch.stretch + "']").click();
                    else
                        this.toolboxContent.find("#toolbox-text-font-stretches-row input[value='normal']").click();
                    // Justification
                    if (!info.justification || info.justification == "left")
                        this.btnsTextAlign.filter("[data-value=left]").addClass("active");
                    else if (info.justification == "center")
                        this.btnsTextAlign.filter("[data-value=center]").addClass("active");
                    else if (info.justification == "right")
                        this.btnsTextAlign.filter("[data-value=right]").addClass("active");
                    else if (info.justification == "justify")
                        this.btnsTextAlign.filter("[data-value=justify]").addClass("active");
                    // Font color
                    if (info.fillColor) {
                        // Search the color with the same background-color and set it as active
                        this.textColorPicker.ColorPickerSetColor(info.fillColor);
                    }
                }
                // Constraints
                if (constraints && !constraints.get("canChangeFontFamily"))
                    this.cbTextFont.closest(".row").hide();
                else
                    this.cbTextFont.closest(".row").show();
                if (constraints && !constraints.get("canEdit")) {
                    this.txtTextContent.closest(".row").hide();
                    this.btnTextArea.attr("disabled", "disabled");
                }
                else {
                    this.txtTextContent.closest(".row").show();
                    this.btnTextArea.removeAttr("disabled");
                }
                // TODO: this is overrided in the application.ts because we must check about the print type restriction
                if (constraints && !constraints.get("canChangeFontColor"))
                    $("#toolbox-text-color-row").hide();
                else
                    $("#toolbox-text-color-row").show();
                if (constraints && !constraints.get("canChangeFontWeight")) {
                    this.btnTextBold.attr("disabled", "disabled");
                    this.btnTextItalic.attr("disabled", "disabled");
                }
                else {
                    this.btnTextBold.removeAttr("disabled");
                    this.btnTextItalic.removeAttr("disabled");
                }
                if (constraints && !constraints.get("canChangeTextPathMode"))
                    this.btnTextPath.attr("disabled", "disabled");
                else
                    this.btnTextPath.removeAttr("disabled");
                // If path and bold/italic and text area tools are hidden, then hide all the row for removing ghost margins
                if (constraints && !constraints.get("canChangeTextPathMode") && !constraints.get("canChangeFontWeight") && !constraints.get("canEdit")) {
                    $("#lbl-toolbox-text-path").closest(".row").hide(); // Labels row
                    this.btnTextBold.closest(".row").hide(); // Buttons row
                }
                else {
                    $("#lbl-toolbox-text-path").closest(".row").show(); // Labels row
                    this.btnTextBold.closest(".row").show(); // Buttons row
                }
            };
            LayoutManagerDesktop.prototype.resetTextForm = function () {
                this.txtTextContent.val("");
                this.txtTextContent.focus();
                this.btnTextBold.removeClass("active");
                this.btnTextItalic.removeClass("active");
                this.btnTextPath.removeClass("active");
                this.btnTextArea.removeClass("active");
                this.btnsTextAlign.removeClass("active").filter("[data-value=center]").addClass("active");
                this.btnsTextAlignRow.hide();
                this.cbTextFont.removeAttr("disabled").change().combobox("refreshLayout");
                this.btnTextPath.removeAttr("disabled");
                this.btnTextArea.removeAttr("disabled");
                this.txtTextContent.removeAttr("disabled");
                this.btnTextConstraints.hide();
                $("#toolbox-text-color-row").show();
            };
            LayoutManagerDesktop.prototype.setTextColors = function (colors) {
                var _this = this;
                this.textColors.empty();
                // Text colors 
                colors.forEach(function (x) {
                    var html = $("<li class='color-item' data-color='" + x.colorCode + "'><div></div></li>");
                    _this.textColors.append(html);
                    html.children("div").css("background-color", x.colorCode);
                    if (x.isDefault)
                        _this.textColorPicker.ColorPickerSetColor(x.colorCode);
                });
            };
            LayoutManagerDesktop.prototype.fillFonts = function (fonts) {
                this.cbTextFont.empty();
                for (var _i = 0, fonts_1 = fonts; _i < fonts_1.length; _i++) {
                    var font = fonts_1[_i];
                    this.cbTextFont.append("<option value=\"" + font.name + "\" data-template=\"<img src=&quot;" + font.imageUrl + "&quot; alt=&quot;" + font.name + "&quot; height=&quot;15&quot; />\"></option>");
                }
                this.cbTextFont.combobox("refreshItems");
                this.cbTextFont.combobox("value", fonts[0].name);
            };
            LayoutManagerDesktop.prototype.selectFont = function (fontName) {
                this.cbTextFont.combobox("value", fontName);
                this.updateFontStretches(fontName);
            };
            LayoutManagerDesktop.prototype.selectStyle = function (bold, italic) {
                this.onTextStyleChanged.trigger({ bold: false, italic: false });
                if (typeof bold == "number" || bold === false) {
                    this.btnTextBold.removeClass("active");
                    this.btnTextItalic.removeClass("active");
                }
                else {
                    this.btnTextBold.addClass("active");
                    this.btnTextItalic.addClass("active");
                }
            };
            LayoutManagerDesktop.prototype.updateFontStretches = function (fontName) {
                // Show/hide stretches
                var font = Customizer.Context.fonts.find(function (x) { return x.name == fontName; });
                if (!font || font.stretches.length <= 1) {
                    this.toolboxContent.find("#toolbox-text-font-stretches-row").hide();
                    this.btnTextBold.removeAttr("disabled");
                    this.btnTextItalic.removeAttr("disabled");
                }
                else {
                    this.btnTextBold.attr("disabled", "disabled").removeClass("active");
                    this.btnTextItalic.attr("disabled", "disabled").removeClass("active");
                    this.toolboxContent.find("#toolbox-text-font-stretches-row").show();
                    this.toolboxContent.find("#toolbox-text-font-stretches-row input").each(function (e) {
                        var stretch = $(this).val();
                        if (font.stretches.find(function (x) { return x.stretch == stretch; }))
                            $(this).closest("label").show();
                        else
                            $(this).closest("label").hide();
                    });
                }
            };
            // Images toolbox
            //-------------------------------------------------------------------------------
            // Macro category click
            LayoutManagerDesktop.prototype.onImageMacroCategoryClickEvent = function (event) {
                var _this = this;
                var macroCategory = $(event.currentTarget).data("category");
                this.selectToolboxPage(Customizer.ToolboxItem.ImagesCategories);
                // Hide list
                this.toolboxContent.find(".toolbox-page[data-name='images-categories'] > .toolbox-page-content").hide();
                this.onImagesCategoriesFillRequest.trigger({
                    macroCategory: macroCategory,
                    callback: function () {
                        var imageCategoriesPage = _this.toolboxContent.find(".toolbox-page[data-name='images-categories'] > .toolbox-page-content");
                        var categoriesElements = imageCategoriesPage.find("li");
                        if (categoriesElements.length === 1) {
                            categoriesElements.first().click();
                        }
                        else {
                            imageCategoriesPage.show();
                        }
                    }
                });
            };
            // Category click
            LayoutManagerDesktop.prototype.onImageCategoryClickEvent = function (event) {
                var category = $(event.currentTarget).data("category");
                this.imagesList.empty();
                this.selectToolboxPage(Customizer.ToolboxItem.ImagesList);
                var imagesListPage = this.toolboxContent.find(".toolbox-page[data-name='images-list']");
                this.onImagesFillRequest.trigger({
                    category: category,
                    callback: function () {
                        imagesListPage.scrollTop(0);
                        imagesListPage.perfectScrollbar('update');
                    }
                });
            };
            // Image click
            LayoutManagerDesktop.prototype.onImageClickEvent = function (event) {
                var image = $(event.currentTarget).data("image");
                this.onImageSelected.trigger(image);
            };
            LayoutManagerDesktop.prototype.onImagesFilterChange = function (event) {
                var filter = this.imagesFilter.val();
                this.imagesList.find("li").each(function (i, x) {
                    var el = $(x);
                    if (filter == "" || el.data("image").get("name").toLowerCase().includes(filter.toLowerCase()))
                        el.show();
                    else
                        el.hide();
                });
            };
            // Fill macro categories
            LayoutManagerDesktop.prototype.fillImagesMacroCategories = function (categories) {
                this.imagesMacroCategories.empty();
                for (var i = 0; i < categories.length; i++) {
                    var category = categories.at(i);
                    // Avoid empty categories
                    if (category.get("imagesCount") == 0)
                        continue;
                    var html = $("<li><div class='over'><span>" + category.get("name") + "</span></div></li>");
                    html.data("category", category);
                    this.imagesMacroCategories.append(html);
                }
            };
            // Fill categories
            LayoutManagerDesktop.prototype.fillImagesCategories = function (categories) {
                this.imagesCategories.empty();
                for (var i = 0; i < categories.length; i++) {
                    var category = categories.at(i);
                    // Avoid empty categories
                    if (category.get("imagesCount") == 0)
                        continue;
                    var html = $("<li><div class='over'><span>" + category.get("name") + "</span></div></li>");
                    html.data("category", category);
                    this.imagesCategories.append(html);
                }
            };
            // Fill images
            LayoutManagerDesktop.prototype.fillImages = function (images) {
                this.imagesList.empty();
                for (var i = 0; i < images.length; i++) {
                    var image = images[i];
                    var imageName = image.get("name").includes(".") ? "" : image.get("name");
                    var html = $("<li><div class='image-container'><img src='" + image.get("choiceUrl") + "' alt=''/></div><span>" + imageName + "</span></li>");
                    html.data("image", image);
                    /*
                    if (image.get("preferredWidth") || image.get("preferredHeight"))
                        html.append("<span>" + image.get("name") + "</span>");
                    */
                    this.imagesList.append(html);
                }
                this.imagesFilter.val("").keyup();
            };
            // Upload image toolbox
            //-------------------------------------------------------------------------------
            LayoutManagerDesktop.prototype.onMasterUploadButtonClickEvent = function (event) {
                this.uploadOptions.hasClass('opened') ? this.uploadOptions.removeClass('opened') : this.uploadOptions.addClass('opened');
            };
            LayoutManagerDesktop.prototype.onUploadImageSelectedEvent = function (event) {
                var files = this.uploadImageFileInput.prop("files");
                if (!files || files.length == 0)
                    return;
                var file = files[0];
                this.uploadImageFileInput.val('');
                this.uploadImageFileInput.val(null);
                this.onUploadImageSelected.trigger({ file: file, callback: null });
            };
            LayoutManagerDesktop.prototype.onUploadPdfSelectedEvent = function (event) {
                var files = this.uploadPdfFileInput.prop("files");
                if (!files || files.length == 0)
                    return;
                var file = files[0];
                this.uploadPdfFileInput.val('');
                this.uploadPdfFileInput.val(null);
                this.onUploadPdfSelected.trigger({ file: file, callback: null });
            };
            LayoutManagerDesktop.prototype.fillUserImages = function (images) {
                var _this = this;
                this.userImagesList.empty();
                for (var i = 0; i < images.length; i++) {
                    var image = images.at(i);
                    var filterIcon = image.attributes.format != "Svg" && this.isImageFilterAvailable ? '<svg version="1.1" id="Livello_1" class="btn-filters" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox = "0 0 200 200" width="18" height="18" style= "enable-background:new 0 0 200 200;" xml: space = "preserve" ><style type="text/css" >.st0{opacity: 0.3; fill: #28292b; }.st1{opacity: 0.5; fill: #28292b; }.st2{opacity: 0.9; fill: #28292b; }</style>< g ><circle class="st0" cx= "64" cy= "133" r= "56" /><circle class="st1" cx= "98.2" cy= "67" r= "56" /><circle class="st2" cx= "136" cy= "133" r= "56" /></g></svg>' : '';
                    var html = $("<li><div class='image-container'><img src='" + image.get("choiceUrl") + "' alt=''/></div>" + filterIcon + "<div class='btn-delete'><i class='material-icons'>cancel</i></div></li>");
                    var selectedColors = image.get("selectionColors");
                    if (selectedColors) {
                        html.children('img').after("<div class='btn-edit'><i class='material-icons'>format_color_fill</i></div>");
                    }
                    html.data("image", image);
                    html.children(".btn-delete").click(function (e) { return _this.onUserImageDeleteClickEvent(e); });
                    html.children(".btn-edit").click(function (e) {
                        e.stopPropagation();
                        var imageData = $(e.currentTarget).parent().data('image');
                        _this.onImageConvertedEdit.trigger(imageData);
                    });
                    html.children(".btn-filters").click(function (e) {
                        e.stopPropagation();
                        var imageData = $(e.target).closest("svg").parent("li").data("image");
                        var imageUrl = imageData.attributes.url;
                        _this.onPhotoEditorSDKOpening.trigger({ imageUrl: imageUrl, imageData: imageData });
                    });
                    this.userImagesList.prepend(html);
                }
            };
            LayoutManagerDesktop.prototype.onUserImageClickEvent = function (event) {
                var image = $(event.currentTarget).data("image");
                this.onImageSelected.trigger(image);
            };
            LayoutManagerDesktop.prototype.onUserImageDeleteClickEvent = function (event) {
                var _this = this;
                var image = $(event.currentTarget).parent().data("image");
                event.stopPropagation();
                this.showQuestion(T._("Are you sure?", "Customizer"), T._("Do you want to delete the selected image?", "Customizer"), function (dialog) {
                    _this.onImageDeleted.trigger(image);
                    _this.closeDialog(dialog);
                });
            };
            LayoutManagerDesktop.prototype.onFacebookClickEvent = function (event) {
                this.onImagesFacebookFillRequest.trigger({ clear: true, continueCallback: this.showFacebookImagesDialog });
            };
            LayoutManagerDesktop.prototype.onInstagramClickEvent = function (event) {
                this.onImagesInstagramFillRequest.trigger({ clear: true, continueCallback: this.showInstagramImagesDialog });
            };
            LayoutManagerDesktop.prototype.showFacebookImagesDialog = function (images) {
                this.showFacebookImages(images);
            };
            LayoutManagerDesktop.prototype.showInstagramImagesDialog = function (images) {
                this.showInstagramImages(images);
            };
            // Draft designs
            //-------------------------------------------------------------------------------
            LayoutManagerDesktop.prototype.fillUserDraftDesigns = function (designs) {
                var _this = this;
                this.draftDesignList.empty();
                this.draftDesignTags.empty();
                this.noDraftDesigns.empty();
                // Fill tags
                var tags = [];
                var tagsArr = designs.map(function (x) { return x.tags; });
                for (var i = 0; i < tagsArr.length; i++) {
                    if (tagsArr[i])
                        tags = tags.concat(tagsArr[i]);
                }
                if (designs.length == 0)
                    this.noDraftDesigns.append("<h3>" + T._("You currently have no saved designs.", "Customizer") + "</h3>");
                var uniqueTags = $.unique(tags);
                if (uniqueTags && uniqueTags.length > 0) {
                    for (var i = 0; i < uniqueTags.length; i++) {
                        var htmlTag = $("<li class='primary-border-color-selected'><span>" + uniqueTags[i] + "</span></li>");
                        if (i > 1)
                            htmlTag.addClass('hidden');
                        htmlTag.data("tag", uniqueTags[i]);
                        htmlTag.click(function (e) {
                            e.stopPropagation();
                            var designs = _this.draftDesignList.find('li');
                            var currentTarget = $(e.currentTarget);
                            var tagFiltersSelected = _this.draftDesignTags.find('li.selected').map(function () {
                                return $(this).data("tag");
                            }).get();
                            if (currentTarget.hasClass('selected')) {
                                currentTarget.removeClass('selected');
                                var i_1 = tagFiltersSelected.indexOf(currentTarget.data('tag'));
                                if (i_1 != -1)
                                    tagFiltersSelected.splice(i_1, 1);
                            }
                            else {
                                currentTarget.addClass('selected');
                                if (tagFiltersSelected.length == 0)
                                    tagFiltersSelected.push(currentTarget.data('tag'));
                                else {
                                    var i_2 = tagFiltersSelected.indexOf(currentTarget.data('tag'));
                                    if (i_2 != -1)
                                        tagFiltersSelected.push(currentTarget.data('tag'));
                                }
                            }
                            if (!tagFiltersSelected || tagFiltersSelected.length == 0) {
                                designs.addClass('visible');
                                return;
                            }
                            designs.map(function () {
                                if ($(this).data('design').tags) {
                                    ($(this).data('design').tags.some(function (x) { return tagFiltersSelected.indexOf(x) >= 0; })) ? $(this).addClass('visible') : $(this).removeClass('visible');
                                }
                            });
                        });
                        this.draftDesignTags.append(htmlTag);
                    }
                    if (uniqueTags.length > 2) {
                        var htmlMoreTag = $("<li class='primary-border-color-selected more-tags'><span> + " + (uniqueTags.length - 2) + "</span></li>");
                        this.draftDesignTags.append(htmlMoreTag);
                        htmlMoreTag.click(function (e) {
                            _this.draftDesignTags.find('li.hidden').removeClass('hidden');
                            $(e.currentTarget).addClass('hidden');
                        });
                    }
                }
                // Fill draft designs
                for (var i = 0; i < designs.length; i++) {
                    var design = designs[i];
                    var html = $("<li class='visible'><img src='" + design.tempPreviewImageUrl + "' alt=''/><div class='btn-delete'><i class='material-icons'>cancel</i></div></li>");
                    html.data("design", design);
                    html.find("img").click(function (e) { return _this.onUserDraftDesignSelectClickEvent(e); });
                    html.children(".btn-delete").click(function (e) { return _this.onUserDraftDesignDeleteClickEvent(e); });
                    this.draftDesignList.prepend(html);
                }
            };
            LayoutManagerDesktop.prototype.onUserDraftDesignDeleteClickEvent = function (event) {
                var _this = this;
                var design = $(event.currentTarget).parent().data("design");
                event.stopPropagation();
                this.showQuestion(T._("Are you sure?", "Customizer"), T._("Do you want to delete the selected design?", "Customizer"), function (dialog) {
                    _this.onDesignDraftDeleted.trigger(design);
                    _this.closeDialog(dialog);
                });
            };
            LayoutManagerDesktop.prototype.onUserDraftDesignSelectClickEvent = function (event) {
                var design = $(event.currentTarget).parent().data("design");
                event.stopPropagation();
                this.onDesignDraftSelected.trigger(design);
            };
            // Templates
            //-------------------------------------------------------------------------------
            LayoutManagerDesktop.prototype.fillTemplates = function (templatesStructure) {
                this.templatesList.empty();
                this.cbTemplatesCategories.empty();
                this.cbTemplatesCategories.append("<option value='all'>" + T._("All categories", "Customizer") + "</option>");
                for (var _i = 0, templatesStructure_1 = templatesStructure; _i < templatesStructure_1.length; _i++) {
                    var macroCategory = templatesStructure_1[_i];
                    this.cbTemplatesCategories.append("<option class='label'>" + (macroCategory.isDummy ? T._("Other", "Customizer") : macroCategory.name) + "</option>");
                    for (var _a = 0, _b = macroCategory.categories; _a < _b.length; _a++) {
                        var category = _b[_a];
                        this.cbTemplatesCategories.append("<option value='" + category.id + "'>" + (category.isDummy ? T._("Other", "Customizer") : category.name) + "</option>");
                        // Add all templates
                        for (var _c = 0, _d = category.templates; _c < _d.length; _c++) {
                            var template = _d[_c];
                            var html = $("<li class='template-item'><div class='border'></div></li>");
                            html.data("template", template);
                            html.data("category", category);
                            html.children(".border").append("<img src='" + template.previewUrl + "' alt='' />");
                            html.children(".border").append("<span>" + template.name);
                            this.templatesList.append(html);
                        }
                    }
                }
                this.cbTemplatesCategories.combobox("refreshItems");
                this.cbTemplatesCategories.combobox("value", "all");
            };
            LayoutManagerDesktop.prototype.fillTemplatesCategories = function (categories) {
                var _this = this;
                this.cbTemplatesAllCategories.empty();
                this.cbTemplatesAllCategories.append("<option value='-1'>" + T._("Other", "Customizer") + "</option>");
                categories.each(function (macroCategory) {
                    _this.cbTemplatesAllCategories.append("<option class='label'>" + (macroCategory.get("isDummy") ? T._("Other", "Customizer") : macroCategory.get("name")) + "</option>");
                    macroCategory.get("categories").each(function (category) {
                        _this.cbTemplatesAllCategories.append("<option value='" + category.id + "'>" + (category.get("isDummy") ? T._("Other", "Customizer") : category.get("name")) + "</option>");
                    });
                });
                this.cbTemplatesAllCategories.combobox("refreshItems");
                this.cbTemplatesAllCategories.combobox("value", -1);
            };
            LayoutManagerDesktop.prototype.onTemplateCategoryChange = function (e) {
                var selectedCategoryId = $(e.currentTarget).val();
                this.templatesList.find(".template-item").hide().filter(function (idx, el) {
                    return selectedCategoryId == "all" || $(el).data("category").id == selectedCategoryId;
                }).show();
            };
            LayoutManagerDesktop.prototype.onTemplateSelectedEvent = function (e) {
                var template = $(e.currentTarget).data("template");
                // Selection class
                this.templatesList.find(".template-item").removeClass("active");
                $(e.currentTarget).addClass("active");
                // Trigger event
                this.onTemplateSelected.trigger({
                    template: template,
                    callback: null
                });
            };
            LayoutManagerDesktop.prototype.selectTemplate = function (template) {
                this.templatesList.find(".template-item").filter(function (idx, el) {
                    return $(el).data("template") == template;
                }).click();
            };
            LayoutManagerDesktop.prototype.getTemplateSettings = function () {
                var _this = this;
                var designSidesRestrictions = [];
                $(".template-constraints-side").each(function (idx, el) {
                    var side = $(el).data("side");
                    var uploadRestrictionsSide = $(el).find(".cb-template-upload-restrictions");
                    designSidesRestrictions.push({
                        sideId: side.id,
                        canAddImage: $(el).find(".cb-template-can-add-image").prop("checked"),
                        canAddText: $(el).find(".cb-template-can-add-text").prop("checked"),
                        maxNrTexts: $(el).find(".txt-template-max-text").val(),
                        maxNrImages: $(el).find(".txt-template-max-images").val(),
                        uploadRestrictions: _this.uploadRestrictionsRules.reduce(function (restrictionObject, rule) {
                            return __assign({}, restrictionObject, (_a = {}, _a[rule] = uploadRestrictionsSide.find("[data-source='" + rule + "']").prop("checked"), _a));
                            var _a;
                        }, {}),
                        disableSellerImages: $(el).find(".cb-template-disable-seller-images").prop("checked")
                    });
                });
                return {
                    name: this.cbTemplatesName.val(),
                    categoryId: this.cbTemplatesAllCategories.val(),
                    hasSyncEnabled: this.cbTemplatesSyncEnabled.prop("checked"),
                    constraintsFilter: this.cbTemplatesRestrictionsFilter.val(),
                    canAddImage: this.cbTemplatesCanAddImage.prop("checked"),
                    canAddText: this.cbTemplatesCanAddText.prop("checked"),
                    maxNrTexts: this.cbTemplatesMaxText.val(),
                    maxNrImages: this.cbTemplatesMaxImages.val(),
                    uploadRestrictions: this.uploadRestrictionsRules.reduce(function (restrictionObject, rule) {
                        return __assign({}, restrictionObject, (_a = {}, _a[rule] = _this.cbTemplatesUploadRestrictions.find("[data-source='" + rule + "']").prop("checked"), _a));
                        var _a;
                    }, {}),
                    designSidesRestrictions: designSidesRestrictions,
                    disableSellerImages: this.cbTemplatesDisableSellerImages.prop("checked")
                };
            };
            LayoutManagerDesktop.prototype.getVisibleToolboxItems = function () {
                return this.toolbox.find(".toolbox-item:visible");
            };
            LayoutManagerDesktop.prototype.getTemplateSyncEnabled = function () {
                return this.cbTemplatesSyncEnabled.prop("checked");
            };
            LayoutManagerDesktop.prototype.setTemplateSettings = function (settings) {
                var _this = this;
                this.cbTemplatesName.val(settings.name);
                this.cbTemplatesAllCategories.combobox("value", settings.categoryId);
                this.cbTemplatesSyncEnabled.prop("checked", settings.hasSyncEnabled).change();
                this.cbTemplatesCanAddImage.prop("checked", settings.canAddImage).change();
                this.cbTemplatesCanAddText.prop("checked", settings.canAddText).change();
                this.cbTemplatesMaxImages.val(settings.maxNrImages);
                this.cbTemplatesMaxText.val(settings.maxNrTexts);
                this.cbTemplatesDisableSellerImages.prop("checked", settings.disableSellerImages).change();
                //Set upload restrictions
                this.cbTemplatesUploadRestrictions.find("[data-source='isPdfAllowed']").on("change", function (e) {
                    var target = $(e.target);
                    var el = target.parent().siblings(".pdf-with-raster-check");
                    if (target.prop("checked"))
                        el.show();
                    else
                        el.hide().children("input").prop("checked", true).change();
                }).end().find("[data-source='isUserImageAllowed']").on("change", function (e) {
                    var target = $(e.target);
                    var el = target.parent().siblings(".jpg-check, .png-check, .svg-check");
                    if (target.prop("checked"))
                        el.show();
                    else
                        el.hide().children("input").prop("checked", true).change();
                });
                this.uploadRestrictionsRules.forEach(function (rule) { return _this.cbTemplatesUploadRestrictions.find("[data-source='" + rule + "']").prop("checked", settings.uploadRestrictions[rule] == null ? true : settings.uploadRestrictions[rule]).change(); });
                //Check if pdf and eps can be shown
                if ((this.activeAddons.find(function (a) { return a.AddonName === "PDF_EPS"; }) == undefined) && (this.activeAddons.find(function (a) { return a.AddonName === "PDF"; }) == undefined))
                    this.cbTemplatesUploadRestrictions.find(".pdf-check, .pdf-with-raster-check").hide();
                else
                    this.cbTemplatesUploadRestrictions.find(".pdf-check, .pdf-with-raster-check").show();
                if ((this.activeAddons.find(function (a) { return a.AddonName === "PDF_EPS"; }) == undefined) && (this.activeAddons.find(function (a) { return a.AddonName === "EPS"; }) == undefined))
                    this.cbTemplatesUploadRestrictions.find(".eps-check").hide();
                else
                    this.cbTemplatesUploadRestrictions.find(".eps-check").show();
            };
            LayoutManagerDesktop.prototype.onTemplateRestrictionsFilterChange = function (e) {
                var value = this.cbTemplatesRestrictionsFilter.val();
                var container = $("#template-constraints");
                if (value == "global") {
                    container.find(".template-constraints-side").hide();
                    container.find(".template-constraints-global").show();
                }
                else {
                    container.find(".template-constraints-global").hide();
                    container.find(".template-constraints-side").show();
                }
            };
            LayoutManagerDesktop.prototype.addTemplateRestrictionsForm = function (side, designSide) {
                var container = $("#template-constraints");
                var html = "<div class='template-constraints-form'>\n                            <div class=\"row\">\n                                <label class=\"template-constraint-side-name\"><strong></strong></label>\n                            </div>\n                            <div class=\"row\">\n                                <label><input type=\"checkbox\" class=\"cb-template-disable-seller-images\" /><span>" + T._("Disable seller images gallery", "Customizer") + "</span></label>\n                            </div>\n                            <div class=\"row\">\n                                <label><input type=\"checkbox\" class=\"cb-template-can-add-image\" checked /><span>" + T._("Can add images", "Customizer") + "</span></label>\n                            </div>\n                            <div class=\"row\">\n                                <label class=\"lbl-template-max-images\">" + T._("Max number of images", "Customizer") + "</label>\n                                <input type=\"number\" class=\"txt-template-max-images\" />\n                            </div>\n                            <div class=\"row\">\n                                <label><input type=\"checkbox\" class=\"cb-template-can-add-text\" checked/><span>" + T._("Can add text", "Customizer") + "</span></label>\n                            </div>\n                            <div class=\"row\">\n                                <label class=\"lbl-template-max-text\">" + T._("Max number of text", "Customizer") + "</label>\n                                <input type=\"number\" class=\"txt-template-max-text\" />\n                            </div>\n                            <div class=\"row cb-template-upload-restrictions\">\n                                <label class=\"lbl-template-upload-restrictions\">" + T._("Images upload options (check to allow)", "Customizer") + "</label>\n                                <label class=\"user-images-check\"><input type=\"checkbox\" data-source=\"isUserImageAllowed\" /><span>" + T._("User own images", "Customizer") + "</span></label>\n                                <label class=\"jpg-check subcheck\"><input type=\"checkbox\" data-source=\"isJpgAllowed\" />" + T._("JPG", "Customizer") + "</label>\n                                <label class=\"png-check subcheck\"><input type=\"checkbox\" data-source=\"isPngAllowed\" />" + T._("PNG", "Customizer") + "</label>\n                                <label class=\"svg-check subcheck\"><input type=\"checkbox\" data-source=\"isSvgAllowed\" />" + T._("SVG", "Customizer") + "</label>\n                                <label class=\"pdf-check\"><input type=\"checkbox\" data-source=\"isPdfAllowed\" /><span>" + T._("PDF", "Customizer") + "</span></label>\n                                <label class=\"pdf-with-raster-check subcheck\"><input type=\"checkbox\" data-source=\"isPdfWithRasterAllowed\" /><span>" + T._("With rasters", "Customizer") + "</span></label>\n                                <label class=\"eps-check\"><input type=\"checkbox\" data-source=\"isEpsAllowed\" /><span>" + T._("EPS", "Customizer") + "</span></label>\n                                <label><input type=\"checkbox\" data-source=\"isFacebookAllowed\" /><span>" + T._("Facebook", "Customizer") + "</span></label>\n                                <label><input type=\"checkbox\" data-source=\"isInstagramAllowed\" /><span>" + T._("Instagram", "Customizer") + "</span></label>\n                            </div>\n                        </div>";
                var dom = $(html)
                    .data("side", side)
                    .addClass("template-constraints-side")
                    .appendTo(container)
                    .find(".template-constraint-side-name > strong").text(side.get("name")).end()
                    .find("input[type=checkbox]").checkbox().end();
                dom.find(".row.cb-template-upload-restrictions [data-source='isPdfAllowed']")[0].addEventListener("change", function (e) {
                    var target = $(e.target);
                    var el = target.parent().siblings(".pdf-with-raster-check");
                    if (target.prop("checked"))
                        el.show();
                    else
                        el.hide().children("input").prop("checked", true).change();
                });
                dom.find(".row.cb-template-upload-restrictions [data-source='isUserImageAllowed']")[0].addEventListener("change", function (e) {
                    var target = $(e.target);
                    var el = target.parent().siblings(".jpg-check, .png-check, .svg-check");
                    if (target.prop("checked"))
                        el.show();
                    else
                        el.hide().children("input").prop("checked", true).change();
                });
                if (designSide) {
                    dom.find(".cb-template-can-add-text").prop("checked", designSide.get("canAddText")).change();
                    dom.find(".cb-template-can-add-image").prop("checked", designSide.get("canAddImage")).change();
                    dom.find(".txt-template-max-images").val(designSide.get("maxNrImages"));
                    dom.find(".txt-template-max-text").val(designSide.get("maxNrTexts"));
                    dom.find(".cb-template-disable-seller-images").prop("checked", designSide.get("disableSellerImages")).change();
                    //Set upload restrictions
                    var uploadRestrictionsDom_1 = dom.find(".cb-template-upload-restrictions");
                    var sideUploadRestrictions_1 = designSide.get("uploadRestrictions") || {};
                    this.uploadRestrictionsRules.forEach(function (rule) { return uploadRestrictionsDom_1.find("[data-source='" + rule + "']").prop("checked", sideUploadRestrictions_1[rule] == null ? true : sideUploadRestrictions_1[rule]).change(); });
                    //Check if pdf and eps can be shown
                    if ((this.activeAddons.find(function (a) { return a.AddonName === "PDF_EPS"; }) == undefined) && (this.activeAddons.find(function (a) { return a.AddonName === "PDF"; }) == undefined))
                        uploadRestrictionsDom_1.find(".pdf-check, .pdf-with-raster-check").hide();
                    else
                        uploadRestrictionsDom_1.find(".pdf-check, .pdf-with-raster-check").show();
                    if ((this.activeAddons.find(function (a) { return a.AddonName === "PDF_EPS"; }) == undefined) && (this.activeAddons.find(function (a) { return a.AddonName === "EPS"; }) == undefined))
                        uploadRestrictionsDom_1.find(".eps-check").hide();
                    else
                        uploadRestrictionsDom_1.find(".eps-check").show();
                }
            };
            LayoutManagerDesktop.prototype.fillTemplateRestrictionsSides = function (sides) {
                var designSidesCount = 0;
                for (var _i = 0, sides_1 = sides; _i < sides_1.length; _i++) {
                    var side = sides_1[_i];
                    if (side.designSide)
                        designSidesCount++;
                    this.addTemplateRestrictionsForm(side.side, side.designSide);
                }
                this.cbTemplatesRestrictionsFilter.combobox("value", designSidesCount == 0 ? "global" : "side").change();
            };
            LayoutManagerDesktop.prototype.setElementSyncedRowVisibility = function (visible) {
                if (visible)
                    this.toolboxContent.find("#cb-element-constraint-is-synced-row").show();
                else
                    this.toolboxContent.find("#cb-element-constraint-is-synced-row").hide();
                this.onElementConstraintUpdateRequested.trigger();
            };
            LayoutManagerDesktop.prototype.setElementRestrictions = function (itemType, constraints) {
                this.toolboxContent.find("#cb-element-constraint-can-edit-text").prop("checked", constraints.get("canEdit")).change();
                this.toolboxContent.find("#cb-element-constraint-can-edit-image").prop("checked", constraints.get("canEdit")).change();
                var isSynced = constraints.syncGuid != null;
                this.toolboxContent.find("#cb-element-constraint-is-synced").prop("checked", isSynced).data("itemType", itemType).change();
                this.toolboxContent.find("#cb-element-constraint-is-content-synced").prop("checked", isSynced && constraints.get("canSyncContent")).change();
                this.toolboxContent.find("#cb-element-constraint-is-text-style-synced").prop("checked", isSynced && constraints.get("canSyncAlignment")).change();
                this.toolboxContent.find("#cb-element-constraint-is-text-style-synced").prop("checked", isSynced && constraints.get("canSyncFontFamily")).change();
                this.toolboxContent.find("#cb-element-constraint-is-text-style-synced").prop("checked", isSynced && constraints.get("canSyncFontStyle")).change();
                this.toolboxContent.find("#cb-element-constraint-is-text-style-synced").prop("checked", isSynced && constraints.get("canSyncFontColor")).change();
                this.toolboxContent.find("#cb-element-constraint-is-text-style-synced").prop("checked", isSynced && constraints.get("canSyncCurved")).change();
                this.toolboxContent.find("#cb-element-constraint-is-transform-synced").prop("checked", isSynced && constraints.get("canSyncTransforms")).change();
                this.toolboxContent.find("#cb-element-constraint-can-move").prop("checked", constraints.get("canMove")).change();
                this.toolboxContent.find("#cb-element-constraint-can-rotate").prop("checked", constraints.get("canRotate")).change();
                this.toolboxContent.find("#cb-element-constraint-can-resize").prop("checked", constraints.get("canResize")).change();
                this.toolboxContent.find("#cb-element-constraint-can-delete").prop("checked", constraints.get("canDelete")).change();
                this.toolboxContent.find("#cb-element-constraint-can-transform").prop("checked", constraints.get("canTransform")).change();
                this.toolboxContent.find("#cb-element-constraint-is-always-on-top").prop("checked", constraints.get("isAlwaysOnTop")).change();
                this.toolboxContent.find("#cb-element-constraint-font-family").prop("checked", constraints.get("canChangeFontFamily")).change();
                this.toolboxContent.find("#cb-element-constraint-font-color").prop("checked", constraints.get("canChangeFontColor")).change();
                this.toolboxContent.find("#cb-element-constraint-font-weight").prop("checked", constraints.get("canChangeFontWeight")).change();
                this.toolboxContent.find("#cb-element-constraint-convert-to-path").prop("checked", constraints.get("canChangeTextPathMode")).change();
                this.toolboxContent.find("#cb-element-constraint-can-change-svg-colors").prop("checked", constraints.get("canChangeSvgColors")).change();
                this.toolboxContent.find("#cb-element-constraint-is-printable").prop("checked", constraints.get("isPrintable")).change();
                this.toolboxContent.find("#txt-element-constraint-min-chars").val(constraints.get("minNrChars") > 0 ? constraints.get("minNrChars") : "");
                this.toolboxContent.find("#txt-element-constraint-max-chars").val(constraints.get("maxNrChars") > 0 ? constraints.get("maxNrChars") : "");
                this.toolboxContent.find("#txt-element-constraint-padding-string").val(constraints.get("paddingString"));
                this.toolboxContent.find(".rb-element-constraint-padding-type[value='" + constraints.get("paddingTypeID") + "']").prop("checked", true).change();
                this.toolboxContent.find("#cb-element-constraint-mandatory-edit").prop("checked", constraints.get("mandatoryToEdit")).change();
                if (itemType == "image" || itemType == "svg") {
                    this.toolboxContent.find("#cb-element-constraint-can-edit-image").closest(".row").show();
                    this.toolboxContent.find("#cb-element-constraint-can-edit-text").closest(".row").hide();
                    this.toolboxContent.find("#cb-element-constraint-font-family").closest(".row").hide();
                    this.toolboxContent.find("#cb-element-constraint-font-color").closest(".row").hide();
                    this.toolboxContent.find("#cb-element-constraint-font-weight").closest(".row").hide();
                    this.toolboxContent.find("#cb-element-constraint-convert-to-path").closest(".row").hide();
                    this.toolboxContent.find("#txt-element-constraint-min-chars").closest(".row").hide();
                    this.toolboxContent.find("#txt-element-constraint-max-chars").closest(".row").hide();
                    this.toolboxContent.find("#txt-element-constraint-padding-string").closest(".row").hide();
                    this.toolboxContent.find(".rb-element-constraint-padding-type").closest(".row").hide();
                    // HR
                    this.toolboxContent.find("#cb-element-constraint-font-family").closest(".row").prev().hide();
                    this.toolboxContent.find("#txt-element-constraint-min-chars").closest(".row").prev().hide();
                    if (itemType == "svg") {
                        this.toolboxContent.find("#cb-element-constraint-can-change-svg-colors").closest(".row").prev().show();
                        this.toolboxContent.find("#cb-element-constraint-can-change-svg-colors").closest(".row").show();
                    }
                    else {
                        this.toolboxContent.find("#cb-element-constraint-can-change-svg-colors").closest(".row").prev().hide();
                        this.toolboxContent.find("#cb-element-constraint-can-change-svg-colors").closest(".row").hide();
                    }
                }
                else {
                    this.toolboxContent.find("#cb-element-constraint-can-edit-image").closest(".row").hide();
                    this.toolboxContent.find("#cb-element-constraint-can-change-svg-colors").closest(".row").hide();
                    this.toolboxContent.find("#cb-element-constraint-can-edit-text").closest(".row").show();
                    this.toolboxContent.find("#cb-element-constraint-font-family").closest(".row").show();
                    this.toolboxContent.find("#cb-element-constraint-font-color").closest(".row").show();
                    this.toolboxContent.find("#cb-element-constraint-font-weight").closest(".row").show();
                    this.toolboxContent.find("#cb-element-constraint-convert-to-path").closest(".row").show();
                    this.toolboxContent.find("#txt-element-constraint-min-chars").closest(".row").show();
                    this.toolboxContent.find("#txt-element-constraint-max-chars").closest(".row").show();
                    this.toolboxContent.find("#txt-element-constraint-padding-string").closest(".row").show();
                    this.toolboxContent.find(".rb-element-constraint-padding-type").closest(".row").show();
                    // HR
                    this.toolboxContent.find("#cb-element-constraint-font-family").closest(".row").prev().show();
                    this.toolboxContent.find("#txt-element-constraint-min-chars").closest(".row").prev().show();
                    this.toolboxContent.find("#cb-element-constraint-can-change-svg-colors").closest(".row").prev().hide();
                }
            };
            LayoutManagerDesktop.prototype.getElementRestrictions = function () {
                var canSyncTextStyle = this.toolboxContent.find("#cb-element-constraint-is-text-style-synced").prop("checked");
                var constraints = {
                    canEditText: this.toolboxContent.find("#cb-element-constraint-can-edit-text").prop("checked"),
                    canEditImage: this.toolboxContent.find("#cb-element-constraint-can-edit-image").prop("checked"),
                    isSynced: this.toolboxContent.find("#cb-element-constraint-is-synced").prop("checked"),
                    canMove: this.toolboxContent.find("#cb-element-constraint-can-move").prop("checked"),
                    canRotate: this.toolboxContent.find("#cb-element-constraint-can-rotate").prop("checked"),
                    canResize: this.toolboxContent.find("#cb-element-constraint-can-resize").prop("checked"),
                    canDelete: this.toolboxContent.find("#cb-element-constraint-can-delete").prop("checked"),
                    canTransform: this.toolboxContent.find("#cb-element-constraint-can-transform").prop("checked"),
                    isAlwaysOnTop: this.toolboxContent.find("#cb-element-constraint-is-always-on-top").prop("checked"),
                    canChangeFontFamily: this.toolboxContent.find("#cb-element-constraint-font-family").prop("checked"),
                    canChangeFontColor: this.toolboxContent.find("#cb-element-constraint-font-color").prop("checked"),
                    canChangeFontWeight: this.toolboxContent.find("#cb-element-constraint-font-weight").prop("checked"),
                    canChangeTextPathMode: this.toolboxContent.find("#cb-element-constraint-convert-to-path").prop("checked"),
                    canChangeSvgColors: this.toolboxContent.find("#cb-element-constraint-can-change-svg-colors").prop("checked"),
                    isPrintable: this.toolboxContent.find("#cb-element-constraint-is-printable").prop("checked"),
                    minChars: this.toolboxContent.find("#txt-element-constraint-min-chars").val(),
                    maxChars: this.toolboxContent.find("#txt-element-constraint-max-chars").val(),
                    paddingString: this.toolboxContent.find("#txt-element-constraint-padding-string").val(),
                    paddingTypeID: this.toolboxContent.find(".rb-element-constraint-padding-type:checked").val(),
                    mandatoryToEdit: this.toolboxContent.find("#cb-element-constraint-mandatory-edit").prop("checked"),
                    canSyncContent: this.toolboxContent.find("#cb-element-constraint-is-content-synced").prop("checked"),
                    canSyncAlignment: canSyncTextStyle,
                    canSyncFontFamily: canSyncTextStyle,
                    canSyncFontStyle: canSyncTextStyle,
                    canSyncFontColor: canSyncTextStyle,
                    canSyncCurved: canSyncTextStyle,
                    canSyncTransforms: this.toolboxContent.find("#cb-element-constraint-is-transform-synced").prop("checked")
                };
                return constraints;
            };
            LayoutManagerDesktop.prototype.onTemplateConstraintsChanged = function (e) {
                var dom = $(e.currentTarget);
                var canAddImages = dom.find(".cb-template-can-add-image").prop("checked");
                var canAddText = dom.find(".cb-template-can-add-text").prop("checked");
                if (canAddText)
                    dom.find(".txt-template-max-text").removeAttr("disabled");
                else
                    dom.find(".txt-template-max-text").attr("disabled", "disabled").val("");
                if (canAddImages)
                    dom.find(".txt-template-max-images").removeAttr("disabled");
                else
                    dom.find(".txt-template-max-images").attr("disabled", "disabled").val("");
            };
            // Print types toolbox
            //-------------------------------------------------------------------------------
            LayoutManagerDesktop.prototype.onPrintTypeClickEvent = function (event) {
                var _this = this;
                var item = $(event.currentTarget);
                var printType = item.data("printType");
                this.currentColor.get("sides").each(function (side) {
                    _this.onPrintTypeSelected.trigger({
                        printTypeId: printType.id,
                        side: side,
                        previousSide: side,
                        callback: function () {
                            item.addClass("active").siblings().removeClass("active");
                        }
                    });
                });
            };
            LayoutManagerDesktop.prototype.fillPrintTypes = function (design, printTypes) {
                var _this = this;
                this.printTypes.empty();
                this.sidesPrintTypes.find("select").combobox("destroy");
                this.sidesPrintTypes.empty();
                var modelPrintTypes = printTypes.find(function (x) { return x.side == null; }).prints;
                modelPrintTypes.forEach(function (printType) {
                    var html = $("<li>" + printType.get("name") + "</li>");
                    html.data("printType", printType);
                    _this.printTypes.append(html);
                });
                if (modelPrintTypes.length < 2) {
                    this.toolbox.find(".toolbox-item[data-name='print-types']").hide();
                    this.toolboxContent.find("[data-name='print-types']").hide();
                }
                printTypes.slice(1).forEach(function (x) {
                    var side = x.side;
                    var sideName = $("<span>" + side.get("name") + "</span>");
                    var sideSelect = $("<select></select>");
                    sideSelect.data("side", side);
                    x.prints.forEach(function (print) {
                        var sideOption = $("<option value='" + print.id + "'>" + print.get("name") + "</option>");
                        sideOption.data("printType", print);
                        sideSelect.append(sideOption);
                    });
                    _this.sidesPrintTypes.append(sideName);
                    _this.sidesPrintTypes.append(sideSelect);
                    sideSelect.combobox();
                    sideSelect.change(function (e) {
                        var selectedPrint = $(e.target).combobox("value");
                        if (!design || !selectedPrint)
                            return;
                        var designSidePrintType = design.get("sidesPrintTypes").find(function (print) {
                            return print.get("modelID") == side.getModelID() &&
                                print.get("colorID") == side.getColorID() &&
                                print.get("sideID") == side.getSideID();
                        });
                        if (designSidePrintType) {
                            designSidePrintType.set("printTypeID", selectedPrint);
                        }
                        else {
                            designSidePrintType = new MPlaza.DesignSidePrintType({
                                modelID: side.getModelID(),
                                colorID: side.getColorID(),
                                sideID: side.getSideID(),
                                printTypeID: selectedPrint
                            });
                            design.get("sidesPrintTypes").add(designSidePrintType);
                        }
                        var previousSide = $(e.target).data("previousValue");
                        $(e.target).data("previousValue", selectedPrint);
                        _this.onPrintTypeSelected.trigger({
                            printTypeId: selectedPrint,
                            side: side,
                            previousSide: previousSide,
                            callback: function () { }
                        });
                    });
                    //Select the correct print type
                    var designSidePrintType = design.get("sidesPrintTypes").find(function (print) {
                        return print.get("modelID") == side.getModelID() &&
                            print.get("colorID") == side.getColorID() &&
                            print.get("sideID") == side.getSideID();
                    });
                    var startingPrintID = design.get("printTypeID");
                    if (designSidePrintType)
                        startingPrintID = designSidePrintType.get("printTypeID");
                    sideSelect.combobox("value", startingPrintID);
                    sideSelect.combobox("refreshLayout");
                    sideSelect.data("previousValue", startingPrintID);
                    sideSelect.change();
                });
                this.fixToolboxHeight();
            };
            LayoutManagerDesktop.prototype.selectPrintType = function (printType) {
                this.printTypes.children("li").each(function () {
                    if ($(this).data("printType") == printType) {
                        $(this).click();
                    }
                });
            };
            LayoutManagerDesktop.prototype.resetPrintTypeSelection = function (side, previousValue) {
                this.sidesPrintTypes.find("select").each(function (i, x) {
                    var el = $(x);
                    if (el.data("side") && el.data("side").id == side.id && el.data("previousValue")) {
                        el.combobox("value", previousValue);
                        el.combobox("refreshLayout");
                        el.change();
                    }
                });
            };
            LayoutManagerDesktop.prototype.updateSidePrintTypesSelection = function (design, sides) {
                return;
                // if (!design || !sides)
                //     return;
                // sides.each(side => {
                //     this.sidesPrintTypes.find("select").each((i, x) => {
                //         let el = $(x);
                //         if (el.data("side") && el.data("side").id == side.id) {
                //             var designSidePrintType = design.get("sidesPrintTypes").find(print =>
                //                 print.get("modelID") == side.getModelID() &&
                //                 print.get("colorID") == side.getColorID() &&
                //                 print.get("sideID") == side.getSideID());
                //             let printTypeID = null;
                //             if (designSidePrintType)
                //                 printTypeID = designSidePrintType.get("printTypeID");
                //             else
                //                 printTypeID = design.get("printTypeID");
                //             if (printTypeID == null)
                //                 return;
                //             el.combobox("value", printTypeID);
                //             el.combobox("refreshLayout");
                //             el.change();
                //         }
                //     });
                // });
            };
            // Messagebox
            //-------------------------------------------------------------------------------
            LayoutManagerDesktop.prototype.showSuccess = function (title, message, callback) {
                this.showDialog(title, message, "dialog_warning", { "OK": callback });
            };
            LayoutManagerDesktop.prototype.showError = function (title, message, callback) {
                this.showDialog(title, message, "dialog_warning", { "OK": callback });
            };
            LayoutManagerDesktop.prototype.showAbort = function (title, message, callback) {
                this.showDialog(title, message, "dialog_warning", { "OK": callback });
            };
            LayoutManagerDesktop.prototype.showQuestion = function (title, message, callback) {
                this.showDialog(title, message, "dialog_warning", (_a = {},
                    _a[T._("YES", "Customizer")] = callback,
                    _a[T._("NO", "Customizer")] = null,
                    _a));
                var _a;
            };
            LayoutManagerDesktop.prototype.showEditDrafDesignDialog = function (designToSave, showCopyBtn) {
                var _this = this;
                var tempPreviewImage = '';
                if (designToSave.attributes)
                    tempPreviewImage = designToSave.attributes.tempPreviewImageData;
                else
                    tempPreviewImage = designToSave.tempPreviewImageUrl;
                var content = $("<img src='" + tempPreviewImage + "' alt=''/><div class='row'><label>" + T._("Name", "Customizer") + "</label><input id='namedesign' placeholde='name' type='text' placeholder='Design name' /></div><div class='row'><label>" + T._("Tags", "Customizer") + "</label><input id='tagdesign' placeholder='your tags' type='text' /></div><div class='dialog-buttons'></div>");
                content.find('#namedesign').val(designToSave.get('name'));
                content.find('#tagdesign').val(designToSave.get('tags'));
                content.find('#tagdesign').tagify({
                    duplicates: false
                });
                var dialog = this.openDialog(content, 'dlg-savedesign');
                var htmlBtnSave = $("<button class='btn btn-primary'><i class='material-icons'>save</i><span>" + T._("save", "Customizer") + "</span></button>");
                var htmlBtnSaveCopy = $("<button class='btn btn-primary'><i class='material-icons'>save</i><span>" + T._("Save as new", "Customizer") + "</span></button>");
                htmlBtnSave.click(function () {
                    _this.onDialogSaveDraftDesign.trigger({
                        name: content.find('#namedesign').val(),
                        tags: content.find('#tagdesign').val()
                    });
                    _this.closeDialog(dialog);
                });
                htmlBtnSaveCopy.click(function () {
                    _this.onDialogSaveCopyDraftDesign.trigger({
                        name: content.find('#namedesign').val(),
                        tags: content.find('#tagdesign').val()
                    });
                    _this.closeDialog(dialog);
                });
                dialog.find(".dialog-buttons").append(htmlBtnSave);
                if (showCopyBtn)
                    dialog.find(".dialog-buttons").append(htmlBtnSaveCopy);
                return dialog;
            };
            LayoutManagerDesktop.prototype.showFacebookImages = function (images, callback) {
                var _this = this;
                var dialog = $("#dlg-images");
                var isNew = false;
                if (dialog.length == 0) {
                    var content = $("\n                            <ul></ul>\n                        ");
                    dialog = this.openDialog(content, "dlg-images");
                    dialog.on("click", "li", function (e) {
                        _this.onImageFacebookClicked.trigger($(e.currentTarget).data("id"));
                        _this.closeDialog(dialog);
                    });
                    isNew = true;
                }
                var list = dialog.find("ul");
                if (isNew) {
                    list.perfectScrollbar();
                    list.on("ps-y-reach-end", function () {
                        _this.onImagesFacebookFillRequest.trigger({ clear: false, continueCallback: _this.showFacebookImagesDialog });
                    });
                }
                for (var i = 0; i < images.length; i++) {
                    var html = $("<li data-id='" + images[i].id + "'><div></div></li>");
                    html.css("background-image", "url('" + images[i].source + "')");
                    html.appendTo(list);
                }
                list.perfectScrollbar("update");
            };
            LayoutManagerDesktop.prototype.showInstagramImages = function (images, callback) {
                var _this = this;
                var dialog = $("#dlg-images");
                var isNew = false;
                if (dialog.length == 0) {
                    var content = $("\n                            <ul></ul>\n                        ");
                    dialog = this.openDialog(content, "dlg-images");
                    dialog.on("click", "li", function (e) {
                        _this.onImageInstagramClicked.trigger($(e.currentTarget).data("id"));
                        _this.closeDialog(dialog);
                    });
                    isNew = true;
                }
                var list = dialog.find("ul");
                if (isNew) {
                    list.perfectScrollbar();
                    list.on("ps-y-reach-end", function () {
                        _this.onImagesInstagramFillRequest.trigger({ clear: false, continueCallback: _this.showInstagramImagesDialog });
                    });
                }
                for (var i = 0; i < images.length; i++) {
                    var html = $("<li data-id='" + images[i].id + "'><div></div></li>");
                    html.css("background-image", "url('" + images[i].source + "')");
                    html.appendTo(list);
                }
                list.perfectScrollbar("update");
            };
            LayoutManagerDesktop.prototype.showSelectColorDialog = function (text, colors, isWarning) {
                if (isWarning === void 0) { isWarning = true; }
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var that;
                    return __generator(this, function (_a) {
                        that = this;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var content = $((isWarning ? ("<h1 class='primary-color'>" + T._("Warning!", "Customizer") + "</h1>") : "") +
                                    "<p>" + text + "</p>" +
                                    "<button type='button' class='btn btn-primary btn-back-to-store'>" + T._("Return to store", "Customizer") + "</button>" +
                                    "<ul></ul >");
                                var dialog = _this.openDialog(content, "dlg-select-colors", false);
                                dialog.find(".btn-back-to-store").hide();
                                var list = dialog.find("ul");
                                list.perfectScrollbar();
                                // Fill colors list
                                colors.forEach(function (color) {
                                    var html = $("<li data-id='" + color.id + "'><div></div></li>");
                                    html.append("<img src='" + color.get("sides").at(0).get("imageUrl") + "' alt='" + color.get("name") + "' />");
                                    html.append("<span>" + color.get("name"));
                                    html.data("color", color);
                                    html.appendTo(list);
                                });
                                dialog.find("li").click(function () {
                                    resolve($(this).data("color"));
                                    that.closeDialog(dialog);
                                });
                                if (colors.length == 0)
                                    dialog.find(".btn-back-to-store").show().click(function () { return history.back(); });
                            })];
                    });
                });
            };
            LayoutManagerDesktop.prototype.showSelectTemplateDialog = function (text, templates) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var that;
                    return __generator(this, function (_a) {
                        that = this;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                if (templates.length == 0) {
                                    console.log("No templates to choose from: popup is not needed");
                                    resolve(null);
                                }
                                var content = $("<p>" + text + "</p>" +
                                    "<select id='cb-select-templates-categories'></select>\n                    <div class='row'>\n                        <div class='input-search-wrapper'>\n                            <i class='material-icons'>search</i>\n                            <input type='text' id='template-selection-search' class='form-control' />\n                        </div>\n                    </div>\n                    <ul></ul>");
                                var dialog = _this.openDialog(content, "dlg-select-templates", false);
                                var list = dialog.find("ul");
                                list.perfectScrollbar();
                                dialog.addClass("dialog-large");
                                dialog = _this.fillSelectTemplates(templates, dialog);
                                dialog.find("li").click(function () {
                                    var template = $(this).data("template");
                                    dialog.find("ul").perfectScrollbar('destroy');
                                    dialog.find("select").combobox("destroy");
                                    that.closeDialog(dialog);
                                    resolve(template);
                                });
                                dialog.find("select").change(function (e) { return _this.onSelectTemplateCategoryChange(e); });
                                dialog.find("#template-selection-search").keyup(function (e) { return _this.onSelectTemplateFilterChange(e); });
                            })];
                    });
                });
            };
            LayoutManagerDesktop.prototype.fillSelectTemplates = function (templatesStructure, popup) {
                var categoriesList = popup.find("select");
                var templateList = popup.find("ul");
                categoriesList.append("<option value='all'>" + T._("All categories", "Customizer") + "</option>");
                for (var _i = 0, templatesStructure_2 = templatesStructure; _i < templatesStructure_2.length; _i++) {
                    var macroCategory = templatesStructure_2[_i];
                    categoriesList.append("<option class='label'>" + (macroCategory.isDummy ? T._("Other", "Customizer") : macroCategory.name) + "</option>");
                    for (var _a = 0, _b = macroCategory.categories; _a < _b.length; _a++) {
                        var category = _b[_a];
                        categoriesList.append("<option value='" + category.id + "'>" + (category.isDummy ? T._("Other", "Customizer") : category.name) + "</option>");
                        // Add all templates
                        for (var _c = 0, _d = category.templates; _c < _d.length; _c++) {
                            var template = _d[_c];
                            var html = $("<li data-id='" + template.designID + "'></li>");
                            html.append("<img src='" + template.previewUrl + "' alt='" + template.name + "' />");
                            html.append("<span>" + template.name);
                            html.data("template", template);
                            html.data("category", category);
                            html.appendTo(templateList);
                        }
                    }
                }
                var noTemplates = $("<div id='no-templates-found'><h3>" + T._("No templates found. Please change name filter.", "Admin") + "</h3></div>");
                noTemplates.appendTo(templateList);
                noTemplates.hide();
                categoriesList.combobox();
                categoriesList.combobox("refreshItems");
                categoriesList.combobox("value", "all");
                return popup;
            };
            LayoutManagerDesktop.prototype.onSelectTemplateCategoryChange = function (e) {
                var selectedCategoryId = $(e.currentTarget).val();
                var templateList = $("#dlg-select-templates").find("ul");
                templateList.find("> li").hide().filter(function (idx, el) {
                    return selectedCategoryId == "all" || $(el).data("category").id == selectedCategoryId;
                }).show();
                //Reapply the filter
                this.updateSelectTemplateByFilter();
                if (templateList.find("> li:visible").length > 0)
                    templateList.find("#no-templates-found").hide();
                else
                    templateList.find("#no-templates-found").show();
                templateList.scrollTop(0);
                templateList.perfectScrollbar('update');
            };
            LayoutManagerDesktop.prototype.onSelectTemplateFilterChange = function (e) {
                //Update category first
                $(e.currentTarget).closest(".dialog-content").find("select").change();
            };
            LayoutManagerDesktop.prototype.updateSelectTemplateByFilter = function () {
                var templateList = $("#dlg-select-templates").find("ul");
                var filter = $("#dlg-select-templates").find("#template-selection-search").val();
                templateList.find("> li:visible").hide().filter(function (idx, el) {
                    return filter == "" || $(el).data("template").name.toLowerCase().includes(filter.toLowerCase());
                }).show();
            };
            LayoutManagerDesktop.prototype.showPngInvalidDialog = function () {
                var _this = this;
                var content = $("\n                <img src='/images/customizer/dialog_warning.png' alt=''/>\n                <h1 class='primary-color'>" + T._("Warning!", "Customizer") + "</h5>\n                <p>\n                " + T._("PNG format is not supported for the selected printing method - please choose another printing method or upload/select a SVG file.", "Customizer") + "\n                <br/>\n                <a href='#' class='primary-color'>" + T._("What this mean?", "Customizer") + "</a>\n                </p>\n                <div class='dialog-buttons'><button class='btn btn-primary'>OK</button></div>");
                var dialog = this.openDialog(content, "dlg-png-invalid", true);
                dialog.find("a").click(function () {
                    _this.closeDialog(dialog);
                    _this.showPngInvalidExplanationDialog();
                });
                dialog.find("button").click(function () {
                    _this.closeDialog(dialog);
                });
            };
            LayoutManagerDesktop.prototype.showMaxNumberColorReachedRecoloring = function () {
                var _this = this;
                var content = $("\n                <img src='/images/customizer/dialog_warning.png' alt=''/>\n                <h1 class='primary-color'>" + T._("Warning!", "Customizer") + "</h5>\n                <p>\n                " + T._("Recognized colors of image to upload exceeds max number allowed", "Customer") + "\n                </p>\n                <div class='dialog-buttons'><button class='btn btn-primary'>OK</button></div>");
                var dialog = this.openDialog(content, "dlg-png-invalid", true);
                dialog.find("a").click(function () {
                    _this.closeDialog(dialog);
                    _this.showPngInvalidExplanationDialog();
                });
                dialog.find("button").click(function () {
                    _this.closeDialog(dialog);
                });
            };
            LayoutManagerDesktop.prototype.showPngInvalidExplanationDialog = function () {
                var _this = this;
                var content = $("\n                <h1 class='primary-color'>" + T._("Explanation", "Customizer") + "</h5>\n                <p>\n                " + T._("The SVG file is a vector based image format, the PNG file is a raster image format. A vector format uses shapes and lines to describe an image, istead, the PNG file uses pixel.<br/><br/>When using pixel you can have hundreds of colors and in this case only a limited number of colors is supported, that's why PNG is not supported.", "Customizer") + "\n                </p>\n                <div class='dialog-buttons'><button class='btn btn-primary'>OK</button></div>");
                var dialog = this.openDialog(content, "dlg-png-invalid-explanation", true);
                dialog.find("button").click(function () {
                    _this.closeDialog(dialog);
                });
            };
            LayoutManagerDesktop.prototype.showGenericDialog = function (content, isConfirm, options, callback) {
                var _this = this;
                if (Customizer.Context.isTemplateEditor || Customizer.Context.isDesignEditor) {
                    if (callback)
                        callback(null);
                    return;
                }
                var container = $('<div class="generic-dialog-container">');
                container.append(content);
                var dialog = this.openDialog(container, 'generic-dialog', true);
                if (!options)
                    options = new GenericDialogOptions();
                if (options.popupAdditionalClass)
                    dialog.addClass(options.popupAdditionalClass);
                var html = null;
                if (isConfirm === true) {
                    var okButtonContent = options.okButtonContent || document.createTextNode("OK");
                    var cancelButtonContent = options.cancelButtonContent || document.createTextNode("Cancel");
                    html = $("<button class='btn btn-primary btn-cancel'></button><button class='btn btn-primary btn-ok'></button>");
                    $(html[0]).append(cancelButtonContent).click(function () {
                        _this.closeDialog(dialog);
                    });
                    $(html[1]).append(okButtonContent).click(function () {
                        callback(dialog);
                    });
                }
                else {
                    html = $("<button class='btn btn-primary'>OK</button>");
                    html.click(function () {
                        _this.closeDialog(dialog);
                    });
                }
                dialog.find(".dialog-content").append("<div class=\"dialog-buttons\"></div>");
                dialog.find(".dialog-buttons").append(html);
                dialog.find(".generic-dialog-container").perfectScrollbar({ suppressScrollX: true });
                return dialog;
            };
            LayoutManagerDesktop.prototype.showDialog = function (title, message, icon, buttons) {
                var _this = this;
                var content = $("<img src='/images/customizer/" + icon + ".png' alt=''/><h1 class='primary-color'></h1><p></p><div class='dialog-buttons'></div>");
                var dialog = this.openDialog(content);
                dialog.find("h1").html(title);
                dialog.find("p").html(message);
                var _loop_1 = function () {
                    var callback = buttons[label];
                    html = $("<button class='btn btn-primary'>" + label + "</button>");
                    html.click(function () {
                        if (callback)
                            callback(dialog);
                        else
                            _this.closeDialog(dialog);
                    });
                    dialog.find(".dialog-buttons").append(html);
                };
                var html;
                for (var label in buttons) {
                    _loop_1();
                }
                return dialog;
            };
            LayoutManagerDesktop.prototype.openDialog = function (content, id, closeButton) {
                var _this = this;
                if (id === void 0) { id = null; }
                if (closeButton === void 0) { closeButton = true; }
                var dialog = $("<div class='dialog' id='" + id + "'><div class='dialog-content'></div></div>");
                if (closeButton)
                    dialog.find(".dialog-content").append("<i class='btn-dlg-close'>&times;</i>");
                dialog.find(".dialog-content").append(content);
                dialog.find(".btn-dlg-close").click(function () {
                    _this.closeDialog(dialog);
                });
                dialog.appendTo($("body"));
                dialog.fadeIn();
                return dialog;
            };
            LayoutManagerDesktop.prototype.closeDialog = function (dialog) {
                if (dialog)
                    dialog.remove();
            };
            // Utils and other methods
            //-------------------------------------------------------------------------------
            LayoutManagerDesktop.prototype.fillColors = function (colors) {
                this.modelColors.empty();
                for (var i = 0; i < colors.length; i++) {
                    var color = colors.at(i);
                    var html = $("<li class='color-item' data-hexcode='" + color.get("colorHexCode") + "'><div class='border'></div></li>");
                    html.data("color", color);
                    if (color.get("imageUrl") != "") {
                        html.children(".border").append("<img data-image-url='" + color.get("imageUrl") + "' alt='' />");
                    }
                    else if (color.get("showSideImage")) {
                        html.children(".border").append("<img data-image-url='" + color.get("sides").at(0).get("imageUrl") + "' alt='' />");
                    }
                    else {
                        html.children(".border").append("<div></div>");
                        html.children(".border").children("div").css("background-color", color.get("colorHexCode"));
                    }
                    html.children(".border").append("<span title='" + color.get("name") + "'>" + color.get("name") + "</span>");
                    html.children(".border").children("span").tooltipster({
                        theme: "tooltipster-borderless",
                        contentAsHTML: true
                    });
                    this.modelColors.append(html);
                }
                if (colors.length < 2) {
                    this.setToolboxItemEnabled(Customizer.ToolboxItem.Colors, false);
                }
                this.fixToolboxHeight();
            };
            LayoutManagerDesktop.prototype.selectColor = function (color) {
                this.modelColors.children(".color-item").each(function () {
                    if ($(this).data("color") == color) {
                        $(this).click();
                    }
                });
            };
            LayoutManagerDesktop.prototype.fillSides = function (color) {
                this.sides.empty();
                for (var i = 0; i < color.get("sides").length; i++) {
                    var side = color.get("sides").at(i);
                    if (Customizer.Context.productSides.length > 0 && Customizer.Context.productSides.indexOf(side.get("code")) == -1)
                        continue;
                    var html = $("<li class='side-item'></li>");
                    html.data("side", side);
                    // Image
                    html.append("<div class='image-container'><img src='" + side.get("imageUrl") + "' alt='' /></div>");
                    // Name
                    html.append("<span>" + side.get("name") + "</span>");
                    this.sides.append(html);
                }
                this.currentColor = color;
            };
            LayoutManagerDesktop.prototype.showAlertOnSides = function (sidesWithAlerts) {
                // Show alert icon on side list controls
                this.sides.find('li > i').remove();
                var idSidesWithAlerts = sidesWithAlerts.map(function (x) {
                    return x.id;
                });
                this.sides.find('li').each(function (indx, s) {
                    if (idSidesWithAlerts.indexOf($(s).data('side').id) >= 0) {
                        $(s).append('<i class="material-icons alert">error</i>');
                    }
                });
            };
            LayoutManagerDesktop.prototype.selectSide = function (side) {
                this.sides.children(".side-item").each(function () {
                    if ($(this).data("side") == side) {
                        $(this).click();
                    }
                });
            };
            LayoutManagerDesktop.prototype.fillSvgColors = function (item, image, colors, pantoneColors) {
                var _this = this;
                this.svgColors.empty();
                this.svgColorsToolboxPage.find("#toolbox-svg-colors-row ul").empty();
                if (item && image && colors) {
                    var _loop_2 = function () {
                        var color = colors[i];
                        var html = $("<li></li>");
                        html.css("background-color", color.colorCode);
                        var changeFunc = _.debounce(function () {
                            var hex = Zakeke.Customizer.rgb2hex(html.css("background-color"));
                            var i = item;
                            var img = image;
                            _this.onSvgColorChanged.trigger({
                                item: i,
                                image: img,
                                color: { id: color.id, colorCode: hex }
                            });
                        }, 300);
                        var colorpicker = html.ColorPicker({
                            color: color.colorCode,
                            pantoneColors: pantoneColors,
                            pantoneEnabled: pantoneColors ? true : false,
                            onChange: function (hsb, hex, rgb, el) {
                                html.css("background-color", "#" + hex);
                                changeFunc();
                            },
                            onShow: function (colpkr) {
                                $(colpkr).fadeIn(500);
                                return false;
                            },
                            onHide: function (colpkr) {
                                $(colpkr).hide();
                                changeFunc();
                                return false;
                            }
                        });
                        //OLD
                        //this.svgColors.append(html);
                        this_1.svgColorsToolboxPage.find("#toolbox-svg-colors-row ul").append(html);
                    };
                    var this_1 = this;
                    for (var i = 0; i < colors.length; i++) {
                        _loop_2();
                    }
                    if (colors != null && colors.length > 0)
                        this.selectToolboxPage("svg-colors");
                }
            };
            LayoutManagerDesktop.prototype.setProductInfo = function (name) {
                this.productInfo.find("#product-info-name").text($("<div>").html(name).text());
                if (name && name != "")
                    this.productInfo.fadeIn();
                else
                    this.productInfo.hide();
            };
            LayoutManagerDesktop.prototype.setProductPrice = function (price) {
                this.productInfo.find("#product-info-price").toggle(price > 0).text(Customizer.Context.priceFormatter.format(price));
            };
            LayoutManagerDesktop.prototype.setTaxPricesPolicy = function (policy) {
                var element = this.productInfo.find("#product-info-tax");
                switch (policy) {
                    case Customizer.TaxPricesPolicy.Hidden:
                        element.hide();
                        break;
                    case Customizer.TaxPricesPolicy.PricesIncludingTax:
                        element.text(T._("Inc. Tax", "Customizer"));
                        break;
                    case Customizer.TaxPricesPolicy.PricesExcludingTax:
                        element.text(T._("Excl. Tax", "Customizer"));
                        break;
                    default:
                        throw new Error("Unknow tax policy " + policy);
                }
            };
            LayoutManagerDesktop.prototype.updateVariantImagesSrc = function () {
                var toolboxPage = this.toolboxContent.children(".toolbox-page").filter("[data-name=colors]");
                var scrollTop = toolboxPage.scrollTop();
                var cards = toolboxPage.find("#model-colors > .color-item");
                var lowerLimit = Math.round(scrollTop / 107 /*The height of a single card*/);
                cards.slice(lowerLimit, Math.min(((toolboxPage.height() / 107) + lowerLimit) * 2, cards.length)).each(function (i, card) {
                    var imgBox = $(card).find("img");
                    if (imgBox.attr("src") == undefined || imgBox.attr("src") == "")
                        imgBox.attr("src", imgBox.attr("data-image-url"));
                });
            };
            LayoutManagerDesktop.prototype.selectToolboxPage = function (name) {
                var _this = this;
                // Avoid re-selecting the page, edge give some problems...
                if (name == this.selectedPage)
                    return;
                this.toolbox.children(".toolbox-item").removeClass("selected").filter("[data-name=" + name + "]").addClass("selected");
                var toolboxPage = this.toolboxContent.children(".toolbox-page").hide().filter("[data-name=" + name + "]");
                toolboxPage.show();
                document.body.offsetHeight;
                this.toolboxContent.scrollTop(0);
                if (name == Customizer.ToolboxItem.Text)
                    this.txtTextContent.focus();
                if (name == Customizer.ToolboxItem.Colors) {
                    toolboxPage[0].removeEventListener("scroll", this.updateVariantImages);
                    toolboxPage[0].addEventListener("scroll", this.updateVariantImages);
                    this.updateVariantImages();
                }
                var selectMacroCategoriesPage = function () { _this.selectToolboxPage(Customizer.ToolboxItem.ImagesMacroCategories); };
                var selectCategoriesPage = function () { _this.selectToolboxPage(Customizer.ToolboxItem.ImagesCategories); };
                if (name == Customizer.ToolboxItem.ImagesMacroCategories) {
                    // Select Macro Category
                    if (this.imagesMacroCategories.children("li").length == 1) {
                        // Set categories icon as right arrow
                        $(".toolbox-page[data-name='images-categories']").find("header > span > i").text("keyboard_arrow_right").removeClass("back").unbind("click", selectMacroCategoriesPage);
                        var macroCategory = this.imagesMacroCategories.children("li").first().data("category");
                        this.onImagesCategoriesFillRequest.trigger({
                            macroCategory: macroCategory,
                            callback: function () {
                                // Select category
                                if (_this.imagesCategories.children("li").length > 1) {
                                    // Set images list icon as right arrow
                                    $(".toolbox-page[data-name='images-list']").find("header > span > i").text("keyboard_arrow_right").removeClass("back").unbind("click", selectCategoriesPage);
                                    _this.selectToolboxPage(Customizer.ToolboxItem.ImagesCategories);
                                }
                                else {
                                    // Set images list icon as back arrow
                                    $(".toolbox-page[data-name='images-list']").find("header > span > i").text("arrow_back").addClass("back").bind("click", selectCategoriesPage);
                                    // Show images
                                    var category = _this.imagesCategories.children("li").first().data("category");
                                    _this.imagesList.empty();
                                    _this.selectToolboxPage(Customizer.ToolboxItem.ImagesList);
                                    _this.onImagesFillRequest.trigger({
                                        category: category,
                                        callback: function () {
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                if (name == Customizer.ToolboxItem.ImagesCategories) {
                    // Set categories icon as back arrow
                    $(".toolbox-page[data-name='images-categories']").find("header > span > i").text("arrow_back").addClass("back").bind("click", selectMacroCategoriesPage);
                }
                if (name == Customizer.ToolboxItem.ImagesList) {
                    // Set images list icon as back arrow
                    $(".toolbox-page[data-name='images-list']").find("header > span > i").text("arrow_back").addClass("back").bind("click", selectCategoriesPage);
                }
                this.selectedPage = name;
            };
            // Set UI for RecolorImage Add-on
            LayoutManagerDesktop.prototype.setUIForRecolorImageAddon = function (file, previewImage, callbackConvertUpload, imageToEdit, pantoneColors) {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    var b64DataUrlImage, imageOriginal, imageConverted, colorList, readerCanvas, self, colorListUl;
                    return __generator(this, function (_a) {
                        b64DataUrlImage = '';
                        imageOriginal = file;
                        imageConverted = file;
                        colorList = null;
                        if (this.backgroundRecolorRule) {
                            // ** Image Background Color picker **********************
                            this.imageColorBackgroundPicker.ColorPicker({
                                pantoneColors: pantoneColors,
                                pantoneEnabled: pantoneColors ? true : false,
                                onChange: function (hsb, hex, rgb, el) {
                                    _this.imageColorBackgroundPicker.css("background-color", "#" + hex);
                                    _this.imageColorBackgroundPicker.data("color", "#" + hex);
                                    _this.onTextColorChanged.trigger("#" + hex);
                                },
                                onShow: function (colpkr) {
                                    $(colpkr).fadeIn(500);
                                    return false;
                                }
                            });
                            // ** Image Overlay Color picker **********************
                            this.imageColorOverlayPicker.ColorPicker({
                                pantoneColors: pantoneColors,
                                pantoneEnabled: pantoneColors ? true : false,
                                onChange: function (hsb, hex, rgb, el) {
                                    _this.imageColorOverlayPicker.css("background-color", "#" + hex);
                                    _this.imageColorOverlayPicker.data("color", "#" + hex);
                                    _this.onTextColorChanged.trigger("#" + hex);
                                },
                                onShow: function (colpkr) {
                                    $(colpkr).fadeIn(500);
                                    return false;
                                }
                            });
                            readerCanvas = new FileReader();
                            self = this;
                            $(this.imageToRecoloredCanvas).off("mousemove");
                            $(this.imageToRecoloredCanvas).off("click");
                            readerCanvas.onload = (function (img) {
                                return function (e) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var _this = this;
                                        var imgPreviewObj, colorListUl_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    b64DataUrlImage = e.target.result;
                                                    imgPreviewObj = new Image();
                                                    imgPreviewObj.onload = function (e) {
                                                        Customizer.LayoutManager.fitImageToCanvas(self.imageToRecoloredCanvas, imgPreviewObj);
                                                        // Eyedropper for canvas preview image
                                                        $(self.imageToRecoloredCanvas).on("mousemove", function (e) {
                                                            if (!self.eyedropperIsActive || !self.canvasAreaImagePreview.hasClass('enabledEyeDropper'))
                                                                return;
                                                            var canvas = $(this);
                                                            var mouseX = e.clientX - canvas.offset().left;
                                                            var mouseY = e.clientY - canvas.offset().top;
                                                            var canvasElement = canvas[0];
                                                            var pxImage = canvasElement.getContext('2d').getImageData(mouseX, mouseY, 1, 1);
                                                            $(self.imageColorBackgroundPicker).ColorPickerSetColor(StringHelper.rgbToHex(pxImage.data[0], pxImage.data[1], pxImage.data[2]));
                                                        });
                                                        // Eyedropper for canvas preview image
                                                        $(self.imageToRecoloredCanvas).on("click", function (e) {
                                                            e.stopPropagation();
                                                            if (!self.canvasAreaImagePreview.hasClass('enabledEyeDropper'))
                                                                return;
                                                            self.eyedropperIsActive = !self.eyedropperIsActive;
                                                            if (!self.eyedropperIsActive)
                                                                return;
                                                            var canvas = $(this);
                                                            var mouseX = e.clientX - canvas.offset().left;
                                                            var mouseY = e.clientY - canvas.offset().top;
                                                            var canvasElement = canvas[0];
                                                            var pxImage = canvasElement.getContext('2d').getImageData(mouseX, mouseY, 1, 1);
                                                            $(self.imageColorBackgroundPicker).ColorPickerSetColor(StringHelper.rgbToHex(pxImage.data[0], pxImage.data[1], pxImage.data[2]));
                                                        });
                                                    };
                                                    imgPreviewObj.src = b64DataUrlImage;
                                                    if (!self.backgroundRecolorRule.EnableMultiRecoloring) return [3 /*break*/, 2];
                                                    self.colorListForImageSection.find('label.header').text(T._("Select image color to replace", "Customizer"));
                                                    return [4 /*yield*/, ImageColorHelpers.GetColorsFromImageB64(b64DataUrlImage, self.thresholdRecognizeColors, self.percMinOccurrencesColors, self.scale)];
                                                case 1:
                                                    colorList = _a.sent();
                                                    if (colorList && colorList.length > 0) {
                                                        if (colorList.length > self.maxChangeableColors) {
                                                            self.showMaxNumberColorReachedRecoloring();
                                                            self.selectToolboxPage("master-upload-image");
                                                            return [2 /*return*/];
                                                        }
                                                        self.colorListForImageSection.show();
                                                        self.imageColorOverlayPicker.remove();
                                                        colorListUl_1 = self.colorListForImageSection.find('ul');
                                                        colorListUl_1.empty();
                                                        colorList.forEach(function (x) {
                                                            var liColor = $('<li></li>').append($("<div data-originalcolor=\"" + x + "\" data-color=\"" + x + "\" class=\"imageColorPicker\" style=\"background-color: " + x + "\"></div>"));
                                                            colorListUl_1.append(liColor);
                                                        });
                                                        colorListUl_1.find('li').on('click', function (e) {
                                                            e.preventDefault();
                                                            colorListUl_1.find('li').removeClass('checked');
                                                            $(this).addClass('checked');
                                                        });
                                                        colorListUl_1.find('.imageColorPicker').each(function (index, colpik) {
                                                            var colpikEl = $(colpik);
                                                            colpikEl.ColorPicker({
                                                                pantoneColors: pantoneColors,
                                                                pantoneEnabled: pantoneColors ? true : false,
                                                                onChange: function (hsb, hex, rgb, el) {
                                                                    colpikEl.css("background-color", "#" + hex);
                                                                    colpikEl.data("color", "#" + hex);
                                                                    colpikEl.removeClass('unselected');
                                                                    $("#alert-unselected-colors").hide();
                                                                },
                                                                onShow: function (colpkr) {
                                                                    $(colpkr).fadeIn(500);
                                                                    return false;
                                                                },
                                                                onHide: function (colpkr) { return __awaiter(_this, void 0, void 0, function () {
                                                                    var fr;
                                                                    return __generator(this, function (_a) {
                                                                        self.toolboxLoading = true;
                                                                        fr = new FileReader();
                                                                        fr.onloadend = function (e) {
                                                                            return __awaiter(this, void 0, void 0, function () {
                                                                                var colorListDiv, hexTargetColors, hexSourceColors, frB64;
                                                                                return __generator(this, function (_a) {
                                                                                    switch (_a.label) {
                                                                                        case 0:
                                                                                            colorListDiv = self.colorListForImageSection.find('ul > li div');
                                                                                            hexTargetColors = colorListDiv.map(function () {
                                                                                                if ($(this).data('originalcolor') !== $(this).data('color'))
                                                                                                    return $(this).data('color');
                                                                                            }).get();
                                                                                            hexSourceColors = colorListDiv.map(function () {
                                                                                                if ($(this).data('originalcolor') !== $(this).data('color'))
                                                                                                    return $(this).data('originalcolor');
                                                                                            }).get();
                                                                                            return [4 /*yield*/, ImageColorHelpers.ReplaceColorsIntoImage(fr.result, hexSourceColors, hexTargetColors, self.thresholdReplaceColors)];
                                                                                        case 1:
                                                                                            // Change color image
                                                                                            imageConverted = _a.sent();
                                                                                            frB64 = new FileReader();
                                                                                            frB64.onloadend = function () {
                                                                                                imgPreviewObj.src = frB64.result.toString();
                                                                                                self.toolboxLoading = false;
                                                                                            };
                                                                                            frB64.readAsDataURL(imageConverted);
                                                                                            return [2 /*return*/];
                                                                                    }
                                                                                });
                                                                            });
                                                                        };
                                                                        fr.readAsArrayBuffer(imageOriginal);
                                                                        return [2 /*return*/];
                                                                    });
                                                                }); }
                                                            });
                                                        });
                                                    }
                                                    else
                                                        self.colorListForImageSection.hide();
                                                    _a.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    });
                                };
                            })(previewImage);
                            if (previewImage instanceof File || previewImage instanceof Blob) {
                                readerCanvas.readAsDataURL(previewImage);
                            }
                            else {
                                imageOriginal = BlobHelpers.b64toBlob(previewImage[0], 'image/png');
                                readerCanvas.readAsDataURL(imageOriginal);
                            }
                            // ** Color list for image recoloring ******************
                            $("#alert-unselected-colors").hide();
                            if (!this.backgroundRecolorRule.EnableMultiRecoloring) {
                                // Single recoloring
                                colorList = this.backgroundRecolorRule.ColorList ? JSON.parse(this.backgroundRecolorRule.ColorList) : null;
                                if (colorList && colorList.length > 0) {
                                    this.colorListForImageSection.show();
                                    if (colorList.length == 0) {
                                        this.imageColorOverlayPicker.show();
                                    }
                                    else {
                                        this.imageColorOverlayPicker.remove();
                                        colorListUl = this.colorListForImageSection.find('ul');
                                        colorListUl.empty();
                                        colorList.forEach(function (x) {
                                            var liColor = $('<li></li>').append($("<input type=\"radio\" name=\"colorimage\" value=\"" + x + "\"></input><div data-color=\"" + x + "\" style=\"background-color: " + x + "\"></div>"));
                                            colorListUl.append(liColor);
                                        });
                                        colorListUl.find('li').on('click', function (e) {
                                            e.preventDefault();
                                            colorListUl.find('li').removeClass('checked');
                                            $(this).addClass('checked');
                                        });
                                    }
                                    if (colorList.length == 1) {
                                        colorListUl.find('li').trigger('click');
                                    }
                                }
                                else
                                    this.colorListForImageSection.hide();
                            }
                            // ** Background color mode radiobutton ***************************
                            $(this.imageToRecoloredCanvas).
                                on('mouseenter', function () {
                                if (self.eyedropperIsActive)
                                    $(this).hideBalloon();
                            });
                            $(document).on('click', function (e) {
                                if ($(self.imageToRecoloredCanvas) && self.eyedropperIsActive)
                                    $(self.imageToRecoloredCanvas).hideBalloon();
                            });
                            this.backgroundColorMode.change(function (e) {
                                self.canvasAreaImagePreview.removeClass('enabledEyeDropper');
                                self.eyedropperIsActive = false;
                                self.imageColorBackgroundPicker.hide();
                                if ($(this).val() === 'Eyedropper') {
                                    self.imageColorBackgroundPicker.show();
                                    self.canvasAreaImagePreview.addClass('enabledEyeDropper');
                                    self.eyedropperIsActive = true;
                                    $(self.imageToRecoloredCanvas).showBalloon({
                                        html: true,
                                        position: 'left',
                                        classname: 'ballonPlugin',
                                        contents: T._('Use the eyedropper tool to choose the color you wish to remove from the image', 'Customizer')
                                    });
                                }
                            });
                            // ** Upload image action ******************************************
                            this.btnRecolorUploadImage.off("click");
                            this.btnRecolorUploadImage.click(function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var fileToUpload, backgroundColor, colorListDiv_1, selectedColors, unSelectedColors;
                                return __generator(this, function (_a) {
                                    fileToUpload = file;
                                    backgroundColor = 'autodetect';
                                    if (this.backgroundColorMode[1].checked)
                                        backgroundColor = self.imageColorBackgroundPicker.data('color');
                                    else if (this.backgroundColorMode[2].checked)
                                        backgroundColor = 'none';
                                    if (this.backgroundRecolorRule.EnableMultiRecoloring) {
                                        colorListDiv_1 = self.colorListForImageSection.find('ul > li div');
                                        selectedColors = colorListDiv_1.map(function () {
                                            if ($(this).data('originalcolor') !== $(this).data('color'))
                                                return $(this).data('color');
                                        }).get();
                                        unSelectedColors = colorListDiv_1.map(function () {
                                            if ($(this).data('originalcolor') === $(this).data('color'))
                                                return $(this).data('color');
                                        }).get();
                                        if (unSelectedColors.length > 0) {
                                            e.preventDefault();
                                            unSelectedColors.forEach(function (color, i) {
                                                var colorDivUnselected = colorListDiv_1.filter(function (j, colorDiv) {
                                                    return ($(colorDiv).data('originalcolor') === color);
                                                });
                                                if (colorDivUnselected.length > 0) {
                                                    $(colorDivUnselected[0]).addClass('unselected');
                                                }
                                            });
                                            $("#alert-unselected-colors").show();
                                            return [2 /*return*/];
                                        }
                                        callbackConvertUpload(fileToUpload, backgroundColor, null, imageConverted, JSON.stringify(selectedColors));
                                    }
                                    else
                                        callbackConvertUpload(fileToUpload, backgroundColor, this.getRecolorImageToUploaded(colorList), null);
                                    return [2 /*return*/];
                                });
                            }); });
                            $(this.backgroundColorMode[0]).prop("checked", true).change();
                            this.toolboxLoading = false;
                            this.selectToolboxPage("recolor-image");
                        }
                        return [2 /*return*/];
                    });
                });
            };
            LayoutManagerDesktop.prototype.fixToolboxHeight = function () {
                this.toolbox.get(0).offsetHeight;
                var toolboxSpace = this.toolbox.find(".toolbox-space");
                var topItems = toolboxSpace.prevAll();
                var bottomItems = toolboxSpace.nextAll();
                var column = this.toolbox.closest(".column");
                var columnHeight = column.outerHeight();
                var topHeight = 0;
                var bottomHeight = 0;
                var marginTop = parseFloat(this.toolbox.css("padding-top").replace("px", ""));
                for (var i = 0; i < topItems.length; i++)
                    if (topItems.eq(i).css("display") != "none")
                        topHeight += topItems.eq(i).outerHeight();
                for (var i = 0; i < bottomItems.length; i++)
                    if (bottomItems.eq(i).css("display") != "none")
                        bottomHeight += bottomItems.eq(i).outerHeight();
                toolboxSpace.height(columnHeight - (marginTop * 2) - bottomHeight - topHeight);
                this.toolbox.children("li.hidden").each(function (index) {
                    var _this = this;
                    setTimeout(function () {
                        $(_this).removeClass("hidden");
                    }, index * 100);
                });
            };
            LayoutManagerDesktop.prototype.enablePantoneColorPickerForText = function (pantoneColors) {
                var _this = this;
                // Color picker for text
                this.textColorPicker.ColorPickerNew({
                    pantoneColors: pantoneColors,
                    pantoneEnabled: true,
                    onChange: function (hsb, hex, rgb, el) {
                        _this.textColorPicker.children("div").eq(1).css("background-color", "#" + hex);
                        _this.textColorPicker.data("color", "#" + hex);
                        _this.onTextColorChanged.trigger("#" + hex);
                    },
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    }
                });
            };
            return LayoutManagerDesktop;
        }(Customizer.LayoutManager));
        Customizer.LayoutManagerDesktop = LayoutManagerDesktop;
        var GenericDialogOptions = /** @class */ (function () {
            function GenericDialogOptions() {
            }
            return GenericDialogOptions;
        }());
    })(Customizer = Zakeke.Customizer || (Zakeke.Customizer = {}));
})(Zakeke || (Zakeke = {}));
