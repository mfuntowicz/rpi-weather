import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {CardText, CardBody, Row} from "reactstrap";
import WeatherStationCard from "./WeatherStationCard";


class WeatherStationDateTimeCard extends React.Component {
    render() {
        return (
            <WeatherStationCard>
                <CardBody>
                    <CardText>
                        <Row>
                            <h3 className="container-fluid text-center font-weight-bold">
                                <Moment interval={1000} locale={ this.props.locale } format={"LTS"}/>
                            </h3>
                        </Row>
                        <Row>
                            <h5 className="container-fluid text-center font-weight-light">
                                <Moment interval={1000} locale={ this.props.locale } format={"LL"}/>
                            </h5>
                        </Row>
                    </CardText>
                </CardBody>
            </WeatherStationCard>
        );
    }
}


WeatherStationDateTimeCard.propTypes = {
    locale: PropTypes.string,
};

export default WeatherStationDateTimeCard;
