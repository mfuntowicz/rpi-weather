import React from "react";
import PropTypes from "prop-types"
import { Card, CardBody } from "reactstrap";

class WeatherCard extends React.Component {
    render(){
        return (
            <Card className={ this.props.cardClass || '' }>
                <CardBody>
                    {this.props.children}
                </CardBody>
            </Card>
        );
    }
}

const ProgressCircle = () => {
  return (
      <div className="circle">
          <div className="loader">
              <div className="loader">
                  <div className="loader">
                      <div className="loader"/>
                  </div>
              </div>
          </div>
      </div>
  )
};


WeatherCard.propTypes = {
    cardClass: PropTypes.string,
};


export { WeatherCard, ProgressCircle }