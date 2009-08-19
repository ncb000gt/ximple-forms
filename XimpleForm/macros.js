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
