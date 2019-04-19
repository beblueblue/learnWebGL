// Facebook
window.fbAsyncInit = function () {
    FB.init({
        appId: Zakeke.config.facebookAppID,
        xfbml: true,
        cookie: true,
        version: 'v2.8'
    });
    FB.AppEvents.logPageView();
};

// Instagram
var InstagramAPIConfig = {};

//Added polyfill to support toBlob in some browsers
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {

            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || 'image/png' }));
        }
    });
}

$(document).ready(function () {

    InstagramAPIConfig =
    {
        ClientID: Zakeke.config.instagramClientID,
        RedirectURI: Zakeke.config.baseUrl + 'instagramOauth'
    };
    var application = new Zakeke.Customizer.Application();
    application.init($(document.body).data("mobile"));
});