import 'bootstrap/dist/css/bootstrap.css';

import * as React from 'react';
import {CardDeck, Container, Row} from "reactstrap";

export class WeatherStation extends React.Component{
    render(): any {
        return <div className={"d-flex h-100 flex-column"}>
            <Container fluid={ true } className={"container-fluid d-flex h-85 w-100 flex-column mb-3"}>
                <CardDeck className={"mb-3"}>

                </CardDeck>
                <CardDeck className={"flex-fill"}>
                    <Row className={"mx-0 mb-3 w-100"}>
                    </Row>
                    <Row className={"mx-0 w-100"}>

                    </Row>
                </CardDeck>
            </Container>
        </div>
    }
}