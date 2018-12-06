import React from "react"
import moment from "moment";
import { createRefetchContainer } from "react-relay";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const timeFormatter = (time) => {
    return moment(time).format('HH:mm');
};

class ChartReadoutCardView extends React.Component {
    render(){
        const readouts = this.props.items;

        return (
            <ResponsiveContainer width="100%" height="100%" minHeight={ this.props.minHeight + "px" }>
                <LineChart data={ readouts } margin={{top: 5, right: 5, left: 5, bottom: 5}}>
                    <XAxis dataKey="createdAt" interval={ "preserveStartEnd" } stroke={ "#FFFFFF" }  tickFormatter={ timeFormatter } />
                    <YAxis datakey="value" width={ 35 } stroke={ "#FFFFFF" } />
                    <Line type="natural" dataKey="value" stroke={ this.props.chartColor || '#FF0000' }  strokeWidth={ 3 } dot={ false } />
                </LineChart>
            </ResponsiveContainer>
        )
    }
}

export default createRefetchContainer(
    ChartReadoutCardView,
    graphql`
        fragment ChartReadoutCardView_items on SensorReadout @relay(plural: true)
        {
            createdAt,
            value
        }
    `, graphql`
            query ChartReadoutCardViewRefetchQuery($kind: String, $from: DateTime!, $to: DateTime!) {
                items: allReadoutsOfBetween(kind: $kind, start: $from, end: $to){
                    ...ChartReadoutCardView_items
                }
            }
    `
);