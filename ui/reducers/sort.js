const INITIAL_STATE = {
  column: '',
  ascending: true
};

const sortReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_SORT':
      return action.sort;
  }
  return state;
};

module.exports = sortReducer;
