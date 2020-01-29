import axios from 'axios';
import {GeoLocation} from '../lang/GeoLocation';
import {PositionProvider} from "./PositionProvider";
import {IGeographicInformationProvider} from "./IGeographicInformationProvider";

class OpenStreetMapPositionProvider extends PositionProvider implements IGeographicInformationProvider {
    static OPEN_STREET_MAP_API_URL: string = "https://nominatim.openstreetmap.org/reverse?format=json"

    async getGeoInfo(latitude: number, longitude: number): Promise<GeoLocation> {
        return new Promise((resolve, reject)) => {
            axios.get(OpenStreetMapPositionProvider.OPEN_STREET_MAP_API_URL).then(success => {

            })
        };
    }
}