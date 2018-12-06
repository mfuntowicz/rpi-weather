import React from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import { Card, CardBody, CardHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { environment } from "../queries";
import { getTextColorWrtTime } from "../utils";
import { ProgressCircle } from "./common";
import LatestReadoutValueView from "./LatestReadoutValueView";


class LatestReadoutCard extends React.Component{

    render(){
        return (
            <QueryRenderer
                environment={ environment }
                query={graphql`
                    query LatestReadoutCardQuery($kind: String!){
                        data: latestReadoutsOf(kind: $kind){
                           ...LatestReadoutValueView_item
                        }
                    }
                `}
                variables={{kind: this.props.kind }}
                render={({error, props}) => {
                    if (error) {
                        return this._renderError(error);
                    } else if (props) {
                        return this._renderDone(props);
                    }else {
                        return this._renderProgress();
                    }
                }}
            />
        );
    }

    _renderError(error){
        return(
            <Card className={ "header-card" }>
                <CardHeader className={getTextColorWrtTime(true) + " font-weight-light text-center card-header-small-padding"}>
                    { error.message }
                </CardHeader>
                <CardBody className={ "text-center" }>
                    <FontAwesomeIcon icon={"exclamation"} size={"3x"} color={"red"}/>
                </CardBody>
            </Card>
        )
    }

    _renderProgress(){
        return(
            <Card className={ "header-card "}>
                <CardHeader className={getTextColorWrtTime() + " font-weight-light text-center card-header-small-padding"}>
                    Updating...
                </CardHeader>
                <CardBody className={ "text-center" }>
                    <ProgressCircle />
                </CardBody>
            </Card>
        )
    }

    _renderDone(props){
        return (
            <LatestReadoutValueView
                className={getTextColorWrtTime() + " header-card"}
                latestUpdate={ this.props.latestUpdate }
                icon={ this.props.icon }
                kind={ this.props.kind }
                unit={ this.props.unit }
                item={ props.data }
            />
        )
    }
}

export { LatestReadoutCard }