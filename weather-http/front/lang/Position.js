class Position {
    constructor(latitude, longitude, altitude, accuracy, city, region, zipcode, country, province) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.accuracy = accuracy;
        this.city = city;
        this.region = region;
        this.zipcode = zipcode;
        this.country = country;
        this.province = province;
    }

    static get_undefined(){
        return new Position(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        )
    }
}


export default Position;