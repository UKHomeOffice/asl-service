module.exports = req =>
  req.api(`/establishments/${req.establishment}/roles`, { query: { type: 'nacwo' } })
    .then(({ json: { data } }) => Promise.resolve(data))
    .catch(err => Promise.reject(err));
