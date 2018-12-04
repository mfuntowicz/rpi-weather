import React from 'react'
import { createRefetchContainer } from 'react-relay'


class LatestTemperatureValueView extends React.Component {

    render(){
        const readout = this.props.item.edges[0].node;
        return <div>{readout.value}, {readout.createdAt}</div>
    }
}

export default createRefetchContainer(
    LatestTemperatureValueView,
    graphql`
        fragment LatestTemperatureValueView_item on SensorReadoutConnection
        {
            edges {
                node {
                    createdAt,
                    value
                }
            }
        }
    `, graphql`
        query LatestTemperatureValueViewRefetchQuery($kind: String) {
            item: latestReadoutsOf(kind: $kind){
                ...LatestTemperatureValueView_item
            }
        }
    `
);