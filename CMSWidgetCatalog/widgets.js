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

function simpleform(attr_name, props) {
    return <fieldset>
	<h2>Edit Form Fields</h2>
	<fieldset class="ax-refomsp ax-widgets" id="ax-widgets">
	<div class="error_message">hidden error message</div>
	<div id="widgets_sfb">SimpleFormBuilder</div>
	<script type="text/javascript" tal:text="$">//<![CDATA[
	dojo.require("axiom.widget.SimpleFormBuilder");
	var sfb_widgets = dojo.widget.createWidget('axiom:SimpleFormBuilder', {
						       appPath:'${this.getURI()}/',
						       id:'widgets'},
						       dojo.byId('widgets_sfb'));
						       sfb_widgets.addFields(${this.getFieldsJSON()});
	function widgets_submit() {
	    sfb_widgets.submit('${this._id}', "/editsimpleform");
	}
	axiom.addSubmitMethod(widgets_submit);
	//]]></script>
	</fieldset>
    </fieldset>;
}