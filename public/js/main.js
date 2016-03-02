window.run = function() {

	L.mapbox.accessToken = 'pk.eyJ1IjoicGFudGhlcnN1cGVyIiwiYSI6ImNpbDVxOXppOTAwMW11aGx2NWtoZzJ3ZXoifQ.DxOVXLRSlTBg1v4k77AwzA';

	var map = L.mapbox.map('map', 'panthersuper.p969b9c1')
		.setView([42.45, -71.5], 10);

	d3.selectAll(".leaflet-control-container").remove();

	d3.json('activities.geojson', function(d) {


		var activities = [];
		var typelst = [];

		for (k in d.features) {
			var record = d.features[k];
			var locgeoms = record.geometry.coordinates;
			var locactivities = record.properties.activities;

			var locleng = locgeoms.length;

			d3.range(locleng).forEach(function(i){
				var act = locactivities[i].activity;
				if(typelst.indexOf(act)==-1)
					typelst.push(act);


				var geo = locgeoms[i];
				
				var st = locactivities[i].startTime;
				var ed = locactivities[i].endTime;

				activities.push(new activity(act,geo,st,ed,map));
			})
		}

		console.log(activities);
		console.log(typelst);

		activities.forEach(function(activity){
			activity.draw();

		})

	})

}

window.switchXY = function(pline){
	var out = $.extend(true, [], pline);
	for (k in out) {
		out[k] = [out[k][1], out[k][0]];
	}
	return out;
}

function activity(act,geo,st,ed,map) {
	this.activity = act;
	this.geometry = switchXY(geo);
	this.starttime = st;
	this.endtime = ed;

	this.col = null;
	switch(this.activity){
		case "walking":
			this.col = "#00ff00";
			break;
		case "transport":
			this.col = "#ff0000";
			break

		case "cycling":
			this.col = "#2ecddc";
			break;
	}

	console.log(this.col);

	this.polyline_options = {
		color: this.col, // Stroke color
		opacity: 0.2, // Stroke opacity
		weight: 2, // Stroke weight
		fillColor: '#ff0000', // Fill color
		fillOpacity: 0.6 // Fill opacity
	};

	this.draw = function(){
		var polyline = L.polyline(this.geometry, this.polyline_options).addTo(map);
	}

}