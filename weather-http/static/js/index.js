import Bootstrap from 'bootstrap/dist/css/bootstrap.css'

import {showPosition} from './geolocation';

$(document).ready(function(){
    if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(showPosition)
});