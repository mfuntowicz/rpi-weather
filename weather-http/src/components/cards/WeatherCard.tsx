import * as React from "react";
import {Card, CardBody} from "reactstrap";


export class WeatherCard extends React.Component<{}, {}>{
    render(){
        return <Card inverse className="weather-card">
            <CardBody>
                { this.props.children }
            </CardBody>
        </Card>
    }
}