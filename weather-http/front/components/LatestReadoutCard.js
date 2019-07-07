import React from 'react'
import PropTypes from 'prop-types';
// import { QueryRenderer, graphql } from 'react-relay'
import { Card, CardBody, CardText, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { environment } from "../queries";
import LatestReadoutValueView from "./LatestReadoutValueView";
import WeatherStationCard from "./WeatherStationCard";


class LatestReadoutCard extends React.Component{

    render(){
        // return (
        //     <QueryRenderer
        //         environment={ environment }
        //         query={graphql`
        //             query LatestReadoutCardQuery($kind: String!){
        //                 data: latestReadoutsOf(kind: $kind){
        //                    ...LatestReadoutValueView_item
        //                 }
        //             }
        //         `}
        //         variables={{kind: this.props.kind }}
        //         render={({error, props}) => {
        //             if (error) {
        //                 return this._renderError(error);
        //             } else if (props) {
        //                 return this._renderDone(props);
        //             }else {
        //                 return this._renderProgress();
        //             }
        //         }}
        //     />
        // );
        return this._renderProgress();
    }

    _renderError(error){
        console.log('Error: ' + error + ' while fetching data: ' + this.props.kind);
        return(
            <Card>
                <CardBody className={ "text-center" }>
                    <FontAwesomeIcon icon={"exclamation"} size={"3x"} color={"red"}/>
                </CardBody>
            </Card>
        )
    }

    _renderProgress(){
        return(
            <WeatherStationCard>
                <CardBody>
                    <CardText className={"text-center justify-content-center"}>
                        <Spinner type="grow" color="primary" style={{ width: '3rem', height: '3rem' }}>
                            <span>Loading...</span>
                        </Spinner>
                    </CardText>
                </CardBody>
            </WeatherStationCard>
        )
    }

    _renderDone(props){
        return (
            <LatestReadoutValueView
                className={ "header-card" }
                latestUpdate={ this.props.latestUpdate }
                icon={ this.props.icon }
                kind={ this.props.kind }
                unit={ this.props.unit }
                item={ props.data }
            />
        )
    }
}


LatestReadoutCard.propTypes = {
    latestUpdated: PropTypes.number,
    icon: PropTypes.object,
    kind: PropTypes.string,
    unit: PropTypes.string,
};

export { LatestReadoutCard }