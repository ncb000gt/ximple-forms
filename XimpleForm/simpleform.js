function getFieldsJSON() {
    var widgets = app.getObjects('XimpleFormWidget', {}, {sort: new Sort({'rank':'asc'}), path: this.path()});
    if (!widgets) { return '[]'; }
    var fields = [];
    for each(var item in widgets) {
        fields.push('{name:"'+item.label+'",'+
		    'type:"'+item.input_type+'",'+
		    'required:'+item.required+','+
		    'value:"'+item.values+'",'+
		    'rank:'+item.rank+'}');
    }
    return '['+fields.join(',')+']';
}

function editsimpleform() {
    var xfw = null;

    for each (var c in this.getChildren('XimpleFormWidget')) {
	c.del();
    }

    for each (var field in req.data.fields) {
        xfw = new XimpleFormWidget();
        xfw.label = field['name'];
        xfw.input_type = field['type'];
        xfw.required = field['required'];
        xfw.values = field['value'];
        xfw.rank = parseInt(field['rank'], 10);
        this.add(xfw);
        xfw.id = xfw._id+'i';
    }
}
