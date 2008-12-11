function csv_writeHeader(prop_columns) {
    titles = ["Timestamp", "IP Address"];
    for (var i in prop_columns) {
        titles.push(csv_escape(prop_columns[i].label.replace(/:/, "")));
    }
    res.write(titles.join(",") + "\n");
}
function toCSV(report_title, date_from, date_to) {
    function write_rows(rows) {
        var id;
        for (var r in rows) {
            var cols = [csv_escape(rows[r].timestamp.toLocaleString()), rows[r].ip_address];
            for (var i in prop_columns) { id = prop_columns[i].id; cols.push((id in rows[r]) ? csv_escape(rows[r][id]) : ""); }
            res.write(cols.join(",") + "\n");
        }
    }
    var prototype = 'SimpleFormSubmission';
    var objects = app.getObjects(prototype, this.csv_getFilter(date_from, date_to), new Sort("timestamp", "desc"), this.path());
    var prop_columns = app.getObjects("SimpleFormWidget", {}, new Sort("rank", "asc"), this.path());
    res.contentType = "application/vnd.ms-excel";
    res.getServletResponse().setHeader("Content-Disposition", "attachment; filename=" + report_title.replace(/\s/g, "_") + ".csv");
    this.csv_writeHeader(prop_columns);
    write_rows(objects);
}
