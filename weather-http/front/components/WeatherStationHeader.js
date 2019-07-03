import React from 'react';
import PropTypes from 'prop-types';
import {Navbar, NavbarBrand} from "reactstrap";
import Position from "../lang/Position";

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'


class WeatherStationHeader extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        console.log(this.props.position);

        return (
            <Navbar color="light" className={"shadow rounded m-4"} dark expand="md">
                <NavbarBrand className={"text-dark mx-auto"} href="/">
                    <FontAwesomeIcon icon={faMapMarkerAlt } className={"mr-3"} size="lg" />
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