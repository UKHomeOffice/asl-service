const express = require('express');
const profile = require('../../../lib/auth/profile');
const moment = require('moment');

const server = () => {
  const app = express();
  app.use('/me', (req, res) => {
    return res.json({data: {}});
  });
  return new Promise((resolve, reject) => {
    const _server = app.listen(err => {
      return err ? reject(err) : resolve({
        url: `http://127.0.0.1:${_server.address().port}`,
        close: () => _server.close()
      });
    });
  });
};

describe('cache profile loading in service/auth', () => {

  const RealDate = Date;

  function mockDate (isoDate) {
    global.Date = class extends RealDate {
      constructor () {
        super();
        return new RealDate(isoDate);
      }
    };
  }

  let service;

  beforeAll(async () => {
    service = await server(['allowed']);
  });

  afterAll(async () => {
    await service.close();
  });

  afterEach(async () => {
    global.Date = RealDate;
  });

  it('should set valid profile in session', () => {
    mockDate(new Date());
    return expect(profile(service.url)('token', {}))
      .resolves.toHaveProperty('expiresAt',
        moment.utc(moment(new Date()).add(600, 'seconds')).valueOf());
  });

  it('should renew expired profile in session', () => {
    mockDate(new Date());
    return expect(profile(service.url)('token', {profile: {
      expiresAt: moment.utc(moment(new Date()).subtract(600, 'seconds')).valueOf()
    }}))
      .resolves.toHaveProperty('expiresAt',
        moment.utc(moment(new Date()).add(600, 'seconds')).valueOf());
  });

});
