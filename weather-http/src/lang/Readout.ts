import * as moment from 'moment';
import {Record} from "immutable";

export enum ReadoutKind {
    DUMMY,
    TEMPERATURE,
    HUMIDITY,
    PRESSURE
}

export interface ReadoutProps{
    kind: ReadoutKind,
    createdAt: moment.Moment,
    value: number
}

export const Readout = Record<ReadoutProps>({
    kind: ReadoutKind.DUMMY,
    createdAt: moment(),
    value: 0.
});