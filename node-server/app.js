const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

const API_KEY = "9a48117cfc644429b6f170533232102 ";
const URL = "http://api.weatherapi.com/v1/";

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/getWeatherInfo/city/', async (req, resp) => {
    const city = req.query.city;
    let result;
    try {
        result = await axios.get(URL + "forecast.json?q=" + city + "&key=" + API_KEY + "&days=14" + "&units=metric");
        resp.json(result.data);
    } catch (err) {
        console.error(`failed all api due to ${err.message}`);
    }
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
})