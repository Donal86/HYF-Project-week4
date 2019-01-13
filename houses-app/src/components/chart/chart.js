import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import { inject, observer } from 'mobx-react'

@inject('HouseStore')
@observer
class Chart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chartKind: 'm2'
        }
    }
    dataChart() {
        const { city, days, avgM2, avgHouse } = this.props.HouseStore.avarages
        return {
            labels: days,
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#fff',
                    borderColor: this.state.chartKind === 'm2' ? '#f00' : '#d0d',
                    border: 2,
                    data: this.state.chartKind === 'm2' ? avgM2 : avgHouse,
                    fill: false
                }
            ]
        }
    }

    async componentDidMount() {
        await this.props.HouseStore.allCities()
        await this.props.HouseStore.getStatusAvarage(
            this.props.HouseStore.cityIndexZero
        )
    }

    render() {
        return <Line data={this.dataChart()} />
    }
}

export default Chart