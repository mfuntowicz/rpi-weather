import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
// import '!style-loader!css-loader!weathericons/css/weather-icons.css';

import moment from 'moment/src/moment';
import React from 'react';
import ReactDOM from 'react-dom';
import { WeatherCard } from "./components/common";
import { Button, Container, Col, Row } from "reactstrap";


// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import {HomeInfoCard} from "./components/HomeInfoCard";

// Adding icons we want to include in the app
library.add(faMapMarkerAlt);


// App
class WeatherStation extends React.Component{

   constructor(props){
       super(props);

       this.state = {
           locale: 'en-us',
           lastUpdate: moment(),
           position: {
               latitude: 'unknown',
               longitude: 'unknown',
               altitude: 'unknown',
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

    componentDidMount(): void {
        this.getBrowserLang();
        this.getPosition();
    }

    render(){
        return (
            <Container className={"p-5"} fluid={true}>
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
                       <WeatherCard title={"Titre 1"}>
                           <Button>OK</Button>
                       </WeatherCard>
                    </Col>
                    <Col className="col-4">
                        <WeatherCard title={"Titre 1"}>
                            <Button>OK</Button>
                        </WeatherCard>
                    </Col>
                </Row>
                <Row className="m-4">
                    <Col lg="6" md="6" sm="6" xl="6" xs="6">
                        <WeatherCard title={"Titre 1"}>
                            <Button>OK</Button>
                        </WeatherCard>
                    </Col>
                    <Col lg="6" md="6" sm="6" xl="6" xs="6">
                        <WeatherCard title={"Titre 1"}>
                            <Button>OK</Button>
                        </WeatherCard>
                    </Col>
                </Row>
                <Row className="m-4">
                    <Col lg="6" md="6" sm="6" xl="6" xs="6">
                        <WeatherCard title={"Titre 1"}>
                            <Button>OK</Button>
                        </WeatherCard>
                    </Col>
                    <Col lg="6" md="6" sm="6" xl="6" xs="6">
                        <WeatherCard title={"Titre 1"}>
                            <Button>OK</Button>
                        </WeatherCard>
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