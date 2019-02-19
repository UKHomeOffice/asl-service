const express = require('express');
const can = require('../../../lib/auth/can');
const assert = require('assert');

const server = tasks => {
  const app = express();
  app.use('/:task', (req, res) => {
    if (tasks.includes(req.params.task)) {
      return res.json({});
    }
    res.status(403).json({});
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

describe('can', () => {

  describe('without an endpoint configured', () => {

    it('rejects all inputs with a 403', () => {
      const perms = can();
      return Promise.resolve()
        .then(() => perms('token', 'task'))
        .catch(response => {
          assert.deepEqual(response, { status: 403 });
        });
    });

  });

  describe('with an endpoint configured', () => {

    let service;

    before(async () => {
      service = await server(['allowed']);
    });

    after(async () => {
      await service.close();
    });

    it('resolves allowed tasks', () => {
      const perms = can(service.url);
      return Promise.resolve()
        .then(() => perms('token', 'allowed'))
        .then(response => {
          assert.deepEqual(response.status, 200);
        });
    });

    it('rejects not-allowed tasks', () => {
      const perms = can(service.url);
      return Promise.resolve()
        .then(() => perms('token', 'not-allowed'))
        .catch(response => {
          assert.deepEqual(response, { status: 403 });
        });
    });

  });

});
