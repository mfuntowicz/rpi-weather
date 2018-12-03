import React from 'react'
import PropTypes from 'prop-types'
import { WeatherCard } from "./common";
import { Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "react-moment";


class HomeInfoCard extends React.Component {
    render(){
        return (
            <WeatherCard cardClass={ "bg-primary text-white" }>
                <Row className={"m-1"}>
                    <div className={"col-4"}>
                        <DateTimeRow locale={ this.props.locale }/>
                    </div>
                    <div className={"col-8"}>
                        <PositionRow
                            city={ this.props.city }
                            region={ this.props.region }
                            zipcode= {this.props.zipcode }
                            country={ this.props.country }
                        />
                    </div>
                </Row>
            </WeatherCard>
        )
    }
}

class PositionRow extends React.Component{
    render(){
        return (
            <Row>
                <div className="col-2">
                    <FontAwesomeIcon icon="map-marker-alt" size={"3x"} />
                </div>
                <div className="col-9">
                    <Row>
                        <h5>{ this.props.city } ({ this.props.zipcode })</h5>
                    </Row>
                    <Row>
                        { this.props.country }
                    </Row>
                </div>
            </Row>
        )
    }
}

class DateTimeRow extends React.Component {
    render(){
        return (
            <div>
                <Row>
                    <h5>
                        <Moment interval={1000} locale={ this.props.locale } format={"LTS"}/>
                    </h5>
                </Row>
                <Row>
                    <Moment interval={1000} locale={ this.props.locale } format={"LL"}/>
                </Row>
            </div>
        )
    }
}


HomeInfoCard.propTypes = {
    locale: PropTypes.string,
    city:   PropTypes.string,
    region: PropTypes.string,
    zipcode: PropTypes.string,
    country: PropTypes.string
};

PositionRow.propTypes = {
    city: PropTypes.string,
    country: PropTypes.string,
    region: PropTypes.string,
    zipcode: PropTypes.string
};

DateTimeRow.propTypes = {
    locale: PropTypes.string
};

export { HomeInfoCard }