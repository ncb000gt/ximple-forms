this.genChoices = function() {
    if (this.input_type == "hidden") { return [this.values]; }
    var options = this.genOptions();
    var choices = [];
    for (var i in options) { choices.push(options[i].value); }
    return choices;
}

this.genOptions = function(selection) {
    var options = [], v, i;
    var values = this.values.split("|");
    for (i in values) {
        v = values[i].trim();
	options.push({title: v, value: v});
    }
    if (selection) {
        if (typeof selection != "object") {
            selection = [selection];
        }
        var decorated = 0;
        for (i in options) {
            if (selection.match(new RegExp("("+options[i].value+")"))) {
                options[i].checked = "checked";
                options[i].selected = "selected";
                decorated++;
                if (decorated >= selection.length) { break; }
            }
        }
    }
    return options;
}

this.genValidator = function() {
    var label = this.label.replace(/:/, "");
    var v = {};
        v.key = this.id;
        v.error = "Please enter a value for \"" + label + "\"";

    if (this.input_type == "email") {
        v.error =  "Please enter a valid email address for \"" + label + "\"";
        v.regex = "^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$";
    } else if (this.input_type == "date") {
        v.error = "Please enter a valid date for \"" + label + "\"";
        v["date"] = true;
    }

    if (this.input_type.match("dropdown") || this.input_type.match("group") || this.input_type.match("hidden")) {
        v.choices = this.genChoices();
	v.error = "Please select an option for \"" + label + "\"";
	if (this.input_type.match('group')) v.vector = '1';
    } else {
        v.minlength = 1;
    }

    if (!this.required) { v.lazy = true; }

    return v;
}
