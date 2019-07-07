import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import '!style-loader!css-loader!../static/css/style.css';

import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import {CardDeck, Container, Row} from "reactstrap";

// Icons imports
import { faClock } from '@fortawesome/free-solid-svg-icons'

// App specific imports
import WeatherStationHeader from "./components/WeatherStationHeader";
import Position from "./lang/Position";
import WeatherStationDateTimeCard from "./components/WeatherStationDateTimeCard";
import { OpenStreetMapService } from "./services/Geolocalisation";
import { LatestReadoutCard } from "./components/LatestReadoutCard";
import WeatherStationCard from "./components/WeatherStationCard";
import CardBody from "reactstrap/es/CardBody";
import CardText from "reactstrap/es/CardText";

// App
class WeatherStation extends React.Component{

   constructor(props){
       super(props);

       this.state ={
           locale: 'en-us',
           lastUpdate: moment(),
           to: moment(),
           from: moment().subtract(12, 'hours'),
           refreshInterval: undefined,
           position: Position.get_undefined()
       };
   }

    getBrowserLang() {
        if (navigator.languages !== undefined)
            this.setState({...this.state, locale: navigator.languages[0]});
        else
            this.setState({...this.state, locale: navigator.language});
    }

    getPosition(){
       let self = this;
        navigator.geolocation.getCurrentPosition(function(location) {
            let location_service = new OpenStreetMapService();

            location_service.getLocationInformationFromLatitudeLongitude(
                location.coords.latitude,
                location.coords.longitude,
                (position) => {
                    self.setState({
                        ...self.state,
                        position: position
                    });
                }, (error) => {
                    console.log('Geolocation error:', error);
                }
            )
        });
    }

    componentDidMount() {
        this.getBrowserLang();
        this.getPosition();
    }

    render(){
        return (
            <div className={"d-flex h-100 flex-column"}>
                <WeatherStationHeader position={ this.state.position } />
                <div className={"d-flex h-100 w-100 flex-column"}>
                    <CardDeck tag={"p"} className={"m-0"}>
                        <WeatherStationDateTimeCard locale={ this.state.locale } />
                        <LatestReadoutCard icon={faClock} kind={"temperature"} latestUpdated={-1} unit={"time"} />
                        <LatestReadoutCard icon={faClock} kind={"temperature"} latestUpdated={-1} unit={"time"} />
                        <LatestReadoutCard icon={faClock} kind={"temperature"} latestUpdated={-1} unit={"time"} />
                    </CardDeck>
                    <CardDeck className={"flex-fill"}>
                        <WeatherStationCard><CardBody><CardText>SalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalut</CardText></CardBody></WeatherStationCard>
                        <WeatherStationCard><CardBody><CardText>SalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalut</CardText></CardBody></WeatherStationCard>
                        <WeatherStationCard><CardBody><CardText>SalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalut</CardText></CardBody></WeatherStationCard>
                        <WeatherStationCard><CardBody><CardText>SalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalutSalut</CardText></CardBody></WeatherStationCard>
                    </CardDeck>
                </div>
            </div>
        )
    }
}

// Render app
ReactDOM.render(
    <WeatherStation />,
    document.querySelector('#app')
);