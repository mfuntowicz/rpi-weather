import * as React from "react";
import {ReadoutProps} from "../../lang/Readout";
import { ResponsiveLine } from '@nivo/line'

interface WeatherReadoutChartCardProps {
    readouts: ReadoutProps[]
}

interface WeatherReadoutChartCardState {
    readouts: any[]
}

export class WeatherReadoutChartCard extends React.Component<WeatherReadoutChartCardProps, WeatherReadoutChartCardState>{

    constructor(props: WeatherReadoutChartCardProps) {
        super(props);

        this.state = {
            readouts: undefined
        }
    }

    static getDerivedStateFromProps(props: WeatherReadoutChartCardProps, _: WeatherReadoutChartCardState) {
        if(props.readouts != undefined){
            return {
                readouts: [{
                    id: "Serie",
                    data: props.readouts.flatMap(
                        (readout) => {
                            return {
                                x: readout.createdAt.toISOString(), //format("Y-MM-DD HH:mm:ss")
                                y: readout.value
                            }
                        }
                    )
                }]
            }
        }

        return null;
    }

    render(){
        if(this.state.readouts === undefined){
            return <span></span>
        }else {
            return (
                <ResponsiveLine
                    data={this.state.readouts}
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%dT%H:%M:%S.%LZ',
                        precision: 'second',
                    }}
                    xFormat="time:%Y-%m-%d %H:%M:%S"
                    yScale={{
                        type: 'linear',
                        stacked: false,
                    }}
                    axisLeft={{
                        legend: 'linear scale',
                        legendOffset: 12,
                    }}
                    axisBottom={{
                        format: '%H %M',
                        tickValues: 'every 2 hours',
                        legend: 'time scale',
                        legendOffset: -12,
                    }}

                    curve={'monotoneX'}
                    enablePointLabel={false}
                    pointSize={0}
                    // pointBorderWidth={1}
                    // pointBorderColor={{
                    //     from: 'color',
                    //     modifiers: [['darker', 0.3]],
                    // }}
                    useMesh={true}
                    enableSlices={false}
                    enableArea={true}
                    areaOpacity={0.3}
                />
            )
        }
    }
}