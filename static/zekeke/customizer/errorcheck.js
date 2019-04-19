window.onerror = function (a, b, c, d, e) {
    var dialog = document.createElement("div");
    dialog.className = "dialog";
    var dialogContent = document.createElement("div");
    dialogContent.className = "dialog-content";
    var content = "";

    if (T)
        content = T._("It seems that your browser is not supported. Please use", "Customizer");
    else
        content = "It seems that your browser is not supported. Please use";

    var userAg = navigator.userAgent.toLowerCase();
    content += " <a href='";

    if (userAg.indexOf("android") > -1)
        content += "market://details?id=com.android.chrome";
    else if (userAg.indexOf("iphone") > -1 || userAg.indexOf("ipad") > -1)
        content += "https://itunes.apple.com/us/app/google-chrome/id535886823";
    else
        content += "https://www.google.com/chrome/browser/";


    content += "' style='color:blue'>Google Chrome</a>";

    var errorMessage = a + " " + b + " " + c + " " + d + " " + e;
    var layout = "<img src='/images/customizer/dialog_warning.png' alt=''/><h1 class='primary-color'>Error</h1><p>" + content + "<textarea rows='5' style='width:100%; resize: none; margin-top:20px; height:100px' readonly>" + errorMessage + "</textarea></p><div class='dialog-buttons'></div>";
    
    dialogContent.innerHTML = layout;
    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);
};
