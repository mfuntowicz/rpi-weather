import React from 'react'
import Enum from 'es6-enum'
import { Card, CardBody, CardFooter } from 'reactstrap'
import { ReactBingmaps } from 'react-bingmaps'

const BINGS_MAPS_API_URL ='https://dev.virtualearth.net/REST/v1/Locations/';
const BINGS_MAPS_API_KEY = 'Apnzh0uNWaiw_buhdeL9rV0cPWGYxx1QP78OuQOC3N8viktenmLih5FUc1Silvky';


// Enumerate possible state to get localisation
const GeolocationState = Enum("FETCHING", "DONE", "ERROR", "NOT_SUPPORTED");


function DetailsFooter(props){
    let text;

    switch(props.phase){
        case GeolocationState.DONE:
            text = props.position.city + ', (' + props.position.country + ')';
            break;

        case GeolocationState.FETCHING:
            text = 'Fetching position...';
            break;

        case GeolocationState.NOT_SUPPORTED:
            text = 'Browser doesn\' support geolocation';
            break;

        default:
            text = 'Unable to get position';
            break;
    }

    return <CardFooter className={"text-center text-white"}>{ text }</CardFooter>
}

export default class Geolocation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {phase: GeolocationState.FETCHING, position: {}};
    }

    render(){
        return (
            <Card className={"bg-dark mb-3"}>
                <CardBody>
                    <ReactBingmaps
                        bingmapKey={BINGS_MAPS_API_KEY}
                        mapTypeId={'canvasLight'}
                        navigationBarMode={'compact'}
                        center={[this.state.position.latitude, this.state.position.longitude]}
                        pushPins={
                            [{
                                'location': [this.state.latitude, this.state.longitude],
                                "option":{ color: 'red' }
                            }]
                        }
                    />
                </CardBody>
                <DetailsFooter {...this.state} />
            </Card>
        )
    }

    componentWillMount(){
        let component = this;

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position) {
                let url = BINGS_MAPS_API_URL + position.coords.latitude + ',' + position.coords.longitude +
                       '?o=json&key=' + BINGS_MAPS_API_KEY;

                $.getJSON(url).done((data) => {
                    let address = data.resourceSets[0].resources[0].address;

                    component.setState({
                        phase: GeolocationState.DONE,
                        position: {
                            city: address.locality,
                            zipcode: address.postalCode,
                            country: address.countryRegion,
                            adminDistrict: address.adminDistrict,
                            adminDistrict2: address.adminDistrict2,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }
                    })
                }).fail(() => {
                    component.setState({
                        phase: GeolocationState.ERROR,
                        position: {
                            latitude: 0.,
                            longitude: 0.
                        }
                    })
                });
            })
        }else{
            this.setState({
                phase: GeolocationState.NOT_SUPPORTED,
                position: {
                    latitude: 0.,
                    longitude: 0.
                }
            })
        }
    }
}