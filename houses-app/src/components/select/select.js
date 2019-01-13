import React, { Component } from 'react'
import './select.css'
import { inject, observer } from 'mobx-react'

@inject('HouseStore')
@observer
class Select extends Component {
    constructor(props) {
        super(props)
        this.state = { selectCity: 'default' }
    }

    selectOptions = () => {
        const { cities } = this.props.HouseStore
        return cities.map((el, i) => (
            <option key={'option' + i} value={el.location_city}>
                {el.location_city + '(' + el.items + ')'}
            </option>
        ))
    }

    handleChange = e => {
        const { HouseStore } = this.props
        this.setState({
            [e.target.name]: e.target.value
        })
        e.target.value === 'default'
            ? this.props.HouseStore.getData()
            : HouseStore.getDataOfOneCity(e.target.value)
    }

    render() {
        const { HouseStore } = this.props
        return (
            <select
                className='select'
                name={this.props.selectCity}
                value={this.state.city}
                onChange={this.handleChange}
            >
                <option value='default'>
                    All cities ({HouseStore.getAllHousesNr})
        </option>
                {this.selectOptions()}
            </select>
        )
    }
}

export default Select