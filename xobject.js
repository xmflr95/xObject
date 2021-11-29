function xObject(obj) {
    if (this === window) {
        return new xObject(obj);
    }

    var type = typeof obj;

    if (type === "string") {
        this.el = document.getElementById(obj);
    } else if (type === "object" && obj.nodeType !== "undefined" && obj.nodeType === 1) {
        this.el = obj;
    } else {
        throw new Error("Argument is of wrong type");
    }

    this._css = this.el.style;
}

/*** Event instance methods ***/ 
xObject.prototype.addEvent = function(evt, fn) {
    xObject.addEvent(this.el, evt, fn);

    return this;
};

xObject.prototype.removeEvent = function(evt, fn) {
    xObject.removeEvent(this.el, evt, fn);

    return this;
};

xObject.prototype.click = function(fn) {
    var that = this;

    xObject.addEvent(this.el, "click", function(e) {
        fn.call(that, e);
    });

    return this;
}

xObject.prototype.mouseover = function(fn) {
    var that = this;

    xObject.addEvent(this.el, "mouseover", function(e) {
        fn.call(that, e);
    });

    return this;
}

/*** Event static methods ***/
if (typeof addEventListener !== "undefined") {
    xObject.addEvent = function(obj, evt, fn) {
        obj.addEventListener(evt, fn, false);
    };

    xObject.removeEvent = function(obj, evt, fn) {
        obj.removeEventListener(evt, fn, false);
    };
} else if (typeof attachEvent !== "undefined") {
    xObject.addEvent = function(obj, evt, fn) {
        var fnHash = "e_" + evt + fn;
        
        obj[fnHash] = function() {
            var type = event.type,
                relatedTarget = null;

            if (type === "mouseover" || type === "mouseout") {
                relatedTarget = (type === "mouseover") ? event.fromElement : event.toElement;
            }

            fn.call(obj, {
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

        obj.attachEvent("on" + evt, obj[fnHash]);
    };

    xObject.attachEvent = function(obj, evt, fn) {
        var fnHash = "e_" + evt + fn;

        if (typeof obj[fnHash] !== "undefined") {
            obj.detachEvent("on" + evt, obj[fnHash]);
            delete obj[fnHash];
        }
    }
} else {
    xObject.addEvent = function(obj, evt, fn) {
        obj["on" + evt] = fn;
    };

    xObject.removeEvent = function(obj, evt, fn) {
        obj["on" + evt] = null;
    };
}