import React, { Component } from 'react'
import './house.css'
import Select from '../select/select'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

@inject('HouseStore')
@observer
class House extends Component {
    constructor(props) {
        super(props)
        this.props.HouseStore.getData()
        this.props.HouseStore.allCities()
        super()
        this.state = {}
    }

    render() {
        const { HouseStore } = this.props
        return (
            <div className='top'>
                <Link to='/chart' className='chart'>
                    City Chart
        </Link>
                <table className='container'>
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>
                                <Select name='selectCity' />
                            </th>
                            <th>Net Size</th>
                            <th>Price</th>
                            <th>Currency</th>
                            <th>Price per m2</th>
                            <th>Rooms</th>
                        </tr>
                    </thead>
                    {HouseStore.houses.map((house, i) => (
                        <tbody className='tbl-content'>
                            <tr key={i}>
                                <td>{house.location_country}</td>
                                <td>{house.location_city}</td>
                                <td>{house.size_netm2}</td>
                                <td>{house.price_value}</td>
                                <td>{house.price_currency}</td>
                                <td>{house.price_value / house.size_netm2}</td>
                                <td>{house.size_rooms}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        )
    }
}
export default House