var MPlaza = MPlaza || {};

// String utils, da spostare
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}


// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0, targetLength);
        }
    };
}


// Matteo D'Avena
if (!String.prototype.padStartEnd) {
    String.prototype.padStartEnd = function padStartEnd(targetLength, padString) {
        targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength - this.length;

            // divido la lunghezza residua in due, per la parte destra e quella sinistra
            // se dispari, la parte destra sarà più lunga di 1
            var semiLength = Math.floor(targetLength / 2);
            var mod = targetLength % 2;
            var leftLength = mod > 0 ? semiLength + 1 : semiLength;
            var rightLength = semiLength;

            // parte sinistra
            var padLeft = padString;
            if (leftLength > padLeft.length) {
                padLeft += padLeft.repeat(leftLength / padLeft.length); //append to original to ensure we are longer than needed
            }

            // parte destra
            var padRight = padString;
            if (rightLength > padRight.length) {
                padRight += padRight.repeat(rightLength / padRight.length); //append to original to ensure we are longer than needed
            }

            return padLeft.slice(0, leftLength) + String(this) + padRight.slice(0, rightLength);
        }
    };
}

// -----------------------------------------------------------
// Enums
// -----------------------------------------------------------

MPlaza.EventMessages = {
    DPIWarning: 1,
    UploadLimit: 2,
    AddToCartConfirmation: 4
}

MPlaza.CustomizerElementType = {
    None: "none",
    Rectangle: "rectangle",
    Oval: "oval",
    Line: "line",
    Path: "pen",
    Free: "freeHand",
    Text: "text",
    Image: "image"
};

MPlaza.CustomizerInteractionMode = {
    None: "none",
    Select: "select",
    Create: "create",
    Move: "move",
    Rotate: "rotate",
    Resize: "resize",
    Delete: "delete",
    Edit: "edit",
    MoveTextOnPathFirstEnd: "moveTextOnPathFirstEnd",
    MoveTextOnPathMiddleEnd: "moveTextOnPathMiddleEnd",
    MoveTextOnPathLastEnd: "moveTextOnPathLastEnd",
    MoveTextAreaTopEnd: "moveTextAreaTopEnd",
    MoveTextAreaRightEnd: "moveTextAreaRightEnd",
    MoveTextAreaBottomEnd: "moveTextAreaBottomEnd",
    MoveTextAreaLeftEnd: "moveTextAreaLeftEnd",
};

MPlaza.PointingInfo = function () {
    this.modifiers = { option: false, control: false, shift: false };
    this.point = undefined;
    this.delta = undefined;
    return this;
};

// Get Viewport
getViewport = function () {
    var m = document.compatMode == 'CSS1Compat';
    return {
        l: window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
        t: window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
        w: window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
        h: window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
    };
};

// Support Types
MPlaza.ItemInfo = function (designItem, item) {
    this.designItem = designItem;
    this.item = item;
    this.elementType = MPlaza.CustomizerElementType.None;
    this.itemGuid = MPlaza.EmptyUUID;
    if (designItem && designItem instanceof MPlaza.DesignItem)
        this.itemGuid = designItem.get("itemGuid");
};

// TextItemInfo -> ItemInfo
MPlaza.TextItemInfo = function (designItem, item) {
    MPlaza.ItemInfo.call(this, designItem, item);

    this.elementType = MPlaza.CustomizerElementType.Text;

    this.text = "";
    this.strokeColor = "black";
    this.strokeWidth = 0;
    this.fillColor = "black";
    this.fontFamily = "Arial";
    this.fontSize = 18;
    this.fontWeight = "normal";
    this.fontStyle = "normal";
    this.fontStretch = "normal";
    this.justification = "center";
    this.isTextOnPath = false;
    this.isTextArea = false;
};

MPlaza.TextItemInfo.prototype = Object.create(MPlaza.ItemInfo.prototype);
MPlaza.TextItemInfo.prototype.constructor = MPlaza.TextItemInfo;

// ImageItemInfo -> ItemInfo
MPlaza.ImageItemInfo = function (designItem, item) {
    MPlaza.ItemInfo.call(this, designItem, item);

    this.elementType = MPlaza.CustomizerElementType.Image;
    this.url = "";
};

MPlaza.ImageItemInfo.prototype = Object.create(MPlaza.ItemInfo.prototype);
MPlaza.ImageItemInfo.prototype.constructor = MPlaza.ImageItemInfo;


// Constructor
MPlaza.Customizer = function (isViewer, isMobile, canvas) {

    this.isViewer = isViewer || false;
    this.isMobile = isMobile || false;

    this.showSideImage = true;
    this.fitToScreenMargin = 13;

    this.canvasID = "mp-canvas-customizer_" + MPlaza.makeID(5);

    this.canvas = null;
    this.context = null;

    if (canvas !== undefined && canvas !== null) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    }
    this._paper = new paper.PaperScope();

    //  Paper scopes issues
    this.__defineGetter__("paper", function () {
        paper = this._paper;
        return this._paper;
    });

    this.__defineSetter__("viewMatrix", function (values) {
        var matrix = new this.paper.Matrix(values);
        this.paper.view.matrix = matrix;
    });

    this.rasterLayer = null;

    this.zooming = false;
    this.frozen = false;

    this.tool = null; // Mouse & keyboard events on canvas

    this.clipboard = null;
    this.selectionBounds = null;
    this.selectionBoundsShape = null;
    this.selectionMoveHandle = null;
    this.selectionRotateHandle = null;
    this.selectionResizeHandle = null;
    this.selectionDeleteHandle = null;
    this.drawSelectionBounds = 0;
    this.model = null;

    this.loadingCircles = [];

    this.interactionMode = MPlaza.CustomizerInteractionMode.None;
    this.elementType = MPlaza.CustomizerElementType.None;

    this.hammertime = null; // Per la gestione del touch

    this.hitItem = null;
    this.hitTestEnabled = true;
    this.mouseStartPos = null;
    this.adjustmentDelta = null;
    this.originalPositions = null;
    this.element = null;
    this.pivot = null;
    this.corner = null;
    this.originalSize = null;
    this.originalCenter = null;
    this.originalContent = null;
    this.originalMatrix = null;
    this.originalShape = null;
    this.originalAngle = null;

    this.imageLayer = null;
    this.imageItem = null; // Rappresenta l'immagine del prodotto da personalizzare, per il lato selezionato
    this.imageWidth = 500;
    this.imageHeight = 516;
    this.mask = null;

    this.verticalCenterLine = null;
    this.horizontalCenterLine = null;

    if (canvas !== undefined && canvas != null) {
        this.setupCanvas();
    } else {
        this.createCanvas();
        this.createDOMElement();
    }

    this.setupImageLayer();

    this.lastPanPoint = new this.paper.Point(0, 0);

    this.iconsBytes = null;

    this.masterGroup = null;
    this.snapCache = null;
    this.oldScale = 1;

    var viewPort = getViewport();
    if (!this.isViewer) {
        this.iconsBytes = {
            move: "iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAALZSURBVGhD1ZjPaxpBFMffFkFB/UvEW0r8FzwJidDc4iE9pGd7So/NqZ4bMJfkloKn5uC/YGhu4r/RFkRQEGy/7gw7zs7vWQ1+YJO87Oy8z0zevl2T/P3ze0NHxjv2/ahQSifCV1f8RsehkE4orRe/qsHoQ4krpMNLPGSxJnSbsIeatu93OsI8Dmd1y3eWdknkxsbpL2I6a5Xmsi6JRB4eH7dHnviFK6XFXfWVBZAdjUbbQy0eh1I6RJTDhTn7EC/0RpSFOUWLK6SL2WEZnBsOh7TZhM0vopD2v1Fswpyfz8/0/e4uWjy6PFyFOePxOFo86i1vsVjQdDplUcq3wYBWqxWLUsrlMn3u91mU0mg0qF6vs8iPYGkIV6tVFmV8uLjYnhPBuB9PTyzKmM/nVKvVKEn8SjKoPFAS8g6HMJvNgkrFW9q3hm2E1LiXtIvw+5MTap2e7hz4nQmID+/vWWTHuaZl4S83N9RqtVgUxmQyoa+3tywi6na71Lu8ZJEeJ2nVDqMjlEolFqU73Jc6hMzgf2f59frKIqL1ep3rNC7i1vLQlQSSoUvwY7lcsjN6MEa8RhYGyIWcJozSLjW8D2ziRmnsxlthym2U/nR9Te12m0WHo9PpbHPrMErjSYWLz8/O2G8ycCPiScePSqXCzujBGPEazCGDG/Hj1ZXxKXmULS/rWRb4ZLYbE21N7iTYYVs7dBUG1pYngkkxuQn04cnLy84h9mYVPsLASxq4iPvgKwze9NVUN4eNYGmApKEfAprNZpAwiJIGIU/NkJIQ8a5pGd8ajxUG0dLAVbwIYVCINLCJhwvnq7cwaQAp1SM/bofzj/NCpUGv19t5ycLLT0xJqN5AoruHCnxIxYdVgBcu338R5MH1meZepItiVzUjVx7mPTnE+tIcmXA+Z07arJUuybwwHS4zg/QnPjpRZAu6Ec3pdZgXLM/Jx6lyFd49bLgu2DTu4NLxEP0D1MmBPKW9CeMAAAAASUVORK5CYII=",
            rotate: "iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAT5SURBVGhD3ZlbLGVXGID/4x4PLlOUYMi0E0SJlyFuE/RFX4SZ6TSReDCNJ8000YQxhgRjDEkn6ZSnmr5IvXQeJDoJiSIY4k1dgkw7YVyLOngQd13/2v9m73P2Pns7exudfgnWWuecdb61zlr/v9Zh2bRunMAHhgv9/aD4/0pb6C8iLV8WmtIoKV30F7kB9E6IorTwYkH3fe5S4b2E344GoCBtkbxY79jNRHhP6QBsPRSkxSf+FxBl5U6mxOn19XUYHByEsbExmJ2b4/Xj42Pw8PAAfz8/+PT6dfgsNhbSb94EP19fepXzGJKeY4JtbW0wNDwMJyfa3bi6ukJaaioUFBRAcHAwtZ4fBWmsOl7LOIso++vLl3B0dESt+omJiYHGhgawWJzbMzJp7EJrvnZ2duBJfT2Mjo5Si5yPg4IgPDwc3NzcYG9/HxYXF2F1dZUeBYiIiIAndXXga2CZnErrEd7b24OKR49genqaWgR8fHwgJycHPs/KgsDAQGo9428m3dvbywda/uCBIWGEpFFX+6NqaGyEgYEBqgl8kZ0NhYWF4O3tTS0XD4U8beEeNlNSYVyP3xQXQzH7eZ/CiGYaR3Z3d+HnFy+oJvD1vXuQzWbZLDo7O+EPFjL1oEu6s6sLNre2qAaQeOMG5ObmUs043d3d0NTcDNXV1TAxMUGtyuCa0CfNZkHExcUFioqKqGacvr4++OH5c17eZ9GmprYWZmZmeF0J3H2a0gssZC0sLFANICUlBUJCQqhmDBT+/tkzWWLCkFpZVeVQXFN6fHycSgKY0cxgmGVRW2ERUfyvt2+pRY6m9Py7d1QSiGVnCKOMjIzw8Oko9XPxykqYnZ2lljM0pf/Z2KASgKenJ/j7+1PNOVC4/ulTODw8pBZ1tre34WFFhZ24LI3/9uoVbEuiBNLf38/XNYLSt2/d4mURd3d3yMvL42lbC9xov7Azy8HBAbUI4EbHxxA8SCUmJvKyCGbQr+7epZqNNI4IR4Yj1AOKYlpOSkqiFue4fecOPyIgqWzPYJ+OkC2PyMhIfpjBs4QWZglbrdZTYeSjK1eopI7dmkbxWhYrHaVmTOFlpaWGhZHJyUkqCYRfvUoldRQ34ifXrkFtTY2iOAp/V1ICycnJ1GKMwdevqSQQFxdHJXVUo0dUVJSduCickZFBLcZYXl6GoaEhqgGEhYVBWGgo1dRxGPJQvIrFSrzrId/ev2+aMPJTSwu/BYnoPYDJoocaePpaWlriZ2ezaG9vhxbJyREvvC1sEF5eXtSiji5ps+lip0Y81UkzYglbdlmZmVRzzOny0L4GGAdTczOT/bGpSSacnp6uWxiRzbSee6ItWyyDYlpOSEiATPbGeLG1ZW1tDX7v6YGOjg7+fCnR0dFQ9/gxz7Z6UVgeWNU37yiAGRS//xAJYtKhLAJ4ss2L54v5+Xl+sVUCB/qwvFzXdU06oU6vafx4S8vKYGpqilr0g1/afMlSd35+Pr9UaCNfA4Y24srKCrS2tvIEoedLG4zzKSwpoSx+/+EspkQPvD8OsNPgBEvJf755A9bNTX5qw1kMCAiASCYYHx8PaWlpvH4+UE++XE2Rvljsw4OeBXXJ2M+pnbR63LiMD0TZxk5aXU3oQH1QZoMmyjbnXh5iNxcjL/SuNT1Or2ns3izxs36EkvL8nmFoIwqda72FFuI/pvRjSFrA6HyfVxngX90V7749CDtpAAAAAElFTkSuQmCC",
            resize: "iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAMQSURBVGhD1ZdNSGJRFMf/Zhi0aREF7doGgssQ3ESz6oOoAZtFzcJVG6npw2omyKZVX4toIxS4aTEJY0QZTEw7QVxqQYs2MS2EoplpEwSp433vOPbw+bxP77X6ifLO0Xfv7x3P9T4tf//8zuINYck969RDM7zsNbLZTUmzq8y/iqKS0bil2eAyaszGNCuuI603RFZqU6hj88+gI613stiW0Eedg2emChaiXHiq/uqkVYzr/UqljSm7ufT199MRH42NjVjy+9HR0UEZ8XAuRD6ampqwurIiVZihkeZfv8W0tLRgfW0N7e3tlJHHf2mmWmmNW1tbsba6ira2NsrIhaSr2zzu7u5wfn5OkXxIurKWyJNOp7G+sYGjSIQyctFZiJUTCATwbW+PInkIlWbs7u4icnxMkRyESzscDrzr7qZIDqak3W43piYnYbVaKaPF6XQqG0tDQwNl5MAt7fF48HF0FF1dXfg8Pw+bzUbvqLDqzs/Nob6+njLyKCttsVjg9XoxNDhIGaCzsxP+xUVly2YMDAxgfHwcdXXCu02Xsvce0WgULpeLIi2Xl5dInp3h/dAQZWrDm/s3zqjN9ymYF5H+Hg4rrVUK1pJG1FQ6m81ie2cHwWAQXxYWkEwm6Z0CP05OsJK7+TKiZtKZTAabm5s4ODhQ4oeHB/iXlhCPx5WYEd7fx9bWlnJxRtRkIT49PSnVi8VilCnANqpPExP4dX2NUChEWeDo8JCOipEu/fj4iK/Ly0gkEpThw0haenv8PD01LVwO6dK9PT0YGRmhSAw1WYgfhocxNjZGUfVopKv7/2JMX28vpqemSt4hmkEjzVakTHG73Y7m5maKzKC1KmoP9adE/A9KKpXCjM+Hm5sbyphB61Oip8W2+tXVFaZnZnB7e0sZMxQXsIRdVlibXFxcwDc7i/v7e8qYpdjEcHNhHxffKNVj2Aeq8OvT5mje/EdeUl7brhzSeVn1NFG9boy2QJbc4/m3ziGthZ0mS7wwrnaGwiWoedPSjOdXLY58NctTkbSK6HrzF6EKadGV5gX4Bz4J2453ePRjAAAAAElFTkSuQmCC",
            remove: "iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHgSURBVGhD7ZgxbsIwFEB/WEBioDMSHRi4ARIj3ctIL5Bj0DLQcgwuACPdy8gZGDhCC0MkWJrK5DfByXdip8knlfwW/nfAPP84Bts5fH36kEA0OUFYQWr4GoMSJsZ2IxTSsmAwBL3Kc9yfhHRcUEQmNQ7ea35XTAYrSccFTYUjTBQCqMGqegmlKUE/p3J+ZE3Vt6N0Ui/4uHnFOCCXPKrqaXieBy/TKex2O2yh6fV68DqbQbPZxJZ8ENJq5e12i5HMcrXKFP5FiD+Nx5jJDAYDjNIhpEVKT4vH0QijcnhfrzFKJ7F6qISrROrqUVVweqinxDX7/R6jcuh2uxilo/jDpOZ8PsPheMSsGO5aLajX65hlYywtVpC3+RyzYnieTLRXDoH0IP4XrDQXVpoLK82FlebCSnNhpbmw0lxYaS6sdLlEG+9QWvu0wynhXESrz2grG0rrHSIAtNttjIoju0957y1ND51t+X2nA/1+H7O/I/oSfaYjlzNxhCAuZ8mfTidYLBbwsdlc4jw0Gg14GA7Bdd1LbILi3EM0lTB3C6IWVxO5Uzlh2acWL3OUZ00SDnzUlV3IdfrWulFdHdJF+ePihJe4h0CLXqOU9uEbo2DcfLM8u0ikNKUpuipbXG8BAPgBfPt9FF2DWWsAAAAASUVORK5CYII=",
            itemAlert: "iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkZmM5M2YyZi1hYzg1LTVlNGUtODE2Zi0yN2UzOTNjNTM0ZjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTk1OEVGRDQyRUI0MTFFOEJGQzRCQjY0RDUzNERGMzYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTk1OEVGRDMyRUI0MTFFOEJGQzRCQjY0RDUzNERGMzYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmFjYjg5M2U2LTllNTktYmY0ZS04MWVjLTM4NmQyOGQ1NjEwZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpkZmM5M2YyZi1hYzg1LTVlNGUtODE2Zi0yN2UzOTNjNTM0ZjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz53t8IQAAACGUlEQVR42qyVz0sbQRTH36YhblAJCtYKHqonBW3soWB78VCKCkppBCFeevBWKCiekj/AnIT0klsPXhQKLbQWtIgXDyp4UgNtQcSDP1APkhYxDZrt9zvOxkXdTUJ88GFmZ998Z/btvDeGZVniYnUgCvrBE/AI5MAe2AbzYBac3jmbwjcwQQycWsWNPnEQvKlj2Ds2DIMDj9GdAx2Sz0tucUly3+flYmVN8scnys/3sEH8L7olMNAvgVcvMeDjcBoMQmO3oOcIRTNYZXuxlZaziZhc/vwlXvagvU2qpxLi7+wQHaLnui0Im2AZPOMuz96NiZXNSilmmKZUp5JXuxdZBz3g3Kffj1FU7bQMUfWP4Ms5nEsNraV2XI92BzENZfpeu35+1fCQav99+uwaltDCV8Y8g8dWnz5SIYbAK6bB8fcKN+NcalCLmhTu5RP/fqXm0OijcBd7PFKVmkMjTOFG9uxzWok5NBr9/B8gUHTS4WFZi1CYM2qZUV67/hOJFhWjhrYjhuK3WgFp6rmDp2GFp8+1xgaFf7DH3PeymtQHhZc5NBZKThBz9K1qsx+nS0oQu1bEwCTT8i9iWU5K2/Wi9susXYziIGHXiiTY4gsWFDqWI8o5WjSttcQWPgcRcMAqxdX5acWMPvTVlW0fvNFatwp9C7rf7qPQ33U1BfV1cz9Xk8tlOsKCoi/TJj3OhNrkkQIzbpfpfwEGAB0OebpeExhfAAAAAElFTkSuQmCC",
            itemAlertDark: "iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkZmM5M2YyZi1hYzg1LTVlNGUtODE2Zi0yN2UzOTNjNTM0ZjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjQzNTRGRTYyRUI0MTFFODlFNDdCODEyNTEzMUI5NkQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjQzNTRGRTUyRUI0MTFFODlFNDdCODEyNTEzMUI5NkQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmFjYjg5M2U2LTllNTktYmY0ZS04MWVjLTM4NmQyOGQ1NjEwZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpkZmM5M2YyZi1hYzg1LTVlNGUtODE2Zi0yN2UzOTNjNTM0ZjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7DiQshAAACAklEQVR42qyVvS9DURjG3yuiDNLQwUcMNNKkidDFoB1qU4M/gIQJo1oQgsFnsGDEzMLCoDYkarDUx6KRxkBEaMQktdTz3JwrV7m3qp7kl3Puvec899xzz/u+WjqdFguVgU7QDhpBJXgHd+AG7IMt8PLjbBpnUAxGwUs6uzhmDJRk+mgZK64Fe6CB909OonJ0eCSxWEySyaQ+wOVyic/nk2BrUAIBv2iaxttXoAPcGkZm4xpwyjYej8viwpIkEgmxk9vtluGRIfF4PKK2qEW1n8bF4Bg0R6NRmZ6akVQqJb+Rw+GQiclx8fv9vDwDQfBWoJ4P0pQrzcWU4ljO4Vx6KC99xeVoE2idfb39lp8fag/pbWQ/Yrkt6xtr3PNXXhaoI+Xkj7Lb056ebh0rcS496EVPGrfxin8/X5k8QjT2sccjla9MHk00rmDPOKf5yORRUcgfC4qyTXp6es7pJTR+AKWMKLtVhwfCWc3oofTIrbhmj2FqJ6/Xq2Mnk8c5jQ/YY+zbidFF7GTyiBSq1DeLhOLkIbc6yzvbO1nzBpMSxADZMnLFKJhjWIYHBnMKaSNfrKwuG8loDMwbuWIZXPIBP5cDczHlHGV6pby+pM16Bg+o/mPavAetqrp8S/R1YPc/Ev1PpalElZt/LU2ZxbSLCUUV0yp1nwF1wSMFNq2K6YcAAwCfZ3CwpLDluwAAAABJRU5ErkJggg=="
        };
    }

    this.side = null;
    this.design = null;

    this.editTextCallback = null;

    this.itemRemovedListeners = [];
    this.designItemRemovingListeners = [];
    this.itemChangedListeners = [];
    this.itemCreatedListeners = [];
    this.designItemChangedListeners = [];
    this.selectionChangedListeners = [];
    this.deselectionChangedListeners = [];
    this.imageLoadedListeners = [];

    this.areaAlertItems = [];

    this.areasSizeCountCollection = [];
    this.areasSizeLimit = 52428800;

    this.panOrigin = null;

    this.touchEnabled = false;

    this.isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);

    // Event messages customized
    this.customizedMessages = [];

    this.fontAscentCache = {};

    return this;
};

