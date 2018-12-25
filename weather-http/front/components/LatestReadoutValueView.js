import React from 'react'
import Moment from "react-moment";
import { createRefetchContainer, graphql } from 'react-relay'
import { Card, CardBody, CardHeader, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class LatestReadoutValueView extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        /***
         * When we receive a props update, we check that this correspond to the "latestUpdate" props and thus
         * we refetch from the server fresh data to render
         */
        if (prevProps.latestUpdate !== this.props.latestUpdate) {
            this.props.relay.refetch(
                {kind: this.props.kind},
                null,
                null,
                {force: true}
            )
        }
    }

    render(){
        const readout = this.props.item.edges[0].node;

        return (
            <Card className={ this.props.className + " shadow" }>
                <CardHeader className={"font-weight-light text-center card-header-small-padding"}>
                    <span>
                        Last updated: <Moment fromNow>{ this.props.latestUpdate }</Moment>
                    </span>
                </CardHeader>
                <CardBody className={"d-flex align-items-center justify-content-center"}>
                    <Row className={"d-flex align-items-center"}>
                        <FontAwesomeIcon className={"float-left"} icon={ this.props.icon } size={"3x"} />
                        <h2 className={"mb-0 pl-2"}>{ readout.value }<span className={"ml-2 font-weight-bold"}>{ this.props.unit }</span></h2>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}




export default createRefetchContainer(
    LatestReadoutValueView,
    graphql`
        fragment LatestReadoutValueView_item on SensorReadoutConnection
        {
            edges {
                node {
                    createdAt,
                    value
                }
            }
        }
    `, graphql`
        query LatestReadoutValueViewRefetchQuery($kind: String) {
            item: latestReadoutsOf(kind: $kind){
                ...LatestReadoutValueView_item
            }
        }
    `
);