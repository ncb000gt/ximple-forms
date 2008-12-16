function getSearchableProperties() {
    return ['title','introduction','boilerplate'];
}

function genValidation() {
    var validators = [];
    var widgets = app.getObjects("XimpleFormWidget", {}, {sort: new Sort("rank", "asc"), path: this.path()});
    for each (var widget in widgets) {
	if (widget.required) {
	    validators.push(widget.genValidator());
	}
    }

    validators.reverse();
    return validators;
}

function getRenderedWidgets() {
    var output = [];
    var widgets = app.getObjects("XimpleFormWidget", {}, {sort:new Sort("rank", "asc"), path: this.path()});

    for each (var widget in widgets) {
        output.push(widget.render(req.get(widget.id)));
    }
    return output;
}
