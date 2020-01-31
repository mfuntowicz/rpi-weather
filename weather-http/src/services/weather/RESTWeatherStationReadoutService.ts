import axios from "axios";
import {Moment} from "moment";
import {List, Record} from "immutable";
import {Readout, ReadoutProps} from "../../lang/Readout";

import {IWeatherStationReadoutService} from "./IWeatherStationReadoutService";

export class RESTWeatherStationReadoutService implements IWeatherStationReadoutService{
    static BASE_REST_API_URL: string = "/api/readouts";

    async getHumidityReadouts(startDate: Moment, endDate: Moment): Promise<List<Record<ReadoutProps>>> {
        return this.getReadouts("humidity", startDate, endDate);
    }

    async getPressureReadouts(startDate: Moment, endDate: Moment): Promise<List<Record<ReadoutProps>>> {
        return this.getReadouts("pressure", startDate, endDate);
    }

    async getTemperatureReadouts(startDate: Moment, endDate: Moment): Promise<List<Record<ReadoutProps>>> {
        return this.getReadouts("temperature", startDate, endDate);
    }

    private async getReadouts(kind: string, startDate: Moment, endDate: Moment): Promise<List<Record<ReadoutProps>>>{
        return new Promise<List<Record<ReadoutProps>>>((resolve) => {
            axios.get(
                `${RESTWeatherStationReadoutService.BASE_REST_API_URL}/${kind}?start=${startDate.unix()},end=${endDate.unix()}`
            ).then(response => {
                resolve(
                    List((<Array<ReadoutProps>>response.data).map(readout => Readout(readout)))
                );
            })
        });
    }
}