const express = require('express');
const moment = require('moment');
const sinon = require('sinon');
const profile = require('../../../lib/auth/profile');

const server = () => {
  const app = express();
  const stub = sinon.stub().yields(null, null);
  app.use('/me', stub, (req, res) => {
    return res.json({
      data: {
        firstName: 'First',
        lastName: 'Last'
      },
      meta: {}
    });
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
  let service;

  beforeEach(async () => {
    service = await server(['allowed']);
  });

  afterEach(async () => {
    await service.close();
  });

  it('should call profile api and store result in session', () => {
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
    const session = {
      profile: {
        firstName: 'Someone',
        lastName: 'Else',
        userId: 'abc123',
        expiresAt: moment.utc(moment().add(60, 'seconds')).valueOf()
      }
    };

    return profile(service.url)({ token: 'token', id: 'abc123' }, session)
      .then(() => {
        expect(service.stub.callCount).toEqual(0);
        expect(session).toHaveProperty('profile');
        expect(session.profile.firstName).toEqual('Someone');
        expect(session.profile.lastName).toEqual('Else');
      });
  });

  it('should call profile api if a stale profile exists in the session', () => {
    const session = {
      profile: {
        firstName: 'Someone',
        lastName: 'Else',
        userId: 'abc123',
        expiresAt: moment.utc(moment().subtract(660, 'seconds')).valueOf()
      }
    };

    return profile(service.url)({ token: 'token', id: 'abc123' }, session)
      .then(() => {
        expect(service.stub.callCount).toEqual(1);
        expect(session).toHaveProperty('profile');
        expect(session.profile.firstName).toEqual('First');
        expect(session.profile.lastName).toEqual('Last');
      });
  });

  it('should call profile api if session profile user id does not match logged in user', () => {
    const session = {
      profile: {
        firstName: 'Someone',
        lastName: 'Else',
        userId: 'abc123',
        expiresAt: moment.utc(moment().add(60, 'seconds')).valueOf()
      }
    };

    return profile(service.url)({ token: 'token', id: 'def456' }, session)
      .then(() => {
        expect(service.stub.callCount).toEqual(1);
        expect(session).toHaveProperty('profile');
        expect(session.profile.firstName).toEqual('First');
        expect(session.profile.lastName).toEqual('Last');
      });
  });

});
