function getIdLocation() {
    var id = req.get('lid');
    var prototypes = req.get('prototypes');
    if (id) {
	var objs = app.getHits((prototypes || []), {_id: id}, 1);
	if (objs.length > 1) {
	    return objs.objects(0,1)[0].getURI();
	}
    }
    return '';
}
