import * as React from "react";
import {WeatherCard} from "./WeatherCard";
import {CardText} from "reactstrap";
import {ReadoutProps} from "../../lang/Readout";

export interface WeatherReadoutValueCardProps{
    readout: Readonly<ReadoutProps>,
    defaultValue: string,
    unit: string
}

export class WeatherReadoutCard extends React.Component<WeatherReadoutValueCardProps, {}>{
    render(){
        return (
            <WeatherCard>
                <CardText className={"text-center"}>
                    <span className={"text-headline"}>
                    {
                        this.props.readout != undefined ? this.props.readout.value : this.props.defaultValue
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