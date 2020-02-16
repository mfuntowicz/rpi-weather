import * as React from 'react';
import Moment from "react-moment";
import * as moment from 'moment';
import {Map as ImmutableMap} from "immutable";
import {CardDeck, CardText, Col, Container, Row} from "reactstrap";
import {PositionProvider} from "./services/positions/PositionProvider";
import {GeoLocation} from "./lang/GeoLocation";
import {WeatherCard} from "./components/cards/WeatherCard";
import {ReadoutKind, ReadoutProps} from "./lang/Readout";
import {IWeatherStationReadoutService} from "./services/weather/IWeatherStationReadoutService";
import {WeatherReadoutChartCard} from "./components/cards/WeatherReadoutChartCard";
import {WeatherReadoutCard} from "./components/cards/WeatherReadoutCard";

export interface WeatherStationProps {
    positionProvider: PositionProvider,
    readoutsFetcher: IWeatherStationReadoutService
}

export interface WeatherStationState {
    position: GeoLocation,
    readouts: ImmutableMap<ReadoutKind, ReadoutProps[]>,
    readoutsFetcher: IWeatherStationReadoutService
}

export class WeatherStation extends React.Component<WeatherStationProps, WeatherStationState>{
    private ws: WebSocket;

    constructor(props: WeatherStationProps) {
        super(props);

        this.state = {
            position: props.positionProvider.getDefault(),
            readouts: ImmutableMap(),
            readoutsFetcher: props.readoutsFetcher
        };

        this.ws = null;
    }

    componentDidMount(): void {
        let self = this;
        let endDate = moment();
        let startDate = endDate.clone().subtract(24, 'hours');

        // Update current geolocation
        this.props.positionProvider.getPosition().then(position => {
            self.setState({
                ...this.state,
                position: position
            });
        });

        this.fetchReadouts(startDate, endDate).then(readouts => {
            // Update state
            this.setState({
                ...this.state,
                readouts: readouts
            });
        });

        this.ws = new WebSocket(`ws://${window.location.host}/ws/readouts`);
        this.ws.onopen = e => {console.log(`Open: ${e}`); this.ws.send("Hello world !"); };
        this.ws.onmessage = (e: MessageEvent) => console.log(`Message: ${e.data}`);
        this.ws.onclose = e => console.log(`Close: ${e}`);
    }

    async fetchReadouts(startDate: moment.Moment, endDate: moment.Moment): Promise<ImmutableMap<ReadoutKind, ReadoutProps[]>>{
        // Update current readouts
        let readouts = new Map<ReadoutKind, ReadoutProps[]>();
        await this.state.readoutsFetcher.getAllReadouts(startDate, endDate)
            .then(_readouts => {
                _readouts.forEach(_readout => {
                    if (!readouts.has(_readout.kind)) {
                        readouts.set(_readout.kind, []);
                    }

                    readouts.get(_readout.kind).push(_readout)
                });
            });

        return ImmutableMap(readouts);
    }

    render(): any {
        return <div className={"d-flex h-100 flex-column"}>
            <Container fluid={ true } className={"container-fluid d-flex h-85 w-100 flex-column mb-3"}>
                <Row className={"weather-station-header my-2"}>
                    <CardDeck className={"mx-1 flex-fill"}>
                        <WeatherCard>
                            <CardText className={"text-center"}>
                                <Moment className={"text-headline"} locale={ navigator.languages ? navigator.languages[0] : navigator.language } interval={1} format={"LT"}/>
                                <br/>
                                <Moment className={"text-headline-subtitle"} locale={ navigator.languages ? navigator.languages[0] : navigator.language } interval={1} format={"ddd LL"}/>
                            </CardText>
                        </WeatherCard >
                        <WeatherReadoutCard readout={this.state.readouts.get(ReadoutKind.TEMPERATURE, [undefined])[0]} defaultValue={"--"} unit={"°C"} />
                        <WeatherReadoutCard readout={this.state.readouts.get(ReadoutKind.PRESSURE, [undefined])[0]} defaultValue={"--"} unit={"hPa"} />
                    </CardDeck>
                </Row>
                {/*<Row className={"row-cols-1 row-cols-md-2 d-flex h-85"}>*/}
                {/*    <Col className={"mb-4"}>*/}
                {/*        <Card>*/}
                    <Col cols={6}>
                        <WeatherReadoutChartCard readouts={this.state.readouts.get(ReadoutKind.TEMPERATURE)} />
                    </Col>
                    <Col cols={6}>
                        <WeatherReadoutChartCard readouts={this.state.readouts.get(ReadoutKind.PRESSURE)} />
                    </Col>

                        {/*</Card>*/}
                    {/*</Col>*/}
                    {/*<Col className={"mb-4"}>*/}
                    {/*    <Card>*/}
                    {/*        <WeatherReadoutChartCard readouts={this.state.readouts.get(ReadoutKind.PRESSURE)} />*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                    {/*<Col className={"mb-4"}>*/}
                    {/*    <Card>*/}
                    {/*        <WeatherReadoutChartCard readouts={this.state.readouts.get(ReadoutKind.TEMPERATURE)} />*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                    {/*<Col className={"mb-4"}>*/}
                    {/*    <Card>*/}
                    {/*        <WeatherReadoutChartCard readouts={this.state.readouts.get(ReadoutKind.PRESSURE)} />*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                {/*</Row>*/}
            </Container>
        </div>
    }
}