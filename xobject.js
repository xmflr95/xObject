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
        var handler = function() {
            var type = event.type,
                relatedTarget = null;

            if (type === "mouseover" || type === "mouseout") {
                relatedTarget = (type === "mouseover") ? event.fromElement : event.toElement;
            }

            fn({
                target: event.srcElement,
                type: type,
                relatedTarget: relatedTarget,
                _event: event,
                preventDefault: function() {
                    this._event.returnValue = false;
                },
                stopPropagation: function() {
                    this._event.cancelBubble = true;
                }
            });
        };

        obj.attachEvent("on" + evt, handler);
    }
} else {
    xObject.addEvent = function(obj, evt, fn) {
        obj["on" + evt] = fn;
    }
}

xObject.removeEvent = function(obj, evt, fn) {

};