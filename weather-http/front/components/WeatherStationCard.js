import React from 'react';
import { Card } from "reactstrap";


class WeatherStationCard extends React.Component {
    render(){
        return (
            <Card className={ "bg-light text-black text-center shadow" }>
                { this.props.children }
            </Card>
        )
    }
}

export default WeatherStationCard;