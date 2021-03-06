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

function preview() {
    var data = {
        preview: true,
        widgets: this.genRenderedWidgets()
    };
    data.content = this.form(data);
    res.write(this.nosidebarlayout(data));
}

function process() {
    var rules = this.genValidation();
    var errors = validate(rules, req.data);

    if (errors) {
        if (!session.data.errors) {
	    session.data.errors = {};
	}

	session.data.errors[this.id] = errors;
	res.redirect(this.getURI());
    } else {
        var widgets = app.getObjects("XimpleFormWidget", {}, {sort: new Sort("rank", "asc"), path:this.path()});
        var email_lines = [];
        for each(var w in widgets) {
            var value = "";
            var _value = req.get(w.id);
	    if (_value && typeof _value != 'string') {
		for (var i in _value) {
                    value += _value[i] + ",";
		}
		value = value.substring(0, value.length-1);
            } else {
		value = _value;
	    }
            email_lines.push(
		{
		    name: w.label.replace(/:/, ""),
		    value: value
		}
	    );
        }

        var m = new axiom.Mail();
        m.setTo(this.recipient);
        m.setFrom("noreply@"+req.data.http_host.replace(/(.*[^\:])\:.*/,'$1'), "XimpleForm Form Submission: " + this.title);
        m.setSubject(this.email_subject || this.title + ": Form Submission");
	var adds = (this.bcc_recipients)?this.bcc_recipients.split(",").map(function(e) {return e.trim();}):[];
        adds = (this.cc_recipients)?this.cc_recipients.split(",").map(function(e) {return e.trim();}):[];
        m.addPart(this.email({fields: email_lines}).toXMLString(), null, "text/html");
        m.send();

/*	if (this.send_recip_email) {
	    var recip = req.data[this.to_email_field.getTarget().id];
	    app.log(recip);
	    var user = new axiom.Mail();
            user.setTo(this.recipient);
            user.setFrom(this.from_address, this.from_name);
            user.setSubject(this.title + ": Form Submission");
            user.addPart(this.email({fields: email_lines}).toXMLString(), null, "text/html");
            user.send();
	}*/

        if (this.redirect_url) {
	    res.redirect(this.redirect_url);
	}

	delete session.data.errors[this.id];
	delete session.data.ximple_postback;
    }
}
