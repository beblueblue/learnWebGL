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
var DateHelper;
(function (DateHelper) {
    function fromJsonToDate(str) {
        if (str == null)
            return null;
        var ticks = /-?\d+/.exec(str)[0];
        var d = new Date(parseInt(ticks));
        return d;
    }
    DateHelper.fromJsonToDate = fromJsonToDate;
})(DateHelper || (DateHelper = {}));
var StringHelper;
(function (StringHelper) {
    function padLeft(str, width, char) {
        var newStr = str.toString();
        for (var i = 0; i < width - newStr.length; i++)
            newStr = char + newStr;
        return newStr;
    }
    StringHelper.padLeft = padLeft;
    function padRight(str, width, char) {
        var newStr = str.toString();
        for (var i = 0; i < width - newStr.length; i++)
            newStr = newStr + char;
        return newStr;
    }
    StringHelper.padRight = padRight;
    function format(str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return args.reduce(function (prev, current, idx) { return prev.replace("{" + idx + "}", current); }, str);
    }
    StringHelper.format = format;
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    StringHelper.rgbToHex = rgbToHex;
    function hex2rgb(c) {
        var c = c.substring(1); // strip #
        var rgb = parseInt(c, 16); // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff; // extract red
        var g = (rgb >> 8) & 0xff; // extract green
        var b = (rgb >> 0) & 0xff; // extract blue
        return [r, g, b];
    }
    StringHelper.hex2rgb = hex2rgb;
    function rgbToHexArray(rgb) {
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        return rgbToHex(r, g, b);
    }
    StringHelper.rgbToHexArray = rgbToHexArray;
    //RGB to Decimal Array RGB (eg. rgb(0,0,0) ==> [0,0,0])
    function rgbCssToArray(rgbCss) {
        if (!rgbCss.startsWith('rgb'))
            return [255, 255, 255];
        if (rgbCss.startsWith('rgba')) {
            var rgbArr = rgbCss.substring(5, rgbCss.lastIndexOf(",")).split(",");
            return [parseInt(rgbArr[0]), parseInt(rgbArr[1]), parseInt(rgbArr[2])];
        }
        else {
            var rgbArr = rgbCss.substring(4, rgbCss.lastIndexOf(")")).split(",");
            return [parseInt(rgbArr[0]), parseInt(rgbArr[1]), parseInt(rgbArr[2])];
        }
    }
    StringHelper.rgbCssToArray = rgbCssToArray;
    // RGB to HEX string (eg. rgb(0,0,0) ==> #000000)
    function rgbToHexCss(rgbCss) {
        if (!rgbCss.startsWith('rgb'))
            return '#ffffff';
        if (rgbCss.startsWith('rgba')) {
            var rgbArr = rgbCss.substring(5, rgbCss.lastIndexOf(",")).split(",");
            return rgbToHex(parseInt(rgbArr[0]), parseInt(rgbArr[1]), parseInt(rgbArr[2]));
        }
        else {
            var rgbArr = rgbCss.substring(4, rgbCss.lastIndexOf(")")).split(",");
            return rgbToHex(parseInt(rgbArr[0]), parseInt(rgbArr[1]), parseInt(rgbArr[2]));
        }
    }
    StringHelper.rgbToHexCss = rgbToHexCss;
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
})(StringHelper || (StringHelper = {}));
var Pagination;
(function (Pagination) {
    function nextPage(headerLink) {
        var matches = /.*<(.*)>; rel="next".*/.exec(headerLink);
        if (!matches) {
            return null;
        }
        return matches[1];
    }
    Pagination.nextPage = nextPage;
})(Pagination || (Pagination = {}));
var Browser;
(function (Browser) {
    function openWindow(url, width, height) {
        return window.open(url, "width=" + width + ",height=" + height + ";menubar=no,location=no,status=no,toolbar=no");
    }
    Browser.openWindow = openWindow;
})(Browser || (Browser = {}));
var Logger;
(function (Logger) {
    function info() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof window == "undefined")
            return;
        if (window.location.href.indexOf("zakeke.com") == -1)
            console.log.apply(window, args);
    }
    Logger.info = info;
    function error() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (typeof window == "undefined")
            return;
        console.error.apply(window, args);
    }
    Logger.error = error;
})(Logger || (Logger = {}));
var BlobHelpers;
(function (BlobHelpers) {
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    BlobHelpers.b64toBlob = b64toBlob;
})(BlobHelpers || (BlobHelpers = {}));
var ImageColorHelpers;
(function (ImageColorHelpers) {
    // Color difference (color input in rgb(x,y,z) or rgba(x,y,z) format)
    function deltaE(rgbA, rgbB) {
        var rgbA_arr = StringHelper.rgbCssToArray(rgbA);
        var rgbB_arr = StringHelper.rgbCssToArray(rgbB);
        var labA = rgb2lab(rgbA_arr);
        var labB = rgb2lab(rgbB_arr);
        var deltaL = labA[0] - labB[0];
        var deltaA = labA[1] - labB[1];
        var deltaB = labA[2] - labB[2];
        var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
        var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
        var deltaC = c1 - c2;
        var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
        deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
        var sc = 1.0 + 0.045 * c1;
        var sh = 1.0 + 0.015 * c1;
        var deltaLKlsl = deltaL / (1.0);
        var deltaCkcsc = deltaC / (sc);
        var deltaHkhsh = deltaH / (sh);
        var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
    }
    function rgb2lab(rgb) {
        var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
        x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
        y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
        z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
        return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
    }
    // Replace colors into a raster image 
    // imageBuffer: image bytes
    // hexTargetColor: HEX Colors list of image to replace
    // hexNewColor: new replacement HEX colors list for image
    // deltaE:  value which corresponds to a JND (just noticeable difference). The default value is 2.3
    function ReplaceColorImage(imageBuffer, hexTargetColor, hexNewColor, deltaE) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Substitution colors and upload
            replaceColorLib.replace_color({
                image: imageBuffer,
                colors: {
                    type: 'hex',
                    targetColor: hexTargetColor,
                    replaceColor: hexNewColor
                },
                deltaE: deltaE ? deltaE : 2.3
            })
                .then(function (jimpObj) { return __awaiter(_this, void 0, void 0, function () {
                var bufferImageConverted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, jimpObj.getBufferAsync(jimpObj.getMIME())];
                        case 1:
                            bufferImageConverted = _a.sent();
                            resolve(bufferImageConverted);
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    }
    // Get colors in an array of hex codes from a Base64 code image
    // b6image: image in base64 format
    // threshold: number for JND needed to recognize colors
    // minPercOccurrences: limit percentage of color occurrences found
    function GetColorsFromImageB64(b64image, threshold, minPercOccurrences, scale) {
        return __awaiter(this, void 0, void 0, function () {
            var palette, grabColors, minPercOccurrencesColors, numberColorsFound, _loop_1, i, grabColorsHex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rgbAsterLib.rgbAster(b64image, { scale: scale ? scale : 1 })];
                    case 1:
                        palette = _a.sent();
                        grabColors = [];
                        minPercOccurrencesColors = (minPercOccurrences) || 10;
                        numberColorsFound = 0;
                        palette.forEach(function (colorfound, i) {
                            if (!colorfound.color.startsWith('rgba'))
                                numberColorsFound += colorfound.count;
                        });
                        _loop_1 = function (i) {
                            var percColorsOccurrences = (100 * palette[i].count) / numberColorsFound;
                            if ((percColorsOccurrences <= minPercOccurrencesColors) || palette[i].color.startsWith('rgba'))
                                return "continue";
                            var isValid = true;
                            if (grabColors.length > 0) {
                                grabColors.forEach(function (color, index) {
                                    if (deltaE(color, palette[i].color) < threshold)
                                        isValid = false;
                                });
                            }
                            if (isValid) {
                                grabColors.push(palette[i].color);
                            }
                        };
                        for (i = 0; i < palette.length; i++) {
                            _loop_1(i);
                        }
                        grabColorsHex = grabColors.map(function (color) { return StringHelper.rgbToHexCss(color); });
                        return [2 /*return*/, grabColorsHex];
                }
            });
        });
    }
    ImageColorHelpers.GetColorsFromImageB64 = GetColorsFromImageB64;
    // Recoloring image
    function ReplaceColorsIntoImage(file, hexSourceColors, hexNewColors, threshold) {
        return __awaiter(this, void 0, void 0, function () {
            var bufferImageConverted, indx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bufferImageConverted = file;
                        indx = 0;
                        _a.label = 1;
                    case 1:
                        if (!(indx < hexSourceColors.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, ReplaceColorImage(bufferImageConverted, hexSourceColors[indx], hexNewColors[indx], threshold)];
                    case 2:
                        bufferImageConverted = _a.sent();
                        _a.label = 3;
                    case 3:
                        indx++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, new Blob([bufferImageConverted])];
                }
            });
        });
    }
    ImageColorHelpers.ReplaceColorsIntoImage = ReplaceColorsIntoImage;
})(ImageColorHelpers || (ImageColorHelpers = {}));
