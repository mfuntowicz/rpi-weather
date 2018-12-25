import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import '../static/css/style.css';
import moment from 'moment/src/moment';
import React from 'react';
import ReactDOM from 'react-dom';
import {Col, Container, Row} from "reactstrap";
// Font Awesome - Adding icons we want to include in the app
import {library} from '@fortawesome/fontawesome-svg-core'
import {faExclamation, faMapMarkerAlt, faThermometerThreeQuarters, faWind} from '@fortawesome/free-solid-svg-icons'
import {HomeInfoCard} from "./components/HomeInfoCard";
// App specific imports
import {LatestReadoutCard} from "./components/LatestReadoutCard";
import {ChartReadoutCard} from "./components/ChartReadoutCard"
// import '!style-loader!css-loader!weathericons/css/weather-icons.css';

library.add(faExclamation);
library.add(faMapMarkerAlt);
library.add(faThermometerThreeQuarters);
library.add(faWind);

// App
class WeatherStation extends React.Component{

   constructor(props){
       super(props);

       const now = moment();

       this.state ={
           locale: 'en-us',
           lastUpdate: moment(),
           to: moment(),
           from: moment().subtract(12, 'hours'),
           refreshInterval: undefined,
           position: {
               latitude: 'unknown',
               longitude: 'unknown',
               altitude: 'unknown',
               city: 'unknown',
               region: 'unknown',
               zipcode: 'unknown',
               country: 'unknown',
               province: 'unknown',
               accuracy: -1,
               success: false
           },
       };
   }

    getBrowserLang() {
        if (navigator.languages !== undefined)
            this.state.locale = navigator.languages[0];
        else
            this.state.locale = navigator.language;

        this.setState(this.state)
    }

    getPosition(){
       const self = this;
        navigator.geolocation.getCurrentPosition(function(location) {
            let state = self.state;
            $.getJSON('https://geocode.xyz/' + location.coords.latitude + ',' + location.coords.longitude + '?geoit=json', {}, (data) => {
                state.position = {
                    success: true,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    altitude: location.coords.altitude || data.elevation,
                    accuracy: location.coords.accuracy,
                    city: data.city,
                    region: data.region,
                    zipcode: data.postal,
                    country: data.country,
                    province: data.prov
                };

                self.setState(state)
            });
        });
    }

    refresh(args){
        const station = args.ref;
        const state = station.state;

        // Update latest refresh
        state.lastUpdate =  moment();
        state.to = moment();
        state.from = moment().subtract(12, 'hours');

        // Dispatch update
        station.setState(state);
    }

    setRefreshInterval(interval){
        if(this.state.refreshInterval !== undefined){
            clearInterval(this.state.refreshInterval);
        }

        const state = this.state;
        state.refreshInterval = setInterval(this.refresh, interval, {ref: this});

        this.setState(state);
    }

    componentDidMount() {
        this.getBrowserLang();
        this.getPosition();
        this.setRefreshInterval(3000);
    }

    render(){
        return (
            <Container className={"p-6"} fluid={true}>
                <Row className="m-4">
                    <Col className="col-4">
                      <HomeInfoCard
                          locale={ this.state.locale }
                          city={ this.state.position.city }
                          zipcode={ this.state.position.zipcode }
                          region={ this.state.position.region }
                          country={ this.state.position.country }
                      />
                    </Col>
                    <Col className="col-4">
                        <LatestReadoutCard latestUpdate={ this.state.lastUpdate } icon={"thermometer-three-quarters"} kind={ "TEMPERATURE" } unit={"°C"}/>
                    </Col>
                    <Col className="col-4">
                        <LatestReadoutCard latestUpdate={ this.state.lastUpdate } icon={"wind"} kind={ "PRESSURE" } unit={"km/h"} />
                    </Col>
                </Row>
                <Row className="m-4">
                    <Col className="col-6">
                        <ChartReadoutCard kind={ "TEMPERATURE" } chartColor={ "#000000" } from={ this.state.from } to={ this.state.to } />
                    </Col>
                    <Col className="col-6">
                        <ChartReadoutCard kind={ "PRESSURE" } chartColor={ "#000000" } from={ this.state.from } to={ this.state.to } />
                    </Col>
                </Row>
                <Row className="m-4">
                    <Col className="col-6">
                        <ChartReadoutCard kind={ "TEMPERATURE" } from={ this.state.from } to={ this.state.to } />
                    </Col>
                    <Col className="col-6">
                        <ChartReadoutCard kind={ "PRESSURE" } from={ this.state.from } to={ this.state.to } />
                    </Col>
                </Row>
            </Container>
        )
    }
}

// Render app
ReactDOM.render(
    <WeatherStation />,
    document.querySelector('#app')
);