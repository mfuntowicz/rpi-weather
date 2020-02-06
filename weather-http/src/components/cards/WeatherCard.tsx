import * as React from "react";
import {Card, CardBody} from "reactstrap";


export class WeatherCard extends React.Component<{}, {}>{
    render(){
        return <Card inverse className={"weather-card card-block d-flex"}>
            <CardBody className={"align-items-center d-flex justify-content-center"}>
                { this.props.children }
            </CardBody>
        </Card>
    }
}