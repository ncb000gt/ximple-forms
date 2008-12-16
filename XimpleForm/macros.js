this.getSearchableProperties = function() {
    return ['title','introduction','boilerplate'];
}

this.genValidation = function() {
    var validators = [];
    var widgets = app.getObjects("XimpleFormWidget", {}, {sort: new Sort("rank", "asc"), path: this.path()});
    for (var i in widgets) {
        validators.push(widgets[i].genValidator());
    }
    return validators;
}

this.getRenderedWidgets = function() {
    var output = [];
    var widgets = app.getObjects("XimpleFormWidget", {}, {sort:new Sort("rank", "asc"), path: this.path()});

    for each (var widget in widgets) {
        output.push(widget.render(req.get(widget.id)));
    }
    return output;
}
