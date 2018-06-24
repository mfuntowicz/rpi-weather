require('ol/ol.css');
const OlMap = require('ol/map').default;
const OlLayerTile = require('ol/layer/tile').default;
const OlVector = require('ol/layer/vector').default;
const OlSourceOSM = require('ol/source/osm').default;
const OlView = require('ol/view').default;
const OlFeature = require('ol/feature').default;
const OlSourceVector = require('ol/source/vector').default;
const OlStyle = require('ol/style/style').default;
const OlStyleCircle = require('ol/style/circle').default;
const OlStyleFill = require('ol/style/fill').default;
const OlStyleStroke = require('ol/style/stroke').default;
const OlPoint = require('ol/geom/point').default;
const OlProj = require('ol/proj').default;

export function showPosition(position) {
    const positionFeature = new OlFeature();
    positionFeature.setStyle(new OlStyle({
        image: new OlStyleCircle({
            radius: 6,
            fill: new OlStyleFill({
                color: '#3399CC'
            }),
            stroke: new OlStyleStroke({
                color: '#fff',
                width: 2
            })
        })
    }));

    const map = new OlMap({
        layers: [new OlLayerTile({source: new OlSourceOSM()})],
        target: 'map',
        controls: [],
        view: new OlView({
            center: OlProj.fromLonLat([position.coords.longitude, position.coords.latitude]),
            zoom: 6
        })
    });

    const vector = new OlVector({
        map: map,
        source: new OlSourceVector({
            features: [positionFeature]
        })
    });

    if(position){
        let coord = [position.coords.longitude, position.coords.latitude];
        let point = new OlPoint(OlProj.fromLonLat(coord));
        positionFeature.setGeometry(point);
    }
}