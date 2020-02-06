import axios from "axios";
import * as moment from "moment";
import {List} from "immutable";
import {ReadoutKind, ReadoutProps} from "../../lang/Readout";

import {IWeatherStationReadoutService} from "./IWeatherStationReadoutService";

export class RESTWeatherStationReadoutService implements IWeatherStationReadoutService{
    static BASE_REST_API_URL: string = "/api/readouts";

    async getHumidityReadouts(startDate: moment.Moment, endDate: moment.Moment): Promise<List<ReadoutProps>> {
        return this.getReadouts("humidity", startDate, endDate);
    }

    async getPressureReadouts(startDate: moment.Moment, endDate: moment.Moment): Promise<List<ReadoutProps>> {
        return this.getReadouts("pressure", startDate, endDate);
    }

    async getTemperatureReadouts(startDate: moment.Moment, endDate: moment.Moment): Promise<List<ReadoutProps>> {
        return this.getReadouts("temperature", startDate, endDate);
    }

    async getAllReadouts(startDate: moment.Moment, endDate: moment.Moment): Promise<List<ReadoutProps>> {
        return this.getReadouts("", startDate, endDate);
    }

    private async getReadouts(kind: string, startDate: moment.Moment, endDate: moment.Moment): Promise<List<ReadoutProps>>{
        return new Promise<List<ReadoutProps>>((resolve) => {
            axios.get(
                `${RESTWeatherStationReadoutService.BASE_REST_API_URL}${kind.length > 0 ? kind : ""}?start=${startDate.format(IWeatherStationReadoutService.MOMENT_DATE_FORMAT)}&end=${endDate.format(IWeatherStationReadoutService.MOMENT_DATE_FORMAT)}`
            ).then(response => {
                resolve(
                    List<ReadoutProps>(response.data.map((r: any) => {
                        return <ReadoutProps>{
                            kind: ReadoutKind[r.kind as keyof typeof ReadoutKind],
                            createdAt: moment(r.created_at),
                            value: r.readout
                        }
                    }))
                );
            })
        });
    }
}