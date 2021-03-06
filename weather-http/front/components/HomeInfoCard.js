import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "react-moment";


class HomeInfoCard extends React.Component {
    render(){
        return (
            <Card className={ "header-card bg-dark text-white shadow" }>
                <CardBody>
                    <Row className="m-1">
                        <DateTimeRow locale={ this.props.locale }/>
                    </Row>
                    <Row className="m-1">
                        <PositionRow
                            city={ this.props.city }
                            region={ this.props.region }
                            zipcode= {this.props.zipcode }
                            country={ this.props.country }
                        />
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

class PositionRow extends React.Component{
    render(){
        return (
            <div className="container-fluid text-center font-weight-light" >
                <span className="mr-2">
                    <FontAwesomeIcon icon="map-marker-alt" size={"1x"} />
                </span>
                <span>
                    { this.props.city } ({this.props.zipcode}, { this.props.country })
                </span>
            </div>
        )
    }
}

class DateTimeRow extends React.Component {
    render(){
        return (
            <div className="container-fluid">
                <Row>
                    <h5 className="container-fluid text-center font-weight-light">
                        <Moment interval={1000} locale={ this.props.locale } format={"LL"}/>
                    </h5>
                </Row>
                <Row>
                    <h3 className="container-fluid text-center font-weight-bold">
                        <Moment interval={1000} locale={ this.props.locale } format={"LTS"}/>
                    </h3>
                </Row>
            </div>
        )
    }
}

// Define props types
HomeInfoCard.propTypes = {
    locale:  PropTypes.string,
    city:    PropTypes.string,
    region:  PropTypes.string,
    zipcode: PropTypes.string,
    country: PropTypes.string
};

PositionRow.propTypes = {
    city:    PropTypes.string,
    country: PropTypes.string,
    region:  PropTypes.string,
    zipcode: PropTypes.string
};

DateTimeRow.propTypes = {
    locale:  PropTypes.string
};

export { HomeInfoCard }