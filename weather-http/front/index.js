import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {CardDeck, Container} from "reactstrap";

// AMSChart import
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {TimeCard} from "./components/time";
am4core.useTheme(am4themes_animated);

// Moment configuration
import moment from 'moment/src/moment'
moment.locale(navigator.language);

// App
class WeatherStation extends React.Component{
   render(){
        return (
            <Container className={"p-5 mx-2"} fluid={true}>
                <CardDeck>
                    <TimeCard />
                    <TimeCard />
                    <TimeCard />
                    <TimeCard />
                </CardDeck>
            </Container>
        )
    }
}

// Render app
ReactDOM.render(
    <WeatherStation />,
    document.querySelector('#app')
);