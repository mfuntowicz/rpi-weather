import * as React from "react";
import {WeatherCard} from "./WeatherCard";
import {CardText} from "reactstrap";
import {ReadoutKind, ReadoutProps} from "../../lang/Readout";
import {List, Map} from "immutable";

export interface WeatherReadoutValueCardProps{
    readout: Map<ReadoutKind, List<ReadoutProps>>,
    kind: ReadoutKind,
    defaultValue: string,
    unit: string
}

export class WeatherReadoutCard extends React.Component<WeatherReadoutValueCardProps, {}>{
    render(){
        let value = this.props.defaultValue;
        if (this.props.readout.has(this.props.kind) &&  this.props.readout.get(this.props.kind, List()).size > 0){
            let readouts = this.props.readout.get(this.props.kind);
            value = readouts.get(readouts.size - 1).value.toFixed(2);
        }

        return (
            <WeatherCard>
                <CardText className={"text-center"}>
                    <span className={"text-headline"}>
                    {
                        value
                    }
                    </span>
                    <span>
                    {
                        ` ${this.props.unit}`
                    }
                    </span>
                </CardText>
            </WeatherCard>
        )
    }
}