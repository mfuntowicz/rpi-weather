import React from 'react';
import {Card, CardBody, CardFooter} from "reactstrap";


class WeatherCard extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Card className={ this.props.style  + " text-white"}>
                <CardBody>
                    {this.props.children}
                </CardBody>
                {this.props.outer}
            </Card>
        )
    }
}

class HeaderWeatherCard extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <WeatherCard style={ 'bg-secondary' } classname={ 'text-center shadow-sm' } >
                <div className={ 'd-flex flex-row' }>
                    { this.props.icon }
                    <div className={ 'd-flex flex-column flex-grow-1' }>
                        { this.props.children }
                    </div>
                </div>
            </WeatherCard>

        )
    }
}


class WeatherCardWithFooter extends React.Component{
    constructor(props){
        super(props);

        this.state = {footer: ''};
    }

    render(){
        return (
            <WeatherCard>
                outer={
                    <CardFooter className={'text-center text-white'}>{this.state.footer}</CardFooter>
                }
            </WeatherCard>
        )
    }
}

export { WeatherCard, WeatherCardWithFooter, HeaderWeatherCard }