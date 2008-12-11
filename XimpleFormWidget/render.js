function render(selection) {
    var data = {};
    var is_list = this.input_type.contains("dropdown") || this.input_type.contains("group");
    if (selection) {
        data.selection = selection;
        if (is_list) {
            data.options = this.genOptions(selection);
        }
    } else if (is_list) {
        data.options = this.genOptions();
    }
    var template = this.input_type;
    if (template.contains("dropdown")) {
        template = "dropdown";
    } else if (template == "email") {
        template = "textbox";
    }
    return this[template](data);
}
