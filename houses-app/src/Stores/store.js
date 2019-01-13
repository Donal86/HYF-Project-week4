import { observable, computed, action, runInAction, configure } from 'mobx'
import moment from 'moment'
configure({ enforceActions: 'observed' })

class HouseStore {
    @observable houses = []
    @observable cities = []
    @observable avarages = {}

    @computed get housesNr() {
        return this.houses.length
    }
    @computed get cityIndexZero() {
        if (this.cities.length < 1) return ''
        else return this.cities[0].location_city
    }
    @computed get getAllHousesNr() {
        let count = 0
        this.cities.map(el => (count += el.items))
        return count
    }
    @action async getData() {
        try {
            const results = await this.loadData()
            runInAction(() => {
                this.houses.replace(results)
            })
        } catch (err) {
            console.log(err)
        }
    }

    @action async getStatusAvarage(city) {
        try {
            const results = await this.cityStatus(city)
            runInAction(() => {
                this.currentCityAvg = this.averageGenerator(results).city
                this.avarages = this.averageGenerator(results)
            })
        } catch (err) {
            console.log(err)
        }
    }

    @action async getDataOfOneCity(city) {
        try {
            const results = await this.loadDataOfOneCity(city)
            runInAction(() => {
                this.houses.replace(results)
            })
        } catch (err) {
            console.log(err)
        }
    }

    @action async allCities() {
        try {
            const results = await this.loadAllCities()
            runInAction(() => {
                this.cities.replace(results)
            })
        } catch (err) {
            console.log(err)
        }
    }

    loadData() {
        return fetch('/list')
            .then(res => res.json())
            .catch(error => console.log(error))
    }
    loadDataOfOneCity(city) {
        return (
            fetch(`/list/searchCity?city=${city}`)
                // `/list/searchCity?city=${city}&limit=${this.limit}`
                .then(res => res.json())
                .catch(error => console.log(error))
        )
    }

    loadAllCities() {
        return fetch(`/cities`)
            .then(res => res.json())
            .catch(error => console.log(error))
    }
    cityStatus(city) {
        return fetch(`/status?city=${city}`)
            .then(res => res.json())
            .catch(error => console.log(error))
    }

    //* *******************************************/

    averageGenerator = sourceData => {
        const avgObj = {
            city: sourceData[0].city,
            days: [],
            avgM2: [],
            avgHouse: []
        }
        const avgArr = []
        const perM2 = sourceData.map(el => {
            const xx = new Date(el.market_date)
            const date = moment(xx).format('YYYY-MM-DD')
            let avg = el.total_price / el.total_m2
            avg = avg.toFixed(2)
            avg = Number(avg)
            return { date, avg }
        })
        avgArr.push(perM2)

        const perHouse = sourceData.map(el => {
            const xx = new Date(el.market_date)
            const date = moment(xx).format('YYYY-MM-DD')
            let avg = el.total_price / el.total_count
            avg = avg.toFixed(2)
            avg = Number(avg)
            return { date, avg }
        })
        avgArr.push(perHouse)

        const now = new Date()

        let dateFrom = moment(now)
            .subtract(19, 'd')
            .format('YYYY-MM-DD')

        const days = []
        while (moment(dateFrom).isBefore(now)) {
            days.push(dateFrom)
            dateFrom = moment(dateFrom)
                .add(1, 'days')
                .format('YYYY-MM-DD')
        }
        avgObj.days = days
        const valuesAvgM2 = []
        const valuesAvgHouse = []
        avgArr.forEach((avgArray, index) => {
            let lastAvg = null
            let currentIndex = 0

            const min = days[0]
            const max = days[days.length - 1]
            for (
                let day = min;
                day <= max;
                day = moment(day)
                    .add(1, 'days')
                    .format('YYYY-MM-DD')
            ) {
                if (day >= avgArray[currentIndex].date) {
                    lastAvg = avgArray[currentIndex].avg
                    if (currentIndex < avgArray.length - 1) currentIndex++
                }
                index === 0 ? valuesAvgM2.push(lastAvg) : valuesAvgHouse.push(lastAvg)
            }
        })

        avgObj.avgM2 = valuesAvgM2
        avgObj.avgHouse = valuesAvgHouse
        return avgObj
    }

}

const store = new HouseStore()
export default store