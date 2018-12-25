import React from "react"
import { graphql, QueryRenderer } from "react-relay";
import { Card, CardHeader, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { environment } from "../queries";
import { getTextColorWrtTime } from "../utils";
import { ProgressCircle } from "./common";
import ChartReadoutCardView from "./ChartReadoutCardView";

class ChartReadoutCard extends React.Component {
    render(){
        return (
            <QueryRenderer
                environment={ environment }
                query={graphql`
                    query ChartReadoutCardQuery($kind: String!, $from: DateTime!, $to: DateTime!){
                        data: allReadoutsOfBetween(kind: $kind, start: $from, end: $to){
                           ...ChartReadoutCardView_items
                        }
                    }
                `}
                variables={{ kind: this.props.kind, from: this.props.from, to: this.props.to }}
                render={({error, props}) => {
                    if(error)
                        return this._renderError(error);
                    else if(props)
                        return this._renderDone(props);
                    else
                        return this._renderProgress()
                }}
            />
        );
    }

    _renderDone(props){
        return (
            <Card className={"bg-dark"}>
                <CardBody className={"chart-card"}>
                    <ChartReadoutCardView
                        kind={ "line" }
                        metric={ "Température" }
                        unit={ "°C" }
                        items={ props.data }
                        chartColor={ this.props.chartColor }
                        minHeight={ 220 }
                    />
                </CardBody>
            </Card>
        );
    }

    _renderError(error){
        return(
            <Card className={ "header-card shadow" }>
                <CardHeader className={getTextColorWrtTime(true) + " font-weight-light text-center card-header-small-padding"}>
                    { error.message }
                </CardHeader>
                <CardBody className={"text-center"}>
                    <FontAwesomeIcon icon={"exclamation"} size={"3x"} color={"red"}/>
                </CardBody>
            </Card>
        )
    }

    _renderProgress(){
        return <ProgressCircle />
    }
}

export { ChartReadoutCard }
