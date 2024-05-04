// url
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

//fetch data including lat/lon, depth, magnitude
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let ffeatures = features.filter(id => id.id == "nc73872510"); 
    let variable_one = ffeatures[0];
    console.log(variable_one);

    let id = variable_one.id;
    console.log(id);

    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); 
    console.log(coordinates[1]); 
    console.log(coordinates[2]); 
 
    let geometry = variable_one.geometry;
    console.log(geometry);
    let magnitude = variable_one.properties.mag;
    console.log(magnitude);  
    let depth = geometry.coordinates[2];
    console.log(depth);

});

// add tile layer/map object
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streets]
});

//define basemaps/layergroups/overlays and add control layer
let baseMaps = {
    "streets": streets
};

let edata = new L.LayerGroup();
let tdata = new L.LayerGroup();

let overlays = {
    "Earthquake": edata,
    "Tectonic Plate": tdata
};

L.control.layers(baseMaps, overlays).addTo(myMap);

// format output and add legend
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2])
    }
};

function chooseRadius(magnitude) {
    return magnitude*5;
};

function chooseColor(depth) {
    if (depth <= 10) return "PaleGoldenRod";
    else if (depth > 10 & depth <= 20) return "PaleGreen";
    else if (depth > 20 & depth <= 30) return "DarkSeaGreen";
    else if (depth > 30 & depth <= 40) return "DarkOliveGreen";
    else if (depth > 40 & depth <= 50) return "DarkSlateGray";
    else return "Black";
};

// styling
d3.json(url).then(function (data) { 
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  
            return L.circleMarker(latlon).bindPopup(feature.id); 
        },
        style: styleInfo 
    }).addTo(edata); 
    edata.addTo(myMap);

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) { 
        L.geoJson(data, {
            color: "red",  
            weight: 3
        }).addTo(tdata); 
        tdata.addTo(myMap);
    });


});

var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Legend</h4>";
       div.innerHTML += '<i style="background: PaleGoldenRod"></i><span>(< 10)</span><br>';
       div.innerHTML += '<i style="background: PaleGreen"></i><span>(10-20)</span><br>';
       div.innerHTML += '<i style="background: DarkSeaGreen"></i><span>(21-30)</span><br>';
       div.innerHTML += '<i style="background: DarkOliveGreen"></i><span>(31-40)</span><br>';
       div.innerHTML += '<i style="background: DarkSlateGray"></i><span>(41-50)</span><br>';
       div.innerHTML += '<i style="background: Black"></i><span>(> 50)</span><br>';
  
    return div;
  };

  legend.addTo(myMap);
