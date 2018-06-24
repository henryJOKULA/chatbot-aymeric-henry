/* @flow */
const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;
const weatherApiKey = 'HM9jRJ4iWcX4ihqcrpCRWnrHA9ppYD9o';

app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log('see');
  const city = req.body.queryResult.parameters.city;
  axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${weatherApiKey}&q=${city}`)
    .then((response) => {
      axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${response.data[0].Key}?apikey=${weatherApiKey}`)
        .then((weather) => {
          res.json({
            speech: `In ${city}, ${weather.data.Headline.Text}`,
            displayText: `In ${city}, ${weather.data.Headline.Text}`,
            source: 'esf',
          });
        })
        .catch(() => {
          res.json({
            speech: 'Sorry I didn\'t understand your request',
            displayText: 'Sorry I didn\'t understand your request',
            source: 'esf',
          });
        });
    })
    .catch((error) => {
      res.json({
        speech: `Sorry I didn't understand your request ${error}`,
        displayText: `Sorry I didn't understand your request ${error}`,
        source: 'esf',
      });
    });
});

app.listen(port, hostname, () => {
  console.log('/*                                               */');
  console.log('/*                                               */');
  console.log(`/* Server running at http://${hostname}:${port}/ */`);
  console.log('/*                                               */');
  console.log('/*                                               */');
});
