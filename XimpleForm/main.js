function main() {
    var data = {
        widgets: this.genRenderedWidgets(),
        rules: repr(this.genValidation())
    };
    data.content = this.form(data);
    res.write(this.nosidebarlayout(data));  
}
