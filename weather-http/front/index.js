import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import '../static/css/style.css';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';

// Font Awesome - Adding icons we want to include in the app
import {library} from '@fortawesome/fontawesome-svg-core'
import {faExclamation, faMapMarkerAlt, faThermometerThreeQuarters, faWind} from '@fortawesome/free-solid-svg-icons'

// App specific imports
import WeatherStationHeader from "./components/WeatherStationHeader";
import {GeocodeService} from "./services/Geolocalisation";
import Position from "./lang/Position";
// import '!style-loader!css-loader!weathericons/css/weather-icons.css';

library.add(faExclamation);
library.add(faMapMarkerAlt);
library.add(faThermometerThreeQuarters);
library.add(faWind);

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
           position: undefined
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
       let self = this;
        navigator.geolocation.getCurrentPosition(function(location) {
            new GeocodeService().getLocationInformationFromLatitudeLongitude(
                location.coords.latitude,
                location.coords.longitude,
                (geolocation) => {
                    self.setState({
                        ...state,
                        position: Position.from_location({
                            ...location, ...geolocation
                        })
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
            <div>
                <WeatherStationHeader position={ this.state.position } />
            </div>
        )
    }
}

// Render app
ReactDOM.render(
    <WeatherStation />,
    document.querySelector('#app')
);