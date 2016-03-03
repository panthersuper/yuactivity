window.intercalid;


window.run = function() {

	L.mapbox.accessToken = 'pk.eyJ1IjoicGFudGhlcnN1cGVyIiwiYSI6Il9JRlBXMkkifQ.4VOcpN_xI1jf1XxjnIZHmw';

	var map = L.mapbox.map('map', 'panthersuper.8fb2ee46')
		.setView([42.45, -71.3], 10);


	d3.selectAll(".leaflet-control-container").remove();

	d3.json('activities.geojson', function(d) {


		var activities = [];
		var typelst = [];

		for (k in d.features) {
			var record = d.features[k];
			var locgeoms = record.geometry.coordinates;
			var locactivities = record.properties.activities;

			var locleng = locgeoms.length;

			d3.range(locleng).forEach(function(i) {
				var act = locactivities[i].activity;
				if (typelst.indexOf(act) == -1)
					typelst.push(act);


				var geo = locgeoms[i];

				var st = locactivities[i].startTime;
				var ed = locactivities[i].endTime;

				activities.push(new activity(act, geo, st, ed, map));
			})
		}



		activities.forEach(function(activity){
			activity.draw();
		});

		control(activities);

	});
}


window.autoanimate = function(activities) {
	d3.selectAll(".mypath").remove();;

	if(window.intercalid){
		window.clearInterval(window.intercalid);
	}

	var i = 0;
	window.intercalid = window.setInterval(function() {
		i++;
		var totalen = activities.length;

		if (i < totalen) {
			activities[i].draw();

			var ratio = i/totalen;
			ratio = ratio*100*0.98+"%";
			$("#mark").css("left",ratio);

		}
	}, 50);
}

window.skipTo = function(activities,ratio){
	d3.selectAll(".mypath").remove();;
	if(window.intercalid){
		window.clearInterval(window.intercalid);
	}

	var len = activities.length;
	var thresh = len*ratio;

		activities.forEach(function(activity,i){
			if(i<thresh)
			activity.draw();
		});


}




window.switchXY = function(pline) {
	var out = $.extend(true, [], pline);
	for (k in out) {
		out[k] = [out[k][1], out[k][0]];
	}
	return out;
}

function activity(act, geo, st, ed, map) {
	this.activity = act;
	this.geometry = switchXY(geo);
	this.starttime = st;
	this.endtime = ed;

	this.col = null;
	this.stroke = null;
	switch (this.activity) {
		case "walking":
			this.col = "#2ecddc";
			this.stroke = 3;
			break;
		case "transport":
			this.col = "#ff843d";
			this.stroke = 1;
			break
			/*		case "cycling":
						this.col = "#00ff00";
						break;
			*/
	}

	this.polyline_options = {
		color: this.col, // Stroke color
		opacity: 0.2, // Stroke opacity
		weight: this.stroke, // Stroke weight

	};

	this.draw = function() {
		var polyline = L.polyline(this.geometry, this.polyline_options);
		polyline.addTo(map);
		d3.select(polyline._container).attr("class",act+" mypath");

		var t = this.endtime.split("T");
		var date = t[0];
		var time = t[1].substring(0,4);
		time = time.substring(0,2)+":"+time.substring(2,4);
		$("#nowtime").text(date+ "  " + time);
	}



}


////////////////////////////////////
//button control part

window.control = function(activities){
	$("#play").click(function() {
		autoanimate(activities);

	});

	$(".walk").click(function(){
		if($(".walking").attr("style") == "display: none;"){
			$(".walking").show();

		}else
			$(".walking").hide();

	});
	$(".trans").click(function(){
		if($(".transport").attr("style") == "display: none;"){
			$(".transport").show();

		}else
			$(".transport").hide();

	});

	d3.select("#timeline").on("click",function(event){
		var xx = d3.mouse(this)[0];
		var total = +d3.select(this).style("width").split("px")[0];
		console.log(xx,total);

		var ratio = xx/total;
		skipTo(activities,xx/total);

		var ratioS = ratio*100*0.98+"%";
		$("#mark").css("left",ratioS);

	});

}



