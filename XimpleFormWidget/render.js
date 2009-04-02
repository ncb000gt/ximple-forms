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

function render(selection) {
    var data = {};
    var is_list = this.input_type.match(/dropdown/) || this.input_type.match(/group/);
    if (selection) {
        data.selection = selection;
        if (is_list) {
            data.options = this.genOptions(selection);
        }
    } else if (is_list) {
        data.options = this.genOptions();
    }
    var template = this.input_type;
    if (template.match(/dropdown/)) {
        template = "dropdown";
    } else if (template == "email") {
        template = "textbox";
    }
    return this[template](data);
}
