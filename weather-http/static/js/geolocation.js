function showPosition(position) {
    const positionFeature = new ol.Feature();
    positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));

    const map = new ol.Map({
        layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
        target: 'map',
        controls: [],
        view: new ol.View({
            center: ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]),
            zoom: 5
        })
    });

    const vector = new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
            features: [positionFeature]
        })
    });

    if(position){
        let point = new ol.geom.Point(ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]));
        positionFeature.setGeometry(point);
    }
}



$(document).ready(function(){
    if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(showPosition)
});