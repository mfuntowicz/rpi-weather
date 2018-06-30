import React from 'react';
import moment from 'moment/src/moment'
import MaterialIcon, { colorPalette } from 'material-icons-react';
import { HeaderWeatherCard } from "./common";
import { MuiThemeProvider } from 'material-ui';

class TimeCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date : moment().format('ddd LL'),
            time: moment().format('LTS')
        };
    }

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
        let now = moment();
        this.setState({
            date : now.format('dddd LL'),
            time: now.format('LTS')
        });
    }

    render() {
        return (
            <HeaderWeatherCard style={ 'bg-secondary' } classname={ 'text-center shadow-sm' }
                icon = {
                    <MuiThemeProvider>
                        <MaterialIcon icon="schedule" size='60'/>
                    </MuiThemeProvider>
                }>
                <p className="card-text text-capitalize text-center mb-0">{ this.state.date }</p>
                <h4 className="card-text text-center text-warning mb-0">{ this.state.time }</h4>
            </HeaderWeatherCard>
        );
    }
}

export { TimeCard }