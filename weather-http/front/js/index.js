import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Row} from "reactstrap";

class App extends React.Component{
   render(){
        return <Container><h1>Hello World</h1></Container>
    }
}


ReactDOM.render(<App />, document.querySelector('#app'));