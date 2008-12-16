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
	if (!session.data.errors[this.id]) {
	    session.data.errors[this.id] = [];
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

	app.log(req.data.toSource());
	app.log(req.data.http_referer.replace(/.*\/\/(.*[^\/:])(\/|:).*/,'$1'));
        var m = new axiom.Mail();
        m.setTo(this.recipient);
        m.setFrom("noreply@"+req.data.http_referer.replace(/.*\/\/([^\/].*)\/.*/,'$1'), "XimpleForm Form Submission: " + this.title);
        m.setSubject(this.email_subject || this.title + ": Form Submission");
    var adds = (this.bcc_recipients)?this.bcc_recipients.split(",").map(function(e) {return e.trim();}):[];
        adds = (this.cc_recipients)?this.cc_recipients.split(",").map(function(e) {return e.trim();}):[];
        m.addPart(this.email({fields: email_lines}).toXMLString(), null, "text/html");
        m.send();

	var user = new axiom.Mail();
        user.setTo(this.recipient);
        user.setFrom(this.from_address, this.from_name);
        user.setSubject(this.title + ": Form Submission");
        user.addPart(this.email({fields: email_lines}).toXMLString(), null, "text/html");
        user.send();

        if (this.redirect_url) {
	    res.redirect(this.redirect_url);
	}

	delete session.data.errors[this.id];
    }
}
