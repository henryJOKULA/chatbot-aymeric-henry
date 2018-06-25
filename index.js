/* @flow */
const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;
const weatherApiKey = 'gIEGRkXIwctvG6vAZeuinDIi9JHz9w4w';

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('app online');
});


/* return the weather prediction for a city */
/* params : cityParam: string               */
function weather(cityParams): Promise<Object> {
  const city:string = String(cityParams);
  return new Promise((resolve, reject) => {
    // first call to get the city id
    axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${weatherApiKey}&q=${city}`)
      .then((response) => {
        // second call to get the weather prediction
        axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${response.data[0].Key}?apikey=${weatherApiKey}`)
          .then((prediction) => {
            resolve({
              fulfillmentText: `In ${city}, ${prediction.data.Headline.Text}`,
              fulfillmentMessages: [
                {
                  text: {
                    text: [
                      `In ${city}, ${prediction.data.Headline.Text}`,
                    ],
                  },
                }],
            });
          })
          .catch(() => {
            reject(new Error('Api call failed'));
          });
      })
      .catch(() => {
        reject(new Error('Api call failed'));
      });
  });
}

app.post('/', (req, res) => {
  if (req.body.queryResult.intent.name === 'projects/test-59bdc/agent/intents/bcc44b32-fe75-4c27-ad63-06b8690e582b') {
    weather(req.body.queryResult.parameters.city).then((data) => {
      res.json(data);
    }).catch(() => {
      res.json({
        fulfillmentText: 'Sorry i didn\'t understand',
        fulfillmentMessages: [
          {
            text: {
              text: [
                "Sorry i didn't understand",
              ],
            },
          }],
      });
    });
  } else {
    res.status(400).send('Wrong post request');
  }
});

app.listen(PORT);
module.exports = app;
