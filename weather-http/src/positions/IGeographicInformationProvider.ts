import { GeoLocation } from "../lang/GeoLocation";

export interface IGeographicInformationProvider {
     getGeoInfo(latitude: number, longitude: number): Promise<GeoLocation>
}