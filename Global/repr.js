/*  Known Limitations:
    1.  Array-like-ness is currently detected by checking for a method attribute called "push".
        Any object having a "push" method which is not an array will be represented as an empty
        array literal.

    2.  Extremely large nested objects cause this function to hit the recursion depth limit.
*/
function repr(obj) {
    function quot(s) { return ["", s.replace(/"/g, "\\\""), ""].join("\""); }

    function reprlist(l) {
        var reps = [];
        for (var i = 0; i < l.length; i++) { reps.push(repr(l[i])); }
        return ["[", reps.join(","), "]"].join("");
    }

    if (obj === null) {
        return "null";
    } else if (obj === undefined) {
        return "undefined";
    }

    if (typeof obj.push == "function") {
        return reprlist(obj);
    } else if (typeof obj != "object") {
        if (typeof obj == "number" || typeof obj == "function") {
            return obj;
        } else {
            return quot(obj);
        }
    } else {
        var kids = [];
        for (k in obj) {
            kids.push([
                quot(k),
                    (typeof obj[k] == "object") ? repr(obj[k])
                :   (typeof obj[k].push == "function") ? reprlist(obj[k])
                :   (typeof obj[k] == "number" || typeof obj[k] == "function") ? obj[k]
                :   quot(obj[k].toString())
            ].join(':'));
        }
        return ["{", kids.join(","), "}"].join("");
    }
}
