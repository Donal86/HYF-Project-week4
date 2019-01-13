const fs = require('fs')
const db = require('./db-config')
const uuidv4 = require('uuid/v4')
const houses = require('./data/data-day10.json')

fs.writeFile('./houses-data.json', JSON.stringify(houses), error => {
    if (error) console.log(error)
    else console.log('Success')
})

let storeHousesQuery =
    'REPLACE INTO property (link, market_date, location_country, location_city, location_address, location_coordinates_lat,'
storeHousesQuery +=
    ' location_coordinates_lng, size_parcelm2, size_grossm2, size_netm2, size_rooms, price_value, price_currency, description,'
storeHousesQuery += 'title, images, sold) VALUES ?'
let qurArr = []
const myHouses = houses.filter(house => house.size.rooms !== null)
myHouses.forEach((house, i) => {
    const {
        link,
        market_date,
        location,
        size,
        price,
        description,
        title,
        images,
        sold
    } = house
    const priceValue = isNaN(price.value) ? 0 : price.value;

    const myImg = images.join();
    const myDate = new Date(market_date);

    qurArr[i] = [
        link,
        myDate,
        location.country,
        location.city,
        location.address || null,
        location.coordinates.lat || null,
        location.coordinates.lng || null,
        size.parcel_m2 || null,
        size.gross_m2 || null,
        size.net_m2 || null,
        size.rooms,
        priceValue,
        price.currency,
        description,
        title,
        myImg,
        sold
    ]
})

const citiesArr = myHouses.map(el => el.location.city)
const cities = citiesArr.filter(function (item, pos) {
    return citiesArr.indexOf(item) == pos
})

function getOneCityStatus(city) {
    let status = {
        id: '',
        city: '',
        marketDate: '',
        totalPrice: 0,
        totalCount: 0,
        totalM2: 0
    }
    cities.forEach(place => {
        if (city) {
            if (city === place) {
                status.id = uuidv4()
                status.city = city
                status.marketDate = new Date("2018-12-27")
                let price = 0
                let area = 0
                myHouses.forEach(house => {
                    if (house.location.city === city) {
                        status.totalCount += 1
                        price += house.price.value
                        price = price
                        price = Number(price)
                        status.totalPrice = price
                        area += house.size.net_m2
                        area = area
                        area = Number(area)
                        status.totalM2 = area
                    }
                })
            }
        }
    })
    return status
}

function getAllCitiesStatus() {
    let citiesStatus = []
    cities.forEach(place => {
        citiesStatus.push(getOneCityStatus(place))
    })
    return citiesStatus
}

const citiesStatus = getAllCitiesStatus()

db.query(storeHousesQuery, [qurArr], (err, results, fields) => {
    if (err) console.log('error with inserting data!', err)
    else console.log('Data inserted!')
})

let qurArray = []
const insert = 'INSERT INTO city_status VALUES ?'

citiesStatus.forEach((place, i) => {
    const { id, city, marketDate, totalPrice, totalCount, totalM2 } = place

    qurArray[i] = [id, city, marketDate, totalPrice, totalCount, totalM2]
})

db.query(insert, [qurArray], (err, results, fields) => {
    if (err) console.log('error with inserting data!', err)
    else console.log('Data inserted!')
})