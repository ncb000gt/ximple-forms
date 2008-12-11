function preview() {
    var data = {
        preview: true,
        widgets: this.genRenderedWidgets()
    };
    data.content = this.form(data);
    res.write(this.nosidebarlayout(data));
}

function process() {
    //var rules = this.genValidation();
    var errors = []; //this.validate(rules, req.data);
    if (errors.length > 0) {
        var data = {
            errors: errors,
            /*rules: repr(rules),*/
            widgets: this.genRenderedWidgets()
        };
        data.content = this.form(data);
        res.write(this.nosidebarlayout(data));
    } else {
        var widgets = app.getObjects("SimpleFormWidget", {}, {sort: new Sort("rank", "asc"), path:this.path()});
        var email_lines = [];
        var s = new SimpleFormSubmission();
        s.form_id = this._id;
        s.timestamp = new Date();
        s.ip_address = req.data.http_remotehost;
        for each(var w in widgets) {
            var value = "";
            var _value = req.get(w.id);
	    if (typeof _value != 'string') {
		for (var i in _value) {
                    value += _value[i] + ",";
		}
		value = value.substring(0, value.length-1);
            } else {
		value = _value;
	    }
            s[w.id] = value;
            email_lines.push(
		{
		    name: w.label.replace(/:/, ""),
		    value: value
		}
	    );
        }

        this.add(s);
	if (this.submissions) {
	    this.submissions = this.submissions.concat(new MultiValue(new Reference(s)));
	} else {
	    this.submissions = new MultiValue(new Reference(s));
	}

        var m = new axiom.Mail();
        m.setTo(this.recipient);
        m.setFrom("noreply@acbankers.org", "ACB Web Site");
        m.setSubject(this.email_subject || this.title + ": Form Submission");
        var adds = (this.bcc_recipients)?this.bcc_recipients.split(","):[];
        for (var i in adds) {
            m.addBCC(adds[i].trim());
        }
        adds = (this.cc_recipients)?this.cc_recipients.split(","):[];
        for (var i in adds) {
            m.addCC(adds[i].trim());
        }
        m.addPart(domToString(this.email({fields: email_lines})), null, "text/html");
        m.send();
        if (this.redirect_url) {
	    res.redirect(this.redirect_url);
	}

	var data = { };
	data.content = this.default_form_thankyou(data);
	res.write(this.nosidebarlayout(data));
    }
}
