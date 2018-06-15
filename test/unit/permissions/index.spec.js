const express = require('express');
const can = require('../../../lib/auth/can');

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
      return expect(perms('token', 'task')).rejects.toMatchObject({ status: 403 });
    });

  });

  describe('with an endpoint configured', () => {

    let service;

    beforeAll(async () => {
      service = await server(['allowed']);
    });

    afterAll(async () => {
      await service.close();
    });

    it('resolves allowed tasks', () => {
      const perms = can(service.url);
      return expect(perms('token', 'allowed')).resolves.toMatchObject({});
    });

    it('rejects not-allowed tasks', () => {
      const perms = can(service.url);
      return expect(perms('token', 'not-allowed')).rejects.toMatchObject({ status: 403 });
    });

  });

});
