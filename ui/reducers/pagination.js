const INITIAL_STATE = {
  page: 0,
  totalPages: 0,
  count: 0,
  totalCount: 0,
  limit: 10,
  offset: 0
};

const paginate = ({ page, count, limit, totalCount }) => ({
  page,
  count,
  limit,
  totalCount,
  offset: page * limit,
  totalPages: Math.ceil(count / limit)
});

const pagination = (state = INITIAL_STATE, action) => {
  if (!state.hydrated) {
    state = { ...INITIAL_STATE, ...state, hydrated: true };
  }
  switch (action.type) {
    case 'SET_FILTER':
    case 'SET_FILTERS':
      return paginate({ ...state, page: INITIAL_STATE.page });
    case 'SET_PAGE':
      return paginate({ ...state, page: action.page });
    case 'RECEIVE_ITEMS':
      return paginate({ ...state, count: action.count, totalCount: action.totalCount });
    case 'SET_LIMIT':
      return paginate({ ...state, limit: action.limit });
  }
  return { ...state, ...paginate(state) };
};

module.exports = pagination;
