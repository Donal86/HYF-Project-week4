'use strict'
const db = require('./db-config')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/list', async (req, res) => {
    const promise = new Promise((resolve, reject) => {
        const query = 'SELECT * FROM property'
        db.query(query, (err, results, fields) => {
            if (!err) resolve(results)
            else reject(err)
        })
    })
    try {
        const data = await promise
        if (data.length < 1) {
            return res.status(301).json({
                message: 'houses data is empty'
            })
        } else res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error: error })
    }
})

app.get('/status', async (req, res) => {
    const promise = new Promise((resolve, reject) => {
        const query = 'SELECT * FROM city_status WHERE city=?'
        const { city } = req.query
        db.query(query, [city], (err, results, fields) => {
            if (!err) resolve(results)
            else reject(err)
        })
    })
    try {
        const data = await promise
        if (data.length < 1) {
            return res.status(301).json({
                message: 'houses data is empty'
            })
        } else res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error: error })
    }
})

app.get('/cities', async (req, res) => {
    const promise = new Promise((resolve, reject) => {
        const query =
            'SELECT location_city, COUNT(location_city) AS items FROM property GROUP BY location_city'
        db.query(query, (err, results, fields) => {
            if (!err) resolve(results)
            else reject(err)
        })
    })
    try {
        const data = await promise
        if (data.length < 1) {
            return res.status(301).json({
                message: 'houses data is empty'
            })
        } else res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error: error })
    }
})

app.get('/list/searchCity', async (req, res) => {
    const promise = new Promise((resolve, reject) => {
        const { city, limit } = req.query
        const query = 'SELECT * FROM property WHERE location_city=? limit ?'

        db.query(query, [city, Number(limit)], (err, results, fields) => {
            if (!err) resolve(results)
            else reject(err)
        })
    })
    try {
        const data = await promise
        if (data.length < 1) {
            return res.status(301).json({
                message: 'houses data is empty'
            })
        } else res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error: error })
    }
})

app.listen('8080', () => {
    console.log('listening on port 8080')
})