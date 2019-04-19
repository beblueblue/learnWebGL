var Zakeke;
(function (Zakeke) {
    var Customizer;
    (function (Customizer) {
        var FacebookShareButton = /** @class */ (function () {
            function FacebookShareButton() {
            }
            FacebookShareButton.prototype.onShare = function (url) {
                var wnd = Customizer.openWindow("https://www.facebook.com/sharer/sharer.php?u=" + url, "Facebook", 500, 500);
            };
            return FacebookShareButton;
        }());
        Customizer.FacebookShareButton = FacebookShareButton;
        var PinterestShareButton = /** @class */ (function () {
            function PinterestShareButton() {
            }
            PinterestShareButton.prototype.onShare = function (url) {
                var wnd = Customizer.openWindow("https://pinterest.com/pin/create/bookmarklet/?media=" + url + "&url=zakeke.com&is_video=0&description=", "Pinterest", 500, 500);
            };
            return PinterestShareButton;
        }());
        Customizer.PinterestShareButton = PinterestShareButton;
        var TwitterShareButton = /** @class */ (function () {
            function TwitterShareButton() {
            }
            TwitterShareButton.prototype.onShare = function (url) {
                var wnd = Customizer.openWindow("https://twitter.com/home?status=" + url, "Twitter", 500, 500);
            };
            return TwitterShareButton;
        }());
        Customizer.TwitterShareButton = TwitterShareButton;
        var WhatsappShareButton = /** @class */ (function () {
            function WhatsappShareButton() {
            }
            WhatsappShareButton.prototype.onShare = function (url) {
                var isSafari = isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
                if (isSafari) {
                    window.open("whatsapp://send?text=" + encodeURIComponent(url));
                }
                else {
                    window.location.href = "whatsapp://send?text=" + encodeURIComponent(url);
                }
            };
            return WhatsappShareButton;
        }());
        Customizer.WhatsappShareButton = WhatsappShareButton;
        var EmailShareButton = /** @class */ (function () {
            function EmailShareButton() {
            }
            EmailShareButton.prototype.onShare = function (url) {
                //This is to bypass blocks by browsers or anti-popup systems
                var mailLink = "mailto:?body=" + encodeURIComponent(url);
                var newTabLink = $("<a href='" + mailLink + "' target='_blank'></a>");
                newTabLink[0].click();
            };
            return EmailShareButton;
        }());
        Customizer.EmailShareButton = EmailShareButton;
        var NativeShareButton = /** @class */ (function () {
            function NativeShareButton() {
            }
            NativeShareButton.prototype.onShare = function (url) {
                navigator.share({ url: url });
            };
            return NativeShareButton;
        }());
        Customizer.NativeShareButton = NativeShareButton;
    })(Customizer = Zakeke.Customizer || (Zakeke.Customizer = {}));
})(Zakeke || (Zakeke = {}));
