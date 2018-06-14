module.exports = (req, model) =>
  req.api(`/establishment/${req.establishment}/${model}/${req.form.id}`)
    .then(({ json: { data } }) => Promise.resolve(data))
    .catch(err => Promise.reject(err));
