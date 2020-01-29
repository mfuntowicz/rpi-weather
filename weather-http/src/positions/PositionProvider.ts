import {GeoLocation} from "../lang/GeoLocation";
import {IGeographicInformationProvider} from "./IGeographicInformationProvider";

export abstract class PositionProvider implements IGeographicInformationProvider{
    static DEFAULT: GeoLocation = {
        latitude: undefined,
        longitude: undefined,
        accuracy: undefined,
        city: undefined,
        zipcode: undefined,
        country: undefined,
        province: undefined,
        region: undefined
    };

    abstract async getGeoInfo(latitude: number, longitude: number): Promise<GeoLocation>;

    async getPosition(): Promise<GeoLocation>{
        return new Promise<GeoLocation>((resolve) => {
            navigator.geolocation.getCurrentPosition(position => {
                return new Promise<GeoLocation>((_) => {
                    this.getGeoInfo(position.coords.latitude, position.coords.longitude)
                        .then(position => resolve(position), _ => resolve(this.getDefault()));
                });
            },
            _ => resolve(this.getDefault())
            );
        });

    }

    getDefault(): GeoLocation{
        return PositionProvider.DEFAULT;
    }
}