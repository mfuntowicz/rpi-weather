import * as React from 'react';
import Moment from "react-moment";
import { now } from 'moment';
import {CardDeck, CardText, Container, Row} from "reactstrap";
import {PositionProvider} from "./services/positions/PositionProvider";
import {GeoLocation} from "./lang/GeoLocation";
import {WeatherCard} from "./components/cards/WeatherCard";

export interface WeatherStationProps {
    positionProvider: PositionProvider
}

export interface WeatherStationState {
    time: number,
    position: GeoLocation
}

export class WeatherStation extends React.Component<WeatherStationProps, WeatherStationState>{

    constructor(props: WeatherStationProps) {
        super(props);

        this.state = {
            time: now(),
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
                <Row>
                    <CardDeck className={"mx-1 flex-fill"}>
                        <WeatherCard>
                            <CardText className={"text-center"}>
                                <Moment className={"text-headline"} locale={ navigator.languages ? navigator.languages[0] : navigator.language } interval={1} format={"LT"}/>
                                <br/>
                                <Moment className={"text-headline-subtitle"} locale={ navigator.languages ? navigator.languages[0] : navigator.language } interval={1} format={"ddd LL"}/>
                            </CardText>
                        </WeatherCard>
                        <WeatherCard>
                            <CardText>
                                <Moment locale={ navigator.languages ? navigator.languages[0] : navigator.language } interval={1} format={"LL"}/>
                                <br />
                                <Moment locale={ navigator.languages ? navigator.languages[0] : navigator.language } interval={1} format={"LT"}/>
                            </CardText>
                        </WeatherCard>
                        <WeatherCard>
                            <CardText>
                                <Moment locale={ navigator.languages ? navigator.languages[0] : navigator.language } interval={1} format={"LL"}/>
                                <br />
                                <Moment locale={ navigator.languages ? navigator.languages[0] : navigator.language } interval={1} format={"LT"}/>
                            </CardText>
                        </WeatherCard>
                    </CardDeck>
                </Row>
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