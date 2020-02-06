import 'bootstrap/dist/css/bootstrap.css';

import * as React from "react";
import * as ReactDOM from "react-dom";

import { WeatherStation } from "./WeatherStation";
import {PositionProvider} from "./services/positions/PositionProvider";
import {OpenStreetMapPositionProvider} from "./services/positions/OpenStreetMapPositionProvider";
import {IWeatherStationReadoutService} from "./services/weather/IWeatherStationReadoutService";
import {RESTWeatherStationReadoutService} from "./services/weather/RESTWeatherStationReadoutService";

let positionProvider: PositionProvider = new OpenStreetMapPositionProvider();
let readoutsFetcher: IWeatherStationReadoutService = new RESTWeatherStationReadoutService();

ReactDOM.render(
    <WeatherStation positionProvider={positionProvider} readoutsFetcher={readoutsFetcher}/>,
    document.getElementById("app")
);