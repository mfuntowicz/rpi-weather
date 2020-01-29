import 'bootstrap/dist/css/bootstrap.css';

import * as React from 'react';
import {CardDeck, Container, Row} from "reactstrap";
import {PositionProvider} from "./positions/PositionProvider";
import {GeoLocation} from "./lang/GeoLocation";

export interface WeatherStationProps {
    positionProvider: PositionProvider
}

export interface WeatherStationState {
    position: GeoLocation
}

export class WeatherStation extends React.Component<WeatherStationProps, WeatherStationState>{

    constructor(props: WeatherStationProps) {
        super(props);

        this.state = {
           position: props.positionProvider.getDefault()
        }
    }

    componentDidMount(): void {
        let self = this;
        this.props.positionProvider.getPosition().then(position => {
            self.setState({
                position: position
            });
        });
    }

    render(): any {
        return <div className={"d-flex h-100 flex-column"}>
            <Container fluid={ true } className={"container-fluid d-flex h-85 w-100 flex-column mb-3"}>
                <CardDeck className={"mb-3"}>
                    {this.state.position.city || "undefined"}
                </CardDeck>
                <CardDeck className={"flex-fill"}>
                    <Row className={"mx-0 mb-3 w-100"}>
                    </Row>
                    <Row className={"mx-0 w-100"}>

                    </Row>
                </CardDeck>
            </Container>
        </div>
    }
}