import axios from 'axios';
import Position from "../lang/Position";


class GeolocationService {
    getLocationInformationFromLatitudeLongitude(latitude, longitude, success, error){
        throw Error("Abstract method");
    }

    getPosition(data){
        throw Error("Abstract method");
    }
}


class GeocodeService extends GeolocationService {
    getLocationInformationFromLatitudeLongitude(latitude, longitude, success, error) {
        axios.get(
            'https://geocode.xyz/' + latitude + ',' + longitude + '?geoit=json')
        .then(success)
        .catch(error);
    }

    getPosition(data) {
        super.getPosition(data);
    }
}


class OpenStreetMapService extends GeolocationService {
    static OPEN_STREET_MAP_REVERSE_GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse?format=json&';

    getLocationInformationFromLatitudeLongitude(latitude, longitude, success, error) {
        axios.get(OpenStreetMapService.getUrl(latitude, longitude)).then(response => {
            success(this.getPosition(response.data))
        }).catch(error);
    }

    static getUrl(latitude, longitude){
        return OpenStreetMapService.OPEN_STREET_MAP_REVERSE_GEOCODING_API_URL + 'lat=' + latitude + '&lon=' + longitude;
    }

    getPosition(data) {
        return new Position(
            data.lat,
            data.lon,
            0.,
            1.,
            data.address.town,
            data.address.state,
            data.address.postcode,
            data.address.country,
            data.address.country_code
        )
    }
}

export {GeolocationService, GeocodeService, OpenStreetMapService};