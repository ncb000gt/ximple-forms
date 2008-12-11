this.getSearchableProperties = function() {
    return ['title','introduction','boilerplate'];
}

this.genValidation = function() {
    var validators = [];
    var widgets = app.getObjects("SimpleFormWidget", {}, new Sort("rank", "asc"), this.path());
    for (var i in widgets) {
        validators.push(widgets[i].genValidator());
    }
    return validators;
}

this.genRenderedWidgets = function() {
    var output = [], w;
    var widgets = app.getObjects("SimpleFormWidget", {}, new Sort("rank", "asc"), this.path());

    for (var i in widgets) {
        w = widgets[i];
        output.push(w.render(req.get(w.id)));
    }
    return output;
}
