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

dojo.provide("axiom.widget.SimpleFormBuilder");

dojo.require("dojo.event.*");
dojo.require("dojo.html.*");
dojo.require("dojo.io.*");
dojo.require("dojo.json");
dojo.require("dojo.lang.common");
dojo.require("dojo.widget.*");

dojo.widget.defineWidget(
    "axiom.widget.SimpleFormBuilder",
    dojo.widget.HtmlWidget,
    function(){},
    {
        appPath:'',
        rows:[],
        fields:[],
        fieldsTable:null,
        id:'_',
	ranks: 1,
        inputTypes:[{value:'textbox',opt:'Text Box'},
		    {value:'textarea',opt:'Text Area'},
		    {value:'heading',opt:'Heading'},
		    {value:'body',opt:'Body'},
		    {value:'dropdown',opt:'Drop-Down List'},
		    /*{value:'state_dropdown',opt:'State Drop-Down List'},
		    {value:'country_dropdown',opt:'Country Drop-Down List'},*/
		    {value:'radio_button_group',opt:'Radio Button Group'},
		    {value:'check_box_group',opt:'Check Box Group'},
		    {value:'email',opt:'Email Address'},
		    /*{value:'date',opt:'Date'},*/
		    {value:'hidden',opt:'Hidden'}],
        templatePath:new dojo.uri.dojoUri('../axiom/widget/resources/SimpleFormBuilder.html'),
        updateButton:null,
        addField:function(data) {
            var row = document.createElement('tr');
            this.rows.splice(this.rows.length,0,row);
            var inputs = {'delete':this.newInput('input', row.id, 'delete', 'checkbox'),
			  'name':this.newInput('input', row.id, 'name', 'text', ((data)?data.name:null)),
			  'type':this.newInput('select', row.id, 'type', null, ((data)?data.type:null)),
			  'value':this.newInput('input', row.id, 'value', 'text', ((data)?data.value:null)),
			  'required':this.newInput('input', row.id, 'required', 'checkbox', ((data)?data.required:null)),
			  'rank':this.newInput('select', row.id, 'rank', this.rows.length, ((data)?data.rank:null))};
            for (var key in inputs) {
                var col = document.createElement('td');
                col.appendChild(inputs[key]);
                row.appendChild(col);
            }
            this.fields.push(inputs);
            this.fieldsTable.appendChild(row);
        },
        addFields:function(frows) {
	    this.ranks = (frows.length || 1);
            for (var i=0;i<frows.length;i++) {
		var fro = frows[i];
		this.addField({
				  name: fro['name'],
				  type: fro['type'],
				  value: fro['value'],
				  required: (fro['required'] || null),
				  rank: fro['rank']
			      });
            }
            this.update(true);
        },
        appendOptions:function(select, selected) {
            var opt = null;
            for (var i=0;i<this.inputTypes.length;i++) {
		var inputType = this.inputTypes[i];
                opt = document.createElement('option');
                opt.value = inputType['value'];
		opt.innerHTML = inputType['opt'];
		if (selected && inputType['value'] == selected) {
		    opt.selected = 'selected';
		}
                select.appendChild(opt);
            }
        },
        getFieldValues:function() {
            var values = [];
            for(var i=0;i<this.fields.length;i++) {
		var field = this.fields[i];
                if (field['name'].value!='') {
                    var f = {'name':field['name'].value,
			     'type':field['type'].options[field['type'].selectedIndex].value,
			     'value':field['value'].value,
			     'required':field['required'].checked,
			     'rank':field['rank'].options[field['rank'].selectedIndex].value};
                    values.splice(values.length, 0, f);
                }
            }
            return values;
        },
        handleSubmit:function(type, data, req) {
            if (type=='error') {
                axiom.openModal({contenttext:'error!'});
            }
        },
        newInput:function(element, rowid, name, type, value) {
            var e = document.createElement(element);
            if (element=='input') { e.type = type; }
            if (name=='type') { this.appendOptions(e, value); }
	    if (type=='checkbox' && value) {
		e.checked = "checked";
	    } else if (value) {
		e.value = value;
	    }
            if (name=='rank') { this.setRankOptions(e, value, this.ranks); }
            e.id = rowid+'_'+name;
            dojo.event.kwConnect({
				     srcObj:e,
				     srcFunc:'onkeyup',
				     adviceObj:this,
				     adviceFunc:'onKey'});
            return e;
        },
        onKey:function(e) {
            if (e.keyCode==e.KEY_ENTER) { this.update(); }
        },
        postCreate:function() {
            this.rows = [];
            this.fields = [];
            this.updateButton.src = this.appPath+'static/axiom/images/update_form_fields.gif';
            dojo.event.kwConnect({
				     srcObj:this.updateButton,
				     srcFunc:'onclick',
				     adviceObj:this,
				     adviceFunc:'update'});
            var tbody = this.fieldsTable.getElementsByTagName("tbody");
            if (tbody.length === 1) {
                this.fieldsTable = tbody[0];
            }
        },
        removeField:function(index) {
            this.fieldsTable.removeChild(this.rows[index]);
            this.rows.splice(index,1);
            this.fields.splice(index,1);
        },
        setSelectedRanks:function() {
            var s = 0;
            var m = 0;
            for (var a=1;a<=this.fields.length;a++) {
                m = 0;
                for (var i=0;i<this.fields.length;i++) {
		    var field = this.fields[i];
                    s = parseInt(field['rank'].options[field['rank'].selectedIndex].value);
                    if ((s==a)&&(m==0)) {m=1;}
                    else if ((s==a)&&(m>0)) { field['rank'].selectedIndex = a+m-1; m++; }
                }
                if (m==0) {
                    for (var i=0;i<a;i++) {
			var field = this.fields[i];
                        s = parseInt(field['rank'].options[field['rank'].selectedIndex].value);
                        if (s > a-1) {field['rank'].selectedIndex = a-1;i=a;}
                    }
                }
            }
        },
        setRankOptions:function(select, selected, max, clear) {
            if (clear==true) {
                var l = select.options.length;
                for (var i=0;i<l;i++) { select.removeChild(select.options[i]);i--;l--; }
            }
            for (var i=1;i<=max;i++) {
                opt = document.createElement('option');
                opt.value = opt.innerHTML = i;
                if (i==selected) { opt.selected = true; }
                select.appendChild(opt);
            }
        },
        submit:function(lid, mname) {
	    var location = null;
	    dojo.io.bind({
			     url: "getIdLocation",
			     method: "POST",
			     load: function(type, data, req) {
				 if (type == 'error') {
				     axiom.openModal({contexterror:'Error trying to get the location of the form submit.'});
				 } else {
				     location = data;
				 }
			     },
			     preventCache: true,
			     contentType: 'text/json',
			     postContent: dojo.json.serialize({'lid': lid, 'prototypes': ['XimpleForm']}),
			     sync: true
			 });
	    if (location.charAt(0) != '/') {
		axiom.openModal({contexterror:'Invalid location returned.'});
	    } else {
		var url = location + mname;
		dojo.io.queueBind({
				      url: url,
				      method: 'post',
				      load: this.handleSubmit,
				      preventCache: true,
				      contentType: 'text/json',
				      postContent: dojo.json.serialize({id:this.id,fields:this.getFieldValues()}),
				      widget: this
				  });
	    }
        },
        update:function(no_focus) {
            for (var i = (this.fields.length-1); i >= 0; i--) {
                if (this.fields[i]['delete'].checked) this.removeField(i);
            }
            if (!this.fields || this.fields.length === 0 || this.fields[(this.fields.length-1)]['name'].value != '') {
		this.ranks++;
                this.addField();
            }

	    this.ranks = this.fields.length;

            for (var i=0;i<(this.fields.length-1);i++) {
                this.setRankOptions(this.fields[i]['rank'], this.fields[i]['rank'].options[this.fields[i]['rank'].selectedIndex].value, this.ranks, true);
            }

            this.setSelectedRanks();
            if (!no_focus) { this.fields[this.fields.length-1]['name'].focus(); }
        }
    }
);
