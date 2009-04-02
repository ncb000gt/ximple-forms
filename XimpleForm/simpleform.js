/**
*    Creates a form generation tool that can be implemented anywhere from the Axiom CMS
*    Copyright (C) 2009  Nicholas Campbell
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
