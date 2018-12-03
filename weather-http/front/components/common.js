import {Card, CardTitle} from "reactstrap";
import React from "react";
import PropTypes from "prop-types"

class WeatherCard extends React.Component {
    render(){
        return (
            <Card body className={ this.props.cardClass || '' }>
                {this.props.children}
            </Card>
        );
    }
}


WeatherCard.propTypes = {
    cardClass: PropTypes.string,
};


export { WeatherCard }