MPlaza.Customizer.prototype = {

    createCanvas: function () {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("id", this.canvasID);
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingQuality = "high";
        this.context.imageSmoothingEnabled = true;

        this.setupCanvas();
        if (!this.isViewer) {
            this.setupTouchEvents();
            this.setupTool();
            this.showSelectionBounds();
        }

        return this.canvas;
    },

    setupCanvas: function () {

        var ad = this;

        if (!this.isViewer)
            $(this.canvas).mousewheel(function (e) {
                //ad.onMouseWheel(e) 
            });

        var options = {
            preventDefault: true
        };

        this.paper.setup(this.canvas);

        // HACK: Do not select the children of layers, or else
        // the layers of selected objects will become selected
        // after importJSON().
        this.paper.Layer.inject({
            _selectChildren: false
        });

        this.paper.view.draw();

        //Start the rotation animation
        var that = this;

        this.paper.view.onFrame = function (event) {
            that.loadingCircles.forEach(function (x) {
                x.rotate(3);
            });
        };
    },

    appendViewMatrix: function (values) {
        var matrix = new this.paper.Matrix(values);
        // test
        //matrix = matrix.scale(0.5);
        this.paper.view.matrix.append(matrix);
    },

    translateView: function (dx, dy) {
        var matrix = new this.paper.Matrix();
        matrix = matrix.translate(dx, dy);
        this.paper.view.matrix.append(matrix);
    },

    rotateView: function (angle, centerX, centerY) {
        var matrix = new this.paper.Matrix();
        if (centerX !== undefined && centerX !== null && centerY !== undefined && centerY !== null)
            matrix = matrix.rotate(angle, centerX, centerY);
        else
            matrix = matrix.rotate(angle);
        this.paper.view.matrix.append(matrix);
    },

    scaleView: function (hor, ver, centerX, centerY) {
        var matrix = new this.paper.Matrix();
        if (centerX !== undefined && centerX !== null && centerY !== undefined && centerY !== null)
            matrix = matrix.scale(hor, ver, centerX, centerY);
        else
            matrix = matrix.scale(hor, ver);
        this.paper.view.matrix.append(matrix);
    },

    getIdentityMatrixValues: function () {
        var matrix = new this.paper.Matrix();
        return matrix.values;
    },

    getTranslatedMatrixValues: function (matrixValues, dx, dy) {
        var matrix = new this.paper.Matrix(matrixValues);
        matrix = matrix.translate(dx, dy);
        return matrix.values;
    },

    getRotatedMatrixValues: function (matrixValues, angle, centerX, centerY) {
        var matrix = new this.paper.Matrix(matrixValues);
        if (centerX !== undefined && centerX !== null && centerY !== undefined && centerY !== null)
            matrix = matrix.rotate(angle, centerX, centerY);
        else
            matrix = matrix.rotate(angle);
        return matrix.values;
    },

    getScaledMatrixValues: function (matrixValues, hor, ver, centerX, centerY) {
        var matrix = new this.paper.Matrix(matrixValues);
        if (centerX !== undefined && centerX !== null && centerY !== undefined && centerY !== null)
            matrix = matrix.scale(hor, ver, centerX, centerY);
        else
            matrix = matrix.scale(hor, ver);
        return matrix.values;
    },

    setupTouchEvents: function () {
        var customizer = this;
        var myOptions = {};

        //this.canvas.ontouchstart = function (e) { customizer.onTouchStart(e); };
        //this.canvas.ontouchend = function (e) { customizer.onTouchEnd(e); };

        var mc = new Hammer.Manager(this.canvas);

        mc.add(new Hammer.Pan({ threshold: 5, pointers: 0 }));
        mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2, threshold: 100, posThreshold: 1000 }));
        mc.add(new Hammer.Pinch());

        mc.on("panstart panmove panend", function (event) { customizer.onPan(event) });
        mc.on("doubletap", function (event) { customizer.onDoubleTap(event) });
        mc.on("pinchstart pinch", function (event) { customizer.onPinch(event) });
    },

    setupTool: function () {
        this.tool = new this.paper.Tool();
        var customizer = this;

        this.tool.on({
            mousedown: function (event) {
                customizer.onMouseDown(event);
            },
            mousemove: function (event) {
                customizer.onMouseMove(event);
            },
            //mousedrag: function (event) {
            //    customizer.onMouseDrag(event);
            //},
            mouseup: function (event) {
                customizer.onMouseUp(event);
            },
            keydown: function (event) {
                customizer.onKeyDown(event);
            },
            keyup: function (event) {
                customizer.onKeyUp(event);
            }
        });
        this.tool.minDistance = 1;
        this.tool.activate();
    },

    createDOMElement: function () {
        this.domElement = document.createElement('div');
        this.domElement.setAttribute("id", "mp-canvas-customizer-div_" + MPlaza.makeID(5));
        this.domElement.appendChild(this.canvas);
        this.domElement.style.position = "relative";
    },

    appendTo: function (element) {
        element.appendChild(this.domElement);

        // Senza la doppia chiamata al resize si hanno dei problemi su mobile
        // In particolare gli eventi vengono catturati ad una frequenza molto bassa
        this.resize(element.offsetWidth, element.offsetHeight - 2);
        this.resize(element.offsetWidth, element.offsetHeight - 2);

        this.moveOriginToViewCenter();

        if (!this.isViewer)
            this.setupZoomControl();

        var viewer = this;
        $(window).resize(function () {
            viewer.resize(element.offsetWidth, element.offsetHeight);
            setTimeout(viewer.resize(element.offsetWidth, element.offsetHeight), 200);
        });

        // var that = this;

        $(window).on("orientationchange", function () {
            //viewer.resize(element.offsetWidth, element.offsetHeight);
            //viewer.fitToScreen(true);

            //viewer.paper.view.update(false);

            setTimeout(function () {
                element.offsetHeight;
                viewer.paper.view.center = new paper.Point(0, 0);
                viewer.paper.view.update(false);
                viewer.fitToScreen(false, true);

            }, 200);

            //viewer.resize(element.offsetWidth, element.offsetHeight);

            //setTimeout(
            //    function () {
            //        //$('.Landscape').css({
            //        //    'height': window.innerHeight,
            //        //    'width': window.innerWidth
            //        //});
            //        // that.paper.view.center = new paper.Point(0, 0);
            //        // that.paper.view.update(false);
            //        viewer.fitToScreen(true);
            //    }, 500);

        });
    },

    resize: function (width, height) {
        if (this.domElement) {
            this.domElement.style.width = '100%';
            this.domElement.style.height = height + 'px';
        }

        this.canvas.style.width = '100%';
        this.canvas.width = this.domElement.offsetWidth;
        this.canvas.height = height;

        // When we open ClipArt, UploadImage or MyImages the window height change and the resize
        // is triggered, so the view is re-centered and is weird to see.
        //this.moveOriginToViewCenter();

        //if (!this.isViewer) {
        //    this.setZoomControlPosition();
        //    this.setMoveControlPosition();
        //}

        this.paper.view.viewSize = [this.canvas.width, this.canvas.height];
        this.paper.view.zoom = this.paper.view.zoom; // forzo il ridisegno
        this.checkAllAlertItems();
    },

    moveOriginToViewCenter: function () {
        this.paper.view.center = new this.paper.Point(0, 0);
    },

    setupZoomControl: function () {
        if ($('body').find('#mp-canvas-zoomControl').attr('id') != 'mp-canvas-zoomControl') {
            $('<div id="mp-canvas-zoomControl" class="olControlZoom" unselectable="on"> ' +
                ' <a class="olControlZoomOut olButton" id="mp-canvas-zoomout" href="#zoomOut">' +
                ' <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAABklBMVEVkZGT///9kZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGSZMFejAAAAhXRSTlMAAAECBAUGBwgKCwwNDg8QERITFRYXGRocICEiIyQlJykqLC0uMDM1Njc5Oj0+QEFCRUhKTE1OT1BRUlNUVVZYWltdX2BiY2RnaWprbG9wcnN0dXd5ent8f4CCg4WGh4uMjo+RkpOUlZaXmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKzHueo5wAAAfZJREFUeAGF0PtTElEYxvGXTQVrUYmyC5WlGZpd0sKETLBE7VKkoFnSpSgrKlRAAkFY2Kf/u3fB4ZxDzfb9bWc+8+w7hw5z+oKJrdzej2TUr2sk5eCoWffF1SoOa3yecv8L9UVqkKonh/5G3jiszOJOJt/S2audaCABrv7+4bXhS/6ZtRy4wpiKXA+slZ93vdSsy/8SXPq0jI6MGmxSI9ROX7KG12Skr7P5NuKQ6n0KoOSX0DCAyh3+ENGJFE8lJDQPNDZ1FXVPAfg6KNAmD82RisiTAfLXBdoBtq8QkdY2GtHROHAQEagK89NZot7fIiLXAlB7LJAJ8yO/iVtBznnAeCZQBebWOaIedWmJlx4JlAayE52HH3sFlO8LtA5UFzrRqQKwOy7QNGCmBlVknYSULpDvwJpSkHZhFzCekECuZQD5SZLyvgGQ80lIO58FkA20iXYmCR5fJAlR1yS4cvxyi3jC3wE0NkhB5IqAMwtvo4Hb4XimBgu9uzkmI1ZzBqzqRq1ugjM+pE1jL6Qg6hr/YkL0a1EPAyjekxGnh1Kl1n/K27Eh6pkGtz+rIM45Ovt843UieuMkcX0r4CohTUUd6astJZCNCtoicq+0lC2i/hdNNWOLyNPc2g92k13Hm6oUJXsVs1CA7BuIoTjRQ/+pf/mWw/EHz+jJTaZSlbAAAAAASUVORK5CYII="> ' +
                ' </a> ' +
                '  <a class="olControlZoomIn olButton" id="mp-canvas-zoomin" href="#zoomIn">' +
                '  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAABklBMVEVkZGT///9kZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGSZMFejAAAAhXRSTlMAAAECBAUGBwgKCwwNDg8QERITFRYXGRocICEiIyQlJykqLC0uMDM1Njc5Oj0+QEFCRUhKTE1OT1BRUlNUVVZYWltdX2BiY2RnaWprbG9wcnN0dXd5ent8f4CCg4WGh4uMjo+RkpOUlZaXmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKzHueo5wAAAftJREFUeAGF0PtXEk0cx/Ev+3DBp0Ulyi5UlmZodkkLEzLBErVLkYJmSZeirKhQAQkEYWE//N/N7nqYGeps799mz+t8ds7QUZ5gJL1d3P+RSYRUhYQcLDJzXVxr4Kj252nf31B/vAmhVmb4TxRIwUiv7OZLli5c7UWDabBa7x9eG7kUml0vglUel5H3gbHy826AzJyhl2DlTovovzGNmewodVOXjeF1EakbzHwbdQj1PQVQDQloBED9jnXodDrmtxNZNpUW0ALQ3lJl5JoG8HWIoy02NE8yIn8eKF3naBfYucIOShcpRP+ngMM4Rw3on84S9XV4RN5FoPmYIx36R/YmPgl5FgDtGUd16NvniNzy0jJbesRRDihM9l782Cugdp+jDaCx2ItOlYG9CY5mAD07JCPjSsiqHAUPjSkJKRf2AO0JceRdAVCaIqHAGwDFoICU8wUAhXCXKGcyYONLJCByToFVS122iD/2HUB7kyRE3jhYevltInw7lso3YaB3N8dFxNS8BqOW1mzpYGkfcrq2H5UQOSe+6OD9WlJjACr3RMRSo9mq9Z/aTnKY3DNgHcxJiOUZm3u++TqduHGSWP2rYNWjiox6UtcsZYO4itgi8q1ayhbRwAtTzdoi8ptbBxEX2XXcVNUE2aukgcJk32ASlUk3/aOBlVsOx29IL9WtgmuD+QAAAABJRU5ErkJggg=="> ' +
                '  </a> ' +
                '  <a class="olControl3D olButton" id="mp-canvas-show3d" href="#show3d">' +
                '  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJ1SURBVHjapNZBiFZVFADg848zDTnhWItQx9oIYWiU2bgIyUVERdAiazMYldlOg0hIBwLpgzBHsGGIqGB0FxS5ys3gIBIUFAONLWoWQzWLSENplTqO/2nha3xv/t9G3s/ZXO6774N3zj333RDLxkEL5nznhD0eXfo0i4jbgLqMysU45fW6UAgjJSpN2VkXCkcK5E/zUhpzRz0oHJZmbLDNhJTOGqgHhbeKZDcMS+lHa+tB5RiyIJ22olMovKQpjXUOhf1SerZzKExK03o6h7a6Ig3dGlqp313FuGGVfv2lmXJ8JZ3WaId0O+CSlD62Rljtd39L6brPbV+y+mmpaWMr0/CZNOMDZ6VpK/VakCYc942UXq6s7/Wr9FordL/0mwEhTEnPCPOa1gsNL7gmbS43rePSJ63QKk/aVIy/lIaEq5o2FHPvSx9WoHeluf87PHa45II1elzVtLGYf/xGwUvQZofsvRVz0kXpL4PC3RXoYenCzfot12vHnDMrjVihrwI9Ip1vB73pkAfbYg0/SM8XOfoPekKavnEWVaE/pHdKr9/nFduK8T7pvSXJPiaNtTtqx6VPS9Bj0i/uEcIp6dWi/ANCj11Seqgd9IY0e7MKup2UfnbUGWnG6sUNecL3stgQbaBNUnqqsleHXZTmjbq30iL/GF/87BaoyxnpiyWJvlO/vpam7WstSbn8u6TLrb++24sy1OMnabJzKDwnpbc7h8JHUtOLnUPdJqVr1dLWgcI656Q0rCGEQfvrQWF9cQJOGPSAWelwPSj0GpPSFeeLK8ORelAIO01VrjAjdaEQdvu6RI3qqguFsMVu4741Z8GB5aF/BwBgaLXGzqeljgAAAABJRU5ErkJggg=="> ' +
                '  </a> ' +
                '</div>').appendTo('#zoomPanel');
        }

        var customizer = this;
        this.setZoomControlPosition();
    },

    setZoomControlPosition: function () {
        // Control position
        var canvasOffset = $("#" + this.canvasID).offset();
        var cx = canvasOffset.left;
        var cy = canvasOffset.top;
        var cw = $("#" + this.canvasID).width();
        var ch = $("#" + this.canvasID).height();

        var zcw = $('#mp-canvas-zoomControl').width();
        var zch = $('#mp-canvas-zoomControl').height();

        var x = cx + cw - zcw - 10;
        var y = cy + ch - zch - 10;

        //$('#mp-canvas-zoomControl').css("display", "");
        //  $('#mp-canvas-zoomControl').css({ top: y, left: x, position: 'absolute' });
    },

    setupMoveControl: function () {
        if ($('body').find('#mp-canvas-moveControl').attr('id') != 'mp-canvas-moveControl') {
            $('<div id="mp-canvas-moveControl" class="olControlMove" style="position: absolute; z-index: 1003;" unselectable="on">   ' +
                '  <div id="mp-canvas-moveVerticalControl" class="olControlMoveVertical"> ' +
                '    <a class="olControlMoveUp olButton" id="mp-canvas-moveup" href="#moveUp">&#708;</a> ' +
                '    <a class="olControlMoveDown olButton" id="mp-canvas-movedown" href="#moveDown">&#709;</a> ' +
                '  </div>' +
                '  <div id="mp-canvas-moveHorizontalControl" class="olControlMoveHorizontal"> ' +
                '    <a class="olControlMoveLeft olButton" id="mp-canvas-moveleft" href="#moveLeft">&#706;</a> ' +
                '    <a class="olControlMoveRight olButton" id="mp-canvas-moveright" href="#moveRight">&#707;</a> ' +
                '  </div>' +
                '</div>').appendTo('body');
        }

        var customizer = this;
        $('#mp-canvas-moveup').click(function (e) { customizer.moveSelectionUp(); });
        $('#mp-canvas-movedown').click(function (e) { customizer.moveSelectionDown(); });
        $('#mp-canvas-moveleft').click(function (e) { customizer.moveSelectionLeft(); });
        $('#mp-canvas-moveright').click(function (e) { customizer.moveSelectionRight(); });

        this.setMoveControlPosition();
    },

    setMoveControlPosition: function () {
        // Control position
        var canvasOffset = $("#" + this.canvasID).offset();
        var cx = canvasOffset.left;
        var cy = canvasOffset.top;
        var cw = $("#" + this.canvasID).width();
        var ch = $("#" + this.canvasID).height();

        var zcw = $('#mp-canvas-moveControl').width();
        var zch = $('#mp-canvas-moveControl').height();

        var x = cx + +10;
        var y = cy + ch - zch - 100;

        $('#mp-canvas-moveControl').css({ top: y, left: x, position: 'absolute' });
    },

    setCustomizedMessages: function (messages) {

        var self = this;
        messages.forEach(function (x) {
            self.customizedMessages.push(x);
        });
    },

    // -------------------------------------------------------------
    // Events 
    // -------------------------------------------------------------

    // Selection Changed
    fireSelectionChangedEvent: function (e) {
        for (var i = 0; i < this.selectionChangedListeners.length; ++i) {
            this.selectionChangedListeners[i](e);
        }

        // Check if at last one item is selected
        var designItems = this.design.getSideDesignItems(this.side);
        if (designItems) {
            for (i = 0; i < designItems.length; i++) {
                var item = this.findItemForDesignItem(designItems[i]);

                if (item.data.selected) {
                    this.showAreaItems();
                    break;
                }
            }
        }
    },

    fireDeselectionChangedEvent: function (e) {
        for (var i = 0; i < this.deselectionChangedListeners.length; ++i) {
            this.deselectionChangedListeners[i](e);
        }
    },

    // Item removed
    fireItemRemovedEvent: function (e) {
        for (var i = 0; i < this.itemRemovedListeners.length; ++i) {
            this.itemRemovedListeners[i](e);
        }
    },

    fireDesignItemRemovingEvent: function (e) {
        for (var i = 0; i < this.designItemRemovingListeners.length; ++i) {
            this.designItemRemovingListeners[i](e);
        }
    },

    fireItemChangedEvent: function (e) {
        for (var i = 0; i < this.itemChangedListeners.length; i++) {
            this.itemChangedListeners[i](e);
        }
    },

    fireDesignItemChangedEvent: function (e) {
        for (var i = 0; i < this.designItemChangedListeners.length; i++) {
            this.designItemChangedListeners[i](e);
        }
    },

    fireItemCreatedEvent: function (e) {
        for (var i = 0; i < this.itemCreatedListeners.length; i++) {
            this.itemCreatedListeners[i](e);
        }
    },

    fireImageLoadedEvent: function (e) {
        for (var i = 0; i < this.imageLoadedListeners.length; i++) {
            this.imageLoadedListeners[i](e);
        }
    },

    addSelectionChangedListener: function (listenerFunction) {
        this.selectionChangedListeners.push(listenerFunction);
    },

    addDeselectionListener: function (listenerFunction) {
        this.deselectionChangedListeners.push(listenerFunction);
    },

    addItemRemovedListener: function (listenerFunction) {
        this.itemRemovedListeners.push(listenerFunction);
    },

    addDesignItemRemovingListener: function (listenerFunction) {
        this.designItemRemovingListeners.push(listenerFunction);
    },

    addItemChangedListener: function (listenerFunction) {
        this.itemChangedListeners.push(listenerFunction);
    },

    addItemCreatedListener: function (listenerFunction) {
        this.itemCreatedListeners.push(listenerFunction);
    },

    addImageLoadedListener: function (listenerFunction) {
        this.imageLoadedListeners.push(listenerFunction);
    },

    addDesignItemChangedListener: function (listenerFunction) {
        this.designItemChangedListeners.push(listenerFunction);
    },

    // -------------------------------------------------------------

    getScreenPoint: function (canvasPoint) {
        var point = this.paper.view.projectToView(canvasPoint);
        var offset = $("#" + this.canvasID).offset();
        point.x += offset.left;
        point.y += offset.top;
        return point;
    },

    onMouseWheel: function (event) {
        var itemsBounds = this.getAllItemsBounds();
        var viewBounds = this.paper.project.view.bounds;

        if (this.zooming || itemsBounds == null)
            return;


        /*
        var allInBefore = viewBounds.contains(itemsBounds);

        if (event.deltaY < 0 && this.areAllItemsInView())
            return;
        */

        event.preventDefault();

        var zoomFactor = 1.3;

        var mousePosition = new this.paper.Point(event.offsetX, event.offsetY);
        mousePosition = this.paper.project.view.viewToProject(mousePosition);

        var zoomCenter = mousePosition.subtract(this.paper.view.center);
        var moveFactor = zoomFactor - 1.0;
        if (event.deltaY > 0) {
            if (this.paper.view.zoom < 4) {
                this.paper.view.zoom *= zoomFactor;
                this.paper.view.center = this.paper.view.center.add(zoomCenter.multiply(moveFactor / zoomFactor)); // Fisso al centro
            }
        } else if (event.deltaY < 0) {
            if (itemsBounds.width < viewBounds.width && itemsBounds.height < viewBounds.height)
                return;

            this.paper.view.zoom /= zoomFactor;
            this.paper.view.center = this.paper.view.center.subtract(zoomCenter.multiply(moveFactor));  // Fisso al centro
        }

        this.hitItem = null;
        this.updateSelectionState();
        this.paper.project.view.update();

        // Update alert items
        var items = this.getAllItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (item && item.data && item.data.guid && !item.data.isArea && !item.guide && item.alertItems && item.alertItems.length > 0)
                this.checkAlertItems(item);
        }

        this.checkImagesSizeLimit();

        //viewBounds = paper.project.view.bounds;

        /*
        var allInNow = viewBounds.contains(itemsBounds);
        if (!allInBefore && allInNow)
            this.fitToScreen();
        */

        // this.updateZoomIndicators(); TODO
        //this.activateMagnifiedModel(mousePosition);
    },

    // Converte da coordinate di schermo a coordinate relative al canvas
    windowToCanvas: function (x, y) {
        var bbox = this.canvas.getBoundingClientRect();

        return {
            x: x - bbox.left * ($(this.canvas).width() / bbox.width),
            y: y - bbox.top * ($(this.canvas).height() / bbox.height)
        };
    },

    clearCanvas: function () {
        for (var i = 0; i < this.paper.project.layers.length; i++) {
            var layer = this.paper.project.layers[i];
            layer.removeChildren();

        }

        this.paper.project.view.update();
    },

    // -------------------------------------------------------------
    // Zoom Model
    // -------------------------------------------------------------
    // Returns bounding box of all items.
    getAllItemsBounds: function (itemsList = []) {
        var bounds = null;

        var items = itemsList.length > 0 ? itemsList : this.getAllItems();

        for (var i = 0; i < items.length; i++) {
            if (!items[i].bounds || isNaN(items[i].bounds.width) || isNaN(items[i].bounds.height))
                continue;

            if (bounds == null)
                bounds = items[i].bounds.clone();
            else
                bounds = bounds.unite(items[i].bounds);
        }
        return bounds;
    },

    getAllItems: function (paperProject = this.paper.project, paperMasterGroup = this.masterGroup) {
        var items = [];

        var customizer = this;

        function addChildren(item) {
            if (customizer.isItemGroup(item) && item != paperMasterGroup)
                return;

            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var child = item.children[j];
                    if (!child.guide)
                        items.push(child);
                    addChildren(child);
                }
            }
        }

        for (var i = 0, l = paperProject.layers.length; i < l; i++) {
            var layer = paperProject.layers[i];
            if (!layer.guide)
                addChildren(layer);
        }
        return items;
    },

    zoomIn: function () {
        if (this.paper.view.zoom >= 2) return;

        var zoomFactor = 1.3;
        this.paper.view.zoom *= zoomFactor;

        this.updateZoomIndicators();
        this.updateSelectionState();
        this.clampView();
        this.checkAllAlertItems();
        this.checkImagesSizeLimit();
        this.placeHandleOut();
    },

    zoomOut: function () {
        var itemsBounds = this.getAllItemsBounds();
        var viewBounds = this.paper.project.view.bounds;

        if (itemsBounds.width < viewBounds.width - 100 && itemsBounds.height < viewBounds.height - 100)
            return;

        var zoomFactor = 1.3;
        this.paper.view.zoom /= zoomFactor;

        this.updateZoomIndicators();
        this.updateSelectionState();
        this.clampView();
        this.checkAllAlertItems();
        this.checkImagesSizeLimit();
    },

    setZoom: function (val) {
        this.animatedZoom(this.paper.view.zoom, val / 100, this.paper.view.center, this.paper.view.center, 30);
        this.clampView();
        this.checkAllAlertItems();
        this.checkImagesSizeLimit();
    },

    zoomToBounds: function (bounds, marginPerc, useAnimation, zoomIn) {
        if (!bounds || bounds.width == 0 || bounds.height == 0)
            return;

        var animated = true;
        if (useAnimation === false)
            animated = false;

        var targetBounds = bounds.clone();
        var factor = 1;
        if (marginPerc > 0) {
            factor = 1 + marginPerc / 100;
        }

        targetBounds.width *= factor;
        targetBounds.height *= factor;

        var viewBounds = this.paper.view.bounds;
        if (targetBounds.width > viewBounds.width || targetBounds.height > viewBounds.height || zoomIn) {

            var sx = 1.0;
            var sy = 1.0;
            if (Math.abs(viewBounds.width) > 0.0000001)
                sx = viewBounds.width / targetBounds.width;
            if (Math.abs(viewBounds.height) > 0.0000001)
                sy = viewBounds.height / targetBounds.height;

            var s = Math.min(sx, sy);


            var steps = 15;

            var zoomFrom = this.paper.view.zoom;
            var zoomTo = this.paper.view.zoom * s;

            var deltaZoom = (zoomTo - zoomFrom) / steps;

            var centerFrom = this.paper.view.center;
            var centerTo = bounds.center;

            if (animated)
                this.animatedZoom(zoomFrom, zoomTo, centerFrom, centerTo, steps);
            else {
                this.paper.view.zoom = zoomTo;
                this.paper.view.center = centerTo;
            }

            this.clampView();
            this.checkAllAlertItems();
            this.checkImagesSizeLimit();
        }
    },


    updateRasterLayer: function () {
        var bounds = this.getAllItemsBounds();


        if (this.rasterLayer == null) {
            this.rasterLayer = this.findItemByName("rasterLayer");
        }
        if (!this.rasterLayer) {
            this.rasterLayer = new this.paper.Layer();
            this.rasterLayer.name = "rasterLayer";
            this.rasterLayer.insertAbove(this.paper.project.layers[1]);
            this.rasterLayer.guide = true;
        }
        else {
            this.rasterLayer.removeChildren();
            this.paper.project.view.update();
        }

        var maxSize = Math.max(bounds.width, bounds.height);
        var res = 96;
        if (maxSize > 2000)
            res = 72;

        this.rasterLayer.activate();

        var raster1 = this.paper.project.layers[0].rasterize(res, false);
        var raster2 = this.paper.project.layers[1].rasterize(res, false);

        this.rasterLayer.addChild(raster1);
        this.rasterLayer.addChild(raster2);

    },

    getDesignDataUrl: function () {
        var raster = this.paper.project.layers[1].rasterize(96, false);
        var dataUrl = raster.toDataURL();
        return dataUrl;
    },

    showRasterLayer: function () {
        if (this.rasterLayer == null)
            this.updateRasterLayer();

        for (var i = 0; i < this.paper.project.layers.length; i++) {
            var layer = this.paper.project.layers[i];
            if (layer != this.rasterLayer) {
                layer.visible = false;
            }
        }
        this.rasterLayer.visible = true;

        this.paper.project.view.update();
    },

    hideRasterLayer: function () {
        for (var i = 0; i < this.paper.project.layers.length; i++) {
            var layer = this.paper.project.layers[i];
            if (layer != this.rasterLayer) {
                layer.visible = true;
                layer.activate();
            }
        }
        this.rasterLayer.visible = false;
        this.paper.project.view.update();
    },


    animatedZoom: function (zoomFrom, zoomTo, centerFrom, centerTo, steps) {
        if (this.zooming)
            return;

        this.zooming = true;

        var customizer = this;

        if (steps <= 0)
            return;

        var deltaZoom = (zoomTo - zoomFrom) / steps;

        var vector = centerTo.subtract(centerFrom);
        var deltaCenter = vector.clone();
        deltaCenter = deltaCenter.divide(steps);

        //this.updateRasterLayer();
        //this.showRasterLayer();

        var step = 0;
        var timer = setInterval(function () {

            var dz = step == steps - 1 ? zoomTo - customizer.paper.view.zoom : deltaZoom;
            var dc = step == steps - 1 ? centerTo.subtract(customizer.paper.view.center) : deltaCenter;

            customizer.paper.view.zoom += dz;
            customizer.paper.view.center = customizer.paper.view.center.add(dc);

            customizer.updateZoomIndicators();
            if (step == steps - 1) {
                //customizer.hideRasterLayer();
                //customizer.drawMap();
            }

            step++;
            if (step == steps) {
                clearInterval(timer);
                customizer.zooming = false;
                customizer.checkAllAlertItems();
                customizer.checkImagesSizeLimit();
                customizer.updateSelectionState();
            }
        }, 30);
    },

    fitToScreen: function (useAnimation, zoomIn) {
        var bounds = this.getAllItemsBounds();

        if (bounds)
            this.zoomToBounds(bounds, this.fitToScreenMargin, useAnimation, zoomIn);
    },

    updateZoomIndicators: function () {
    },

    areAllItemsInView: function () {
        var itemsBounds = this.getAllItemsBounds();
        var viewBounds = this.paper.project.view.bounds;

        return viewBounds.contains(itemsBounds);
    },

    // -------------------------------------------------------------
    // Items functions
    // -------------------------------------------------------------
    setElementType: function (elementType) {
        if (elementType == MPlaza.CustomizerElementType.None ||
            elementType == MPlaza.CustomizerElementType.Rectangle ||
            elementType == MPlaza.CustomizerElementType.Oval ||
            elementType == MPlaza.CustomizerElementType.Path ||
            elementType == MPlaza.CustomizerElementType.Free ||
            elementType == MPlaza.CustomizerElementType.Text)
            this.elementType = elementType;
    },

    setSide: function (side, callback) {
        this.removeAllAlertItems();
        this.clearCanvas();
        this.imageItem = null;
        this.side = side;

        var customizer = this;
        this.updateImageItem(function () {

            // Re-create the master group
            customizer.masterGroup = new this.paper.Group();
            customizer.paper.project.layers[1].addChild(customizer.masterGroup);

            customizer.updateAreaItems();
            customizer.updateDesignItemsCanvasItems();

            if (callback) {
                callback();
            }
        });
    },

    getCurrentModel: function () {
        /*
        if (this.side && this.side instanceof MPlaza.Side) {
            var color = this.side.getParentModel();
            if (color && color instanceof MPlaza.Color) {
                var model = color.getParentModel();
                if (model && model instanceof MPlaza.Model) {
                    return model;
                }
            }
        }
        return null;*/

        return this.model;
    },

    refresh: function () {
        //this.clearCanvas();
        var customizer = this;
        this.updateImageItem(function () {
            customizer.updateAreaItems();
            customizer.updateDesignItemsCanvasItems();
        });
    },

    setDesign: function (design) {
        this.deselectAll();

        // todo
        this.clearDesignItemsCanvasItems();

        this.design = design;
        //Since this will be called in the setSide too, it is better to do this there to avoid problems like images loading before areas (this will make the blue mask always visible even if an item is completely in an area)
        //this.updateDesignItemsCanvasItems();

        this.checkAllAlertItems();
        this.checkImagesSizeLimit();

        var customizer = this;
        if (this.isViewer) {
            //this.design.addEventListener("change", function () { customizer.refreshDesign(); })
        }
    },

    refreshDesign: function () {
        this.updateDesignItemsCanvasItems();
    },

    setupImageLayer: function () {
        if (!this.imageLayer) {

            // Creo layer inferiore (dello sfondo)
            this.imageLayer = new this.paper.Layer();
            this.imageLayer.sendToBack();

            // Creo layer superiore (delle immagini e testo)
            var defaultLayer = new this.paper.Layer();
            defaultLayer.bringToFront();
            defaultLayer.activate();
        }
    },

    // Aggiorna l'immagine di sfondo del modello
    // Nel caso in cui debba essere applicato un colore di sfondo, utilizza CamanJS
    // per la sovrapposizione del colore (very cool)
    updateImageItem: function (callback) {
        //if (this.imageItem)
        //    this.imageItem.remove();
        if (!this.showSideImage || !this.side || !this.side.get("imageUrl")) {
            if (this.imageItem)
                this.imageItem.remove();

            this.fitToScreen(false, true);

            if (callback)
                callback();
            return;
        }

        var designSide = null;
        if (this.design) {
            designSide = this.design.getDesignSide(this.side);
        }

        var customizer = this;
        var replaceImageItem = function (newImageItem) {

            if (customizer.imageItem)
                customizer.imageItem.remove();

            customizer.imageItem = newImageItem;
            //customizer.imageItem.sendToBack();
            // Assegno la nuova immagine al layer di sfondo
            newImageItem.visible = false;
            customizer.imageLayer.addChild(newImageItem);
            customizer.paper.project.view.update();

            setTimeout(function () {
                customizer.fitToScreen(false, true);
                newImageItem.visible = true;
            }, 1);
        };

        if (!this.side.get("colorable") || !designSide || !designSide.get("fillColor")) {

            if (!customizer.imageLayer) {

                // Creo layer inferiore (dello sfondo)
                customizer.imageLayer = new customizer.paper.Layer();
                customizer.imageLayer.sendToBack();

                // Creo layer superiore (delle immagini e testo)
                var defaultLayer = new customizer.paper.Layer();
                defaultLayer.bringToFront();
                defaultLayer.activate();
            }

            // Non bisogna sovrapporre un colore all'immagine
            var newImageItem = new this.paper.Raster({
                crossOrigin: "anonymous",
                source: this.side.get("imageUrl"),
                position: new this.paper.Point(0, 0)
            });

            newImageItem.onLoad = function () {

                replaceImageItem(newImageItem);

                if (callback)
                    callback();
                return;
            };
        } else {
            // Ricoloro l'immagine
            var fillColor = '#' + designSide.get("fillColor");

            // Creo un canvas offscreen delle dimensioni dell'immagine
            var offscreenCanvasID = "customizerOffscreen";
            var offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.setAttribute("id", offscreenCanvasID);
            var offscreenContext = offscreenCanvas.getContext('2d');

            offscreenCanvas.width = customizer.imageWidth;
            offscreenCanvas.height = customizer.imageHeight;

            if (this.domElement)
                this.domElement.appendChild(offscreenCanvas);

            // Utilizzo CamanJS per sovrapporre il colore di sfondo all'immagine
            Caman("#" + offscreenCanvasID, this.side.get("imageUrl"), function () {

                this.newLayer(function () {
                    this.setBlendingMode("multiply");
                    this.opacity(100);
                    this.fillColor(fillColor);
                });

                this.render(function () {
                    // Costruisco l'immagine copiando i bit dal canvas offscreen
                    var imageData = offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);

                    var newImageItem = new customizer.paper.Raster({
                        position: customizer.paper.view.center
                    });
                    newImageItem.setSize(new customizer.paper.Size(customizer.imageWidth, customizer.imageHeight));
                    newImageItem.setImageData(imageData, new customizer.paper.Point(0, 0));

                    replaceImageItem(newImageItem);

                    if (customizer.domElement)
                        customizer.domElement.removeChild(offscreenCanvas);

                    if (callback)
                        callback();
                    return;
                });
            });

        }
    },

    updateAreaItems: function () {
        if (this.side && this.side instanceof MPlaza.Side) {
            var areas = this.side.get("areas");
            if (areas) {
                for (var i = 0; i < areas.length; i++) {
                    var area = areas.at(i);
                    this.createItemForArea(area);
                }

                var paths = [];
                var pathsToRemove = [];

                // Find all paths
                for (i = 0; i < areas.length; i++) {
                    var area = areas.at(i);
                    var path = this.paper.project.activeLayer.importJSON(area.get("path"));

                    if (path instanceof this.paper.CompoundPath) {
                        for (var j = 0; j < path.children.length; j++) {
                            paths.push(path.children[j]);

                            // TODO: Check multi level nested areas / compunds
                        }

                        // Remove parent compund path
                        pathsToRemove.push(path);
                    } else
                        paths.push(path);

                }

                // Set them as not selected and remove any guid reference
                paths.forEach(function (path) {
                    path.data = undefined;
                });

                // Create the final compound path
                var clip = new this.paper.CompoundPath({
                    children: paths
                });
                clip.isClippingArea = true;
                clip.data = undefined;

                this.masterGroup.addChild(clip);

                // Must be after addChild
                clip.sendToBack();
                clip.fillRule = "nonzero";
                clip.clipMask = true;
                clip.reorient(false, true);

                pathsToRemove.forEach(function (path) {
                    path.remove();
                });
            }
        }


        this.deselectAll();
        this.paper.project.view.update();
    },

    createItemForArea: function (area) {
        if (area && area instanceof MPlaza.Area) {
            var item = this.findItemForArea(area);
            if (item)
                item.remove();

            item = this.paper.project.activeLayer.importJSON(area.get("path"));
            item.data.guid = area.get("guid");
            item.data.isArea = true;
            item.data.selected = true;

            if (this.isViewer)
                item.visible = false;

            this.masterGroup.addChild(item);

            this.updateAreaItemColor(item);
        }


    },

    hideAreaItems: function () {

        // If there is no side image, don't hide the areas
        if (!this.showSideImage)
            return;

        var areas = this.getAllAreaItems();
        for (var i = 0; i < areas.length; i++) {
            var area = areas[i];
            area.visible = false;
        }
        this.updateSelectionState();
        this.paper.project.view.update();
    },

    showAreaItems: function () {
        var areas = this.getAllAreaItems();
        for (var i = 0; i < areas.length; i++) {
            var area = areas[i];
            area.visible = true;
        }

        this.updateSelectionState();
        this.paper.project.view.update();
    },

    adaptZoomToSideAreas: function () {
        var bounds = null;

        this.side.get("areas").forEach(area => {
            var areaItem = this.findItemForArea(area);

            if (areaItem) {
                if (!bounds)
                    bounds = areaItem.bounds.clone();
                else
                    bounds = bounds.unite(areaItem.bounds);
            }
        });

        this.zoomToBounds(bounds, 10, true, true);

        this.updateSelectionState();
        this.paper.project.view.update();
    },

    updateAreaItemsColor: function () {
        var items = this.getAllAreaItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            this.updateAreaItemColor(item);
        }
        this.paper.project.view.update();
    },

    updateAreaItemColor: function (item) {
        if (item && item.bounds) {
            item.strokeColor = this.getContrastedColor(item.bounds);
        }
    },

    getAllAreaItems: function () {
        var items = [];

        function addChildren(item) {
            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var child = item.children[j];
                    if (!child.guide && child.data && child.data.guid && child.data.isArea)
                        items.push(child);
                    addChildren(child);
                }
            }
        }

        for (var i = 0, l = this.paper.project.layers.length; i < l; i++) {
            var layer = this.paper.project.layers[i];
            if (!layer.guide)
                addChildren(layer);
        }

        return items;
    },

    getAreasIntersectingItem: function (item) {
        var areas = [];

        if (item && item.data && item.data.guid && !item.data.isArea &&
            this.side && this.side instanceof MPlaza.Side && this.side.get("areas")) {

            var tempItem = item;
            if (item.realBounds)
                tempItem = new this.paper.Path.Rectangle(item.realBounds);

            for (var i = 0; i < this.side.get("areas").length; i++) {
                var area = this.side.get("areas").at(i);
                var areaItem = this.findItemForArea(area);
                if (areaItem) {
                    if (tempItem.intersects(areaItem)) {
                        areas.push(area);
                    }
                }
            }

            if (item.realBounds)
                tempItem.remove();
        }
        return areas;
    },

    getAreasContainingItem: function (item) {
        var areas = [];
        if (item && item.data && item.data.guid && !item.data.isArea &&
            this.side && this.side instanceof MPlaza.Side && this.side.get("areas")) {

            var tempItem = item;
            if (item.realBounds)
                tempItem = new this.paper.Path.Rectangle(item.realBounds);

            for (var i = 0; i < this.side.get("areas").length; i++) {
                var area = this.side.get("areas").at(i);
                var areaItem = this.findItemForArea(area);

                if (areaItem) {
                    if (!tempItem.intersects(areaItem) &&
                        areaItem.bounds.contains(tempItem.bounds) &&
                        areaItem.contains(tempItem.position)) {

                        areas.push(area);
                    }
                }
            }

            if (item.realBounds)
                tempItem.remove();
        }
        return areas;
    },

    getAreasIntersectingOrContainingItem: function (item) {
        var areas = [];
        if (item && item.data && item.data.guid && !item.data.isArea &&
            this.side && this.side instanceof MPlaza.Side && this.side.get("areas")) {

            var tempItem = item;
            if (item.realBounds)
                tempItem = new this.paper.Path.Rectangle(item.realBounds);

            for (var i = 0; i < this.side.get("areas").length; i++) {
                var area = this.side.get("areas").at(i);
                var areaItem = this.findItemForArea(area);

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
    },

    getItemArea: function (item) {

        var area = null;
        var areas = this.getAreasIntersectingOrContainingItem(item);
        if (areas.length > 1 || areas.length == 0)
            return null;

        return areas[0];
    },

    clearDesignItemsCanvasItems: function () {

        var _this = this;

        function removeChildren(item) {
            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var child = item.children[j];

                    removeChildren(child);

                    _this.removeAlertItems(child);

                    if (child.data && child.data.maskPath)
                        child.data.maskPath.remove();

                    if (child.data && child.data.maskAlertPath)
                        child.data.maskAlertPath.remove();

                    if (!child.guide && child.data && child.data.guid && !child.data.isArea)
                        child.remove();
                }
            }
        }

        for (var i = 0, l = this.paper.project.layers.length; i < l; i++) {
            var layer = this.paper.project.layers[i];
            if (!layer.guide)
                removeChildren(layer);
        }
    },

    updateDesignItemsCanvasItems: function () {
        this.clearDesignItemsCanvasItems();
        if (this.side && this.side instanceof MPlaza.Side &&
            this.design && this.design instanceof MPlaza.Design) {

            var designItems = this.design.getSideDesignItems(this.side);

            if (designItems) {
                for (i = 0; i < designItems.length; i++) {
                    var designItem = designItems[i];
                    var item = this.createItemForDesignItem(designItem);

                    if (item) {
                        item.data.selected = false;
                    }
                }
            }
        }

        this.deselectAll();
        this.paper.project.view.update();
    },

    createItemForDesignItem: function (designItem) {
        var that = this;
        if (designItem && designItem instanceof MPlaza.DesignItem) {
            var item = this.findItemForDesignItem(designItem);
            if (item)
                item.remove();

            item = this.paper.project.activeLayer.importJSON(designItem.get("json"));
            item.data.guid = designItem.get("itemGuid");

            // Image Original Bounds & Matrix
            if (item instanceof this.paper.Raster && !(item.data && item.data.originalBounds && item.data.originalMatrix)) {
                item.data.originalBounds = new this.paper.Rectangle(0, 0, item.width, item.height);
                item.data.originalMatrix = item.matrix.clone();
            }
            // --------------------------------

            // Create the mask rectangle, wait to load for rasters
            if (item instanceof this.paper.Raster) {
                item.onLoad = function () {
                    that.paper.project.view.update();
                    that.createMaskForItem(item);
                    that.fireItemCreatedEvent(item);
                    that.fireImageLoadedEvent(item);
                };
            } else {
                this.createMaskForItem(item);
                this.fireItemCreatedEvent(item);
            }

            this.masterGroup.addChild(item);
            return item;
        }

        return null;
    },

    findAreaByGuid: function (guid) {
        if (this.side && this.side instanceof MPlaza.Side && this.side.get("areas")) {
            return this.side.get("areas").getArea(guid);
        }
        return null;
    },

    findItemByGuid: function (guid, paperScope = null) {
        paperScope = paperScope || this.paper;
        var upperGuid = guid.toUpperCase();

        var findChildByGuid = function (parent, guid) {
            if (parent.data.guid && parent.data.guid.toUpperCase() == guid) {
                return parent;
            }
            if (parent.children) {
                for (var j = parent.children.length - 1; j >= 0; j--) {
                    var child = parent.children[j];
                    var item = findChildByGuid(child, guid);
                    if (item) {
                        return item;
                    }
                }
            }
        };

        for (var i = 0; i < paperScope.project.layers.length; i++) {
            var layer = paperScope.project.layers[i];
            if (layer.guide) continue;
            var item = findChildByGuid(layer, upperGuid);
            if (item) {
                return item;
            }
        }

        return null;
    },

    findItemForArea: function (area) {
        if (area && area instanceof MPlaza.Area) {
            return this.findItemByGuid(area.get("guid"));
        }
        return null;
    },

    findDesignItemByGuid: function (guid) {
        var di = null;
        if (this.design) {
            di = this.design.get("designItems").getDesignItemByGuid(guid);
        }
        return di;
    },

    findDesignItemForItem: function (item) {
        if (item && item.data && item.data.guid) {
            return this.findDesignItemByGuid(item.data.guid);
        }
        return null;
    },

    findItemForDesignItem: function (designItem) {
        var item = null;
        if (designItem && designItem instanceof MPlaza.DesignItem) {
            return this.findItemByGuid(designItem.get("itemGuid"));
        }
    },

    snapDeltaToAngle: function (delta, snapAngle) {
        var snap = (180 / Math.PI) * snapAngle;
        var angle = delta.angle;
        angle = Math.round(angle / snap) * snap;
        var newDelta = delta.clone();
        newDelta.angle = angle;
        return newDelta;
    },

    onItemsCreated: function (items) {
        for (var i = 0; i < items.length; i++) {
            this.onItemCreated(items[i], null);
        }
    },

    onItemCreated: function (item, image) {
        var designItem = this.createDesignItem(item, image);
        this.updateAlwaysOnTopItemsIndexes();
        this.checkAlertItems(item);
        this.checkImagesSizeLimit();

        return designItem;
    },

    onItemsUpdated: function (items) {
        for (var i = 0; i < items.length; i++) {
            this.onItemUpdated(items[i]);
        }
    },

    onItemUpdated: function (item) {
        var realBounds = this.getItemRealBounds(item);
        item.realBounds = realBounds;

        this.updateDesignItem(item);
        this.checkAlertItems(item);
        this.checkImagesSizeLimit();
        this.fireItemChangedEvent(item);
        this.updateTransformsData(item);

        // Test real bounds
        //this.drawRealBounds(item);
    },

    onDesignItemChanged: function (item) {
        var designItem = this.findDesignItemForItem(item);
        if (designItem) {
            this.fireDesignItemChangedEvent(designItem);
        }
    },

    onItemsRemoved: function (items) {
        for (var i = 0; i < items.length; i++) {
            this.onItemRemoved(items[i]);
        }
    },

    onItemRemoved: function (item) {
        this.removeAlertItems(item);
        this.checkImagesSizeLimit();
        this.removeTextOnPathGuide(item);
        this.removeTextOnPathHandles(item);
        this.removeTextAreaGuide(item);
        this.removeTextAreaHandles(item);
        this.removeDesignItem(item);

        //Check if design item has been correctly removed
        if (this.findDesignItemByGuid(item.data.guid)) {
            console.trace("Item removed, but the design item is still present.", item, this.findDesignItemByGuid(item.data.guid));
            throw "There was an error during item deletion";
        }

        this.fireItemRemovedEvent(item);

        // Remove mask path MUST BE AFTER EVENT FIRE or item selection will re-add it!!
        if (item.data.maskPath)
            item.data.maskPath.remove();

        // Remove mask alert path
        if (item.data.maskAlertPath)
            item.data.maskAlertPath.remove();
    },

    createDesignItem: function (item, image) {
        if (item && !item.guide) {
            var designItem = null;
            if (item.data.guid) {
                designItem = this.findDesignItemByGuid(item.data.guid);
            }

            if (designItem == null) {
                designItem = new MPlaza.DesignItem();
                item.data.guid = designItem.get("itemGuid");
                this.design.get("designItems").add(designItem);
            }

            if (designItem != null) {
                designItem.set("index", item.index);
                designItem.set("json", item.exportJSON({ asString: true }));
                designItem.set("svg", item.exportSVG({ asString: true, embedImages: false }));

                if (image && image instanceof MPlaza.Image) {
                    designItem.set("imageID", image.get("imageID"));
                    designItem.set("imageType", image.get("type"));
                    designItem.set("imageFormat", image.get("format"));
                    designItem.set("imageWidth", image.get("width"));
                    designItem.set("imageHeight", image.get("height"));
                    designItem.set("imageDpiX", image.get("dpiX"));
                    designItem.set("imageDpiY", image.get("dpiY"));
                    designItem.set("imageUserID", image.get("userID"));
                    designItem.set("imageVisitorID", image.get("visitorID"));
                    designItem.set("imagePrice", image.get("price"));
                    designItem.set("imageIsMulticolor", image.get("isMulticolor"));
                    designItem.set("imagePreferredWidth", image.get("preferredWidth"));
                    designItem.set("imagePreferredHeight", image.get("preferredHeight"));
                    designItem.set("imageFileSize", image.get("imageFileSize"));

                    // salvo l'array di colori distinti (nel caso di immagine vettoriale)
                    if (image.get("type") == "Vector" &&
                        image.get("colors") && image.get("colors").length > 0) {
                        for (var i = 0; i < image.get("colors").length; i++) {
                            designItem.get("itemColors").push(image.get("colors").at(i).get("code"));
                        }
                    }
                }
                else {
                    this.updateDesignItemDistinctColors(designItem, item);
                }

                var areas = this.getAreasIntersectingOrContainingItem(item);
                designItem.updateAreas(areas);
            }

            return designItem;
        }

        return null;
    },

    updateTransformsData: function (item) {
        if (item && item.data && (item.data.guid || item.data.isTextOnPath || item.data.isTextArea) && !item.data.isArea) {
            let originalDimensions = null;

            if (!item.data.transformsData || !item.data.transformsData.dimensions || item.data.needsTransformsDataUpdate) {
                var clone = item.clone();
                clone.visible = false;
                clone.rotate(0 - clone.rotation);

                var rect = new this.paper.Path.Rectangle(clone.bounds);
                rect.visible = false;

                originalDimensions = {
                    width: rect.bounds.width,
                    height: rect.bounds.height
                };

                rect.remove();
                clone.remove();
            }
            else {
                originalDimensions = item.data.transformsData.dimensions;
            }

            item.data.transformsData = {
                position: {
                    x: item.position.x,
                    y: item.position.y
                },
                rotation: item.rotation,
                dimensions: originalDimensions
            }
        }
    },

    updateDesignItem: function (item) {

        if (item && item.data && item.data.guid && !item.data.isArea) {
            var designItem = this.findDesignItemByGuid(item.data.guid);
            if (designItem) {
                designItem.set("index", item.index);
                designItem.set("json", item.exportJSON({ asString: true }));

                if (item instanceof this.paper.Raster) {
                    designItem.set("svg", item.exportSVG({ asString: true, embedImages: false }));
                    //designItem.set("svg", item.exportSVG({ asString: true }));
                }
                else
                    designItem.set("svg", item.exportSVG({ asString: true }));

                // Test
                //Logger.info("** json **");
                //Logger.info(designItem.get("json"));

                //Logger.info("");

                //Logger.info("** svg **");
                //Logger.info(designItem.get("svg"));

                var areas = this.getAreasIntersectingOrContainingItem(item);
                designItem.updateAreas(areas);

                // We must update the correct indexes of other items
                var sideDesignItems = this.design.getSideDesignItems(this.side);
                for (var i = 0; i < sideDesignItems.length; i++) {
                    var sideDesignItem = sideDesignItems[i];
                    var sideItem = this.findItemForDesignItem(sideDesignItem);

                    if (sideItem)
                        sideDesignItem.set("index", sideItem.index);
                }

                // Se non si tratta di un'immagine aggiorn i colori
                // Nel caso di immagine, l'aggiornamento dei colori avviene solo 
                // nel cambio colori
                if (!(item instanceof this.paper.Raster)) {
                    this.updateDesignItemDistinctColors(designItem, item);
                }
            }
        }
    },

    updateDesignItemDistinctColors: function (designItem, item) {
        var codes = [];

        if (!(item instanceof this.paper.Raster)) {

            var child = item;
            if (item.data.isTextOnPath || item.data.isTextArea) {
                child = null;
                if (item.children.length > 0) {
                    child = item.children[0];
                }
            }
            if (child) {
                var strokeColor = null;
                if (child.strokeWidth > 0 && child.strokeColor) {
                    strokeColor = child.strokeColor.toCSS(true);
                    codes.push(strokeColor);
                }

                if (child.fillColor && (!strokeColor || child.fillColor != strokeColor))
                    codes.push(child.fillColor.toCSS(true));
            }
        }

        this.updateDesignItemColors(designItem, codes);
    },

    updateDesignItemColors: function (designItem, codes) {
        // svuoto l'array attuale
        while (designItem.get("itemColors").length > 0) {
            designItem.get("itemColors").pop();
        }

        for (code of codes) {
            designItem.get("itemColors").push(code);
        }
    },

    // Aggiorna il designItem nel caso di sostituzione dell'immagine
    // per un item paper.js
    updateImageDesignItem: function (item, designItem, image) {
        if (!this.canEditItem(item))
            return;

        if (item && !item.guide && item instanceof this.paper.Raster &&
            designItem && designItem instanceof MPlaza.DesignItem &&
            image && image instanceof MPlaza.Image) {

            designItem.set("json", item.exportJSON({ asString: true }));
            designItem.set("svg", item.exportSVG({ asString: true, embedImages: false }));

            designItem.set("imageID", image.get("imageID"));
            designItem.set("imageType", image.get("type"));
            designItem.set("imageFormat", image.get("format"));
            designItem.set("imageWidth", image.get("width"));
            designItem.set("imageHeight", image.get("height"));
            designItem.set("imageDpiX", image.get("dpiX"));
            designItem.set("imageDpiY", image.get("dpiY"));
            designItem.set("imageUserID", image.get("userID"));
            designItem.set("imageVisitorID", image.get("visitorID"));
            designItem.set("imagePrice", image.get("price"));
            designItem.set("imageIsMulticolor", image.get("isMulticolor"));
            designItem.set("imagePreferredWidth", image.get("preferredWidth"));
            designItem.set("imagePreferredHeight", image.get("preferredHeight"));
            designItem.set("imageFileSize", image.get("imageFileSize"));
            designItem.set("isChanged", true);

            // salvo l'array di colori distinti (nel caso di immagine vettoriale)
            while (designItem.get("itemColors").length > 0)
                designItem.get("itemColors").pop();
            if (image.get("type") == "Vector" &&
                image.get("colors") && image.get("colors").length > 0) {
                for (var i = 0; i < image.get("colors").length; i++) {
                    designItem.get("itemColors").push(image.get("colors").at(i).get("code"));
                }
            }

            var areas = this.getAreasIntersectingOrContainingItem(item);
            designItem.updateAreas(areas);
        }
    },

    removeDesignItem: function (item) {
        if (item && item.data && item.data.guid && !item.data.isArea) {
            var designItem = this.findDesignItemByGuid(item.data.guid);
            if (designItem) {
                this.design.get("designItems").remove(designItem);
            }
        }
    },

    checkImagesSizeLimit: function (profileLimit) {
        if (profileLimit == undefined || isNaN(profileLimit) || profileLimit <= 0)
            profileLimit = this.areasSizeLimit;
        else
            this.areasSizeLimit = profileLimit;

        this.removeSizeLimitAlert();

        if (this.side == null)
            return;

        var sides = this.side.collection.models;
        var images = this.getAllImageItems();

        if (!sides || !images)
            return;

        this.side.get("areas").forEach(area => {
            var index = this.areasSizeCountCollection.findIndex(x => x.sideID == this.side.get("sideID") && x.areaID == area.get("areaID"));

            if (index == -1)
                this.areasSizeCountCollection.push({ sideID: this.side.get("sideID"), areaID: area.get("areaID"), sizeCount: 0 });
            else if (this.areasSizeCountCollection[index].sideID == this.side.get("sideID"))
                this.areasSizeCountCollection[index].sizeCount = 0;
        });

        images.forEach(image => {
            var designImage = this.findDesignItemForItem(image);

            if (!designImage)
                return;

            this.getAreasIntersectingOrContainingItem(image).forEach(area => {
                var index = this.areasSizeCountCollection.findIndex(x => x.sideID == this.side.get("sideID") && x.areaID == area.get("areaID"));
                this.areasSizeCountCollection[index].sizeCount += designImage.get("imageFileSize");
            })
        });

        this.areasSizeCountCollection.filter(x => x.sideID == this.side.get("sideID")).forEach(x => {

            var self = this;

            var area = this.side.get("areas").models.forEach(area => {
                if (area.get("areaID") == x.areaID && x.sizeCount > profileLimit) {
                    //Create icon

                    var point = new this.paper.Point(area.get("boundsX") + (area.get("boundsWidth") / 2), area.get("boundsY") + area.get("boundsHeight") + 20);

                    var icon = this.createAlertIcon(point, true);
                    icon.data.isAlertItem = true;

                    // Create tooltip
                    var message = StringHelper.format(T._("Total size of uploaded pictures must be less than {0} MB per each print-area", "Customizer"), ((parseInt(profileLimit) / 1024 / 1024).toFixed(2)));
                    var customizedMessage = self.customizedMessages.find(
                        function (x) {
                            return x.EventID == MPlaza.EventMessages.UploadLimit;
                        }
                    );

                    if (customizedMessage) {
                        message = StringHelper.format(customizedMessage.Description);
                        if (customizedMessage.Visible === false)
                            return;
                    }

                    var html = $('<div class="areaAlertTooltip alert-bubble">' +
                        '	<div class="alert-bubble-content"><span class="alertTitle">' + T._("Warning!", "Customizer") + '</span></div>' +
                        '	<div class="alert-bubble-content"><span class="alertMessage">' + message + '</span></div>' +
                        '</div>');

                    if (customizedMessage && customizedMessage.Closeable === true) {
                        html.append('<i class="material-icons">close</i>');

                        html.on('click', 'i', { item: item }, function (e) {
                            that.removeAlertItems(e.data.item);
                        });
                    }

                    html.appendTo("body");

                    var tooltipPosition = this.getScreenPoint(point.add(0, 30 / this.paper.view.zoom));
                    html.css({ left: (tooltipPosition.x - 100) + "px", top: tooltipPosition.y + "px" });

                    this.areaAlertItems.push({ icon: icon, tooltip: html });
                }
            });
        });
    },

    removeSizeLimitAlert: function () {
        this.areaAlertItems.forEach(group => {
            group.icon.remove();
            group.tooltip.remove();
        });
        this.areaAlertItems = [];
    },

    checkAlertItems: function (item) {
        if (!item || !this.isItemPrintable(item))
            return;

        this.removeAlertItems(item);

        if (this.isViewer)
            return;

        var message = null;
        var that = this;

        //var intersectingAreas = this.getAreasIntersectingItem(item);
        //var containingAreas = this.getAreasContainingItem(item);
        //if (intersectingAreas.length > 0 || containingAreas.length == 0) {
        //    message = T._("The element extends beyond the print area.", "Customizer");
        //}

        var areas = this.getAreasIntersectingOrContainingItem(item);
        for (var i = 0; i < areas.length; i++) {
            var area = areas[i];
            if (!this.checkItemQualityForArea(item, area)) {
                if (message)
                    message += " ";

                // Params
                var designItem = this.findDesignItemForItem(item);
                var ppcm = this.side.get("ppcm");
                var selectedPrintType = this.getSelectedPrintType();

                if (!selectedPrintType)
                    selectedPrintType = this.getModelPrintType(this.design.getSelectedPrintTypeForArea());

                var dpi = selectedPrintType.get("dpi");

                // Actual values
                var cmWidth = item.bounds.width / ppcm; // Item width in CM
                var cmHeight = item.bounds.height / ppcm; // Item height in CM

                // Required values
                var requiredWidth = cmWidth / 2.54 * dpi;
                var requiredHeight = cmHeight / 2.54 * dpi;

                // Create tooltip
                var message = StringHelper.format(T._("We strongly suggest file with a higher resolution to get better results.<br/>(at least {0} x {1} pixels)", "Customizer"), requiredWidth.toFixed(0), requiredHeight.toFixed(0));
                var customizedMessage = that.customizedMessages.find(
                    function (x) {
                        return x.EventID == MPlaza.EventMessages.DPIWarning;
                    }
                );

                if (customizedMessage) {
                    message = StringHelper.format(customizedMessage.Description, requiredWidth.toFixed(0), requiredHeight.toFixed(0));
                    if (customizedMessage.Visible === false)
                        return;
                }

                break;
            }
        }

        if (message) {
            if (!item.hasOwnProperty("alertItems"))
                item.alertItems = [];

            var clone = item.clone();
            var matrix = item.matrix.clone();
            clone.visible = false;

            var rect = new this.paper.Path.Rectangle(clone.bounds);
            rect.visible = false;

            var segments = rect.segments;
            if (segments.length == 4) {
                var bottomLeft = segments[0].point;
                var topLeft = segments[1].point;
                var topRight = segments[2].point;
                var bottomRight = segments[3].point;

                // Calculate height
                var top = Math.min(bottomLeft.y, topLeft.y, topRight.y, bottomRight.y);
                var bottom = Math.max(bottomLeft.y, topLeft.y, topRight.y, bottomRight.y);
                var height = bottom - top;
                var point = clone.position.add(0, height / 2).add(0, 20 / this.paper.view.zoom);
                var isReverse = false;
                var isHorizontallyReverse = false;

                // Create tooltip
                var html = $('<div class="itemAlertTooltip alert-bubble">' +
                    '	<div class="alert-bubble-content"><span class="alertTitle">' + T._("Warning!", "Customizer") + '</span></div>' +
                    '	<div class="alert-bubble-content"><span class="alertMessage">' + message + '</span></div>' +
                    '</div>');

                if (customizedMessage && customizedMessage.Closeable === true) {
                    html.append('<i class="material-icons">close</i>');

                    html.on('click', 'i', { item: item }, function (e) {
                        that.removeAlertItems(e.data.item);
                    });
                }

                html.appendTo("body");
                let rect = that.canvas.getBoundingClientRect();

                //First check if the alert icon is out of the canvas
                if (that.getScreenPoint(point).y > rect.left + rect.height)
                    isReverse = true;
                if (that.getScreenPoint(point).x > rect.left + rect.width)
                    isHorizontallyReverse = true;

                var tooltipPosition = that.getScreenPoint(point.add(0, 30 / that.paper.view.zoom));
                var tooltipHeight = html.outerHeight() + 10;
                var tooltipWidth = html.outerWidth();

                //Then check if the tooltip is out too. If yes move it to avoid Safari problems
                if (isReverse || ((tooltipPosition.y + tooltipHeight) > (rect.top + rect.height - (this.isMobile ? 54 : 0)))) {
                    isReverse = true;
                    point = clone.position.subtract(0, height / 2).subtract(0, 20 / this.paper.view.zoom);
                    tooltipPosition = that.getScreenPoint(point.subtract(0, 30 / that.paper.view.zoom));
                    tooltipPosition.y -= tooltipHeight;

                    //In mobile keep track of the toolbar too
                    tooltipPosition.y = Math.min((that.canvas.offsetHeight - tooltipHeight - (this.isMobile ? 54 : 0)), tooltipPosition.y);

                    html.addClass("reverse");
                }
                else {
                    html.removeClass("reverse");
                }

                tooltipPosition.x = tooltipPosition.x - (html.outerWidth() / 2);


                if (isHorizontallyReverse || ((tooltipPosition.x + tooltipWidth) > (rect.left + rect.width + (this.isMobile ? 0 : 50)))) {
                    isHorizontallyReverse = true;

                    //Keep track of the right arrow that now appears and the left border in desktop
                    tooltipPosition.x = that.canvas.offsetWidth - tooltipWidth - 10 + (this.isMobile ? 0 : 50);

                    html.addClass("horizontallyReverse");
                }
                else {
                    html.removeClass("horizontallyReverse");
                }

                html.css({ left: tooltipPosition.x + "px", top: tooltipPosition.y + "px" });

                var icon = this.createAlertIcon(point);
                //icon.guide = true;
                icon.data.isAlertItem = true;

                item.alertItems.push(icon);
                item.alertItems.push(html);
            }

            rect.remove();
            clone.remove();
        }
    },

    checkAllAlertItems: function () {
        // Update alert items
        var items = this.getAllItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (item && item.data && item.data.guid && !item.data.isArea && !item.guide && item.alertItems && item.alertItems.length > 0)
                this.checkAlertItems(item);
        }
    },

    // just for debug
    drawRealBounds: function (item) {

        if (this.realRect)
            this.realRect.remove();

        if (item instanceof this.paper.Raster) {
            var bounds = this.getItemRealBounds(item);
            this.realRect = new this.paper.Path.Rectangle(bounds);
            this.realRect.strokeColor = "red";
            this.realRect.strokeWidth = 1;
        }
    },

    getItemRealBounds: function (item) {

        if (!(item instanceof this.paper.Raster))
            return item.bounds;

        var bounds = item.bounds;

        var rasterized = item.rasterize(72); // Capire come impostare la giusta risoluzione
        // anche per gli smartphone

        try {

            var x0 = rasterized.position.x - rasterized.width / 2;
            var y0 = rasterized.position.y - rasterized.height / 2;

            var w = rasterized.width;
            var h = rasterized.height;

            var idata = rasterized.getImageData(),
                buffer = idata.data,
                buffer32 = new Uint32Array(buffer.buffer),
                x, y,
                x1 = w, y1 = h, x2 = 0, y2 = 0;

            for (y = 0; y < h; y++) {
                // get left edge
                for (x = 0; x < w; x++) {
                    if (buffer32[x + y * w] > 0) {
                        if (x < x1) x1 = x;
                    }
                }

                // get right edge
                for (x = w; x >= 0; x--) {
                    if (buffer32[x + y * w] > 0) {
                        if (x > x2) x2 = x;
                    }
                }
            }


            for (x = 0; x < w; x++) {
                // get top edge
                for (y = 0; y < h; y++) {
                    if (buffer32[x + y * w] > 0) {
                        if (y < y1) y1 = y;
                    }
                }

                // get bottom edge
                for (y = h; y >= 0; y--) {
                    if (buffer32[x + y * w] > 0) {
                        if (y > y2) y2 = y;
                    }
                }
            }

            bounds = new this.paper.Rectangle(x0 + x1, y0 + y1, x2 - x1, y2 - y1);

        } catch (e) {
            Logger.info(e.message);
        }
        finally {
            rasterized.remove();
        }

        return bounds;
    },


    createAlertIcon: function (point, isDark) {
        if (!point)
            return null;

        isDark = isDark || false;

        var s = 25 / this.paper.view.zoom;
        //var s = 20;
        var bytes = isDark ? this.iconsBytes["itemAlertDark"] : this.iconsBytes["itemAlert"];
        var url = 'data:image/png;base64,' + bytes;

        var icon = new this.paper.Raster({
            source: url,
            position: point
        });

        var resizeIcon = function () {
            var originalSize = icon.size;
            var size = new this.paper.Size(s, s);
            var sx = 1.0, sy = 1.0;
            if (Math.abs(originalSize.width) > 0.0000001)
                sx = size.width / originalSize.width;
            if (Math.abs(originalSize.height) > 0.0000001)
                sy = size.height / originalSize.height;

            icon.scale(sx, sy);
        };

        if (icon.size.width > 0 && icon.size.height > 0) {
            resizeIcon();
        }
        else {
            icon.onLoad = function () {
                resizeIcon();
            };
        }

        return icon;
    },

    checkSelectionAlertItems: function () {
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[0];
            this.checkAlertItems(item);
        }
    },

    removeAlertItems: function (item) {
        if (item && item.hasOwnProperty("alertItems") && item.alertItems) {
            while (item.alertItems.length > 0) {
                var alertItem = item.alertItems.pop();
                alertItem.remove(); // remove() work for paper.Raster and JQuery element (icon and tooltip)
            }
        }
    },

    removeAllAlertItems: function () {
        this.getAllItems().forEach(item => {
            if (item.hasOwnProperty("alertItems") && item.alertItems) {
                while (item.alertItems.length > 0) {
                    var alertItem = item.alertItems.pop();
                    alertItem.remove(); // remove() work for paper.Raster and JQuery element (icon and tooltip)
                }
            }
        });
    },

    removeSelectionAlertItems: function () {
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[0];
            this.removeAlertItems(item);
        }
    },

    checkItemQualityForArea: function (item, area) {
        if (item && item instanceof this.paper.Raster && item.data && item.data.guid && !item.data.isArea) {
            var designItem = this.findDesignItemByGuid(item.data.guid);
            if (designItem && designItem.get("imageType") != "Vector") {
                var bounds = item.bounds;
                var scaleSize = this.getAreaScaleFactor(area);
                if (scaleSize) {

                    // MD
                    var newImageWidth = item.size.width * item.scaling.x;
                    var newImageHeight = item.size.height * item.scaling.y;

                    var scaledWidth = newImageWidth * scaleSize.width;
                    var scaledHeight = newImageHeight * scaleSize.height;

                    if (scaledWidth > designItem.get("imageWidth") + (designItem.get("imageWidth") * 0.10) ||
                        scaledHeight > designItem.get("imageHeight") + (designItem.get("imageHeight") * 0.10)) {
                        return false;
                    }

                    /*
                    var newWidth = bounds.width * scaleSize.width;
                    var newHeight = bounds.height * scaleSize.height;
                    if (newWidth > designItem.get("imageWidth") ||
                        newHeight > designItem.get("imageHeight")) {
                        return false;
                    }
                    */
                }
            }
        }
        return true;
    },

    getAreaScaleFactor: function (area) {
        var size = new this.paper.Size(1, 1);
        var printType = this.getSelectedPrintType(area);

        if (!printType)
            printType = this.getModelPrintType(this.design.getSelectedPrintTypeForArea(area));

        var pixelSize = this.getScaledAreaPixelSize(area, printType);
        if (pixelSize) {
            size.width = pixelSize.width / area.get("boundsWidth");
            size.height = pixelSize.height / area.get("boundsHeight");
        }
        return size;
    },

    getSelectedPrintType: function (area) {
        var printTypeID = this.design.getSelectedPrintTypeForArea(area);
        var printType = null;

        if (area) {
            var sideID = area.getSideID();
            var colorID = area.getColorID();
            var model = this.getCurrentModel();

            if (model && sideID > 0 && colorID > 0) {
                printType = model.get("colors").getColor(colorID).get("sides").getSide(sideID).get("printTypes").getPrintType(printTypeID) || model.get("printTypes").getPrintType(printTypeID);
            }
        }

        return printType;
    },

    getModelPrintType: function (printTypeID) {
        var printType = null;
        var model = this.getCurrentModel();

        if (model && this.design && this.design instanceof MPlaza.Design &&
            model.get("printTypes") instanceof MPlaza.PrintTypes) {
            printType = model.get("printTypes").getPrintType(printTypeID);
        }

        return printType;
    },

    getScaledAreaPixelSize: function (area, printType) {
        var size = new this.paper.Size(0, 0);
        var side = null;
        if (area instanceof MPlaza.Area)
            side = area.getParentModel();
        if (side && side.get("ppcm") > 0) {
            // Dimensioni di stampa in centimetri
            var printWidthCM = area.get("boundsWidth") / side.get("ppcm");
            var printHeightCM = area.get("boundsHeight") / side.get("ppcm");

            if ((!printType || printType.get("dpi") <= 0) && area.get("screenPPI") > 0) {
                var widthCM = area.get("boundsWidth") / area.get("screenPPI") * 2.54;
                var heightCM = area.get("boundsHeight") / area.get("screenPPI") * 2.54;

                var sx = printWidthCM / widthCM;
                var sy = printHeightCM / heightCM;

                size.width = Math.round(sx * area.get("boundsWidth"));
                size.height = Math.round(sy * area.get("boundsHeight"));
            }
            else if (printType && printType.get("dpi") > 0) {
                var widthPX = printWidthCM * 0.39370 * printType.get("dpi");
                var heightPX = printHeightCM * 0.39370 * printType.get("dpi");

                size.width = Math.round(widthPX);
                size.height = Math.round(heightPX);
            }
        }
        return size;
    },

    cloneSelectedItems: function () {
        var items = this.getSelectedItems();
        var newItems = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (item instanceof this.paper.Raster && !this.canAddImage())
                continue;

            if (item instanceof this.paper.PointText && !this.canAddText())
                continue;

            if (item.data && (item.data.isTextOnPath || item.data.isTextArea) && !this.canAddText())
                continue;

            var newItem = item.clone();
            newItem.data.guid = undefined;

            if (item.data && item.data.isTextOnPath && item.data.points) {
                newItem.data.points = [item.data.points[0].clone(), item.data.points[1].clone(), item.data.points[2].clone()];
            }

            if (item.data && item.data.isTextArea && item.data.rect) {
                newItem.data.rect = item.data.rect.clone();
            }

            var delta = new this.paper.Point(25, 25);
            newItem.position.x += delta.x;
            newItem.position.y += delta.y;

            newItem.data.needsTransformsDataUpdate = true;

            this.onTextOnPathMoved(newItem, delta);
            this.onTextAreaMoved(newItem, delta);

            newItems.push(newItem);

            var originalDesignItem = this.findDesignItemForItem(item);
            var image = this.createDummyImageFromDesignItem(originalDesignItem);
            var designItem = this.onItemCreated(newItem, image);
            var oldDesignItem = this.findDesignItemForItem(item);

            if (oldDesignItem)
                designItem.copyConstraints(oldDesignItem.get("constraints"));

            originalDesignItem.get("colors").each(function (color) {
                designItem.changeColor(
                    color.get("imageID"),
                    color.get("colorID"),
                    color.get("colorCode")
                );
            });

        }
        this.deselectAll();
        this.selectItems(newItems);
    },

    mirrorSelectedItems: function (direction) {
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.data.needsTransformsDataUpdate = true;

            if (direction == "X") {
                item.scale(-1, -1); // Maybe a bug, i need to flip also in vertical...
                this.onTextOnPathScaled(item, -1, -1, item.bounds.center);
                this.onTextAreaScaled(item, -1, -1, item.bounds.center);
            } else {
                item.scale(1, -1);
                this.onTextOnPathScaled(item, 1, -1, item.bounds.center);
                this.onTextAreaScaled(item, 1, -1, item.bounds.center);
            }
        }
        this.updateTextOnPathGuides(items);
        this.updateTextAreaGuides(items);
        this.onItemsUpdated(items);
    },

    createDummyImageFromDesignItem: function (designItem) {
        var image = new MPlaza.Image();

        image.set("imageID", designItem.get("imageID"));
        image.set("type", designItem.get("imageType"));
        image.set("format", designItem.get("imageFormat"));
        image.set("width", designItem.get("imageWidth"));
        image.set("height", designItem.get("imageHeight"));
        image.set("dpiX", designItem.get("imageDpiX"));
        image.set("dpiY", designItem.get("imageDpiY"));
        image.set("imageFileSize", designItem.get("imageFileSize"));
        image.set("userID", designItem.get("imageUserID"));
        image.set("visitorID", designItem.get("imageVisitorID"));
        image.set("price", designItem.get("imagePrice"));

        return image;
    },

    canAddText: function () {
        if (this.side && this.side instanceof MPlaza.Side && this.design && this.design instanceof MPlaza.Design) {

            if (this.design.get("templateDesignID") <= 0)
                return true;

            var designSide = this.design.getDesignSide(this.side);

            // Attenzione! qui sto supponendo che l'esistenza di designSide indichi che il seller abbia specificato i vincoli
            var value = designSide ? designSide.get("canAddText") : this.design.get("canAddText");
            if (value != undefined && value != null && typeof (value) === "boolean" && !value)
                return false;

            var max = designSide ? designSide.get("maxNrTexts") : this.design.get("maxNrTexts");
            if (max != undefined && max != null && typeof (max) === "number") {
                var count = designSide ? this.design.countTextItemsForSide(this.side.getModelID(), this.side.getColorID(), this.side.getSideID()) :
                    this.design.countTextItemsForColor(this.side.getModelID(), this.side.getColorID());

                if (count >= max)
                    return false;
            }

        }
        return true;
    },

    canAddImage: function () {
        if (this.side && this.side instanceof MPlaza.Side && this.design && this.design instanceof MPlaza.Design) {
            if (this.design.get("templateDesignID") <= 0)
                return true;

            var designSide = this.design.getDesignSide(this.side);

            var value = designSide ? designSide.get("canAddImage") : this.design.get("canAddImage");
            if (value != undefined && value != null && typeof (value) === "boolean" && !value)
                return false;

            var max = designSide ? designSide.get("maxNrImages") : this.design.get("maxNrImages");
            if (max != undefined && max != null && typeof (max) === "number") {

                var count = designSide ? this.design.countImageItemsForSide(this.side.getModelID(), this.side.getColorID(), this.side.getSideID()) :
                    this.design.countImageItemsForColor(this.side.getModelID(), this.side.getColorID());

                if (count >= max)
                    return false;
            }
        }
        return true;
    },

    canMoveSelection: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canMoveItem(item))
                return false;
        }
        return true;
    },

    canRotateSelection: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canRotateItem(item))
                return false;
        }
        return true;
    },

    canDeleteSelection: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canDeleteItem(item))
                return false;
        }
        return true;
    },

    canResizeSelection: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canResizeItem(item))
                return false;
        }
        return true;
    },

    canEditSelection: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canEditItem(item))
                return false;
        }
        return true;
    },

    canChangeSelectionFontFamily: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canChangeItemFontFamily(item))
                return false;
        }
        return true;
    },

    canChangeSelectionFontSize: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canChangeItemFontSize(item))
                return false;
        }
        return true;
    },

    canChangeSelectionFontColor: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canChangeItemFontColor(item))
                return false;
        }
        return true;
    },

    canChangeSelectionFontWeight: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canChangeItemFontWeight(item))
                return false;
        }
        return true;
    },

    canChangeSelectionFontItalic: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canChangeItemFontItalic(item))
                return false;
        }
        return true;
    },

    canChangeSelectionTextPathMode: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canChangeItemTextPathMode(item))
                return false;
        }
        return true;
    },

    canChangeSelectionJustification: function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; i++) {
            var item = selectedItems[i];
            if (!this.canChangeItemJustification(item))
                return false;
        }
        return true;
    },

    // Restituisce i constraints legati ad un item (nel caso di design derivante da template)
    getItemConstraints: function (item) {
        // Se il design non deriva da un template non applico alcuna restrizione        
        if (!this.design || this.design.get("templateDesignID") <= 0)
            return;

        var designItem = this.findDesignItemForItem(item);
        if (designItem)
            return designItem.get("constraints")
        return null;
    },

    getItemConstraintsProperty: function (item, propertyName, defaultValue = true) {
        var constraints = this.getItemConstraints(item);

        if (constraints)
            return constraints.get(propertyName);
        return defaultValue;
    },

    canMoveItem: function (item) {
        return this.getItemConstraintsProperty(item, "canMove");
    },

    canRotateItem: function (item) {
        return this.getItemConstraintsProperty(item, "canRotate");
    },

    canDeleteItem: function (item) {
        return this.getItemConstraintsProperty(item, "canDelete");
    },

    canResizeItem: function (item) {
        return this.getItemConstraintsProperty(item, "canResize");
    },

    canEditItem: function (item) {
        return this.getItemConstraintsProperty(item, "canEdit");
    },

    canChangeItemFontFamily: function (item) {
        return this.getItemConstraintsProperty(item, "canChangeFontFamily");
    },

    canChangeItemFontSize: function (item) {
        return this.getItemConstraintsProperty(item, "canChangeFontSize");
    },

    canChangeItemFontColor: function (item) {
        return this.getItemConstraintsProperty(item, "canChangeFontColor");
    },

    canChangeItemFontWeight: function (item) {
        return this.getItemConstraintsProperty(item, "canChangeFontWeight");
    },

    canChangeItemFontItalic: function (item) {
        return this.getItemConstraintsProperty(item, "canChangeFontItalic");
    },

    canChangeItemTextPathMode: function (item) {
        return this.getItemConstraintsProperty(item, "canChangeTextPathMode");
    },

    canChangeItemTextAreaMode: function (item) {
        return this.canEditItem(item);
    },

    getItemIsTextArea: function (item) {
        return item && item.data && item.data.isTextArea;
    },

    canChangeItemJustification: function (item) {
        return this.getItemConstraintsProperty(item, "canChangeJustification");
    },

    canTransform: function (item) {
        return this.getItemConstraintsProperty(item, "canTransform");
    },

    canChangeSvgColors: function (item) {
        return this.getItemConstraintsProperty(item, "canChangeSvgColors");
    },

    isAlwaysOnTop: function (item) {
        var constraints = this.findDesignItemForItem(item).get("constraints");

        if (constraints)
            return constraints.get("isAlwaysOnTop") || false;
        else
            return false;
    },

    isItemPrintable: function (item) {
        return this.getItemConstraintsProperty(item, "isPrintable");
    },

    isItemStatic: function (item) {

        // If this is a static template element, don't select it
        var isStatic = !(this.canEditItem(item) || this.canMoveItem(item) || this.canRotateItem(item) || this.canResizeItem(item) || this.canDeleteItem(item) || this.canTransform(item));

        if (item instanceof this.paper.Raster) {
            let designItem = this.findDesignItemForItem(item);

            if (!designItem)
                return false;

            if (designItem.get("imageType") == "Vector") {
                isStatic = isStatic && !this.canChangeSvgColors(item);
            }
        }

        if (item instanceof this.paper.PointText) {
            isStatic = isStatic && !(this.canChangeItemFontFamily(item) || this.canChangeItemFontColor(item) || this.canChangeItemFontWeight(item) || this.canChangeItemTextPathMode(item))
        }

        return isStatic;
    },

    itemCanBeTransformed: function (item) {
        return this.canMoveItem(item) || this.canRotateItem(item) || this.canResizeItem(item) || this.canDeleteItem(item) || this.canTransform(item);
    },

    isMandatoryToEdit: function (item) {
        return this.getItemConstraintsProperty(item, "mandatoryToEdit");
    },

    // -------------------------------------------------------------
    // Selection
    // -------------------------------------------------------------
    findItemById: function (id) {
        if (id == -1) return null;

        function findItem(item) {
            if (item.id == id)
                return item;
            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var it = findItem(item.children[j]);
                    if (it != null)
                        return it;
                }
            }
            return null;
        }

        for (var i = 0, l = this.paper.project.layers.length; i < l; i++) {
            var layer = this.paper.project.layers[i];
            var it = findItem(layer);
            if (it != null)
                return it;
        }
        return null;
    },

    findItemByName: function (name) {
        if (!name) return null;

        function findItem(item) {
            if (item.name === name)
                return item;
            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var it = findItem(item.children[j]);
                    if (it != null)
                        return it;
                }
            }
            return null;
        }

        for (var i = 0, l = this.paper.project.layers.length; i < l; i++) {
            var layer = this.paper.project.layers[i];
            var it = findItem(layer);
            if (it != null)
                return it;
        }
        return null;
    },

    clearSelectionBounds: function () {

        if (this.selectionBoundsShape)
            this.selectionBoundsShape.remove();


        if (this.selectionMoveHandle)
            this.selectionMoveHandle.remove();
        if (this.selectionRotateHandle)
            this.selectionRotateHandle.remove();
        if (this.selectionResizeHandle)
            this.selectionResizeHandle.remove();
        if (this.selectionDeleteHandle)
            this.selectionDeleteHandle.remove();

        this.selectionBoundsShape = null;
        this.selectionBounds = null;

        this.selectionMoveHandle = null;
        this.selectionRotateHandle = null;
        this.selectionResizeHandle = null;
        this.selectionDeleteHandle = null;
    },

    showSelectionBounds: function () {

        this.drawSelectionBounds++;
        if (this.drawSelectionBounds > 0) {
            if (this.selectionBoundsShape)
                this.selectionBoundsShape.visible = true;

            if (this.selectionMoveHandle)
                this.selectionMoveHandle.visible = true;
            if (this.selectionRotateHandle)
                this.selectionRotateHandle.visible = true;
            if (this.selectionResizeHandle)
                this.selectionResizeHandle.visible = true;
            if (this.selectionDeleteHandle)
                this.selectionDeleteHandle.visible = true;
        }
    },

    hideSelectionBounds: function () {
        if (this.drawSelectionBounds > 0)
            this.drawSelectionBounds--;
        if (this.drawSelectionBounds == 0) {
            if (this.selectionBoundsShape)
                this.selectionBoundsShape.visible = false;

            if (this.selectionMoveHandle)
                this.selectionMoveHandle.visible = false;
            if (this.selectionRotateHandle)
                this.selectionRotateHandle.visible = false;
            if (this.selectionResizeHandle)
                this.selectionResizeHandle.visible = false;
            if (this.selectionDeleteHandle)
                this.selectionDeleteHandle.visible = false;
        }
    },

    updateSelectionState: function () {
        this.clearSelectionBounds();
        this.selectionBounds = this.getSelectionBounds();
        if (this.selectionBounds != null) {

            var rect = new this.paper.Path.Rectangle(this.selectionBounds);
            rect.strokeColor = this.getContrastedColor(this.selectionBounds);
            rect.strokeWidth = 1.0 / this.paper.view.zoom;
            rect.dashOffset = 0.5 / this.paper.view.zoom;
            rect.dashArray = [1.0 / this.paper.view.zoom, 1.0 / this.paper.view.zoom];
            rect.guide = true;
            rect.visible = this.drawSelectionBounds > 0;
            this.selectionBoundsShape = rect;

            this.createSelectionHandles();

        }
        this.updateTextOnPathGuides();
        this.updateTextAreaGuides();
    },

    moveSelectionShapes: function (delta) {
        if (this.selectionBoundsShape) {
            this.selectionBoundsShape.position.x += delta.x;
            this.selectionBoundsShape.position.y += delta.y;

            if (this.selectionMoveHandle) {
                this.selectionMoveHandle.position.x += delta.x;
                this.selectionMoveHandle.position.y += delta.y;
            }

            if (this.selectionRotateHandle) {
                this.selectionRotateHandle.position.x += delta.x;
                this.selectionRotateHandle.position.y += delta.y;
            }

            if (this.selectionResizeHandle) {
                this.selectionResizeHandle.position.x += delta.x;
                this.selectionResizeHandle.position.y += delta.y;
            }

            if (this.selectionDeleteHandle) {
                this.selectionDeleteHandle.position.x += delta.x;
                this.selectionDeleteHandle.position.y += delta.y;
            }

            this.selectionBounds = this.selectionBoundsShape.bounds;
        }
    },

    scaleSelectionShapes: function (sx, sy, pivot) {
        if (this.selectionBoundsShape) {
            this.selectionBoundsShape.scale(sx, sy, pivot);
            this.selectionBounds = this.selectionBoundsShape.bounds;

            this.placeHandleOut(this.selectionBoundsShape);
        }
    },

    createSelectionHandles: function () {


        if (this.selectionMoveHandle)
            this.selectionMoveHandle.remove();
        if (this.selectionRotateHandle)
            this.selectionRotateHandle.remove();
        if (this.selectionResizeHandle)
            this.selectionResizeHandle.remove();
        if (this.selectionDeleteHandle)
            this.selectionDeleteHandle.remove();

        if (this.selectionBoundsShape) {
            var segments = this.selectionBoundsShape.segments;
            if (segments.length == 4) {
                var bottomLeft = segments[0].point;
                var topLeft = segments[1].point;
                var topRight = segments[2].point;
                var bottomRight = segments[3].point;

                var selectedItems = this.getSelectedItems();

                if (this.canMoveSelection())
                    this.selectionMoveHandle = this.createSelectionHandle("move", topLeft);

                if (this.canRotateSelection() && selectedItems && !selectedItems[0].data.isTextArea)
                    this.selectionRotateHandle = this.createSelectionHandle("rotate", topRight);

                if (this.canDeleteSelection())
                    this.selectionDeleteHandle = this.createSelectionHandle("remove", bottomLeft);

                if (this.canResizeSelection()) {
                    // TODO: manage when there will be different print type for each area
                    var model = this.getCurrentModel();

                    if (model && this.design && this.design instanceof MPlaza.Design &&
                        model.get("printTypes") instanceof MPlaza.PrintTypes && selectedItems.length > 0 &&
                        this.side && this.side.get("areas").length > 0) {

                        //Since print types per areas are not yet supported, just take the first area (the print type of that area's side side will be taken)
                        var area = this.side.get("areas").at(0);
                        var printType = this.getSelectedPrintType(area);
                        var modelPrintType = model.get("printTypes").getPrintType(this.design.getSelectedPrintTypeForArea(area));

                        if (!printType)
                            printType = model.get("printTypes").getPrintType(this.design.getSelectedPrintTypeForArea(area));

                        var useImagesFixedSize = null;

                        if (printType instanceof MPlaza.PartPrintType) {
                            var restrictions = printType.get("restrictions");
                            useImagesFixedSize = restrictions ? restrictions.get("useImagesFixedSize") : null;
                        }

                        if (useImagesFixedSize == null)
                            useImagesFixedSize = modelPrintType.get("useImagesFixedSize");

                        var item = selectedItems[0];
                        var designItem = this.findDesignItemForItem(item);

                        if (useImagesFixedSize == false || (useImagesFixedSize == true && !designItem.get("imagePreferredWidth") && !designItem.get("imagePreferredHeight")))
                            this.selectionResizeHandle = this.createSelectionHandle("resize", bottomRight);
                    }
                }

                this.placeHandleOut(this.selectionBoundsShape);
            }
        }
    },

    //Places handle out of selection bounds
    placeHandleOut: function (currentBounds) {
        currentBounds = currentBounds || this.selectionBoundsShape;

        if (!currentBounds)
            return;

        var bottomLeft = currentBounds.segments[0].point;
        var topLeft = currentBounds.segments[1].point;
        var topRight = currentBounds.segments[2].point;
        var bottomRight = currentBounds.segments[3].point;

        var dist = bottomRight.subtract(topLeft);
        var a = Math.atan2(dist.x, dist.y);

        var height = topLeft.getDistance(bottomLeft);
        var width = topLeft.getDistance(topRight);
        var m = height / width;
        var angle = Math.atan(m);

        var rBase = 1 / 2 * Math.sqrt(2);
        var currentRotation = a + angle;

        if (this.selectionMoveHandle) {
            var r = this.selectionMoveHandle.bounds.width * rBase;

            this.selectionMoveHandle.position = topLeft;
            this.selectionMoveHandle.position.y -= Math.sin(currentRotation + Math.PI / 4) * r;
            this.selectionMoveHandle.position.x += Math.cos(currentRotation + Math.PI / 4) * r;
        }
        if (this.selectionRotateHandle) {
            var r = this.selectionRotateHandle.bounds.width * rBase;

            this.selectionRotateHandle.position = topRight;
            this.selectionRotateHandle.position.y -= Math.sin(currentRotation - Math.PI / 4) * r;
            this.selectionRotateHandle.position.x += Math.cos(currentRotation - Math.PI / 4) * r;
        }
        if (this.selectionDeleteHandle) {
            var r = this.selectionDeleteHandle.bounds.width * rBase;

            this.selectionDeleteHandle.position = bottomLeft;
            this.selectionDeleteHandle.position.y -= Math.sin(currentRotation + 3 * Math.PI / 4) * r;
            this.selectionDeleteHandle.position.x += Math.cos(currentRotation + 3 * Math.PI / 4) * r;
        }
        if (this.selectionResizeHandle) {
            var r = this.selectionResizeHandle.bounds.width * rBase;

            this.selectionResizeHandle.position = bottomRight;
            this.selectionResizeHandle.position.y -= Math.sin(currentRotation - 3 * Math.PI / 4) * r;
            this.selectionResizeHandle.position.x += Math.cos(currentRotation - 3 * Math.PI / 4) * r;
        }
    },

    createSelectionHandle: function (name, point) {
        if (!this.selectionBounds)
            return null;

        var currentBounds = this.selectionBoundsShape;
        //var s = 16 / this.paper.view.zoom;
        //var s = 24 / this.paper.view.zoom;

        var ViewPort = getViewport();
        var s = 0;

        if (ViewPort.w <= 480) {
            s = 30 / this.paper.view.zoom;
        }
        else {
            s = 20 / this.paper.view.zoom;
        }
        var bytes = this.iconsBytes[name];
        var url = 'data:image/png;base64,' + bytes;

        var handle = new this.paper.Raster({
            source: url,
            position: point
        });

        handle.data.isHandle = true;

        var resizeHandle = function () {

            var originalSize = handle.size;
            var size = new this.paper.Size(s, s);
            var sx = 1.0, sy = 1.0;
            if (Math.abs(originalSize.width) > 0.0000001)
                sx = size.width / originalSize.width;
            if (Math.abs(originalSize.height) > 0.0000001)
                sy = size.height / originalSize.height;

            handle.scale(sx, sy);
        };

        if (handle.size.width > 0 && handle.size.height > 0) {
            resizeHandle();
        }
        else {
            var that = this;

            handle.onLoad = function () {
                resizeHandle();
                that.placeHandleOut(currentBounds);
            };
        }

        return handle;
    },

    isItemFrozen: function (item) {
        return (item &&
            ((item.data && item.data.frozen) ||
                (this.isItemGroupChild(item) && item.parent.data && item.parent.data.frozen)
            )
        );
    },

    isItemGroup: function (item) {
        return (item instanceof this.paper.Group && !(item instanceof this.paper.Layer));
    },

    isItemGroupChild: function (item) {
        return item.parent && this.isItemGroup(item.parent);
    },

    isItemChild: function (item) {
        return item.parent && !(item.parent instanceof this.paper.Layer);
    },

    getRootDesignItemCanvasItem: function (item) {
        if (item) {

            if (item.isMaskPath)
                return item.item;

            if (item.data && item.data.guid && !item.data.isArea)
                return item;
            else if (item.parent && !(item.parent instanceof this.paper.Layer))
                return this.getRootDesignItemCanvasItem(item.parent);
        }
        return null;
    },

    isDesignItemCanvasItem: function (item) {
        return this.getRootDesignItemCanvasItem(item) != null;
    },

    setItemSelection: function (item, selected) {
        var root = this.getRootDesignItemCanvasItem(item);

        if (root && root.data.selected != selected) {
            root.data.selected = selected;


            var designItem = this.findDesignItemForItem(root);
            var event = { designItem: designItem, selected: selected };

            this.fireSelectionChangedEvent(event);
            this.createMaskForItem(item);

            if (root.data.maskAlertPath)
                root.data.maskAlertPath.remove();
        }
    },

    createMaskForItem: function (item) {
        var root = this.getRootDesignItemCanvasItem(item);

        // Update mask path on selection
        var intersectingAreas = this.getAreasIntersectingItem(root);
        var containingAreas = this.getAreasContainingItem(root);
        var outside = intersectingAreas.length == 0 && containingAreas.length == 0;

        if (root.data.maskPath)
            root.data.maskPath.remove();

        // Create mask path as invisible
        root.data.maskPath = new this.paper.Path.Rectangle(root.bounds);
        root.data.maskPath.strokeWidth = 2;
        root.data.maskPath.strokeColor = "blue";
        root.data.maskPath.dashArray = [4, 10];
        root.data.maskPath.isMaskPath = true;
        root.data.maskPath.item = root;
        root.data.maskPath.visible = false;

        // Show if we have not selected the item and we are outside
        if (!root.data.selected && outside && this.itemCanBeTransformed(item)) {
            root.data.maskPath.visible = true;
        }
    },

    createMaskAlertForItem: function (item) {
        var root = this.getRootDesignItemCanvasItem(item);

        // Update mask path on selection
        if (root.data.maskAlertPath)
            root.data.maskAlertPath.remove();

        // Create mask path as invisible
        root.data.maskAlertPath = new this.paper.Path.Rectangle(root.bounds);
        root.data.maskAlertPath.strokeWidth = 3;
        root.data.maskAlertPath.strokeColor = "red";
        root.data.maskAlertPath.dashArray = [4, 10];
        root.data.maskAlertPath.isMaskAlertPath = true;
        root.data.maskAlertPath.item = root;
        root.data.maskAlertPath.data.isMaskAlertPath = true;
    },

    groupSelectedItems: function () {
        var selected = this.getSelectedItems();
        if (selected.length == 0)
            return;

        var group = new this.paper.Group();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide)
                continue;
            group.addChild(item);
        }
        this.setItemSelection(group, true);

        this.updateSelectionState();
        this.paper.project.view.update();

        return group;
    },

    ungroupSelectedItems: function () {
        var selected = this.getSelectedItems();
        if (selected.length == 0)
            return;
        move
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (!(item instanceof this.paper.Group))
                continue;
            this.ungroup(item);
        }

        this.updateSelectionState();
        this.paper.project.view.update();
    },

    ungroup: function (group) {
        this.setItemSelection(group, false);
        if (group && (group instanceof this.paper.Group)) {
            while (group.children.length > 0) {
                var item = group.children.pop();
                item.parent = this.paper.project.activeLayer;
                this.setItemSelection(item, true);
            }
            group.remove();
        }
    },

    // Returns serialized positions of selected items.
    captureSelectionPosition: function () {
        var positions = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide) continue;
            if (this.isItemChild(item)) continue;

            var orig = {
                id: item.id,
                position: item.position
            }
            positions.push(orig);
        }
        return positions;
    },

    // Restore the positions of selected items.
    restoreSelectionPosition: function (originalPositions) {
        for (var i = 0; i < originalPositions.length; i++) {
            var orig = originalPositions[i];
            var item = this.findItemById(orig.id);
            if (!item) continue;

            item.position = orig.position;
        }
    },

    // Returns serialized contents of selected items.
    captureSelectionState: function () {
        var originalContent = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide) continue;
            //if (this.isItemChild(item)) continue;

            var orig = {
                id: item.id,
                applyMatrix: item.applyMatrix,
                json: item.exportJSON({ asString: false }),
                matrix: item.matrix.clone(),
                selectedSegments: [],
                boundsItemMatrix: (item.data && item.data.originalMatrix) ? item.data.originalMatrix.clone() : null,
            };
            originalContent.push(orig);
        }
        return originalContent;
    },

    // Restore the state of selected items.
    restoreSelectionState: function (originalContent) {
        // TODO: could use findItemById() instead.
        for (var i = 0; i < originalContent.length; i++) {
            var orig = originalContent[i];
            var item = this.findItemById(orig.id);
            if (!item) continue;

            if (orig.applyMatrix) {
                // HACK: paper does not retain item IDs after importJSON,
                // store the ID here, and restore after deserialization.
                var id = item.id;
                item.importJSON(orig.json);
                item._id = id;
            } else {
                item.matrix.set(orig.matrix.a, orig.matrix.b, orig.matrix.c, orig.matrix.d, orig.matrix.tx, orig.matrix.ty);
            }

            // Image Original Bounds & Matrix
            if (item.data.originalBounds && item.data.originalMatrix && orig.boundsItemMatrix) {
                item.data.originalMatrix = orig.boundsItemMatrix.clone();
            }
            // -------------------------
        }
    },

    captureSelectionMatrix: function () {
        var originalMatrix = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide) continue;
            if (this.isItemChild(item)) continue;

            var orig = {
                id: item.id,
                matrix: item.matrix.clone(),
                selectedSegments: [],
                boundsItemMatrix: item.data.originalMatrix,
            };
            originalMatrix.push(orig);
        }
        return originalMatrix;
    },

    // Restore the state of selected items.
    restoreSelectionMatrix: function (originalMatrix) {
        // TODO: could use findItemById() instead.
        for (var i = 0; i < originalMatrix.length; i++) {
            var orig = originalMatrix[i];
            var item = this.findItemById(orig.id);
            if (!item) continue;

            item.matrix.set(orig.matrix.a, orig.matrix.c, orig.matrix.b, orig.matrix.d, orig.matrix.tx, orig.matrix.ty);

            // Image Original Bounds & Matrix
            if (item.data && item.data.originalMatrix) {
                item.data.originalMatrix = orig.boundsItemMatrix.clone();
            }
            // -------------------------            
        }
    },

    deselectAll: function () {
        var items = this.getSelectedItems();

        this.fireDeselectionChangedEvent(items);

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.data && item.data.selected)
                this.setItemSelection(item, false); //item.data.selected = false;
        }
        this.paper.project.deselectAll();
        lastSelectedItem = null;

        // If we don't have a side image don't hide the areas
        this.hideAreaItems();
    },

    selectItems: function (items) {
        this.deselectAll();
        if (items && Object.prototype.toString.call(items) === '[object Array]') {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item)
                    this.setItemSelection(item, true);
            }
        }
        this.updateSelectionState();
        this.paper.project.view.update();
    },

    // Returns bounding box of all selected items.
    getSelectionBounds: function () {
        var bounds = null;
        var selected = this.getSelectedItems();

        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            //if (this.isItemChild(item)) continue;
            if (bounds == null)
                bounds = selected[i].bounds.clone();
            else
                bounds = bounds.unite(selected[i].bounds);
        }
        return bounds;
    },

    getSelectedItems: function () {
        var items = [];

        var addSelectedChildren = function (parent) {

            if (parent.guide)
                return;

            if (parent.data && parent.data.isArea)
                return;

            if (parent.data && parent.data.selected)
                items.push(parent);

            if (parent.children) {
                for (var j = parent.children.length - 1; j >= 0; j--) {
                    var child = parent.children[j];
                    addSelectedChildren(child);
                }
            }
        }

        for (var i = 0; i < this.paper.project.layers.length; i++) {
            var layer = this.paper.project.layers[i];
            if (layer.guide) continue;
            addSelectedChildren(layer);
        }

        return items;
    },

    getSelectedSimpleItems: function () {
        var items = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide)
                continue;

            if (item instanceof this.paper.Group)
                continue;

            if (item.parent && this.isItemGroup(item.parent))
                continue;

            items.push(item);
        }

        return items;
    },

    getSelectedGroupItems: function () {
        var groups = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide)
                continue;

            if (this.isItemGroup(item))
                groups.push(item);
        }

        return groups;
    },

    getSelectedTextItems: function () {
        var items = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide)
                continue;

            if (item instanceof this.paper.TextItem)
                items.push(item);
            else if (item && item.data && item.data.isTextOnPath)
                items.push(item);
            else if (item && item.data && item.data.isTextArea)
                items.push(item);
        }

        return items;
    },

    getTextItemInfo: function (item) {
        info = {};
        info.text = "";
        info.strokeColor = "black";
        info.strokeWidth = 0;
        info.fillColor = "black";
        info.fontFamily = "Arial";
        info.fontSize = 18;
        info.fontWeight = "normal";
        info.fontStyle = "normal";
        info.fontStretch = "normal";
        info.justification = "center";
        info.isTextOnPath = false;
        info.isTextArea = false;

        if (item instanceof this.paper.TextItem) {
            info.text = item.content;
            info.strokeColor = item.strokeColor.toCSS(true);
            info.strokeWidth = item.strokeWidth;
            info.fillColor = item.fillColor.toCSS(true);
            info.fontFamily = item.fontFamily;
            info.fontSize = item.fontSize;
            info.fontWeight = item.fontWeight;
            info.fontStyle = item.fontStyle;
            info.fontStretch = item.fontStretch;
            info.justification = item.justification;
        } else if (item && item.data && (item.data.isTextOnPath || item.data.isTextArea)) {
            if (item.children.length > 0) {

                var str = item.data.text;

                if (!str) {
                    for (var i = 0; i < item.children.length; i++) {
                        str += item.children[i].content;
                    }
                }

                info.text = str;
                info.isTextOnPath = item.data && item.data.isTextOnPath;
                info.isTextArea = item.data && item.data.isTextArea;
                info.strokeColor = item.children[0].strokeColor;
                info.strokeWidth = item.children[0].strokeWidth;
                info.fillColor = item.children[0].fillColor;
                info.fontFamily = item.children[0].fontFamily;
                info.fontWeight = item.children[0].fontWeight;
                info.fontStyle = item.children[0].fontStyle;
                info.fontStretch = item.children[0].fontStretch;
                info.fontSize = item.children[0].fontSize;
                info.scaling = item.children[0].scaling;
                info.justification = item.data.isTextArea ? item.data.justification : undefined;
            }
        }
        // Remove font family quotes
        info.fontFamily = info.fontFamily.replace(/"/g, "");
        return info;
    },

    getSelectedTextItemsInfo: function () {

        info = {};
        info.text = "";
        info.strokeColor = "black";
        info.strokeWidth = 0;
        info.fillColor = "black";
        info.fontFamily = "Arial";
        info.fontSize = 18;
        info.fontWeight = "normal";
        info.fontStyle = "normal";
        info.fontStretch = "normal";
        info.justification = "center";
        info.isTextOnPath = false;
        info.isTextArea = false;

        var items = this.getSelectedTextItems();
        if (items && items.length == 1) {
            var item = items[0];
            info = this.getTextItemInfo(item);
        }

        // Remove font family quotes
        info.fontFamily = info.fontFamily.replace(/"/g, "");
        return info;
    },

    getSelectedTextItemsNotOnPath: function () {
        var items = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide)
                continue;

            if (item instanceof this.paper.TextItem)
                items.push(item);
        }

        return items;
    },

    getSelectedTextOnPathItems: function () {
        var items = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide)
                continue;

            else if (item && item.data && item.data.isTextOnPath)
                items.push(item);
        }

        return items;
    },

    getSelectedTextAreaItems: function () {
        var items = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide)
                continue;

            else if (item && item.data && item.data.isTextArea)
                items.push(item);
        }

        return items;
    },

    getSelectedImageItems: function () {
        var imageItems = [];
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item && item instanceof this.paper.Raster && item.data && item.data.guid && !item.data.isArea) {
                imageItems.push(item);
            }
        }
        return imageItems;
    },

    getSelectedItemsCommonImageID: function () {
        var imageID = null;
        var items = this.getSelectedImageItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var designItem = this.findDesignItemByGuid(item.data.guid);
            if (designItem) {
                var id = designItem.get("imageID");
                if (imageID == null)
                    imageID = id;
                else if (id != imageID)
                    return null;
            }
        }
        return imageID;
    },

    getSelectedDesignItems: function () {
        var designItems = [];
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var designItem = this.findDesignItemForItem(item);
            if (item) {
                designItems.push(designItem);
            }
        }
        return designItems;
    },

    countTextItems: function () {
        var count = 0;

        var customizer = this;

        function countChildren(item) {
            if (customizer.isItemGroup(item) && item != customizer.masterGroup)
                return;

            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var child = item.children[j];

                    if (!child.guide &&
                        (child instanceof this.paper.TextItem || (child.data && child.data.isTextOnPath) || (child.data && child.data.isTextArea)))
                        count++;

                    countChildren(child);
                }
            }
        }

        for (var i = 0, l = customizer.paper.project.layers.length; i < l; i++) {
            var layer = customizer.paper.project.layers[i];
            if (!layer.guide)
                countChildren(layer);
        }

        return count;
    },

    countImageItems: function () {
        var count = 0;

        var customizer = this;

        function countChildren(item) {
            if (customizer.isItemGroup(item) && item != customizer.masterGroup)
                return;

            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var child = item.children[j];

                    if (child && child instanceof this.paper.Raster && child.data && child.data.guid && !child.data.isArea)
                        count++;

                    countChildren(child);
                }
            }
        }

        for (var i = 0, l = customizer.paper.project.layers.length; i < l; i++) {
            var layer = customizer.paper.project.layers[i];
            if (!layer.guide)
                countChildren(layer);
        }

        return count;
    },

    getItemsInfo: function () {

        var infoArray = [];

        var customizer = this;

        function checkChildren(item) {
            if (customizer.isItemGroup(item) && item != customizer.masterGroup)
                return;

            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var child = item.children[j];

                    if (child && !child.guide) {

                        var itemInfo = null;
                        var designItem = customizer.findDesignItemForItem(child);
                        if (designItem) {

                            if (child instanceof this.paper.TextItem || (child.data && child.data.isTextOnPath) || (child.data && child.data.isTextArea)) {
                                // Text Item
                                itemInfo = new MPlaza.TextItemInfo(designItem, child);
                                var info = customizer.getTextItemInfo(child);
                                itemInfo.text = info.text;
                                itemInfo.strokeColor = info.strokeColor;
                                itemInfo.strokeWidth = info.strokeWidth;
                                itemInfo.fillColor = info.fillColor;
                                itemInfo.fontFamily = info.fontFamily;
                                itemInfo.fontSize = info.fontSize;
                                itemInfo.fontWeight = info.fontWeight;
                                itemInfo.fontStyle = info.fontStyle;
                                itemInfo.fontStretch = info.fontStretch;
                                itemInfo.justification = info.justification;
                                itemInfo.isTextOnPath = info.isTextOnPath;
                                itemInfo.isTextArea = info.isTextArea;

                            } else if (child instanceof this.paper.Raster && child.data && child.data.guid && !child.data.isArea) {
                                // Image Item
                                itemInfo = new MPlaza.ImageItemInfo(designItem, child);
                                itemInfo.url = child.source;
                            }
                        }
                        if (itemInfo != null)
                            infoArray.push(itemInfo);
                    }

                    checkChildren(child);
                }
            }
        }

        for (var i = 0; i < customizer.paper.project.layers.length; i++) {
            var layer = customizer.paper.project.layers[i];
            if (!layer.guide)
                checkChildren(layer);
        }

        return infoArray;
    },

    // Restituisce gli areaItem contenenti gli item selezionati
    getSelectedAreaItems: function () {
        var areaItems = [];
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            var areas = this.getAreasIntersectingOrContainingItem(item);
            for (var j = 0; j < areas.length; j++) {
                var area = areas[j];
                var areaItem = this.findItemForArea(area);
                if (areaItem)
                    areaItems.push(areaItem);
            }
        }
        return areaItems;
    },

    log: function (msg) {
        Logger.info(msg);
        if ($("#logMsg").length) {
            $("#logMsg").text(msg);
        }
    },

    appendLog: function (msg) {
        var text = $("#logMsg").text();
        if (text) {
            text += "\n";
        }
        text += msg;
        Logger.info(msg);
        $("#logMsg").text(text);
    },

    // -------------------------------------------------------------
    // Touch events
    // -------------------------------------------------------------
    onTouchStart: function (event) {

        this.touchEnabled = true;

        event.preventDefault();

        if (event.touches.length == 1) {

            var p = this.windowToCanvas(event.touches[0].clientX, event.touches[0].clientY);
            var point = new this.paper.Point(p.x, p.y);
            point = this.paper.project.view.viewToProject(point);

            this.hitTest(point);

            this.hitTestEnabled = false;

            this.interactionMode = MPlaza.CustomizerInteractionMode.Create;
            if (this.elementType == MPlaza.CustomizerElementType.None)
                this.interactionMode = MPlaza.CustomizerInteractionMode.Select;

            this.mouseStartPos = point.clone();
            this.adjustmentDelta = null;
            this.mouseLastPos = point.clone();
            this.element = null;
            this.captureInitialSelectionState(point);

            if (this.hitItem) {
                if (this.hitItem.data && this.hitItem.data.isTextOnPathFirstEndHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextOnPathFirstEnd;
                } else if (this.hitItem.data && this.hitItem.data.isTextOnPathMiddleEndHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextOnPathMiddleEnd;
                } else if (this.hitItem.data && this.hitItem.data.isTextOnPathLastEndHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextOnPathLastEnd;
                } else if (this.hitItem.data && this.hitItem.data.isTextAreaTopEndHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd;
                } else if (this.hitItem.data && this.hitItem.data.isTextAreaRightEndHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextAreaRightEnd;
                } else if (this.hitItem.data && this.hitItem.data.isTextAreaBottomEndHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextAreaBottomEnd;
                } else if (this.hitItem.data && this.hitItem.data.isTextAreaLeftEndHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextAreaLeftEnd;
                } else {
                    var rootItem = this.getRootDesignItemCanvasItem(this.hitItem);
                    if (rootItem) {
                        this.interactionMode = MPlaza.CustomizerInteractionMode.Select;
                    } else if (this.hitItem == this.selectionMoveHandle) {
                        this.interactionMode = MPlaza.CustomizerInteractionMode.Move;
                    } else if (this.hitItem == this.selectionRotateHandle) {
                        this.interactionMode = MPlaza.CustomizerInteractionMode.Rotate;
                    } else if (this.hitItem == this.selectionResizeHandle) {
                        this.interactionMode = MPlaza.CustomizerInteractionMode.Resize;
                    } else if (this.hitItem == this.selectionDeleteHandle) {
                        this.interactionMode = MPlaza.CustomizerInteractionMode.Delete;
                    }
                }
            }
        }
    },

    onTouchEnd: function (event) {

        this.hitTestEnabled = true;

        this.hideCenterLines();
        this.adjustmentDelta = null;

        var selected = this.getSelectedItems();

        if (this.interactionMode == MPlaza.CustomizerInteractionMode.Select) {
            this.selectElement();
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Create) {
            this.onItemCreated(this.element);
            this.deselectAll();
            this.setItemSelection(this.element, true);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Move) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Rotate) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Resize) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Delete) {
            this.deleteSelection();
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Edit) {
            this.editElement();
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathFirstEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathMiddleEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathLastEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaRightEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaBottomEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaLeftEnd) {
            this.onItemsUpdated(selected);
        }

        this.updateSelectionState();
        this.paper.project.view.update();
    },

    onTap: function (event) {
        alert("ok");
        /*
        var p = this.windowToCanvas(event.center.x, event.center.y);
        var point = new this.paper.Point(p.x, p.y);
        point = this.paper.project.view.viewToProject(point);

        var item = this.hitItem;

        if (!item || item == this.imageItem || (item.data && item.data.isArea)) {
            this.deselectAll();
        } else if (item == this.selectionDeleteHandle) {
            this.deleteSelection();
        } else {
            this.setItemSelection(item, true);
        }
        this.updateSelectionState();
        this.paper.project.view.update();
        */
    },

    onDoubleTap: function (event) {
        //var p = this.windowToCanvas(event.center.x, event.center.y);
        //var point = new this.paper.Point(p.x, p.y);
        //point = this.paper.project.view.viewToProject(point);

        //this.paper.view.zoom = 1;
        //this.moveOriginToViewCenter();

        this.fitToScreen(true, true);
    },

    onPan: function (event) {
        event.preventDefault();

        var p = this.windowToCanvas(event.center.x, event.center.y);

        var point = new this.paper.Point(p.x, p.y);
        point = this.paper.project.view.viewToProject(point);

        if (event.type == 'panstart') {
            this.lastPanPoint.x = point.x;
            this.lastPanPoint.y = point.y;
            this.panOrigin = paper.view.center;

            // Remove alert items
            var items = this.getAllItems();
            for (var item of items)
                this.removeAlertItems(item);

            this.removeSizeLimitAlert();
        } else if (event.type == "panend") {
            var items = this.getAllItems();
            for (var item of items)
                this.checkAlertItems(item);

            this.checkImagesSizeLimit();
        }

        var delta = point.subtract(this.lastPanPoint);

        this.lastPanPoint.x = point.x;
        this.lastPanPoint.y = point.y;

        var info = new MPlaza.PointingInfo();
        if (event.srcEvent) {
            info.modifiers.option = event.srcEvent.altKey || false;
            info.modifiers.control = event.srcEvent.ctrlKey || false;
            info.modifiers.shift = event.srcEvent.shiftKey || false;
        }
        info.delta = delta;
        info.point = point;

        this.onPointerDrag(info);

        //this.dumpSelectionPosition();
        this.paper.project.view.update();

        if (this.getSelectedItems().length == 0 && this.panOrigin) {

            paper.view.center = this.panOrigin.subtract(new paper.Point(event.deltaX * 1 / paper.view.zoom, event.deltaY * 1 / paper.view.zoom));
            //paper.view.update(false);
        }

        // Clamp view
        this.clampView();
    },

    onPinch: function (event) {

        try {
            // alert("ok");
            //if (event.pointers.length < 2) return;

            //var itemsBounds = this.getAllItemsBounds();
            //var viewBounds = this.paper.project.view.bounds;

            //var pointer1 = event.pointers[0];
            //var pointer2 = event.pointers[1];

            //var medX = (pointer1.clientX + pointer2.clientY) / 2;
            //var medY = (pointer2.clientX + pointer2.clientY) / 2;

            ///*
            //var allInBefore = viewBounds.contains(itemsBounds);

            //if (event.deltaY < 0 && this.areAllItemsInView())
            //    return;
            //*/

            // event.preventDefault();

            //var zoomFactor = 1.3;

            //var mousePosition = new this.paper.Point(medX, medY);
            //mousePosition = this.paper.project.view.viewToProject(mousePosition);

            //var zoomCenter = mousePosition.subtract(this.paper.view.center);

            //var moveFactor = zoomFactor - 1.0;
            //Logger.info(medX + " " + medY + " " + event.distance);
            //if (event.distance > 0) {
            //    this.paper.view.zoom *= zoomFactor;
            //    this.paper.view.center = this.paper.view.center.add(zoomCenter.multiply(moveFactor / zoomFactor)); // Fisso al centro
            //} else if (event.distance < 0) {
            //    if (itemsBounds.width < viewBounds.width && itemsBounds.height < viewBounds.height)
            //        return;

            //    this.paper.view.zoom /= zoomFactor;
            //    this.paper.view.center = this.paper.view.center.subtract(zoomCenter.multiply(moveFactor));  // Fisso al centro
            //}

            //this.hitItem = null;
            //this.updateSelectionState();
            //this.paper.project.view.update();

            // new script
            // alert(event.type);

            var itemsBounds = this.getAllItemsBounds();
            var viewBounds = this.paper.project.view.bounds;

            if (this.zooming || !itemsBounds || !viewBounds)
                return;

            if (event.type == "pinchstart")
                this.oldScale = event.scale;

            var newScale = event.scale - this.oldScale;
            this.oldScale = event.scale;

            if (event.pointers.length < 2) return;

            var zoomFactor = 1 + Math.abs(newScale);

            var mousePosition = new paper.Point(event.center.x, event.center.y);
            mousePosition = paper.project.view.viewToProject(mousePosition)

            var zoomCenter = mousePosition.subtract(paper.view.center);
            var moveFactor = zoomFactor - 1.0;

            if (newScale > 0) {
                if (paper.view.zoom >= 1.1) return;

                paper.view.zoom *= zoomFactor;
                paper.view.center = paper.view.center.add(zoomCenter.multiply(moveFactor / zoomFactor));
            } else if (newScale < 0) {
                if (itemsBounds.width < viewBounds.width - 100 && itemsBounds.height < viewBounds.height - 100)
                    return;

                paper.view.zoom /= zoomFactor;
                paper.view.center = paper.view.center.subtract(zoomCenter.multiply(moveFactor));
            }


            // Update alert items
            var items = this.getAllItems();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                if (item && item.data && item.data.guid && !item.data.isArea && !item.guide && item.alertItems && item.alertItems.length > 0)
                    this.checkAlertItems(item);
            }

            this.checkImagesSizeLimit();

            this.clampView();
        }
        catch (exc) {
            alert(exc);
        }



        /*
        var p = this.windowToCanvas(event.center.x, event.center.y);
        var point = new this.paper.Point(p.x, p.y);
        point = this.paper.project.view.viewToProject(point);

        if (event.type == 'pinchstart') {
            //this.pinchScale = 1;
        }

        if (this.selectionBounds && this.selectionBounds.contains(point) &&
            this.originalCenter && this.originalContent) {
            var scale = event.scale;
            var pivot = this.originalCenter.clone();
            this.restoreSelectionState(this.originalContent);
            this.scaleSelectedItems(scale, scale, pivot);
        }
        */
    },

    onRotate: function (event) {
    },

    // -------------------------------------------------------------
    // Mouse Events
    // -------------------------------------------------------------
    dumpSelectionPosition: function () {
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            Logger.info("item_" + item._id + " - x: " + item.position.x + " - y: " + item.position.y);
        }
    },

    onMouseDown: function (event) {

        if (this.touchEnabled)
            return;

        this.hitTest(event.point);

        this.hitTestEnabled = false;

        this.interactionMode = MPlaza.CustomizerInteractionMode.Create;
        if (this.elementType == MPlaza.CustomizerElementType.None)
            this.interactionMode = MPlaza.CustomizerInteractionMode.Select;

        this.mouseStartPos = event.point.clone();
        this.adjustmentDelta = null;
        this.mouseLastPos = event.point.clone();
        this.element = null;
        this.captureInitialSelectionState(event.point);

        if (this.hitItem) {
            if (this.hitItem.data && this.hitItem.data.isTextOnPathFirstEndHandle) {
                this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextOnPathFirstEnd;
            } else if (this.hitItem.data && this.hitItem.data.isTextOnPathMiddleEndHandle) {
                this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextOnPathMiddleEnd;
            } else if (this.hitItem.data && this.hitItem.data.isTextOnPathLastEndHandle) {
                this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextOnPathLastEnd;
            } else if (this.hitItem.data && this.hitItem.data.isTextAreaTopEndHandle) {
                this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd;
            } else if (this.hitItem.data && this.hitItem.data.isTextAreaRightEndHandle) {
                this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextAreaRightEnd;
            } else if (this.hitItem.data && this.hitItem.data.isTextAreaBottomEndHandle) {
                this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextAreaBottomEnd;
            } else if (this.hitItem.data && this.hitItem.data.isTextAreaLeftEndHandle) {
                this.interactionMode = MPlaza.CustomizerInteractionMode.MoveTextAreaLeftEnd;
            } else {
                var rootItem = this.getRootDesignItemCanvasItem(this.hitItem);
                if (rootItem) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.Select;
                } else if (this.hitItem == this.selectionMoveHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.Move;
                } else if (this.hitItem == this.selectionRotateHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.Rotate;
                } else if (this.hitItem == this.selectionResizeHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.Resize;
                } else if (this.hitItem == this.selectionDeleteHandle) {
                    this.interactionMode = MPlaza.CustomizerInteractionMode.Delete;
                }
            }
        }
    },

    onMouseMove: function (event) {
        if (this.hitTestEnabled)
            this.hitTest(event.point);
    },

    onMouseDrag: function (event) {
        event.preventDefault();

        var info = new MPlaza.PointingInfo();
        info.modifiers.option = event.modifiers.option;
        info.modifiers.control = event.modifiers.control;
        info.modifiers.shift = event.modifiers.shift;
        info.delta = event.delta;
        info.point = event.point;

        //Logger.info("onMouseDrag - point: " + event.point + " - delta: " + event.delta);
        this.onPointerDrag(info);
        //this.dumpSelectionPosition();
    },

    onPointerDrag: function (info) {
        this.hitTestEnabled = false;

        if (this.frozen)
            return;

        if (this.interactionMode == MPlaza.CustomizerInteractionMode.Select) {
            this.selectElement();
            this.updateSelectionState();
            this.captureInitialSelectionState(info.point);
            this.interactionMode = MPlaza.CustomizerInteractionMode.Move;
        }

        if (this.interactionMode == MPlaza.CustomizerInteractionMode.Create) {
            if (this.elementType != MPlaza.CustomizerElementType.Text)
                this.createElement(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Move) {
            this.moveSelection(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Rotate) {
            this.rotateSelection(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Resize) {
            this.resizeSelection(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathFirstEnd) {
            this.moveTextOnPathFirstEnd(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathMiddleEnd) {
            this.moveTextOnPathMiddleEnd(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathLastEnd) {
            this.moveTextOnPathLastEnd(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd) {
            this.moveTextAreaTopEnd(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaRightEnd) {
            this.moveTextAreaRightEnd(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaBottomEnd) {
            this.moveTextAreaBottomEnd(info);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaLeftEnd) {
            this.moveTextAreaLeftEnd(info);
        }
    },

    onMouseUp: function (event) {
        //Logger.info("onMouseUp - point: " + event.point + " - delta: " + event.delta);
        this.hitTestEnabled = true;

        this.hideCenterLines();
        this.adjustmentDelta = null;

        var selected = this.getSelectedItems();

        var info = new MPlaza.PointingInfo();
        info.delta = event.delta;
        info.point = event.point;

        this.forceSelectedTextAreasToBounds();

        if (this.interactionMode == MPlaza.CustomizerInteractionMode.Select) {
            this.selectElement();
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Create) {

            if (this.elementType == MPlaza.CustomizerElementType.Text) {
                this.createElement(info);
            }
            else {
                this.onItemCreated(this.element);
                this.deselectAll();
                this.setItemSelection(this.element, true);
            }
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Move) {
            // TEST
            //this.restoreSelectionState(this.originalContent); // Provo ad annullare lo spostamento
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Rotate) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Resize) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Delete) {
            this.deleteSelection();
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.Edit) {
            this.editElement();
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathFirstEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathMiddleEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextOnPathLastEnd) {
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd) {
            this.onTextAreaGuidesUpdated(this.interactionMode);
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaRightEnd) {
            this.onTextAreaGuidesUpdated(this.interactionMode);
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaBottomEnd) {
            this.onTextAreaGuidesUpdated(this.interactionMode);
            this.onItemsUpdated(selected);
        } else if (this.interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaLeftEnd) {
            this.onTextAreaGuidesUpdated(this.interactionMode);
            this.onItemsUpdated(selected);
        }

        this.updateSelectionState();
        this.paper.project.view.update();
    },

    hitTest: function (point) {
        if (this.frozen)
            return;

        //var hitSize = 4.0; // / this.paper.view.zoom;
        //var hitSize = 8;

        var hitSize = 8;

        if (this.isMobile && (this.getSelectedTextItemsInfo().isTextOnPath || this.getSelectedTextItemsInfo().isTextArea))
            hitSize = 25 / this.paper.view.zoom;

        var customizer = this;

        this.hitItem = null;

        // Hit test items.
        if (point && this.paper.project.layers.length > 1) {


            var hit = this.paper.project.layers[1].hitTestAll(point, {
                fill: true, stroke: true, tolerance: hitSize, match: function (hit) {

                    // Ignore transparent pixels if we have an item inside an hole
                    if (hit.item instanceof customizer.paper.Raster) {
                        if (hit.item.getPixel(hit.offset.x, hit.offset.y).alpha == 0)
                            return false;
                    }

                    if (hit.item && hit.item.data && hit.item.data.guid && customizer.isItemStatic(hit.item))
                        return false;

                    if (hit.item && hit.item.data && hit.item.data.isMaskAlertPath)
                        return false;

                    if (customizer.mask && hit.item == customizer.mask || hit.item.isClippingArea)
                        return false;

                    return true;
                }
            });

            if (hit && hit.length > 0) {
                this.hitItem = hit[0].item;
            } else {
                // Check if we clicked a maskPath
                var items = this.getAllItems();
                for (var i = 0; i < items.length; i++) {
                    var mask = items[i];

                    if (mask.isMaskPath && mask.contains(point)) {
                        this.hitItem = mask;
                        return;
                    }
                }

            }
        }

        // Set cursor....
    },

    captureInitialSelectionState: function (point) {
        if (this.selectionBounds) {
            this.originalPositions = this.captureSelectionPosition();
            this.originalContent = this.captureSelectionState();

            this.pivot = this.selectionBounds.center.clone();
            this.corner = this.selectionBounds.bottomRight.clone();
            this.originalSize = this.corner.subtract(this.pivot);
            this.originalCenter = this.selectionBounds.center;
            this.originalShape = this.selectionBoundsShape.exportJSON({ asString: false });
            var delta = point.subtract(this.originalCenter);
            this.originalAngle = Math.atan2(delta.y, delta.x);

            // Snap cache (only one item at time)
            var items = this.getAllItems();
            var selectedItems = this.getSelectedItems();
            var areaItems = [];
            var area = selectedItems.length == 1 ? this.getItemArea(selectedItems[0]) : null;

            // Get area items
            for (i = 0; i < items.length; i++) {
                var item = items[i];

                if (item && item.data && item.data.guid && !item.data.isArea && !item.guide && item != selectedItems[0]) {
                    var designItem = this.findDesignItemForItem(item);

                    if (designItem.inOnArea(area))
                        areaItems.push(item);
                }
            }

            this.snapCache = {
                selectedItems: selectedItems,
                areaItems: areaItems,
                area: area,
                areaItem: this.findItemForArea(area)
            };
        }
    },

    clampView: function () {

        if (!this.imageItem)
            return;

        // Clamp position
        var clampDeltaX = 0;
        var clampDeltaY = 0;

        // Horizontal clamp
        if (this.imageItem.bounds.width <= paper.view.bounds.width) {
            if (paper.view.bounds.left > this.imageItem.bounds.left) {
                clampDeltaX = paper.view.bounds.left - this.imageItem.bounds.left;
            }

            if (paper.view.bounds.right < this.imageItem.bounds.right) {
                clampDeltaX = paper.view.bounds.right - this.imageItem.bounds.right;
            }
        } else {
            if (paper.view.bounds.left < this.imageItem.bounds.left) {
                clampDeltaX = paper.view.bounds.left - this.imageItem.bounds.left;
            }

            if (paper.view.bounds.right > this.imageItem.bounds.right) {
                clampDeltaX = paper.view.bounds.right - this.imageItem.bounds.right;
            }
        }

        // Vertical clamp
        if (this.imageItem.bounds.height <= paper.view.bounds.height) {

            if (paper.view.bounds.top > this.imageItem.bounds.top) {
                clampDeltaY = paper.view.bounds.top - this.imageItem.bounds.top;
            }

            if (paper.view.bounds.bottom < this.imageItem.bounds.bottom) {
                clampDeltaY = paper.view.bounds.bottom - this.imageItem.bounds.bottom;
            }
        } else {
            if (paper.view.bounds.top < this.imageItem.bounds.top) {
                clampDeltaY = paper.view.bounds.top - this.imageItem.bounds.top;
            }

            if (paper.view.bounds.bottom > this.imageItem.bounds.bottom) {
                clampDeltaY = paper.view.bounds.bottom - this.imageItem.bounds.bottom;
            }
        }

        paper.view.center = paper.view.center.subtract(new paper.Point(clampDeltaX, clampDeltaY));
    },

    // -------------------------------------------------------------
    // Keyboard Events
    // -------------------------------------------------------------
    onKeyDown: function (event) {
    },

    onKeyUp: function (event) {
        if (this.frozen)
            return;

        event.preventDefault();
        event.stopPropagation();

        var d = 1;
        if (event.modifiers.control)
            d = 0.5;

        if (event.key == "delete") {
            this.deleteSelection();
        }
        else if (event.key == "right") {
            this.moveSelectionByDelta(d, 0);
        } else if (event.key == "left") {
            this.moveSelectionByDelta(-d, 0);
        } else if (event.key == "up") {
            this.moveSelectionByDelta(0, -d);
        } else if (event.key == "down") {
            this.moveSelectionByDelta(0, d);
        }
    },

    // -------------------------------------------------------------
    // Element creation and modification
    // -------------------------------------------------------------
    getItemAtPoint: function (point) {
        var item = null;

        var hitSize = 4.0;
        if (this.paper.view.zoom > 1)
            hitSize = 0;

        var hit = null;

        // Hit test items.
        if (point) {
            var hitTest = this.paper.project.hitTest(point, {
                fill: true, stroke: true, tolerance: hitSize, match: function (hit) {

                    if (customizer.mask && hit.item == customizer.mask || hit.item.isClippingArea)
                        return false;

                    return true;
                }
            });

            if (hitTest.item) {
                var rootItem = this.getRootDesignItemCanvasItem(hitTest.item);
                if (rootItem) {
                    item = rootItem;
                } else {
                    item = hitTest.item;
                }
            }
        }
        return item;
    },

    selectItemAtPoint: function (point) {
        if (!point)
            this.deselectAll();

        var item = this.getItemAtPoint(point);

        if (!item || item == this.imageItem || (item.data && item.data.isArea)) {

            this.deselectAll();
            return;
        }

        this.setItemSelection(item, true);
    },

    selectElement: function () {
        // 05/04/2017: Changed the code for avoid the re-firing of selection change event on the same element (if I click on already selected element)
        if (this.hitItem) {
            var rootItem = this.getRootDesignItemCanvasItem(this.hitItem);

            // Current selected item
            var selectedItems = this.getSelectedItems();
            var selectedItem = selectedItems.length > 0 ? selectedItems[0] : null;

            var designItem = this.findDesignItemForItem(rootItem);

            if (!designItem)
                return;

            // If the clicked item is not the current selected item
            if (rootItem && (selectedItem == null || selectedItem != rootItem)) {

                this.element = rootItem;

                if (this.isItemStatic(this.element))
                    return;

                this.deselectAll();
                this.setItemSelection(this.element, true);

                // Deselect previous selected item
                if (selectedItem)
                    this.setItemSelection(selectedItem, false);
            }
        } else {
            this.deselectAll();
        }
    },

    createElement: function (info) {
        if (this.frozen || !this.mouseStartPos)
            return;

        if (this.elementType == MPlaza.CustomizerElementType.Rectangle) {
            this.createRectangle(info);
        } else if (this.elementType == MPlaza.CustomizerElementType.Oval) {
            this.createEllipse(info);
        } else if (this.elementType == MPlaza.CustomizerElementType.Free) {
            this.createFreeHand(info);
        } else if (this.elementType == MPlaza.CustomizerElementType.Text) {
            this.createText(info);
        }
    },

    createRectangle: function (info) {
        if (!info.point)
            return;

        var point = info.point;

        if (this.element)
            this.element.remove();

        if (this.mouseStartPos && point) {
            var p1 = this.mouseStartPos;
            var p2 = point;

            this.element = new this.paper.Path.Rectangle(p1, p2);
            this.element.strokeColor = 'black';
            this.element.strokeWidth = 1.0;
            this.element.fillColor = 'lavender';

            Logger.info("Rectangle created");
        }

        this.paper.project.view.update();
    },

    createEllipse: function (info) {
        if (!info.point)
            return;

        var point = info.point;

        if (this.element)
            this.element.remove();

        if (this.mouseStartPos && point) {
            var p1 = this.mouseStartPos;
            var p2 = point;

            var rectangle = new this.paper.Rectangle(p1, p2);
            this.element = new this.paper.Path.Ellipse(rectangle);
            this.element.strokeColor = 'black';
            this.element.strokeWidth = 1.0;
            this.element.fillColor = 'lavender';

            Logger.info("Ellipse created");
        }

        this.paper.project.view.update();
    },

    createLine: function (info) {
        if (!info.point)
            return;

        var point = info.point;

        if (this.element)
            this.element.remove();

        if (this.mouseStartPos && point) {
            var p1 = this.mouseStartPos;
            var p2 = point;

            this.element = new this.paper.Path.Line(p1, p2);
            this.element.strokeColor = 'black';
            this.element.strokeWidth = 1.0;

            Logger.info("Line created");
        }

        this.paper.project.view.update();
    },

    createFreeHand: function (info) {
        if (!info.point)
            return;

        var point = info.point;

        if (point) {
            if (!this.element) {
                this.element = new this.paper.Path();
                var rect = new this.paper.Rectangle(point.x - 2, point.y - 2, 4, 4);
                this.element.strokeColor = 'black';
                this.element.strokeWidth = 1.0;
                this.element.fillColor = 'lavender';
            }
            this.element.add(point);
            this.paper.project.view.update();
        }
    },

    sendSelectionToBack: function () {
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.sendToBack();
        }
        if (this.imageItem)
            this.imageItem.sendToBack();

        this.onItemsUpdated(items);
        this.updateAlwaysOnTopItemsIndexes();
        this.updateSelectionState();
        this.paper.project.view.update();
    },

    bringSelectionToFront: function () {
        var items = this.getSelectedItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.bringToFront();
        }

        this.onItemsUpdated(items);
        this.updateAlwaysOnTopItemsIndexes();
        this.updateSelectionState();
        this.paper.project.view.update();
    },

    moveSelectionToCenter: function () {
        if (!this.canMoveSelection())
            return;

        var selected = this.getSelectedItems();

        var area = null;
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            var areas = this.getAreasIntersectingOrContainingItem(item);
            if (areas.length > 1 || areas.length == 0)
                return;
            if (area == null)
                area = areas[0];
            else
                if (area.get("areaID") != areas[0].get("areaID"))
                    return;
        }

        if (area) {
            var areaItem = this.findItemForArea(area);
            if (areaItem) {
                for (i = 0; i < selected.length; i++) {
                    item = selected[i];
                    var delta = areaItem.position.subtract(item.position);
                    item.position.x = areaItem.position.x;
                    item.position.y = areaItem.position.y;
                    item.data.needsTransformsDataUpdate = true;

                    // Image Original Bounds & Matrix
                    // Nel caso di immagine, applico la trasformazione alla matrice originaria
                    // relativa al contorno dell'immagine inizialmente caricata (e che potrebbe essere sostituita)
                    if (item instanceof this.paper.Raster && item.data && item.data.originalMatrix) {
                        item.data.originalMatrix.translate(delta.x, delta.y);
                    }
                    // ------------------------

                    this.onTextOnPathMoved(item, delta);
                    this.onTextAreaMoved(item, delta);
                }

                this.onItemsUpdated(selected);
                this.updateSelectionState();
                this.paper.project.view.update();
            }
        }
    },

    moveSelectionByDelta: function (dx, dy) {
        if (this.frozen || !this.canMoveSelection())
            return;

        this.removeSelectionAlertItems();

        var delta = new this.paper.Point(dx, dy);
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            selected[i].position = selected[i].position.add(delta);

            // Image Original Bounds & Matrix
            // Nel caso di immagine, applico la trasformazione alla matrice originaria
            // relativa al contorno dell'immagine inizialmente caricata (e che potrebbe essere sostituita)            
            if (selected[i] instanceof this.paper.Raster && selected[i].data && selected[i].data.originalMatrix) {
                selected[i].data.originalMatrix.translate(delta.x, delta.y);
            }
            // ------------------------

            this.onTextOnPathMoved(selected[i], delta);
            this.onTextAreaMoved(selected[i], delta);
        }

        this.onItemsUpdated(selected);
        this.updateSelectionState();
        this.paper.project.view.update();
    },

    moveSelectionUp: function () {
        if (!this.canMoveSelection())
            return;

        this.moveSelectionByDelta(0, -2);
    },

    moveSelectionDown: function () {
        if (!this.canMoveSelection())
            return;

        this.moveSelectionByDelta(0, 2);
    },

    moveSelectionLeft: function () {
        if (!this.canMoveSelection())
            return;

        this.moveSelectionByDelta(-2, 0);
    },

    moveSelectionRight: function () {
        if (!this.canMoveSelection())
            return;

        this.moveSelectionByDelta(2, 0);
    },

    moveSelection: function (info) {
        if (this.frozen || !this.canMoveSelection())
            return;

        if (!info.delta)
            return;

        var delta = info.delta;

        this.hideCenterLines();

        // Se c'è stato uno spostamento forzato per lo snapping al centro
        // compenso tale forzatura
        if (this.adjustmentDelta != null) {
            delta.x -= this.adjustmentDelta.x;
            delta.y -= this.adjustmentDelta.y;
        }

        this.removeSelectionAlertItems();

        var selected = this.getSelectedItems();
        if (selected.length == 0)
            return;

        for (var i = 0; i < selected.length; i++) {
            selected[i].position.x += delta.x;
            selected[i].position.y += delta.y;

            // Image Original Bounds & Matrix
            // Nel caso di immagine, applico la trasformazione alla matrice originaria
            // relativa al contorno dell'immagine inizialmente caricata (e che potrebbe essere sostituita)            
            if (selected[i] instanceof this.paper.Raster && selected[i].data && selected[i].data.originalMatrix) {
                selected[i].data.originalMatrix.translate(delta.x, delta.y);
            }
            // ------------------------

            this.onTextOnPathMoved(selected[i], delta);
            this.onTextAreaMoved(selected[i], delta);
        }

        this.moveSelectionShapes(delta);
        this.snapToCenter();
        this.snapToItems();
        this.updateTextOnPathGuides(selected);
        this.updateTextAreaGuides(selected);

        if (this.adjustmentDelta && (this.adjustmentDelta.x != 0 || this.adjustmentDelta.y != 0))
            this.moveSelectionShapes(this.adjustmentDelta);

        // Update mask position & Update eventual loading circles position
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].data.maskPath)
                selected[i].data.maskPath.position = selected[i].position;

            if (selected[i].loadingCircle)
                selected[i].loadingCircle.position = selected[i].bounds.center;
        }
    },

    /*
    moveSelection: function (event) {
        if (this.frozen)
            return;

        var point = event.point;
        this.hideCenterLines();

        this.removeSelectionAlertItems();
        var selected = this.getSelectedItems();
        if (selected.length == 0)
            return;

        this.restoreSelectionState(this.originalContent);

        var delta = point.subtract(this.mouseStartPos);
        if (event.modifiers.shift) {
            delta = this.snapDeltaToAngle(delta, Math.PI * 2 / 4);
        }

        for (var i = 0; i < selected.length; i++) {
            selected[i].position.x += delta.x;
            selected[i].position.y += delta.y;
        }

        this.updateSelectionState();
        this.paper.project.view.update();

        this.snapToCenter();
    },
    */

    snapToCenter: function () {
        if (!this.adjustmentDelta)
            this.adjustmentDelta = new this.paper.Point(0, 0);

        this.adjustmentDelta.x = 0;
        this.adjustmentDelta.y = 0;

        var eps = 3 / this.paper.view.zoom;


        if (this.snapCache && this.snapCache.area && this.snapCache.areaItem) {
            var areaItem = this.snapCache.areaItem;
            var selected = this.snapCache.selectedItems;
            var areaBounds = areaItem.bounds;
            var rect = this.selectionBounds;
            var center = areaBounds.center;

            var xPoints = [new this.paper.Point(rect.left, rect.center.y),
            rect.center,
            new this.paper.Point(rect.right, rect.center.y)];

            var yPoints = [new this.paper.Point(rect.center.x, rect.top),
            rect.center,
            new this.paper.Point(rect.center.x, rect.bottom)];

            var minAbsDeltaX = null;
            var minDeltaX = null;
            for (var i = 0; i < xPoints.length; i++) {
                var xPoint = xPoints[i];

                var delta = xPoint.x - center.x;
                var absDelta = Math.abs(delta);

                if (minAbsDeltaX == null || absDelta < minAbsDeltaX) {
                    minAbsDeltaX = absDelta;
                    minDeltaX = delta;
                }
            }

            var minAbsDeltaY = null;
            var minDeltaY = null;
            for (var i = 0; i < yPoints.length; i++) {
                var yPoint = yPoints[i];

                var delta = yPoint.y - center.y;
                var absDelta = Math.abs(delta);

                if (minAbsDeltaY == null || absDelta < minAbsDeltaY) {
                    minAbsDeltaY = absDelta;
                    minDeltaY = delta;
                }
            }

            var deltaX = null;
            if (minAbsDeltaX <= eps)
                deltaX = minDeltaX;
            var deltaY = null;
            if (minAbsDeltaY <= eps)
                deltaY = minDeltaY;

            this.adjustmentDelta.x = deltaX != null ? -deltaX : 0;
            this.adjustmentDelta.y = deltaY != null ? -deltaY : 0;

            for (var i = 0; i < selected.length; i++) {
                if (deltaX != null)
                    selected[i].position.x -= deltaX;
                if (deltaY != null)
                    selected[i].position.y -= deltaY;
                if (deltaX != null || deltaY != null) {
                    this.onTextOnPathMoved(selected[i], this.adjustmentDelta);
                    this.onTextAreaMoved(selected[i], this.adjustmentDelta);
                }

                // Image Original Bounds & Matrix
                // Nel caso di immagine, applico la trasformazione alla matrice originaria
                // relativa al contorno dell'immagine inizialmente caricata (e che potrebbe essere sostituita)                
                if (selected[i] instanceof this.paper.Raster && selected[i].data && selected[i].data.originalMatrix) {
                    if (deltaX != null)
                        selected[i].data.originalMatrix.translate(-deltaX, 0);
                    if (deltaY != null)
                        selected[i].data.originalMatrix.translate(0, -deltaY);
                }
                // ------------------------                    
            }

            if (deltaX != null || deltaY != null) {
                if (deltaX != null) {
                    this.showVerticalCenterLine(areaBounds);
                }
                if (deltaY != null) {
                    this.showHorizontalCenterLine(areaBounds);
                }
            }

            /*
            this.updateSelectionState();
            this.paper.project.view.update();
            */
        }
    },

    snapToItems: function () {

        var eps = 3 / this.paper.view.zoom;

        if (this.snapCache.selectedItems.length == 0)
            return;

        if (this.snapCache && this.snapCache.area && this.snapCache.areaItem) {
            var areaItem = this.snapCache.areaItem;
            var selected = this.snapCache.selectedItems;
            var items = this.getAllItems();
            var deltaX = null;
            var deltaY = null;
            var absX = null;
            var absY = null;

            // Try to snap to one item
            for (i = 0; i < this.snapCache.areaItems.length; i++) {
                var item = this.snapCache.areaItems[i];
                var bounds = item.bounds;

                var myLeft = selected[0].bounds.leftCenter;
                var myRight = selected[0].bounds.rightCenter;
                var myTop = selected[0].bounds.topCenter;
                var myBottom = selected[0].bounds.bottomCenter;
                var myCenter = selected[0].bounds.center;

                // Center is at first position because is more important
                // and if two elements have equal size is better to show the center line and not the left or right
                var xPoints = [myCenter, myLeft, myRight];
                var yPoints = [myCenter, myTop, myBottom];

                var targetXPoints = [item.bounds.center, item.bounds.leftCenter, item.bounds.rightCenter];
                var targetYPoints = [item.bounds.center, item.bounds.topCenter, item.bounds.bottomCenter];

                // check horizontal align
                // we match if one of our left-center-right can snap to one of other item left-center-right

                for (var j = 0; j < xPoints.length; j++) {
                    var x = xPoints[j].x;
                    var targetX = targetXPoints[j].x;

                    if (Math.abs(x - targetX) < eps) {
                        Logger.info("found at " + targetX);
                        deltaX = x - targetX;
                        absX = targetX;
                        this.adjustmentDelta.x -= deltaX;
                        break;
                    }
                }

                for (j = 0; j < yPoints.length; j++) {
                    var y = yPoints[j].y;
                    var targetY = targetYPoints[j].y;

                    if (Math.abs(y - targetY) < eps) {
                        deltaY = y - targetY;
                        absY = targetY;
                        this.adjustmentDelta.y -= deltaY;
                        break;
                    }
                }


                if (deltaX != null || deltaY != null)
                    break;
            }


            for (var i = 0; i < selected.length; i++) {
                if (deltaX != null)
                    selected[i].position.x -= deltaX;
                if (deltaY != null)
                    selected[i].position.y -= deltaY;
                if (deltaX != null || deltaY != null) {
                    var dx = deltaX != null ? -deltaX : 0;
                    var dy = deltaY != null ? -deltaY : 0;
                    this.onTextOnPathMoved(selected[i], new this.paper.Point(dx, dy));
                    this.onTextAreaMoved(selected[i], new this.paper.Point(dx, dy));

                    // Image Original Bounds & Matrix
                    // Nel caso di immagine, applico la trasformazione alla matrice originaria
                    // relativa al contorno dell'immagine inizialmente caricata (e che potrebbe essere sostituita)                    
                    if (selected[i] instanceof this.paper.Raster && selected[i].data && selected[i].data.originalMatrix) {
                        selected[i].data.originalMatrix.translate(dx, dy);
                    }
                    // ------------------------                                                        
                }
            }

            if (deltaX != null || deltaY != null) {
                this.hideCenterLines();

                if (deltaX != null) {
                    this.showVerticalCenterLine(new this.paper.Rectangle(absX - 1, areaItem.bounds.topCenter.y, 1, areaItem.bounds.bottomCenter.y));
                }

                if (deltaY != null) {
                    this.showHorizontalCenterLine(new this.paper.Rectangle(areaItem.bounds.leftCenter.x, absY, areaItem.bounds.rightCenter.x, 1));
                }
            }

        }
    },

    showVerticalCenterLine: function (areaBounds) {
        var viewBounds = this.paper.project.view.bounds;
        this.verticalCenterLine = this.createGuideLine(new this.paper.Point(areaBounds.center.x, viewBounds.top),
            new this.paper.Point(areaBounds.center.x, viewBounds.bottom));

    },

    showHorizontalCenterLine: function (areaBounds) {
        var viewBounds = this.paper.project.view.bounds;
        this.horizontalCenterLine = this.createGuideLine(new this.paper.Point(viewBounds.left, areaBounds.center.y),
            new this.paper.Point(viewBounds.right, areaBounds.center.y));
    },

    createGuideLine: function (p1, p2) {
        // Create pixel perfect dotted rectable for drag selections.
        var half = new this.paper.Point(0.5 / this.paper.view.zoom, 0.5 / this.paper.view.zoom);
        var start = p1.add(half);
        var end = p2.add(half);

        var line = new this.paper.Path.Line(start, end);

        line.strokeColor = 'blue';
        line.strokeWidth = 1.0 / this.paper.view.zoom;
        line.dashOffset = 0.5 / this.paper.view.zoom;
        line.dashArray = [1.0 / this.paper.view.zoom, 1.0 / this.paper.view.zoom];
        line.blendMode = "xor";
        line.removeOn({
            drag: true,
            up: true
        });
        line.guide = true;
        return line;
    },

    hideCenterLines: function () {
        if (this.verticalCenterLine)
            this.verticalCenterLine.remove();
        if (this.horizontalCenterLine)
            this.horizontalCenterLine.remove();
        this.verticalCenterLine = null;
        this.horizontalCenterLine = null;
    },

    rotateSelection: function (info) {
        if (this.frozen || !this.canRotateSelection())
            return;

        if (!info.point)
            return;

        var point = info.point;

        this.removeSelectionAlertItems();
        this.hideCenterLines();

        // Actualy works with only one item
        var selectedItems = this.getSelectedItems();
        if (selectedItems.length != 1)
            return;

        var item = selectedItems[0];
        var delta = point.subtract(this.originalCenter);
        var angle = Math.atan2(delta.y, delta.x);

        var da = angle - this.originalAngle;

        this.restoreSelectionState(this.originalContent);

        var id = this.selectionBoundsShape.id;
        this.selectionBoundsShape.importJSON(this.originalShape);
        this.selectionBoundsShape._id = id;

        var originalDeg = this.originalAngle / Math.PI * 3.14;
        var deg = da / Math.PI * 180;

        // Snap 0,90,180,270
        var angles = [0, 90, 180, 270, 360, -90, -180, -270, -360];

        for (var i = 0; i < angles.length; i++) {
            var snapAngle = angles[i];

            if (Math.abs(deg + item.rotation - snapAngle) < 5) {
                deg = snapAngle - item.rotation;

                if (snapAngle == 0 || snapAngle == 180 || snapAngle == -180)
                    this.showHorizontalCenterLine(item.bounds);

                if (snapAngle == 90 || snapAngle == -90)
                    this.showVerticalCenterLine(item.bounds);
            }
        }


        this.selectionBoundsShape.rotate(deg, this.originalCenter);
        this.createSelectionHandles();
        this.placeHandleOut(this.selectionBoundsShape);

        //if (this.isItemGroup(item)) continue;

        if (item.guide) return;
        item.rotate(deg, this.originalCenter);

        // Image Original Bounds & Matrix
        // Nel caso di immagine, applico la trasformazione alla matrice originaria
        // relativa al contorno dell'immagine inizialmente caricata (e che potrebbe essere sostituita)        
        if (item instanceof this.paper.Raster && item.data && item.data.originalMatrix) {
            item.data.originalMatrix.rotate(deg, this.originalCenter);
        }
        // ------------------------

        this.onTextOnPathRotated(item, deg, this.originalCenter);
        this.onTextAreaRotated(item, deg, this.originalCenter);

        this.updateTextOnPathGuides(selectedItems);
        this.updateTextAreaGuides(selectedItems);
    },

    rotateSelectionAngle: function (angle) {
        this.removeSelectionAlertItems();
        this.restoreSelectionState(this.originalContent);
        var id = this.selectionBoundsShape.id;
        this.selectionBoundsShape.importJSON(this.originalShape);
        this.selectionBoundsShape._id = id;

        this.selectionBoundsShape.rotate(angle, this.originalCenter);
        this.createSelectionHandles();

        selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide) continue;
            item.rotate(angle, this.originalCenter);

            // Image Original Bounds & Matrix
            // Nel caso di immagine, applico la trasformazione alla matrice originaria
            // relativa al contorno dell'immagine inizialmente caricata (e che potrebbe essere sostituita)            
            if (item instanceof this.paper.Raster && item.data && item.data.originalMatrix) {
                item.data.originalMatrix.rotate(angle, this.originalCenter);
            }
            // ------------------------

            this.onTextOnPathRotated(item, angle, this.originalCenter);
            this.onTextAreaRotated(item, angle, this.originalCenter);
        }
        this.updateTextOnPathGuides(selected);
        this.updateTextAreaGuides(selected);
    },

    resizeSelection: function (info) {
        if (this.frozen || !this.canResizeSelection())
            return;

        if (!info.point)
            return;

        this.removeSelectionAlertItems();
        var selected = this.getSelectedItems();
        if (selected.length == 0)
            return;

        var pivot = this.originalCenter.clone();

        var currentSize = this.corner.subtract(pivot);

        var point = info.point;

        var compensatedPoint = new this.paper.Point();
        compensatedPoint.x = point.x - this.selectionResizeHandle.bounds.width / 2;
        compensatedPoint.y = point.y - this.selectionResizeHandle.bounds.width / 2;

        var pt = this.projectPointOnLine(pivot, this.corner, compensatedPoint, false);
        if (pt.subtract(pivot).length < 0.1)
            return;

        var newDelta = pt.subtract(this.corner);

        this.corner.x += newDelta.x;
        this.corner.y += newDelta.y;

        var size = this.corner.subtract(pivot);

        var sx = 1.0, sy = 1.0;
        if (Math.abs(currentSize.x) > 0.0000001)
            sx = size.x / currentSize.x;
        if (Math.abs(currentSize.y) > 0.0000001)
            sy = size.y / currentSize.y;

        this.scaleSelectedItems(sx, sy, pivot);
    },

    projectPointOnLine: function (pt1, pt2, pt0, invert) {
        var pt = new this.paper.Point(0, 0);
        if (pt1.x == pt2.x)
            return pt1;

        var m = (pt2.y - pt1.y) / (pt2.x - pt1.x);             // Coefficiente angolare
        var q = (pt2.x * pt1.y - pt1.x * pt2.y) / (pt2.x - pt1.x); // Ordinata all'origine

        var d = pt0.y - m * pt0.x - q;

        if (!invert) {
            if (d > 0) {
                pt.y = pt0.y;
                pt.x = (pt0.y - q) / m;
            }
            else if (d < 0) {
                pt.x = pt0.x;
                pt.y = m * pt0.x + q;
            }
            else {
                // Sulla retta
                pt = pt0;
            }
        }
        else {
            if (d > 0) {
                pt.x = pt0.x;
                pt.y = m * pt0.x + q;
            }
            else if (d < 0) {
                pt.y = pt0.y;
                pt.x = (pt0.y - q) / m;
            }
            else {
                // Sulla retta
                pt = pt0;
            }
        }

        return pt;
    },


    scaleSelectedItems: function (sx, sy, pivot) {
        if (!this.canResizeSelection())
            return;

        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];
            if (item.guide) continue;
            item.scale(sx, sy, pivot);
            item.data.needsTransformsDataUpdate = true;

            // Image Original Bounds & Matrix
            // Nel caso di immagine, applico la trasformazione alla matrice originaria
            // relativa al contorno dell'immagine inizialmente caricata (e che potrebbe essere sostituita)            
            if (item instanceof this.paper.Raster && item.data && item.data.originalMatrix) {
                item.data.originalMatrix.scale(sx, sy, pivot);
            }
            // ------------------------

            this.onTextOnPathScaled(item, sx, sy, pivot);
            this.onTextAreaScaled(item, sx, sy, pivot);
        }
        this.scaleSelectionShapes(sx, sx, pivot);
        this.updateTextOnPathGuides(selected);
        this.updateTextAreaGuides(selected);
        /*
        this.updateSelectionState();
        this.paper.project.view.update();
        */
    },

    deleteSelection: function () {
        if (!this.canDeleteSelection())
            return;

        this.removeSelectionAlertItems();
        var selected = this.getSelectedItems();
        for (var i = 0; i < selected.length; i++) {
            var item = selected[i];

            var designItem = this.findDesignItemForItem(item);
            if (designItem)
                this.fireDesignItemRemovingEvent(designItem);

            this.onItemRemoved(item);
            item.remove();
            this.setItemSelection(item, false);
        }
        this.updateSelectionState();
        this.paper.project.view.update();
    },

    editElement: function () {
        if (this.frozen || !this.mouseStartPos)
            return;

        if (this.elementType == MPlaza.CustomizerElementType.Text) {
            this.editText();
        }
    },

    updateItemSyncGuid: function (item, guid) {
        var designItem = this.findDesignItemForItem(item);

        if (designItem)
            designItem.set("syncGuid", guid);
    },

    getContrastedColor: function (rect) {
        var color = 'black';
        if (this.imageItem) {
            rect.height = Math.max(1, rect.height);
            rect.width = Math.max(1, rect.width);
            try {
                var avgColor = this.imageItem.getAverageColor(rect);
                if (avgColor) {
                    color = MPlaza.getContrastYIQ(avgColor.red * 255, avgColor.green * 255, avgColor.blue * 255);
                }
            } catch (e) {
                console.trace("error getting image avarage color " + e.message);
            }
        }
        return color;
    },

    insertSVGFromUrl: function (url) {
        /*
                $.ajax({
                    url: url,
                    type: 'GETT',
                    success: function () {
                        window.location = 'download.php';
                    }
                });
        */
        var customizer = this;
        $.ajax({
            url: url,
        })
            .done(function (data) {
                customizer.insertSVG(data);
            });
    },

    // Da rivedere
    insertSVG: function (svg) {
        if (this.side) {

            var area = this.side.get("areas").getMaxArea();
            if (area) {
                var item = this.paper.project.activeLayer.importSVG(svg);
                this.onItemCreated(item);

                // Test Detect colors
                this.detectItemColors(item);
                // ------------------

                // centro l'elemento all'interno dell'area
                var areaItem = this.findItemForArea(area);
                if (areaItem) {
                    item.position = areaItem.position;

                    var itemBounds = item.bounds;
                    var areaBounds = areaItem.bounds;

                    if (areaBounds.intersects(itemBounds) ||
                        itemBounds.contains(areaBounds)) {

                        var targetBounds = areaBounds.clone();
                        targetBounds.width *= 0.8;
                        targetBounds.height *= 0.8;

                        var sx = 1.0;
                        var sy = 1.0;
                        if (Math.abs(targetBounds.width) > 0.0000001)
                            sx = targetBounds.width / itemBounds.width;
                        if (Math.abs(targetBounds.height) > 0.0000001)
                            sy = targetBounds.height / itemBounds.height;

                        var signx = sx > 0 ? 1 : -1;
                        var signy = sy > 0 ? 1 : -1;
                        sx = sy = Math.min(Math.abs(sx), Math.abs(sy));
                        sx *= signx;
                        sy *= signy;

                        item.scale(sx, sy);
                        this.onItemUpdated(item);
                        this.onDesignItemChanged(item);
                    }
                }
            }
        }
    },

    detectItemColors: function (item) {
        var colors = [];

        var checkItem = function (parent) {
            if (parent.fillColor) {
                var color = parent.fillColor.toCSS(true);
                if (!_.contains(colors, color))
                    colors.push(color);
            }

            if (parent.children) {
                for (var i = 0; i < parent.children.length; i++) {
                    var child = parent.children[i];
                    checkItem(child);
                }
            }
        }

        checkItem(item);

        for (var i = 0; i < colors.length; i++) {
            Logger.info("Color: " + colors[i]);
        }
    },

    // -------------------------------------------------------------
    // Images
    // -------------------------------------------------------------
    insertImage: function (image, callback) {

        if (!image || !(image instanceof MPlaza.Image))
            return;

        if (!this.canAddImage())
            return;

        // Inserimento immagine
        var url = image.get("previewUrl");
        if (!url)
            return;

        if (this.side) {

            var area = this.side.get("areas").getMaxArea();
            if (area) {

                //var item = new this.paper.Raster(url);

                var item = new this.paper.Raster({
                    crossOrigin: "anonymous",
                    source: url
                });

                item.data.originalImageID = image.id;

                var customizer = this;

                item.onLoad = function () {

                    var designItem = customizer.onItemCreated(item, image);
                    var model = customizer.getCurrentModel();

                    // centro l'elemento all'interno dell'area
                    var areaItem = customizer.findItemForArea(area);
                    if (areaItem) {
                        item.position = areaItem.position;

                        var itemBounds = item.bounds;
                        var areaBounds = areaItem.bounds;

                        if (areaBounds.intersects(itemBounds) ||
                            itemBounds.contains(areaBounds)) {

                            var targetBounds = areaBounds.clone();
                            targetBounds.width *= 0.8;
                            targetBounds.height *= 0.8;

                            var sx = 1.0;
                            var sy = 1.0;
                            if (Math.abs(targetBounds.width) > 0.0000001)
                                sx = targetBounds.width / itemBounds.width;
                            if (Math.abs(targetBounds.height) > 0.0000001)
                                sy = targetBounds.height / itemBounds.height;

                            var signx = sx > 0 ? 1 : -1;
                            var signy = sy > 0 ? 1 : -1;
                            sx = sy = Math.min(Math.abs(sx), Math.abs(sy));
                            sx *= signx;
                            sy *= signy;

                            // If the image has a fixed size
                            if (model && customizer.design && customizer.design instanceof MPlaza.Design &&
                                model.get("printTypes") instanceof MPlaza.PrintTypes) {

                                //Since print types per areas are not yet supported, just take the first area (the print type of that area's side side will be taken)
                                area = customizer.side.get("areas").at(0);
                                var printType = customizer.getSelectedPrintType(area);

                                if (!printType)
                                    printType = model.get("printTypes").getPrintType(customizer.design.getSelectedPrintTypeForArea(area));

                                var useImagesFixedSize = null;

                                if (printType instanceof MPlaza.PartPrintType) {
                                    var restrictions = printType.get("restrictions");
                                    useImagesFixedSize = restrictions ? restrictions.get("useImagesFixedSize") : null;
                                }

                                if (useImagesFixedSize == null)
                                    useImagesFixedSize = model.get("printTypes").getPrintType(printType.get("printTypeID")).get("useImagesFixedSize");

                                if (useImagesFixedSize == true && designItem.get("imagePreferredWidth") && designItem.get("imagePreferredHeight")) {

                                    var ppcm = customizer.side.get("ppcm");
                                    var ppmm = ppcm / 10;
                                    var preferredWidth = designItem.get("imagePreferredWidth") * ppmm;
                                    var preferredHeight = designItem.get("imagePreferredHeight") * ppmm;
                                    sx = preferredWidth / itemBounds.width;
                                    sy = preferredHeight / itemBounds.height;
                                }
                            }

                            item.scale(sx, sy);

                            // Image Original Bounds & Matrix
                            // Tra i metadati dell'item salvo il bounds originale dell'immagine e la trasformazione applicata
                            // La matrice di trasformazone viene mantenuta aggiornata ad ogni trasformazione applicata all'oggetto
                            // Questi dati verranno utilizzati quando il contenuto dell'immagine è sostituito con il contenuto
                            // di una nuova. Se le dimensioni non sono le stesse, all'immagine sostitutiva verrà applicata
                            // una trasformazione in modo che resti nell'ambito degli stessi contorni iniziali.
                            item.data.originalBounds = new customizer.paper.Rectangle(0, 0, item.width, item.height);
                            item.data.originalMatrix = item.matrix.clone();
                            // -------------------------

                            customizer.onItemUpdated(item);
                            customizer.onDesignItemChanged(item);
                        }
                    }

                    if (callback) callback(item);

                    if (customizer.mask)
                        customizer.mask.bringToFront();

                    customizer.masterGroup.addChild(item);
                    customizer.updateAlwaysOnTopItemsIndexes();
                    customizer.onItemUpdated(item);
                    customizer.onDesignItemChanged(item);
                    customizer.fireImageLoadedEvent();
                };
            }
        }
    },

    // Rimpiazza il contenuto dell'immagine, preservando i limiti dell'immagine originaria
    // per far questo, viene utilizzato il rettangolo che racchiude l'immagine iniziale e 
    // quello che racchiude la nuova immagine, tenendo conto delle dovute trasformazioni (matrici)
    replaceSelectedImage: function (image, callback) {
        if (!image || !(image instanceof MPlaza.Image) || !this.design)
            return;

        // Inserimento immagine
        var url = image.get("previewUrl");
        if (!url)
            return;

        var items = this.getSelectedImageItems();
        if (items && items.length > 0) {
            var item = items[0];

            if (!this.canEditItem(item))
                return;

            this.replaceImage(item, image, callback);

            console.log("Replacing image: ", item);
        }
    },

    replaceImageByGuid: function (guid, image, callback) {
        var item = this.findItemByGuid(guid);
        if (item)
            this.replaceImage(item, image, callback);
    },

    replaceImage: function (item, image, callback) {

        if (!this.canEditItem(item))
            return;

        var url = image.get("previewUrl");
        if (!url)
            return;

        var customizer = this;

        var designItem = this.findDesignItemByGuid(item.data.guid);
        if (designItem) {
            var currentImageID = designItem.get("imageID");
            if (currentImageID !== image.get("imageID")) {

                var oldWidth = item.width;
                var oldHeight = item.height;

                // Image Original Bounds & Matrix
                // Calcolo le dimensioni del contorno iniziale trasformato
                if (item.data.originalBounds && item.data.originalMatrix) {
                    var boundsItem = new this.paper.Path.Rectangle(item.data.originalBounds);
                    boundsItem.visible = false;
                    boundsItem.matrix = item.data.originalMatrix.clone();
                    var oldSize = this.getRectangleItemSize(boundsItem);
                    boundsItem.remove();
                    oldWidth = oldSize.width;
                    oldHeight = oldSize.height;
                }
                // -----------------------------

                var matrix = item.matrix;

                // sostituisco il contenuto dell'immagine mantentendo inalterate le trasformazioni
                item.crossOrigin = "anonymous";
                item.source = url;

                item.onLoad = function () {
                    item.matrix = matrix;

                    // Scalo eventualmente l'immagine per farla rientrare nel contorno dell'immagine iniziale
                    var newBoundsItem = new customizer.paper.Path.Rectangle(0, 0, item.width, item.height);
                    newBoundsItem.visible = false;
                    newBoundsItem.matrix = matrix.clone();
                    var newSize = customizer.getRectangleItemSize(newBoundsItem);
                    newBoundsItem.remove();

                    var newWidth = newSize.width;
                    var newHeight = newSize.height;

                    if (newWidth != oldWidth || newHeight != oldHeight) {
                        var sx = 1.0, sy = 1.0;

                        if (Math.abs(newWidth) > 0.0000001)
                            sx = oldWidth / newWidth;
                        if (Math.abs(newHeight) > 0.0000001)
                            sy = oldHeight / newHeight;

                        var scale = Math.min(sx, sy);
                        item.scale(scale, scale);
                    }

                    customizer.updateImageDesignItem(item, designItem, image);
                    customizer.updateSelectionState();
                    customizer.paper.project.view.update();

                    if (callback)
                        callback(item);

                    customizer.fireImageLoadedEvent();
                };
            }
        }
    },

    updateAlwaysOnTopItemsIndexes: function () {
        var topItems = this.design.getSideDesignItems(this.side)
            .sort((a, b) => { return a.get("index") > b.get("index") })
            .map(x => this.findItemForDesignItem(x))
            .filter(item => { return this.isAlwaysOnTop(item) });

        topItems.forEach(item => item.bringToFront());
        topItems.forEach(item => this.onItemUpdated(item));
    },

    // funzione di utilità che restituisce le dimensioni di un item rettangolo
    // calcolando le lunghezze dei segmenti che ne costituiscono l'altezza e la larghezza.
    // Nel caso di elemento ruotato, le dimensioni sono ovviamente diverse da quelle
    // normalmente restituite dal bounding box
    getRectangleItemSize: function (rectangle) {
        var width = 0;
        var height = 0;
        var segments = rectangle.segments;
        if (segments.length == 4) {
            var bottomLeft = segments[0].point;
            var topLeft = segments[1].point;
            var topRight = segments[2].point;
            var bottomRight = segments[3].point;

            width = topRight.subtract(topLeft).length;
            height = bottomLeft.subtract(topLeft).length;
        }
        return new this.paper.Size(width, height);
    },

    modifySelectedImageElementColors: function (colorChanges) {
        var items = this.getSelectedItems();
        if (items && items.length > 0) {
            var item = items[0];
            this.modifyImageElementColors(item, colorChanges);
        }
    },

    modifyImageElementColors: function (item, colorChanges) {
        if (this.design && item && item instanceof this.paper.Raster && Object.prototype.toString.call(colorChanges) === '[object Array]') {
            var customizer = this;
            var designItem = this.findDesignItemByGuid(item.data.guid);

            if (designItem && designItem instanceof MPlaza.DesignItem && designItem.get("imageID") > 0) {

                var imageID = designItem.get("imageID");

                // funzione che aggiorna l'url del raster item
                var setImageData = function (imageData) {
                    if (imageData) {
                        var url = 'data:image/png;base64,' + imageData;

                        var matrix = item.matrix;
                        item.crossOrigin = "anonymous";
                        item.source = url;
                        item.onLoad = function () {
                            item.matrix = matrix;

                            // imposto i cambi di colore
                            for (var idx = 0; idx < colorChanges.length; idx++) {
                                var colorChange = colorChanges[idx];
                                if (colorChange instanceof MPlaza.ColorChange)
                                    designItem.changeColor(imageID, colorChange.get("colorID"), colorChange.get("code"));
                                else if (colorChange.hasOwnProperty("colorID") && colorChange.hasOwnProperty("code")) {
                                    designItem.changeColor(imageID, colorChange["colorID"], colorChange["code"]);
                                }
                            }
                            customizer.onItemUpdated(item);
                            customizer.onDesignItemChanged(item);
                            customizer.updateSelectionState();
                            customizer.paper.project.view.update();
                            customizer.fireImageLoadedEvent();
                        };
                    }
                };

                // Recupero i bytes dell'immagine ricolorata
                try {
                    var recoloredImage = new MPlaza.RecoloredImage();
                    recoloredImage.set("imageID", imageID);
                    recoloredImage.set("versionKey", "preview");
                    for (var i = 0; i < colorChanges.length; i++) {
                        var colorChange = colorChanges[i];
                        if (colorChange instanceof MPlaza.ColorChange)
                            recoloredImage.get("colorChanges").push(colorChange);
                        else if (colorChange.hasOwnProperty("colorID") && colorChange.hasOwnProperty("code")) {
                            var change = new MPlaza.ColorChange(colorChange);
                            recoloredImage.get("colorChanges").push(change);
                        }
                    }

                    recoloredImage.save(null, {
                        success: function (model, response, options) {

                            if (model && model.get("imageID")) {
                                setImageData(recoloredImage.get("imageData"));
                                customizer.updateDesignItemColors(designItem, recoloredImage.get("imageColors"));
                            } else {
                                Logger.info("Errore nella lettura dei dati! " + model.get("message"));
                            }
                        },
                        error: function (model, response, options) {
                            Logger.info("Errore nella lettura dei dati");
                        }
                    });

                } catch (e) {
                    Logger.info(e);
                }
            }
        }
    },

    modifySelectedImageElementsColors: function (colorChanges) {
        if (this.design && Object.prototype.toString.call(colorChanges) === '[object Array]') {

            var customizer = this;
            var items = this.getSelectedImageItems();
            if (items.length == 0)
                return;

            // Recupero i design items relativi agli elementi selezionati
            // e determino l'id comune dell'immagine
            var imageID = null;
            var designItemsHash = {};
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var designItem = this.findDesignItemByGuid(item.data.guid);
                var id = designItem.get("imageID");
                if (imageID == null)
                    imageID = id;
                else if (imageID != id) {
                    // Problema: immagini con id diversi
                    return;
                }
                designItemsHash[item.data.guid] = designItem;
            }

            // funzione che aggiorna l'url di tutti i raster item
            // e inserisce i cambi di colore nei rispettivi design items
            // aggiornado di questi ultimi anche l'elenco globale di colori
            var setImageData = function (imageData, imageColors) {
                if (imageData) {
                    var url = 'data:image/png;base64,' + imageData;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var designItem = designItemsHash[item.data.guid];
                        customizer.updateDesignItemColors(designItem, imageColors);
                        var matrix = item.matrix;
                        item.crossOrigin = "anonymous";
                        item.source = url;
                        item.onLoad = function () {
                            item.matrix = matrix;

                            // imposto i cambi di colore
                            for (var idx = 0; idx < colorChanges.length; idx++) {
                                var colorChange = colorChanges[idx];
                                if (colorChange instanceof MPlaza.ColorChange)
                                    designItem.changeColor(imageID, colorChange.get("colorID"), colorChange.get("code"));
                                else if (colorChange.hasOwnProperty("colorID") && colorChange.hasOwnProperty("code")) {
                                    designItem.changeColor(imageID, colorChange["colorID"], colorChange["code"]);
                                }
                            }
                            customizer.onItemUpdated(item);
                            customizer.updateSelectionState();
                            customizer.paper.project.view.update();

                            customizer.fireImageLoadedEvent();
                        }
                    }
                }

            }

            // Recupero i bytes dell'immagine ricolorata
            try {
                var recoloredImage = new MPlaza.RecoloredImage();
                recoloredImage.set("imageID", imageID);
                recoloredImage.set("versionKey", "preview");
                for (var i = 0; i < colorChanges.length; i++) {
                    var colorChange = colorChanges[i];
                    if (colorChange instanceof MPlaza.ColorChange)
                        recoloredImage.get("colorChanges").push(colorChange);
                    else if (colorChange.hasOwnProperty("colorID") && colorChange.hasOwnProperty("code")) {
                        var change = new MPlaza.ColorChange(colorChange);
                        recoloredImage.get("colorChanges").push(change);
                    }
                }

                recoloredImage.save(null, {
                    success: function (model, response, options) {

                        if (model && model.get("imageID")) {
                            Logger.info("Immagine letta correttamente");
                            setImageData(recoloredImage.get("imageData"), recoloredImage.get("imageColors"));
                        } else {
                            Logger.info("Errore nella lettura dei dati! " + model.get("message"));
                        }
                    },
                    error: function (model, response, options) {
                        Logger.info("Errore nella lettura dei dati");
                    }
                });

            } catch (e) {
                Logger.info(e);
            }

        }
    },

    setEditingItem: function (item, isEditing) {
        if (!item || isEditing == null)
            return;

        this.removeLoadingCircle(item);

        if (isEditing) {
            var areas = this.getAreasIntersectingOrContainingItem(item);

            if (areas && areas.length > 0) {
                this.createLoadingCircle(item, item.bounds.center);
            }
        }
    },

    createLoadingCircle: function (item, point) {
        if (!point)
            return null;

        var s = 25 / this.paper.view.zoom;
        var url = Zakeke.config.baseUrl + "/images/customizer/loading-circle.png";

        var icon = new this.paper.Raster({
            source: url,
            position: point
        });

        var resizeIcon = function () {
            var originalSize = icon.size;
            var size = new this.paper.Size(s, s);
            var sx = 1.0, sy = 1.0;
            if (Math.abs(originalSize.width) > 0.0000001)
                sx = size.width / originalSize.width;
            if (Math.abs(originalSize.height) > 0.0000001)
                sy = size.height / originalSize.height;

            icon.scale(sx, sy);
        };

        if (icon.size.width > 0 && icon.size.height > 0) {
            resizeIcon();
        }
        else {
            icon.onLoad = function () {
                resizeIcon();
            };
        }

        icon.data.isLoadingCircle = true;
        item.loadingCircle = icon;
        this.loadingCircles.push(icon);

        return icon;
    },

    removeLoadingCircle: function (item) {
        if (!item || !item.hasOwnProperty("loadingCircle") || !item.loadingCircle)
            return;

        var circle = item.loadingCircle;
        this.loadingCircles = this.loadingCircles.filter(x => x != circle);
        circle.remove();
        item.loadingCircle = null;
    },

    // -------------------------------------------------------------
    // Text
    // -------------------------------------------------------------
    setEditTextCallback: function (callback) {
        this.editTextCallback = callback;
    },

    textInfoModified: function (info) {
        if (!info || !this.mouseStartPos)
            return;

        if (!this.element)
            this.addTextElement(this.mouseStartPos, info);
        else
            this.modifyTextElement(this.element, info);

        this.element = null;
    },

    createText: function (event) {
        if (!this.canAddText())
            return;

        if (this.editTextCallback) {
            info = {};
            info.text = "";
            info.strokeColor = "#000000";
            info.strokeWidth = 0;
            info.fillColor = "#000000";
            info.fontFamily = "Arial";
            info.fontSize = 12;
            info.fontWeight = "normal";
            info.justification = "left";

            var customizer = this;
            this.editTextCallback(info, function (textInfo) {
                customizer.textInfoModified(textInfo);
            });
        }
    },

    editText: function () {
        this.selectElement();

        if (!this.canEditSelection())
            return;

        if (this.element && this.element instanceof this.paper.TextItem &&
            this.editTextCallback) {
            info = {};
            info.text = this.element.content;
            info.strokeColor = this.element.strokeColor.toCSS(true);
            info.strokeWidth = this.element.strokeWidth;
            info.fillColor = this.element.fillColor.toCSS(true);
            info.fontFamily = this.element.fontFamily;
            info.fontSize = this.element.fontSize;
            info.fontWeight = this.element.fontWeight;
            info.justification = this.element.justification;

            var customizer = this;
            this.editTextCallback(info, function (textInfo) {
                customizer.textInfoModified(textInfo);
            });
        }
    },

    addTextElement: function (point, info, forceAdding = false) {
        if (!forceAdding && !this.canAddText())
            return;

        var text = null;

        if (info && info.text) {

            this.deselectAll();
            this.updateSelectionState();

            text = new this.paper.PointText({
                rotation: info.rotation || 0,
                content: info.text,
                strokeColor: info.strokeColor || 'black',
                strokeWidth: info.strokeWidth != undefined ? info.strokeWidth : 0,
                fillColor: info.fillColor || 'black',
                fontFamily: this.sanitizeFontFamilyName(info.fontFamily) || 'Verdana',
                fontWeight: info.fontWeight || 'normal',
                fontStretch: info.fontStretch || 'normal',
                fontStyle: info.fontStyle || "normal",
                fontSize: info.fontSize || 12,
                justification: info.justification || 'center',
            });

            // Help to check if an item is text outside the customizer
            text.data = {};
            text.data.isText = true;

            this.masterGroup.addChild(text);

            this.onItemCreated(text);
            this.setItemSelection(text, true);

            if (this.side) {

                if (point == null) {
                    var area = this.side.get("areas").getMaxArea();
                    if (area) {

                        // centro l'elemento all'interno dell'area
                        var areaItem = this.findItemForArea(area);
                        if (areaItem) {
                            text.position = areaItem.position;
                            this.onItemUpdated(text);
                            this.onDesignItemChanged(text);
                        }
                    } else {
                        text.position = this.paper.view.center;
                    }
                } else {
                    text.position = point;
                }
            }


            if (this.isSafari) {
                text.visible = false;
                var that = this;
                setTimeout(function () {
                    that.paper.project.view.update(true);
                    text.visible = true;
                }, 2000);
            } else {
                this.paper.project.view.update(true);
            }
        }

        this.updateSelectionState();
        return text;
    },

    modifyTextElement: function (item, info) {
        if (!this.canEditItem(item))
            return;

        if (!item)
            return;

        if (item.data && item.data.isTextOnPath) {
            this.modifyTextOnPathInfo(item, info);
        } else if (item.data && item.data.isTextArea) {
            this.modifyTextAreaInfo(item, info);
        } else {

            var constraints = this.getItemConstraints(item);

            item.content = this.adjustInputTextByConstraints(item, info.text) || item.content;
            if (!constraints || constraints.get("canChangeFontColor")) {
                item.strokeColor = info.strokeColor || item.strokeColor;
                item.fillColor = info.fillColor || item.fillColor;
            }
            item.strokeWidth = info.strokeWidth != undefined ? info.strokeWidth : item.strokeWidth;

            if (!constraints || constraints.get("canChangeFontFamily"))
                item.fontFamily = this.sanitizeFontFamilyName(info.fontFamily || item.fontFamily);

            item.fontWeight = this.adjustInputFontWeightByConstraints(item, info.fontWeight, constraints);

            if (!constraints || constraints.get("canChangeFontSize"))
                item.fontSize = info.fontSize || item.fontSize;

            if (!constraints || constraints.get("canChangeJustification"))
                item.justification = info.justification || item.justification;

            if (info.scaling)
                item.scaling = info.scaling;
            if (info.rotation)
                item.rotation = info.rotation;
        }

        this.onItemUpdated(item);
        this.onDesignItemChanged(item);
        this.setItemSelection(text, true);
        this.updateSelectionState();
        this.paper.project.view.update();
    },

    modifyTextElements: function (items, info) {
        if (Object.prototype.toString.call(items) === '[object Array]') {

            for (var i = 0; i < items.length; i++) {
                this.modifyTextElement(items[i], info);
            }

        } else {
            this.modifyTextElement(items, info);
        }
    },

    modifyTextElementContentByGuid: function (guid, content) {
        var item = this.findItemByGuid(guid);
        if (item)
            this.modifyTextElementContent(item, content);
    },

    modifyTextElementContent: function (item, content) {
        if (!this.canEditItem(item))
            return;

        if (item && item instanceof this.paper.TextItem) {
            item.content = this.adjustInputTextByConstraints(item, content);
            item.data.needsTransformsDataUpdate = true;

            this.updateSelectionState();
            this.paper.project.view.update();

            this.onItemUpdated(item);
            this.onDesignItemChanged(item);

        } else if (item && item.data && item.data.isTextOnPath) {
            info = { text: content };
            this.modifyTextOnPathInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
            this.onDesignItemChanged(item);
        } else if (item && item.data && item.data.isTextArea) {
            info = { text: content };
            this.modifyTextAreaInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
            this.onDesignItemChanged(item);
        }

    },

    modifyTextElementsContent: function (items, content) {
        if (Object.prototype.toString.call(items) === '[object Array]') {

            for (var i = 0; i < items.length; i++) {
                this.modifyTextElementContent(items[i], content);
            }

        } else {
            this.modifyTextElementContent(items, content);
        }
    },

    modifyTextElementFillColor: function (item, color) {
        if (!this.canChangeItemFontColor(item))
            return;

        if (item && item instanceof this.paper.TextItem) {
            item.fillColor = color;
            item.data.needsTransformsDataUpdate = true;

            this.onItemUpdated(item);
            this.paper.project.view.update();
        } else if (item && item.data && item.data.isTextOnPath) {
            info = { fillColor: color };
            this.modifyTextOnPathInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        } else if (item && item.data && item.data.isTextArea) {
            info = { fillColor: color };
            this.modifyTextAreaInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        }
    },

    modifyTextElementsFillColor: function (items, color) {
        if (Object.prototype.toString.call(items) === '[object Array]') {

            for (var i = 0; i < items.length; i++) {
                this.modifyTextElementFillColor(items[i], color);
            }

        } else {
            this.modifyTextElementFillColor(items, color);
        }
    },

    sanitizeFontFamilyName: function (fontFamily) {
        return '"' + fontFamily.replace(/"/g, "") + '"';
    },

    modifyTextElementFontFamily: function (item, fontFamily) {
        if (!this.canChangeItemFontFamily(item))
            return;

        if (item && item instanceof this.paper.TextItem) {
            item.fontFamily = this.sanitizeFontFamilyName(fontFamily);
            item.data.needsTransformsDataUpdate = true;

            this.onItemUpdated(item);
            this.updateSelectionState();

            if (this.isSafari) {
                item.visible = false;
                var that = this;
                setTimeout(function () {
                    that.paper.project.view.update(true);
                    item.visible = true;
                }, 2000);
            } else {
                this.paper.project.view.update(true);
            }

        } else if (item && item.data && item.data.isTextOnPath) {
            info = { fontFamily: fontFamily };
            this.modifyTextOnPathInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        } else if (item && item.data && item.data.isTextArea) {
            info = { fontFamily: fontFamily };
            this.modifyTextAreaInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        }
    },

    modifyTextElementsFontFamily: function (items, fontFamily) {
        if (Object.prototype.toString.call(items) === '[object Array]') {

            for (var i = 0; i < items.length; i++) {
                this.modifyTextElementFontFamily(items[i], fontFamily);
            }

        } else {
            this.modifyTextElementFontFamily(items, fontFamily);
        }
    },

    modifyTextElementFontSize: function (item, fontSize) {

        if (!this.canChangeItemFontSize(item))
            return;

        if (item && item instanceof this.paper.TextItem) {
            item.fontSize = fontSize;
            item.data.needsTransformsDataUpdate = true;

            this.onItemUpdated(item);
            this.updateSelectionState();
            this.paper.project.view.update();
        } else if (item && item.data && item.data.isTextOnPath) {
            info = { fontSize: fontSize };
            this.modifyTextOnPathInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        } else if (item && item.data && item.data.isTextArea) {
            info = { fontSize: fontSize };
            this.modifyTextAreaInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        }
    },

    modifyTextElementsFontSize: function (items, fontSize) {
        if (Object.prototype.toString.call(items) === '[object Array]') {

            for (var i = 0; i < items.length; i++) {
                this.modifyTextElementFontSize(items[i], fontSize);
            }

        } else {
            this.modifyTextElementFontSize(items, fontSize);
        }
    },

    modifyTextElementFontWeight: function (item, fontWeight) {
        if (!this.canChangeItemFontWeight(item))
            return;

        if (item && item instanceof this.paper.TextItem) {
            item.fontWeight = fontWeight;
            item.data.needsTransformsDataUpdate = true;

            this.onItemUpdated(item);
            this.updateSelectionState();
            this.paper.project.view.update();
        } else if (item && item.data && item.data.isTextOnPath) {
            info = { fontWeight: fontWeight };
            this.modifyTextOnPathInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        } else if (item && item.data && item.data.isTextArea) {
            info = { fontWeight: fontWeight };
            this.modifyTextAreaInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        }
    },

    modifyTextElementsFontWeight: function (items, fontWeight) {
        if (Object.prototype.toString.call(items) === '[object Array]') {

            for (var i = 0; i < items.length; i++) {
                this.modifyTextElementFontWeight(items[i], fontWeight);
            }

        } else {
            this.modifyTextElementFontWeight(items, fontWeight);
        }
    },

    modifyTextElementFontStretch: function (item, fontStretch) {

        if (item && item instanceof this.paper.TextItem) {
            item.fontStretch = fontStretch;
            item.data.needsTransformsDataUpdate = true;

            this.onItemUpdated(item);
            this.updateSelectionState();
            this.paper.project.view.update();
        } else if (item && item.data && item.data.isTextOnPath) {
            info = { fontStretch: fontStretch };
            this.modifyTextOnPathInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        } else if (item && item.data && item.data.isTextArea) {
            info = { fontStretch: fontStretch };
            this.modifyTextAreaInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        }
    },

    modifyTextElementsFontStretch: function (items, fontStretch) {
        if (Object.prototype.toString.call(items) === '[object Array]') {

            for (var i = 0; i < items.length; i++) {
                this.modifyTextElementFontStretch(items[i], fontStretch);
            }

        } else {
            this.modifyTextElementFontStretch(items, fontStretch);
        }
    },


    modifyTextElementJustification: function (item, justification) {
        if (!this.canChangeItemJustification(item))
            return;

        var textInfo = this.getTextItemInfo(item);
        if (textInfo.justification && textInfo.justification == justification)
            return;

        if (item && item instanceof this.paper.TextItem) {
            item.justification = justification;
            item.data.needsTransformsDataUpdate = true;

            this.onItemUpdated(item);
            this.updateSelectionState();
            this.paper.project.view.update();
        } else if (item && item.data && item.data.isTextOnPath) {
            info = { justification: justification };
            this.modifyTextOnPathInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        } else if (item && item.data && item.data.isTextArea) {
            info = { justification: justification };
            this.modifyTextAreaInfo(item, info);
            item.data.needsTransformsDataUpdate = true;
            this.onItemUpdated(item);
        }
    },

    modifyTextElementsJustification: function (items, justification) {
        if (Object.prototype.toString.call(items) === '[object Array]') {

            for (var i = 0; i < items.length; i++) {
                this.modifyTextElementJustification(items[i], justification);
            }

        } else {
            this.modifyTextElementJustification(items, justification);
        }
    },

    // -----------------------------------------------------------------
    // TEXT ON PATH
    // -----------------------------------------------------------------
    addTextOnPathElement: function (point, info, forceAdding = false) {

        if (!forceAdding && !this.canAddText())
            return;

        var item = null;

        var centerOnArea = false;
        if (!point) {
            point = this.paper.view.center;
            centerOnArea = true;
        }

        if (info && info.text) {

            this.deselectAll();
            this.updateSelectionState();

            var text = new this.paper.PointText({
                point: point,
                content: info.text,
                strokeColor: info.strokeColor || 'black',
                strokeWidth: info.strokeWidth != undefined ? info.strokeWidth : 0,
                fillColor: info.fillColor || 'black',
                fontFamily: this.sanitizeFontFamilyName(info.fontFamily || 'Verdana'),
                fontWeight: info.fontWeight || 'normal',
                fontSize: info.fontSize || 12,
                justification: info.justification || 'center',
            });

            var textRect = text.bounds;
            text.remove();

            var areaBounds = textRect.clone();
            if (this.side) {

                var area = this.side.get("areas").getMaxArea();
                if (area) {

                    // centro l'elemento all'interno dell'area
                    var areaItem = this.findItemForArea(area);
                    if (areaItem) {
                        areaBounds = areaItem.bounds.expand(-50);
                    }
                }
            }
            if (!centerOnArea)
                areaBounds.center = point;

            var w = Math.min(areaBounds.width, areaBounds.height);
            var rect = new this.paper.Rectangle(areaBounds.x + (areaBounds.width - w) / 2,
                areaBounds.y + (areaBounds.height - w) / 2, w, w);

            // determino i punti che caratterizzano l'arco
            var a = new this.paper.Point(rect.left, rect.top + w / 2);
            var b = new this.paper.Point(rect.center.x, rect.topLeft.y);
            var c = new this.paper.Point(rect.right, rect.top + w / 2);

            var path = new this.paper.Path.Arc(a, b, c);
            path.remove();

            if (info.rotation) {
                path.rotation = info.rotation;
                a = path.getPointAt(0.0 * path.length);
                b = path.getPointAt(0.5 * path.length);
                c = path.getPointAt(1.0 * path.length);
            }

            item = new this.paper.Group();
            item.addChildren(this.createAlignedText(path, info));
            item.data.isTextOnPath = true;
            item.data.points = [a, b, c];
            item.data.text = info.text;
            item.data.inside = info.inside || false;

            this.masterGroup.addChild(item);

            this.adaptPathToText(item);
            var delta = areaBounds.center.subtract(item.position);
            item.position = areaBounds.center;
            item.data.needsTransformsDataUpdate = true;
            this.updateTransformsData(item);
            this.onTextOnPathMoved(item, delta);

            this.onItemCreated(item);
            this.setItemSelection(item, true);
        }

        this.updateSelectionState();
        this.paper.project.view.update();

        return item;
    },

    getAllImageItems: function () {
        var imageItems = [];
        var items = this.getAllItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item && item instanceof this.paper.Raster && item.data && item.data.guid && !item.data.isArea) {
                imageItems.push(item);
            }
        }

        return imageItems;
    },

    getAllDesignImageItems: function () {
        return this.design.get("designItems").models.filter(item => item.get("imageFormat") !== "");
    },

    getAllTextOnPathItems: function () {
        var items = [];

        var customizer = this;

        function addChildren(item) {
            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var child = item.children[j];
                    if (!child.guide && child.data && child.data.isTextOnPath)
                        items.push(child);
                    addChildren(child);
                }
            }
        }

        for (var i = 0, l = customizer.paper.project.layers.length; i < l; i++) {
            var layer = customizer.paper.project.layers[i];
            if (!layer.guide)
                addChildren(layer);
        }

        return items;
    },

    updateTextOnPathGuides: function (items) {
        if (!items)
            items = this.getAllTextOnPathItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            this.updateTextOnPathGuide(item);
        }
    },

    updateTextOnPathGuide: function (item) {
        if (item.data.selected) {
            this.drawTextOnPathGuide(item);
            this.drawTextOnPathHandles(item);
        } else {
            this.removeTextOnPathGuide(item);
            this.removeTextOnPathHandles(item);
        }
    },

    drawTextOnPathGuide: function (item) {

        this.removeTextOnPathGuide(item);

        // Disegno prima la curva guida
        if (item && item.data && item.data.isTextOnPath && item.data.points &&
            Object.prototype.toString.call(item.data.points) === '[object Array]'
            && item.data.points.length == 3) {

            var path = new this.paper.Path.Arc(item.data.points[0], item.data.points[1], item.data.points[2]);
            //path.strokeColor = this.getContrastedColor(path.bounds);
            path.data.isTextOnPathGuide = true;
            path.strokeWidth = 2.0 / this.paper.view.zoom;
            path.dashOffset = 0.5 / this.paper.view.zoom;
            path.dashArray = [1.0 / this.paper.view.zoom, 1.0 / this.paper.view.zoom];
            path.guide = true;
            path.data.itemGuid = item.data.guid;

            var stops = [];
            var whiteFlag = true;

            for (var i = 0; i < path.bounds.width; i = i + 0.6) {
                var oldColor = whiteFlag ? "black" : "white";
                var color = whiteFlag ? "white" : "black";
                var perc = i / path.bounds.width;

                if (perc >= 0.02) {
                    stops.push([oldColor, perc - 0.002]);
                    stops.push(["#888888", perc - 0.001]);
                }

                stops.push([color, perc]);

                if (perc <= 0.99)
                    stops.push(["#888888", perc + 0.001]);
            }

            path.strokeColor = {
                gradient: {
                    stops: stops
                },
                origin: new paper.Point({ x: path.bounds.topLeft.x, y: path.bounds.topLeft.y + path.bounds.height / 2 }),
                destination: new paper.Point({ x: path.bounds.topRight.x, y: path.bounds.topRight.y + path.bounds.height / 2 })
            };
        }
    },

    findTextOnPathGuide: function (item) {

        if (item && item.data && item.data.isTextOnPath && item.data.guid) {

            var upperGuid = item.data.guid.toUpperCase();

            var findChildByGuid = function (parent, guid) {
                if (parent.data && parent.data.isTextOnPathGuide && parent.data.itemGuid && parent.data.itemGuid.toUpperCase() == guid) {
                    return parent;
                }
                if (parent.children) {
                    for (var j = parent.children.length - 1; j >= 0; j--) {
                        var child = parent.children[j];
                        var element = findChildByGuid(child, upperGuid);
                        if (element) {
                            return element;
                        }
                    }
                }
            }

            for (var i = 0; i < this.paper.project.layers.length; i++) {
                var layer = this.paper.project.layers[i];
                if (layer.guide) continue;
                var element = findChildByGuid(layer, upperGuid);
                if (element) {
                    return element;
                }
            }
        }
        return null;
    },

    removeTextOnPathGuide: function (item) {
        var path = this.findTextOnPathGuide(item);
        if (path)
            path.remove();
    },

    drawTextOnPathHandles: function (item) {
        this.removeTextOnPathHandles(item);

        if (!this.canEditItem(item) || !this.canChangeItemTextPathMode(item))
            return;

        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
            var a = item.data.points[0];
            var b = item.data.points[1];
            var c = item.data.points[2];

            var rect = new this.paper.Rectangle(a, new this.paper.Point(c.x, b.y));
            var strokeColor = this.getContrastedColor(rect);
            let handleCircleDimension = this.isMobile ? 15 : 8;

            var endHandle1 = new this.paper.Path.Circle(a, handleCircleDimension);
            endHandle1.data.isTextOnPathHandle = true;
            endHandle1.data.isTextOnPathFirstEndHandle = true;
            endHandle1.strokeColor = new this.paper.Color(1, 1, 1, 0.5);
            endHandle1.strokeWidth = 1;
            endHandle1.fillColor = new this.paper.Color(0, 0, 0, 0.5);
            endHandle1.data.itemGuid = item.data.guid;

            var middleHandle = new this.paper.Path.Circle(b, handleCircleDimension);
            middleHandle.data.isTextOnPathHandle = true;
            middleHandle.data.isTextOnPathMiddleEndHandle = true;
            middleHandle.strokeColor = new this.paper.Color(1, 1, 1, 0.5);
            middleHandle.strokeWidth = 1;
            middleHandle.fillColor = new this.paper.Color(0, 0, 0, 0.5);
            middleHandle.data.itemGuid = item.data.guid;

            var endHandle2 = new this.paper.Path.Circle(c, handleCircleDimension);
            endHandle2.data.isTextOnPathHandle = true;
            endHandle2.data.isTextOnPathLastEndHandle = true;
            endHandle2.strokeColor = new this.paper.Color(1, 1, 1, 0.5);
            endHandle2.strokeWidth = 1;
            endHandle2.fillColor = new this.paper.Color(0, 0, 0, 0.5);
            endHandle2.data.itemGuid = item.data.guid;
        }
    },

    findTextOnPathHandles: function (item) {

        var handles = [];
        if (item && item.data && item.data.isTextOnPath && item.data.guid) {

            var upperGuid = item.data.guid.toUpperCase();

            var findChildByGuid = function (parent, guid) {
                if (parent.data && parent.data.isTextOnPathHandle && parent.data.itemGuid && parent.data.itemGuid.toUpperCase() == guid) {
                    handles.push(parent);
                }
                if (parent.children) {
                    for (var j = parent.children.length - 1; j >= 0; j--) {
                        var child = parent.children[j];
                        findChildByGuid(child, upperGuid);
                    }
                }
            }

            for (var i = 0; i < this.paper.project.layers.length; i++) {
                var layer = this.paper.project.layers[i];
                if (layer.guide) continue;
                findChildByGuid(layer, upperGuid);
            }
        }
        return handles;
    },

    removeTextOnPathHandles: function (item) {
        var handles = this.findTextOnPathHandles(item);
        for (var i = 0; i < handles.length; i++) {
            var handle = handles[i];
            handle.remove();
        }
    },

    onTextOnPathMoved: function (item, delta) {
        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
            var a = item.data.points[0];
            var b = item.data.points[1];
            var c = item.data.points[2];

            var path = new this.paper.Path.Arc(a, b, c);
            path.remove();
            path.position.x += delta.x;
            path.position.y += delta.y;

            item.data.points[0] = path.getPointAt(0.0 * path.length);
            item.data.points[1] = path.getPointAt(0.5 * path.length);
            item.data.points[2] = path.getPointAt(1.0 * path.length);
        }
    },

    onTextOnPathRotated: function (item, deg, pivot) {
        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
            var a = item.data.points[0];
            var b = item.data.points[1];
            var c = item.data.points[2];

            var path = new this.paper.Path.Arc(a, b, c);
            path.remove();
            path.rotate(deg, pivot);

            item.data.points[0] = path.getPointAt(0.0 * path.length);
            item.data.points[1] = path.getPointAt(0.5 * path.length);
            item.data.points[2] = path.getPointAt(1.0 * path.length);
        }
    },

    onTextOnPathScaled: function (item, sx, sy, pivot) {
        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
            var a = item.data.points[0];
            var b = item.data.points[1];
            var c = item.data.points[2];

            var path = new this.paper.Path.Arc(a, b, c);
            path.remove();
            path.scale(sx, sy, pivot);

            item.data.points[0] = path.getPointAt(0.0 * path.length);
            item.data.points[1] = path.getPointAt(0.5 * path.length);
            item.data.points[2] = path.getPointAt(1.0 * path.length);
        }
    },

    moveTextOnPathFirstEnd: function (info) {
        if (this.frozen)
            return;

        if (!info.delta)
            return;

        var delta = info.delta;

        this.hideCenterLines();
        this.removeSelectionAlertItems();
        var selected = this.getSelectedTextOnPathItems();
        if (selected && selected.length > 0) {
            var item = selected[0];

            if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
                item.data.points[0].x += delta.x;
                item.data.points[0].y += delta.y;
                item.data.needsTransformsDataUpdate = true;
                this.drawTextOnPathGuide(item);
                this.drawTextOnPathHandles(item);
                this.updateTextOnPath(item);
            }
        }
    },

    moveTextOnPathMiddleEnd: function (info) {
        if (this.frozen)
            return;

        if (!info.delta)
            return;

        var delta = info.delta;

        this.hideCenterLines();
        this.removeSelectionAlertItems();
        var selected = this.getSelectedTextOnPathItems();
        if (selected && selected.length > 0) {
            var item = selected[0];

            if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
                item.data.points[1].x += delta.x;
                item.data.points[1].y += delta.y;
                item.data.needsTransformsDataUpdate = true;
                this.drawTextOnPathGuide(item);
                this.drawTextOnPathHandles(item);
                this.updateTextOnPath(item);
            }
        }
    },

    moveTextOnPathLastEnd: function (info) {
        if (this.frozen)
            return;

        if (!info.delta)
            return;

        var delta = info.delta;

        this.hideCenterLines();
        this.removeSelectionAlertItems();
        var selected = this.getSelectedTextOnPathItems();
        if (selected && selected.length > 0) {
            var item = selected[0];

            if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
                item.data.points[2].x += delta.x;
                item.data.points[2].y += delta.y;
                item.data.needsTransformsDataUpdate = true;
                this.drawTextOnPathGuide(item);
                this.drawTextOnPathHandles(item);
                this.updateTextOnPath(item);
            }
        }
    },

    modifyTextOnPathInfo: function (item, newInfo) {
        if (newInfo) {
            newInfo.text = this.adjustInputTextByConstraints(item, newInfo.text);
        }

        this.removeAlertItems(item);
        this.updateTextOnPath(item, newInfo);
        this.adaptPathToText(item);
        this.updateTextOnPath(item, null);
        this.checkAlertItems(item);
        this.checkImagesSizeLimit();
    },

    updateTextOnPath: function (item, info) {
        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
            if (item.children.length > 0) {

                var str = item.data.text;
                if (!str) {
                    for (var i = 0; i < item.children.length; i++) {
                        str += item.children[i].content;
                    }
                }

                // Edited by Mauro:
                // I Have changed the info.fontWeight || item.children[0].fontWeight; (and others lines) to this
                // because an empty string used with info.fontWeight || is interpreted as false.
                // So when we add for e.g the font weight BOLD, it works BUT when we remove it, the string is empty so 
                // it became false in the expression and then the item.children is used... "bold"... then he reapply the bold
                // and we can't remove the bold effect anymore. With this it works!

                var constraints = this.getItemConstraints(item);

                info = info || {};
                info.text = info.text || str;

                if (!constraints || constraints.get("canChangeFontColor")) {
                    info.strokeColor = info.strokeColor != undefined ? info.strokeColor : item.children[0].strokeColor;
                    info.fillColor = info.fillColor != undefined ? info.fillColor : item.children[0].fillColor;
                } else {
                    info.strokeColor = item.children[0].strokeColor;
                    info.fillColor = item.children[0].fillColor;
                }

                info.strokeWidth = info.strokeWidth != undefined ? info.strokeWidth : item.children[0].strokeWidth;

                if (!constraints || constraints.get("canChangeFontFamily"))
                    info.fontFamily = info.fontFamily != undefined ? info.fontFamily : item.children[0].fontFamily;
                else
                    info.fontFamily = item.children[0].fontFamily;

                info.fontFamily = this.sanitizeFontFamilyName(info.fontFamily);

                var inputFontWeight = info.fontWeight != undefined ? info.fontWeight : item.children[0].fontWeight;
                info.fontWeight = this.adjustInputFontWeightByConstraints(item.children[0].fontWeight, inputFontWeight, constraints);
                info.fontStretch = info.fontStretch != undefined ? info.fontStretch : item.children[0].fontStretch;
                /*
                if (!constraints || constraints.get("canChangeFontWeight"))
                    info.fontWeight = info.fontWeight != undefined ? info.fontWeight : item.children[0].fontWeight;
                else
                    info.fontWeight = item.children[0].fontWeight;
                */

                if (!constraints || constraints.get("canChangeFontSize"))
                    info.fontSize = info.fontSize != undefined ? info.fontSize : item.children[0].fontSize;
                else
                    info.fontSize = item.children[0].fontSize;

                info.scaling = info.scaling != undefined ? info.scaling : item.children[0].scaling;
                item.data.text = info.text;

                item.removeChildren();

                var a = item.data.points[0];
                var b = item.data.points[1];
                var c = item.data.points[2];

                var path = new this.paper.Path.Arc(a, b, c);
                path.remove();

                item.addChildren(this.createAlignedText(path, info, null));

                this.updateSelectionState();
                this.paper.project.view.update();

            }
        }
    },

    adaptPathToText: function (item) {
        var t0 = performance.now();

        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3) {
            var str = item.data.text;
            if (!str) {
                for (var i = 0; i < item.children.length; i++) {
                    str += item.children[i].content;
                }
            }

            var a = item.data.points[0];
            var c = item.data.points[1];
            var b = item.data.points[2];

            var path = new this.paper.Path.Arc(a, c, b);
            path.remove();

            var info = {};
            info.text = str;
            info.strokeColor = item.children[0].strokeColor;
            info.strokeWidth = item.children[0].strokeWidth;
            info.fillColor = item.children[0].fillColor;
            info.fontFamily = item.children[0].fontFamily;
            info.fontWeight = item.children[0].fontWeight;
            info.fontSize = item.children[0].fontSize;
            info.scaling = item.children[0].scaling;

            var totalPointText = this.createPointText(str, info);
            totalPointText.remove();
            var textLength = totalPointText.bounds.width;

            if (Math.abs(textLength - path.length) < 0.001) {
                var t1 = performance.now();
                return;
            }

            // devo allungare o restringere l'arco in modo che contenga tutto il testo
            var center = this.getCircleCenter(a, b, c);
            var radius = a.getDistance(center);
            var circ = 2 * Math.PI * radius;
            var angle = path.length / circ * 360; // angolo al centro
            var deltaLength = textLength - path.length;
            var deltaAngle = deltaLength / circ * 360;

            var a1 = this.getCircleAngleAtPoint(center.x, center.y, radius, a.x, a.y);
            var a2 = this.getCircleAngleAtPoint(center.x, center.y, radius, b.x, b.y);
            var a3 = this.getCircleAngleAtPoint(center.x, center.y, radius, c.x, c.y);

            a1 = this.getNormalizedAngle(a1);
            a2 = this.getNormalizedAngle(a2);
            a3 = this.getNormalizedAngle(a3);

            var alfa1 = 0;
            var alfa2 = 0;
            if (a1 > a2) {
                alfa2 = a1 - a2;
                alfa1 = 360 - alfa2;
            } else {
                alfa1 = a2 - a1;
                alfa2 = 360 - alfa1;
            }

            if (a3 < a1) {
                if (deltaAngle + alfa2 > 359)
                    deltaAngle = 359 - alfa2;
                a1 += deltaAngle / 2;
                a2 -= deltaAngle / 2;
            } else {
                if (deltaAngle + alfa1 > 359)
                    deltaAngle = 359 - alfa1;
                a1 -= deltaAngle / 2;
                a2 += deltaAngle / 2;
            }

            a1 = this.getNormalizedAngle(a1);
            a2 = this.getNormalizedAngle(a2);

            var p1 = this.getCirclePointAtAngle(center.x, center.y, radius, a1);
            var p2 = this.getCirclePointAtAngle(center.x, center.y, radius, a2);

            item.data.points[0] = p1;
            item.data.points[2] = p2;

            this.updateSelectionState();
            this.paper.project.view.update();
        }
        var t1 = performance.now();
    },

    createAlignedText: function (path, info, startOffset) {
        var t0 = performance.now();
        var showed = [];
        var glyphTexts = [];
        var inside = info.inside || false;
        if (info && info.text && info.text.length > 0 && path) {
            var str = info.text;

            // create PointText object for each glyph
            var totalPointText = this.createPointText(str, info);
            totalPointText.remove();
            var textLength = totalPointText.bounds.width;

            for (var i = 0; i < str.length; i++) {
                glyphTexts[i] = this.createPointText(str.substring(i, i + 1), info);
                glyphTexts[i].justification = "center";
            }

            if (!startOffset) {
                if (textLength < path.length) {
                    startOffset = (path.length - textLength) / 2;
                } else {
                    startOffset = 0;
                }
            }

            // for each glyph find center xOffset
            var xOffsets = [startOffset];
            for (var i = 1; i < str.length; i++) {
                var pairText = this.createPointText(str.substring(i - 1, i + 1), info);
                pairText.remove();

                if (inside) {
                    xOffsets[i] = xOffsets[i - 1] - (pairText.bounds.width -
                        glyphTexts[i - 1].bounds.width / 2 - glyphTexts[i].bounds.width / 2);
                }
                else {
                    xOffsets[i] = xOffsets[i - 1] + (pairText.bounds.width -
                        glyphTexts[i - 1].bounds.width / 2 - glyphTexts[i].bounds.width / 2);
                }
            }
            // set point for each glyph and rotate glyph aorund the point
            for (var i = 0; i < str.length; i++) {
                var centerOffs = xOffsets[i];
                if (centerOffs < 0 && path.closed)
                    centerOffs = path.length + centerOffs;
                if (path.length < centerOffs) {
                    if (path.closed) {
                        centerOffs = centerOffs % path.length;
                    } else {
                        centerOffs = undefined;
                    }
                }
                if (centerOffs === undefined) {
                    glyphTexts[i].remove();
                } else {
                    showed.push(glyphTexts[i]);
                    var pathPoint = path.getPointAt(centerOffs);
                    glyphTexts[i].point = pathPoint;
                    var tan = path.getTangentAt(centerOffs);
                    var angle = tan.angle;
                    if (inside)
                        angle -= 180;
                    glyphTexts[i].rotate(angle, pathPoint);
                }
            }
        }
        var t1 = performance.now();
        return showed;
    },

    // create a PointText object for a string and a style
    createPointText: function (str, info) {
        var text = new this.paper.PointText();
        text.content = str;
        if (info) {
            text.strokeColor = info.strokeColor || 'black';
            text.strokeWidth = info.strokeWidth != undefined ? info.strokeWidth : 0;
            text.fillColor = info.fillColor || 'black';
            text.fontFamily = info.fontFamily || 'Verdana';
            text.fontWeight = info.fontWeight || 'normal';
            text.fontSize = info.fontSize || 12;
            if (info.scaling)
                text.scaling = info.scaling;
        }
        return text;
    },

    getCircleCenter: function (b, c, d) {
        var temp = Math.pow(c.x, 2) + Math.pow(c.y, 2);
        var bc = (Math.pow(b.x, 2) + Math.pow(b.y, 2) - temp) / 2;
        var cd = (temp - Math.pow(d.x, 2) - Math.pow(d.y, 2)) / 2;

        var det = (b.x - c.x) * (c.y - d.y) - (c.x - d.x) * (b.y - c.y);

        if (Math.abs(det) < 1e-14)
            return false;

        var center = new this.paper.Point(
            (bc * (c.y - d.y) - cd * (b.y - c.y)) / det,
            ((b.x - c.x) * cd - (c.x - d.x) * bc) / det
        );

        return center;
    },

    getCirclePointAtAngle: function (x0, y0, r, t) {
        var rad = (t * Math.PI) / 180;

        var x1 = r * Math.cos(rad) + x0;
        var y1 = r * Math.sin(rad) + y0;

        return new paper.Point(x1, y1);
    },

    // La funzione restituisce l'angolo t corrispondente al punto P(x1,y1) del cerchio
    // con centro (x0,y0) e raggio r
    getCircleAngleAtPoint: function (x0, y0, r, x1, y1) {
        if (r == 0)
            return 0;

        return (Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI + 360.0) % 360.0;
    },

    getNormalizedAngle: function (a) {
        if (a < 0)
            a = 360 + a;
        if (a > 360)
            a -= 360;
        return a;
    },
    // ---------------------------------------------------


    // -----------------------------------------------------------------
    // TEXT AREA
    // -----------------------------------------------------------------
    addTextAreaElement: function (rect, info, forceAdding = true) {

        if (!forceAdding && !this.canAddText())
            return;

        var item = null;

        if (!rect && this.side) {
            var area = this.side.get("areas").getMaxArea();
            var areaItem = this.findItemForArea(area);
            if (areaItem) {
                rect = areaItem.bounds.expand(-50);
            }
        }

        if (!rect)
            return;

        if (info && info.text) {

            this.deselectAll();
            this.updateSelectionState();

            item = new this.paper.Group();
            item.addChildren(this.createWrappedText(rect, rect, info, null));

            rect = item.bounds;

            item.data.rect = rect;
            item.data.isTextArea = true;
            item.data.text = info.text;
            item.data.justification = info.justification != undefined ? info.justification : "justify";

            this.masterGroup.addChild(item);

            var delta = rect.center.subtract(item.position);
            item.position = rect.center;
            item.data.needsTransformsDataUpdate = true;
            this.updateTransformsData(item);
            this.onTextAreaMoved(item, delta);

            this.forceTextAreaToBounds(item);

            this.onItemCreated(item);
            this.setItemSelection(item, true);
        }

        this.updateSelectionState();
        this.paper.project.view.update();

        return item;
    },

    getAllTextAreaItems: function () {
        var items = [];

        var customizer = this;

        function addChildren(item) {
            if (item.children) {
                for (var j = item.children.length - 1; j >= 0; j--) {
                    var child = item.children[j];
                    if (!child.guide && child.data && child.data.isTextArea)
                        items.push(child);
                    addChildren(child);
                }
            }
        }

        for (var i = 0, l = customizer.paper.project.layers.length; i < l; i++) {
            var layer = customizer.paper.project.layers[i];
            if (!layer.guide)
                addChildren(layer);
        }

        return items;
    },

    updateTextAreaGuides: function (items) {
        if (!items)
            items = this.getAllTextAreaItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            this.updateTextAreaGuide(item);
        }
    },

    updateTextAreaGuide: function (item) {
        if (item.data.selected && this.canEditItem(item)) {
            this.drawTextAreaGuide(item);
            this.drawTextAreaHandles(item);
        } else {
            this.removeTextAreaGuide(item);
            this.removeTextAreaHandles(item);
        }
    },

    drawTextAreaGuide: function (item) {

        this.removeTextAreaGuide(item);

        if (item && item.data && item.data.isTextArea && item.data.rect) {

            var path = new this.paper.Path.Rectangle(item.data.rect);
            path.data.isTextAreaGuide = true;
            path.strokeWidth = 2.0 / this.paper.view.zoom;
            path.dashOffset = 0.5 / this.paper.view.zoom;
            path.dashArray = [1.0 / this.paper.view.zoom, 1.0 / this.paper.view.zoom];
            path.guide = true;
            path.data.itemGuid = item.data.guid;

            var stops = [];
            var whiteFlag = true;

            for (var i = 0; i < path.bounds.width; i = i + 0.6) {
                var oldColor = whiteFlag ? "black" : "white";
                var color = whiteFlag ? "white" : "black";
                var perc = i / path.bounds.width;

                if (perc >= 0.02) {
                    stops.push([oldColor, perc - 0.002]);
                    stops.push(["#888888", perc - 0.001]);
                }

                stops.push([color, perc]);

                if (perc <= 0.99)
                    stops.push(["#888888", perc + 0.001]);
            }

            path.strokeColor = {
                gradient: {
                    stops: stops
                },
                origin: new paper.Point({ x: path.bounds.topLeft.x, y: path.bounds.topLeft.y + path.bounds.height / 2 }),
                destination: new paper.Point({ x: path.bounds.topRight.x, y: path.bounds.topRight.y + path.bounds.height / 2 })
            };
        }
    },

    findTextAreaGuide: function (item) {

        if (item && item.data && item.data.isTextArea && item.data.guid) {

            var upperGuid = item.data.guid.toUpperCase();

            var findChildByGuid = function (parent, guid) {
                if (parent.data && parent.data.isTextAreaGuide && parent.data.itemGuid && parent.data.itemGuid.toUpperCase() == guid) {
                    return parent;
                }
                if (parent.children) {
                    for (var j = parent.children.length - 1; j >= 0; j--) {
                        var child = parent.children[j];
                        var element = findChildByGuid(child, upperGuid);
                        if (element) {
                            return element;
                        }
                    }
                }
            };

            for (var i = 0; i < this.paper.project.layers.length; i++) {
                var layer = this.paper.project.layers[i];
                if (layer.guide) continue;
                var element = findChildByGuid(layer, upperGuid);
                if (element) {
                    return element;
                }
            }
        }
        return null;
    },

    removeTextAreaGuide: function (item) {
        var guide = this.findTextAreaGuide(item);
        if (guide)
            guide.remove();
    },

    drawTextAreaHandles: function (item) {
        this.removeTextAreaHandles(item);

        if (!this.canEditItem(item))
            return;

        if (item && item.data && item.data.isTextArea && item.data.rect) {
            var rect = item.data.rect.clone();

            let handleCircleDimension = (this.isMobile ? 15 : 8) / this.paper.view.zoom;

            // Determino i quattro punti dove piazzare gli handle, a metà di ogni lato del rettangolo
            //var top = new this.paper.Point(rect.x + rect.width / 2, rect.y); 
            //var right = new this.paper.Point(rect.x + rect.width, rect.y + rect.height / 2);
            //var bottom = new this.paper.Point(rect.x + rect.width / 2, rect.y + rect.height);
            //var left = new this.paper.Point(rect.x, rect.y + rect.height / 2);

            var d = handleCircleDimension;

            var top = new this.paper.Point(rect.x + rect.width / 2, rect.y - d);
            var right = new this.paper.Point(rect.x + rect.width + d, rect.y + rect.height / 2);
            var bottom = new this.paper.Point(rect.x + rect.width / 2, rect.y + rect.height + d);
            var left = new this.paper.Point(rect.x - d, rect.y + rect.height / 2);

            var topHandle = new this.paper.Path.Circle(top, handleCircleDimension);
            topHandle.data.isTextAreaHandle = true;
            topHandle.data.isTextAreaTopEndHandle = true;
            topHandle.strokeColor = new this.paper.Color(1, 1, 1, 0.5);
            topHandle.strokeWidth = 1;
            topHandle.fillColor = new this.paper.Color(0, 0, 0, 0.5);
            topHandle.data.itemGuid = item.data.guid;

            var rightHandle = new this.paper.Path.Circle(right, handleCircleDimension);
            rightHandle.data.isTextAreaHandle = true;
            rightHandle.data.isTextAreaRightEndHandle = true;
            rightHandle.strokeColor = new this.paper.Color(1, 1, 1, 0.5);
            rightHandle.strokeWidth = 1;
            rightHandle.fillColor = new this.paper.Color(0, 0, 0, 0.5);
            rightHandle.data.itemGuid = item.data.guid;

            var bottomHandle = new this.paper.Path.Circle(bottom, handleCircleDimension);
            bottomHandle.data.isTextAreaHandle = true;
            bottomHandle.data.isTextAreaBottomEndHandle = true;
            bottomHandle.strokeColor = new this.paper.Color(1, 1, 1, 0.5);
            bottomHandle.strokeWidth = 1;
            bottomHandle.fillColor = new this.paper.Color(0, 0, 0, 0.5);
            bottomHandle.data.itemGuid = item.data.guid;

            var leftHandle = new this.paper.Path.Circle(left, handleCircleDimension);
            leftHandle.data.isTextAreaHandle = true;
            leftHandle.data.isTextAreaLeftEndHandle = true;
            leftHandle.strokeColor = new this.paper.Color(1, 1, 1, 0.5);
            leftHandle.strokeWidth = 1;
            leftHandle.fillColor = new this.paper.Color(0, 0, 0, 0.5);
            leftHandle.data.itemGuid = item.data.guid;
        }
    },

    findTextAreaHandles: function (item) {

        var handles = [];
        if (item && item.data && item.data.isTextArea && item.data.guid) {

            var upperGuid = item.data.guid.toUpperCase();

            var findChildByGuid = function (parent, guid) {
                if (parent.data && parent.data.isTextAreaHandle && parent.data.itemGuid && parent.data.itemGuid.toUpperCase() == guid) {
                    handles.push(parent);
                }
                if (parent.children) {
                    for (var j = parent.children.length - 1; j >= 0; j--) {
                        var child = parent.children[j];
                        findChildByGuid(child, upperGuid);
                    }
                }
            };

            for (var i = 0; i < this.paper.project.layers.length; i++) {
                var layer = this.paper.project.layers[i];
                if (layer.guide) continue;
                findChildByGuid(layer, upperGuid);
            }
        }
        return handles;
    },

    removeTextAreaHandles: function (item) {
        var handles = this.findTextAreaHandles(item);
        for (var i = 0; i < handles.length; i++) {
            var handle = handles[i];
            handle.remove();
        }
    },

    onTextAreaMoved: function (item, delta) {
        if (item && item.data && item.data.isTextArea && item.data.rect) {

            var rect = item.data.rect.clone();
            rect.x += delta.x;
            rect.y += delta.y;

            item.data.rect = rect;
        }
    },

    onTextAreaRotated: function (item, deg, pivot) {
        // TODO
    },

    onTextAreaScaled: function (item, sx, sy, pivot) {
        if (item && item.data && item.data.isTextArea && item.data.rect) {

            var path = new this.paper.Path.Rectangle(item.data.rect);
            path.remove();
            path.scale(sx, sy, pivot);

            item.data.rect = path.bounds.clone();
        }
    },

    moveTextAreaTopEnd: function (info) {
        if (this.frozen)
            return;

        if (!info.delta)
            return;

        var delta = info.delta;

        this.hideCenterLines();
        this.removeSelectionAlertItems();
        var selected = this.getSelectedTextAreaItems();
        if (selected && selected.length > 0) {
            var item = selected[0];

            if (item && item.data && item.data.isTextArea && item.data.rect) {
                var oldRect = item.data.rect.clone();

                item.data.rect.top += delta.y;

                item.data.needsTransformsDataUpdate = true;
                this.drawTextAreaGuide(item);
                this.drawTextAreaHandles(item);
                this.updateTextArea(item, oldRect, null, MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd);
            }
        }
    },

    moveTextAreaRightEnd: function (info) {
        if (this.frozen)
            return;

        if (!info.delta)
            return;

        var delta = info.delta;

        this.hideCenterLines();
        this.removeSelectionAlertItems();
        var selected = this.getSelectedTextAreaItems();
        if (selected && selected.length > 0) {
            var item = selected[0];

            if (item && item.data && item.data.isTextArea && item.data.rect) {
                var oldRect = item.data.rect.clone();

                item.data.rect.right += delta.x;

                item.data.needsTransformsDataUpdate = true;
                this.drawTextAreaGuide(item);
                this.drawTextAreaHandles(item);
                this.updateTextArea(item, oldRect, null, MPlaza.CustomizerInteractionMode.MoveTextAreaRightEnd);
            }
        }
    },

    moveTextAreaBottomEnd: function (info) {
        if (this.frozen)
            return;

        if (!info.delta)
            return;

        var delta = info.delta;

        this.hideCenterLines();
        this.removeSelectionAlertItems();
        var selected = this.getSelectedTextAreaItems();
        if (selected && selected.length > 0) {
            var item = selected[0];

            if (item && item.data && item.data.isTextArea && item.data.rect) {
                var oldRect = item.data.rect.clone();

                item.data.rect.bottom += delta.y;

                item.data.needsTransformsDataUpdate = true;
                this.drawTextAreaGuide(item);
                this.drawTextAreaHandles(item);
                this.updateTextArea(item, oldRect, null, MPlaza.CustomizerInteractionMode.MoveTextAreaBottomEnd);
            }
        }
    },

    moveTextAreaLeftEnd: function (info) {
        if (this.frozen)
            return;

        if (!info.delta)
            return;

        var delta = info.delta;

        this.hideCenterLines();
        this.removeSelectionAlertItems();
        var selected = this.getSelectedTextAreaItems();
        if (selected && selected.length > 0) {
            var item = selected[0];

            if (item && item.data && item.data.isTextArea && item.data.rect) {
                var oldRect = item.data.rect.clone();

                item.data.rect.left += delta.x;

                item.data.needsTransformsDataUpdate = true;
                this.drawTextAreaGuide(item);
                this.drawTextAreaHandles(item);
                this.updateTextArea(item, oldRect, null, MPlaza.CustomizerInteractionMode.MoveTextAreaLeftEnd);
            }
        }
    },

    modifyTextAreaInfo: function (item, newInfo) {
        if (newInfo) {
            newInfo.text = this.adjustInputTextByConstraints(item, newInfo.text != null ? newInfo.text : item.data.text);
        }

        this.removeAlertItems(item);
        this.updateTextArea(item, item.data.rect, newInfo, null);
        this.checkAlertItems(item);
        this.checkImagesSizeLimit();
    },

    updateTextArea: function (item, oldRect, info, interactionMode) {
        if (item && item.data && item.data.isTextArea && item.data.rect) {

            if (item.children.length > 0) {

                var str = item.data.text;
                if (!str) {
                    for (var i = 0; i < item.children.length; i++) {
                        if (i > 0)
                            str += " ";
                        str += item.children[i].content;
                    }
                }

                var constraints = this.getItemConstraints(item);

                info = info || {};
                info.text = info.text || str;

                if (!constraints || constraints.get("canChangeFontColor")) {
                    info.strokeColor = info.strokeColor != undefined ? info.strokeColor : item.children[0].strokeColor;
                    info.fillColor = info.fillColor != undefined ? info.fillColor : item.children[0].fillColor;
                } else {
                    info.strokeColor = item.children[0].strokeColor;
                    info.fillColor = item.children[0].fillColor;
                }

                info.strokeWidth = info.strokeWidth != undefined ? info.strokeWidth : item.children[0].strokeWidth;

                if (!constraints || constraints.get("canChangeFontFamily"))
                    info.fontFamily = info.fontFamily != undefined ? info.fontFamily : item.children[0].fontFamily;
                else
                    info.fontFamily = item.children[0].fontFamily;

                info.fontFamily = this.sanitizeFontFamilyName(info.fontFamily);

                var inputFontWeight = info.fontWeight != undefined ? info.fontWeight : item.children[0].fontWeight;
                info.fontWeight = this.adjustInputFontWeightByConstraints(item.children[0].fontWeight, inputFontWeight, constraints);
                info.fontStretch = info.fontStretch != undefined ? info.fontStretch : item.children[0].fontStretch;
                /*
                if (!constraints || constraints.get("canChangeFontWeight"))
                    info.fontWeight = info.fontWeight != undefined ? info.fontWeight : item.children[0].fontWeight;
                else
                    info.fontWeight = item.children[0].fontWeight;
                */

                if (!constraints || constraints.get("canChangeFontSize"))
                    info.fontSize = info.fontSize != undefined ? info.fontSize : item.children[0].fontSize;
                else
                    info.fontSize = item.children[0].fontSize;

                info.scaling = info.scaling != undefined ? info.scaling : item.children[0].scaling;
                info.justification = info.justification != undefined ? info.justification : (item.data.justification != undefined ? item.data.justification : "justify");
                item.data.justification = info.justification;

                item.data.text = info.text;

                item.removeChildren();

                var rect = item.data.rect;

                item.addChildren(this.createWrappedText(rect, oldRect, info, interactionMode));

                if (interactionMode == null && !this.canEditItem(item)) {
                    var containsAllWords = function () {
                        let wordsCount = 0;
                        info.text.split("\n").forEach(paragraph => wordsCount += paragraph.split(" ").length);

                        return item.children.length == wordsCount;
                    };

                    var lineHeight = this.getLineHeight(info);

                    while (!containsAllWords()) {
                        let oldYPosition = oldRect.y;
                        oldRect = rect.clone();
                        rect.bottom += lineHeight * 1.6 + 1;
                        item.removeChildren();
                        item.addChildren(this.createWrappedText(rect, oldRect, info, interactionMode));
                        item.position.y = oldYPosition + (item.bounds.height / 2);
                        item.data.rect = item.bounds.clone();
                    }
                }
                else if (oldRect && item.bounds)
                    item.position.y = oldRect.y + (item.bounds.height / 2);

                //item.data.rect = item.bounds;

                this.updateSelectionState();
                this.paper.project.view.update();
            }
        }
    },

    onTextAreaGuidesUpdated: function (interactionMode) {
        var items = this.getSelectedItems();
        var item = items[0];

        if (item && item.data && item.data.isTextArea) {
            this.updateSelectionState();
            this.updateTextArea(item, item.data.rect.clone(), null, interactionMode);
            item.data.rect = this.getItemRealBounds(item).clone();
        }
    },

    forceSelectedTextAreasToBounds: function () {
        var items = this.getSelectedTextAreaItems();
        for (var i = 0; i < items.length; i++) {
            this.forceTextAreaToBounds(items[i]);
        }
    },

    forceTextAreaToBounds: function (item) {
        if (item && item.data && item.data.isTextArea && item.data.rect) {
            var bounds = item.bounds.clone();
            if (!bounds.isEmpty()) {
                item.data.rect = bounds;
            }
        }
    },

    createWrappedText: function (rect, oldRect, info, interactionMode) {
        var justification = info.justification != undefined ? info.justification : "justify";

        var textItems = [];

        var str = info.text;
        var paragraphs = str.split("\n");

        var firstWordWidth = 0;

        if (paragraphs.length > 0)
            firstWordWidth = this.getLineWidth(paragraphs[0].split(" ")[0], info);

        var firstLineHeight = this.getLineHeight(info);

        var lineHeight = firstLineHeight * 1.2;
        var parlineHeight = firstLineHeight * 1.6;

        // calcolo i limiti dell'area
        var refPT = this.createPointText("W", info);
        refPT.remove();

        if (rect.height < firstLineHeight) {
            if (interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaTopEnd) 
                rect.top = oldRect.bottom - firstLineHeight;
            else
                rect.bottom = oldRect.top + firstLineHeight;

            rect.height = firstLineHeight;
        }

        if (rect.width < firstWordWidth) {
            if (interactionMode == MPlaza.CustomizerInteractionMode.MoveTextAreaLeftEnd)
                rect.left = oldRect.right - firstWordWidth;
            else
                rect.right = oldRect.left + firstWordWidth;

            rect.width = firstWordWidth;
        }

        // Test misurazione più accurata della parte al di sopra della baseline
        //firstLineHeight = (this.getFontAscent(info) + 1) * (info.scaling ? info.scaling.y : 1);
        var spaceWidth = this.getSpaceWidth(info);

        var dx = rect.x;
        var dy = rect.y + firstLineHeight;

        for (var k = 0; k < paragraphs.length && dy <= rect.y + rect.height + 1; k++) {
            var paragraph = paragraphs[k];

            dx = rect.x;
            if (k > 0)
                dy += parlineHeight;

            var words = paragraph.split(" ");

            var spaceW = spaceWidth;
            var line = [];
            for (var i = 0; i < words.length && dy <= rect.y + rect.height + 1; i++) {
                var word = words[i];
                var wordText = this.createPointText(word, info);
                var wordWidth = wordText.bounds.width;
                spaceW = line.length == 0 ? 0 : spaceWidth;
                if (((dx - rect.x) + spaceW + wordWidth <= rect.width + 1) || line.length == 0) {
                    // Aggiungo la parola alla linea
                    dx += spaceW;
                    wordText.point = new this.paper.Point(dx, dy);
                    dx += wordWidth;
                    line.push(wordText);
                    textItems.push(wordText);
                } else {
                    // passaggio alla linea successiva
                    // eseguo prima la giustificazione della linea precedente
                    this.justifyLine(line, rect, dx, justification);

                    dx = rect.x;
                    dy += lineHeight;
                    line = [];

                    // cambio linea (considerando i limiti)
                    // Added +1 because sometimes when resizing the area vertically (and the area is as big as the first word), it went for an instant 
                    // slightly lower than the height of the first word. This caused the text to completely disappear and not appear again.

                    if (dy <= rect.y + rect.height + 1) {
                        wordText.point = new this.paper.Point(dx, dy);
                        dx += wordWidth;
                        line.push(wordText);
                        textItems.push(wordText);
                    }
                    else {
                        wordText.remove();
                    }
                }
            }

            // allineo l'ultima riga
            if (justification != "justify")
                this.justifyLine(line, rect, dx, justification);
        }

        return textItems;
    },

    // Funzione che esegue l'allineamento delle parole presenti in line (ogni parola è un PointText)
    justifyLine: function (line, rect, dx, justification) {
        if (line.length > 0) {
            var lineWidth = dx - rect.x;
            var extraWidth = rect.width - lineWidth;

            if (justification == "justify") {
                // spazio extra distribuito tra le parole
                if (line.length > 1) {
                    var extraRoom = extraWidth / (line.length - 1);
                    for (var j = 1; j < line.length; j++) {
                        var lineText = line[j];
                        lineText.point = new this.paper.Point(lineText.point.x + extraRoom * j, lineText.point.y);
                    }
                }
            } else if (justification == "right") {
                // tutto lo spazio extra a sinistra
                for (var j = 0; j < line.length; j++) {
                    var lineText = line[j];
                    lineText.point = new this.paper.Point(lineText.point.x + extraWidth, lineText.point.y);
                }
            } else if (justification == "center") {
                // metà spazio extra a sinistra e metà a destra
                for (var j = 0; j < line.length; j++) {
                    var lineText = line[j];
                    lineText.point = new this.paper.Point(lineText.point.x + extraWidth / 2, lineText.point.y);
                }
            }
        }
    },

    getLineHeight: function (info) {
        var lineHeightText = this.createPointText("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", info);
        lineHeightText.remove();
        var lineHeight = lineHeightText.bounds.height;
        return lineHeight;
    },

    getLineWidth: function (content, info) {
        var lineWidthText = this.createPointText(content, info);
        lineWidthText.remove();
        var lineWidth = lineWidthText.bounds.width;
        return lineWidth;
    },

    getSpaceWidth: function (info) {
        var spaceText = this.createPointText(" ", info);
        spaceText.remove();
        var spaceWidth = spaceText.bounds.width;
        return spaceWidth;
    },

    // Restituisce l'altezza della parte al di sopra della baseline
    // Allo stato attuale il metodo che trovo più preciso è quello di misurare direttamente
    // l'altezza dopo aver disegnato il carattere su un canvas offset
    getFontAscent: function (info) {
        var fontStyle = this.getShortcutFontProperty(info);
        var result = this.fontAscentCache.hasOwnProperty(fontStyle) ? this.fontAscentCache[fontStyle] : null;

        // ricavo le dimensioni del canvas da creare
        var refPointText = this.createPointText("M", info);
        var bounds = refPointText.bounds;
        refPointText.remove();

        var canvasWidth = Math.floor(bounds.width) + 1;
        var canvasHeight = Math.floor(bounds.height) + 1;

        if (!result) {
            // creo un offset canvas su cui eseguire il disegno
            var $canvas = $("<canvas>", { id: Math.floor(99999 * Math.random() + 1) }).attr({ width: canvasWidth, height: canvasHeight });
            var fontDraw = $canvas[0];
            var ctx = fontDraw.getContext("2d");

            ctx.fillRect(0, 0, fontDraw.width, fontDraw.height);
            ctx.textBaseline = 'top';
            ctx.fillStyle = 'white';
            ctx.font = fontStyle;
            //ctx.fillText('gM', 0, 0);
            ctx.fillText('M', 0, 0);
            var pixels = ctx.getImageData(0, 0, fontDraw.width, fontDraw.height).data;
            var start = -1;
            var end = -1;
            for (var row = 0; row < fontDraw.height; row++) {
                for (var column = 0; column < fontDraw.width; column++) {
                    var index = (row * fontDraw.width + column) * 4;
                    if (pixels[index] === 0) {
                        if (column === fontDraw.width - 1 && start !== -1) {
                            end = row;
                            row = fontDraw.height;
                            break;
                        }
                        continue;
                    }
                    else {
                        if (start === -1) {
                            start = row;
                        }
                        break;
                    }
                }
            }
            result = end - start;
            this.fontAscentCache[fontStyle] = result;
            // put in cache
        }
        return result;
    },

    getShortcutFontProperty: function (info) {
        // font-style font-weight font-variant font-size/line-height font-family
        var font = info.fontSize + "px " + info.fontFamily;
        if (info.fontStretch && info.fontStretch != "normal")
            font = info.fontStretch + " " + font;
        if (info.fontWeight && info.fontWeight != "normal")
            font = info.fontWeight + " " + font;
        if (info.fontStyle && info.fontStyle != "normal")
            font = info.fontStyle + " " + font;
        return font;
    },

    // -----------------------------------------------------------------

    // -----------------------------------------------------------------
    // Conversioni tra i vari tipi di elementi di testo
    // (alcuni di questi metodi hanno mantenuto il vecchio nome che prevedeva solo
    //  text e textOnPath, ma il funzionamento è stato allargato anche a textArea.
    // I metodi nuovi sono tutti stati introdotti per i tre tipi: text, textOnPath e textArea.
    // -----------------------------------------------------------------
    toggleSelectionTextOnPath: function () {
        var items = this.getSelectedTextItems();
        for (var i = 0; i < items.length; i++) {
            this.toggleItemTextOnPath(items[i]);
        }
    },

    convertSelectedTextItemsToTextOnPath: function () {
        this.convertSelectionToTextOnPath();
    },

    convertSelectedTextOnPathItemsToText: function () {
        this.convertSelectionToText();
    },

    convertSelectionToText: function () {
        var items = this.getSelectedTextItems();
        for (var i = 0; i < items.length; i++) {
            this.convertToText(items[i]);
        }
    },

    convertSelectionToTextOnPath: function () {
        var items = this.getSelectedTextItems();
        for (var i = 0; i < items.length; i++) {
            this.convertToTextOnPath(items[i]);
        }
    },

    convertSelectionToTextArea: function () {
        var items = this.getSelectedTextItems();
        for (var i = 0; i < items.length; i++) {
            this.convertToTextArea(items[i]);
        }
    },

    // text -> textOnPath -> textArea
    toggleItemTextOnPath: function (item) {
        if (!item)
            return;

        if (item instanceof this.paper.TextItem)
            this.convertToTextOnPath(item);
        else if (item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3 && item.children.length > 0)
            this.convertToTextArea(item);
        else
            this.convertToText(item);
    },

    convertToTextOnPath: function (item) {
        if (!this.canChangeItemTextPathMode(item))
            return;

        if (item && item instanceof this.paper.TextItem)
            this.fromTextToTextOnPath(item);
        else if (item && item.data && item.data.isTextArea && item.data.rect)
            this.fromTextAreaToTextOnPath(item);
    },

    convertToText: function (item) {
        if ((!this.getItemIsTextArea(item) && !this.canChangeItemTextPathMode(item)) ||
            (this.getItemIsTextArea(item) && !this.canChangeItemTextAreaMode(item)))
            return;

        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3 && item.children.length > 0)
            this.fromTextOnPathToText(item);
        else if (item && item.data && item.data.isTextArea && item.data.rect)
            this.fromTextAreaToText(item);
    },

    convertToTextArea: function (item) {
        if (!this.canChangeItemTextAreaMode(item))
            return;

        if (item && item instanceof this.paper.TextItem)
            this.fromTextToTextArea(item);
        else if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3 && item.children.length > 0)
            this.fromTextOnPathToTextArea(item);
    },

    fromTextToTextOnPath: function (item) {
        if (!this.canChangeItemTextPathMode(item))
            return;

        if (item && item instanceof this.paper.TextItem) {

            var designItem = this.findDesignItemForItem(item);
            var constraints = null;
            if (designItem)
                constraints = designItem.get("constraints");

            var syncGuid = designItem.get("syncGuid");

            item.remove();
            this.onItemRemoved(item);

            var info = {};
            info.text = item.content;
            info.strokeColor = item.strokeColor;
            info.strokeWidth = item.strokeWidth;
            info.fillColor = item.fillColor;
            info.fontFamily = item.fontFamily;
            info.fontWeight = item.fontWeight;
            info.fontSize = item.fontSize;
            info.scaling = item.scaling;
            info.rotation = item.rotation;

            var newItem = this.addTextOnPathElement(item.position, info, true);

            if (constraints) {
                var newDesignItem = this.findDesignItemForItem(newItem);
                if (newDesignItem) {
                    newDesignItem.setConstraintsFromSource(constraints);
                    this.updateSelectionState();
                    this.paper.project.view.update();
                }
            }

            this.updateItemSyncGuid(newItem, syncGuid);
        }
    },

    fromTextToTextArea: function (item) {
        if (!this.canChangeItemTextAreaMode(item))
            return;

        if (item && item instanceof this.paper.TextItem) {

            var designItem = this.findDesignItemForItem(item);
            var constraints = null;
            if (designItem)
                constraints = designItem.get("constraints");

            var syncGuid = designItem.get("syncGuid");

            var rect = item.bounds.clone();
            rect.bottom = rect.bottom;
            rect.bottom += rect.height*5;

            item.remove();
            this.onItemRemoved(item);

            var info = {};
            info.text = item.content;
            info.strokeColor = item.strokeColor;
            info.strokeWidth = item.strokeWidth;
            info.fillColor = item.fillColor;
            info.fontFamily = item.fontFamily;
            info.fontWeight = item.fontWeight;
            info.fontSize = item.fontSize;
            info.scaling = item.scaling;
            info.rotation = item.rotation;
            info.justification = item.data && item.data.justification ? item.data.justification : (item.justification !== undefined ? item.justification : "justify");

            var newItem = this.addTextAreaElement(rect, info, true);

            if (constraints) {
                var newDesignItem = this.findDesignItemForItem(newItem);
                if (newDesignItem) {
                    newDesignItem.setConstraintsFromSource(constraints);
                    this.updateSelectionState();
                    this.paper.project.view.update();
                }
            }

            this.updateItemSyncGuid(newItem, syncGuid);
        }
    },

    fromTextOnPathToText: function (item) {
        if (!this.canChangeItemTextPathMode(item))
            return;

        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3 && item.children.length > 0) {

            var designItem = this.findDesignItemForItem(item);
            var constraints = null;
            if (designItem)
                constraints = designItem.get("constraints");

            var syncGuid = designItem.get("syncGuid");

            item.remove();
            this.onItemRemoved(item);

            var str = item.data.text;
            if (!str) {
                for (var i = 0; i < item.children.length; i++) {
                    str += item.children[i].content;
                }
            }

            var info = {};
            info.text = str;
            info.strokeColor = item.children[0].strokeColor;
            info.strokeWidth = item.children[0].strokeWidth;
            info.fillColor = item.children[0].fillColor;
            info.fontFamily = item.children[0].fontFamily;
            info.fontWeight = item.children[0].fontWeight;
            info.fontStretch = item.children[0].fontStretch;
            info.fontSize = item.children[0].fontSize;
            info.scaling = item.children[0].scaling;

            var a = item.data.points[0];
            var b = item.data.points[1];
            var c = item.data.points[2];

            var v = c.subtract(a);
            var point = a.add(v.divide(2));
            info.rotation = v.angle;

            var newItem = this.addTextElement(point, info, true);

            if (constraints) {
                var newDesignItem = this.findDesignItemForItem(newItem);
                if (newDesignItem) {
                    newDesignItem.setConstraintsFromSource(constraints);
                    this.updateSelectionState();
                    this.paper.project.view.update();
                }
            }

            this.updateItemSyncGuid(newItem, syncGuid);
        }
    },

    fromTextOnPathToTextArea: function (item) {
        if (!this.canChangeItemTextAreaMode(item) || !this.canChangeItemTextPathMode(item))
            return;

        if (item && item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3 && item.children.length > 0) {

            var designItem = this.findDesignItemForItem(item);
            var constraints = null;
            if (designItem)
                constraints = designItem.get("constraints");

            var syncGuid = designItem.get("syncGuid");

            var rect = item.bounds.clone();
            rect.bottom = rect.bottom;
            rect.bottom += rect.height*5;

            item.remove();
            this.onItemRemoved(item);

            var str = item.data.text;
            if (!str) {
                for (var i = 0; i < item.children.length; i++) {
                    str += item.children[i].content;
                }
            }

            var info = {};
            info.text = str;
            info.strokeColor = item.children[0].strokeColor;
            info.strokeWidth = item.children[0].strokeWidth;
            info.fillColor = item.children[0].fillColor;
            info.fontFamily = item.children[0].fontFamily;
            info.fontWeight = item.children[0].fontWeight;
            info.fontStretch = item.children[0].fontStretch;
            info.fontSize = item.children[0].fontSize;
            info.scaling = item.children[0].scaling;
            info.justification = item.data && item.data.justification ? item.data.justification : "justify";

            var newItem = this.addTextAreaElement(rect, info, true);

            if (constraints) {
                var newDesignItem = this.findDesignItemForItem(newItem);
                if (newDesignItem) {
                    newDesignItem.setConstraintsFromSource(constraints);
                    this.updateSelectionState();
                    this.paper.project.view.update();
                }
            }

            this.updateItemSyncGuid(newItem, syncGuid);
        }
    },

    fromTextAreaToText: function (item) {
        if (!this.canChangeItemTextAreaMode(item))
            return;

        if (item && item.data && item.data.isTextArea && item.data.rect) {

            var designItem = this.findDesignItemForItem(item);
            var constraints = null;
            if (designItem)
                constraints = designItem.get("constraints");

            var syncGuid = designItem.get("syncGuid");

            item.remove();
            this.onItemRemoved(item);

            var str = item.data.text;
            if (!str) {
                for (var i = 0; i < item.children.length; i++) {
                    if (i > 0)
                        str += " ";
                    str += item.children[i].content;
                }
            }

            var info = {};
            info.text = str;
            info.strokeColor = item.children[0].strokeColor;
            info.strokeWidth = item.children[0].strokeWidth;
            info.fillColor = item.children[0].fillColor;
            info.fontFamily = item.children[0].fontFamily;
            info.fontWeight = item.children[0].fontWeight;
            info.fontStretch = item.children[0].fontStretch;
            info.fontSize = item.children[0].fontSize;
            info.scaling = item.children[0].scaling;

            var point = item.children[0].point;

            var newItem = this.addTextElement(point, info, true);

            if (constraints) {
                var newDesignItem = this.findDesignItemForItem(newItem);
                if (newDesignItem) {
                    newDesignItem.setConstraintsFromSource(constraints);
                    this.updateSelectionState();
                    this.paper.project.view.update();
                }
            }

            this.updateItemSyncGuid(newItem, syncGuid);
        }
    },

    fromTextAreaToTextOnPath: function (item) {
        if (!this.canChangeItemTextPathMode(item) || !this.canChangeItemTextAreaMode(item))
            return;

        if (item && item.data && item.data.isTextArea && item.data.rect) {

            var designItem = this.findDesignItemForItem(item);
            var constraints = null;
            if (designItem)
                constraints = designItem.get("constraints");

            var syncGuid = designItem.get("syncGuid");

            item.remove();
            this.onItemRemoved(item);

            var str = item.data.text;
            if (!str) {
                for (var i = 0; i < item.children.length; i++) {
                    if (i > 0)
                        str += " ";
                    str += item.children[i].content;
                }
            }

            var info = {};
            info.text = str;
            info.strokeColor = item.children[0].strokeColor;
            info.strokeWidth = item.children[0].strokeWidth;
            info.fillColor = item.children[0].fillColor;
            info.fontFamily = item.children[0].fontFamily;
            info.fontWeight = item.children[0].fontWeight;
            info.fontStretch = item.children[0].fontStretch;
            info.fontSize = item.children[0].fontSize;
            info.scaling = item.children[0].scaling;

            var point = item.children[0].point;

            var newItem = this.addTextOnPathElement(point, info, true);
            if (item.data && item.data.justification)
                newItem.data.justification = item.data.justification;

            if (constraints) {
                var newDesignItem = this.findDesignItemForItem(newItem);
                if (newDesignItem) {
                    newDesignItem.setConstraintsFromSource(constraints);
                    this.updateSelectionState();
                    this.paper.project.view.update();
                }
            }

            this.updateItemSyncGuid(newItem, syncGuid);
        }
    },

    // Fine funzione di conversione fra vari tipi
    // -----------------------------------------------------------------

    removeSideBackColor: function () {
        if (this.side && this.design) {
            var designSide = this.design.getDesignSide(this.side);
            if (designSide) {
                this.design.get("sides").remove(designSide);
            }
            //this.refresh();
            var customizer = this;
            this.updateImageItem(function () {
                if (!customizer.isViewer)
                    customizer.updateAreaItemsColor();
                customizer.updateSelectionState();
            });
        }
    },

    // Accetta un colore nella forma esadecimale RRGGBB
    setSideBackColor: function (hexColor) {
        if (this.side && this.design) {
            var designSide = this.design.getDesignSide(this.side);
            if (!designSide) {
                designSide = new MPlaza.DesignSide();
                designSide.set("modelID", this.design.get("modelID"));
                designSide.set("colorID", this.side.getColorID());
                designSide.set("sideID", this.side.getSideID());
                this.design.get("sides").add(designSide);
            }
            designSide.set("fillColor", hexColor);
            var customizer = this;
            this.updateImageItem(function () {
                if (!customizer.isViewer)
                    customizer.updateAreaItemsColor();
                customizer.updateSelectionState();
            });
            //this.refresh();
        }
    },

    adjustInputFontWeightByConstraints: function (itemFontWeight, inputFontWeight, constraints) {
        // fontWeight contiene sia bold che italic
        var newFontWeight = inputFontWeight || itemFontWeight;
        if (constraints && (!constraints.get("canChangeFontWeight") || !constraints.get("canChangeFontItalic"))) {
            var oldBold = itemFontWeight && itemFontWeight.indexOf("bold") != -1;
            var oldItalic = itemFontWeight && itemFontWeight.indexOf("italic") != -1;
            var newBold = constraints.get("canChangeFontWeight") ? newFontWeight.indexOf("bold") != -1 : oldBold;
            var newItalic = constraints.get("canChangeFontItalic") ? newFontWeight.indexOf("italic") != -1 : oldItalic;

            var fontWeight = [];
            if (newItalic)
                fontWeight.push("italic");
            if (newBold)
                fontWeight.push("bold");
            newFontWeight = fontWeight.join(" ");
        }
        return newFontWeight;
    },

    adjustInputTextByConstraints: function (item, text) {
        var newText = text;
        if (item && text != undefined && text != null) {

            var constraints = this.getItemConstraints(item);
            if (constraints && constraints.get("canEdit") &&
                (constraints.get("keepNrChars") || constraints.get("minNrChars") > 0 || constraints.get("maxNrChars") > 0)) {
                // Ricavo il testo attuale

                var currentText = "";
                if (item.data && item.data.isTextOnPath && item.data.points && Object.prototype.toString.call(item.data.points) === '[object Array]' && item.data.points.length == 3 && item.children.length > 0) {
                    currentText = item.data.text;
                    if (!currentText) {
                        for (var i = 0; i < item.children.length; i++) {
                            currentText += item.children[i].content;
                        }
                    }
                }
                else if (item instanceof this.paper.TextItem) {
                    currentText = item.content;
                }

                var length = currentText.length;

                var minLength = constraints.get("minNrChars");
                var maxLength = constraints.get("maxNrChars");

                if (constraints.get("keepNrChars")) {
                    minLength = length;
                    maxLength = length;
                }

                if (minLength > 0 && text.length < minLength) {
                    // Eseguo il padding
                    var paddingString = constraints.get("paddingString");
                    if (constraints.get("paddingTypeID") == MPlaza.PaddingType.Start) {
                        newText = text.padStart(minLength, paddingString);
                    } else if (constraints.get("paddingTypeID") == MPlaza.PaddingType.End) {
                        newText = text.padEnd(minLength, paddingString);
                    } else if (constraints.get("paddingTypeID") == MPlaza.PaddingType.StartEnd) {
                        newText = text.padStartEnd(minLength, paddingString);
                    }
                }

                /*
                if (maxLength > 0 && text.length > maxLength) {
                    newText = text.substring(0, maxLength);
                }

                if (text.length == 0 && constraints.get("canDelete") == false) {
                    newText = currentText.substring(0, 1);
                }
                */

                if (maxLength > 0 && newText.length > maxLength) {
                    newText = newText.substring(0, maxLength);
                }

                if (newText.length == 0 && constraints.get("canDelete") == false) {
                    newText = currentText.substring(0, 1);
                }


                //if (length <= text.length) {
                //    newText = text.substring(0, length);
                //} else {
                //    // Eseguo il padding
                //    var paddingString = constraints.get("paddingString");
                //    if (constraints.get("paddingTypeID") == MPlaza.PaddingType.Start) {
                //        newText = text.padStart(length, paddingString);
                //    } else if (constraints.get("paddingTypeID") == MPlaza.PaddingType.End) {
                //        newText = text.padEnd(length, paddingString);
                //    } else if (constraints.get("paddingTypeID") == MPlaza.PaddingType.StartEnd) {
                //        newText = text.padStartEnd(length, paddingString);
                //    }
                //}
            }
        }
        return newText;
    },

    highlightsCanvasItemFromDesignItems: function (designItems) {

        var that = this;
        designItems.forEach(function (x) {

            var item = that.findItemByGuid(x.get('itemGuid'));
            if (item) {
                that.createMaskAlertForItem(item);
            }
        });
    }
}