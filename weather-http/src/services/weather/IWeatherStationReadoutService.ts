import {Moment} from "moment";
import {List, Record} from "immutable";
import {ReadoutProps} from "../../lang/Readout";

export abstract class IWeatherStationReadoutService {
    abstract async getTemperatureReadouts(startDate: Moment, endDate: Moment): Promise<List<Record<ReadoutProps>>>
    abstract async getHumidityReadouts(startDate: Moment, endDate: Moment): Promise<List<Record<ReadoutProps>>>
    abstract async getPressureReadouts(startDate: Moment, endDate: Moment): Promise<List<Record<ReadoutProps>>>
}