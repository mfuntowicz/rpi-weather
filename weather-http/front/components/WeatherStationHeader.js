import React from 'react';
import PropTypes from 'prop-types';
import {Navbar, NavbarBrand} from "reactstrap";
import Position from "../lang/Position";

class WeatherStationHeader extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        console.log(this.props.position);

        return (
            <Navbar color="dark" dark expand="md">
                <NavbarBrand className={"text-white mx-auto"} href="/">
                    {this.props.position.city + ', ' + this.props.position.country}
                </NavbarBrand>
            </Navbar>
        )
    }
}

// PropsType
WeatherStationHeader.propsType = {
    position: PropTypes.objectOf(Position)
};

export default WeatherStationHeader;