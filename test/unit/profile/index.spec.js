const express = require('express');
const moment = require('moment');
const sinon = require('sinon');
const profile = require('../../../lib/auth/profile');

const server = () => {
  const app = express();
  const stub = sinon.stub().yields(null, null);
  app.use('/me', stub, (req, res) => {
    return res.json({data: {
      firstName: 'First',
      lastName: 'Last'
    }});
  });
  return new Promise((resolve, reject) => {
    const _server = app.listen(err => {
      return err ? reject(err) : resolve({
        stub,
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
    service.stub.reset();
    global.Date = RealDate;
  });

  it('should call profile api and store result in session', () => {
    mockDate(new Date());
    const session = {};
    return profile(service.url)('token', session)
      .then(() => {
        expect(service.stub.callCount).toEqual(1);
        expect(session).toHaveProperty('profile');
        expect(session.profile.firstName).toEqual('First');
        expect(session.profile.lastName).toEqual('Last');
      });
  });

  it('should not call profile api if a profile exists in the session', () => {
    mockDate(new Date());
    const session = {
      profile: {
        firstName: 'Someone',
        lastName: 'Else',
        expiresAt: moment.utc(moment(new Date())).valueOf()
      }
    };
    return profile(service.url)('token', session)
      .then(() => {
        expect(service.stub.callCount).toEqual(0);
        expect(session).toHaveProperty('profile');
        expect(session.profile.firstName).toEqual('Someone');
        expect(session.profile.lastName).toEqual('Else');
      });
  });

  it('should call profile api if a stale profile exists in the session', () => {
    mockDate(new Date());
    const session = {
      profile: {
        firstName: 'Someone',
        lastName: 'Else',
        expiresAt: moment.utc(moment(new Date()).subtract(2, 'hours')).valueOf()
      }
    };

    return profile(service.url)('token', session)
      .then(() => {
        expect(service.stub.callCount).toEqual(1);
        expect(session).toHaveProperty('profile');
        expect(session.profile.firstName).toEqual('First');
        expect(session.profile.lastName).toEqual('Last');
      });
  });

});
