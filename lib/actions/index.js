const setEstablishment = establishment => ({
  type: 'SET_ESTABLISHMENT',
  establishment
});

const setData = data => ({
  type: 'SET_DATA',
  data
});

const setSchema = schema => ({
  type: 'SET_SCHEMA',
  schema
});

const setSortColumn = column => ({
  type: 'SET_SORT_COLUMN',
  column
});

const setSort = sort => ({
  type: 'SET_SORT',
  sort
});

const setDefaultSort = sort => ({
  type: 'SET_DEFAULT_SORT',
  sort
});

const setUrl = url => ({
  type: 'SET_URL',
  url
});

const setItem = item => ({
  type: 'SET_ITEM',
  item
});

const setFilters = filters => ({
  type: 'SET_FILTERS',
  filters
});

const setFilter = (key, value) => ({
  type: 'SET_FILTER',
  key,
  value
});

const setContent = content => ({
  type: 'SET_CONTENT',
  content
});

const setField = (key, value) => ({
  type: 'SET_FIELD',
  key,
  value
});

const setDiff = diff => ({
  type: 'SET_DIFF',
  diff
});

const setErrors = errors => ({
  type: 'SET_ERRORS',
  errors
});

module.exports = {
  setData,
  setSchema,
  setEstablishment,
  setUrl,
  setItem,
  setSortColumn,
  setSort,
  setDefaultSort,
  setFilters,
  setFilter,
  setContent,
  setField,
  setDiff,
  setErrors
};
