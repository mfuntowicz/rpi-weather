import * as React from 'react';
import Moment from "react-moment";
import * as moment from 'moment';
import {List, Map as ImmutableMap} from "immutable";
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
    readouts: ImmutableMap<ReadoutKind, List<ReadoutProps>>,
    readoutsFetcher: IWeatherStationReadoutService
}

export class WeatherStation extends React.Component<WeatherStationProps, WeatherStationState>{
    private ws: WebSocket;

    constructor(props: WeatherStationProps) {
        super(props);

        // let _readouts_init = [ReadoutKind.PRESSURE, ReadoutKind.TEMPERATURE, ReadoutKind.HUMIDITY]
        //     .map<[ReadoutKind, ReadoutProps[]]>(kind => [kind, []]);

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

        // Fetch last 24h readouts
        this.fetchReadouts(startDate, endDate).then(readouts => {
            // Update state
            this.setState({
                ...this.state,
                readouts: readouts
            });
        }).then(() => {
            this.ws = new WebSocket(`ws://${window.location.host}/ws/readouts`);
            this.ws.onopen = this.onWebSocketOpened.bind(this);
            this.ws.onmessage = this.onWebSocketMessage.bind(this);
            this.ws.onclose = this.onWebSocketClosed.bind(this);
        });
    }

    async fetchReadouts(startDate: moment.Moment, endDate: moment.Moment): Promise<ImmutableMap<ReadoutKind, List<ReadoutProps>>>{
        // Update current readouts
        let readouts = ImmutableMap<ReadoutKind, List<ReadoutProps>>();
        await this.state.readoutsFetcher.getAllReadouts(startDate, endDate)
            .then(_readouts => {
                _readouts.forEach(_readout => {
                    readouts = readouts.update(_readout.kind, (l = List()) => l.push(_readout))
                });
            });
        return readouts;
    }

    /// WebSocket events
    onWebSocketOpened(_: Event){
        console.log('WebSocket Opened')
    }

    onWebSocketClosed(e: CloseEvent){
        console.log(`WebSocket Closed: ${e}`)
    }

    onWebSocketMessage(e: MessageEvent){
        let data = JSON.parse(e.data);
        let readout: ReadoutProps = {
            kind: data.kind,
            createdAt: moment.utc(data.created_at),
            value: data.readout
        };

        // this.state.readouts.get(readout.kind).push(readout);
        this.setState(prevState => ({
                readouts: prevState.readouts.update(readout.kind, (entry = List()) => entry.push(readout))
            })
        );
    }

    /// Rendering
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
                        <WeatherReadoutCard readout={ this.state.readouts } kind={ReadoutKind.TEMPERATURE} defaultValue={"--"} unit={"°C"} />
                        <WeatherReadoutCard readout={ this.state.readouts } kind={ReadoutKind.PRESSURE} defaultValue={"--"} unit={"hPa"} />
                    </CardDeck>
                </Row>
                <Row className="m-3 d-flex justify-content-start flex-grow-1">
                    <Col xs={6} className="px-1">
                        <WeatherReadoutChartCard name={ReadoutKind.TEMPERATURE} readouts={this.state.readouts.get(ReadoutKind.TEMPERATURE)} />
                    </Col>
                    <Col xs={6} className="px-1">
                        <WeatherReadoutChartCard name={ReadoutKind.PRESSURE} readouts={this.state.readouts.get(ReadoutKind.PRESSURE)} />
                    </Col>
                </Row>
                <Row className="m-3 d-flex justify-content-start flex-grow-1">
                    <Col xs={6} className="px-1">
                        <WeatherReadoutChartCard name={ReadoutKind.TEMPERATURE} readouts={this.state.readouts.get(ReadoutKind.TEMPERATURE)} />
                    </Col>
                    <Col xs={6} className="px-1">
                        <WeatherReadoutChartCard  name={ReadoutKind.PRESSURE} readouts={this.state.readouts.get(ReadoutKind.PRESSURE)} />
                    </Col>
                </Row>
            </Container>
        </div>
    }
}