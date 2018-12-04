import React from 'react'
import { QueryRenderer, graphql } from 'react-relay'

import {ProgressCircle, WeatherCard} from "./common";
import {environment} from "../queries";
import LatestTemperatureValueView from "./LatestTemperatureValueView";


class LatestTemperatureCard extends React.Component{

    render(){
        return (
            <WeatherCard cardClass={"header-card"}>
                <QueryRenderer
                    environment={ environment }
                    query={graphql`
                        query LatestTemperatureCardQuery($kind: String!){
                            data: latestReadoutsOf(kind: $kind){
                               ...LatestTemperatureValueView_item
                            }
                        }
                    `}
                    variables={{kind: "TEMPERATURE"}}
                    render={({error, props}) => {
                        if (error) {
                            return <div>{error.message}</div>;
                        } else if (props) {
                            return <LatestTemperatureValueView item={props.data} />;
                        }
                        return <ProgressCircle />
                    }}
                />
            </WeatherCard>
        );
    }
}

export { LatestTemperatureCard }