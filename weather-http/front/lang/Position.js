class Position {
    constructor(latitude, longitude, altitude, accuracy, city, region, zipcode, country, province){
        this.latitude  = latitude;
        this.longitude = longitude;
        this.altitude  = altitude;
        this.accuracy  = accuracy;
        this.city      = city;
        this.region    = region;
        this.zipcode   = zipcode;
        this.country   = country;
        this.province  = province;
    }

    static from_location(location){
        return Position(
            location.coords.latitude,
            location.coords.longitude,
            location.coords.altitude || data.elevation,
            location.coords.accuracy,
            data.city,
            data.region,
            data.postal,
            data.country,
            data.prov
        )
    }
}

export default Position;