const chai = require('chai');
const chaiHttp = require('chai-http');
const api = require('../lib/index.js');

const should = chai.should();

chai.use(chaiHttp);

describe('online', () => {
  it('should GET a response from the server', (done) => {
    chai.request(api).get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});


describe('weather', () => {
  it('should give the weather', (done) => {
    // Post Paris
    chai.request(api).post('/')
      .send({ queryResult: { parameters: { city: 'Paris' }, intent: { name: 'projects/test-59bdc/agent/intents/bcc44b32-fe75-4c27-ad63-06b8690e582b' } } })
      .end((err, res) => {
        res.body.fulfillmentText.should.include('In Paris');
        done();
      });
  });
  it('should ask to repeat', (done) => {
    chai.request(api).post('/')
      .send({ queryResult: { parameters: { city: '' }, intent: { name: 'projects/test-59bdc/agent/intents/bcc44b32-fe75-4c27-ad63-06b8690e582b' } } })
      .end((err, res) => {
        res.body.fulfillmentText.should.equal('Sorry i didn\'t understand');
        done();
      });
  });
});
