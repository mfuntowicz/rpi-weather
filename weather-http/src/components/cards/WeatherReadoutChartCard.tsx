import * as React from "react";
import { ResponsiveLine } from '@nivo/line'
import {List} from "immutable";
import {ReadoutProps} from "../../lang/Readout";

interface WeatherReadoutChartCardProps {
    readouts: List<ReadoutProps>
    legendY?: string
    legendX?: string
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
                    data: props.readouts.map(value => {
                            return {
                                x: value.createdAt.toISOString(), //format("Y-MM-DD HH:mm:ss")
                                y: value.value
                            }
                        }
                    ).toArray()
                }]
            }
        }

        return null;
    }

    render(){
        if(this.state.readouts === undefined){
            return <span />
        }else {
            return (
                <ResponsiveLine
                    data={this.state.readouts}
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%dT%H:%M:%S.%LZ',
                        precision: 'minute',
                    }}
                    xFormat="time:%H:%M:%S"
                    yScale={{
                        type: 'linear',
                        stacked: false,
                    }}
                    axisLeft={{
                        legend: this.props.legendY || "",
                        legendOffset: 12,
                    }}
                    axisBottom={{
                        format: '%H %M',
                        tickValues: 'every 12 hours',
                        legend: this.props.legendX || "",
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
                    enableGridX={true}
                    enableGridY={true}
                    enableSlices={false}
                    enableArea={true}
                    areaOpacity={0.3}
                />
            )
        }
    }
}