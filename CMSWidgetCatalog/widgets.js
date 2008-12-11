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