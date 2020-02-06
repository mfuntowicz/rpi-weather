import {Moment} from "moment";
import {List} from "immutable";
import {ReadoutProps} from "../../lang/Readout";

export abstract class IWeatherStationReadoutService {

    static MOMENT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

    abstract async getAllReadouts(startDate: Moment, endDate: Moment): Promise<List<ReadoutProps>>
    abstract async getTemperatureReadouts(startDate: Moment, endDate: Moment): Promise<List<ReadoutProps>>
    abstract async getHumidityReadouts(startDate: Moment, endDate: Moment): Promise<List<ReadoutProps>>
    abstract async getPressureReadouts(startDate: Moment, endDate: Moment): Promise<List<ReadoutProps>>
}