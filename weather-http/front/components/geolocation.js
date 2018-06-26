import React from 'react'
import { Card, CardBody, CardFooter } from 'reactstrap'
import { ReactBingmaps } from 'react-bingmaps'

const BINGS_MAPS_API_URL ='https://dev.virtualearth.net/REST/v1/Locations/';
const BINGS_MAPS_API_KEY = 'Apnzh0uNWaiw_buhdeL9rV0cPWGYxx1QP78OuQOC3N8viktenmLih5FUc1Silvky';

function DetailsFooter(props){
    let text;
    if ('country' in props)
        text = props.city + ' (' + props.country + ')';
    else if ('error' in props)
        text = props.errors;
    else if ('city' in props && props.city === 'Fetching')
        text = 'Fetching position...';
    else
        text = 'Unable to retrieve your position.';

    return <CardFooter className={"text-center"}>{ text }</CardFooter>
}


export default class Geolocation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {city:'Fetching', latitude: 0., longitude: 0.};
    }

    render(){
        return (
            <Card style={{height: '400px'}}>
                <CardBody>
                    <ReactBingmaps
                        bingmapKey={BINGS_MAPS_API_KEY}
                        mapTypeId={'canvasLight'}
                        navigationBarMode={'compact'}
                        center={[this.state.latitude, this.state.longitude]}
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

    componentDidMount(){
        let component = this;

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position) {
                let url = BINGS_MAPS_API_URL + position.coords.latitude + ',' + position.coords.longitude +
                       '?o=json&key=' + BINGS_MAPS_API_KEY;

                $.getJSON(url).done((data) => {
                    let address = data.resourceSets[0].resources[0].address;

                    component.setState({
                        city: address.locality,
                        zipcode: address.postalCode,
                        country: address.countryRegion,
                        adminDistrict: address.adminDistrict,
                        adminDistrict2: address.adminDistrict2,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    })
                }).fail(() => {
                    component.setState({
                        error: true,
                        city: 'Unkown',
                        zipcode: 'Unknown',
                        country: 'An error occured',
                        adminDistrict: '',
                        adminDistrict2: '',
                        latitude: 0.,
                        longitude: 0.
                    })
                });
            })
        }else{
            this.setState({
                error: true,
                city: 'Unkown',
                zipcode: 'Unknown',
                country: 'Browser doesn\'t support Geolocation',
                adminDistrict: '',
                adminDistrict2: '',
                latitude: 0.,
                longitude: 0.
            })
        }
    }
}