window.run = function() {

	L.mapbox.accessToken = 'pk.eyJ1IjoicGFudGhlcnN1cGVyIiwiYSI6ImNpbDVxOXppOTAwMW11aGx2NWtoZzJ3ZXoifQ.DxOVXLRSlTBg1v4k77AwzA';

	var map = L.mapbox.map('map', 'panthersuper.p969b9c1')
		.setView([42.45, -71.5], 10);

	d3.selectAll(".leaflet-control-container").remove();

	d3.json('activities.geojson', function(d) {


		var activities = [];

		for (k in d.features) {
			var record = d.features[k];
			var locgeoms = record.geometry.coordinates;
			var locactivities = record.properties.activities;

			//console.log(locgeoms, locactivities);
			var locleng = locgeoms.length;

			d3.range(locleng).forEach(function(i){
				console.log(i);
				var act = locactivities[i].activity;
				var geo = locgeoms[i];
				var st = locactivities[i].startTime;
				var ed = locactivities[i].endTime;

				activities.push(new activity(act,geo,st,ed));
			})
		}

		console.log(activities);

		pllst = [];

		var polyline_options = {
			color: '#ff0000', // Stroke color
			opacity: 0.2, // Stroke opacity
			weight: 2, // Stroke weight
			fillColor: '#ff0000', // Fill color
			fillOpacity: 0.6 // Fill opacity
		};

		for (k in d["features"]) {
			var pline = d["features"][k].geometry.coordinates[0];

			switchXY(pline);

			pllst.push(pline);

			var polyline = L.polyline(pline, polyline_options).addTo(map);
		}

	})

}

window.switchXY = function(pline){
	for (k in pline) {
		pline[k] = [pline[k][1], pline[k][0]];
	}
}

function activity(act,geo,st,ed) {
	this.activity = act;
	this.geometry = geo;
	this.starttime = st;
	this.endtime = ed;

	var draw = function(){

	}



}