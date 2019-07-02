import axios from 'axios';


class GeolocationService {
    getLocationInformationFromLatitudeLongitude(latitude, longitude, success, error){
        throw Error("Abstract method");
    }
}


class GeocodeService extends GeolocationService {
    getLocationInformationFromLatitudeLongitude(latitude, longitude, success, error) {
        axios.post('https://geocode.xyz/',
        {
            'locate': location.coords.latitude + ',' + location.coords.longitude,
            'geoit':'json'
        }).then(success).catch(error);
    }
}

export {GeolocationService, GeocodeService};