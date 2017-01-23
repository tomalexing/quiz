    export function classRegex(classname) {
        return new RegExp("(^|\\s+)" + classname + "(\\s+|$)");
    }
    export function hasClass(el, c) {
        return classRegex(c).test(el.className);
    }
    export function addClass(el, c) {
        if (!hasClass(el, c))
            el.className = el.className + " " + c;
    }
    export function removeClass(el, c) {
        el.className = el.className.replace(classRegex(c), ' ')
    }

    