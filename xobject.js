function xObject(obj) {
    if (this === window) {
        return new xObject(obj);
    }

    if (typeof obj === "string") {
        this.el = document.getElementById(obj);
    } else if (typeof obj === "object" && obj.innerHTML !== "undefined") {
        this.el = obj;
    } else {
        throw new Error("Argument is of wrong type");
    }

    this._css = this.el.style;
}

if (typeof addEventListener !== "undefined") {
    xObject.addEvent = function(obj, evt, fn) {
        obj.addEventListener(evt, fn, false);
    }
} else if (typeof attachEvent !== "undefined") {
    xObject.addEvent = function(obj, evt, fn) {
        obj.attachEvent("on" + evt, fn);
    }
} else {
    xObject.addEvent = function(obj, evt, fn) {
        obj["on" + evt] = fn;
    }
}

xObject.removeEvent = function(obj, evt, fn) {

};