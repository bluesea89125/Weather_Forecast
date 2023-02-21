const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

const API_KEY = "d37f78971b1063ccf34a287df290899e";

const URL = "https://api.openweathermap.org/data/2.5/";

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/getWeatherInfo/today/', async (req, resp) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    let result;
    try {
        result = await axios.get(URL + "weather?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric");
        resp.json(result.data);
    } catch (err) {
        console.error(`failed all api due to ${err.message}`);
    }
});

app.get('/getWeatherInfo/forecast/', async (req, resp) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    let result;
    try {
        result = await axios.get(URL + "forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric");
        resp.json(result.data);
    } catch (err) {
        console.error(`failed all api due to ${err.message}`);
    }
});

app.get('/getWeatherInfo/city/', async (req, resp) => {
    const city = req.query.city;
    let result;
    try {
        result = await axios.get(URL + "weather?q=" + city + "&appid=" + API_KEY + "&units=metric");
        resp.json(result.data);
    } catch (err) {
        console.error(`failed city api due to ${err.message}`);
    }
    
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
})