import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from "reactstrap";
import Geolocation from '../components/geolocation'


class App extends React.Component{
   render(){
        return (
            <Container fluid={true}>
                <Geolocation />
            </Container>
        )
    }
}


ReactDOM.render(<App />, document.querySelector('#app'));