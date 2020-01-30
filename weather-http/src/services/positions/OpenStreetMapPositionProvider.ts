import axios from 'axios';
import {GeoLocation} from '../../lang/GeoLocation';
import {PositionProvider} from "./PositionProvider";
import {IGeographicInformationProvider} from "./IGeographicInformationProvider";

export class OpenStreetMapPositionProvider extends PositionProvider implements IGeographicInformationProvider {
    static OPEN_STREET_MAP_API_URL: string = "https://nominatim.openstreetmap.org/reverse?format=json";

    _parseResponse(response: any): GeoLocation{
        return {
            latitude: response.lat,
            longitude: response.lon,
            city: response.address.town || response.address.city,
            province: response.address.county,
            country: response.address.country,
            zipcode: response.address.postcode,
            region: response.address.state
        }
    }

    async getGeoInfo(latitude: number, longitude: number): Promise<GeoLocation> {
    return new Promise<GeoLocation>((resolve) => {
            axios.get(`${OpenStreetMapPositionProvider.OPEN_STREET_MAP_API_URL}&lat=${latitude}&lon=${longitude}`)
                .then(
                    response => resolve(this._parseResponse(response.data)),
                    _ => resolve(OpenStreetMapPositionProvider.DEFAULT)
                );
        });
    }
}