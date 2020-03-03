import * as React from "react";
import { ResponsiveLine } from '@nivo/line'
import {List} from "immutable";
import {ReadoutProps} from "../../lang/Readout";

interface WeatherReadoutChartCardProps {
    name: string
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
                    id: props.name,
                    data: props.readouts.map(value => {
                            return {
                                x: value.createdAt.toISOString(),
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
                    theme={{
                        dots:{
                           text: {
                               fontSize: 18
                           }
                        },
                        axis: {
                           ticks: {
                               text: {
                                   fontSize: 18
                               }
                           }
                        }
                    }}
                    data={this.state.readouts}
                    margin={{top: 30, right: 30, bottom: 30, left: 30 }}
                    xFormat="time:%H:%M:%S"
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%dT%H:%M:%S.%LZ',
                        precision: 'minute',
                    }}
                    yScale={{
                        type: 'linear',
                    }}

                    axisLeft={{
                        legend: this.props.legendY || "",
                        legendOffset: 12,
                        legendPosition: 'middle',
                    }}

                    axisBottom={{
                        format: '%H:%M',
                        tickValues: 'every 2 hours',
                        legend: this.props.legendX || "",
                        legendPosition: 'middle',
                    }}

                    useMesh={true}
                    enablePointLabel={true}
                    enablePoints={true}
                    enableArea={false}
                    enableSlices={false}
                    enableGridX={true}
                    enableGridY={true}
                    curve={'natural'}
                    pointSize={14}
                    areaOpacity={0.3}
                />
            )
        }
    }
}