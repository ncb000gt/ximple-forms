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
