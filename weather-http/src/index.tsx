import 'bootstrap/dist/css/bootstrap.css';

import * as React from "react";
import * as ReactDOM from "react-dom";

import { WeatherStation } from "./WeatherStation";
import {PositionProvider} from "./services/positions/PositionProvider";
import {OpenStreetMapPositionProvider} from "./services/positions/OpenStreetMapPositionProvider";

let positionProvider: PositionProvider = new OpenStreetMapPositionProvider();

ReactDOM.render(
    <WeatherStation positionProvider={positionProvider} />,
    document.getElementById("app")
);