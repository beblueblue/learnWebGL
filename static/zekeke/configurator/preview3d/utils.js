var Utils;
(function (Utils) {
    function Guid() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    Utils.Guid = Guid;
    function rgbToInt(r, g, b) {
        var rgb = r;
        rgb = (rgb << 8) + g;
        rgb = (rgb << 8) + b;
        return rgb;
    }
    Utils.rgbToInt = rgbToInt;
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    Utils.componentToHex = componentToHex;
    function rgbToHex(r, g, b) {
        return componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    Utils.rgbToHex = rgbToHex;
    function rgbNormalizedToHex(r, g, b) {
        return componentToHex(Math.round(r * 255)) + componentToHex(Math.round(g * 255)) + componentToHex(Math.round(b * 255));
    }
    Utils.rgbNormalizedToHex = rgbNormalizedToHex;
    function padLeft(str, char, len) {
        var str2 = str;
        for (var i = 0; i < len - char.length; i++)
            str2 = char + str2;
        return str2;
    }
    Utils.padLeft = padLeft;
    // Make a raster totaly trasparent
    function clearRaster(paper, raster) {
        if (raster.width == 0 || raster.height == 0)
            return;
        var data = raster.createImageData(raster.width, raster.height);
        raster.setImageData(data);
    }
    Utils.clearRaster = clearRaster;
    // Change a raster image from url
    function changeRasterImage(paper, raster, url, callback, continueCallback) {
        Utils.clearRaster(paper, raster);
        var img = new Image();
        img.onload = function (e) {
            // Used for ensure that something has not changed from the loading of the image at the end
            if (continueCallback) {
                if (continueCallback() == false) {
                    Logger.info("Color changed while texture was loading: " + url);
                    return;
                }
            }
            raster.width = img.width;
            raster.height = img.height;
            raster.drawImage(img, 0, 0);
            if (callback)
                callback();
            paper.view.update();
        };
        img.onerror = function () {
            alert("error");
        };
        img.crossOrigin = "anonymous";
        img.src = url;
    }
    Utils.changeRasterImage = changeRasterImage;
})(Utils || (Utils = {}));
